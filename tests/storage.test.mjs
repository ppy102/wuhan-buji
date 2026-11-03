import test from 'node:test';
import assert from 'node:assert/strict';
import { readState, writeState } from '../src/storage.js';
import { STORAGE_KEY, restoreState } from '../src/state.js';

test('有效本地记录通过版本化键名读写', () => {
  const entries = new Map();
  const storage = { getItem: key => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value) };
  const state = restoreState({ popped: ['river'], saved: ['river'] });
  assert.equal(writeState(storage, state), null);
  assert.ok(entries.has(STORAGE_KEY));
  assert.deepEqual(readState(storage), { state, error: null });
});
test('JSON 损坏时返回初始状态并保留故障供页面提示', () => {
  const result = readState({ getItem: () => '{broken' });
  assert.deepEqual(result.state, restoreState(null));
  assert.ok(result.error instanceof SyntaxError);
});
test('浏览器禁止读取时页面仍可初始化', () => {
  const error = new Error('access denied');
  const result = readState({ getItem: () => { throw error; } });
  assert.equal(result.error, error);
  assert.deepEqual(result.state, restoreState(null));
});
test('浏览器空间不足时写入失败会明确返回', () => {
  const error = new Error('quota exceeded');
  assert.equal(writeState({ setItem: () => { throw error; } }, restoreState(null)), error);
});
