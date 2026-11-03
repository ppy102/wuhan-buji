const WIDTH = 1080;
const HEIGHT = 1350;
const TEXT_WIDTH = 790;
const LINE_HEIGHT = 82;
const BODY_BOTTOM = 930;

/** 按实际字宽换行，兼容连续中文、英文与表情，不截断用户原文。 */
function wrapText(context, text) {
  const lines = [];
  let line = '';
  for (const character of text) {
    if (context.measureText(line + character).width > TEXT_WIDTH && line) { lines.push(line); line = ''; }
    line += character;
  }
  if (line) lines.push(line);
  return lines;
}

/** 极淡的细点纸纹避免密集横线干扰阅读。 */
function drawPaper(context) {
  context.fillStyle = '#f6f5ef';
  context.fillRect(0, 0, WIDTH, HEIGHT);
  context.fillStyle = '#dedfd333';
  // PERF: 纸纹仅在用户导出时绘制，不占用页面动画帧。
  for (let row = 0; row < HEIGHT; row += 19) {
    for (let column = 0; column < WIDTH; column += 23) context.fillRect(column + row % 11, row, 1, 1);
  }
}

/** 标题和正文按实际字宽绘制，与固定页脚保留足够空间。 */
function drawContent(context, note) {
  context.fillStyle = '#4d7064';
  context.font = '48px SimSun, serif';
  context.fillText('武汉不急。', 140, 175);
  context.font = '23px Microsoft YaHei, sans-serif';
  context.fillStyle = '#697973';
  context.fillText('留给自己的一小张下午', 143, 235);
  context.fillStyle = '#354d49';
  context.font = '44px SimSun, serif';
  const lines = wrapText(context, note.text);
  const firstY = Math.min(475, BODY_BOTTOM - (lines.length - 1) * LINE_HEIGHT);
  lines.forEach((line, index) => context.fillText(line, 145, firstY + index * LINE_HEIGHT));
}

/** 日期与标签使用已保存快照，不在导出时再次随机。 */
function drawFooter(options) {
  const { context, note, tagTitle } = options;
  context.setLineDash([5, 9]);
  context.beginPath(); context.moveTo(140, 1040); context.lineTo(940, 1040); context.strokeStyle = '#a4b8ae'; context.stroke();
  context.setLineDash([]);
  context.font = '24px Microsoft YaHei, sans-serif';
  context.fillStyle = '#697973';
  context.fillText(note.date, 145, 1110);
  context.fillText(`这一张，配着${tagTitle}`, 145, 1160);
  context.font = '22px SimSun, serif';
  context.fillText('你也可以不急。', 145, 1240);
}

/** 使用本地字体与程序绘图导出纸感存根，无跨域图片污染画布。 */
export async function exportReceipt(note, tagTitle) {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext('2d');
  drawPaper(context);
  drawContent(context, note);
  drawFooter({ context, note, tagTitle });
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Canvas export unavailable');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = `武汉不急-${note.date}.png`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
