import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { SCENES } from '../src/state.js';
import { getLandmark } from '../src/landmarks.js';

// 浏览器运行器从命令行指定，避免把本机环境路径写入项目依赖。
const { chromium } = await import(pathToFileURL(process.argv[2]).href);
const baseUrl = process.argv[3];
const browser = await chromium.launch({ headless: true, channel: process.argv[4] || 'msedge' });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('requestfailed', request => errors.push(request.url()));
await mkdir('docs/screenshots', { recursive: true });

try {
  await page.goto(baseUrl);
  await page.waitForSelector('.bubble');
  assert.equal(await page.locator('.bubble').count(), 16);
  assert.equal(await page.locator('.landmark-icon').count(), 16);
  assert.equal(await page.locator('#sound-toggle').getAttribute('aria-pressed'), 'false');
  assert.ok(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)));
  assert.equal(await page.locator('#fish-image').evaluate(image => image.naturalWidth / image.naturalHeight), 2);
  assert.match(await page.locator('#fish-image').getAttribute('src'), /fish_whale\.svg$/);
  assert.equal(await page.locator('#fish-button').evaluate(element => getComputedStyle(element).borderRadius), '0px');
  await page.locator('.fish-companion').screenshot({ path: 'docs/screenshots/companion.png' });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: 'docs/screenshots/desktop.png', fullPage: true });
  await page.locator('#bubble-grid').screenshot({ path: 'docs/screenshots/places-desktop.png' });

  await page.locator('[data-scene="river"]').click();
  assert.equal(await page.locator('#scene-title').innerText(), '等一艘船');
  assert.equal(await page.locator('#scene-place').innerText(), '江汉关');
  assert.equal(await page.locator('#scene-artwork').isVisible(), true);
  assert.equal(await page.locator('.scene-icon').isVisible(), false);
  await page.locator('#scene-image').evaluate(image => image.decode());
  assert.ok(await page.locator('#scene-image').evaluate(image => image.naturalWidth > 0));
  await page.locator('#scene-dialog').screenshot({ path: 'docs/screenshots/landmark-desktop.png' });
  await page.locator('#scene-save').click();
  assert.equal(await page.locator('#saved-count').innerText(), '1');
  await page.reload();
  assert.equal(await page.locator('#saved-count').innerText(), '1');
  assert.ok(await page.locator('[data-scene="river"]').evaluate(element => element.classList.contains('is-popped')));
  await page.locator('#pocket-open').click();
  assert.equal(await page.locator('.saved-scene h3').innerText(), '等一艘船');
  await page.locator('.saved-scene button').click();
  assert.equal(await page.locator('.saved-scene').count(), 0);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#pocket-open').evaluate(element => element === document.activeElement), true);

  await page.locator('[data-scene="tea"]').click();
  assert.equal(await page.locator('#scene-place').innerText(), '长堤街');
  assert.equal(await page.locator('#scene-artwork').isVisible(), true);
  assert.equal(await page.locator('.scene-icon').isVisible(), false);
  await page.locator('#scene-dialog').getByRole('button', { name: '算了，下次', exact: true }).click();
  assert.equal(await page.locator('#scene-dialog').evaluate(element => element.open), false);
  assert.equal(await page.locator('[data-scene="tea"]').evaluate(element => element === document.activeElement), true);
  await page.locator('#fish-button').click();
  assert.equal(await page.locator('#fish-image').getAttribute('data-state'), 'resting');
  assert.match(await page.locator('#fish-image').getAttribute('alt'), /闭眼/);
  await page.locator('.fish-companion').screenshot({ path: 'docs/screenshots/companion-resting.png' });
  await page.locator('#fish-button').click();
  assert.equal(await page.locator('#fish-image').getAttribute('data-state'), 'idle');

  // 通过真实音频节点确认合成与释放，不依赖音频文件。
  await page.evaluate(() => {
    const NativeAudioContext = window.AudioContext;
    window.audioCounts = { created: 0, closed: 0 };
    window.AudioContext = class extends NativeAudioContext {
      constructor() { super(); window.audioCounts.created++; }
      async close() { await super.close(); window.audioCounts.closed++; }
    };
  });
  await page.locator('#sound-toggle').click();
  await page.locator('[data-scene="tree"]').click();
  await page.waitForFunction(() => window.audioCounts.closed === 1);
  assert.deepEqual(await page.evaluate(() => window.audioCounts), { created: 1, closed: 1 });
  await page.screenshot({ path: 'docs/screenshots/scene.png', fullPage: false });
  await page.keyboard.press('Escape');

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `横向溢出 ${width}px`);
  }
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(baseUrl);
  await mobilePage.locator('.bubble').first().waitFor();
  await mobilePage.screenshot({ path: 'docs/screenshots/mobile.png', fullPage: true });
  await mobilePage.locator('#bubble-grid').screenshot({ path: 'docs/screenshots/places-mobile.png' });
  await mobileContext.close();
  await page.setViewportSize({ width: 320, height: 740 });
  await page.locator('[data-scene="breakfast"]').click();
  assert.ok(await page.locator('#scene-dialog').evaluate(element => element.scrollWidth <= element.clientWidth));
  await page.keyboard.press('Escape');
  for (const scene of SCENES) {
    const { id } = scene;
    const name = getLandmark(scene.artwork).place;
    await page.locator(`[data-scene="${id}"]`).click();
    assert.equal(await page.locator('#scene-place').innerText(), name);
    assert.equal(await page.locator('#scene-location').innerText(), scene.location);
    assert.equal(await page.locator('#scene-image').getAttribute('src'), getLandmark(scene.artwork).image);
    await page.locator('#scene-image').evaluate(image => image.decode());
    assert.ok(await page.locator('#scene-dialog').evaluate(element => element.scrollWidth <= element.clientWidth));
    assert.ok(await page.locator('#scene-dialog .dialog-close').evaluate(element => {
      const bounds = element.getBoundingClientRect();
      return bounds.top >= 0 && bounds.right <= window.innerWidth;
    }));
    await page.locator('#scene-dialog').getByRole('button', { name: '算了，下次', exact: true }).scrollIntoViewIfNeeded();
    await page.keyboard.press('Escape');
  }
  await page.locator('[data-scene="river"]').click();
  await page.locator('#scene-dialog').screenshot({ path: 'docs/screenshots/landmark-mobile.png' });
  await page.keyboard.press('Escape');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
  assert.equal(await page.locator('.bubble').first().evaluate(element => getComputedStyle(element).animationName), 'none');
  assert.deepEqual(errors, []);

  const brokenPage = await context.newPage();
  await brokenPage.addInitScript(() => localStorage.setItem('wuhan-bu-ji-v1', '{broken'));
  await brokenPage.goto(baseUrl);
  await brokenPage.waitForSelector('#notice.is-visible');
  assert.equal(await brokenPage.locator('.bubble').count(), 16);
  await brokenPage.close();

  const blockedPage = await context.newPage();
  await blockedPage.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get: () => { throw new Error('blocked'); } });
  });
  await blockedPage.goto(baseUrl);
  await blockedPage.locator('[data-scene="river"]').click();
  await blockedPage.locator('#scene-save').click();
  assert.equal(await blockedPage.locator('#saved-count').innerText(), '1');
  assert.match(await blockedPage.locator('#notice').innerText(), /暂不可用/);
  await blockedPage.close();
  console.log('浏览器验收通过：素材、收藏往返、退出与焦点、音效释放、320/390/768/1440px、减少动画、存储损坏和禁用。');
} finally {
  await browser.close();
}

