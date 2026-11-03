export const NOTE_KEY = 'wuhan-bu-ji-note-v1';
export const MAX_NOTE_LENGTH = 120;
export const MAX_WORRY_LENGTH = 80;
export const MAX_RECENT_WORRIES = 5;
export const SOUNDSCAPES = Object.freeze([
  { id: 'ferry', title: '轮渡汽笛', subtitle: '江水慢慢，远处一声船笛', icon: 'boat' },
  { id: 'breakfast', title: '过早摊清晨', subtitle: '水汽升起来，街口醒过来', icon: 'bowl' },
  { id: 'teahouse', title: '老茶馆下午', subtitle: '一杯茶，一点轻轻的杯盏声', icon: 'tea' },
  { id: 'courtyard', title: '旧家属院傍晚', subtitle: '晚风吹叶子，楼下有虫鸣', icon: 'house' },
]);
export const WORRY_PRESETS = Object.freeze([
  '一天想去五个地方，怕来不及', '怕错过一家想吃的店', '走累了，又不好意思说',
  '下雨了，原来的计划全乱了', '照片拍得不好看', '怕这趟旅行没有玩够',
]);
const COMFORTS = Object.freeze([
  '少去一个地方，不会少一块武汉。', '走累了，就让长椅接一下班。',
  '这座城明天还在，不用今天看完。', '雨有雨的下午，慢一点也能过。',
  '一趟旅行，留一点空白也很好。', '没有照片的那一刻，也算你来过。',
]);

/** 只保留有内容且长度受控的本地文字。 */
export function normalizeText(value, maximum) {
  return typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maximum) : '';
}

/** 将一次烦恼变为安慰，并限制本次会话的历史数量。 */
export function tearWorry(options) {
  const text = normalizeText(options.text, MAX_WORRY_LENGTH);
  if (!text) return { entries: options.entries, accepted: false };
  const reply = COMFORTS[Math.min(COMFORTS.length - 1, Math.max(0, Math.floor(options.random * COMFORTS.length)))];
  return { entries: [{ text, reply }, ...options.entries].slice(0, MAX_RECENT_WORRIES), accepted: true };
}

/** 保存时固定日期与随机底噪标签，导出不会再次随机。 */
export function createNote(options) {
  const text = normalizeText(options.text, MAX_NOTE_LENGTH);
  if (!text) return null;
  const selected = SOUNDSCAPES[Math.min(SOUNDSCAPES.length - 1, Math.max(0, Math.floor(options.random * SOUNDSCAPES.length)))];
  return { version: 1, text, date: options.date, tag: selected.id };
}

/** 读取本地便签时校验字段；旧收藏使用不同键，不受影响。 */
export function restoreNote(value) {
  if (value?.version !== 1 || !/^\d{4}-\d{2}-\d{2}$/.test(value?.date) || !SOUNDSCAPES.some(scene => scene.id === value?.tag)) return null;
  const parsedDate = new Date(`${value.date}T00:00:00Z`);
  if (!Number.isFinite(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== value.date) return null;
  const text = normalizeText(value.text, MAX_NOTE_LENGTH);
  return text ? { version: 1, text, date: value.date, tag: value.tag } : null;
}
