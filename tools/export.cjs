// 导出 PNG：node tools/export.cjs <方向文件夹> [--only=id,id] [--scale=2] [--board] [--out=目录]
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('C:/Users/TFCth/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');

const args = process.argv.slice(2);
const dir = path.resolve(args.find(a => !a.startsWith('--')));
const opt = k => (args.find(a => a.startsWith(`--${k}=`)) || '').split('=')[1];
const only = opt('only') ? opt('only').split(',') : null;
const scale = +(opt('scale') || 2);
const out = path.resolve(opt('out') || path.join(dir, 'export'));
const board = args.includes('--board');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Users/TFCth/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'
  });
  const url = pathToFileURL(path.join(dir, 'board.html')).href;
  const page = await browser.newPage({ viewport: { width: 750, height: 1334 }, deviceScaleFactor: scale });
  page.on('pageerror', e => console.error('页面报错:', e.message));
  await page.goto(url);
  const list = await page.evaluate(() => PAGES.map(p => [p.id, p.name]));
  for (const [i, [id, name]] of list.entries()) {
    if (only && !only.includes(id)) continue;
    await page.goto(url + '?p=' + id);
    await page.waitForTimeout(200);
    const file = path.join(out, `${String(i + 1).padStart(2, '0')}-${name}.png`);
    await page.screenshot({ path: file });
    console.log(file);
  }
  if (board) {
    const b = await browser.newPage({ viewport: { width: 1560, height: 900 }, deviceScaleFactor: 1.25 });
    await b.goto(url);
    await b.waitForTimeout(400);
    const file = path.join(out, '00-展板.png');
    await b.screenshot({ path: file, fullPage: true });
    console.log(file);
  }
  await browser.close();
})();
