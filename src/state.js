export const STORAGE_KEY = 'wuhan-bu-ji-v1';
export const SCENES = Object.freeze([
  { id: 'river', source: { url: 'https://wlj.wuhan.gov.cn/zfxxgk/fdzdgknr/jgjj/zsdw/202008/t20200827_1437247.shtml', label: '地点参考：武汉市文化和旅游局' }, region: '汉口', themes: ['看江湖','看建筑'], start: '先找「江汉关博物馆」，在沿江大道 129 号一带看钟楼，再往江边走。', duration: '建议留 30—60 分钟', location: '汉口 · 沿江大道，江汉关一带', artwork: 'clock', title: '等一艘船', scene: '沿江大道上看看江汉关钟楼，再到附近江边等一艘经过的船。', when: '白天，天气适合到江边的时候', nothingToDo: '不用上船，也不用等下一艘。', icon: 'boat', color: 'blue' },
  { id: 'tea', region: '汉口', themes: ['逛街巷'], start: '先找「硚口长堤街」，选一段街道慢慢走，遇到合适的小店再坐下来。', duration: '建议留 40—90 分钟', location: '汉口 · 硚口区长堤街', artwork: 'old_lane', title: '把茶喝凉', scene: '沿长堤街慢慢走，看门口的板凳和街坊的日常。遇到合适的小店，就坐下喝点东西。', when: '白天，街边店铺营业时', nothingToDo: '茶凉了，再续一点。下午还长。', icon: 'tea', color: 'green' },
  { id: 'tree', source: { url: 'https://www.whdonghu.gov.cn/xwzx_6309/dhyw/202403/t20240315_2373415.shtml', label: '地点参考：东湖风景区（2024）' }, region: '武昌', themes: ['看江湖','走公园'], start: '可以从「东湖绿道梨园入口」一带开始，到湖边后选一小段步道慢走。', duration: '建议留 1—2 小时', location: '武昌 · 东湖绿道临湖步道', artwork: 'lake', title: '借一片树荫', scene: '在东湖边找一段有树荫的步道，听听水声，不必走完整圈。', when: '天气温和，适合户外的时候', nothingToDo: '看看叶子，手机也可以歇一歇。', icon: 'leaf', color: 'yellow' },
  { id: 'breakfast', source: { url: 'https://cgw.wuhan.gov.cn/cgdt/cgw_cgxw/202501/t20250106_2513204.shtml', label: '地点参考：武汉市城管委（2025）' }, region: '武昌', themes: ['吃过早','逛街巷'], start: '先找「武昌大成路」，沿街看看有什么想吃的，再挑一家正在营业的小店。', duration: '建议留 30—60 分钟', location: '武昌 · 大成路沿线', artwork: 'breakfast', title: '慢慢吃过早', scene: '去大成路看看街边的过早摊，挑一家正在营业、自己想吃的小店。面拌匀了，再慢慢吃。', when: '早晨，早点店营业时', nothingToDo: '吃完再想接下来去哪。', icon: 'bowl', color: 'pink' },
  { id: 'cloud', region: '武昌', themes: ['看江湖','看建筑'], start: '先找「武汉长江大桥武昌桥头」一带，再选安全、开阔的位置看桥。', duration: '建议留 30—60 分钟', location: '武昌 · 临江大道大桥附近', artwork: 'bridge', title: '看云过桥', scene: '在武昌江边找个能望见长江大桥的位置，看云从钢梁上慢慢过去。', when: '白天，能见度较好的时候', nothingToDo: '云没有路线，你也可以没有。', icon: 'cloud', color: 'blue' },
  { id: 'book', source: { url: 'https://news.hubeidaily.net/pc/c_3468866.html', label: '地点参考：湖北日报' }, region: '武昌', themes: ['逛街巷','看建筑'], start: '可以从地铁 5 号线「昙华林武胜门」站一带开始，沿昙华林正街慢走。', duration: '建议留 1—2 小时', location: '武昌 · 昙华林街区', artwork: 'bookshop', title: '只翻两页', scene: '沿昙华林走一小段，看看老屋。遇到开着的书店，就进去翻两页；没遇到，也不耽误散步。', when: '白天，想看看街区的时候', nothingToDo: '读到哪一页，今天就到哪一页。', icon: 'book', color: 'green' },
  { id: 'swing', source: { url: 'https://www.wuhan.gov.cn/zjwh/whly/202610/t20261031_2871802.shtml', label: '地点参考：武汉市人民政府' }, region: '汉口', themes: ['走公园'], start: '先找「解放公园」，选就近开放的入口进入，遇到长椅便停一停。', duration: '建议留 40—90 分钟', location: '汉口 · 江岸区解放公园', artwork: 'park', title: '坐一小会儿', scene: '到解放公园走一段树荫路，遇到空长椅就坐下。听听鸟声，也听街坊聊天。', when: '天气适合在公园散步的时候', nothingToDo: '不用绕公园一圈，坐着也是出来玩。', icon: 'swing', color: 'yellow' },
  { id: 'noodles', source: { url: 'https://news.hubeidaily.net/pc/c_3468866.html', label: '地点参考：湖北日报' }, region: '武昌', themes: ['吃过早','逛街巷'], start: '先找「武昌粮道街」，沿街选一家正在营业、愿意等候的小店。', duration: '建议留 30—60 分钟', location: '武昌 · 粮道街沿线', artwork: 'noodles', title: '等面出锅', scene: '到粮道街看看有什么想吃的，选一家不用等太久的小店。听一会儿锅铲声，等自己的那碗面。', when: '早晨，早点店营业时', nothingToDo: '这家排队太长，换一家也可以。', icon: 'bowl', color: 'pink' },
  { id: 'hanriver', region: '汉阳', themes: ['看江湖','看建筑'], start: '先找「晴川阁」，从洗马长街一带看看江景；想进阁再查看开放信息。', duration: '建议留 40—90 分钟', location: '汉阳 · 洗马长街，晴川阁一带', artwork: 'pavilion', title: '看两岸的风', scene: '在晴川阁一带看看江景和屋檐，把隔江的城市当成一张慢慢展开的画。', when: '白天，天气适合到江边的时候', nothingToDo: '今天只在附近走走，也已经见过江风了。', icon: 'boat', color: 'blue' },
  { id: 'shade', source: { url: 'https://zrzyhgh.wuhan.gov.cn/gsggzx/ghzs/202007/t20200707_1396436.shtml', label: '地点参考：汉口江滩规划（2020）' }, region: '汉口', themes: ['看江湖','走公园'], start: '可以从沿江大道江汉关一带开始，找到江滩开放入口后再往江边走。', duration: '建议留 30—90 分钟', location: '汉口 · 沿江大道旁的江滩步道', artwork: 'riverside', title: '数一数树影', scene: '到汉口江滩随意走一段，不必走到某个广场。找片树影，看看风怎样把它揉散。', when: '白天或傍晚，江风不太大的时候', nothingToDo: '数错了，也不用重新来。', icon: 'leaf', color: 'green' },
  { id: 'sunset', region: '武昌', themes: ['看建筑'], start: '先找「黄鹤楼公园」周边；如果想进园，再提前查看开放和票务信息。', duration: '周边走走建议留 30—60 分钟', location: '武昌 · 蛇山，黄鹤楼周边街区', artwork: 'tower', title: '等天色变软', scene: '把傍晚留给黄鹤楼一带，看看飞檐和天色。不想继续走，就在附近歇歇。', when: '白天或傍晚，视天气安排', nothingToDo: '没看到晚霞，也已经吹过风了。', icon: 'sun', color: 'yellow' },
  { id: 'alley', region: '汉口', themes: ['逛街巷','看建筑'], start: '先找「武汉同兴里」，沿开放的公共巷道慢走，留意居民的日常生活。', duration: '建议留 30—60 分钟', location: '汉口 · 江岸区洞庭街，同兴里一带', artwork: 'courtyard', title: '绕进小巷', scene: '在同兴里看看老房子的门窗，沿开放的公共巷道走一小段。遇到居民门口，轻声经过就好。', when: '白天，光线比较好的时候', nothingToDo: '不用把每条巷子都走完。', icon: 'house', color: 'pink' },
  { id: 'window', region: '汉口', themes: ['逛街巷','看建筑'], start: '先找「黎黄陂路」，以这条街为起点，看老建筑，遇到喜欢的小店再坐下。', duration: '建议留 40—90 分钟', location: '汉口 · 江岸区黎黄陂路', artwork: 'street', title: '坐在窗边', scene: '沿黎黄陂路看看老建筑。碰到喜欢又有空位的小店，再进去坐在窗边，看行人慢慢经过。', when: '白天，店铺营业时', nothingToDo: '不想消费，就在街边看看建筑也很好。', icon: 'tea', color: 'blue' },
  { id: 'rain', region: '汉阳', themes: ['逛街巷','看建筑'], start: '先找「汉阳造文化创意产业园」，在龟北路一带看看老厂房。', duration: '建议留 40—90 分钟', location: '汉阳 · 龟北路，汉阳造文化创意产业园一带', artwork: 'factory', title: '听雨落下来', scene: '在汉阳造一带看看老厂房的砖墙。下雨了，找一家开着的小店歇脚，听雨落在街上。', when: '白天，想看看老厂房的时候', nothingToDo: '雨不停，就把今天的散步留到下次。', icon: 'rain', color: 'green' },
  { id: 'bench', source: { url: 'https://www.wuhan.gov.cn/zjwh/whly/202610/t20261031_2871802.shtml', label: '地点参考：武汉市人民政府' }, region: '武昌', themes: ['看江湖','走公园'], start: '先找「沙湖公园」，从就近开放的入口进入，慢慢走到湖边。', duration: '建议留 40—90 分钟', location: '武昌 · 沙湖公园临湖步道', artwork: 'lakeside', title: '借张长椅', scene: '到沙湖公园走走，遇见空着的长椅就坐下。看水面起一点波纹，先不安排下一站。', when: '天气适合在湖边散步的时候', nothingToDo: '没有下一站，也算一个下午。', icon: 'bench', color: 'yellow' },
  { id: 'home', region: '汉阳', themes: ['走公园'], start: '先找「龟山风景区」周边，在山脚走一小段；想上山时再查看开放入口。', duration: '山脚走走建议留 30—60 分钟', location: '汉阳 · 龟山周边', artwork: 'hill', title: '早点回去', scene: '在龟山附近走一小段，看看山坡上的树。今天已经累了，就在山脚停下，慢慢往住处走。', when: '白天，想轻轻走一小段的时候', nothingToDo: '不上山也没关系，武汉明天还在这里。', icon: 'house', color: 'pink' },
]);

/** 从本地内容恢复有效场景，过滤未知 ID 并去重。 */
export function restoreState(value) {
  const validIds = new Set(SCENES.map(scene => scene.id));
  const normalizeIds = ids => Array.isArray(ids)
    ? [...new Set(ids.filter(id => validIds.has(id)))] : [];
  const popped = normalizeIds(value?.popped);
  return { version: 1, popped, saved: normalizeIds(value?.saved).filter(id => popped.includes(id)) };
}

/** 记录戳破和收藏；下次打开已戳破的泡泡时仍可看卡片。 */
export function updateState(state, action) {
  if (!SCENES.some(scene => scene.id === action.id)) return state;
  if (action.type === 'pop') return restoreState({ ...state, popped: [...state.popped, action.id] });
  if (action.type === 'save') return restoreState({ ...state, saved: [...state.saved, action.id] });
  if (action.type === 'remove') return restoreState({ ...state, saved: state.saved.filter(id => id !== action.id) });
  return state;
}
