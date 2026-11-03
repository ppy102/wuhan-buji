import { createNote, SOUNDSCAPES } from './journal-state.js';
import { readNote, writeNote } from './note-storage.js';
import { exportReceipt } from './receipt.js';

/** 预览与导出共享保存快照；例外：初始化闭包集中绑定表单生命周期，保持快照为私有状态。 */
export function initializeNotes(options) {
  const input = document.querySelector('#note-input');
  const preview = document.querySelector('#receipt-preview');
  const exportButton = document.querySelector('#receipt-export');
  const restored = readNote();
  let note = restored.note;

  /** 任何本地文字均通过 textContent 呈现，保持无公开留言的边界。 */
  function render() {
    preview.hidden = !note;
    exportButton.disabled = !note;
    if (!note) return;
    document.querySelector('#receipt-text').textContent = note.text;
    document.querySelector('#receipt-date').textContent = note.date;
    document.querySelector('#receipt-tag').textContent = SOUNDSCAPES.find(scene => scene.id === note.tag).title;
  }

  if (note) input.value = note.text;
  document.querySelector('#note-form').addEventListener('submit', event => {
    event.preventDefault();
    const nextNote = createNote({ text: input.value, date: new Intl.DateTimeFormat('sv-SE').format(new Date()), random: Math.random() });
    if (!nextNote) { options.showNotice('写一句话，再把这个下午收起来。'); input.focus(); return; }
    note = nextNote;
    const error = writeNote(note);
    render();
    if (error) options.reportError('storage', error);
    else options.showNotice('存好了。只留在你的浏览器里。');
  });
  exportButton.addEventListener('click', async () => {
    if (!note) return;
    try { await exportReceipt(note, SOUNDSCAPES.find(scene => scene.id === note.tag).title); }
    catch (error) { options.reportError('export', error); }
  });
  document.querySelector('#note-skip').addEventListener('click', () => { input.value = note?.text ?? ''; options.showNotice('不写也很好，空白也留给你。'); });
  render();
  if (restored.error) options.reportError('storage', restored.error);
}
