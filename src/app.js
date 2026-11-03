import { SCENES, updateState } from './state.js';
import { readState, writeState } from './storage.js';
import { playPopSound } from './pop-sound.js';
import { initializeExtras } from './extras.js';
import { getLandmark } from './landmarks.js';

/** 页面状态保留在闭包中；例外：初始化函数较长，用闭包集中管理此页面生命周期，避免全局可变状态。 */
function initializePage() {
  const findElement = selector => document.querySelector(selector);
  const storage = { getItem: key => window.localStorage.getItem(key), setItem: (key, value) => window.localStorage.setItem(key, value) };
  const restored = readState(storage);
  let state = restored.state;
  let selectedScene = null;
  let soundEnabled = false;
  let noticeTimer;
  let interactionCount = state.popped.length;
  let selectedRegion = 'all';
  let selectedTheme = 'all';
  const sceneDialog = findElement('#scene-dialog');
  const pocketDialog = findElement('#pocket-dialog');
  const fishButton = findElement('#fish-button');

  /** 统一展示存储与声音故障，不向页面泄露技术错误。 */
  function reportError(moduleName, error) {
    console.error(`[${moduleName}][ERROR] 浏览器功能不可用 | context: {}`, error);
    const messages = { storage: '本地保存暂不可用，这次的选择只留到页面关闭。', audio: '声音暂时没响，仍然可以安静地逛逛。', export: '这次图片没能导出，可以再试一下；文字仍在这里。' };
    showNotice(messages[moduleName]);
  }

  /** 互动后的角色反馈不展示进度；三次后留下可选的遛弯借口。 */
  function respondToInteraction(kind) {
    interactionCount++;
    fishButton.classList.toggle('is-golden', interactionCount >= 3);
    if (kind === 'worry') {
      findElement('#fish-image').dataset.state = 'resting';
      findElement('#fish-image').alt = '闭眼休息的小蓝鲸，旁边写着 Zzz';
      findElement('#fish-message').textContent = '这张纸借我盖一会儿。你也歇歇。';
    }
    if (interactionCount >= 3) {
      fishButton.setAttribute('aria-label', '看看大肥鱼的遛弯借口');
      findElement('#fish-message').textContent = '蛮虚浮！今天由你随便逛。';
    }
  }

  /** 短提示不抢占键盘焦点。 */
  function showNotice(message) {
    const notice = findElement('#notice');
    window.clearTimeout(noticeTimer);
    notice.textContent = message;
    notice.classList.add('is-visible');
    noticeTimer = window.setTimeout(() => notice.classList.remove('is-visible'), 3400);
  }

  /** 从可信静态场景生成按钮，所有用户状态均只影响文本和类名。 */
  function renderBubbles() {
    const grid = findElement('#bubble-grid');
    grid.replaceChildren(...SCENES.map(scene => {
      const item = document.createElement('div');
      item.className = 'bubble-item';
      const artwork = getLandmark(scene.artwork);
      const icon = artwork ? `<img class="landmark-icon" src="${artwork.line}" alt="" width="160" height="160">` : `<svg aria-hidden="true"><use href="#${scene.icon}"></use></svg>`;
      item.innerHTML = `<button class="bubble ${scene.color}" data-scene="${scene.id}" aria-label="戳开泡泡：${scene.title}">${icon}</button>${artwork ? `<span class="bubble-place">${artwork.place}</span>` : '<span class="bubble-place" aria-hidden="true">&nbsp;</span>'}<p class="bubble-label">${scene.title}</p><p class="bubble-status"></p>`;
      item.querySelector('button').addEventListener('click', () => openScene(scene));
      return item;
    }));
    refreshBubbles();
  }

  /** 更新现有按钮，避免打开对话框后移除原按钮而丢失焦点。 */
  function refreshBubbles() {
    for (const scene of SCENES) {
      const button = findElement(`[data-scene="${scene.id}"]`);
      const popped = state.popped.includes(scene.id);
      button.classList.toggle('is-popped', popped);
      button.setAttribute('aria-label', `${popped ? '再看看' : '戳开泡泡'}：${getLandmark(scene.artwork)?.place || ''}${scene.title}`);
      button.parentElement.querySelector('.bubble-status').textContent = state.saved.includes(scene.id) ? '已放进今天' : popped ? '再看看' : '';
    }
    findElement('#saved-count').textContent = state.saved.length;
  }

  /** 场景卡复用同一原生模态框，支持 Escape 关闭与焦点返回。 */
  async function openScene(scene) {
    selectedScene = scene;
    const firstPop = !state.popped.includes(scene.id);
    commitState({ type: 'pop', id: scene.id });
    findElement('#scene-when').textContent = scene.when;
    renderSceneArtwork(scene);
    findElement('#scene-title').textContent = scene.title;
    findElement('#scene-description').textContent = scene.scene;
    findElement('#scene-location').textContent = scene.location;
    findElement('#scene-start').textContent = scene.start;
    findElement('#scene-duration').textContent = scene.duration;
    const guideSource = findElement('#scene-guide-source');
    guideSource.hidden = !scene.source;
    if (scene.source) {
      guideSource.href = scene.source.url;
      guideSource.textContent = scene.source.label;
    }
    findElement('#scene-comfort').textContent = scene.nothingToDo;
    findElement('#scene-symbol').setAttribute('href', `#${scene.icon}`);
    refreshSaveButton();
    if (firstPop) {
      const bubble = findElement(`[data-scene="${scene.id}"]`);
      bubble.classList.add('is-bursting');
      fishButton.classList.add('is-eating');
      findElement('#fish-message').textContent = '啊呜。这个下午，先替你尝了一口。';
      respondToInteraction('bubble');
    }
    sceneDialog.showModal();
    if (firstPop && soundEnabled) {
      const error = await playPopSound();
      if (error) reportError('audio', error);
    }
  }

  /** 根据场景展示本地插画或带署名的照片。 */
  function renderSceneArtwork(scene) {
    const artwork = getLandmark(scene.artwork);
    findElement('#scene-artwork').hidden = !artwork;
    findElement('.scene-icon').toggleAttribute('hidden', Boolean(artwork));
    findElement('#scene-place').textContent = artwork?.place || '';
    if (!artwork) return;
    findElement('#scene-image').src = artwork.image;
    findElement('#scene-image').alt = artwork.photoAlt || artwork.alt;
    if (artwork.photo) findElement('#scene-photo').srcset = artwork.photo;
    else findElement('#scene-photo').removeAttribute('srcset');
    findElement('#scene-caption').textContent = artwork.caption;
    const credit = artwork.credit;
    findElement('#scene-credit').hidden = !credit;
    if (credit) {
      findElement('#scene-credit-author').textContent = credit.author;
      findElement('#scene-credit-author').href = credit.source;
      findElement('#scene-credit-license').href = credit.license;
    }
  }

  /** 地区和兴趣共同筛选，选择只存在于当前页面。 */
  function refreshFilters() {
    let count = 0;
    for (const scene of SCENES) {
      const matches = (selectedRegion === 'all' || scene.region === selectedRegion)
        && (selectedTheme === 'all' || scene.themes.includes(selectedTheme));
      findElement(`[data-scene="${scene.id}"]`).parentElement.hidden = !matches;
      if (matches) count++;
    }
    document.querySelectorAll('#region-filter button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.region === selectedRegion)));
    document.querySelectorAll('#theme-filter button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.theme === selectedTheme)));
    findElement('#filter-status').textContent = count ? `这里有 ${count} 个去处，慢慢挑。` : '暂时没有符合的去处。';
    findElement('#filter-empty').hidden = count !== 0;
  }

  /** 筛选操作不改变收藏和泡泡状态。 */
  function initializeFilters() {
    document.querySelectorAll('#region-filter button').forEach(button => button.addEventListener('click', () => {
      selectedRegion = button.dataset.region;
      refreshFilters();
    }));
    document.querySelectorAll('#theme-filter button').forEach(button => button.addEventListener('click', () => {
      selectedTheme = button.dataset.theme;
      refreshFilters();
    }));
    findElement('#filter-reset').addEventListener('click', () => {
      selectedRegion = 'all';
      selectedTheme = 'all';
      refreshFilters();
      findElement('#region-filter button').focus();
    });
    refreshFilters();
  }

  /** 同步收藏状态并立即保存；浏览器拒绝保存时明确告知。 */
  function commitState(action) {
    state = updateState(state, action);
    const error = writeState(storage, state);
    if (error) reportError('storage', error);
    refreshBubbles();
    return !error;
  }

  /** 已收藏场景不能重复加入。 */
  function refreshSaveButton() {
    const saved = state.saved.includes(selectedScene.id);
    findElement('#scene-save').textContent = saved ? '已经放进今天了' : '放进今天';
    findElement('#scene-save').disabled = saved;
  }

  /** 收藏条目可单独移出，不改变泡泡已戳破的记忆。 */
  function renderPocket() {
    const list = findElement('#pocket-list');
    list.replaceChildren();
    if (!state.saved.length) {
      const empty = document.createElement('p');
      empty.className = 'pocket-empty';
      empty.textContent = '口袋还是空的，也挺轻松。戳开一颗泡泡，把喜欢的下午放进来。';
      list.append(empty);
    }
    for (const id of state.saved) {
      const scene = SCENES.find(item => item.id === id);
      const row = document.createElement('article');
      row.className = 'saved-scene';
      const place = getLandmark(scene.artwork)?.place || '';
      row.innerHTML = `<div><p class="saved-place">${scene.region} · ${place}</p><h3>${scene.title}</h3><p>${scene.scene}</p><button class="pocket-view" aria-label="查看${place}详情">查看详情</button></div><button class="quiet-button pocket-remove" aria-label="移出${place}">移出</button>`;
      row.querySelector('.pocket-view').addEventListener('click', () => openScene(scene));
      row.querySelector('.pocket-remove').addEventListener('click', () => {
        commitState({ type: 'remove', id });
        renderPocket();
        pocketDialog.querySelector('.saved-scene button, .pocket-dismiss').focus();
      });
      list.append(row);
    }
  }

  renderBubbles();
  initializeFilters();
  document.querySelectorAll('[data-walk-scene]').forEach(button => button.addEventListener('click', () => {
    openScene(SCENES.find(scene => scene.id === button.dataset.walkScene));
  }));
  findElement('#scene-save').addEventListener('click', () => {
    const persisted = commitState({ type: 'save', id: selectedScene.id });
    refreshSaveButton();
    sceneDialog.close();
    findElement('#fish-message').textContent = '放好了。不用急着出发。';
    if (persisted) showNotice('放进今天了。想起来的时候，再去。');
  });
  findElement('#pocket-open').addEventListener('click', () => { renderPocket(); pocketDialog.showModal(); });
  findElement('#sound-toggle').addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    findElement('#sound-toggle').setAttribute('aria-pressed', String(soundEnabled));
    findElement('#sound-label').textContent = soundEnabled ? '开' : '关';
    showNotice(soundEnabled ? '戳泡泡时，会有轻轻一声。' : '安静下来啦。');
  });
  fishButton.addEventListener('click', () => {
    if (interactionCount >= 3) {
      const excuse = SCENES[Math.floor(Math.random() * SCENES.length)];
      const artwork = getLandmark(excuse.artwork);
      findElement('#excuse-text').textContent = `${excuse.scene} ${excuse.nothingToDo}`;
      findElement('#excuse-image').src = artwork.image;
      findElement('#excuse-image').alt = artwork.alt;
      findElement('#excuse-place').textContent = artwork.place;
      findElement('#excuse-dialog').showModal();
      return;
    }
    const resting = findElement('#fish-image').dataset.state === 'resting';
    findElement('#fish-image').dataset.state = resting ? 'idle' : 'resting';
    findElement('#fish-image').alt = resting ? '一条圆滚滚的灰蓝色小鲸鱼' : '闭眼休息的小蓝鲸，旁边写着 Zzz';
    findElement('#fish-message').textContent = resting ? '醒了。也没什么要紧的事。' : '你慢慢看，我先眯一会儿。';
  });
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  document.querySelectorAll('.bubble, .fish-portrait').forEach(element => element.addEventListener('animationend', () => element.classList.remove('is-bursting', 'is-eating')));
  fishButton.classList.toggle('is-golden', interactionCount >= 3);
  if (interactionCount >= 3) fishButton.setAttribute('aria-label', '看看大肥鱼的遛弯借口');
  initializeExtras({ showNotice, reportError, onInteract: respondToInteraction });
  if (restored.error) reportError('storage', restored.error);
}

initializePage();
