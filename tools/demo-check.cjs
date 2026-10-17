// 用 Playwright 把演示跑一遍并截图（直接开本地文件）：node tools/demo-check.cjs <方向文件夹> <脚本名> [输出目录]
// 脚本名对应下面 SCRIPTS 里的一项；截图按步骤编号存
const path = require('path');
const { chromium } = require('C:/Users/TFCth/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');
const [dirArg, scriptName, outArg] = process.argv.slice(2);
const dir = path.basename(path.resolve(dirArg));
const out = path.resolve(outArg || '.preview');
const URL = require('url').pathToFileURL(path.resolve(dirArg, 'demo.html')).href;

// 舞台坐标 → 页面坐标
async function stagePt(page, x, y) {
  return page.evaluate(([x, y]) => { const r = document.getElementById('stage').getBoundingClientRect(); const k = r.width / 750; return [r.left + x * k, r.top + y * k]; }, [x, y]);
}
async function tap(page, x, y) { const [px, py] = await stagePt(page, x, y); await page.mouse.click(px, py); }
async function drag(page, a, b) {
  const [x1, y1] = await stagePt(page, a[0], a[1]), [x2, y2] = await stagePt(page, b[0], b[1]);
  await page.mouse.move(x1, y1); await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(x1 + (x2 - x1) * i / 8, y1 + (y2 - y1) * i / 8);
  await page.mouse.up();
}

const SCRIPTS = {
  // 方向一：主页 → 匹配 → 战斗，抽字、上阵、合成、凑赵云
  zy: async (page, shot) => {
    await shot('home');
    await tap(page, 375, 1120); await page.waitForTimeout(900); await shot('match');
    await page.waitForTimeout(3200); await shot('vs');
    await page.waitForTimeout(2600); await shot('battle-start');
    for (let i = 0; i < 5; i++) { await tap(page, 375, 1260); await page.waitForTimeout(150); }
    await shot('battle-summoned');
    const box = await page.evaluate(() => window.__B && window.__B.box);
    console.log('字匣', JSON.stringify(box));
    // 把字匣里的兵拖到第一行空格
    for (let i = 0; i < 5; i++) {
      const slot = await page.evaluate(i => { const B = window.__B, G = PARTS.GEO; for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) if (B.grid[r][c] === 0) { const q = G.slot('me', c, r); return [q.x + q.s / 2, q.y + q.s / 2]; } return null; }, i);
      const ch = await page.evaluate(i => window.__B.box[i], i);
      if (!ch || !slot) continue;
      await drag(page, [44 + i * 112 + 46, 1134], slot);
      await page.waitForTimeout(120);
    }
    await shot('battle-placed');
    console.log('格子', JSON.stringify(await page.evaluate(() => window.__B.grid.map(r => r.map(u => u === 0 ? '·' : u === 'lock' ? '锁' : (u.ch || u.gen) + (u.lv || ''))))));
    await page.waitForTimeout(6000); await shot('battle-6s');
    console.log('桃', await page.evaluate(() => [window.__B.peach, window.__B.oppPeach, window.__B.kills, window.__B.mantou]));
    await page.click('#panel >> text=直接胜利'); await page.waitForTimeout(2200); await shot('win');
    await tap(page, 300, 1292); await page.waitForTimeout(700); console.log('点回主页后', await page.evaluate(() => Demo.id)); await shot('home-after');
    await tap(page, 75, 1280); await page.waitForTimeout(800); await tap(page, 147, 880); await page.waitForTimeout(600); await shot('shop-bought');
  },
  // 方向二：主页 → 匹配 → 战斗，造弹弓/蜘蛛/刺球，看黄大仙来挠门
  tp: async (page, shot) => {
    await shot('home');
    await tap(page, 375, 1120); await page.waitForTimeout(900); await shot('match');
    await page.waitForTimeout(3800); await shot('battle-start');
    const tileXY = (c, r) => [132 + c * 82 + 38, 700 + r * 82 + 38];
    const buildAt = async (c, r, card) => { await tap(page, ...tileXY(c, r)); await page.waitForTimeout(120); await tap(page, 36 + card * 114 + 52, 1196); await page.waitForTimeout(150); };
    await buildAt(2, 0, 0);
    await page.waitForTimeout(3000);
    await buildAt(3, 0, 1);
    await buildAt(1, 0, 0);
    await shot('battle-built');
    console.log('设施', JSON.stringify(await page.evaluate(() => window.__B.grid)), '松果', await page.evaluate(() => Math.floor(window.__B.cones)));
    await page.waitForTimeout(9000); await shot('battle-attack');
    console.log('黄大仙', JSON.stringify(await page.evaluate(() => { const w = window.__B.w; return { state: w.state, hp: Math.round(w.hp), lv: w.lv, door: Math.round(window.__B.doorHp) }; })));
    await page.waitForTimeout(6000); await shot('battle-later');
    console.log('黄大仙', JSON.stringify(await page.evaluate(() => { const w = window.__B.w; return { state: w.state, hp: Math.round(w.hp), lv: w.lv, door: Math.round(window.__B.doorHp), repels: window.__B.repels }; })));
    await page.click('#panel >> text=直接到春天'); await page.waitForTimeout(2200); await shot('win');
    await tap(page, 320, 1290); await page.waitForTimeout(700); console.log('回窝里后', await page.evaluate(() => Demo.id));
    await tap(page, 75, 1270); await page.waitForTimeout(900); await tap(page, 140, 800); await page.waitForTimeout(700); await shot('shop-bought');
  }

};

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Users/TFCth/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(URL);
  await page.waitForTimeout(800);
  let n = 0;
  const shot = async name => { const f = path.join(out, `demo-${String(++n).padStart(2, '0')}-${name}.png`); await page.locator('#phone').screenshot({ path: f }); console.log(f); };
  await SCRIPTS[scriptName](page, shot);
  // 精灵要真的有大小（网站样式曾把它们压成 0 宽，逻辑照跑但看不见）
  await page.evaluate(() => Demo.go('battle')); await page.waitForTimeout(9000);
  const zero = await page.evaluate(() => [...document.querySelectorAll('#stage img.spr')].filter(i => getComputedStyle(i).display !== 'none' && i.getBoundingClientRect().width < 4).length);
  if (zero) errs.push(`有 ${zero} 张精灵宽度为 0，看不见`);
  console.log(errs.length ? '错误:\n' + errs.join('\n') : '没有报错');
  await browser.close();
})();
