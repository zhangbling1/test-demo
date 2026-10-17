/* 方向一演示：主页 → 匹配 → 匹配成功 → 战斗（能玩）→ 结算；商店能买东西，买的东西下一局生效。
   动的东西全是图片/小块，用 CSS transform 挪，不重绘大图。 */
(function () {
  const D = Demo, P = PARTS, C = P.C, GEO = P.GEO, T = SK.text, N = SK.N;
  D.defs = P.GRAD;
  const byId = Object.fromEntries(PAGES.map(p => [p.id, p]));
  const fresh = () => ({ mantou: 2380, yuanbao: 66, stars: 2, bought: {}, signed: false });
  D.state = fresh();
  let B = null;   // 当前这局

  // ---------- 待机的小动静 ----------
  const sparkleSvg = r => P.sparkle(0, 0, r, '#fff');
  const amb = {
    sparkles: pts => D.twinkle(pts, sparkleSvg),
    confetti(n) {
      const petal = '<path d="M0 -8 C6 -4 6 4 0 8 C-6 4 -6 -4 0 -8Z" fill="#ffb3a6" stroke="#2b1a12" stroke-width="1.2"/>', gold = '<path d="M0 -6 L5 0 L0 6 L-5 0Z" fill="#ffe28c" stroke="#b06a12" stroke-width="1"/>';
      D.drift(n, { html: i => i % 3 ? petal : gold, area: [0, -60, 750, -20], dy: 1420, dx: [-60, 60], dur: [7, 12], sway: 26, spin: 160 });
    },
    rain(n) { D.drift(n, { html: () => '<path d="M0 0 l-6 26" stroke="#e8eef4" stroke-width="2.2" stroke-linecap="round" opacity=".55"/>', area: [0, -60, 900, -20], dy: 1440, dx: [-200, -160], dur: [1.4, 2] }); },
    clouds() {   // 两朵小云慢慢飘
      const url = D.sprite('cloudS', P.xy(-64, -18, 1, { tail: false }), [-70, -30, 140, 60]);
      [[120, 470, 40], [600, 860, 55]].forEach(([x, y, dur], i) => {
        const im = D.image(url, [-70, -30, 140, 60]);
        D.idle(im, [{ transform: `translate3d(${x - 30}px,${y}px,0)` }, { transform: `translate3d(${x + 30}px,${y - 6}px,0)` }], dur * 100, { delay: -i * 1500 });
      });
    }
  };

  D.panel = {
    title: '赵云与阿斗', intro: '西游画风 · 可演示版',
    tips: ['主页点「开战」进入一局，匹配完自动开打', '点「征兵」花馒头抽字，字进字匣', '把字拖到空格上阵；同字同级拖到一起合成', '「赵」「云」拖到一起召出赵云', '「铲」拖到没开垦的格子上开一格', '把兵拖到「卖」上换馒头'],
    controls: [
      { label: '直接胜利', when: () => D.id === 'battle', fn: () => B && end(true) },
      { label: '直接失败', when: () => D.id === 'battle', fn: () => B && end(false) },
      { label: '馒头 +200', when: () => D.id === 'battle', fn: () => { if (B) { B.mantou += 200; hud(); } } },
      { label: '重置演示数据', always: true, fn: () => { D.state = fresh(); D.cut('home'); } }
    ]
  };

  // ---------- 主页 ----------
  D.def('home', {
    name: '主页', seed: 3, render: () => byId.home.draw(), enter() {
      D.hot(220, 1064, 310, 114, () => D.cut('match'), '开战');
      D.hot(38, 1074, 160, 92, () => D.toast('演示版先开放 1V1 对战'));
      D.hot(552, 1074, 160, 92, () => D.toast('好友约战：演示版没做'));
      D.hot(0, 1232, 150, 102, () => D.cut('shop'), '商店');
      [['武将', 150], ['兵书', 450], ['结义', 600]].forEach(([n, x]) => D.hot(x, 1232, 150, 102, () => D.toast(`「${n}」演示版没做`)));
      D.hot(20, 424, 70, 84, () => {
        if (D.state.signed) return D.toast('今天已经签过了');
        D.state.signed = true; D.state.mantou += 50; D.go('home'); D.toast('签到成功：馒头 +50');
      }, '签到');
      ['任务', '邮件', '排行'].forEach((n, i) => D.hot(20, 528 + i * 104, 70, 84, () => D.toast(`「${n}」演示版没做`)));
      amb.clouds();
      amb.sparkles([[132, 250, 14], [636, 236, 10], [478, 214, 8], [262, 340, 7], [470, 520, 9], [300, 470, 6]]);
      D.glow(P.rr(212, 1056, 326, 130, 24));
    }
  });

  // ---------- 匹配 ----------
  D.def('match', {
    name: '匹配', seed: 7, render: () => P.match({ noText: true, noRing: true }), enter() {
      const ob = [-215, -215, 430, 430], ib = [-120, -120, 240, 240];
      const outer = D.image(D.sprite('ringOuter', P.matchRing(0, 0, 'outer'), ob), ob);
      const inner = D.image(D.sprite('ringInner', P.matchRing(0, 0, 'inner'), ib), ib);
      outer.style.transform = inner.style.transform = 'translate3d(375px,560px,0)';
      const spin = outer.animate([{ rotate: '0deg' }, { rotate: '360deg' }], { duration: 9000, iterations: Infinity, easing: 'linear' });
      D.idle(inner, [{ scale: '1' }, { scale: '1.04' }], 900);
      const txt = D.group();
      let t = 0, found = false, shown = '';
      D.loop(dt => {
        t += dt;
        const s = found ? 'f' : String(Math.floor(t * 2) % 3) + Math.floor(t);
        if (s !== shown) {
          shown = s;
          txt.innerHTML = T(375, 836, found ? '找到对手了！' : '寻找对手中' + '…'.repeat(1 + Math.floor(t * 2) % 3), { size: 34, font: 'wei', mid: true, fill: found ? C.goldL : '#fff', stroke: SK.INK, sw: 4 }) +
            T(375, 890, '00:' + String(Math.floor(t)).padStart(2, '0'), { size: 46, font: 'song', weight: 'bold', mid: true, fill: C.goldL, stroke: SK.INK, sw: 4 });
        }
        if (!found && t > 2.6) {
          found = true; spin.playbackRate = 6;
          D.ring(375, 560, '#ffe28c', 260, 600, 10); D.bounce(inner, 1.25, 400);
          D.after(800, () => D.cut('vs'));
        }
      });
      D.hot(285, 1172, 180, 66, () => D.cut('home'), '取消');
    }
  });

  // ---------- 匹配成功：倒数 ----------
  D.def('vs', {
    name: '匹配成功', seed: 11, render: () => byId.vs.draw(), enter() {
      const g = D.group();
      g.layer.style.transformOrigin = '206px 1150px';
      let n = 3;
      const draw = () => { g.innerHTML = P.fv(SK.circD(206, 1150, 41), C.cream, { shade: '#d9c39a', light: '#fff', k: -4, lk: 0, sw: 2.4 }) + T(206, 1153, String(n), { size: 58, font: 'song', weight: 'bold', mid: true, fill: C.red }); D.bounce(g.layer, 1.3, 300); };
      draw();
      const tick = () => { n--; if (n <= 0) return D.cut('battle'); draw(); D.after(700, tick); };
      D.after(700, tick);
      D.hot(0, 0, 750, 1334, () => D.cut('battle'), '跳过');
      D.glow('M375 552 L488 686 L375 820 L262 686Z', '#fff3b0', 6);
      amb.sparkles([[290, 590, 12], [470, 610, 9], [455, 780, 11], [300, 790, 7], [548, 190, 8], [206, 820, 8]]);
    }
  });

  // ---------- 战斗 ----------
  const STAT = {
    刀: { range: 150, dmg: 16, rate: .7, col: C.red }, 枪: { range: 200, dmg: 13, rate: .8, col: C.blue, pierce: 1 },
    骑: { range: 165, dmg: 9, rate: .55, col: C.green, splash: 60 }, 弓: { range: 290, dmg: 7, rate: .45, col: C.orange },
    zhaoyun: { range: 330, dmg: 46, rate: .6, col: '#ffd24a' }, zhangfei: { range: 230, dmg: 40, rate: .85, col: '#7a4a2a', splash: 80 },
    guanyu: { range: 250, dmg: 52, rate: .8, col: C.green }, huangzhong: { range: 400, dmg: 38, rate: .7, col: C.gold }, liubei: { range: 260, dmg: 30, rate: .6, col: C.gold }
  };
  const NAMECH = P.NAMECH;
  const L = GEO.pathLen();
  const OPP = [[{ ch: '弓', lv: 3 }, { ch: '枪', lv: 2 }, { gen: 'xiahou' }, { ch: '骑', lv: 1 }, { ch: '刀', lv: 2 }],
    [{ ch: '枪', lv: 1 }, { ch: '弓', lv: 1 }, { ch: '刀', lv: 3 }, { ch: '弓', lv: 2 }, 'lock'], ['lock', 'lock', { ch: '骑', lv: 2 }, 'lock', 'lock']];
  function newBattle() {
    const buy = D.state.bought;
    const grid = [[0, 0, 0, 0, 0], [0, 'lock', 'lock', 'lock', 'lock'], ['lock', 'lock', 'lock', 'lock', 'lock']];
    if (buy['铲子']) grid[1][1] = 0;
    return {
      t: 0, total: 120, wave: 0, nextWave: 2, queue: [], mantou: 60, cost: 10, summons: 0,
      peach: buy['仙桃'] ? 4 : 3, peachMax: buy['仙桃'] ? 4 : 3, oppPeach: 3, shield: 0,
      grid, box: [null, null, null, null, null], foes: [], cd: { hu: 0, chong: 0 }, over: false, sel: null, drag: null,
      kills: 0, merges: 0, buff: { 刀: buy['青釭剑'] ? 1.2 : 1, 骑rate: buy['的卢马'] ? .8 : 1, name: buy['招贤令'] ? 2 : 1 },
      oppFoes: [], oppAt: [52, 82, 108]
    };
  }
  // 对手的阵是死的，直接画进底图
  function battleBase() {
    let s = P.battleStatic();
    OPP.forEach((row, r) => row.forEach((u, c) => { if (u) { const q = GEO.slot('opp', c, r); s += P.tile(q.x, q.y, q.s, u); } }));
    return P.page(s, 'sky');
  }
  let G = {}, W = {};
  D.def('battle', { name: '战斗', seed: 5, render: battleBase, enter: startBattle });

  // ---------- 精灵 ----------
  const tileKey = u => u === 'lock' ? 'L' : (u.gen || u.ch) + (u.lv || 1);
  const tileUrl = (u, s) => D.sprite(`t${s}${tileKey(u)}`, P.tile(-s / 2, -s / 2, s, u), [-s / 2 - 6, -s / 2 - 6, s + 12, s + 18]);
  const tileBox = s => [-s / 2 - 6, -s / 2 - 6, s + 12, s + 18];
  const SPR = {};
  function sprites() {
    if (SPR.ok) return;
    SPR.cb = D.sprite('cbW', P.caobing(0, 0, .9), [-44, -84, 88, 128]);
    SPR.shu = D.sprite('shuW', P.caobing(0, 0, .9 * .78, { shu: true }), [-36, -68, 72, 104]);
    SPR.boss = D.sprite('bossW', P.caobing(0, 0, 1.5, { boss: true }), [-90, -130, 180, 200]);
    SPR.coin = D.sprite('coin', P.mantou(0, 0, .8), [-20, -32, 40, 46]);
    // 出手的弹道：刀=红月牙，枪=蓝枪头，骑=绿旋风，弓=箭，武将=金星
    SPR.刀 = D.sprite('sh刀', `<path d="M-14 -16 C6 -14 16 0 6 16 C10 2 2 -8 -14 -16Z" fill="${C.red}" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/>`, [-20, -20, 40, 40]);
    SPR.枪 = D.sprite('sh枪', `<path d="M-22 0 L10 0" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M-22 0 L10 0" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/><path d="M8 -6 L20 0 L8 6Z" fill="#eef2f6" stroke="${SK.INK}" stroke-width="1.6"/>`, [-26, -10, 50, 20]);
    SPR.骑 = D.sprite('sh骑', `<circle r="11" fill="none" stroke="${C.green}" stroke-width="5"/><circle r="11" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="6 8"/><circle r="4" fill="#a8dcc0"/>`, [-16, -16, 32, 32]);
    SPR.弓 = D.sprite('sh弓', `<path d="M-20 0 L12 0" stroke="${SK.INK}" stroke-width="3" stroke-linecap="round"/><path d="M10 -5 L20 0 L10 5Z" fill="#eef2f6" stroke="${SK.INK}" stroke-width="1.4"/><path d="M-20 0 l-6 -6 M-20 0 l-6 6 M-15 0 l-6 -6 M-15 0 l-6 6" stroke="${C.orange}" stroke-width="2.4" stroke-linecap="round"/>`, [-28, -10, 52, 20]);
    SPR.gen = D.sprite('shGen', `<circle r="14" fill="#ffe28c" opacity=".55"/>` + P.sparkle(0, 0, 13, '#fff7c8'), [-18, -18, 36, 36]);
    SPR.ok = 1;
  }

  function startBattle() {
    B = newBattle(); window.__B = B;
    G = {}; W = {};
    sprites();
    // 对手棋盘上来回走的蜀兵（只做样子）
    for (let i = 0; i < 4; i++) {
      const u = D.unit(), im = D.image(SPR.shu, [-36, -68, 72, 104], u);
      D.idle(im, [{ transform: 'translateY(0) rotate(-4deg)' }, { transform: 'translateY(-5px) rotate(4deg)' }], 260, { delay: -i * 120 });
      B.oppFoes.push({ d: i * 330, el: u });
    }
    W.shield = D.group(); W.sel = D.group();
    // 我方 15 格、字匣 5 块
    G.slot = [];
    for (let r = 0; r < 3; r++) { G.slot[r] = []; for (let c = 0; c < 5; c++) { const q = GEO.slot('me', c, r), im = D.image(tileUrl('lock', 92), tileBox(92)); D.move(im, q.x + q.s / 2, q.y + q.s / 2); im.style.display = 'none'; G.slot[r][c] = im; } }
    G.box = [];
    for (let i = 0; i < 5; i++) { const im = D.image(tileUrl({ ch: '刀', lv: 1 }, 80), tileBox(80)); D.move(im, 44 + i * 112 + 46, 1136); im.style.display = 'none'; G.box.push(im); }
    G.foes = D.unit();   // 敌人都挂在这个容器下面（z 序在格子上面）
    ['peach', 'chips', 'money', 'summon', 'skills', 'wave'].forEach(k => { W[k] = D.group(); W[k].key = null; });
    W.money.layer.style.transformOrigin = '368px 1196px'; W.summon.layer.style.transformOrigin = '375px 1262px';
    G.drag = D.image(tileUrl({ ch: '刀', lv: 1 }, 88), tileBox(88)); G.drag.style.display = 'none'; G.drag.style.opacity = '.95';
    grid(); box(); hud();
    D.loop(tick);
    D.input({ down, move, up });
    D.toast('点「征兵」抽字，拖到格子上');
  }

  // ---------- 画（只在变了的时候换图） ----------
  function grid() {
    B.grid.forEach((row, r) => row.forEach((u, c) => {
      const im = G.slot[r][c], key = u === 0 ? '0' : tileKey(u);
      if (im.dataset.k === key) return;
      im.dataset.k = key;
      if (u === 0) { im.style.display = 'none'; return; }
      im.src = tileUrl(u, 92); im.style.display = '';
    }));
    selMarks();
  }
  function box() {
    B.box.forEach((ch, i) => {
      const im = G.box[i], lift = !!(B.sel && B.sel.type === 'box' && B.sel.i === i), key = (ch || '') + lift;
      if (im.dataset.k === key) return;
      im.dataset.k = key;
      if (!ch) { im.style.display = 'none'; return; }
      im.src = tileUrl({ ch, lv: 1 }, 80); im.style.display = '';
      if ((im.dataset.lift === '1') !== lift) { im.dataset.lift = lift ? '1' : ''; D.anim(im, [{ translate: lift ? '0 0' : '0 -12px' }, { translate: lift ? '0 -12px' : '0 0' }], 140); }
    });
  }
  function selMarks() {
    let s = '';
    const src = B.sel || (B.drag && B.drag.moved ? B.drag.src : null);
    if (src) {
      const item = itemOf(src);
      B.grid.forEach((row, r) => row.forEach((u, c) => {
        if (canDrop(item, src, u)) { const q = GEO.slot('me', c, r); s += `<rect x="${q.x + 2}" y="${q.y + 2}" width="${q.s - 4}" height="${q.s - 4}" rx="14" fill="#ffe28c" fill-opacity=".25" stroke="#ffcf3a" stroke-width="4" stroke-dasharray="10 7"/>`; }
      }));
      s += `<circle cx="680" cy="1134" r="36" fill="none" stroke="#ffcf3a" stroke-width="3" stroke-dasharray="6 6"/>`;
      if (src.type === 'box') { const x = 44 + src.i * 112; s += `<rect x="${x - 2}" y="${1080}" width="96" height="96" rx="16" fill="none" stroke="#ffe28c" stroke-width="4"/>`; }
    }
    W.sel.innerHTML = s;
    W.sel.layer.getAnimations().forEach(a => a.cancel());
    if (s) D.idle(W.sel.layer, [{ opacity: .55 }, { opacity: 1 }], 500);
  }
  // 小部件：key 变了才重画
  const put = (w, key, html) => { if (w.key === key) return false; w.key = key; w.innerHTML = html(); return true; };
  function hud() {
    put(W.peach, B.peach + '/' + B.peachMax + '/' + B.oppPeach, () => {
      let s = '';
      for (let i = 0; i < B.peachMax; i++) s += P.peach(104 + i * 28, 1054, .95, i < B.peach);
      for (let i = 0; i < 3; i++) s += P.peach(300 + i * 28, 132, 1, i < B.oppPeach);
      return s;
    });
    const have = key => { const set = new Set(); [...B.box, ...B.grid.flat().map(u => u && u.ch)].forEach(ch => { if (ch && NAMECH[ch] === key) set.add(ch); }); return set.size; };
    const done = key => B.grid.flat().some(u => u && u.gen === key);
    const ck = ['zhaoyun', 'zhangfei'].map(k => done(k) ? 'D' : have(k)).join();
    put(W.chips, ck, () => P.chip(362, '赵云', done('zhaoyun') ? 2 : have('zhaoyun'), done('zhaoyun')) + P.chip(476, '张飞', done('zhangfei') ? 2 : have('zhangfei'), done('zhangfei')) + P.chip(590, '黄忠', 0));
    put(W.money, String(B.mantou), () => P.mantou(338, 1196, .7) + T(360, 1197, String(B.mantou), { size: 22, font: 'song', weight: 'bold', anchor: 'start', mid: true }));
    const can = B.mantou >= B.cost && B.box.includes(null);
    put(W.summon, B.cost + '/' + can, () => P.summonBtn(B.cost, can));
    const hu = Math.ceil(B.cd.hu * 4), ch = Math.ceil(B.cd.chong * 4);
    put(W.skills, hu + '/' + ch, () => P.skill(110, '护', '护主', B.cd.hu / 20, B.cd.hu > 0 ? Math.ceil(B.cd.hu) + 's' : '') + P.skill(640, '冲', '七进七出', B.cd.chong / 15, B.cd.chong > 0 ? Math.ceil(B.cd.chong) + 's' : ''));
    const left = Math.max(0, B.total - B.t), mm = Math.floor(left / 60), ss = Math.floor(left % 60);
    const bossNext = [5, 9].includes(B.wave + 1) && B.nextWave - B.t < 6;
    const wk = B.wave + '/' + mm + ss + '/' + (bossNext ? Math.ceil(B.nextWave - B.t) : '');
    put(W.wave, wk, () => P.waveBadge(`第${'一二三四五六七八九十'[Math.min(9, Math.max(0, B.wave - 1))]}波`, `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`, bossNext ? `许褚 ${Math.ceil(B.nextWave - B.t)} 秒后到` : ''));
    const on = B.shield > 0;
    if (put(W.shield, String(on), () => { if (!on) return ''; const [ax, ay] = GEO.pt('me', 615, 384); return `<circle cx="${ax}" cy="${ay - 4}" r="54" fill="#ffe28c" fill-opacity=".35" stroke="#ffcf3a" stroke-width="5"/>`; }) && on) {
      const [ax, ay] = GEO.pt('me', 615, 384); W.shield.layer.style.transformOrigin = `${ax}px ${ay - 4}px`;
      D.idle(W.shield.layer, [{ scale: '1' }, { scale: '1.08' }], 300);
    }
  }

  // ---------- 规则 ----------
  const isKind = ch => ['刀', '枪', '骑', '弓'].includes(ch);
  function itemOf(src) { return src.type === 'box' ? { ch: B.box[src.i], lv: 1 } : B.grid[src.r][src.c]; }
  function canDrop(item, src, cell) {
    if (!item) return false;
    if (cell === 'lock') return item.ch === '铲' && src.type === 'box';
    if (item.ch === '铲') return false;
    if (cell === 0) return true;
    if (src.type === 'grid' && cell === itemOf(src)) return false;
    if (NAMECH[item.ch] && NAMECH[cell.ch] && NAMECH[item.ch] === NAMECH[cell.ch] && item.ch !== cell.ch) return true;
    if (isKind(item.ch) && item.ch === cell.ch && item.lv === cell.lv && cell.lv < 5) return true;
    if (item.gen && item.gen === cell.gen && item.lv === cell.lv && cell.lv < 5) return true;
    return src.type === 'grid';
  }
  function take(src) { if (src.type === 'box') B.box[src.i] = null; else B.grid[src.r][src.c] = 0; }
  const slotC = (c, r) => { const q = GEO.slot('me', c, r); return [q.x + q.s / 2, q.y + q.s / 2]; };
  function act(src, dst) {
    const item = itemOf(src);
    if (!item) return;
    if (dst.type === 'sell') {
      const v = item.gen ? 20 : item.ch && isKind(item.ch) ? 3 * (item.lv || 1) : 3;
      take(src); B.mantou += v; D.float(680, 1100, '+' + v, { fill: C.goldL }); D.ring(680, 1134, C.goldL, 50);
      return refresh();
    }
    if (dst.type !== 'grid') return;
    if (src.type === 'grid' && src.c === dst.c && src.r === dst.r) return;
    const cell = B.grid[dst.r][dst.c], [cx, cy] = slotC(dst.c, dst.r);
    if (cell === 'lock') {
      if (item.ch === '铲' && src.type === 'box') { take(src); B.grid[dst.r][dst.c] = 0; D.ring(cx, cy, '#c9a26a', 70); D.toast('开垦了一格'); }
      else D.toast('这格还没开垦，拿「铲」来');
      return refresh();
    }
    if (item.ch === '铲') { D.toast('「铲」要放在没开垦的格子上'); return; }
    if (cell === 0) {
      take(src); B.grid[dst.r][dst.c] = src.type === 'box' ? { ch: item.ch, lv: 1, cd: 0 } : item;
      refresh(); D.bounce(G.slot[dst.r][dst.c], 1.15, 200); return;
    }
    if (NAMECH[item.ch] && NAMECH[cell.ch] && NAMECH[item.ch] === NAMECH[cell.ch] && item.ch !== cell.ch) {
      take(src); const key = NAMECH[cell.ch];
      B.grid[dst.r][dst.c] = { gen: key, lv: 1, cd: 0 };
      D.ring(cx, cy, '#ffd24a', 90, 450); D.ring(cx, cy, '#ffffff', 150, 600); D.toast(`凑齐「${P.GENERAL[key][0]}」，武将登场！`); D.flash('#ffd24a', 500);
      refresh(); D.bounce(G.slot[dst.r][dst.c], 1.35, 320); return;
    }
    if ((isKind(item.ch) && item.ch === cell.ch && item.lv === cell.lv && cell.lv < 5) || (item.gen && item.gen === cell.gen && item.lv === cell.lv && cell.lv < 5)) {
      take(src); cell.lv++; B.merges++; D.ring(cx, cy, '#fff3b0', 70); D.float(cx, cy - 30, `合成 Lv.${cell.lv}`, { fill: C.goldL, size: 22 });
      refresh(); D.bounce(G.slot[dst.r][dst.c], 1.25, 260); return;
    }
    if (src.type === 'grid') { B.grid[src.r][src.c] = cell; B.grid[dst.r][dst.c] = item; return refresh(); }
    D.toast(NAMECH[item.ch] ? '名字字要放空格，或拖到另一半名字上' : '要同字同级才能合成');
  }
  function refresh() { B.sel = null; grid(); box(); hud(); }

  function summon() {
    if (!B.box.includes(null)) return D.toast('字匣满了，先上阵或卖掉');
    if (B.mantou < B.cost) return D.toast('馒头不够，打曹兵挣一点');
    B.mantou -= B.cost; B.cost += 5; B.summons++;
    let ch;
    const has = c => B.box.includes(c) || B.grid.flat().some(u => u && (u.ch === c || u.gen === 'zhaoyun'));
    if (B.summons === 3 && !has('赵')) ch = '赵';
    else if (B.summons === 5 && !has('云')) ch = '云';
    else {
      const pool = [['刀', 22], ['枪', 22], ['骑', 22], ['弓', 22], ['铲', 7], ['赵', 3 * B.buff.name], ['云', 3 * B.buff.name], ['张', 2 * B.buff.name], ['飞', 2 * B.buff.name]];
      let r = Math.random() * pool.reduce((a, b) => a + b[1], 0);
      for (const [c, w] of pool) { if ((r -= w) <= 0) { ch = c; break; } }
    }
    const i = B.box.indexOf(null);
    B.box[i] = ch;
    box(); hud();
    const im = G.box[i];
    D.anim(im, [{ scale: '.2', opacity: 0, rotate: '-30deg' }, { scale: '1.25', opacity: 1, rotate: '6deg', offset: .6 }, { scale: '1', opacity: 1, rotate: '0deg' }], 300);
    D.ring(44 + i * 112 + 46, 1134, '#fff3b0', 56);
    D.bounce(W.summon.layer, .94, 160);
  }
  function skillHu() {
    if (B.cd.hu > 0) return D.toast('护主还在冷却');
    B.shield = 5; B.cd.hu = 20; D.toast('护主：五秒内阿斗不掉命'); hud();
  }
  function skillChong() {
    if (B.cd.chong > 0) return D.toast('七进七出还在冷却');
    let at = null, gen = null;
    B.grid.forEach((row, r) => row.forEach((u, c) => { if (u && u.gen === 'zhaoyun') { at = slotC(c, r); gen = G.slot[r][c]; } }));
    if (!at) return D.toast('先凑齐「赵」「云」，召出赵云');
    const targets = B.foes.filter(f => f.hp > 0).sort((a, b) => b.d - a.d).slice(0, 7);
    if (!targets.length) return D.toast('场上还没有曹兵');
    B.cd.chong = 15;
    const lv = (B.grid.flat().find(u => u && u.gen === 'zhaoyun') || {}).lv || 1;
    targets.forEach((f, i) => D.after(i * 90, () => { if (f.hp > 0) { D.bounce(gen, 1.15, 140); shoot('gen', at[0], at[1], f, 120 * (1 + .5 * (lv - 1))); } }));
    D.toast('七进七出！'); D.flash('#ffd24a', 400); hud();
  }

  // ---------- 每帧 ----------
  let hudT = 0;
  function tick(dt) {
    if (B.over) return;
    B.t += dt; hudT += dt;
    for (const k in B.cd) B.cd[k] = Math.max(0, B.cd[k] - dt);
    B.shield = Math.max(0, B.shield - dt);
    if (B.t >= B.nextWave) {
      B.wave++; B.nextWave += 13;
      D.float(375, 610, `第${'一二三四五六七八九十'[Math.min(9, B.wave - 1)]}波`, { size: 56, font: 'wei', fill: C.goldL, life: 1.2, rise: 30 });
      const n = 3 + B.wave, hp = 34 * Math.pow(1.22, B.wave - 1);
      for (let i = 0; i < n; i++) B.queue.push({ at: B.t + i * .9, hp, boss: false });
      if (B.wave === 5 || B.wave === 9) B.queue.push({ at: B.t + n * .9 + .5, hp: hp * 14, boss: true });
    }
    B.queue = B.queue.filter(q => { if (B.t >= q.at) { spawn(q); return false; } return true; });
    // 走（连续的位移 + 图片自己的颠步动画）
    B.foes.forEach(f => {
      if (f.hp <= 0) return;
      f.d += (f.boss ? 28 : 46) * dt;
      const [x, y] = GEO.along('me', f.d);
      f.x = x; f.y = y;
      if (f.d >= L) {
        f.hp = 0; f.el.remove();
        if (B.shield > 0) { D.float(x, y - 40, '护！', { fill: C.goldL }); D.ring(x, y, C.goldL, 70); return; }
        B.peach -= f.boss ? 2 : 1; B.mantou += 30;
        D.ring(x, y, C.red, 90, 450); D.shake(10, 320); D.flash('#ff3b2a', 420);
        D.toast('阿斗受惊！补给馒头 +30');
        if (B.peach <= 0) return end(false);
        hud();
        return;
      }
      D.move(f.el, x, y);
    });
    B.foes = B.foes.filter(f => f.hp > 0);
    // 出手
    B.grid.forEach((row, r) => row.forEach((u, c) => {
      if (!u || u === 'lock' || u === 0) return;
      const st = STAT[u.gen || u.ch];
      if (!st) return;
      u.cd = (u.cd || 0) - dt;
      if (u.cd > 0) return;
      const [cx, cy] = slotC(c, r);
      let best = null;
      B.foes.forEach(f => { if (f.hp > 0 && !f.dying && Math.hypot(f.x - cx, f.y - cy) <= st.range && (!best || f.d > best.d)) best = f; });
      if (!best) return;
      const lvk = 1 + .8 * ((u.lv || 1) - 1);
      const dmg = st.dmg * lvk * (u.ch === '刀' ? B.buff.刀 : 1);
      u.cd = st.rate * (1 - .06 * ((u.lv || 1) - 1)) * (u.ch === '骑' ? B.buff.骑rate : 1);
      u.dealt = (u.dealt || 0) + dmg;
      D.bounce(G.slot[r][c], u.gen ? 1.12 : 1.08, 160);
      shoot(u.gen ? 'gen' : u.ch, cx, cy, best, dmg, st);
    }));
    // 对手
    B.oppFoes.forEach(o => { o.d = (o.d + 40 * dt) % L; const [x, y] = GEO.along('opp', o.d); D.move(o.el, x, y); });
    if (B.oppAt.length && B.t >= B.oppAt[0]) {
      B.oppAt.shift(); B.oppPeach--;
      const [ox, oy] = GEO.pt('opp', 615, 384); D.ring(ox, oy, C.red, 60);
      D.toast(B.oppPeach > 0 ? '对手的曹冲被抱走一次！' : '对手守不住了！');
      if (B.oppPeach <= 0) return end(true);
      hud();
    }
    if (B.t >= B.total) return end(B.peach >= B.oppPeach);
    if (hudT > .1) { hudT = 0; hud(); }
  }
  function spawn(q) {
    const u = D.unit(G.foes), box = q.boss ? [-90, -130, 180, 200] : [-44, -84, 88, 128];
    const im = D.image(q.boss ? SPR.boss : SPR.cb, box, u);
    D.idle(im, [{ transform: 'translateY(0) rotate(-5deg)' }, { transform: `translateY(${q.boss ? -4 : -6}px) rotate(5deg)` }], q.boss ? 420 : 240, { delay: -Math.random() * 300 });
    const bw = q.boss ? 62 : 40, by = q.boss ? -100 : -66;
    const bar = document.createElement('div'); bar.className = 'bar';
    Object.assign(bar.style, { left: -bw / 2 + 'px', top: by + 'px', width: bw + 'px' });
    bar.innerHTML = '<i></i>'; u.appendChild(bar);
    if (q.boss) { const t = document.createElement('div'); t.className = 'tagx'; t.textContent = '许褚'; Object.assign(t.style, { left: '0px', top: by - 14 + 'px' }); u.appendChild(t); }
    const [x, y] = GEO.along('me', 0);
    D.move(u, x, y);
    u.animate([{ opacity: 0, scale: '.6' }, { opacity: 1, scale: '1' }], { duration: 260, easing: 'ease-out' });
    B.foes.push({ d: 0, hp: q.hp, max: q.hp, boss: q.boss, el: u, img: im, fill: bar.firstChild, x, y });
    if (q.boss) { D.toast('首领许褚来了！'); D.shake(6, 300); }
  }
  // 弹道飞过去，到了才结算伤害
  function shoot(kind, x1, y1, f, dmg, st = {}) {
    const url = SPR[kind] || SPR.gen, box = kind === '枪' ? [-26, -10, 50, 20] : kind === '弓' ? [-28, -10, 52, 20] : kind === '骑' ? [-16, -16, 32, 32] : [-20, -20, 40, 40];
    const tx = f.x, ty = f.y - 26, ang = Math.atan2(ty - y1, tx - x1) * 180 / Math.PI, dist = Math.hypot(tx - x1, ty - y1);
    const im = D.image(url, box), ms = Math.max(110, dist * .7);
    const spin = kind === '骑' || kind === 'gen' ? 540 : 0, rot = kind === '刀' ? ang + 90 : ang;
    D.anim(im, [
      { transform: `translate3d(${x1}px,${y1}px,0) rotate(${rot}deg) scale(.7)` },
      { transform: `translate3d(${tx}px,${ty}px,0) rotate(${rot + spin}deg) scale(1.1)` }
    ], ms, { easing: 'cubic-bezier(.3,.1,.8,.9)' }).onfinish = () => {
      im.remove();
      if (B.over || f.hp <= 0) return;
      hit(f, dmg);
      if (st.splash) { D.ring(f.x, f.y - 20, st.col, st.splash, 300, 5); B.foes.forEach(o => { if (o !== f && o.hp > 0 && Math.hypot(o.x - f.x, o.y - f.y) < st.splash) hit(o, dmg * .5, true); }); }
      if (st.pierce) { const nx = B.foes.filter(o => o !== f && o.hp > 0 && Math.hypot(o.x - f.x, o.y - f.y) < 90)[0]; if (nx) hit(nx, dmg * .7, true); }
    };
  }
  function hit(f, dmg, small) {
    if (f.hp <= 0) return;
    const crit = !small && Math.random() < .12, d = crit ? dmg * 2 : dmg;
    f.hp -= d;
    f.fill.style.transform = `scaleX(${Math.max(0, f.hp / f.max).toFixed(3)})`;
    f.img.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(2.2)' }, { filter: 'brightness(1)' }], { duration: 140 });
    D.bounce(f.el, .86, 140);
    if (!small) D.ring(f.x, f.y - 26, crit ? C.red : '#fff', crit ? 50 : 30, 240, 4);
    if (!small || Math.random() < .3) D.float(f.x + (Math.random() * 24 - 12), f.y - 56, (crit ? '暴击 -' : '-') + Math.round(d), { size: crit ? 30 : 21, fill: crit ? '#ff5a3c' : '#fff', life: crit ? .8 : .6 });
    if (crit) D.shake(4, 140);
    if (f.hp <= 0) {
      B.kills++; B.mantou += f.boss ? 40 : 4;
      const el = f.el;
      el.animate([{ opacity: 1, scale: '1' }, { opacity: 0, scale: '1.4' }], { duration: 220, easing: 'ease-out' }).onfinish = () => el.remove();
      D.ring(f.x, f.y - 20, '#fff', 40, 260);
      D.fly(SPR.coin, [-20, -32, 40, 46], [f.x, f.y - 20], [338, 1196], 600, () => {
        if (!B || B.over) return;
        D.float(372, 1168, f.boss ? '+40' : '+4', { size: 20, fill: C.goldL, life: .5, rise: 26 });
        D.bounce(W.money.layer, 1.2, 180);
      });
    }
  }

  function end(win) {
    if (B.over) return;
    B.over = true;
    D.input(null);
    const st = D.state;
    let mvp = null, total = 0;
    B.grid.flat().forEach(u => { if (u && u.dealt) { total += u.dealt; if (!mvp || u.dealt > mvp.dealt) mvp = u; } });
    st.last = { kills: B.kills, merges: B.merges, wave: Math.max(1, B.wave), mvp: mvp ? `${mvp.gen ? P.GENERAL[mvp.gen][0] : mvp.ch + '兵'} ${Math.round(mvp.dealt / total * 100)}%` : '—' };
    if (win) { st.mantou += 120; st.yuanbao += 5; st.stars = Math.min(3, st.stars + 1); } else { st.mantou += 30; st.stars = Math.max(0, st.stars - 1); }
    const dim = D.el(`<rect width="750" height="1334" fill="#000" opacity=".4"/>`);
    dim.layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'forwards' });
    const g = D.el(P.title(375, 640, win ? '胜' : '败', { size: 220, fill: win ? 'url(#goldG)' : '#e6e9ee', edge: win ? C.red2 : '#5d6a80' }));
    g.layer.style.transformOrigin = '375px 640px';
    g.layer.animate([{ opacity: 0, scale: '2.4' }, { opacity: 1, scale: '.92', offset: .7 }, { opacity: 1, scale: '1' }], { duration: 420, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
    D.after(160, () => { D.shake(win ? 8 : 4, 300); if (win) D.ring(375, 640, '#ffe28c', 300, 700, 12); });
    setTimeout(() => { if (D.id === 'battle') D.cut(win ? 'win' : 'lose'); }, 1400);
  }

  // ---------- 输入：点选 / 拖拽 ----------
  function hitBox(p) { for (let i = 0; i < 5; i++) { const x = 44 + i * 112; if (p.x >= x && p.x <= x + 92 && p.y >= 1080 && p.y <= 1180) return i; } return -1; }
  function hitGrid(p) {
    for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { const q = GEO.slot('me', c, r); if (p.x >= q.x && p.x <= q.x + q.s && p.y >= q.y && p.y <= q.y + q.s) return { c, r }; }
    return null;
  }
  const hitSell = p => Math.hypot(p.x - 680, p.y - 1134) < 40;
  function down(p) {
    if (B.over) return false;
    if (p.x >= 240 && p.x <= 510 && p.y >= 1210 && p.y <= 1314) { D.ripple(p); summon(); return false; }
    if (Math.hypot(p.x - 110, p.y - 1258) < 48) { D.ripple(p); skillHu(); return false; }
    if (Math.hypot(p.x - 640, p.y - 1258) < 48) { D.ripple(p); skillChong(); return false; }
    let src = null;
    const bi = hitBox(p);
    if (bi >= 0 && B.box[bi]) src = { type: 'box', i: bi };
    const gi = hitGrid(p);
    if (gi && B.grid[gi.r][gi.c] && B.grid[gi.r][gi.c] !== 'lock') src = { type: 'grid', c: gi.c, r: gi.r };
    if (src) { B.drag = { src, start: p, moved: false }; return true; }
    if (B.sel) {
      if (gi) act(B.sel, { type: 'grid', c: gi.c, r: gi.r });
      else if (hitSell(p)) act(B.sel, { type: 'sell' });
      else { B.sel = null; box(); selMarks(); }
    }
    return false;
  }
  function move(p) {
    const d = B && B.drag;
    if (!d) return;
    if (!d.moved && Math.hypot(p.x - d.start.x, p.y - d.start.y) > 10) {
      d.moved = true;
      B.sel = null;
      const item = itemOf(d.src);
      G.drag.src = tileUrl(item.gen ? item : { ch: item.ch, lv: item.lv || 1 }, 88);
      G.drag.style.display = '';
      (d.src.type === 'box' ? G.box[d.src.i] : G.slot[d.src.r][d.src.c]).style.opacity = '.35';
      document.getElementById('stage').classList.add('dragging');
      box(); selMarks();
    }
    if (d.moved) D.move(G.drag, p.x, p.y - 24, ' scale(1.1)');
  }
  function up(p) {
    const d = B && B.drag;
    if (!d) return;
    B.drag = null;
    G.drag.style.display = 'none';
    (d.src.type === 'box' ? G.box[d.src.i] : G.slot[d.src.r][d.src.c]).style.opacity = '';
    document.getElementById('stage').classList.remove('dragging');
    if (!d.moved) {
      if (B.sel && B.sel.type === d.src.type && B.sel.i === d.src.i && B.sel.c === d.src.c && B.sel.r === d.src.r) B.sel = null;
      else if (B.sel && d.src.type === 'grid') act(B.sel, { type: 'grid', c: d.src.c, r: d.src.r });
      else B.sel = d.src;
      box(); selMarks();
      return;
    }
    const gi = hitGrid(p);
    if (gi) act(d.src, { type: 'grid', c: gi.c, r: gi.r });
    else if (hitSell(p)) act(d.src, { type: 'sell' });
    selMarks();
  }

  // ---------- 结算 ----------
  D.def('win', {
    name: '结算 · 胜', seed: 13, render: () => byId.win.draw(), enter() {
      let doubled = false;
      D.hot(50, 1132, 290, 96, () => { if (doubled) return D.toast('已经领过了'); doubled = true; D.state.mantou += 120; D.toast('看完广告：馒头再 +120'); }, '双倍领取');
      D.hot(366, 1122, 336, 116, () => D.cut('match'), '再战一局');
      D.hot(250, 1272, 120, 40, () => D.cut('home'), '回主页');
      D.hot(390, 1272, 140, 40, () => D.toast('战报已生成，可以分享给好友'), '分享战报');
      amb.confetti(46); amb.sparkles([[180, 160, 16], [580, 150, 12], [420, 740, 12]]);
      D.glow(P.rr(360, 1116, 348, 128, 24));
    }
  });
  D.def('lose', {
    name: '结算 · 败', seed: 19, render: () => byId.lose.draw(), enter() {
      D.hot(50, 1130, 290, 96, () => D.cut('home'), '回主页');
      D.hot(366, 1120, 336, 116, () => D.cut('match'), '再战一局');
      amb.rain(60);
    }
  });

  // ---------- 商店 ----------
  D.def('shop', {
    name: '商店', seed: 17, render: () => byId.shop.draw(), enter() {
      P.SHOP_ITEMS().forEach((it, i) => {
        const x = 42 + (i % 3) * 228, y = 788 + Math.floor(i / 3) * 194;
        D.hot(x, y, 210, 182, () => {
          if (it.sold) return D.toast('卖完了，明天再来');
          if (D.state.bought[it.name]) return D.toast(`「${it.name}」今天已经买过了`);
          const yb = it.cur === 'yb', price = +it.price;
          if ((yb ? D.state.yuanbao : D.state.mantou) < price) return D.toast(yb ? '元宝不够' : '馒头不够');
          if (yb) D.state.yuanbao -= price; else D.state.mantou -= price;
          D.state.bought[it.name] = true;
          D.go('shop');
          D.ring(x + 105, y + 80, '#ffe28c', 120, 500, 8);
          D.toast(`买到「${it.name}」：${it.desc}（今天的对局生效）`);
        }, it.name);
      });
      D.hot(560, 652, 130, 58, () => D.toast(D.state.yuanbao >= 128 ? '皮肤演示版先不卖' : '元宝不够，差 ' + (128 - D.state.yuanbao)), '购买皮肤');
      amb.sparkles([[96, 548, 10], [252, 566, 8], [206, 530, 6], [128, 640, 7]]);
      D.glow(P.rr(554, 646, 142, 70, 16));
      D.hot(560, 742, 150, 44, () => D.toast('看完广告：货架刷新（演示版不换货）'));
      [['武将', 370], ['皮肤', 500], ['元宝', 630]].forEach(([n, x]) => D.hot(x - 55, 434, 110, 44, () => D.toast(`「${n}」页演示版没做`)));
      D.hot(300, 1180, 150, 154, () => D.cut('home'), '出征');
      [['武将', 150], ['兵书', 450], ['结义', 600]].forEach(([n, x]) => D.hot(x, 1232, 150, 102, () => D.toast(`「${n}」演示版没做`)));
    }
  });

  D.go('home');
})();
