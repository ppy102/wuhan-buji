# 素材来源

## 标题字体

首屏强调文字与章节标题使用 Noto Serif SC 的粗体字形，来源为 [Google Fonts](https://github.com/google/fonts/tree/main/ofl/notoserifsc)。`assets/noto-serif-sc-heading.woff2` 由 Google Fonts 按当前静态标题的字符生成子集，仅用于固定标题；未包含的字符回退到系统宋体。字体随站点本地加载，不向字体服务发起运行时请求。授权为 SIL Open Font License 1.1，完整文本见 `assets/NOTO_SERIF_SC_OFL.txt`。

## 大肥鱼

当前页面使用 `assets/fish_whale.svg`：本项目原创的灰蓝色胖鲸鱼剪影，320×160 两帧，左侧睁眼，右侧闭眼并配 Zzz。使用原生路径与局部引用，没有嵌入位图、脚本或外部资源；透明背景，与江岸插画使用同一组灰蓝配色。桌面显示窗口 112px，手机 80px。

### 历史参考（不参与页面加载）

作者：YunYueSama

仓库：https://github.com/YunYueSama/codex-deepseek-pet

上游原图：https://github.com/YunYueSama/codex-deepseek-pet/blob/main/assets/whale/idle-front.png

历史参考：assets/fish_idle.png，原版 2048×1024 透明双帧图，仅保留用于溯源。当前页面不再展示该人形角色。

该历史参考曾以 CSS 调色展示，现已由用户选择的纯色胖鲸鱼剪影替代。原图文件未修改，其完整许可及来源继续随文件保留。

历史参考授权核对日期：2026-11-02。采用上游《大肥鱼项目署名许可 1.0》，非 MIT、非 CC0；本节保留原作者与仓库链接。完整文本见 assets/DAFEIYU_LICENSE.txt，配套素材声明见 assets/DAFEIYU_ASSET_LICENSE.md。

上游声明允许使用、修改、分享及商用，限于作者有权授权的贡献；该许可不扩展社区参考、角色设计或标志等第三方权利，也不代表 DeepSeek 官方授权。未使用授权待核实的社区参考图。不得据此推定该仓库所有参考素材均可使用。

点击切换为闭眼休息，不将该姿势描述为蜷卧睡眠。两帧共享轮廓与脚底基线，切换时位置、比例不变。

## 武汉视觉

assets/river.svg 与 assets/mark.svg 为本项目原创矢量插画。江岸图为武汉生活意象，非精确地形或桥梁工程图。不使用地图、照片热链或外部字体。

## 十六套武汉地点（2026-11-02）

下表线稿和插画为本项目用 SVG 几何路径原创绘制；详情卡还使用下节列出的两张本地实景照片。历史大肥鱼参考的许可仍按上节单独保留。

| 地点 | 泡泡线稿 | 默认插画 | 对应场景 ID |
| --- | --- | --- | --- |
| 江汉关 | assets/clock_line.svg | assets/clock_study.svg | river |
| 长堤街 | assets/old_lane_line.svg | assets/old_lane_study.svg | tea |
| 东湖绿道 | assets/lake_line.svg | assets/lake_study.svg | tree |
| 大成路 | assets/breakfast_line.svg | assets/breakfast_study.svg | breakfast |
| 长江大桥 | assets/bridge_line.svg | assets/bridge_study.svg | cloud |
| 昙华林 | assets/bookshop_line.svg | assets/bookshop_study.svg | book |
| 解放公园 | assets/park_line.svg | assets/park_study.svg | swing |
| 粮道街 | assets/noodles_line.svg | assets/noodles_study.svg | noodles |
| 晴川阁 | assets/pavilion_line.svg | assets/pavilion_study.svg | hanriver |
| 汉口江滩 | assets/riverside_line.svg | assets/riverside_study.svg | shade |
| 黄鹤楼 | assets/tower_line.svg | assets/tower_study.svg | sunset |
| 同兴里 | assets/courtyard_line.svg | assets/courtyard_study.svg | alley |
| 黎黄陂路 | assets/street_line.svg | assets/street_study.svg | window |
| 汉阳造 | assets/factory_line.svg | assets/factory_study.svg | rain |
| 沙湖公园 | assets/lakeside_line.svg | assets/lakeside_study.svg | bench |
| 龟山 | assets/hill_line.svg | assets/hill_study.svg | home |

线稿 160×160，插画 400×400；使用灰绿描边、淡彩与纸白背景。每个地点有单独的线稿与插画文件：建筑轮廓、老街门窗、面摊、树荫长椅、湖边芦苇和山坡小路。东湖和大桥详情优先显示下方照片，原 SVG 作为插画保留，并用于借口卡。

地标与街区图均为简化生活意象，不表示精确实景或工程结构。东湖拱桥不指代某座具体桥梁；长堤街与同兴里等街巷画面不对应具体商户或住宅；昙华林的书店、大成路的过早摊不作营业保证。页面不提供票价、班次或固定营业时间。

地点资料及已核实的来源见 [地点说明](PLACES.md)；具体店铺、设施和开放安排仍以现场或官方信息为准。

## 实景照片

| 地点 | 本地文件 | 作者与原图 | 许可 |
| --- | --- | --- | --- |
| 长江大桥 | assets/bridge_photo.jpg | [Zheng Zhou，Wuhan Yangtze River Bridge in 2020](https://commons.wikimedia.org/wiki/File:Wuhan_Yangtze_River_Bridge_in_2020.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| 东湖 | assets/lake_photo.jpg | [Fxqf，Wuhan East Lake 01](https://commons.wikimedia.org/wiki/File:Wuhan_East_Lake_01.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |

2026-11-02 通过 Wikimedia Commons 的原图元数据核对作者、标题和许可。图片为 960px 缩略版本，页面以 CSS 进行裁切和降低饱和度；详情卡附原图、许可链接及处理说明。照片仅用于呈现地点氛围，不表示当前季节或指定入口。图片在本地加载；作者和许可页面只在访客主动点击链接时打开。

### 换成自己的照片

1. 将已获授权的照片放进 assets/，推荐正方形裁切，避免只放远程链接。
2. 在 src/landmarks.js 对应地标填写 photo（例如 assets/clock_photo.jpg）、photoAlt 和 caption；如需署名，填写 credit 的 author、source 与 license。photo 与 credit 均使用真实素材信息。
3. 保留 line、image 和 alt 字段，即可继续使用轻量 SVG 泡泡图标及借口卡插画。当前 picture 的照片来源类型为 image/jpeg，请使用 JPEG 图片。
4. 相框由 CSS 自动加白边、阴影、轻微倾斜及低饱和滤镜；图片本身不被改写。补充记录照片作者、来源与许可后，运行测试并在手机宽度检查。

请勿把搜索结果或 CSS 滤镜视为图片授权。
