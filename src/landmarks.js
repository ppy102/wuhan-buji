/** 本地地标插画与已署名照片；示意画不表示真实视角或通行路线。 */
export const LANDMARKS = Object.freeze({
  clock: Object.freeze({ place: '江汉关', line: 'assets/clock_line.svg', image: 'assets/clock_study.svg', alt: '江汉关的低饱和线描示意插画', caption: '江汉关 · 手绘意象' }),
  bridge: Object.freeze({ place: '长江大桥', line: 'assets/bridge_line.svg', image: 'assets/bridge_study.svg', alt: '长江大桥的低饱和线描示意插画', photo: 'assets/bridge_photo.jpg', photoAlt: '远望武汉长江大桥与城市江岸的照片', caption: '长江大桥 · 实景', credit: { author: 'Zheng Zhou', source: 'https://commons.wikimedia.org/wiki/File:Wuhan_Yangtze_River_Bridge_in_2020.jpg', license: 'https://creativecommons.org/licenses/by-sa/4.0/' } }),
  tower: Object.freeze({ place: '黄鹤楼', line: 'assets/tower_line.svg', image: 'assets/tower_study.svg', alt: '黄鹤楼的低饱和线描示意插画', caption: '黄鹤楼 · 手绘意象' }),
  lake: Object.freeze({ place: '东湖绿道', line: 'assets/lake_line.svg', image: 'assets/lake_study.svg', alt: '东湖的低饱和线描示意插画', photo: 'assets/lake_photo.jpg', photoAlt: '武汉东湖水面与湖岸的照片', caption: '东湖 · 实景（非指定入口）', credit: { author: 'Fxqf', source: 'https://commons.wikimedia.org/wiki/File:Wuhan_East_Lake_01.jpg', license: 'https://creativecommons.org/licenses/by-sa/4.0/' } }),
  old_lane: Object.freeze({ place: '长堤街', line: 'assets/old_lane_line.svg', image: 'assets/old_lane_study.svg', alt: '长堤街的生活意象示意插画', caption: '长堤街 · 手绘意象' }),
  breakfast: Object.freeze({ place: '大成路', line: 'assets/breakfast_line.svg', image: 'assets/breakfast_study.svg', alt: '大成路的生活意象示意插画', caption: '大成路 · 手绘意象' }),
  bookshop: Object.freeze({ place: '昙华林', line: 'assets/bookshop_line.svg', image: 'assets/bookshop_study.svg', alt: '昙华林的生活意象示意插画', caption: '昙华林 · 手绘意象' }),
  park: Object.freeze({ place: '解放公园', line: 'assets/park_line.svg', image: 'assets/park_study.svg', alt: '解放公园的生活意象示意插画', caption: '解放公园 · 手绘意象' }),
  noodles: Object.freeze({ place: '粮道街', line: 'assets/noodles_line.svg', image: 'assets/noodles_study.svg', alt: '粮道街的生活意象示意插画', caption: '粮道街 · 手绘意象' }),
  pavilion: Object.freeze({ place: '晴川阁', line: 'assets/pavilion_line.svg', image: 'assets/pavilion_study.svg', alt: '晴川阁的生活意象示意插画', caption: '晴川阁 · 手绘意象' }),
  riverside: Object.freeze({ place: '汉口江滩', line: 'assets/riverside_line.svg', image: 'assets/riverside_study.svg', alt: '汉口江滩的生活意象示意插画', caption: '汉口江滩 · 手绘意象' }),
  courtyard: Object.freeze({ place: '同兴里', line: 'assets/courtyard_line.svg', image: 'assets/courtyard_study.svg', alt: '同兴里的生活意象示意插画', caption: '同兴里 · 手绘意象' }),
  street: Object.freeze({ place: '黎黄陂路', line: 'assets/street_line.svg', image: 'assets/street_study.svg', alt: '黎黄陂路的生活意象示意插画', caption: '黎黄陂路 · 手绘意象' }),
  factory: Object.freeze({ place: '汉阳造', line: 'assets/factory_line.svg', image: 'assets/factory_study.svg', alt: '汉阳造的生活意象示意插画', caption: '汉阳造 · 手绘意象' }),
  lakeside: Object.freeze({ place: '沙湖公园', line: 'assets/lakeside_line.svg', image: 'assets/lakeside_study.svg', alt: '沙湖公园的生活意象示意插画', caption: '沙湖公园 · 手绘意象' }),
  hill: Object.freeze({ place: '龟山', line: 'assets/hill_line.svg', image: 'assets/hill_study.svg', alt: '龟山的生活意象示意插画', caption: '龟山 · 手绘意象' })
});

/** 未配图的场景保留原图标，不猜测其对应地点。 */
export function getLandmark(key) {
  return Object.hasOwn(LANDMARKS, key) ? LANDMARKS[key] : null;
}
