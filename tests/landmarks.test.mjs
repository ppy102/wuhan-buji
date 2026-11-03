import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { LANDMARKS, getLandmark } from '../src/landmarks.js';
import { SCENES, restoreState } from '../src/state.js';

test('已关联场景返回完整本地插画与线稿且文件存在', async () => {
  assert.equal(Object.keys(LANDMARKS).length, 16);
  assert.equal(SCENES.filter(scene => scene.artwork).length, 16);
  for (const scene of SCENES.filter(scene => scene.artwork)) {
    const artwork = getLandmark(scene.artwork);
    assert.ok(artwork.place && artwork.alt && artwork.caption && scene.location);
    assert.match(scene.location, /^(汉口|武昌|汉阳) · /);
    for (const path of [artwork.line, artwork.image]) {
      const svg = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
      assert.match(svg, /<svg[^>]+viewBox=/);
      assert.doesNotMatch(svg, /<script|<image|https?:\/\/(?!www\.w3\.org)/);
    }
  }
});

test('未配图或未知地标返回空值以保留原图标', () => {
  for (const key of [undefined, null, '', 'unknown']) assert.equal(getLandmark(key), null);
});

test('原型属性不能被识别成地标且旧收藏不变', () => {
  for (const key of ['constructor', '__proto__', 'toString']) assert.equal(getLandmark(key), null);
  const oldState = { version: 1, popped: ['river', 'tea'], saved: ['river', 'tea'] };
  assert.deepEqual(restoreState(oldState), oldState);
});

test('十六个场景分别对应不同地点和不同素材', () => {
  assert.equal(new Set(SCENES.map(scene => scene.artwork)).size, 16);
  assert.equal(new Set(SCENES.map(scene => getLandmark(scene.artwork).place)).size, 16);
  assert.equal(new Set(Object.values(LANDMARKS).map(artwork => artwork.line)).size, 16);
  assert.equal(new Set(Object.values(LANDMARKS).map(artwork => artwork.image)).size, 16);
});
