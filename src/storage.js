import { restoreState, STORAGE_KEY } from './state.js';

/** 仅在存储边界处理浏览器限制、损坏 JSON 等真实故障。 */
export function readState(storage) {
  try {
    return { state: restoreState(JSON.parse(storage.getItem(STORAGE_KEY))), error: null };
  } catch (error) {
    return { state: restoreState(null), error };
  }
}

/** 写入失败时返回错误，由页面提示本次状态只能暂存。 */
export function writeState(storage, state) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return null;
  } catch (error) {
    return error;
  }
}
