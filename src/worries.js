import { WORRY_PRESETS, tearWorry } from './journal-state.js';

/** 烦恼仅保留最近五条；例外：初始化闭包集中管理表单、动画与会话历史，避免共享可变状态。 */
export function initializeWorries(options) {
  const form = document.querySelector('#worry-form');
  const input = document.querySelector('#worry-input');
  const history = document.querySelector('#worry-history');
  const paper = document.querySelector('#worry-paper');
  let entries = [];
  const presets = document.querySelector('#worry-presets');
  presets.replaceChildren(...WORRY_PRESETS.map(text => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'worry-chip';
    button.textContent = text;
    button.addEventListener('click', () => { input.value = text; input.focus(); });
    return button;
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const result = tearWorry({ text: input.value, entries, random: Math.random() });
    if (!result.accepted) { options.showNotice('先写一点，或者选一张小纸条。'); input.focus(); return; }
    entries = result.entries;
    history.replaceChildren(...entries.map(entry => {
      const item = document.createElement('li');
      const text = document.createElement('span');
      const reply = document.createElement('p');
      text.textContent = entry.text;
      reply.textContent = entry.reply;
      item.append(text, reply);
      return item;
    }));
    paper.classList.remove('is-torn');
    void paper.offsetWidth;
    paper.classList.add('is-torn');
    input.value = '';
    options.onInteract('worry');
  });
  document.querySelector('#worry-skip').addEventListener('click', () => { input.value = ''; paper.classList.remove('is-torn'); options.showNotice('也可以先放着，不急着处理。'); });
}
