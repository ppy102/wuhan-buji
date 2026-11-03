# 页面交互与内部契约

纯静态站点，没有 HTTP 业务接口。

- `restoreState(value)`：从未知本地内容恢复 version、popped、saved；去重并剔除无效场景和未戳破的收藏。
- `updateState(state, {type, id})`：纯函数，支持 pop/save/remove，不修改旧状态，未知动作不变。
- `readState(storage)`：返回 `{state, error}`，读取异常可继续体验但需提示。
- `writeState(storage, state)`：成功返回 null，失败返回 Error。
- `playPopSound()`：用户开启声音后调用，实时创建短音效，结束即释放音频上下文。

场景字段为 id、title、scene、when、nothingToDo、icon、color、artwork、location、region、themes、start、duration，部分场景另有 source（url、label）。region 和 themes 用于组合筛选；start 是建议寻找的起点或关键词，duration 是不含交通的参考停留时间。source 链接是地点资料参考，不代表实时开放信息。页面仅接受静态场景 ID，不把本地存储的文本插入 HTML。

退出方式：卡片关闭按钮、“算了，下次”、Escape；口袋关闭按钮、“收好，慢慢来”、Escape。已收藏场景按钮禁用以防重复加入；口袋中的“查看详情”在口袋之上打开场景卡，关闭后回到原收藏列表。两条短路线复用场景卡，不产生新的收藏数据。

陪伴角色：`assets/fish_whale.svg` 为 320×160 原创胖鲸鱼双帧图；`#fish-image` 的 `data-state` 为 idle 或 resting，点击角色后使用 CSS 选择左侧睁眼或右侧闭眼带 Zzz 的一帧，替代文本随状态同步。尊重减少动态效果设置，无外部依赖。

## 新章节

- `initializeExtras({showNotice, reportError, onInteract})`：通过页面提供的反馈接口初始化撕纸、环境底噪、便签三个独立模块。
- `tearWorry({text, entries, random})`：纯状态转换，去除控制字符、限制 80 字，空白不接受，最多返回五条 `{text, reply}`；不持久化。
- `createNote({text, date, random})`：纯函数，创建 120 字内的便签并固定底噪标签；空白返回 null。
- `restoreNote(value)`：校验版本、真实日历日期、允许的标签和文本；不合法返回 null。
- `readNote()` / `writeNote(note)`：浏览器边界返回读取结果或错误，写入不影响收藏键。
- `startAmbient(id)`：在用户操作后创建单一场景，返回 `{stop()}`。stop 是异步操作，执行 1.2 秒淡出后释放 AudioContext。页面串行协调切换，期间新请求覆盖待播放目标。
- `exportReceipt(note, tagTitle)`：将已保存快照绘制为 1080×1350 PNG 并下载；不改变原存根。

泡泡轻响开关只影响短气泡音效；环境底噪有独立按钮和“全部停下”。默认均关闭。音频意象不包含真实人声和现场录音。

小鲸鱼累计三次新泡泡或撕纸互动后显示金色；点击打开独立借口卡模态框，可关闭或 Escape 返回。该会话的撕纸次数不保存；已戳破泡泡保留。

## 地标展示

src/landmarks.js 导出 LANDMARKS 静态素材目录与 getLandmark(key)。key 为 clock、bridge、tower、lake、old_lane、breakfast、bookshop、park、noodles、pavilion、riverside、courtyard、street、factory、lakeside、hill；返回 {place, line, image, alt, caption}，部分条目另有 photo、photoAlt 和 credit（author、source、license）。未关联、未知或原型属性返回 null。详情卡优先显示本地 photo，附来源与许可链接，image 保留为插画；借口缩略图使用插画。替换图片不改变 scene ID 或收藏行为。图片均为相对本地路径，许可与来源仅在用户主动点击后打开。

借口卡复用 SCENES：从十六个地点中随机取一个，展示其场景建议、停止选项和对应缩略图，无重复维护的四项文案池。
