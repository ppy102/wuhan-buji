import test from 'node:test';
import assert from 'node:assert/strict';
import { restoreState, updateState, SCENES } from '../src/state.js';

test('空存储时返回没有互动的初始状态', () => {
  assert.deepEqual(restoreState(null), { version: 1, popped: [], saved: [] });
});
test('恢复时过滤未知场景、重复记录和未戳破的收藏', () => {
  assert.deepEqual(restoreState({ popped: ['river', 'river', 'unknown'], saved: ['river', 'tea', 'unknown'] }),
    { version: 1, popped: ['river'], saved: ['river'] });
});
test('字段类型错误时恢复为空列表', () => {
  assert.deepEqual(restoreState({ popped: 'river', saved: {} }), restoreState(null));
});
test('依次戳破并收藏时能够通过 JSON 往返恢复', () => {
  const popped = updateState(restoreState(null), { type: 'pop', id: 'river' });
  const saved = updateState(popped, { type: 'save', id: 'river' });
  assert.deepEqual(restoreState(JSON.parse(JSON.stringify(saved))), saved);
  assert.deepEqual(saved.saved, ['river']);
});
test('重复点击同一场景时不会重复记录或收藏', () => {
  let state = restoreState(null);
  for (let index = 0; index < 3; index++) {
    state = updateState(state, { type: 'pop', id: 'tea' });
    state = updateState(state, { type: 'save', id: 'tea' });
  }
  assert.deepEqual(state, { version: 1, popped: ['tea'], saved: ['tea'] });
});
test('移出收藏时保留泡泡状态且不修改旧状态', () => {
  const original = restoreState({ popped: ['tree'], saved: ['tree'] });
  const next = updateState(original, { type: 'remove', id: 'tree' });
  assert.deepEqual(next, { version: 1, popped: ['tree'], saved: [] });
  assert.deepEqual(original.saved, ['tree']);
});
test('未知场景或动作不会改变当前状态', () => {
  const original = restoreState(null);
  assert.equal(updateState(original, { type: 'pop', id: 'unknown' }), original);
  assert.equal(updateState(original, { type: 'unknown', id: 'river' }), original);
});
test('十六个场景均具备唯一 ID 与完整卡片内容', () => {
  assert.equal(SCENES.length, 16);
  assert.equal(new Set(SCENES.map(scene => scene.id)).size, 16);
  for (const scene of SCENES) {
    for (const field of ['title', 'scene', 'when', 'nothingToDo', 'icon']) assert.ok(scene[field]);
  }
});
