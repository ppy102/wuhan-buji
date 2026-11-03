import { startAmbient } from './ambient-audio.js';
import { SOUNDSCAPES } from './journal-state.js';

/** 串行切换环境；例外：初始化闭包集中管理音频实例与事件，避免跨模块暴露可变播放状态。 */
export function initializeSoundscapes(options) {
  const container = document.querySelector('#soundscape-grid');
  const status = document.querySelector('#ambient-status');
  let requestedId = null;
  let currentId = null;
  let session = null;
  let switching = false;

  /** 文本立即响应，真实播放状态由 aria-pressed 表达。 */
  function refresh() {
    container.setAttribute('aria-busy', String(switching));
    for (const button of container.querySelectorAll('button')) button.setAttribute('aria-pressed', String(currentId === button.dataset.sound));
    status.textContent = switching ? '声音正在慢慢换过去……' : currentId ? `正在听：${SOUNDSCAPES.find(scene => scene.id === currentId).title}` : '现在很安静。想听的时候再打开。';
  }

  /** 先完整淡出旧实例再创建新实例，保证最多一个环境上下文。 */
  async function reconcile() {
    if (switching) return;
    switching = true;
    refresh();
    try {
      while (currentId !== requestedId) {
        if (session) { await session.stop(); session = null; currentId = null; }
        if (requestedId) {
          const nextId = requestedId;
          session = await startAmbient(nextId);
          currentId = nextId;
        }
      }
    } catch (error) {
      requestedId = null;
      currentId = null;
      session = null;
      options.reportError('audio', error);
    } finally {
      switching = false;
      refresh();
    }
  }

  container.replaceChildren(...SOUNDSCAPES.map(scene => {
    const button = document.createElement('button');
    button.className = 'soundscape';
    button.dataset.sound = scene.id;
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = `<svg aria-hidden="true"><use href="#${scene.icon}"></use></svg><span><strong>${scene.title}</strong><small>${scene.subtitle}</small></span><i aria-hidden="true">▷</i>`;
    button.addEventListener('click', () => { requestedId = requestedId === scene.id ? null : scene.id; void reconcile(); });
    return button;
  }));
  document.querySelector('#ambient-stop').addEventListener('click', () => { requestedId = null; void reconcile(); });
  refresh();
}
