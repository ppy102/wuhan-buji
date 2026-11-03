import { initializeWorries } from './worries.js';
import { initializeSoundscapes } from './soundscapes.js';
import { initializeNotes } from './notes.js';

/** 后续章节共享页面反馈接口，内部数据和生命周期独立管理。 */
export function initializeExtras(options) {
  initializeWorries(options);
  initializeSoundscapes(options);
  initializeNotes(options);
}
