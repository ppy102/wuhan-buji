import test from 'node:test';
import assert from 'node:assert/strict';
import { createNote, restoreNote, tearWorry, MAX_NOTE_LENGTH } from '../src/journal-state.js';

test('撕掉烦恼时返回安慰并只保留最近五条', () => {
  let entries = [];
  for (let index = 0; index < 7; index++) entries = tearWorry({ text: `烦恼${index}`, entries, random: 0 }).entries;
  assert.equal(entries.length, 5);
  assert.equal(entries[0].text, '烦恼6');
  assert.equal(entries[4].text, '烦恼2');
  assert.ok(entries[0].reply.includes('武汉'));
});
test('空白烦恼不会改变最近列表', () => {
  const entries = [];
  assert.deepEqual(tearWorry({ text: '  \n ', entries, random: 0 }), { entries, accepted: false });
});
test('超长烦恼受长度限制且随机边界可选到最后回复', () => {
  const result = tearWorry({ text: '烦'.repeat(100), entries: [], random: 1 });
  assert.equal(result.entries[0].text.length, 80);
  assert.ok(result.entries[0].reply);
});
test('保存便签时固定文字日期和底噪标签', () => {
  const note = createNote({ text: '  留一个下午给自己  ', date: '2026-11-02', random: 0 });
  assert.deepEqual(note, { version: 1, text: '留一个下午给自己', date: '2026-11-02', tag: 'ferry' });
  assert.deepEqual(restoreNote(JSON.parse(JSON.stringify(note))), note);
});
test('空白便签不生成存根且长文本被限制', () => {
  assert.equal(createNote({ text: ' ', date: '2026-11-02', random: 0 }), null);
  assert.equal(createNote({ text: '字'.repeat(200), date: '2026-11-02', random: 1 }).text.length, MAX_NOTE_LENGTH);
});
test('损坏或未知版本便签不能恢复', () => {
  for (const value of [null, {}, { version: 2 }, { version: 1, text: 'x', date: 'wrong', tag: 'ferry' }, { version: 1, text: 'x', date: '2026-02-30', tag: 'ferry' }, { version: 1, text: 'x', date: '2026-11-02', tag: 'unknown' }]) assert.equal(restoreNote(value), null);
});
