import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const { chromium } = await import(pathToFileURL(process.argv[2]).href);
const browser = await chromium.launch({ headless: true, channel: process.argv[4] || 'msedge' });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
await context.addInitScript(() => {
  const NativeAudioContext = window.AudioContext;
  window.audioStats = { active: 0, maximum: 0, created: 0 };
  window.AudioContext = class extends NativeAudioContext {
    constructor() { super(); window.audioStats.active++; window.audioStats.created++; window.audioStats.maximum = Math.max(window.audioStats.maximum, window.audioStats.active); }
    async close() { await super.close(); window.audioStats.active--; }
  };
});
const page = await context.newPage();
const errors = [];
const audioRequests = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('request', request => { if (/\.(mp3|wav|ogg|m4a)(\?|$)/i.test(request.url())) audioRequests.push(request.url()); });
await mkdir('docs/screenshots', { recursive: true });

try {
  await page.goto(process.argv[3]);
  await page.locator('.soundscape').first().waitFor();
  assert.equal(await page.locator('.soundscape').count(), 4);
  assert.equal(await page.evaluate(() => window.audioStats.created), 0);
  assert.equal(await page.locator('.soundscape[aria-pressed=true]').count(), 0);

  await page.locator('[data-sound=ferry]').click();
  await page.waitForFunction(() => document.querySelector('[data-sound=ferry]').getAttribute('aria-pressed') === 'true');
  const stopStart = Date.now();
  await page.locator('[data-sound=ferry]').click();
  await page.waitForFunction(() => window.audioStats.active === 0);
  assert.ok(Date.now() - stopStart >= 1000, '停止声音必须淡出至少一秒');
  await page.locator('[data-sound=breakfast]').click();
  await page.waitForFunction(() => document.querySelector('[data-sound=breakfast]').getAttribute('aria-pressed') === 'true');
  await page.locator('[data-sound=teahouse]').click();
  await page.locator('[data-sound=courtyard]').click();
  await page.waitForFunction(() => document.querySelector('[data-sound=courtyard]').getAttribute('aria-pressed') === 'true');
  assert.equal(await page.locator('.soundscape[aria-pressed=true]').count(), 1);
  assert.equal(await page.evaluate(() => window.audioStats.maximum), 1);
  await page.locator('#ambient-stop').click();
  await page.waitForFunction(() => window.audioStats.active === 0);

  await page.locator('#worry-form button[type=submit]').click();
  assert.equal(await page.locator('#worry-history li').count(), 0);
  await page.locator('.worry-chip').first().click();
  await page.locator('#worry-form button[type=submit]').click();
  assert.equal(await page.locator('#worry-history li').count(), 1);
  await page.locator('#worries').screenshot({ path: 'docs/screenshots/worries.png' });
  for (let index = 0; index < 6; index++) {
    await page.locator('#worry-input').fill(`临时的烦恼${index}`);
    await page.locator('#worry-form button[type=submit]').click();
  }
  assert.equal(await page.locator('#worry-history li').count(), 5);
  await page.locator('#worry-input').fill('<img src=x onerror=alert(1)>');
  await page.locator('#worry-form button[type=submit]').click();
  assert.equal(await page.locator('#worry-history img').count(), 0);
  assert.match(await page.locator('#worry-history li').first().innerText(), /<img/);
  assert.ok(await page.locator('#fish-button').evaluate(element => element.classList.contains('is-golden')));
  await page.locator('#fish-button').click();
  assert.equal(await page.locator('#excuse-dialog').evaluate(element => element.open), true);
  await page.locator('#excuse-image').evaluate(image => image.decode());
  assert.ok(await page.locator('#excuse-image').evaluate(image => image.naturalWidth > 0));
  assert.ok(await page.locator('#excuse-place').innerText());
  await page.locator('#excuse-dialog').screenshot({ path: 'docs/screenshots/landmark-excuse.png' });
  await page.keyboard.press('Escape');

  await page.locator('#note-form button[type=submit]').click();
  assert.equal(await page.locator('#receipt-preview').isVisible(), false);
  const noteText = '把这个下午留给江风。船慢慢走，我也慢慢来。';
  await page.locator('#note-input').fill(noteText);
  await page.locator('#note-form button[type=submit]').click();
  const before = await page.locator('#receipt-preview').innerText();
  await page.reload();
  assert.equal(await page.locator('#receipt-preview').innerText(), before);
  assert.equal(await page.locator('#note-input').inputValue(), noteText);
  await page.locator('#notes').screenshot({ path: 'docs/screenshots/notes.png' });
  await page.locator('#note-input').fill('尚未保存的修改');
  assert.equal(await page.locator('#receipt-text').innerText(), noteText);
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#receipt-export').click();
  const download = await downloadPromise;
  await download.saveAs('docs/screenshots/receipt.png');
  const png = await readFile('docs/screenshots/receipt.png');
  assert.equal(png.readUInt32BE(16), 1080);
  assert.equal(png.readUInt32BE(20), 1350);
  assert.ok(png.length > 10000);
  await page.locator('#note-input').fill('字'.repeat(120));
  await page.locator('#note-form button[type=submit]').click();
  assert.equal((await page.locator('#receipt-text').innerText()).length, 120);
  await page.evaluate(() => {
    window.receiptTextCalls = [];
    const nativeFillText = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function(text, x, y) {
      if (/^字+$/.test(text)) window.receiptTextCalls.push({ y });
      return nativeFillText.call(this, text, x, y);
    };
  });
  const longDownloadPromise = page.waitForEvent('download');
  await page.locator('#receipt-export').click();
  await (await longDownloadPromise).saveAs('docs/screenshots/receipt-long.png');
  const bodyCoordinates = await page.evaluate(() => window.receiptTextCalls.map(call => call.y));
  assert.ok(bodyCoordinates.length > 1);
  assert.ok(bodyCoordinates.every(y => y >= 350 && y <= 930), '长正文必须位于标题与页脚之间');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `新章节横向溢出 ${width}`);
  }
  await page.locator('#note-input').fill(noteText);
  await page.locator('#note-form button[type=submit]').click();
  await page.reload();
  await page.locator('.worry-chip').first().click();
  await page.locator('#worry-form button[type=submit]').click();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: 'docs/screenshots/complete.png', fullPage: true });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('#worry-input').fill('不用赶了');
  await page.locator('#worry-form button[type=submit]').click();
  assert.equal(await page.locator('.paper-tear').evaluate(element => getComputedStyle(element).animationName), 'none');
  assert.equal(await page.evaluate(() => window.audioStats.active), 0);
  assert.deepEqual(audioRequests, []);
  assert.deepEqual(errors, []);
  const restricted = await context.newPage();
  await restricted.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get: () => { throw new Error('storage disabled'); } });
  });
  await restricted.goto(process.argv[3]);
  await restricted.locator('#note-input').fill('这一张先留在这里');
  await restricted.locator('#note-form button[type=submit]').click();
  assert.equal(await restricted.locator('#receipt-text').innerText(), '这一张先留在这里');
  assert.match(await restricted.locator('#notice').innerText(), /暂不可用/);
  await restricted.close();
  console.log('新增章节验收通过：底噪默认关闭、四场景与快速切换不叠播、1.2秒淡出、撕纸最近五条、文本安全、金色借口、存根恢复、PNG导出与响应式。');
} finally {
  await browser.close();
}
