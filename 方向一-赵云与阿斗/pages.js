/* 方向一《赵云与阿斗》· 西游画风
   人物和玩法照原作：赵云、阿斗、刀枪骑弓、凑名字召武将、花馒头征兵、阿斗三条命。
   只把画面换成西游的样子：Q版人物配京剧脸谱、祥云、天宫的金瓦红柱、平涂加粗描边。
   第三版：每个形状加了背光暗边和受光亮边（光从左上来），盔甲、衣服、按钮、兵牌加了纹样和厚度。 */
(function () {
  const S = SK, T = S.text;
  SK.INK = '#2b1a12';
  const INK = SK.INK, N = S.N;
  const C = {
    paper: '#fbf2dc', cream: '#fff8e8', red: '#d6402b', red2: '#a92e1f', gold: '#f2b53a', gold2: '#c98219', goldL: '#ffe28c',
    blue: '#2f6db0', blue2: '#8cc3e3', navy: '#25356e', green: '#36a07c', green2: '#a8dcc0', orange: '#ec8a2e', purple: '#7a55a8',
    pink: '#f4a29b', skin: '#fde3c8', white: '#ffffff', silver: '#eef2f6', grey: '#9a8c7c', cloud: '#fffbf2', cloudS: '#cfe6ee', wood: '#b9773b', jade: '#4fa58a'
  };
  const W = 750, H = 1334;
  const ST = () => (window.Demo && window.Demo.state) || {};
  const fmt = n => Number(n).toLocaleString('en-US');
  const g = (inner, a = '') => `<g ${a}>${inner}</g>`;
  const at = (x, y, s = 1, r = 0) => `transform="translate(${N(x)} ${N(y)})${s !== 1 ? ` scale(${s})` : ''}${r ? ` rotate(${r})` : ''}"`;
  const fl = (d, fill, w = 3) => `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
  const ln = (d, w = 2.6, col = INK) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const circ = (x, y, r, fill, w = 3) => fl(`M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`, fill, w);
  const ell = (x, y, rx, ry, fill, w = 3) => fl(`M${x - rx} ${y}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`, fill, w);
  const dot = (x, y, r, col = INK) => `<circle cx="${N(x)}" cy="${N(y)}" r="${r}" fill="${col}"/>`;
  // 带体积的形状；渐变底色要给 shade/light
  const fv = (d, fill, o = {}) => S.vol(d, Object.assign({ fill, k: 5, sw: 3 }, o));
  const GOLD = { shade: '#b06a12', light: '#fff8d2' }, REDV = { shade: '#7e2012', light: '#ff9478' }, SILV = { shade: '#a3b7ca', light: '#ffffff' }, SKIN = { shade: '#eeae86', light: '#fff7ec' };
  const rr = (x, y, w, h, r) => `M${N(x + r)} ${N(y)}H${N(x + w - r)}Q${N(x + w)} ${N(y)} ${N(x + w)} ${N(y + r)}V${N(y + h - r)}Q${N(x + w)} ${N(y + h)} ${N(x + w - r)} ${N(y + h)}H${N(x + r)}Q${N(x)} ${N(y + h)} ${N(x)} ${N(y + h - r)}V${N(y + r)}Q${N(x)} ${N(y)} ${N(x + r)} ${N(y)}Z`;
  let clipN = 0;
  const clipTo = (d, inner) => { const id = 'ct' + (++clipN); return `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`; };
  const tileGrad = (id, a, b, c) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;
  const GRAD = `
<linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc4dc"/><stop offset=".5" stop-color="#d4ece6"/><stop offset="1" stop-color="#fbf0d6"/></linearGradient>
<linearGradient id="duskG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22336e"/><stop offset=".6" stop-color="#6a56a0"/><stop offset="1" stop-color="#ebb497"/></linearGradient>
<linearGradient id="greyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#76849c"/><stop offset="1" stop-color="#dcd8cd"/></linearGradient>
<linearGradient id="goldG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2b0"/><stop offset=".45" stop-color="#f7c445"/><stop offset="1" stop-color="#d4861a"/></linearGradient>
<linearGradient id="redG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ec5f44"/><stop offset="1" stop-color="#b02e1d"/></linearGradient>
<linearGradient id="blueG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f93d4"/><stop offset="1" stop-color="#28599a"/></linearGradient>
<linearGradient id="creamG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffdf4"/><stop offset="1" stop-color="#f3e2bd"/></linearGradient>
<linearGradient id="lacquerG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c63a26"/><stop offset="1" stop-color="#8e2214"/></linearGradient>
<linearGradient id="glossG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="pillG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2a52" stop-opacity=".8"/><stop offset="1" stop-color="#1f1426" stop-opacity=".85"/></linearGradient>
<linearGradient id="jadeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc8ab"/><stop offset="1" stop-color="#3a8a70"/></linearGradient>
<linearGradient id="mtnG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fc0c8"/><stop offset="1" stop-color="#cfe6e2" stop-opacity="0"/></linearGradient>
${tileGrad('tRed', '#f37a5c', '#d6402b', '#a92e1f')}${tileGrad('tBlue', '#5fa2e0', '#2f6db0', '#22508a')}${tileGrad('tGreen', '#5fc79f', '#36a07c', '#25775a')}
${tileGrad('tOrange', '#ffb45e', '#ec8a2e', '#bd6716')}${tileGrad('tPurple', '#a483cf', '#7a55a8', '#583c80')}${tileGrad('tBrown', '#b89270', '#8b6a45', '#654a2e')}
<radialGradient id="sunG"><stop offset="0" stop-color="#fff6c8"/><stop offset=".45" stop-color="#ffe08a" stop-opacity=".85"/><stop offset="1" stop-color="#ffe08a" stop-opacity="0"/></radialGradient>
<radialGradient id="haloG"><stop offset=".55" stop-color="#ffe9a0" stop-opacity=".95"/><stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/></radialGradient>
<radialGradient id="rougeG"><stop offset="0" stop-color="#ee6f62" stop-opacity=".7"/><stop offset=".6" stop-color="#f48a7c" stop-opacity=".45"/><stop offset="1" stop-color="#f6a090" stop-opacity="0"/></radialGradient>
<radialGradient id="blushG"><stop offset="0" stop-color="#f06a5a" stop-opacity=".55"/><stop offset="1" stop-color="#f06a5a" stop-opacity="0"/></radialGradient>
<pattern id="yunP" width="64" height="48" patternUnits="userSpaceOnUse"><path d="M8 30 c0 -10 12 -12 14 -4 c2 -10 16 -10 16 0 M22 26 c-3 -3 -1 -7 3 -6 M40 40 c0 -8 10 -9 12 -3 c2 -8 12 -6 11 2" fill="none" stroke="#c98219" stroke-width="1.6" stroke-linecap="round"/></pattern>`;

  // 背景：天色 + 一层细纸纹
  function bg(kind = 'sky') {
    const fill = { sky: 'url(#skyG)', dusk: 'url(#duskG)', grey: 'url(#greyG)', paper: C.paper }[kind];
    return `<rect width="${W}" height="${H}" fill="${C.paper}"/><rect width="${W}" height="${H}" fill="${fill}"/>` +
      `<rect width="${W}" height="${H}" filter="url(#grain)" opacity=".14"/><rect width="${W}" height="${H}" filter="url(#fiber)" opacity=".07"/>`;
  }
  const page = (inner, kind) => S.svg(W, H, bg(kind) + inner, GRAD);

  // ============ 西游的零件 ============
  // 如意祥云
  function xy(x, y, s = 1, o = {}) {
    const body = 'M10 30 C-4 30 -5 10 10 8 C13 -7 37 -8 41 8 C47 -5 68 -3 67 12 C80 6 95 15 89 27 C87 33 80 35 74 33 Z';
    const curls = 'M30 18 C24 14 25 6 32 7 C38 8 39 16 33 19 M79 27 C75 23 77 17 83 19 M54 16 C51 12 54 8 58 10';
    const tail = 'M89 27 C104 31 114 23 128 27';
    const w = 2.8 / s;
    return g(fv(body, o.fill || C.cloud, { shade: o.shade || C.cloudS, light: '#fff', k: 4, sw: w }) +
      `<path d="${curls}" fill="none" stroke="${o.curl || C.blue}" stroke-width="${w * .8}" stroke-linecap="round"/>` +
      (o.tail === false ? '' : `<path d="${tail}" fill="none" stroke="${INK}" stroke-width="${w * .8}" stroke-linecap="round"/>`),
      `${o.flip ? `transform="translate(${x} ${y}) scale(${-s} ${s})"` : at(x, y, s)} filter="url(#wob)"${o.op != null ? ` opacity="${o.op}"` : ''}`);
  }
  // 一团云（顶上一串鼓包），底下压一道影
  function puff(x, y, w, h, o = {}) {
    const n = o.n || Math.max(3, Math.round(w / 64)), step = w / n, b = y + h;
    let d = `M${x} ${b - h * .28}`;
    for (let i = 0; i < n; i++) {
      const x1 = x + step * (i + 1), y1 = i === n - 1 ? b - h * .28 : y + h * (.3 + (i % 2) * .12);
      d += ` A${N(step * .64)} ${N(step * .64)} 0 0 1 ${N(x1)} ${N(y1)}`;
    }
    d += ` Q${x + w + 8} ${b} ${x + w - 24} ${b} L${x + 24} ${b} Q${x - 8} ${b} ${x} ${b - h * .28}Z`;
    let s = fv(d, o.fill || C.cloud, { shade: o.shade || C.cloudS, light: '#ffffff', k: Math.max(4, h * .16), ky: 1.6, sw: o.sw || 3 });
    s += ln(`M${x + w * .2} ${b - h * .3} q${step * .2} ${-h * .14} ${step * .4} 0 M${x + w * .6} ${b - h * .34} q${step * .2} ${-h * .14} ${step * .4} 0`, 2, o.shade || '#a9cfdb');
    return g(s, `filter="url(#wob)"${o.op != null ? ` opacity="${o.op}"` : ''}`);
  }
  // 远山剪影
  function farHills(y, o = {}) {
    let d = `M-20 ${y + 120}`;
    const pk = o.peaks || [[60, 60], [170, 120], [260, 40], [380, 150], [470, 70], [590, 130], [700, 50], [770, 90]];
    pk.forEach(([px, ph]) => { d += ` Q${px - 40} ${y + 120 - ph * .3} ${px} ${y + 120 - ph}`; });
    d += ` L770 ${y + 220} L-20 ${y + 220}Z`;
    return `<path d="${d}" fill="url(#mtnG)" opacity="${o.op || .8}" filter="url(#wob2)"/>`;
  }
  // 仙山：浮空的小岛，顶上一棵松
  function isle(x, y, s = 1) {
    let p = fv('M-70 0 C-60 -30 -30 -46 0 -48 C30 -46 60 -30 70 0 C50 30 30 70 0 96 C-26 66 -52 30 -70 0Z', '#c4aa82', { shade: '#8a7254', light: '#ecd9b6', k: 9 });
    p += ln('M-40 18 L-30 46 M-6 30 L-10 70 M24 22 L30 50 M-20 12 L-14 28', 2, '#8a7254');
    p += fv('M-70 0 C-60 -30 -30 -46 0 -48 C30 -46 60 -30 70 0 C40 10 -40 10 -70 0Z', C.green, { shade: '#25775a', light: '#8fe0bb', k: 5 });
    p += fv('M9 -40 L12 -92 L18 -92 L19 -42Z', '#7a4a2a', { k: 2, sw: 2.4 });
    p += fv('M-20 -68 Q14 -100 48 -68 Q14 -78 -20 -68Z', C.green, { shade: '#25775a', light: '#8fe0bb', k: 3, sw: 2.4 }) + fv('M-12 -86 Q14 -114 42 -86 Q14 -94 -12 -86Z', C.green, { shade: '#25775a', light: '#8fe0bb', k: 3, sw: 2.4 });
    p += ln('M-40 92 C-36 120 -44 150 -40 180', 3, '#bfe0ea') + ln('M-34 96 C-30 124 -36 150 -32 176', 1.6, '#fff');
    return g(p, `${at(x, y, s)} filter="url(#wob)"`);
  }
  // 天宫式门楼（牌匾上写长坂坡）
  function gate(x, y, s = 1, plaque = '长坂坡') {
    let p = '';
    [-118, 118].forEach(px => {
      p += fv(`M${px - 16} -60 L${px + 16} -60 L${px + 16} 120 L${px - 16} 120Z`, C.red, { shade: '#8a2414', light: '#ff8a6a', k: 7 });
      p += fv(`M${px - 22} 100 L${px + 22} 100 L${px + 24} 124 L${px - 24} 124Z`, '#c9b79a', { k: 3, sw: 2.4 });
      p += fv(`M${px - 20} -60 L${px + 20} -60 L${px + 18} -48 L${px - 18} -48Z`, 'url(#goldG)', Object.assign({ k: 2, sw: 2.4 }, GOLD));
    });
    p += fv('M-150 -60 L150 -60 L140 -42 L-140 -42Z', C.blue, { k: 3 });
    for (let i = -6; i <= 6; i++) p += ln(`M${i * 22 - 6} -51 l6 -4 l6 4 l-6 4Z`, 1.4, C.goldL);
    p += fv('M-188 -88 Q-160 -96 -150 -112 L150 -112 Q160 -96 188 -88 Q170 -70 150 -66 L-150 -66 Q-170 -70 -188 -88Z', 'url(#goldG)', Object.assign({ k: 7 }, GOLD));
    p += fv('M-120 -112 Q0 -152 120 -112Z', 'url(#goldG)', Object.assign({ k: 6 }, GOLD));
    for (let i = -6; i <= 6; i++) p += ln(`M${i * 22} -112 L${i * 24} -70`, 1.6, '#b06a12');
    for (let i = -7; i <= 7; i++) p += `<circle cx="${i * 22}" cy="-68" r="5" fill="url(#goldG)" stroke="${INK}" stroke-width="1.6"/>`;
    p += ln('M-196 -86 q-14 -18 4 -26 q8 -2 8 6', 3) + ln('M196 -86 q14 -18 -4 -26 q-8 -2 -8 6', 3);
    p += fv(S.circD(0, -150, 9), 'url(#goldG)', Object.assign({ k: 3, sw: 2.4 }, GOLD));
    p += fv('M-64 -42 L64 -42 L64 -2 L-64 -2Z', C.navy, { shade: '#141d44', light: '#4a5ca8', k: 4 });
    p += `<rect x="-58" y="-37" width="116" height="30" fill="none" stroke="${C.gold}" stroke-width="1.8"/>`;
    p += S.text(0, -21, plaque, { size: 24, font: 'wei', fill: C.goldL, mid: true, ls: 6 });
    return g(p, `${at(x, y, s)} filter="url(#wob)"`);
  }
  // 金光放射
  function rays(x, y, r, n = 18, op = .35) {
    let p = '';
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2, b = a + Math.PI / n * .55;
      p += `<path d="M${x} ${y} L${N(x + Math.cos(a) * r)} ${N(y + Math.sin(a) * r)} L${N(x + Math.cos(b) * r)} ${N(y + Math.sin(b) * r)}Z" fill="#fff3b8"/>`;
    }
    return g(p, `opacity="${op}"`);
  }
  // 小闪光
  function sparkle(x, y, r = 10, col = '#fff') {
    return `<path d="M${x} ${y - r} Q${x + r * .18} ${y - r * .18} ${x + r} ${y} Q${x + r * .18} ${y + r * .18} ${x} ${y + r} Q${x - r * .18} ${y + r * .18} ${x - r} ${y} Q${x - r * .18} ${y - r * .18} ${x} ${y - r}Z" fill="${col}"/>`;
  }

  // ============ 人物（Q版圆脸） ============
  const pom = (x, y, r, col = C.red) => fl(S.circD(x, y, r), col, 1.8);
  // 统一的脸：圆脸、豆豆眼、腮红、小嘴；平涂 + 粗描边，只在下巴压一道浅影
  const SKC = '#ffe4c8', SKC_S = '#f6c9a6', HAIR = '#3a2418', BLUSH = '#ffa797';
  function face(o = {}) {
    const fc = o.skin || SKC;
    let p = fl(S.ellD(0, 6, 36, 33), fc, 3);
    p += `<path d="M-30 20 Q0 44 30 20 Q0 36 -30 20Z" fill="${o.shade || SKC_S}" opacity=".7"/>`;
    p += `<ellipse cx="-22" cy="17" rx="6.5" ry="4" fill="${BLUSH}" opacity=".85"/><ellipse cx="22" cy="17" rx="6.5" ry="4" fill="${BLUSH}" opacity=".85"/>`;
    return p;
  }
  function beanEyes(o = {}) {
    const y = o.ey || 8, dx = o.edx || 13;
    if (o.closed) return ln(`M${-dx - 6} ${y} Q${-dx} ${y + 4} ${-dx + 6} ${y}`, 3) + ln(`M${dx - 6} ${y} Q${dx} ${y + 4} ${dx + 6} ${y}`, 3);
    if (o.happy) return ln(`M${-dx - 6} ${y + 2} Q${-dx} ${y - 5} ${-dx + 6} ${y + 2}`, 3.2) + ln(`M${dx - 6} ${y + 2} Q${dx} ${y - 5} ${dx + 6} ${y + 2}`, 3.2);
    const r = o.big ? 1.3 : 1;
    let p = '';
    [-1, 1].forEach(d => { if (o.patch && d === -1) return; p += `<ellipse cx="${d * dx}" cy="${y}" rx="${4.4 * r}" ry="${5.8 * r}" fill="${INK}"/>` + dot(d * dx - 1.6 * r, y - 2.2 * r, 1.8 * r, '#fff'); });
    return p;
  }
  const smile = (o = {}) => o.shout ? fl('M-7 18 Q0 30 7 18Z', '#e0503c', 2.2) : o.grin ? fl('M-8 18 Q0 26 8 18Z', '#fff', 2) : ln('M-4 18 Q0 22 4 18', 2.6);
  // 赵云：银盔红缨，刘海，眉毛一挑
  function zhaoyun(x, y, s = 1, o = {}) {
    let p = '';
    [-1, 1].forEach(d => { p += fl(`M${d * 34} 0 C${d * 44} 14 ${d * 40} 26 ${d * 28} 30 L${d * 24} 6Z`, '#f4f7fb', 2.6); });
    p += face();
    p += fl('M-33 -6 Q-27 10 -19 2 Q-13 11 -5 1 Q3 11 11 2 Q19 10 33 -6Z', HAIR, 2);
    p += beanEyes(o) + ln('M-20 -3 L-8 -1 M20 -3 L8 -1', 2.8) + smile(o);
    p += fl('M-38 -4 C-40 -44 40 -44 38 -4 Q0 -18 -38 -4Z', '#f4f7fb', 3);
    p += `<path d="M-26 -30 Q-12 -38 2 -38" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`;
    p += fl('M-38 -5 Q0 -20 38 -5 L37 2 Q0 -12 -37 2Z', C.gold, 2.4) + fl(S.circD(0, -10, 5), C.red, 2);
    p += ln('M0 -40 L0 -48', 3) + fl('M0 -46 C-12 -52 -10 -70 2 -76 C0 -66 10 -64 8 -56 C14 -58 14 -50 8 -46Z', C.red, 2.4);
    return g(p, `${at(x, y, s)} filter="url(#wob)"`);
  }
  // 阿斗：双丫髻、眉心红点、红肚兜
  function adou(x, y, s = 1, o = {}) {
    let p = '';
    if (o.body) {
      [-1, 1].forEach(d => { p += fl(`M${d * 18} 70 C${d * 20} 90 ${d * 14} 98 ${d * 6} 98 L${d * 4} 76Z`, SKC, 2.4); });
      p += fl('M-22 30 C-30 50 -28 74 0 80 C28 74 30 50 22 30Z', SKC, 2.6);
      p += fl('M0 33 L27 54 L0 81 L-27 54Z', C.red, 2.6) + ln('M0 39 L21 54 L0 75 L-21 54Z', 1.6, C.goldL);
      p += T(0, 56, '斗', { size: 17, font: 'wei', mid: true, fill: C.goldL });
      const arm = o.cheer ? ['M-22 38 C-36 26 -42 10 -40 0', 'M22 38 C36 26 42 10 40 0'] : ['M-22 38 C-34 44 -38 54 -32 62', 'M22 38 C34 44 38 54 32 62'];
      arm.forEach(a => { p += ln(a, 12, INK) + ln(a, 8.4, SKC); });
      if (o.bun) p += mantou(o.cheer ? 42 : 34, o.cheer ? -6 : 64, .8);
    }
    [-1, 1].forEach(d => { p += fl(S.circD(d * 24, -30, 12), HAIR, 2.4) + fl(`M${d * 15} -26 l${d * 8} -6 l${d * 2} 8Z`, C.red, 1.6); });
    p += fl(S.circD(0, 2, 36), SKC, 3) + `<path d="M-28 18 Q0 42 28 18 Q0 32 -28 18Z" fill="${SKC_S}" opacity=".7"/>`;
    p += fl('M-13 -32 C-7 -21 7 -21 13 -32 C6 -37 -6 -37 -13 -32Z', HAIR, 1.8);
    p += dot(0, -14, 3.8, C.red);
    if (o.cry) {
      p += ln('M-20 2 L-8 6 M20 2 L8 6', 3);
      p += `<path d="M-15 8 q-5 14 0 20 q5 -6 0 -20Z M15 8 q-5 14 0 20 q5 -6 0 -20Z" fill="#7cc4ea" stroke="${INK}" stroke-width="1.4"/>`;
      p += fl('M-9 22 Q0 12 9 22 Q0 28 -9 22Z', '#e0503c', 2);
    } else {
      p += beanEyes({ happy: o.happy, ey: 4, edx: 13 });
      p += fl('M-7 15 Q0 25 7 15Z', '#e0503c', 2);
    }
    p += `<ellipse cx="-23" cy="14" rx="7" ry="4.4" fill="${BLUSH}" opacity=".85"/><ellipse cx="23" cy="14" rx="7" ry="4.4" fill="${BLUSH}" opacity=".85"/>`;
    return g(p, `${at(x, y, s)} filter="url(#wob)"`);
  }
  // 关羽：绿巾、红润脸、眯眯眼、长胡子
  function guanyu(x, y, s = 1) {
    let p = fl('M-22 20 C-26 44 -12 64 0 72 C12 64 26 44 22 20 Q0 32 -22 20Z', HAIR, 2.6) + ln('M-8 36 C-9 48 -6 58 -2 64 M8 36 C9 48 6 58 2 64', 1.6, '#6a5248');
    p += face({ skin: '#f6b296', shade: '#e8957a' });
    p += beanEyes({ closed: true }) + fl('M-24 -4 L-8 -1 L-9 2 L-24 -1Z', HAIR, 1.4) + fl('M24 -4 L8 -1 L9 2 L24 -1Z', HAIR, 1.4);
    p += fl('M-14 17 Q-4 13 0 16 Q4 13 14 17 Q4 19 0 19 Q-4 19 -14 17Z', HAIR, 1.6);
    p += fl('M-38 -2 C-40 -42 40 -42 38 -2 Q0 -15 -38 -2Z', '#4fae7c', 3) + `<path d="M-24 -26 Q-10 -34 4 -34" fill="none" stroke="#a8e8c4" stroke-width="4" stroke-linecap="round"/>`;
    p += fl('M-38 -3 Q0 -17 38 -3 L37 3 Q0 -11 -37 3Z', C.gold, 2.2);
    return g(p, `${at(x, y, s)} filter="url(#wob)"`);
  }
  // 张飞：黑脸膛换成小麦色，圆眼、粗眉、一圈刺刺的胡子
  function zhangfei(x, y, s = 1) {
    let beard = 'M-32 10';
    for (let i = 0; i <= 12; i++) { const a = Math.PI * (1 - i / 12), r = i % 2 ? 36 : 46; beard += ` L${N(Math.cos(a) * r * .86)} ${N(12 + Math.sin(a) * r)}`; }
    let p = fl(beard + 'Z', HAIR, 2.4);
    p += face({ skin: '#f3cfa8', shade: '#e3b088' });
    p += beanEyes({ big: true }) + fl('M-24 -6 L-6 0 L-7 4 L-25 -2Z', HAIR, 1.4) + fl('M24 -6 L6 0 L7 4 L25 -2Z', HAIR, 1.4);
    p += fl('M-8 18 Q0 26 8 18Z', '#e0503c', 2);
    p += fl('M-38 -4 C-40 -42 40 -42 38 -4 Q0 -16 -38 -4Z', '#2f2a2a', 3) + `<path d="M-24 -28 Q-10 -36 4 -36" fill="none" stroke="#6a6060" stroke-width="4" stroke-linecap="round"/>`;
    p += fl('M30 -18 L46 -26 L44 -12Z', '#2f2a2a', 2);
    return g(p, `${at(x, y, s)} filter="url(#wob)"`);
  }
  // 黄忠：金盔、白眉白须、笑眯眯
  function huangzhong(x, y, s = 1) {
    let p = fl('M-24 16 C-26 38 -10 54 0 58 C10 54 26 38 24 16 Q0 28 -24 16Z', '#f4f1ea', 2.6);
    p += face();
    p += beanEyes({ happy: true }) + fl('M-26 -2 Q-16 -10 -6 -2 Q-16 -4 -26 -2Z', '#f4f1ea', 1.8) + fl('M26 -2 Q16 -10 6 -2 Q16 -4 26 -2Z', '#f4f1ea', 1.8);
    p += fl('M-14 16 Q-4 11 0 15 Q4 11 14 16 Q4 19 0 18 Q-4 19 -14 16Z', '#f4f1ea', 1.6);
    p += fl('M-38 -4 C-40 -44 40 -44 38 -4 Q0 -18 -38 -4Z', C.gold, 3) + `<path d="M-24 -28 Q-10 -36 4 -36" fill="none" stroke="#fff3b8" stroke-width="4" stroke-linecap="round"/>`;
    p += ln('M0 -40 L0 -48', 3) + fl(S.circD(0, -52, 6), C.red, 2.2);
    return g(p, `${at(x, y, s)} filter="url(#wob)"`);
  }
  // 刘备：大耳朵、金冠、小胡子
  function liubei(x, y, s = 1) {
    let p = fl(S.circD(-36, 8, 11), SKC, 2.6) + fl(S.circD(36, 8, 11), SKC, 2.6);
    p += face();
    p += beanEyes() + ln('M-20 -1 L-8 0 M20 -1 L8 0', 2.6);
    p += fl('M-12 16 Q-4 13 0 15 Q4 13 12 16 Q4 18 0 17 Q-4 18 -12 16Z', HAIR, 1.4) + ln('M-3 22 Q0 25 3 22', 2.2);
    p += fl('M-30 -6 L-28 -38 L-14 -28 L0 -46 L14 -28 L28 -38 L30 -6 Q0 -16 -30 -6Z', C.gold, 3) + fl(S.circD(0, -22, 5), C.red, 2);
    return g(p, `${at(x, y, s)} filter="url(#wob)"`);
  }
  // 夏侯惇（对手）：曹营蓝盔、独眼罩、坏笑
  function xiahou(x, y, s = 1, o = {}) {
    let p = '';
    [-1, 1].forEach(d => { p += fl(`M${d * 34} 0 C${d * 44} 14 ${d * 40} 26 ${d * 28} 30 L${d * 24} 6Z`, '#3d64a8', 2.6); });
    p += face();
    p += fl('M-33 -6 Q-26 8 -18 1 Q-12 9 -4 0 Q4 9 12 1 Q20 8 33 -6Z', HAIR, 2);
    p += beanEyes({ patch: true }) + ln('M20 -4 L8 0', 2.8);
    p += fl(S.ellD(-13, 8, 9, 8), INK, 2) + ln('M-22 4 L-36 -6 M-4 4 L18 -10', 2.2);
    p += o.shout ? fl('M-7 18 Q0 30 7 18Z', '#e0503c', 2.2) : ln('M-4 19 Q3 23 8 16', 2.6);
    p += fl('M-38 -4 C-40 -44 40 -44 38 -4 Q0 -18 -38 -4Z', '#3d64a8', 3) + `<path d="M-26 -30 Q-12 -38 2 -38" fill="none" stroke="#8cb4e8" stroke-width="4" stroke-linecap="round"/>`;
    p += fl('M-38 -5 Q0 -20 38 -5 L37 2 Q0 -12 -37 2Z', '#c9d4e0', 2.4) + fl(S.circD(0, -10, 5), C.gold, 2);
    p += ln('M0 -40 L0 -48', 3) + fl('M0 -46 C-10 -52 -8 -68 2 -74 C0 -64 10 -62 8 -54 C14 -56 14 -48 8 -46Z', '#2a2a3a', 2.4);
    return g(p, `${at(x, y, s)} filter="url(#wob)"`);
  }
  // 曹冲（对手要守的孩子）：一个发髻、蓝衣，抱着小木象
  function caochong(x, y, s = 1, o = {}) {
    let p = '';
    if (o.body) {
      p += fl('M-22 30 C-30 50 -28 74 0 80 C28 74 30 50 22 30Z', '#5b86c4', 2.6) + ln('M0 32 L0 78', 2, '#c9d4e0');
      p += fl('M-20 56 L20 56 L20 76 L-20 76Z', '#b9b2a6', 2.2) + fl(S.circD(-20, 54, 6), '#b9b2a6', 2) + ln('M-26 58 q-6 6 -2 12', 2.4);
    }
    p += fl(S.circD(0, -36, 11), HAIR, 2.4) + fl('M-8 -30 L8 -30 L6 -24 L-6 -24Z', C.blue, 1.8);
    p += fl(S.circD(0, 2, 36), SKC, 3) + `<path d="M-28 18 Q0 42 28 18 Q0 32 -28 18Z" fill="${SKC_S}" opacity=".7"/>`;
    p += fl('M-30 -12 Q-20 -2 -10 -10 Q0 -2 10 -10 Q20 -2 30 -12 Q20 -32 0 -34 Q-20 -32 -30 -12Z', HAIR, 2);
    p += o.cry ? ln('M-20 4 L-8 8 M20 4 L8 8', 3) + `<path d="M-15 10 q-5 14 0 20 q5 -6 0 -20Z M15 10 q-5 14 0 20 q5 -6 0 -20Z" fill="#7cc4ea" stroke="${INK}" stroke-width="1.4"/>` : beanEyes({ ey: 6 }) + ln('M-4 18 Q0 22 4 18', 2.4);
    p += `<ellipse cx="-23" cy="15" rx="7" ry="4.4" fill="${BLUSH}" opacity=".85"/><ellipse cx="23" cy="15" rx="7" ry="4.4" fill="${BLUSH}" opacity=".85"/>`;
    return g(p, `${at(x, y, s)} filter="url(#wob)"`);
  }
  const GENERAL = { zhaoyun: ['赵云', zhaoyun, '赵', '云'], guanyu: ['关羽', guanyu, '关', '羽'], zhangfei: ['张飞', zhangfei, '张', '飞'], huangzhong: ['黄忠', huangzhong, '黄', '忠'], liubei: ['刘备', liubei, '刘', '备'], xiahou: ['夏侯惇', xiahou, '夏', '惇'] };
  // 一条胳膊：肩 → 肘 → 手，袖子 + 护腕 + 拳头。两条胳膊的上臂、小臂各自一样长
  function arm(S0, E, Hd, o = {}) {
    const col = o.col || '#bcd3ea', d = `M${S0[0]} ${S0[1]} L${E[0]} ${E[1]} L${Hd[0]} ${Hd[1]}`;
    const at2 = t => [N(E[0] + (Hd[0] - E[0]) * t), N(E[1] + (Hd[1] - E[1]) * t)];
    let p = `<path d="${d}" fill="none" stroke="${INK}" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
    p += `<path d="M${at2(.55)} L${at2(.72)}" stroke="${INK}" stroke-width="17" stroke-linecap="butt"/><path d="M${at2(.58)} L${at2(.69)}" stroke="${o.cuff || C.gold}" stroke-width="12"/>`;
    p += fl(S.circD(Hd[0], Hd[1], 8.5), SKC, 2.4);
    return p;
  }
  // 全身模板：首页那个赵云的身形，换配色、换头、换手里拿的、换左手姿势
  // pose: 'baby' 左小臂托着阿斗 / 'cheer' 左拳举高 / 'hip' 左手叉腰；weapon: 'spear' 银枪 / 'banner' 魏字旗
  const PAL = {
    zhaoyun: { cape: C.red, capeLine: '#a92e1f', armor: '#e6edf4', plate: '#9fb3c6', skirt: '#3d6fb6', flap: '#dfe7ef', legs: '#2f3a5a', belt: C.gold, buckle: C.jade, mirror: C.gold, mirrorIn: C.red, scarf: C.red, knot: '#c23a26', sleeve: '#bcd3ea', cuff: C.gold, pad: C.gold, head: (o) => zhaoyun(0, -96, 1.5, o) },
    xiahou: { cape: '#2f3550', capeLine: '#1d2238', armor: '#5b86c4', plate: '#2f4f8a', skirt: '#2f3550', flap: '#7fa2d4', legs: '#2a2a3a', belt: '#c9d4e0', buckle: C.blue, mirror: '#c9d4e0', mirrorIn: C.blue, scarf: '#2f3550', knot: '#1d2238', sleeve: '#3d64a8', cuff: '#c9d4e0', pad: '#c9d4e0', head: (o) => xiahou(0, -96, 1.5, o) }
  };
  function general(kind, x, y, s = 1, o = {}) {
    const K = PAL[kind], pose = o.pose || 'baby', weapon = o.weapon || 'spear';
    let p = '';
    // 披风（在身后，往右飘）
    p += fl('M26 -40 C54 -34 76 0 90 46 C96 66 100 84 104 98 C88 92 76 98 60 96 C56 74 48 50 34 20Z', K.cape, 2.8);
    p += fl('M-28 -40 C-40 -24 -44 2 -42 30 L-30 16Z', K.cape, 2.4);
    p += ln('M48 10 C62 40 70 70 74 94 M66 0 C80 30 88 60 94 90', 2.2, K.capeLine);
    // 右手拿的
    if (weapon === 'none') { /* 空手 */ }
    else if (weapon === 'spear') {
      p += ln('M60 112 L64 -222', 8) + ln('M60 112 L64 -222', 4.4, '#e6ebf0');
      p += fl('M64 -222 C55 -236 58 -254 65 -264 C72 -254 74 -236 67 -222Z', '#f4f7fb', 2.6) + fl('M56 -222 L74 -222 L72 -212 L58 -212Z', C.gold, 2);
      p += fl('M64 -210 C48 -194 52 -176 58 -168 C60 -182 66 -190 70 -194 C72 -184 76 -176 74 -166 C82 -182 78 -202 64 -210Z', C.red, 2.2);
    } else {
      p += ln('M60 112 L64 -236', 8) + ln('M60 112 L64 -236', 4.4, '#8a6a4a') + fl(S.circD(64, -240, 6), '#c9d4e0', 2);
      p += fl('M66 -230 C96 -236 126 -224 152 -230 L148 -150 C122 -144 94 -156 66 -150Z', '#2f3550', 2.8);
      p += fl('M66 -162 C94 -168 122 -156 149 -162 L148 -150 C122 -144 94 -156 66 -150Z', C.gold, 2);
      p += S.text(108, -194, '魏', { size: 40, font: 'wei', mid: true, fill: C.goldL });
    }
    // 腿和靴
    p += fl('M-22 60 L-6 60 L-7 84 L-23 84Z', K.legs, 2.4) + fl('M6 60 L22 60 L23 84 L7 84Z', K.legs, 2.4);
    p += fl('M-24 82 L-5 82 L-5 98 L-31 98 Q-31 88 -24 82Z', '#2a1d18', 2.4) + fl('M5 82 L24 82 Q31 88 31 98 L5 98Z', '#2a1d18', 2.4);
    p += fl('M-32 98 L-4 98 L-4 103 L-32 103Z', '#fff', 2) + fl('M4 98 L32 98 L32 103 L4 103Z', '#fff', 2);
    // 战裙
    p += fl('M-29 34 L29 34 L34 64 L-34 64Z', K.skirt, 2.6);
    p += fl('M-30 34 L-11 34 L-13 62 L-36 60Z', K.flap, 2.2) + fl('M30 34 L11 34 L13 62 L36 60Z', K.flap, 2.2);
    p += ln('M-31 44 L-12 44 M-33 53 L-12 53 M31 44 L12 44 M33 53 L12 53', 1.6, K.plate);
    // 身甲
    p += fl('M-34 -38 C-38 -20 -36 6 -29 30 L29 30 C36 6 38 -20 34 -38 Q0 -46 -34 -38Z', K.armor, 3);
    p += ln('M-24 -18 q6 5 12 0 q6 5 12 0 q6 5 12 0 q6 5 12 0 M-22 2 q6 5 11 0 q6 5 11 0 q6 5 11 0 q6 5 11 0', 1.6, K.plate);
    p += fl(S.circD(0, -10, 9), K.mirror, 2.4) + fl(S.circD(0, -10, 4), K.mirrorIn, 1.6);
    p += fl('M-31 26 L31 26 L32 36 L-32 36Z', K.belt, 2.4) + fl(S.ellD(0, 31, 7, 4.4), K.buckle, 1.6);
    // 脖子 + 领巾
    p += fl('M-9 -52 L9 -52 L10 -34 L-10 -34Z', SKC, 2.4);
    p += fl('M-18 -42 Q0 -30 18 -42 L15 -31 Q0 -22 -15 -31Z', K.scarf, 2.2);
    p += fl('M6 -30 C18 -26 30 -24 42 -30 L40 -21 C30 -16 18 -18 6 -24Z', K.scarf, 2) + fl(S.circD(4, -28, 4.5), K.knot, 1.8);
    // 左手：托阿斗 / 举拳 / 叉腰（三种都是上臂 32 左右、小臂 31 左右）
    if (pose === 'baby') { p += adou(-70, -58, .66, { body: true, happy: true, bun: true }); p += arm([-35, -30], [-51, -2], [-82, -8], { col: K.sleeve, cuff: K.cuff }); }
    else if (pose === 'cheer') p += arm([-35, -30], [-56, -54], [-60, -86], { col: K.sleeve, cuff: K.cuff });
    else p += arm([-35, -30], [-58, -8], [-30, 16], { col: K.sleeve, cuff: K.cuff });
    p += arm([35, -30], [51, -2], [60, 28], { col: K.sleeve, cuff: K.cuff });
    // 护肩
    p += fl('M-20 -42 C-40 -48 -54 -38 -52 -22 C-44 -18 -36 -22 -30 -28Z', K.pad, 2.4) + fl('M20 -42 C40 -48 54 -38 52 -22 C44 -18 36 -22 30 -28Z', K.pad, 2.4);
    p += K.head(o);
    return g(p, `${at(x, y, s)}`);
  }
  const zhaoyunFull = (x, y, s = 1, o = {}) => general('zhaoyun', x, y, s, o);
  const xiahouFull = (x, y, s = 1, o = {}) => general('xiahou', x, y, s, Object.assign({ pose: 'hip', weapon: 'banner' }, o));

  // ============ 敌人：曹兵（打我方）/ 蜀兵（打对手） ============
  function caobing(x, y, s = 1, o = {}) {
    const tunic = o.boss ? '#7a55a8' : o.shu ? '#3f9a6a' : '#3d64a8', hat = o.shu ? '#2f7a52' : '#2f3550';
    let p = ln('M12 32 L22 -50', 4.6) + ln('M12 32 L22 -50', 2.6, '#c9a26a') + fl('M22 -50 L17 -62 L27 -65 L26 -52Z', '#e6ebf0', 1.8) + ln('M22 -48 l-6 10 M22 -48 l2 12', 2.2, C.red);
    p += fl(o.step ? 'M-12 24 L-4 24 L-6 36 L-14 36Z' : 'M-11 24 L-3 24 L-3 36 L-11 36Z', '#3a2a24', 1.6) + fl(o.step ? 'M4 24 L12 24 L14 34 L6 34Z' : 'M3 24 L11 24 L11 36 L3 36Z', '#3a2a24', 1.6);
    p += fl('M-17 -2 L17 -2 L21 26 L-21 26Z', tunic, 2.6) + fl('M-19 12 L19 12 L19 17 L-19 17Z', C.gold, 1.8);
    p += ln('M14 4 C20 10 20 18 16 22', 7.4, INK) + ln('M14 4 C20 10 20 18 16 22', 4.2, tunic);
    p += fl(S.circD(0, -18, 18), SKC, 2.6) + `<ellipse cx="-10" cy="-10" rx="4" ry="2.6" fill="${BLUSH}"/><ellipse cx="10" cy="-10" rx="4" ry="2.6" fill="${BLUSH}"/>`;
    p += `<ellipse cx="-6.5" cy="-16" rx="2.6" ry="3.4" fill="${INK}"/><ellipse cx="6.5" cy="-16" rx="2.6" ry="3.4" fill="${INK}"/>` + ln('M-11 -23 L-3 -21 M11 -23 L3 -21', 2.2) + ln('M-3 -8 Q1 -6 4 -9', 1.8);
    if (o.boss) p += fl(S.circD(0, -18, 18), SKC, 2.6) + `<ellipse cx="-10" cy="-10" rx="4" ry="2.6" fill="${BLUSH}"/><ellipse cx="10" cy="-10" rx="4" ry="2.6" fill="${BLUSH}"/>` + `<ellipse cx="-6.5" cy="-16" rx="2.6" ry="3.4" fill="${INK}"/><ellipse cx="6.5" cy="-16" rx="2.6" ry="3.4" fill="${INK}"/>` + ln('M-12 -24 L-3 -20 M12 -24 L3 -20', 2.6) + fl('M-6 -9 Q0 -3 6 -9Z', '#fff', 1.6) + fl(S.circD(0, -38, 5), HAIR, 2) + ln('M-14 -34 q14 -6 28 0', 2, HAIR);
    else p += fl('M-19 -24 C-19 -42 19 -42 19 -24Z', hat, 2.4) + fl(S.circD(0, -42, 4.5), C.red, 1.6);
    return g(p, `${at(x, y, s)} filter="url(#wob)"`);
  }

  // ============ 小图标 ============
  function mantou(x, y, s = 1) {
    return g(fv('M-16 8 C-18 -6 -9 -14 0 -14 C9 -14 18 -6 16 8 C10 12 -10 12 -16 8Z', '#fff6e6', { k: 3.4, shade: '#e8cfa6', light: '#fff', sw: 2.4 }) +
      ln('M-6 -16 C-8 -22 -4 -26 -6 -30 M4 -16 C2 -22 6 -26 4 -30', 1.8, C.blue2) + ln('M-8 -8 q4 -4 8 -2', 1.2, '#e8cfa6'), `${at(x, y, s)} filter="url(#wob)"`);
  }
  function yuanbao(x, y, s = 1) {
    return g(fv('M-20 -2 C-22 10 -10 16 0 16 C10 16 22 10 20 -2 C12 2 -12 2 -20 -2Z', 'url(#goldG)', Object.assign({ k: 3, sw: 2.4 }, GOLD)) + fv('M-11 -1 C-12 -14 12 -14 11 -1 C6 1 -6 1 -11 -1Z', 'url(#goldG)', Object.assign({ k: 2.4, sw: 2.2 }, GOLD)) +
      sparkle(-4, -8, 3.4), `${at(x, y, s)} filter="url(#wob)"`);
  }
  function peach(x, y, s = 1, on = true) {
    const d = 'M0 -14 C14 -14 18 4 10 12 C6 16 2 17 0 18 C-2 17 -6 16 -10 12 C-18 4 -14 -14 0 -14Z';
    if (!on) return g(fl(d, '#ddd6cc', 2) + ln('M0 -10 C-2 0 -2 8 0 16', 1.4, '#b0a698'), `${at(x, y, s)} opacity=".7"`);
    return g(fv(d, '#ffb3a6', { k: 3, shade: '#e8604f', light: '#fff0ea', sw: 2.2 }) + `<path d="M2 -10 C10 -8 12 4 7 10" fill="none" stroke="#f2665a" stroke-width="4" opacity=".5"/>` + ln('M0 -10 C-2 0 -2 8 0 16', 1.4, C.red2) +
      fv('M0 -14 C-8 -22 -18 -18 -16 -12 C-10 -10 -4 -12 0 -14Z', C.green, { k: 1.6, sw: 1.6 }) + fv('M0 -14 C6 -22 14 -22 14 -16 C10 -14 4 -14 0 -14Z', C.green, { k: 1.6, sw: 1.6 }), `${at(x, y, s)} filter="url(#wob)"`);
  }
  const ICON = {
    gift(x, y, s = 1) { return g(fv('M-16 -6 L16 -6 L16 18 L-16 18Z', 'url(#redG)', Object.assign({ k: 3, sw: 2.4 }, REDV)) + fv('M-19 -12 L19 -12 L19 -4 L-19 -4Z', C.red, { k: 2, sw: 2.2 }) + ln('M0 -12 L0 18', 3.4, C.gold) + fl('M0 -12 C-10 -24 -18 -16 -10 -12Z M0 -12 C10 -24 18 -16 10 -12Z', C.gold, 1.8), `${at(x, y, s)} filter="url(#wob)"`); },
    slips(x, y, s = 1) { let p = ''; for (let i = 0; i < 5; i++) p += fv(`M${-18 + i * 8} -16 L${-12 + i * 8} -16 L${-12 + i * 8} 16 L${-18 + i * 8} 16Z`, '#e9c98a', { k: 1.6, sw: 1.6 }); return g(p + ln('M-20 -8 L22 -8 M-20 8 L22 8', 1.6, C.red), `${at(x, y, s)} filter="url(#wob)"`); },
    mail(x, y, s = 1) { return g(fv('M-18 -12 L18 -12 L18 14 L-18 14Z', C.cream, { k: 3, sw: 2.4 }) + ln('M-18 -12 L0 3 L18 -12', 2) + fv(S.circD(8, 6, 5), C.red, { k: 1.4, sw: 1.4 }), `${at(x, y, s)} filter="url(#wob)"`); },
    rank(x, y, s = 1) { return g(fv('M-16 -18 L16 -18 L16 12 L0 20 L-16 12Z', 'url(#goldG)', Object.assign({ k: 3, sw: 2.4 }, GOLD)) + S.text(0, -2, '榜', { size: 16, font: 'wei', mid: true, fill: C.red2 }), `${at(x, y, s)} filter="url(#wob)"`); },
    shop(x, y, s = 1) { return g(fv('M-16 -4 L16 -4 L14 18 L-14 18Z', C.cream, { k: 3, sw: 2.4 }) + fv('M-20 -4 L-14 -18 L14 -18 L20 -4Z', 'url(#redG)', Object.assign({ k: 2, sw: 2.4 }, REDV)) + ln('M-8 -18 L-10 -4 M0 -18 L0 -4 M8 -18 L10 -4', 1.6, C.gold) + mantou(0, 8, .5), `${at(x, y, s)} filter="url(#wob)"`); },
    helmet(x, y, s = 1) { return g(fv('M-18 8 C-20 -18 20 -18 18 8 L12 10 C8 0 -8 0 -12 10Z', C.silver, Object.assign({ k: 3, sw: 2.4 }, SILV)) + fv('M-18 4 Q0 -6 18 4 L17 9 Q0 -1 -17 9Z', 'url(#goldG)', Object.assign({ k: 1.4, sw: 1.8 }, GOLD)) + ln('M0 -14 L0 -20', 2.4) + pom(0, -24, 5), `${at(x, y, s)} filter="url(#wob)"`); },
    spear(x, y, s = 1) { return g(ln('M-16 18 L14 -14', 4) + ln('M-16 18 L14 -14', 2, '#dfe5ec') + fv('M14 -14 L12 -24 L24 -26 L22 -16Z', C.silver, Object.assign({ k: 1.6, sw: 1.8 }, SILV)) + ln('M11 -12 l-8 2 M12 -10 l-4 8', 2, C.red) + ln('M16 18 L-14 -14', 4) + ln('M16 18 L-14 -14', 2, '#c9a26a') + fv('M-14 -14 L-12 -24 L-24 -26 L-22 -16Z', C.silver, Object.assign({ k: 1.6, sw: 1.8 }, SILV)), `${at(x, y, s)} filter="url(#wob)"`); },
    book(x, y, s = 1) { return g(fv('M-18 -16 L14 -16 L18 16 L-14 16Z', C.blue, { k: 3, sw: 2.4 }) + fv('M-10 -10 L6 -10 L8 4 L-8 4Z', C.cream, { k: 1.4, sw: 1.6 }) + S.text(-1, -3, '兵', { size: 10, font: 'wei', mid: true }), `${at(x, y, s)} filter="url(#wob)"`); },
    blossom(x, y, s = 1) { let p = ''; for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 - Math.PI / 2; p += fv(S.circD(N(Math.cos(a) * 9), N(Math.sin(a) * 9), 8), '#ffc2c8', { k: 2, sw: 1.8 }); } return g(p + fv(S.circD(0, 0, 5), C.gold, { k: 1.4, sw: 1.4 }), `${at(x, y, s)} filter="url(#wob)"`); },
    ad(x, y, s = 1) { return g(fv('M-16 -11 L16 -11 L16 12 L-16 12Z', C.cream, { k: 2.4, sw: 2.2 }) + `<path d="M-4 -5 L7 0 L-4 6Z" fill="${C.red}"/>`, `${at(x, y, s)} filter="url(#wob)"`); }
  };

  // ============ 按钮与框 ============
  // 金色令牌式主按钮：厚度 + 上半截高光 + 双线框 + 四角云头 + 压字
  function goldBtn(x, y, w, h, label, o = {}) {
    const r = Math.min(18, h * .2), d = rr(x, y, w, h, r);
    const fill = o.fill || 'url(#goldG)', flat = !!o.fill && !/goldG/.test(o.fill);
    let s = `<path d="${d}" fill="#2a1408" opacity=".3" transform="translate(0 7)"/>`;
    s += fv(d, fill, flat ? { k: 5, sw: 3.4 } : Object.assign({ k: 6, lk: 4, sw: 3.4 }, GOLD));
    s += clipTo(d, `<rect x="${x}" y="${y}" width="${w}" height="${N(h * .46)}" fill="url(#glossG)" opacity=".7"/>`);
    s += `<path d="${rr(x + 7, y + 7, w - 14, h - 14, r * .7)}" fill="none" stroke="#b06a12" stroke-width="2"/><path d="${rr(x + 10, y + 10, w - 20, h - 20, r * .55)}" fill="none" stroke="#fff4c4" stroke-width="1.4" opacity=".85"/>`;
    [[x + 12, y + 12, 1, 1], [x + w - 12, y + 12, -1, 1], [x + 12, y + h - 12, 1, -1], [x + w - 12, y + h - 12, -1, -1]].forEach(([cx, cy, dx, dy]) => {
      s += ln(`M${cx} ${cy + dy * 9} q0 ${-dy * 9} ${dx * 9} ${-dy * 9} q${dx * 4} 0 ${dx * 4} ${dy * 4} q0 ${dy * 3} ${-dx * 3} ${dy * 3}`, 1.8, C.red2);
    });
    const ty = y + h / 2 + (o.sub ? -10 : 1);
    s += T(x + w / 2, ty + 2, label, { size: o.size || 44, font: o.font || 'wei', mid: true, fill: '#fff6d0', ls: o.ls || 6 });
    s += T(x + w / 2, ty, label, { size: o.size || 44, font: o.font || 'wei', mid: true, fill: o.fg || C.red2, ls: o.ls || 6 });
    if (o.sub) s += T(x + w / 2, y + h - 22, o.sub, { size: 18, font: 'kai', weight: 'bold', mid: true, fill: '#8a3a12' });
    return g(s, 'filter="url(#wob)"');
  }
  function plainBtn(x, y, w, h, label, o = {}) {
    const r = Math.min(16, h * .22), d = rr(x, y, w, h, r);
    let s = `<path d="${d}" fill="#2a1408" opacity=".22" transform="translate(0 6)"/>`;
    s += fv(d, o.fill || 'url(#creamG)', { shade: '#d9c39a', light: '#fff', k: 5, sw: 3 });
    s += `<path d="${rr(x + 6, y + 6, w - 12, h - 12, r * .7)}" fill="none" stroke="${C.gold}" stroke-width="1.6" opacity=".8"/>`;
    const tx = x + w / 2 + (o.icon ? 16 : 0), ty = y + h / 2 + (o.dy || 0);
    s += T(tx, ty + 1.6, label, { size: o.size || 28, font: o.font || 'wei', mid: true, fill: '#fff', ls: o.ls || 2 });
    s += T(tx, ty, label, { size: o.size || 28, font: o.font || 'wei', mid: true, fill: o.fg || INK, ls: o.ls || 2 });
    if (o.icon) s += o.icon(x + w / 2 - (o.iconDx || 52), y + h / 2, o.iconS || 1);
    return g(s, 'filter="url(#wob)"');
  }
  function pill(x, y, w, icon, val, o = {}) {
    const d = rr(x, y, w, 40, 20);
    let s = `<path d="${d}" fill="url(#pillG)" stroke="${C.gold}" stroke-width="2.2"/><path d="M${x + 22} ${y + 5} H${x + w - 22}" stroke="#fff" stroke-width="2" opacity=".25" stroke-linecap="round"/>`;
    s += icon(x + 20, y + 20, .92);
    s += T(x + 42, y + 21, val, { size: 22, font: 'song', weight: 'bold', anchor: 'start', mid: true, fill: '#fff8e0' });
    if (o.plus !== false) s += fv(S.circD(x + w - 18, y + 20, 11), C.green, { k: 2.4, sw: 1.8, stroke: '#fff' }) + T(x + w - 18, y + 20, '+', { size: 20, font: 'hei', weight: 'bold', fill: '#fff', mid: true });
    return s;
  }
  function star(x, y, r, on) {
    const P = [];
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * .48 : r; P.push([x + rr2 * Math.cos(a), y + rr2 * Math.sin(a)]); }
    if (!on) return S.poly(P, { fill: '#fff', fo: .45, stroke: C.grey, sw: 2, passes: 1, jit: .4, step: 6 });
    const d = 'M' + P.map(p => N(p[0]) + ' ' + N(p[1])).join('L') + 'Z';
    return fv(d, 'url(#goldG)', Object.assign({ k: r * .22, sw: 2 }, GOLD));
  }
  function ribbon(x, y, w, text, o = {}) {
    const h = o.h || 40, c = o.fill || 'url(#redG)', tail = o.tailFill || '#8a2414';
    let s = fl(`M${x - w / 2 - 26} ${y + 6} L${x - w / 2} ${y - h / 2 + 6} L${x - w / 2} ${y + h / 2 + 6} L${x - w / 2 - 26} ${y + h / 2 + 14} L${x - w / 2 - 14} ${y + 10}Z`, tail, 2.6);
    s += fl(`M${x + w / 2 + 26} ${y + 6} L${x + w / 2} ${y - h / 2 + 6} L${x + w / 2} ${y + h / 2 + 6} L${x + w / 2 + 26} ${y + h / 2 + 14} L${x + w / 2 + 14} ${y + 10}Z`, tail, 2.6);
    s += fl(`M${x - w / 2} ${y + h / 2} L${x - w / 2 + 10} ${y + h / 2 + 8} L${x - w / 2 + 10} ${y + h / 2}Z M${x + w / 2} ${y + h / 2} L${x + w / 2 - 10} ${y + h / 2 + 8} L${x + w / 2 - 10} ${y + h / 2}Z`, '#5a160c', 1.6);
    const d = `M${x - w / 2} ${y - h / 2} Q${x} ${y - h / 2 - 8} ${x + w / 2} ${y - h / 2} L${x + w / 2} ${y + h / 2} Q${x} ${y + h / 2 - 8} ${x - w / 2} ${y + h / 2}Z`;
    s += fv(d, c, Object.assign({ k: 3, sw: 2.8 }, o.fill ? { shade: SK.mix(o.fill, '#000000', .3), light: SK.mix(o.fill, '#ffffff', .4) } : REDV));
    s += `<path d="M${x - w / 2 + 6} ${y - h / 2 + 4} Q${x} ${y - h / 2 - 4} ${x + w / 2 - 6} ${y - h / 2 + 4}" fill="none" stroke="${C.gold}" stroke-width="1.6"/><path d="M${x - w / 2 + 6} ${y + h / 2 - 4} Q${x} ${y + h / 2 - 12} ${x + w / 2 - 6} ${y + h / 2 - 4}" fill="none" stroke="${C.gold}" stroke-width="1.6"/>`;
    s += T(x, y - 2, text, { size: o.size || 22, font: o.font || 'wei', mid: true, fill: o.fg || C.goldL, ls: o.ls || 4 });
    return g(s, 'filter="url(#wob)"');
  }
  // 如意角花
  function ruyi(cx, cy, dx, dy, sz = 1) {
    const q = v => N(v * sz);
    return fv(`M${cx} ${cy + dy * q(30)} L${cx} ${cy + dy * q(8)} Q${cx} ${cy} ${cx + dx * q(8)} ${cy} L${cx + dx * q(30)} ${cy} Q${cx + dx * q(22)} ${cy + dy * q(6)} ${cx + dx * q(14)} ${cy + dy * q(6)} Q${cx + dx * q(6)} ${cy + dy * q(6)} ${cx + dx * q(8)} ${cy + dy * q(13)} Q${cx + dx * q(13)} ${cy + dy * q(18)} ${cx + dx * q(7)} ${cy + dy * q(20)} Q${cx + dx * q(6)} ${cy + dy * q(24)} ${cx} ${cy + dy * q(30)}Z`,
      'url(#goldG)', Object.assign({ k: 1.8, sw: 2 }, GOLD));
  }
  // 面板：米色底 + 淡云纹 + 金双线 + 如意角
  function panel(x, y, w, h, o = {}) {
    const d = rr(x, y, w, h, 22);
    let s = `<path d="${d}" fill="#2a1408" opacity=".2" transform="translate(0 8)"/>`;
    s += fv(d, o.fill || C.cream, { shade: '#e6d2a8', light: '#fff', k: 6, sw: 3 });
    s += clipTo(d, `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#yunP)" opacity=".1"/>`);
    s += `<path d="${rr(x + 8, y + 8, w - 16, h - 16, 16)}" fill="none" stroke="${C.gold2}" stroke-width="2.4"/><path d="${rr(x + 13, y + 13, w - 26, h - 26, 12)}" fill="none" stroke="${C.gold}" stroke-width="1.2" opacity=".8"/>`;
    s += ruyi(x + 6, y + 6, 1, 1) + ruyi(x + w - 6, y + 6, -1, 1) + ruyi(x + 6, y + h - 6, 1, -1) + ruyi(x + w - 6, y + h - 6, -1, -1);
    return s;
  }
  // 大标题：金字红边，压一道深色厚边，再点几颗闪光
  function title(x, y, text, o = {}) {
    const size = o.size || 100, f = o.font || 'xing';
    let s = T(x, y + size * .06, text, { size, font: f, mid: true, fill: INK, stroke: INK, sw: o.sw0 || 16, ls: o.ls || 4 });
    s += T(x, y, text, { size, font: f, mid: true, fill: INK, stroke: INK, sw: o.sw0 || 16, ls: o.ls || 4 });
    s += T(x, y, text, { size, font: f, mid: true, fill: o.fill || 'url(#goldG)', stroke: o.edge || C.red2, sw: o.sw1 || 6, ls: o.ls || 4 });
    if (o.spark !== false) s += sparkle(x - size * text.length * .33, y - size * .36, size * .12) + sparkle(x + size * text.length * .3, y - size * .2, size * .08);
    return g(s, 'filter="url(#wob)"');
  }
  function topbar(o = {}) {
    let s = fv(S.circD(70, 136, 40), 'url(#goldG)', Object.assign({ k: 4, sw: 3 }, GOLD));
    s += `<circle cx="70" cy="136" r="34" fill="${C.red2}" stroke="${INK}" stroke-width="2"/>`;
    s += `<clipPath id="avc"><circle cx="70" cy="136" r="31"/></clipPath><circle cx="70" cy="136" r="31" fill="${C.blue2}"/><g clip-path="url(#avc)">${rays(70, 150, 60, 10, .5)}${zhaoyun(70, 152, .8)}</g>`;
    s += xy(46, 166, .4, { tail: false });
    s += fv(rr(118, 98, 190, 40, 12), 'url(#pillG)', { shade: '#120a18', light: '#5a4870', k: 2, sw: 1.6, stroke: C.gold });
    s += T(132, 119, o.name || '常山小赵', { size: 26, anchor: 'start', font: 'wei', fill: '#fff8e0' });
    s += fv(rr(124, 144, 112, 26, 6), 'url(#redG)', Object.assign({ k: 2, sw: 2 }, REDV)) + T(180, 158, o.rank || '偏将军', { size: 16, font: 'kai', weight: 'bold', fill: C.goldL, mid: true });
    const stars = o.stars ?? ST().stars ?? 2;
    s += [0, 1, 2].map(i => star(256 + i * 24, 157, 10, i < stars)).join('');
    if (o.cur !== false) s += pill(410, 186, 172, (a, b, c) => mantou(a, b + 2, c), fmt(ST().mantou ?? 2380)) + pill(594, 186, 140, yuanbao, fmt(ST().yuanbao ?? 66));
    return s;
  }
  // 底部导航：天宫屋檐
  function nav(active) {
    const tabs = [['商店', ICON.shop], ['武将', ICON.helmet], ['出征', null], ['兵书', ICON.book], ['结义', ICON.blossom]];
    let s = fl('M-10 1232 L760 1232 L760 1344 L-10 1344Z', 'url(#lacquerG)', 3);
    s += `<rect x="-10" y="1232" width="770" height="112" fill="url(#yunP)" opacity=".18"/>`;
    let tiles = '';
    for (let i = 0; i < 26; i++) tiles += S.vol(`M${i * 30 - 6} 1232 a15 15 0 0 1 30 0Z`, Object.assign({ fill: 'url(#goldG)', k: 2.4, sw: 2.2 }, GOLD));
    s += g(tiles, 'filter="url(#wob)"') + fl('M-10 1226 L760 1226 L760 1234 L-10 1234Z', C.gold2, 2.4);
    [150, 300, 450, 600].forEach(x => { if (x !== 300 && x !== 450) s += `<path d="M${x} 1262 l5 6 l-5 6 l-5 -6Z" fill="${C.gold}" opacity=".8"/>`; });
    tabs.forEach(([name, ic], i) => {
      const x = 75 + i * 150, on = name === active;
      if (i === 2) {
        s += `<circle cx="${x}" cy="1246" r="70" fill="url(#haloG)" opacity="${on ? .8 : .3}"/>`;
        s += fv(S.circD(x, 1246, 56), on ? 'url(#goldG)' : 'url(#creamG)', on ? Object.assign({ k: 6, sw: 3.4 }, GOLD) : { shade: '#d9c39a', light: '#fff', k: 6, sw: 3.4 });
        s += S.circle(x, 1246, 47, { stroke: C.red, sw: 2.4, passes: 1, jit: .5 });
        s += ICON.spear(x, 1232, 1.4);
        s += T(x, 1284, '出征', { size: 24, font: 'wei', mid: true, fill: '#fff6d0' }) + T(x, 1282, '出征', { size: 24, font: 'wei', mid: true, fill: C.red2 });
        return;
      }
      if (on) s += `<ellipse cx="${x}" cy="1270" rx="58" ry="46" fill="url(#haloG)" opacity=".7"/>`;
      s += ic(x, 1266, 1.25);
      s += T(x, 1312, name, { size: 21, font: 'wei', mid: true, fill: on ? C.goldL : '#fff', stroke: INK, sw: 3 });
      if (on) s += `<path d="M${x - 14} 1326 H${x + 14}" stroke="${C.goldL}" stroke-width="3" stroke-linecap="round"/>`;
    });
    return s;
  }

  // ============ 兵牌 ============
  const KIND = { 刀: C.red, 枪: C.blue, 骑: C.green, 弓: C.orange, 铲: '#8b6a45', 农: '#7a9a3a' };
  const KGRAD = { 刀: 'tRed', 枪: 'tBlue', 骑: 'tGreen', 弓: 'tOrange', 铲: 'tBrown' };
  const NAMECH = { 赵: 'zhaoyun', 云: 'zhaoyun', 关: 'guanyu', 羽: 'guanyu', 张: 'zhangfei', 飞: 'zhangfei', 黄: 'huangzhong', 忠: 'huangzhong', 刘: 'liubei', 备: 'liubei' };
  // 兵种的暗纹（大而淡，压在字后面）
  const EMBLEM = {
    刀: 'M-26 26 L18 -18 C26 -26 34 -26 34 -18 C30 -10 22 -4 12 2 L-20 32Z',
    枪: 'M-28 28 L20 -20 M14 -26 L30 -30 L26 -14Z M-4 4 l-10 -2 M-2 6 l-2 10',
    骑: 'M-24 28 C-28 4 -18 -16 4 -26 C10 -34 18 -36 22 -30 C28 -22 32 -8 28 2 C24 8 16 8 12 4 C10 14 8 22 12 28Z',
    弓: 'M-20 -30 C14 -24 26 0 14 30 M-20 -30 L14 30 M-24 0 L22 0 M16 -6 L24 0 L16 6',
    铲: 'M0 -30 L0 6 M-12 4 L12 4 L10 24 Q0 32 -10 24Z'
  };
  // 一格：左上角坐标；u = 0 空 / 'lock' 未开垦 / {ch, lv} 兵 / {gen} 武将
  function tile(x, y, s, u, o = {}) {
    const k = s / 92, r = 14 * k;
    if (u === 0) return `<path d="${rr(x + 4, y + 4, s - 8, s - 8, 12 * k)}" fill="#ffffff" fill-opacity=".38" stroke="${C.blue}" stroke-width="2" stroke-dasharray="6 6"/>` +
      `<path d="M${x + s / 2 - 6 * k} ${y + s / 2} h${12 * k} M${x + s / 2} ${y + s / 2 - 6 * k} v${12 * k}" stroke="${C.blue2}" stroke-width="${2 * k}" stroke-linecap="round"/>`;
    if (u === 'lock') return `<path d="${rr(x + 4, y + 4, s - 8, s - 8, 12 * k)}" fill="#c8d2d0" fill-opacity=".6" stroke="${C.grey}" stroke-width="2" stroke-dasharray="3 5"/>` +
      shovel(x + s / 2, y + s / 2 - 6 * k, .8 * k, true) + T(x + s / 2, y + s - 16 * k, '开垦', { size: 14 * k, font: 'kai', weight: 'bold', fill: '#7d7468', mid: true });
    let st = '';
    const d = rr(x, y, s, s, r);
    st += `<path d="${d}" fill="#2a1408" opacity=".28" transform="translate(0 ${N(5 * k)})"/>`;
    if (u.gen) {
      const [name, fn] = GENERAL[u.gen];
      st += fv(d, 'url(#goldG)', Object.assign({ k: 4 * k, sw: 3 }, GOLD));
      const inner = rr(x + 5 * k, y + 5 * k, s - 10 * k, s - 10 * k, r * .7);
      st += clipTo(inner, `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${C.blue2}"/>` + rays(x + s / 2, y + s * .48, s * .8, 12, .55) + `<circle cx="${N(x + s / 2)}" cy="${N(y + s * .44)}" r="${N(s * .42)}" fill="url(#haloG)"/>` + fn(x + s / 2, y + s * .52, .76 * k));
      st += `<path d="${inner}" fill="none" stroke="${INK}" stroke-width="2"/>`;
      st += fv(`M${x + 4} ${y + s - 27 * k} L${x + s - 4} ${y + s - 27 * k} L${x + s - 9} ${y + s - 5} L${x + 9} ${y + s - 5}Z`, 'url(#redG)', Object.assign({ k: 2, sw: 2 }, REDV));
      st += T(x + s / 2, y + s - 15.5 * k, name, { size: 17 * k, font: 'wei', mid: true, fill: C.goldL, ls: 2 });
      if (u.lv) st += lvPips(x + s / 2, y + 9 * k, u.lv, k);
      return st;
    }
    const isName = !!NAMECH[u.ch], grad = isName ? 'tPurple' : (KGRAD[u.ch] || 'tBrown'), col = isName ? C.purple : (KIND[u.ch] || C.grey);
    st += fv(d, `url(#${grad})`, { shade: SK.mix(col, '#1a0a04', .45), light: SK.mix(col, '#ffffff', .55), k: 5 * k, lk: 3.4 * k, sw: 3 });
    if (EMBLEM[u.ch]) st += `<path d="${EMBLEM[u.ch]}" transform="translate(${N(x + s / 2)} ${N(y + s / 2)}) scale(${N(1.25 * k)})" fill="none" stroke="#fff" stroke-width="${N(4 / k)}" stroke-linecap="round" stroke-linejoin="round" opacity=".14"/>`;
    st += `<path d="${rr(x + 6 * k, y + 6 * k, s - 12 * k, s - 12 * k, r * .7)}" fill="none" stroke="${C.goldL}" stroke-width="${N(2 * k)}" opacity=".85"/>`;
    [[x + 6 * k, y + 6 * k], [x + s - 6 * k, y + 6 * k], [x + 6 * k, y + s - 6 * k], [x + s - 6 * k, y + s - 6 * k]].forEach(([cx, cy]) => { st += `<path d="M${N(cx)} ${N(cy - 3.4 * k)} l${N(3.4 * k)} ${N(3.4 * k)} l${N(-3.4 * k)} ${N(3.4 * k)} l${N(-3.4 * k)} ${N(-3.4 * k)}Z" fill="${C.goldL}"/>`; });
    st += clipTo(d, `<rect x="${x}" y="${y}" width="${s}" height="${N(s * .42)}" fill="url(#glossG)" opacity=".45"/>`);
    st += T(x + s / 2 + 1.6 * k, y + s * .47 + 2.6 * k, u.ch, { size: s * .56, font: 'wei', mid: true, fill: INK, op: .45 });
    st += T(x + s / 2, y + s * .47, u.ch, { size: s * .56, font: 'wei', mid: true, fill: '#fff', stroke: INK, sw: 5 * k });
    if (isName) st += fv(rr(x + s - 30 * k, y - 7 * k, 34 * k, 22 * k, 5 * k), 'url(#goldG)', Object.assign({ k: 1.6, sw: 1.8 }, GOLD)) + T(x + s - 13 * k, y + 4 * k, '将', { size: 14 * k, font: 'wei', mid: true, fill: C.red2 });
    else if (u.lv) st += lvPips(x + s / 2, y + s - 13 * k, u.lv, k);
    if (u.merge) st += fv(S.circD(x + s - 10 * k, y + 10 * k, 12 * k), C.goldL, { k: 2, sw: 2 }) + T(x + s - 10 * k, y + 10 * k, '合', { size: 14 * k, font: 'wei', mid: true, fill: C.red2 });
    return st;
  }
  // 等级：金菱形
  function lvPips(cx, cy, lv, k = 1) {
    let s = '';
    for (let i = 0; i < lv; i++) {
      const x = N(cx + (i - (lv - 1) / 2) * 13 * k), r = 5.4 * k;
      s += `<path d="M${x} ${N(cy - r)} L${N(x + r)} ${cy} L${x} ${N(cy + r)} L${N(x - r)} ${cy}Z" fill="${C.goldL}" stroke="${INK}" stroke-width="1.6"/><path d="M${x} ${N(cy - r + 2)} L${N(x + r - 2.4)} ${cy}" stroke="#fff" stroke-width="1.2"/>`;
    }
    return s;
  }
  const lvDots = lvPips;
  function shovel(x, y, s = 1, faint) {
    return g(ln('M0 -22 L0 6', 4, faint ? '#8a8276' : INK) + fl('M-9 4 L9 4 L7 20 Q0 26 -7 20Z', faint ? '#e6ebe9' : C.silver, 2.2) + ln('M-7 -22 L7 -22', 4, faint ? '#8a8276' : INK), `${at(x, y, s)}${faint ? ' opacity=".8"' : ''}`);
  }
  // 敌人带血条（屏幕坐标）
  function foe(x, y, f) {
    const s = f.k || 1;
    let st = `<ellipse cx="${N(x)}" cy="${N(y + 34 * s * (f.boss ? 1.5 : .9))}" rx="${N(18 * s * (f.boss ? 1.5 : 1))}" ry="${N(5 * s)}" fill="#2a1408" opacity=".22"/>`;
    st += caobing(x, y, f.boss ? 1.5 * s : .9 * s, { boss: f.boss, step: f.step, shu: f.shu });
    const bw = (f.boss ? 62 : 40) * s, by = y - (f.boss ? 98 : 64) * s;
    st += `<rect x="${N(x - bw / 2 - 1.5)}" y="${N(by - 1.5)}" width="${N(bw + 3)}" height="${N(6 * s + 3)}" rx="${3 * s + 1.5}" fill="${INK}"/><rect x="${N(x - bw / 2)}" y="${N(by)}" width="${N(bw * f.hp)}" height="${N(6 * s)}" rx="${3 * s}" fill="${C.red}"/><rect x="${N(x - bw / 2)}" y="${N(by)}" width="${N(bw * f.hp)}" height="${N(2 * s)}" rx="${s}" fill="#ff9a86"/>`;
    if (f.boss) st += T(x, by - 12 * s, f.name || '许褚', { size: 16 * s, font: 'wei', mid: true, fill: '#fff', stroke: INK, sw: 3 });
    return st;
  }

  // ============ 棋盘几何（演示也用） ============
  const GEO = {
    BW: 644, BH: 420, ts: 92, gap: 13,
    me: { ox: 53, oy: 600, k: 1, flip: false },
    opp: { ox: 375 - 644 * .78 / 2, oy: 172, k: .78, flip: true },
    path: [[29, 436], [29, 29], [615, 29], [615, 346]],
    pt(side, x, y) { const b = this[side]; if (b.flip) { x = this.BW - x; y = this.BH - y; } return [b.ox + x * b.k, b.oy + y * b.k]; },
    slot(side, c, r) {
      const b = this[side];
      let x = 66 + c * (this.ts + this.gap), y = 68 + r * (this.ts + this.gap);
      if (b.flip) { x = this.BW - x - this.ts; y = this.BH - y - this.ts; }
      return { x: b.ox + x * b.k, y: b.oy + y * b.k, s: this.ts * b.k };
    },
    pathLen() { let L = 0; for (let i = 1; i < this.path.length; i++) L += Math.hypot(this.path[i][0] - this.path[i - 1][0], this.path[i][1] - this.path[i - 1][1]); return L; },
    along(side, d) {
      let p = this.path;
      for (let i = 1; i < p.length; i++) {
        const l = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
        if (d <= l) { const t = d / l; return this.pt(side, p[i - 1][0] + (p[i][0] - p[i - 1][0]) * t, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * t); }
        d -= l;
      }
      return this.pt(side, p[p.length - 1][0], p[p.length - 1][1]);
    }
  };
  // 棋盘底：云路（描边圈 → 影圈 → 白圈，边缘是云朵鼓包、底下带影）、玉边石台、曹营、阿斗
  function boardBase(side) {
    const b = GEO[side], k = b.k;
    let out = '', shade = '', fill = '';
    const L = GEO.pathLen();
    for (let d = 0; d <= L; d += 16) {
      const [x, y] = GEO.along(side, d), r = (26 + (Math.round(d / 16) % 3) * 3) * k;
      out += `<circle cx="${N(x)}" cy="${N(y)}" r="${N(r + 3.2)}" fill="${INK}"/>`;
      shade += `<circle cx="${N(x)}" cy="${N(y)}" r="${N(r)}" fill="${C.cloudS}"/>`;
      fill += `<circle cx="${N(x - 2 * k)}" cy="${N(y - 3.5 * k)}" r="${N(r - 2 * k)}" fill="${C.cloud}"/>`;
    }
    let s = `<g filter="url(#wob)">${out}${shade}${fill}</g>`;
    for (let d = 40; d < L; d += 110) { const [x, y] = GEO.along(side, d); s += ln(`M${N(x - 10 * k)} ${N(y + 4 * k)} q${N(6 * k)} ${N(-10 * k)} ${N(14 * k)} ${N(-4 * k)}`, 2, '#a9cfdb'); }
    // 玉边石台
    const a = GEO.pt(side, 58, 58), c = GEO.pt(side, 586, 380);
    const x0 = Math.min(a[0], c[0]), y0 = Math.min(a[1], c[1]), w = Math.abs(c[0] - a[0]), h = Math.abs(c[1] - a[1]);
    s += `<path d="${rr(x0, y0, w, h, 18 * k)}" fill="#2a1408" opacity=".18" transform="translate(0 ${N(6 * k)})"/>`;
    s += fv(rr(x0, y0, w, h, 18 * k), 'url(#jadeG)', { shade: '#2a6a55', light: '#bfeedd', k: 5 * k, sw: 3 });
    s += fv(rr(x0 + 7 * k, y0 + 7 * k, w - 14 * k, h - 14 * k, 13 * k), side === 'me' ? '#f8ead0' : '#e2ecf4', { shade: side === 'me' ? '#e2cfa6' : '#c5d4e2', light: '#fff', k: -4 * k, lk: 0, sw: 2 });
    s += clipTo(rr(x0 + 7 * k, y0 + 7 * k, w - 14 * k, h - 14 * k, 13 * k), `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="url(#yunP)" opacity=".1"/>`);
    [[x0, y0], [x0 + w, y0], [x0, y0 + h], [x0 + w, y0 + h]].forEach(([cx, cy]) => { s += fv(S.circD(cx, cy, 8 * k), 'url(#goldG)', Object.assign({ k: 2 * k, sw: 2 }, GOLD)); });
    for (let r = 0; r < 3; r++) for (let cc = 0; cc < 5; cc++) { const q = GEO.slot(side, cc, r); s += tile(q.x, q.y, q.s, 0); }
    // 曹营（起点）
    const [cx, cy] = GEO.pt(side, 29, 410);
    s += g(fv('M-30 14 L0 -22 L30 14Z', '#3d64a8', { k: 4, sw: 2.6 }) + fl('M-8 14 L0 -2 L8 14Z', INK, 2) + ln('M0 -22 L0 -40', 2.4) + fv('M0 -40 L18 -35 L0 -29Z', C.red, { k: 1.4, sw: 1.8 }) + S.text(0, 30, '曹营', { size: 14, font: 'wei', mid: true, fill: '#fff', stroke: INK, sw: 3 }), `${at(cx, cy, k)} filter="url(#wob)"`);
    // 阿斗（终点）
    const [ax, ay] = GEO.pt(side, 615, 384);
    s += `<circle cx="${N(ax)}" cy="${N(ay - 6 * k)}" r="${N(44 * k)}" fill="url(#haloG)" opacity=".7"/>`;
    s += puff(ax - 46 * k, ay + 4 * k, 92 * k, 34 * k, { n: 3, sw: 2.4 });
    s += side === 'opp' ? caochong(ax, ay - 6 * k, .62 * k) : adou(ax, ay - 6 * k, .62 * k);
    return s;
  }

  // ============ 页面 ============
  // ---------- 01 主页 ----------
  function home() {
    let s = '';
    s += `<circle cx="375" cy="560" r="330" fill="url(#sunG)"/>` + rays(375, 560, 520, 22, .35);
    s += isle(150, 660, .8) + isle(660, 560, .72);
    s += puff(-40, 600, 240, 70, { op: .9 }) + puff(560, 640, 230, 66, { op: .9 });
    s += gate(375, 556, .92);
    s += puff(150, 690, 460, 80, { n: 6 });
    s += xy(30, 470, 1.1) + xy(560, 420, .9, { flip: true });
    s += zhaoyunFull(372, 818, 1.3);
    s += puff(150, 930, 470, 110, { n: 6 });
    s += puff(-60, 960, 260, 90) + puff(560, 950, 260, 96);
    // 标题
    s += title(375, 300, '赵云与阿斗', { size: 104 });
    s += ribbon(375, 384, 300, '长坂坡 · 汉字塔防', { size: 22 });
    // 左边入口
    [['签到', ICON.gift, 1], ['任务', ICON.slips, 1], ['邮件', ICON.mail, 0], ['排行', ICON.rank, 0]].forEach(([n, ic, dt], i) => {
      const y = 460 + i * 104;
      s += circ(54, y, 33, C.cream, 3) + S.circle(54, y, 27, { stroke: C.gold, sw: 2, passes: 1, jit: .4 }) + ic(54, y - 2, 1);
      s += T(54, y + 48, n, { size: 18, font: 'wei', mid: true, fill: '#fff', stroke: INK, sw: 3.4 });
      if (dt) s += S.circle(80, y - 25, 8, { fill: C.red, stroke: '#fff', sw: 1.6, passes: 1, jit: .3 });
    });
    // 军衔进度
    s += S.rect(150, 1002, 450, 50, { r: 25, fill: INK, fo: .5, stroke: C.gold, sw: 2, passes: 1, jit: .5 });
    s += T(200, 1028, '偏将军', { size: 22, font: 'wei', mid: true, fill: C.goldL });
    s += [0, 1, 2].map(i => star(270 + i * 30, 1027, 12, i < 2)).join('');
    s += T(470, 1028, '再胜 2 局晋升', { size: 19, font: 'kai', weight: 'bold', mid: true, fill: '#fff' });
    // 按钮
    s += goldBtn(220, 1064, 310, 114, '开 战', { sub: '1V1 · 守护阿斗', size: 52, ls: 12 });
    s += plainBtn(38, 1074, 160, 92, '无尽', { size: 30, dy: -12 }) + T(118, 1142, '闯百关', { size: 16, font: 'kai', weight: 'bold', mid: true, fill: C.grey });
    s += plainBtn(552, 1074, 160, 92, '好友', { size: 30, dy: -12 }) + T(632, 1142, '约战房', { size: 16, font: 'kai', weight: 'bold', mid: true, fill: C.grey });
    s += topbar();
    s += nav('出征');
    return page(s, 'sky');
  }

  // ---------- 02 匹配：点将台 ----------
  function deckRow(x, y, size, list) {
    return list.map((u, i) => tile(x + i * (size + 16), y, size, u)).join('');
  }
  function match(o = {}) {
    let s = '';
    for (let i = 0; i < 40; i++) { const sx = (i * 137) % 750, sy = 60 + (i * 89) % 440; s += `<circle cx="${sx}" cy="${sy}" r="${1.5 + (i % 3)}" fill="#fff" opacity="${.4 + (i % 4) * .15}"/>`; }
    s += puff(-60, 840, 300, 90, { op: .85 }) + puff(520, 860, 300, 90, { op: .85 });
    s += title(375, 190, '点 将 台', { size: 76, font: 'wei', ls: 10 });
    s += T(375, 258, '正在为你寻找旗鼓相当的对手', { size: 22, font: 'kai', weight: 'bold', mid: true, fill: '#fff' });
    s += o.noRing ? `<circle cx="375" cy="560" r="250" fill="url(#haloG)" opacity=".55"/>` : matchRing(375, 560);
    s += xy(80, 760, 1.1) + xy(560, 330, .9, { flip: true });
    if (!o.noText) {
      s += T(375, 836, '寻找对手中…', { size: 34, font: 'wei', mid: true, fill: '#fff', stroke: INK, sw: 4 });
      s += T(375, 890, '00:12', { size: 46, font: 'song', weight: 'bold', mid: true, fill: C.goldL, stroke: INK, sw: 4 });
    }
    s += T(375, 932, '预计 15 秒 · 同军衔优先', { size: 18, font: 'kai', weight: 'bold', mid: true, fill: '#f3e6d6' });
    s += panel(46, 966, 658, 178, { fill: '#fff4dc' });
    s += T(375, 998, '出 战 阵 容', { size: 22, font: 'wei', mid: true, fill: C.red2 });
    s += deckRow(78, 1024, 96, [{ ch: '刀', lv: 7 > 5 ? 3 : 3 }, { ch: '枪', lv: 2 }, { ch: '骑', lv: 4 }, { ch: '弓', lv: 2 }, { gen: 'zhaoyun' }]);
    s += plainBtn(285, 1172, 180, 66, '取 消', { size: 30 });
    s += T(375, 1290, '小贴士：前期先合骑兵补防线，别急着凑武将字。', { size: 19, font: 'kai', weight: 'bold', mid: true, fill: '#fff' });
    return page(s, 'dusk');
  }
  // 点将台的罗盘（演示里会转）
  function matchRing(x, y, part) {
    if (part === 'inner') return `<circle cx="${x}" cy="${y}" r="116" fill="#1b2550"/>` + g(zhaoyun(0, 0, 2.2), `transform="translate(${x} ${y + 16})" opacity=".18"`) +
      T(x, y + 4, '?', { size: 130, font: 'song', weight: 'bold', mid: true, fill: C.goldL, stroke: INK, sw: 5 });
    let s = part === 'outer' ? '' : `<circle cx="${x}" cy="${y}" r="250" fill="url(#haloG)" opacity=".55"/>`;
    s += circ(x, y, 204, 'url(#goldG)', 3.6) + circ(x, y, 182, C.navy, 3);
    for (let i = 0; i < 24; i++) {
      const a = i / 24 * Math.PI * 2, r0 = 186, r1 = i % 2 ? 196 : 202;
      s += ln(`M${N(x + Math.cos(a) * r0)} ${N(y + Math.sin(a) * r0)} L${N(x + Math.cos(a) * r1)} ${N(y + Math.sin(a) * r1)}`, 2.4, C.red2);
    }
    ['刀', '枪', '骑', '弓', '将', '兵', '马', '令'].forEach((ch, i) => {
      const a = i / 8 * Math.PI * 2 - Math.PI / 2;
      s += T(x + Math.cos(a) * 156, y + Math.sin(a) * 156, ch, { size: 26, font: 'wei', mid: true, fill: C.goldL, op: .85 });
    });
    s += S.circle(x, y, 126, { stroke: C.goldL, sw: 2, passes: 1, dash: '4 8', jit: .4, op: .8 });
    if (part === 'outer') return s;
    s += `<circle cx="${x}" cy="${y}" r="116" fill="#1b2550"/>`;
    s += g(zhaoyun(0, 0, 2.2), `transform="translate(${x} ${y + 16})" opacity=".18"`);
    s += T(x, y + 4, '?', { size: 130, font: 'song', weight: 'bold', mid: true, fill: C.goldL, stroke: INK, sw: 5 });
    return g(s, 'class="ring"');
  }

  // ---------- 03 匹配成功 ----------
  // 半身：头下面接上肩甲/袍子
  function namePlate(cx, y, name, rank, rate, side) {
    const blue = side === 'opp';
    let s = fv(rr(cx - 140, y, 280, 54, 14), 'url(#pillG)', { shade: '#120a18', light: '#5a4870', k: 3, sw: 2, stroke: C.gold });
    s += `<path d="${rr(cx - 134, y + 6, 268, 42, 10)}" fill="none" stroke="${C.gold}" stroke-width="1.2" opacity=".6"/>`;
    s += T(cx, y + 28, name, { size: 34, font: 'wei', mid: true, fill: C.goldL, ls: 2 });
    s += ribbon(cx, y + 80, 170, rank, { size: 17, h: 30, fill: blue ? '#2a4a90' : C.red2, tailFill: blue ? '#172c5c' : '#6a1a0e' });
    s += T(cx, y + 122, rate, { size: 19, font: 'kai', weight: 'bold', mid: true, fill: '#fff', stroke: INK, sw: 3 });
    return s;
  }
  function deckTray(x, y, list) {
    let s = fv(rr(x - 10, y - 10, 5 * 62 + 10, 72, 14), '#2a1408', { k: 2, light: '#5a3a28', sw: 2, stroke: C.gold, lo: .4 });
    s = `<g opacity=".92">${s}</g>`;
    return s + deckRow(x, y, 52, list);
  }
  function vs() {
    let s = '';
    s += `<path d="M-20 -20 L770 -20 L770 600 L-20 760Z" fill="url(#blueG)" opacity=".9"/>`;
    s += `<path d="M-20 760 L770 600 L770 1360 L-20 1360Z" fill="url(#redG)" opacity=".9"/>`;
    s += rays(220, 380, 460, 18, .16) + rays(530, 990, 460, 18, .18);
    s += `<rect x="-20" y="-20" width="790" height="1380" fill="url(#yunP)" opacity=".1"/>`;
    s += xiahouFull(176, 492, 1.42);
    s += namePlate(548, 214, '许都小夏侯', '前将军 ★★★', '胜率 58%　连胜 3', 'opp');
    s += deckTray(402, 372, [{ ch: '弓', lv: 3 }, { ch: '枪', lv: 2 }, { ch: '骑', lv: 1 }, { ch: '刀', lv: 2 }, { gen: 'xiahou' }]);
    s += zhaoyunFull(568, 1172, 1.42, { shout: true });
    s += namePlate(206, 838, '常山小赵', '偏将军 ★★☆', '胜率 61%　连胜 1', 'me');
    s += deckTray(40, 996, [{ ch: '刀', lv: 3 }, { ch: '枪', lv: 2 }, { ch: '骑', lv: 4 }, { ch: '弓', lv: 2 }, { gen: 'zhaoyun' }]);
    // 分界线上一串祥云
    for (let i = 0; i < 7; i++) s += xy(-40 + i * 118, 712 - i * 26, .8, { op: .97, tail: false });
    // 中间：金牌"战"
    s += `<circle cx="375" cy="686" r="160" fill="url(#haloG)"/>` + rays(375, 686, 220, 16, .5);
    s += g(fv('M375 572 L474 686 L375 800 L276 686Z', 'url(#goldG)', Object.assign({ k: 8, sw: 4 }, GOLD)) + fv('M375 596 L453 686 L375 776 L297 686Z', 'url(#redG)', Object.assign({ k: 5, sw: 2.6 }, REDV)) +
      `<path d="M375 606 L444 686 L375 766 L306 686Z" fill="none" stroke="${C.goldL}" stroke-width="1.6"/>`, 'filter="url(#wob)"');
    s += T(377, 694, '战', { size: 92, font: 'xing', mid: true, fill: INK, op: .4 }) + T(375, 690, '战', { size: 92, font: 'xing', mid: true, fill: C.goldL, stroke: INK, sw: 5 });
    s += sparkle(300, 600, 12) + sparkle(452, 760, 9) + sparkle(466, 606, 7);
    s += T(375, 832, 'V S', { size: 28, font: 'song', weight: 'bold', mid: true, fill: C.goldL, stroke: INK, sw: 5, ls: 6 });
    s += fv(S.circD(206, 1150, 52), 'url(#goldG)', Object.assign({ k: 5, sw: 3.4 }, GOLD)) + fv(S.circD(206, 1150, 41), C.cream, { shade: '#d9c39a', light: '#fff', k: -4, lk: 0, sw: 2.4 }) + T(206, 1153, '3', { size: 58, font: 'song', weight: 'bold', mid: true, fill: C.red });
    s += T(206, 1236, '即将入场', { size: 24, font: 'wei', mid: true, fill: '#fff', stroke: INK, sw: 4 }) + T(206, 1272, '阿斗、曹冲都已就位', { size: 18, font: 'kai', weight: 'bold', mid: true, fill: '#fff', stroke: INK, sw: 3 });
    return page(s, 'sky');
  }

  // ---------- 04 战斗 ----------
  // 不变的部分：底色、两块棋盘、中间云河、顶栏和底栏的框
  function battleStatic() {
    let s = '';
    s += `<rect x="-10" y="90" width="770" height="520" fill="#dfe9f2" opacity=".45"/><rect x="-10" y="0" width="770" height="1040" fill="url(#yunP)" opacity=".07"/>`;
    s += boardBase('opp');
    // 中线云河
    s += `<rect x="0" y="508" width="750" height="84" fill="${C.blue2}" opacity=".6"/><path d="M0 508 H750 M0 592 H750" stroke="#5a9cc4" stroke-width="2.4"/>`;
    for (let i = 0; i < 8; i++) s += ln(`M${i * 100 - 20} ${532 + (i % 2) * 22} q20 -12 40 0 t40 0`, 2.4, '#fff');
    s += xy(14, 530, .6, { tail: false }) + xy(640, 548, .62, { tail: false });
    s += boardBase('me');
    // 对手头像框
    s += fv(S.circD(62, 128, 33), 'url(#goldG)', Object.assign({ k: 3, sw: 2.6 }, GOLD)) + `<clipPath id="oav"><circle cx="62" cy="128" r="27"/></clipPath><circle cx="62" cy="128" r="27" fill="${C.blue2}"/><g clip-path="url(#oav)">${xiahou(62, 142, .64)}</g>`;
    s += fv(rr(100, 100, 150, 56, 12), 'url(#pillG)', { shade: '#120a18', light: '#5a4870', k: 2, sw: 1.6, stroke: C.gold });
    s += T(112, 118, '许都小夏侯', { size: 22, anchor: 'start', font: 'wei', fill: C.goldL });
    s += T(112, 143, '前将军', { size: 15, anchor: 'start', font: 'kai', weight: 'bold', fill: '#d8cfe8' });
    s += T(268, 132, '曹冲', { size: 16, font: 'kai', weight: 'bold', mid: true, fill: C.navy });
    // 底栏
    s += fv('M-10 1030 L760 1030 L760 1344 L-10 1344Z', 'url(#creamG)', { shade: '#e2cfa6', light: '#fff', k: -5, lk: 0, sw: 3 });
    s += `<rect x="-10" y="1030" width="770" height="314" fill="url(#yunP)" opacity=".08"/>`;
    s += `<path d="${rr(14, 1078, 722, 112, 18)}" fill="#2a1408" opacity=".25" transform="translate(0 5)"/>` + fv(rr(14, 1078, 722, 112, 18), 'url(#lacquerG)', { shade: '#5a160c', light: '#e86a50', k: 4, sw: 3 });
    s += `<path d="${rr(22, 1086, 706, 96, 14)}" fill="none" stroke="${C.gold}" stroke-width="2"/>`;
    [[22, 1086], [728, 1086], [22, 1182], [728, 1182]].forEach(([x, y]) => { s += fv(S.circD(x, y, 6), 'url(#goldG)', Object.assign({ k: 1.6, sw: 1.6 }, GOLD)); });
    s += T(44, 1054, '阿斗', { size: 17, font: 'kai', weight: 'bold', mid: true, anchor: 'start', fill: '#8a6a50' });
    s += T(352, 1054, '将缘', { size: 17, font: 'kai', weight: 'bold', mid: true, anchor: 'end', fill: '#8a6a50' });
    for (let i = 0; i < 5; i++) s += fv(rr(44 + i * 112, 1094, 92, 80, 12), '#5e1a0e', { shade: '#2e0a04', light: '#8a3a26', k: -4, lk: 0, sw: 1.6, stroke: '#c58a4a' });
    s += fv(S.circD(680, 1134, 30), '#5e1a0e', { shade: '#2e0a04', k: -3, lk: 0, sw: 1.6, stroke: '#c58a4a' }) + T(680, 1130, '卖', { size: 22, font: 'wei', mid: true, fill: '#f0c890' }) + T(680, 1154, '+5', { size: 12, font: 'song', mid: true, fill: '#f0c890' });
    return s;
  }
  // 会变的部分（静态稿里用一组样例；演示里由 demo.js 实时画）
  function chip(x, name, have, done) {
    let c = fv(rr(x, 1037, 106, 34, 17), done ? 'url(#goldG)' : '#ffffff', done ? Object.assign({ k: 2.4, sw: 2 }, GOLD) : { shade: '#e2d4bc', k: 2.4, sw: 2 });
    c += T(x + 32, 1054, name, { size: 19, font: 'wei', mid: true, fill: done ? C.red2 : INK });
    [0, 1].forEach(i => { c += i < have ? fv(S.circD(x + 70 + i * 20, 1054, 7.5), C.purple, { k: 2, sw: 1.6 }) : `<circle cx="${x + 70 + i * 20}" cy="1054" r="7" fill="#fff" stroke="${C.grey}" stroke-width="1.6"/>`; });
    return c;
  }
  function boxItem(i, ch, o = {}) {
    const x = 44 + i * 112, y = 1094 - (o.lift ? 12 : 0);
    return (o.lift ? `<rect x="${x - 6}" y="${y - 8}" width="104" height="104" rx="18" fill="${C.goldL}" opacity=".4"/>` : '') + tile(x + 6, y + 2, 80, { ch, lv: 1 }) +
      (o.lift ? `<path d="${rr(x, y - 4, 92, 92, 14)}" fill="none" stroke="${C.goldL}" stroke-width="3.4"/>` : '');
  }
  function summonBtn(cost, can = true) {
    return goldBtn(240, 1210, 270, 104, '征 兵', { size: 46, sub: ' ', fill: can ? 'url(#goldG)' : '#d9cfbf' }) + mantou(352, 1290, .78) + T(386, 1291, String(cost), { size: 22, font: 'song', weight: 'bold', mid: true, fill: C.red2 });
  }
  function skill(x, ch, name, cd, t) {
    let k = `<circle cx="${x}" cy="1264" r="46" fill="#2a1408" opacity=".25"/>` + fv(S.circD(x, 1258, 46), 'url(#goldG)', Object.assign({ k: 4, sw: 3 }, GOLD)) + fv(S.circD(x, 1258, 37), 'url(#creamG)', { shade: '#d9c39a', light: '#fff', k: -4, lk: 0, sw: 2 });
    k += T(x + 1.4, 1258, ch, { size: 42, font: 'wei', mid: true, fill: '#fff' }) + T(x, 1256, ch, { size: 42, font: 'wei', mid: true, fill: C.red2 });
    if (cd > 0) {
      const a = -Math.PI / 2 + Math.PI * 2 * (1 - cd), big = (1 - cd) > .5 ? 0 : 1;
      k += `<path d="M${x} 1258 L${x} 1212 A46 46 0 ${big} 0 ${N(x + Math.cos(a) * 46)} ${N(1258 + Math.sin(a) * 46)}Z" fill="${INK}" opacity=".5"/>`;
      if (t) k += T(x, 1258, t, { size: 26, font: 'song', weight: 'bold', fill: '#fff', mid: true, stroke: INK, sw: 3 });
    } else k += `<circle cx="${x}" cy="1258" r="54" fill="none" stroke="${C.goldL}" stroke-width="3"/>` + sparkle(x + 34, 1222, 7);
    k += T(x, 1318, name, { size: 16, font: 'kai', weight: 'bold', mid: true, fill: '#8a6a50' });
    return k;
  }
  function waveBadge(wave, time, warn) {
    let s = fv(S.circD(375, 550, 46), 'url(#goldG)', Object.assign({ k: 4, sw: 3 }, GOLD)) + `<circle cx="375" cy="550" r="38" fill="none" stroke="#b06a12" stroke-width="1.6"/>`;
    s += T(375, 534, wave, { size: 18, font: 'wei', mid: true, fill: C.red2 }) + T(375, 562, time, { size: 24, font: 'song', weight: 'bold', mid: true });
    if (warn) s += fv(rr(462, 530, 180, 42, 21), 'url(#redG)', Object.assign({ k: 2.6, sw: 2, stroke: C.goldL }, REDV)) + T(552, 551, warn, { size: 18, font: 'wei', mid: true, fill: C.goldL });
    return s;
  }
  function battleSample() {
    let s = '';
    s += peach(300, 132, 1) + peach(328, 132, 1) + peach(356, 132, 1, false);
    s += S.curve([[392, 106], [520, 102], [532, 138], [470, 152], [422, 150], [402, 164], [406, 146], [386, 130]], { closed: true, fill: '#fff', sw: 2.4 });
    s += T(458, 130, '看我虎豹骑！', { size: 21, font: 'wei', mid: true, fill: C.red2 });
    const ou = [[{ ch: '弓', lv: 3 }, { ch: '枪', lv: 2 }, { gen: 'xiahou' }, { ch: '骑', lv: 1 }, { ch: '刀', lv: 2 }],
      [{ ch: '枪', lv: 1 }, { ch: '弓', lv: 1 }, { ch: '刀', lv: 3 }, { ch: '弓', lv: 2 }, 'lock'], ['lock', 'lock', { ch: '骑', lv: 2 }, 'lock', 'lock']];
    ou.forEach((row, r) => row.forEach((u, c) => { if (u) { const q = GEO.slot('opp', c, r); s += tile(q.x, q.y, q.s, u); } }));
    [[60, .8], [250, .5], [520, .9], [800, .3]].forEach(([d, hp], i) => { const [x, y] = GEO.along('opp', d); s += foe(x, y, { hp, k: .78, step: i % 2, shu: true }); });
    // 我方
    const mu = [[{ ch: '刀', lv: 2 }, { ch: '骑', lv: 1 }, { ch: '枪', lv: 3 }, { ch: '弓', lv: 2, merge: true }, { ch: '刀', lv: 1 }],
      [{ ch: '骑', lv: 2 }, { ch: '弓', lv: 2, merge: true }, { gen: 'zhaoyun', lv: 2 }, { ch: '枪', lv: 1 }, { ch: '弓', lv: 3 }],
      [{ ch: '骑', lv: 4 }, 0, 'lock', 'lock', 'lock']];
    mu.forEach((row, r) => row.forEach((u, c) => { if (u !== 0) { const q = GEO.slot('me', c, r); s += tile(q.x, q.y, q.s, u); } }));
    // 出手特效
    const q1 = GEO.slot('me', 0, 0), q3 = GEO.slot('me', 2, 0), g1 = GEO.slot('me', 2, 1);
    s += ln(`M${q1.x + 60} ${q1.y + 8} Q${q1.x + 90} ${q1.y - 40} ${q1.x + 150} ${q1.y - 44}`, 8, C.red) + ln(`M${q1.x + 60} ${q1.y + 8} Q${q1.x + 90} ${q1.y - 40} ${q1.x + 150} ${q1.y - 44}`, 3, '#fff');
    s += ln(`M${q3.x + 46} ${q3.y} L${q3.x + 50} ${q3.y - 46}`, 6, C.blue) + ln(`M${q3.x + 46} ${q3.y} L${q3.x + 50} ${q3.y - 46}`, 2.4, '#fff');
    s += `<circle cx="${g1.x + 46}" cy="${g1.y + 46}" r="62" fill="none" stroke="${C.goldL}" stroke-width="4" opacity=".8"/>`;
    [[150, 1], [280, .7], [410, .35], [560, .6], [700, .85], [1230, .2]].forEach(([d, hp], i) => { const [x, y] = GEO.along('me', d); s += foe(x, y, { hp, step: i % 2 }); });
    { const [x, y] = GEO.along('me', 1090); s += foe(x, y + 6, { hp: .85, boss: true, name: '许褚' }); }
    const num = (x, y, t, big) => T(x, y, t, { size: big ? 30 : 22, font: 'song', weight: 'bold', mid: true, fill: big ? C.red : '#fff', stroke: INK, sw: 4, rot: -6 });
    s += num(260, 600, '-128') + num(588, 676, '暴击 -460', true) + num(420, 598, '-96');
    s += sparkle(560, 690, 10, C.goldL) + sparkle(230, 612, 7);
    s += waveBadge('第七波', '02:41', '首领许褚来袭！');
    // 拖拽提示
    const e = GEO.slot('me', 1, 2);
    s += `<path d="M206 1080 C196 1040 ${e.x + 30} 1010 ${e.x + 46} ${e.y + e.s + 6}" fill="none" stroke="${C.red}" stroke-width="3.4" stroke-dasharray="2 9" stroke-linecap="round"/>`;
    s += T(e.x + 120, e.y + e.s + 30, '拖上阵', { size: 20, font: 'wei', fill: C.red, mid: true, rot: -6 });
    // 底栏数据
    s += peach(104, 1054, .95) + peach(132, 1054, .95) + peach(160, 1054, .95);
    s += chip(362, '赵云', 2, true) + chip(476, '张飞', 1) + chip(590, '黄忠', 0);
    s += boxItem(0, '刀') + boxItem(1, '骑', { lift: true }) + boxItem(2, '铲') + boxItem(3, '飞') + boxItem(4, '弓');
    s += mantou(338, 1196, .7) + T(360, 1197, '186', { size: 22, font: 'song', weight: 'bold', anchor: 'start', mid: true });
    s += summonBtn(30) + skill(110, '护', '护主', .4, '4s') + skill(640, '冲', '七进七出', 0);
    return s;
  }
  function battle() { return page(battleStatic() + battleSample(), 'sky'); }

  // ---------- 05 结算 · 胜 ----------
  function win(o = {}) {
    const R = ST().last || {};
    const wave = '一二三四五六七八九十'[Math.max(0, Math.min(9, (R.wave || 7) - 1))];
    let s = '';
    s += `<rect width="750" height="1334" fill="#f6c45a" opacity=".35"/>`;
    s += `<circle cx="375" cy="440" r="380" fill="url(#sunG)"/>` + rays(375, 440, 760, 24, .5);
    s += puff(-40, 520, 300, 90) + puff(500, 540, 300, 90);
    s += title(375, 200, '大 胜', { size: 150, ls: 20 });
    s += ribbon(375, 300, 340, `第${wave}波 · 守住了阿斗`, { size: 22 });
    s += puff(190, 560, 380, 100, { n: 5 });
    s += zhaoyunFull(292, 574, .9, { pose: 'cheer', shout: true });
    s += adou(468, 514, 1.05, { body: true, happy: true, cheer: true, bun: true });
    [[120, 380], [640, 380], [560, 250], [180, 260]].forEach(([x, y], i) => { s += peach(x, y, .9 + (i % 2) * .2); });
    s += panel(40, 678, 670, 420, { fill: '#fff6e0' });
    s += T(212, 736, '偏将军', { size: 28, font: 'wei', mid: true, fill: C.red2 });
    [0, 1, 2].forEach(i => { s += star(304 + i * 46, 734, 19, true); });
    for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; s += ln(`M${N(396 + Math.cos(a) * 25)} ${N(734 + Math.sin(a) * 25)} L${N(396 + Math.cos(a) * 35)} ${N(734 + Math.sin(a) * 35)}`, 3, C.orange); }
    s += T(456, 736, '+1', { size: 32, font: 'song', weight: 'bold', mid: true, fill: C.red });
    s += T(375, 782, '再胜 1 局，晋升「中郎将」', { size: 19, font: 'kai', weight: 'bold', mid: true, fill: C.grey });
    const rew = [[(a, b, c) => mantou(a, b, c), '+120', '馒头'], [yuanbao, '+5', '元宝'], [null, '×2', '赵云碎片'], [ICON.book, '+60', '经验']];
    rew.forEach(([ic, n, name], i) => {
      const x = 70 + i * 156, y = 808;
      s += `<path d="${rr(x, y, 140, 120, 14)}" fill="#2a1408" opacity=".15" transform="translate(0 5)"/>` + fv(rr(x, y, 140, 120, 14), '#ffffff', { shade: '#eadbbd', k: 4, sw: 2.4 }) + `<path d="${rr(x + 5, y + 5, 130, 110, 10)}" fill="none" stroke="${C.gold}" stroke-width="1.6"/>` + `<circle cx="${x + 70}" cy="${y + 40}" r="34" fill="url(#haloG)" opacity=".7"/>`;
      if (ic) s += ic(x + 70, y + 40, 1.45);
      else s += `<clipPath id="frag"><path d="M${x + 44} ${y + 14} L${x + 96} ${y + 12} L${x + 100} ${y + 66} L${x + 70} ${y + 58} L${x + 42} ${y + 68}Z"/></clipPath><g clip-path="url(#frag)"><rect x="${x + 40}" y="${y + 10}" width="64" height="60" fill="${C.blue2}"/>${zhaoyun(x + 70, y + 46, .7)}</g>` + fl(`M${x + 44} ${y + 14} L${x + 96} ${y + 12} L${x + 100} ${y + 66} L${x + 70} ${y + 58} L${x + 42} ${y + 68}Z`, 'none', 2.4);
      s += T(x + 70, y + 86, n, { size: 26, font: 'song', weight: 'bold', mid: true, fill: C.red });
      s += T(x + 70, y + 108, name, { size: 15, font: 'kai', weight: 'bold', mid: true, fill: C.grey });
    });
    [['MVP', R.mvp || '赵云 38%'], ['合成', (R.merges ?? 14) + ' 次'], ['击退曹兵', String(R.kills ?? 86)]].forEach(([a, b], i) => {
      const x = 148 + i * 228;
      s += T(x, 966, a, { size: 17, font: 'kai', weight: 'bold', mid: true, fill: C.grey });
      s += T(x, 1004, b, { size: 28, font: 'wei', mid: true, fill: INK });
    });
    s += ln('M262 950 L262 1020 M490 950 L490 1020', 1.6, '#d9c7a0');
    s += T(375, 1060, `对手「许都小夏侯」的曹冲先被抱走了`, { size: 18, font: 'kai', weight: 'bold', mid: true, fill: C.grey });
    s += plainBtn(50, 1132, 290, 96, '双倍领取', { size: 30, icon: ICON.ad, iconDx: 86, iconS: 1.3 });
    s += goldBtn(366, 1122, 336, 116, '再战一局', { size: 44, ls: 4 });
    s += T(375, 1292, '回主页　·　分享战报', { size: 21, font: 'kai', weight: 'bold', mid: true, fill: INK });
    return page(s, 'sky');
  }

  // ---------- 06 结算 · 败 ----------
  function lose() {
    let s = '';
    s += puff(-60, 300, 360, 120, { fill: '#e9ecef', shade: '#c4ccd4' }) + puff(420, 340, 380, 120, { fill: '#e9ecef', shade: '#c4ccd4' });
    s += title(375, 200, '惜 败', { size: 150, ls: 20, fill: '#e6e9ee', edge: '#5d6a80' });
    s += ribbon(375, 300, 300, '差一点就守住了', { size: 22, fill: '#5d6a80', fg: '#fff' });
    s += puff(200, 560, 350, 100, { n: 5, fill: '#f1f2f4', shade: '#c4ccd4' });
    s += adou(375, 470, 1.6, { body: true, cry: true, bun: true });
    s += S.curve([[520, 380], [640, 372], [660, 412], [600, 430], [550, 428], [528, 446], [530, 426], [512, 410]], { closed: true, fill: '#fff', sw: 2.6 });
    s += T(588, 404, '哇——', { size: 26, font: 'wei', mid: true, fill: C.red2 });
    s += panel(46, 700, 658, 370, { fill: '#fbf7ee' });
    s += T(375, 754, '阿斗被曹兵抱走了', { size: 30, font: 'wei', mid: true, fill: INK });
    s += T(375, 792, '对手的曹冲只剩 1 颗仙桃', { size: 19, font: 'kai', weight: 'bold', mid: true, fill: C.grey });
    s += T(222, 840, '偏将军', { size: 24, font: 'wei', mid: true, fill: '#5d6a80' });
    [0, 1, 2].forEach(i => { s += star(304 + i * 40, 838, 16, i < 1); });
    s += T(442, 840, '-1', { size: 26, font: 'song', weight: 'bold', mid: true, fill: '#5d6a80' });
    s += fv(rr(86, 872, 578, 128, 14), '#ffffff', { shade: '#e2dccf', k: 4, sw: 2.2 });
    s += T(110, 904, '下次试试', { size: 22, font: 'wei', anchor: 'start', mid: true, fill: C.red2 });
    s += T(110, 942, '① 前期先合骑兵，把防线补满', { size: 19, font: 'kai', weight: 'bold', anchor: 'start', mid: true });
    s += T(110, 976, '② 留一个空格，凑齐赵云再上阵', { size: 19, font: 'kai', weight: 'bold', anchor: 'start', mid: true });
    s += tile(560, 892, 80, { ch: '骑', lv: 3 });
    s += mantou(330, 1034, .8) + T(352, 1035, '+30', { size: 22, font: 'song', weight: 'bold', anchor: 'start', mid: true, fill: C.red });
    s += plainBtn(50, 1130, 290, 96, '回主页', { size: 30 });
    s += goldBtn(366, 1120, 336, 116, '再战一局', { size: 44, ls: 4 });
    return page(s, 'grey');
  }

  // ---------- 07 商店：云中集市 ----------
  const GOODS = {
    peach: (x, y) => peach(x, y + 4, 1.7),
    sword(x, y) { return g(fl('M-4 30 L4 30 L4 -34 L0 -46 L-4 -34Z', '#eef2f7', 2.4) + ln('M0 -36 L0 26', 1.4, '#9fb3c6') + fl('M-17 30 L17 30 L14 37 L-14 37Z', C.gold, 2.2) + fl('M-4 37 L4 37 L4 55 L-4 55Z', '#5a3a22', 2) + ln('M-4 42 L4 40 M-4 48 L4 46', 1.4, C.gold) + fl(S.circD(0, 59, 5), C.gold, 1.8) + ln('M0 62 C-6 70 -2 76 -8 82', 2.4, C.red), `${at(x, y + 2, .66, 40)} filter="url(#wob)"`); },
    // 的卢：栗色马头，额上一道白（的卢就是额头有白斑的马），鼻梁一根红笼头
    horse(x, y) {
      let p = fl('M-6 -22 L-3 -40 L7 -25Z', '#d9965a', 2.2) + fl('M-4 -26 L-2 -34 L3 -26Z', '#f2b9a0', 0);
      p += fl('M-22 34 C-27 14 -21 -8 -8 -20 C-2 -26 6 -28 12 -26 C22 -22 30 -10 33 2 C35 10 33 18 25 20 C17 22 9 18 6 14 C2 20 2 28 8 34Z', '#d9965a', 2.6);
      p += fl('M-8 -22 C-18 -18 -26 -2 -28 14 C-29 24 -28 30 -26 34 L-20 34 C-23 18 -18 -4 -6 -16Z', '#5a3420', 2.2);
      p += fl('M-3 -24 C1 -17 8 -17 12 -24 C6 -29 0 -29 -3 -24Z', '#5a3420', 1.6);
      p += `<path d="M15 -19 C19 -13 23 -5 25 3 C20 1 17 -7 15 -19Z" fill="#fff"/>`;
      p += `<ellipse cx="9" cy="-6" rx="4" ry="5" fill="${INK}"/>` + dot(7.6, -8, 1.5, '#fff');
      p += `<ellipse cx="20" cy="9" rx="5" ry="3" fill="#f08a7e" opacity=".6"/>`;
      p += ln('M28 7 q2.5 2 4.5 0', 2) + ln('M23 16 Q27 18 31 15', 1.8);
      p += ln('M19 -1 C23 1 28 1 33 -1', 3, C.red) + fl(S.circD(18, -1, 2.8), C.gold, 1.4);
      return g(p, `${at(x - 4, y + 2, 1.12)} filter="url(#wob)"`);
    },
    shovel: (x, y) => shovel(x, y + 2, 1.4),
    order(x, y) { return g(fv('M-22 30 L-22 -18 C-22 -36 22 -36 22 -18 L22 30Z', 'url(#goldG)', Object.assign({ k: 4, sw: 2.6 }, GOLD)) + fv('M-15 24 L-15 -14 C-15 -26 15 -26 15 -14 L15 24Z', C.red, { k: 3, sw: 2 }) + S.text(0, 4, '贤', { size: 26, font: 'wei', mid: true, fill: C.goldL }) + ln('M0 -36 L0 -46', 2.4) + fv(S.circD(0, -48, 4), C.red, { k: 1.2, sw: 1.6 }), `${at(x, y + 6, .82)} filter="url(#wob)"`); },
    rice(x, y) { return g(fv('M-24 28 C-30 0 -22 -16 -12 -22 L12 -22 C22 -16 30 0 24 28Z', '#e9d3a2', { k: 5, shade: '#c4a56c', light: '#fff4dc', sw: 2.6 }) + fv('M-14 -22 C-10 -33 10 -33 14 -22Z', '#c9a56a', { k: 2, sw: 2.2 }) + ln('M-12 -26 L12 -26', 3, C.red) + S.text(0, 6, '粮', { size: 22, font: 'wei', mid: true, fill: C.red2 }), `${at(x, y + 2, .95)} filter="url(#wob)"`); }
  };
  const SHOP_ITEMS = [
    { icon: 'peach', name: '仙桃', desc: '阿斗多一条命', price: '300' },
    { icon: 'sword', name: '青釭剑', desc: '刀兵攻击 +20%', price: '240' },
    { icon: 'horse', name: '的卢马', desc: '骑兵冲得更快', price: '260' },
    { icon: 'shovel', name: '铲子', desc: '开局多开一格', price: '200' },
    { icon: 'order', name: '招贤令', desc: '更容易抽到武将字', price: '8', cur: 'yb' },
    { icon: 'rice', name: '军粮', desc: '开局馒头 +50', price: '6', cur: 'yb', sold: true }
  ];
  function shopCard(x, y, it) {
    const w = 210, h = 182, d = rr(x, y, w, h, 16);
    let s = `<path d="${d}" fill="#2a1408" opacity=".18" transform="translate(0 6)"/>`;
    s += fv(d, '#fff8e8', { shade: '#e6d2a8', light: '#fff', k: 5, sw: 2.6 });
    s += `<path d="${rr(x + 6, y + 6, w - 12, h - 12, 12)}" fill="none" stroke="${C.gold}" stroke-width="1.6"/>`;
    s += ruyi(x + 5, y + 5, 1, 1, .6) + ruyi(x + w - 5, y + 5, -1, 1, .6);
    s += `<circle cx="${x + w / 2}" cy="${y + 50}" r="40" fill="url(#haloG)"/>`;
    s += GOODS[it.icon](x + w / 2, y + 50);
    s += T(x + w / 2, y + 112, it.name, { size: 25, font: 'wei', mid: true });
    s += T(x + w / 2, y + 136, it.desc, { size: 15, font: 'kai', weight: 'bold', mid: true, fill: '#8a7660' });
    s += fv(rr(x + 30, y + 146, w - 60, 28, 14), it.sold ? '#d9d2c6' : 'url(#redG)', it.sold ? { k: 2, sw: 1.8 } : Object.assign({ k: 2.4, sw: 1.8 }, REDV));
    s += (it.cur === 'yb' ? yuanbao : (a, b, c) => mantou(a, b + 2, c))(x + w / 2 - 30, y + 160, .62) + T(x + w / 2 - 12, y + 161, it.price, { size: 19, font: 'song', weight: 'bold', anchor: 'start', mid: true, fill: '#fff' });
    const got = ST().bought && ST().bought[it.name];
    if (got) s += g(S.rect(x + 40, y + 50, 130, 54, { r: 6, stroke: C.green, sw: 4, passes: 1, jit: .6 }) + T(x + 105, y + 78, '已 购', { size: 32, font: 'wei', fill: C.green, mid: true }), `filter="url(#stamp)" transform="rotate(-12 ${x + 105} ${y + 77})"`);
    if (it.sold) s += g(S.rect(x + 40, y + 52, 130, 54, { r: 6, stroke: C.red, sw: 4, passes: 1, jit: .6 }) + T(x + 105, y + 80, '售 罄', { size: 32, font: 'wei', fill: C.red, mid: true }), `filter="url(#stamp)" transform="rotate(-14 ${x + 105} ${y + 79})"`);
    return s;
  }
  // 糜竺：刘备的大财主，在这儿当掌柜
  function mizhu(x, y, s = 1) {
    let p = fv('M-32 40 C-42 10 -28 -6 0 -6 C28 -6 42 10 32 40Z', '#3d7a5a', { k: 5, shade: '#24533c', light: '#7cc0a0', sw: 2.6 });
    p += ln('M-24 20 q6 -5 12 0 M10 26 q6 -5 12 0', 1.6, '#a8dcc0') + fv('M-8 -4 L8 -4 L0 40Z', 'url(#goldG)', Object.assign({ k: 2, sw: 2 }, GOLD));
    p += fv(S.ellD(0, -36, 30, 32), C.skin, Object.assign({ k: 4 }, SKIN)) + ln('M-14 -31 L-6 -30 M14 -31 L6 -30', 2.4) + dot(-10, -36, 2.8) + dot(10, -36, 2.8) + dot(-10.8, -36.8, .8, '#fff') + dot(9.2, -36.8, .8, '#fff');
    p += fl('M-15 -22 Q-6 -27 0 -22 Q6 -27 15 -22 Q6 -23 0 -20 Q-6 -23 -15 -22Z', '#2a1d18', 1.4) + fl('M-5 -16 Q0 -10 5 -16Z', C.red, 1.6);
    p += `<ellipse cx="-19" cy="-25" rx="7" ry="4.6" fill="url(#blushG)"/><ellipse cx="19" cy="-25" rx="7" ry="4.6" fill="url(#blushG)"/>`;
    p += fv('M-30 -50 C-30 -79 30 -79 30 -50 Q0 -60 -30 -50Z', '#3d7a5a', { k: 4, shade: '#24533c', light: '#7cc0a0', sw: 2.6 }) + fv('M-40 -50 L40 -50 L36 -43 L-36 -43Z', '#2a5a40', { k: 2, sw: 2.4 }) + fv(S.circD(0, -62, 4), 'url(#goldG)', Object.assign({ k: 1.2, sw: 1.6 }, GOLD));
    p += yuanbao(30, 16, 1);
    return g(p, `${at(x, y, s)} filter="url(#wob)"`);
  }
  function shop() {
    let s = '';
    s += `<rect x="0" y="230" width="750" height="1000" fill="url(#yunP)" opacity=".08"/>`;
    // 天宫式铺面：红柱、金瓦檐、蓝底金字匾
    [40, 710].forEach(px => { s += fv(`M${px - 16} 236 L${px + 16} 236 L${px + 16} 470 L${px - 16} 470Z`, C.red, { shade: '#8a2414', light: '#ff8a6a', k: 6 }) + fv(`M${px - 20} 236 L${px + 20} 236 L${px + 18} 250 L${px - 18} 250Z`, 'url(#goldG)', Object.assign({ k: 2, sw: 2.2 }, GOLD)); });
    s += fv('M-20 262 Q0 248 20 236 L730 236 Q750 248 770 262 L770 296 L-20 296Z', 'url(#goldG)', Object.assign({ k: 6 }, GOLD));
    for (let i = 0; i < 26; i++) s += S.vol(`M${i * 30 - 6} 296 a15 15 0 0 0 30 0Z`, Object.assign({ fill: 'url(#goldG)', k: 2.4, sw: 2.2 }, GOLD));
    for (let i = 0; i < 25; i++) s += ln(`M${i * 30 + 9} 250 L${i * 30 + 9} 294`, 1.4, '#b06a12');
    s += `<path d="M200 312 L550 312 L550 396 L200 396Z" fill="#2a1408" opacity=".25" transform="translate(0 6)"/>` + fv('M200 312 L550 312 L550 396 L200 396Z', C.navy, { shade: '#141d44', light: '#4a5ca8', k: 5 });
    s += `<rect x="210" y="322" width="330" height="64" fill="none" stroke="${C.gold}" stroke-width="2"/><rect x="216" y="328" width="318" height="52" fill="none" stroke="${C.gold}" stroke-width="1" opacity=".6"/>`;
    s += T(375, 356, '云中集市', { size: 46, font: 'wei', mid: true, fill: C.goldL, ls: 8 });
    s += xy(556, 360, .5, { tail: false }) + xy(152, 380, .4, { tail: false, flip: true });
    s += mizhu(108, 404, 1.05) + S.curve([[110, 292], [196, 286], [208, 316], [160, 330], [128, 328], [112, 344], [116, 326], [100, 312]], { closed: true, fill: '#fff', sw: 2.4 });
    s += T(156, 310, '今日特价！', { size: 18, font: 'wei', mid: true, fill: C.red2 });
    // 分页
    [['每日', 1], ['武将'], ['皮肤'], ['元宝']].forEach(([t, on], i) => {
      const x = 240 + i * 130;
      if (on) s += fv(`M${x - 52} 434 L${x + 52} 434 L${x + 46} 476 L${x - 46} 476Z`, 'url(#redG)', Object.assign({ k: 3, sw: 2.6 }, REDV));
      s += T(x, 456, t, { size: on ? 28 : 25, font: 'wei', mid: true, fill: on ? C.goldL : '#5a4636' });
    });
    s += ln('M60 480 H690', 1.6, '#d9c39a');
    // 头牌皮肤
    s += panel(36, 494, 678, 232, { fill: '#fff4dc' });
    s += `<clipPath id="skinClip"><rect x="62" y="516" width="216" height="188" rx="12"/></clipPath>`;
    s += S.rect(60, 514, 220, 192, { r: 14, fill: C.blue2, sw: 2.6, jit: .6 });
    s += g(rays(170, 610, 240, 16, .55) + `<circle cx="170" cy="600" r="100" fill="url(#haloG)"/><circle cx="170" cy="612" r="66" fill="none" stroke="${C.goldL}" stroke-width="6"/><circle cx="170" cy="612" r="66" fill="none" stroke="${C.gold2}" stroke-width="2" stroke-dasharray="4 8"/>` +
      zhaoyunFull(170, 688, .82, { pose: 'hip', weapon: 'none' }), 'clip-path="url(#skinClip)"');
    s += `<path d="${rr(60, 514, 220, 192, 14)}" fill="none" stroke="${INK}" stroke-width="2.6"/><path d="${rr(66, 520, 208, 180, 10)}" fill="none" stroke="${C.goldL}" stroke-width="1.6"/>`;
    s += sparkle(96, 548, 9) + sparkle(250, 560, 6);
    s += T(306, 548, '赵云 · 白袍天将', { size: 34, font: 'wei', anchor: 'start', mid: true });
    s += fv(rr(306, 572, 92, 28, 6), C.purple, { k: 2, sw: 1.6 }) + T(352, 586, '限定皮肤', { size: 16, font: 'kai', weight: 'bold', mid: true, fill: '#fff' });
    s += T(410, 587, '剩 2 天', { size: 17, font: 'kai', weight: 'bold', anchor: 'start', mid: true, fill: C.red });
    s += T(306, 626, '金光护体，云中出枪', { size: 20, font: 'kai', weight: 'bold', anchor: 'start', mid: true });
    s += T(306, 654, '只换外观，不改数值', { size: 16, font: 'kai', weight: 'bold', anchor: 'start', mid: true, fill: '#8a7660' });
    s += yuanbao(320, 690, 1) + T(342, 691, '128', { size: 28, font: 'song', weight: 'bold', anchor: 'start', mid: true, fill: C.red });
    s += T(408, 692, '198', { size: 17, font: 'song', anchor: 'start', mid: true, fill: C.grey }) + ln('M404 692 L446 686', 2, C.grey);
    s += goldBtn(560, 652, 130, 58, '购买', { size: 26, ls: 2 });
    // 每日
    s += T(44, 762, '今日特供', { size: 28, font: 'wei', anchor: 'start', mid: true, fill: C.red2 });
    s += T(170, 764, '买了只在今天的对局里生效', { size: 16, font: 'kai', weight: 'bold', anchor: 'start', mid: true, fill: C.grey });
    s += plainBtn(560, 742, 150, 44, '换一批', { size: 20, font: 'kai', icon: ICON.ad, iconDx: 46, iconS: .8 });
    const items = SHOP_ITEMS;
    const _unused = [
      { icon: 'peach', name: '仙桃', desc: '阿斗多一条命', price: '300' },
      { icon: 'sword', name: '青釭剑', desc: '刀兵攻击 +20%', price: '240' },
      { icon: 'horse', name: '的卢马', desc: '骑兵冲得更快', price: '260' },
      { icon: 'shovel', name: '铲子', desc: '开局多开一格', price: '200' },
      { icon: 'order', name: '招贤令', desc: '更容易抽到武将字', price: '8', cur: 'yb' },
      { icon: 'rice', name: '军粮', desc: '开局馒头 +50', price: '6', cur: 'yb', sold: true }
    ];
    items.forEach((it, i) => { s += shopCard(42 + (i % 3) * 228, 788 + Math.floor(i / 3) * 194, it); });
    s += topbar();
    s += nav('商店');
    return page(s, 'paper');
  }

  window.META = {
    title: '赵云与阿斗', subtitle: '长坂坡 · 汉字塔防　|　西游画风',
    theme: { bg: '#f3e7cc', ink: INK, accent: C.red, titleFont: SK.FONTS.xing },
    concept: [
      '<b>三国的人，西游的画</b>：赵云、阿斗、刀枪骑弓、凑名字召武将，全照原作；画面借西游的样子。',
      '<b>Q版圆脸</b>：豆豆眼、腮红、平涂粗描边；赵云银盔红缨，关羽绿巾长须，张飞一圈刺刺胡子，刘备大耳朵。',
      '<b>蜀魏对垒</b>：我方是蜀，守阿斗；对手是曹营的夏侯惇，守曹冲。打我方的是曹兵，打对手的是蜀兵。',
      '<b>天宫气派</b>：祥云铺路、金瓦红柱、牌匾写「长坂坡」；阿斗的三条命画成三颗仙桃。'
    ],
    palette: [['米白', C.paper], ['墨', INK], ['朱红', C.red], ['金', C.gold], ['群青', C.blue], ['石绿', C.green], ['天青', C.blue2], ['紫', C.purple]],
    footer: '页面尺寸 750×1334（竖屏小游戏），右上角留出小游戏胶囊按钮位置。'
  };
  window.PAGES = [
    { id: 'home', name: '主页', seed: 3, draw: home, note: '赵云抱着阿斗站在云上，身后天宫门楼的匾写着「长坂坡」。' },
    { id: 'match', name: '匹配', seed: 7, draw: match, note: '点将台的罗盘转着找对手；下面是出战阵容。' },
    { id: 'vs', name: '匹配成功', seed: 11, draw: vs, note: '上蓝下红，祥云一线隔开；中间一块金牌「战」。' },
    { id: 'battle', name: '战斗', seed: 5, draw: battle, note: '上对手下自己；兵营抽字、拖上阵、同字同级合成，凑齐名字召武将。' },
    { id: 'win', name: '结算-胜', seed: 13, draw: win, note: '大胜：赵云喊一嗓子，阿斗举着馒头蹦起来。' },
    { id: 'lose', name: '结算-败', seed: 19, draw: lose, note: '惜败：阿斗哭了，卡片告诉你下次怎么守。' },
    { id: 'shop', name: '商店', seed: 17, draw: shop, note: '云中集市，掌柜是刘备的财主糜竺；今日特供当天有效。' }
  ];
  // 演示用的零件
  window.PARTS = { zhaoyunFull, xiahouFull, zhangfei, huangzhong, liubei, mizhu, goldBtn, plainBtn, pill, xiahou, caochong, GRAD, SHOP_ITEMS: () => SHOP_ITEMS, waveBadge, sparkle, rr, fv, xy, rays, puff, C, GEO, page, bg, tile, foe, caobing, peach, mantou, yuanbao, zhaoyun, adou, guanyu, chip, boxItem, summonBtn, skill, battleStatic, matchRing, match, title, ribbon, star, lvDots, GENERAL, NAMECH, KIND, circ, ln, fl, g, at, T };
})();
