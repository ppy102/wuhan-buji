import { NOTE_KEY, restoreNote } from './journal-state.js';

/** 便签独立存储，不改写已有泡泡收藏。 */
export function readNote() {
  try {
    return { note: restoreNote(JSON.parse(window.localStorage.getItem(NOTE_KEY))), error: null };
  } catch (error) {
    return { note: null, error };
  }
}

/** 新存根覆盖此浏览器的上一张存根，存储拒绝时返回错误。 */
export function writeNote(note) {
  try {
    window.localStorage.setItem(NOTE_KEY, JSON.stringify(note));
    return null;
  } catch (error) {
    return error;
  }
}
