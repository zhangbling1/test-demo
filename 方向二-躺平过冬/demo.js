/* 方向二演示：主页 → 匹配 → 战斗（能玩）→ 春天来了 / 被叼走；小卖部能买东西。 */
(function () {
  const D = Demo, P = PARTS, C = P.C, BT = P.BT, T = SK.text, N = SK.N;
  D.defs = P.GRAD;
  const byId = Object.fromEntries(PAGES.map(p => [p.id, p]));
  const fresh = () => ({ nut: 3420, honey: 45, stars: 2, fur: 7, bought: {}, signed: false });
  D.state = fresh();
  let B = null;

  // ---------- 待机的小动静 ----------
  const amb = {
    snow(n, y0 = 0, y1 = 1334) {
      D.drift(n, { html: () => { const r = (2 + Math.random() * 4).toFixed(1); return `<circle r="${r}" fill="#fff" stroke="#cfdeea" stroke-width="1"/>`; }, area: [0, y0 - 40, 750, y0], dy: y1 - y0 + 40, dx: [-30, 30], dur: [6, 11], sway: 14 });
    },
    zzz(x, y) {
      D.drift(3, { size: 40, html: i => SK.text(0, 0, i % 2 ? 'Z' : 'z', { size: 22 + i * 4, font: 'hupo', fill: '#6c9bc6', mid: true, stroke: '#fff', sw: 3 }), area: [x, y, x + 1, y + 1], dy: -90, dx: [20, 34], dur: [2.4, 3], fade: [0, 1, 0] });
    },
    fireflies(n, cx, cy, rx, ry) {
      D.drift(n, { html: () => '<circle r="7" fill="#ffe9a6" opacity=".35"/><circle r="2.6" fill="#fff6c8"/>', area: [cx - rx, cy - ry, cx + rx, cy + ry], dy: -50, dx: [-30, 30], dur: [4, 7], sway: 18, fade: [0, 1, 0], twinkle: true });
    },
    petals(n) {
      const P1 = '<path d="M0 -7 C5 -3 5 3 0 7 C-5 3 -5 -3 0 -7Z" fill="#f2a7a0" stroke="#3f2c20" stroke-width="1.1"/>', P2 = '<circle r="4" fill="#fff" stroke="#3f2c20" stroke-width="1"/><circle r="1.6" fill="#f3c24f"/>';
      D.drift(n, { html: i => i % 3 ? P1 : P2, area: [-60, -40, 750, -20], dy: 1400, dx: [60, 160], dur: [9, 14], sway: 30, spin: 160 });
    },
    twinkle(points) { D.twinkle(points, r => `<path d="M0 ${-r} Q${r * .2} ${-r * .2} ${r} 0 Q${r * .2} ${r * .2} 0 ${r} Q${-r * .2} ${r * .2} ${-r} 0 Q${-r * .2} ${-r * .2} 0 ${-r}Z" fill="#fff6c8"/>`); }
  };

  D.panel = {
    title: '躺平过冬', intro: '动物题材 · 可演示版',
    tips: ['主页点「开始冬眠」，凑齐 6 只自动开局', '点洞里一块空地，再点下面的卡片造设施', '弹弓、蜂窝会打黄大仙；蜘蛛补门；刺球在门被挠穿时救命', '松果不够就先「升级窝」，睡得越好攒得越快', '熬到春天就赢；门被挠穿又没刺球就被叼走'],
    controls: [
      { label: '直接到春天', when: () => D.id === 'battle', fn: () => B && end(true) },
      { label: '直接被叼走', when: () => D.id === 'battle', fn: () => B && end(false) },
      { label: '松果 +300', when: () => D.id === 'battle', fn: () => { if (B) { B.cones += 300; B.dirty = true; } } },
      { label: '重置演示数据', always: true, fn: () => { D.state = fresh(); D.cut('home'); } }
    ]
  };

  // ---------- 主页 ----------
  D.def('home', {
    name: '主页', seed: 3, render: () => byId.home.draw(), enter() {
      D.hot(210, 1066, 330, 118, () => D.cut('match'), '开始冬眠');
      D.hot(36, 1078, 156, 94, () => D.toast(D.state.fur >= 12 ? '「当黄大仙」演示版没做' : `再攒 ${12 - D.state.fur} 根黄大仙的毛就能当它`));
      D.hot(558, 1078, 156, 94, () => D.toast('好友房：演示版没做'));
      D.hot(0, 1218, 150, 116, () => D.cut('shop'), '小卖部');
      [['窝', 150], ['伙伴', 450], ['排行', 600]].forEach(([n, x]) => D.hot(x, 1218, 150, 116, () => D.toast(`「${n}」演示版没做`)));
      D.hot(18, 526, 68, 90, () => {
        if (D.state.signed) return D.toast('今天已经签过了');
        D.state.signed = true; D.state.nut += 30; D.go('home'); D.toast('签到成功：榛子 +30');
      }, '签到');
      ['任务', '图鉴', '信箱'].forEach((n, i) => D.hot(18, 626 + i * 100, 68, 90, () => D.toast(`「${n}」演示版没做`)));
      amb.snow(46, 0, 486); amb.zzz(470, 800); amb.fireflies(5, 392, 760, 180, 60);
      // 暗处的眼睛眨一下
      const blink = D.el(`<rect x="676" y="978" width="50" height="22" fill="#2b1d14"/>`);
      blink.layer.animate([{ opacity: 1 }, { opacity: 1, offset: .045 }, { opacity: 0, offset: .05 }, { opacity: 0 }], { duration: 3200, iterations: Infinity });
      D.glow('M226 1072 C300 1086 450 1086 524 1072 C536 1100 536 1150 524 1178 C450 1164 300 1164 226 1178 C214 1150 214 1100 226 1072Z', '#fff3b0', 5);
    }
  });

  // ---------- 匹配：一个个洞亮起来 ----------
  D.def('match', {
    name: '匹配', seed: 7, render: () => P.match({ found: 1, noText: true }), enter() {
      const txt = D.group();
      let found = 1, t = 0;
      const draw = () => { txt.innerHTML = P.matchText(found, Math.floor(t)); };
      draw();
      const next = () => {
        if (found >= 6) { D.toast('人齐了，开睡！'); return D.after(900, () => D.cut('battle')); }
        const [hx, hy] = P.holeXY(found), hole = D.el(P.matchHole(found, true));
        hole.layer.style.transformOrigin = `${hx}px ${hy}px`;
        hole.layer.animate([{ scale: '.3', opacity: 0 }, { scale: '1.15', opacity: 1, offset: .6 }, { scale: '1', opacity: 1 }], { duration: 320, easing: 'ease-out' });
        D.ring(hx, hy, '#ffe9a6', 110, 450, 6);
        found++; draw();
        D.after(420 + Math.random() * 300, next);
      };
      D.after(600, next);
      D.loop(dt => { t += dt; });
      amb.snow(30, 40, 330); amb.twinkle([[90, 90, 6], [300, 70, 5], [700, 260, 6], [480, 120, 4]]);
      D.hot(265, 1172, 220, 72, () => D.cut('home'), '取消');
      D.hot(580, 1068, 96, 48, () => D.toast('演示版只有仓鼠阿糯'));
    }
  });

  // ---------- 战斗 ----------
  const SPEC = {
    sling: { name: '松果弹弓', cd: .8, range: 380, dmg: 14, info: '每 0.8 秒打黄大仙一下' },
    hive: { name: '蜂窝', cd: 1, range: 420, dmg: 24, info: '放蜂去蜇，要 2 点萤火' },
    shroom: { name: '瞌睡菇', info: '黄大仙挠门变慢，要 1 点萤火' },
    spider: { name: '织补蜘蛛', info: '每秒给门补 12' },
    lamp: { name: '萤火灯', info: '萤火上限 +4' },
    burr: { name: '栗子刺球', info: '门被挠穿时扎黄大仙一下，用掉就没了' }
  };
  function newBattle() {
    return {
      t: 0, total: 120, cones: 80, nestLv: 1, doorLv: 1, doorHp: BT.doorMax[0], grid: {}, sel: null,
      w: { x: -100, y: 505, state: 'enter', lv: 1, hp: 450, max: 450, wait: 0, anim: 0, face: 1 },
      shots: [], cds: {}, repels: 0, builds: 0, scratch: 0, over: false, dirty: true, hitT: 0
    };
  }
  const flyCap = () => 4 + 4 * Object.values(B.grid).filter(b => b === 'lamp').length;
  const flyUsed = () => Object.values(B.grid).reduce((a, b) => a + (b === 'hive' ? 2 : b === 'shroom' ? 1 : 0), 0);
  const rate = () => Math.round(BT.nestRate[B.nestLv - 1] * 1.1);
  const doorMax = () => BT.doorMax[B.doorLv - 1];
  const wMax = lv => Math.round(450 * Math.pow(1.45, lv - 1));
  const wAtk = lv => 26 * Math.pow(1.35, lv - 1);
  let G = {}, spr = {};

  D.def('battle', { name: '战斗', seed: 5, render: () => P.page(P.battleStatic(), { paper: { vig: .3 } }), enter: start });

  function start() {
    B = newBattle();
    window.__B = B;
    G = {};
    spr.claw = D.sprite('wclaw', P.weasel(0, 0, .95), [-80, -122, 200, 230]);
    spr.walk = D.sprite('wwalk', P.weasel(0, 0, .95, { claw: false }), [-80, -122, 200, 230]);
    spr.cone = D.sprite('cone', P.ICON.cone(0, 0, .6), [-14, -18, 28, 36]);
    spr.bee = D.sprite('bee', P.bee(0, 0), [-12, -14, 24, 24]);
    ['nest', 'door', 'sel'].forEach(k => { G[k] = D.group(); });
    // 设施：每块空地一张图
    G.b = {};
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
      if (BT.isNest(c, r)) continue;
      const [x, y] = BT.tile(c, r), im = D.image(bUrl('sling'), BBOX);
      D.move(im, x + 38, y + 42); im.style.display = 'none'; G.b[c + ',' + r] = im;
    }
    // 黄大仙：图（会翻面）+ 血条（不翻面）
    G.w = D.unit(); B.wImg = D.image(spr.walk, [-80, -122, 200, 230], G.w);
    G.wb = D.unit();
    G.wb.innerHTML = `<div class="tagx" style="left:-118px;top:0;font-family:${SK.FONTS.hupo};font-size:18px">黄大仙</div><div class="bar" style="left:-63px;top:-6px;width:126px;height:12px;border-radius:6px"><i style="border-radius:6px"></i></div><div class="tagx lv" style="left:98px;top:0;font-family:${SK.FONTS.hupo};font-size:15px;background:${C.red};padding:3px 10px;border-radius:12px;border:2px solid ${SK.INK};text-shadow:none">Lv.1</div>`;
    B.wFill = G.wb.querySelector('.bar i'); B.wLv = G.wb.querySelector('.lv');
    ['hud', 'panel'].forEach(k => { G[k] = D.group(); });
    hotspots();
    drawAll();
    D.loop(tick);
    D.toast('先点洞里一块空地造个弹弓');
    amb.zzz(560, 880);
    B.coinT = 0;
  }
  const BBOX = [-40, -50, 80, 92];
  const bUrl = b => D.sprite('b-' + b, P.BUILD[b](0, 0, 1.05), BBOX);
  function drawAll() { tiles(); nestG(); doorG(); hud(); panel(); }
  function st() {
    return {
      grid: B.grid, sel: B.sel, nestLv: B.nestLv, rate: rate(), doorLv: B.doorLv, doorHp: B.doorHp, doorMax: doorMax(), scratch: B.w.state === 'attack',
      spider: Object.values(B.grid).includes('spider') && B.doorHp < doorMax(), left: B.total - B.t, frac: Math.min(1, B.t / B.total), cones: B.cones,
      flyUsed: flyUsed(), flyCap: flyCap(), warn: warnText()
    };
  }
  function warnText() {
    const w = B.w;
    if (w.state === 'attack') return '黄大仙正在挠你的门！';
    if (w.state === 'scareA') return '黄大仙在挠刺刺家的门';
    if (w.state === 'toMe') return '黄大仙朝你家来了！';
    if (w.state === 'rest') return `黄大仙在养伤，${Math.ceil(w.wait)} 秒后回来`;
    return '';
  }
  function tiles() {
    Object.entries(G.b).forEach(([k, im]) => {
      const b = B.grid[k] || '';
      if (im.dataset.k === b) return;
      const had = im.dataset.k;
      im.dataset.k = b;
      if (!b) {
        if (had) im.animate([{ scale: '1', opacity: 1 }, { scale: '1.4', opacity: 0 }], { duration: 220 }).onfinish = () => { if (!im.dataset.k) im.style.display = 'none'; };
        else im.style.display = 'none';
        return;
      }
      im.src = bUrl(b); im.style.display = '';
      im.animate([{ scale: '.2', opacity: 0, translate: '0 -40px' }, { scale: '1.2', opacity: 1, translate: '0 0', offset: .6 }, { scale: '1', opacity: 1, translate: '0 0' }], { duration: 340, easing: 'ease-out' });
    });
    G.sel.innerHTML = P.bTiles({ grid: {}, sel: B.sel });
    G.sel.layer.getAnimations().forEach(a => a.cancel());
    if (B.sel) D.idle(G.sel.layer, [{ opacity: .55 }, { opacity: 1 }], 450);
  }
  const nestG = () => { G.nest.innerHTML = P.bNest(st()); };
  let doorKey = '', hudKey = '', panelKey = '';
  function doorG(force) {
    const s = st(), k = [Math.ceil(s.doorHp / s.doorMax * 60), s.doorLv, s.scratch, s.spider].join();
    if (k === doorKey && !force) return;
    doorKey = k; G.door.innerHTML = P.bDoor(s);
  }
  function hud() {
    const s = st(), k = [Math.floor(s.left), Math.floor(s.cones), s.rate, s.flyUsed, s.flyCap, s.warn].join();
    if (k === hudKey) return;
    hudKey = k; G.hud.innerHTML = P.bHud(s);
  }
  function panel() {
    const s = st(), k = [s.sel, BT.cards.map(c => s.cones >= c[2]).join(), s.flyCap - s.flyUsed, s.nestLv, s.doorLv, s.cones >= (BT.nestCost[s.nestLv - 1] || 1e9), s.cones >= (BT.doorCost[s.doorLv - 1] || 1e9)].join('|');
    if (k === panelKey) return;
    panelKey = k; G.panel.innerHTML = P.bPanel(s);
  }

  // ---------- 点哪儿 ----------
  function hotspots() {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
      if (BT.isNest(c, r)) continue;
      const [x, y] = BT.tile(c, r);
      D.hot(x, y, 76, 76, () => tapTile(c, r));
    }
    const [nx, ny] = BT.tile(4, 2);
    D.hot(nx, ny, 158, 158, () => talk(540, 860, '呼……（睡着就在攒松果）', 2000));
    BT.cards.forEach((cd, i) => D.hot(36 + i * 114, 1134, 104, 126, () => build(i), cd[1]));
    D.hot(672, 1088, 60, 46, () => { B.sel = null; tiles(); panel(); });
    D.hot(36, 1274, 250, 48, upNest, '升级窝');
    D.hot(298, 1274, 250, 48, upDoor, '加固门');
    D.hot(560, 1274, 154, 48, shout, '喊话');
    D.hot(320, 620, 110, 56, () => D.toast(`门 Lv.${B.doorLv}：${Math.ceil(B.doorHp)} / ${doorMax()}`));
  }
  function tapTile(c, r) {
    if (B.over) return;
    const k = c + ',' + r, b = B.grid[k];
    if (b) { B.sel = null; tiles(); panel(); D.bounce(G.b[k], 1.2, 220); return D.toast(`${SPEC[b].name}：${SPEC[b].info}`); }
    B.sel = B.sel && B.sel[0] === c && B.sel[1] === r ? null : [c, r];
    tiles(); panel();
  }
  function build(i) {
    if (B.over) return;
    const [b, name, cost, fly] = BT.cards[i];
    if (!B.sel) return D.toast('先点洞里一块空地');
    if (B.cones < cost) return D.toast(`松果不够，还差 ${Math.ceil(cost - B.cones)}`);
    if (flyCap() - flyUsed() < fly) return D.toast('萤火不够，先造一盏萤火灯');
    B.cones -= cost;
    B.grid[B.sel.join()] = b;
    B.builds++;
    const [x, y] = BT.tile(B.sel[0], B.sel[1]);
    D.float(x + 38, y + 4, `造好了 ${name}`, { font: 'hupo', size: 20, fill: '#fff', life: .9 });
    D.ring(x + 38, y + 40, '#fff3b0', 60);
    B.sel = null;
    tiles(); panel(); hud(); doorG(true);
  }
  function upNest() {
    const cost = BT.nestCost[B.nestLv - 1];
    if (!cost) return D.toast('窝已经是最好的了');
    if (B.cones < cost) return D.toast(`松果不够，还差 ${Math.ceil(cost - B.cones)}`);
    B.cones -= cost; B.nestLv++;
    nestG(); panel(); hud();
    G.nest.layer.style.transformOrigin = '540px 936px'; D.bounce(G.nest.layer, 1.1, 300); D.ring(540, 930, '#fff3b0', 110, 500);
    D.toast(`换成${BT.nestName[B.nestLv - 1]}：每秒 +${rate()} 松果`);
  }
  function upDoor() {
    const cost = BT.doorCost[B.doorLv - 1];
    if (!cost) return D.toast('门已经最结实了');
    if (B.cones < cost) return D.toast(`松果不够，还差 ${Math.ceil(cost - B.cones)}`);
    B.cones -= cost; B.doorLv++; B.doorHp = doorMax();
    doorG(true); panel(); hud();
    G.door.layer.style.transformOrigin = '375px 648px'; D.bounce(G.door.layer, 1.12, 300); D.ring(375, 648, '#fff3b0', 90, 450);
    D.toast(`门加固到 Lv.${B.doorLv}，顺手修满了`);
  }
  function shout() {
    talk(540, 850, '救命！黄大仙来了！', 1800);
    D.after(700, () => talk(560, 300, '顶住！', 1400));
  }
  function talk(x, y, text, ms) {
    const w = 28 + text.length * 20;
    const g = D.el(P.bubble(x - w / 2, y - 52, w, 44, text, { size: 18, tail: [x, y - 2] }));
    g.layer.style.transformOrigin = `${x}px ${y}px`;
    g.layer.animate([{ scale: '.3', opacity: 0 }, { scale: '1.08', opacity: 1, offset: .6 }, { scale: '1', opacity: 1 }], { duration: 260, easing: 'ease-out' });
    D.after(ms, () => { g.layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200 }).onfinish = () => g.remove(); });
  }

  // ---------- 每帧 ----------
  let uiT = 0;
  function tick(dt) {
    if (B.over) return;
    B.t += dt; uiT += dt;
    B.cones += rate() * dt;
    B.coinT += dt;
    if (B.coinT > 2) { B.coinT = 0; D.fly(spr.cone, [-14, -18, 28, 36], [520, 860], [50, 178], 700, () => { G.hud.layer.style.transformOrigin = '60px 178px'; }, { spin: 360 }); }
    const spiders = Object.values(B.grid).filter(b => b === 'spider').length;
    if (spiders && B.doorHp < doorMax()) B.doorHp = Math.min(doorMax(), B.doorHp + 12 * spiders * dt);
    weaselTick(dt);
    turrets(dt);
    shotsTick(dt);
    if (B.t >= B.total) return end(true);
    if (uiT > .15) { uiT = 0; hud(); panel(); doorG(); }
  }
  function goTo(x, speed, dt) {
    const w = B.w, d = x - w.x;
    w.face = d < 0 ? -1 : 1;
    if (Math.abs(d) <= speed * dt) { w.x = x; return true; }
    w.x += Math.sign(d) * speed * dt;
    return false;
  }
  function weaselTick(dt) {
    const w = B.w;
    w.anim += dt;
    let walking = false;
    if (w.state === 'enter') { walking = true; if (goTo(150, 150, dt)) { w.state = 'scareA'; w.wait = 5; } }
    else if (w.state === 'scareA') {
      w.wait -= dt;
      if (Math.random() < dt * 2) D.float(150 + Math.random() * 40 - 20, 430, '-' + Math.round(wAtk(w.lv) / 2), { font: 'hupo', size: 20 });
      if (w.wait <= 0) w.state = 'toMe';
    } else if (w.state === 'toMe') { walking = true; if (goTo(375, 150, dt)) { w.state = 'attack'; D.toast('黄大仙开始挠你的门了！'); } }
    else if (w.state === 'attack') {
      const shrooms = Object.values(B.grid).filter(b => b === 'shroom').length;
      const slow = Math.max(.5, 1 - .25 * shrooms);
      B.doorHp -= wAtk(w.lv) * slow * dt; B.scratch += 3 * dt; B.hitT += dt;
      if (B.hitT > .5) {
        B.hitT = 0;
        D.float(375 + Math.random() * 60 - 30, 622, '-' + Math.round(wAtk(w.lv) * slow / 2), { font: 'hupo', size: 22, fill: '#fff' });
        D.shake(3, 140); G.door.layer.style.transformOrigin = '375px 648px'; D.bounce(G.door.layer, .95, 140);
        if (B.doorHp < doorMax() * .3) D.flash('#d9573f', 300);
      }
      if (B.doorHp <= 0) breach();
      else if (w.hp <= w.max * .25) flee('黄大仙被打跑了！');
    } else if (w.state === 'flee') { walking = true; if (goTo(-130, 230, dt)) { w.state = 'rest'; w.wait = 9; D.toast('黄大仙去养伤了，抓紧升级！'); } }
    else if (w.state === 'rest') {
      w.wait -= dt;
      if (w.wait <= 0) { w.lv = Math.min(8, w.lv + 1); w.max = wMax(w.lv); w.hp = w.max; w.state = 'toMe'; D.toast(`黄大仙 Lv.${w.lv} 回来了！`); }
    }
    // 画：只改 transform
    const atDoor = w.state === 'attack', clawing = atDoor || w.state === 'scareA';
    const y = atDoor ? 532 + Math.sin(w.anim * 18) * 3 : 505 + (walking ? -Math.abs(Math.sin(w.anim * 9)) * 9 : Math.sin(w.anim * 3) * 2);
    const want = clawing ? 'c' : 'w';
    if (B.wImg.dataset.k !== want) { B.wImg.dataset.k = want; B.wImg.src = clawing ? spr.claw : spr.walk; }
    D.move(G.w, w.x, y, ` scale(${w.face},1) rotate(${walking ? (Math.sin(w.anim * 9) * 5).toFixed(1) : atDoor ? (Math.sin(w.anim * 18) * 2).toFixed(1) : 0}deg)`);
    D.move(G.wb, w.x, y - 132);
    B.wFill.style.transform = `scaleX(${Math.max(0, w.hp / w.max).toFixed(3)})`;
    if (B.wLv.textContent !== `Lv.${w.lv}`) B.wLv.textContent = `Lv.${w.lv}`;
    G.wb.style.opacity = w.state === 'rest' || w.x < -20 ? 0 : 1;
    w.y = y;
  }
  function flee(msg) {
    const w = B.w;
    w.state = 'flee'; B.repels++;
    D.ring(w.x, w.y - 40, '#fff', 120, 400, 8);
    D.toast(msg);
  }
  function breach() {
    const burrs = Object.entries(B.grid).filter(([, b]) => b === 'burr');
    if (burrs.length) {
      const dmg = 280 * burrs.length;
      burrs.forEach(([k]) => delete B.grid[k]);
      B.w.hp -= dmg;
      D.float(375, 600, `栗子刺球 -${dmg}`, { font: 'hupo', size: 32, fill: C.red, life: 1 }); D.shake(14, 380); D.flash('#ffffff', 300); D.ring(375, 620, C.green, 140, 450, 10);
      B.doorHp = doorMax() * .3;
      tiles(); doorG(true);
      flee('黄大仙踩到刺球，嗷一声跑了！');
      return;
    }
    end(false);
  }
  // 设施出手
  function turrets(dt) {
    const w = B.w, targetable = ['attack', 'toMe', 'scareA', 'flee'].includes(w.state) && w.x > -40;
    Object.entries(B.grid).forEach(([k, b]) => {
      const sp = SPEC[b];
      if (!sp.cd) return;
      B.cds[k] = (B.cds[k] || 0) - dt;
      if (B.cds[k] > 0 || !targetable) return;
      const [c, r] = k.split(',').map(Number), [x, y] = BT.tile(c, r), sx = x + 38, sy = y + 30;
      if (Math.hypot(w.x - sx, w.y - sy) > sp.range) return;
      B.cds[k] = sp.cd;
      D.bounce(G.b[k], 1.18, 180);
      const el = D.image(b === 'sling' ? spr.cone : spr.bee, b === 'sling' ? [-14, -18, 28, 36] : [-12, -14, 24, 24]);
      B.shots.push({ el, x0: sx, y0: sy, t: 0, dur: b === 'sling' ? .45 : .7, dmg: sp.dmg, kind: b, wob: Math.random() * 6 });
    });
  }
  function shotsTick(dt) {
    const w = B.w;
    B.shots = B.shots.filter(s => {
      s.t += dt;
      const k = Math.min(1, s.t / s.dur), tx = w.x, ty = w.y - 20;
      const x = s.x0 + (tx - s.x0) * k, y = s.y0 + (ty - s.y0) * k - Math.sin(k * Math.PI) * (s.kind === 'sling' ? 90 : 40) + (s.kind === 'hive' ? Math.sin(s.t * 20 + s.wob) * 8 : 0);
      D.move(s.el, x, y, s.kind === 'sling' ? ` rotate(${(s.t * 720).toFixed(0)}deg)` : '');
      if (k >= 1) {
        s.el.remove();
        if (['attack', 'toMe', 'scareA', 'flee'].includes(w.state)) {
          w.hp -= s.dmg;
          B.wImg.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.9)' }, { filter: 'brightness(1)' }], { duration: 150 });
          D.ring(tx, ty, s.kind === 'hive' ? C.yellow : '#fff', 34, 220, 4);
          D.float(tx + Math.random() * 40 - 20, ty - 60, (s.kind === 'hive' ? '蜂蜇 -' : '-') + s.dmg, { font: 'hupo', size: s.kind === 'hive' ? 24 : 20, fill: s.kind === 'hive' ? C.red : '#fff', life: .6 });
          if (w.state !== 'flee' && w.hp <= w.max * .25) flee('黄大仙被打跑了！');
        }
        return false;
      }
      return true;
    });
  }

  function end(win) {
    if (B.over) return;
    B.over = true;
    const s = D.state;
    s.last = { repels: B.repels, builds: B.builds, scratch: Math.round(B.scratch), left: Math.max(0, B.total - B.t) };
    if (win) { s.nut += 80; s.honey += 2; s.fur = Math.min(12, s.fur + 1); s.stars = Math.min(3, s.stars + 1); } else s.nut += 20;
    const dim = D.el(`<rect width="750" height="1334" fill="${win ? '#fff6d0' : '#000'}" opacity="${win ? .5 : .45}"/>`);
    dim.layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'forwards' });
    const g = D.el(P.g(T(375, 640, win ? '春天来了！' : '被叼走了……', { size: 92, font: 'hupo', mid: true, fill: win ? C.green : C.cream, stroke: SK.INK, sw: 7 }), 'filter="url(#wob)"'));
    g.layer.style.transformOrigin = '375px 640px';
    g.layer.animate([{ opacity: 0, scale: '.4', rotate: '-6deg' }, { opacity: 1, scale: '1.12', rotate: '2deg', offset: .65 }, { opacity: 1, scale: '1', rotate: '0deg' }], { duration: 480, easing: 'ease-out', fill: 'forwards' });
    if (!win) D.shake(8, 300);
    setTimeout(() => { if (D.id === 'battle') D.cut(win ? 'win' : 'lose'); }, 1400);
  }

  // ---------- 结算 ----------
  D.def('win', {
    name: '结算 · 春天来了', seed: 13, render: () => byId.win.draw(), enter() {
      let doubled = false;
      D.hot(46, 1120, 292, 96, () => { if (doubled) return D.toast('已经领过了'); doubled = true; D.state.nut += 80; D.toast('看完广告：榛子再 +80'); }, '双倍领取');
      D.hot(360, 1110, 344, 116, () => D.cut('match'), '再睡一冬');
      D.hot(270, 1272, 100, 36, () => D.cut('home'), '回窝里');
      D.hot(390, 1272, 100, 36, () => D.toast('截了张图，可以分享给好友'), '晒一晒');
      amb.petals(34); amb.twinkle([[620, 150, 14], [180, 160, 10], [560, 300, 8]]);
      D.glow('M376 1116 C450 1130 600 1130 688 1116 C700 1144 700 1196 688 1222 C600 1208 450 1208 376 1222 C364 1196 364 1144 376 1116Z', '#ffffff', 5);
    }
  });
  D.def('lose', {
    name: '结算 · 被叼走', seed: 19, render: () => byId.lose.draw(), enter() {
      D.hot(46, 1140, 292, 92, () => D.toast('观战：演示版没做'), '观战到春天');
      D.hot(360, 1128, 344, 112, () => D.cut('match'), '再来一局');
      D.hot(320, 1274, 110, 36, () => D.cut('home'), '回窝里');
      amb.snow(40, 0, 440);
    }
  });

  // ---------- 小卖部 ----------
  D.def('shop', {
    name: '小卖部', seed: 17, render: () => byId.shop.draw(), enter() {
      P.shopItems().forEach(([, name, ic, price, sold], i) => {
        const x = 140 + (i % 3) * 235, base = i < 3 ? 860 : 1070;
        D.hot(x - 100, base - 150, 200, 236, () => {
          if (sold) return D.toast('卖光啦，明天再来');
          if (D.state.bought[name]) return D.toast(`「${name}」已经买过了`);
          if (!ic) return D.toast('演示版不接支付');
          const honey = ic === P.ICON.honey, cost = parseInt(price, 10);
          if ((honey ? D.state.honey : D.state.nut) < cost) return D.toast(honey ? '蜂蜜不够' : '榛子不够');
          if (honey) D.state.honey -= cost; else D.state.nut -= cost;
          D.state.bought[name] = true;
          if (name.startsWith('黄大仙的毛')) D.state.fur = Math.min(12, D.state.fur + 3);
          D.go('shop');
          D.toast(`买到「${name}」`);
        }, name);
      });
      D.hot(540, 634, 154, 70, () => D.toast(D.state.honey >= 60 ? '云朵窝演示版先不卖' : `蜂蜜不够，还差 ${60 - D.state.honey}`), '买云朵窝');
      amb.zzz(244, 590); amb.twinkle([[86, 530, 6], [270, 524, 7], [250, 676, 5], [180, 518, 6]]);
      [['窝', 228], ['门', 374], ['伙伴', 520], ['道具', 666]].forEach(([n, x]) => D.hot(x - 50, 418, 100, 44, () => D.toast(`「${n}」页演示版没做`)));
      D.hot(300, 1170, 150, 164, () => D.cut('home'), '冬眠');
      [['窝', 150], ['伙伴', 450], ['排行', 600]].forEach(([n, x]) => D.hot(x, 1218, 150, 116, () => D.toast(`「${n}」演示版没做`)));
    }
  });

  D.go('home');
})();
