import { readdir, readFile, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const sources = (await readdir('src')).filter(name => name.endsWith('.js'));
for (const filename of sources) {
  const result = spawnSync(process.execPath, ['--check', `src/${filename}`], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr);
}
const html = await readFile('index.html', 'utf8');
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  if (/^(https?:|data:)/.test(match[1])) continue;
  await access(match[1]);
}
console.log(`${sources.length} 个 JS 模块语法及页面本地资源路径校验通过。`);
