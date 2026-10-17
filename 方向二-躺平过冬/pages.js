/* 方向二《躺平过冬》—— 地下冬眠塔防
   躺平 = 冬眠；猛鬼 = 黄大仙（黄鼠狼）；撑到天亮 = 熬到春天。宿舍换成地底下一间间小洞。 */
(function () {
  const S = SK, T = S.text;
  SK.INK = '#3f2c20';           // 这一套用深棕铅笔线，不用黑墨
  const INK = SK.INK;
  const C = {
    paper: '#f7f0e1', cream: '#fdf7ea', soil: '#94673f', soil2: '#7a5232', soilD: '#563a26', floor: '#ecd5aa', floor2: '#dcbf8f',
    tunnel: '#c9a172', sky: '#d3e1e8', snow: '#ffffff', snowB: '#cfdeea', night: '#2f3a52',
    yellow: '#f3c24f', orange: '#ea9446', red: '#d9573f', pink: '#f2a7a0', green: '#7fae58', green2: '#b3d48a', blue: '#6c9bc6', purple: '#9580b8',
    ham: '#eaa964', hamB: '#fcebd0', hedge: '#8d6a4e', face: '#f4dcb6', squ: '#cf6f3c', bear: '#8d5c3c', frog: '#8fc062',
    weasel: '#d79c48', weaselD: '#7f4f20', wood: '#d6a96f', wood2: '#a8743f', grey: '#9a8b7a', straw: '#e9cf8a'
  };
  const W = 750, H = 1334;
  const ST = () => (window.Demo && window.Demo.state) || {};
  const fmt = n => Number(n).toLocaleString('en-US');
  const g = (inner, a = '') => `<g ${a}>${inner}</g>`;
  const at = (x, y, s = 1, r = 0) => `transform="translate(${x} ${y})${s !== 1 ? ` scale(${s})` : ''}${r ? ` rotate(${r})` : ''}"`;
  const fc = (d, col, op) => `<path d="${d}" fill="${col}" opacity="${N((op == null ? 1 : op) * .7)}"/><path d="${d}" fill="${col}"${op != null ? ` opacity="${op}"` : ''} filter="url(#crayon)"/>`;
  const N = SK.N;
  const ln = (d, w = 2.4, col = INK) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  // 估一下形状大小，决定暗边多厚
  const kOf = d => { const n = (d.match(/-?\d+(\.\d+)?/g) || []).map(Number); if (n.length < 6) return 3; const xs = n.filter((_, i) => i % 2 === 0), ys = n.filter((_, i) => i % 2 === 1); const sz = Math.min(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)); return Math.max(1.4, Math.min(9, sz * .13)); };
  // 形状：蜡笔底色 + 背光侧一抹深色（虚边）+ 受光侧一点亮色 + 铅笔线
  const sh = (d, col, w = 2.4, k) => col === 'none' ? ln(d, w) : S.vol(d, { fill: col, under: .7, ff: 'crayon', soft: true, sf: 'crayon', k: k ?? kOf(d), lo: .4, st: .3, sw: w, stroke: INK });
  const dot = (x, y, r, col = INK) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`;
  const circ = (x, y, r, col, w = 2.2) => sh(`M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`, col, w, Math.max(1.2, r * .28));
  const ell = (x, y, rx, ry, col, w = 2.2) => sh(`M${x - rx} ${y}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`, col, w, Math.max(1.2, Math.min(rx, ry) * .28));
  const GRAD = `
<linearGradient id="deepG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1408" stop-opacity="0"/><stop offset="1" stop-color="#2a1408" stop-opacity=".38"/></linearGradient>
<radialGradient id="warmG"><stop offset="0" stop-color="#ffd27a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
<linearGradient id="shineG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9cfdc"/><stop offset="1" stop-color="#e8eff0"/></linearGradient>
<linearGradient id="springG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe2ee"/><stop offset="1" stop-color="#f4f6dc"/></linearGradient>
<linearGradient id="nightG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26304a"/><stop offset="1" stop-color="#3d3040"/></linearGradient>
<radialGradient id="lampG"><stop offset="0" stop-color="#ffe9a6" stop-opacity=".95"/><stop offset="1" stop-color="#ffe9a6" stop-opacity="0"/></radialGradient>
<radialGradient id="eyeG"><stop offset="0" stop-color="#fff3a0"/><stop offset=".5" stop-color="#f3c24f" stop-opacity=".8"/><stop offset="1" stop-color="#f3c24f" stop-opacity="0"/></radialGradient>`;
  const page = (inner, o = {}) => S.svg(W, H, S.paper(W, H, Object.assign({ base: C.paper, edge: '#d9c7a4', mottle: .22, fiber: .08, grain: .2, vig: .4 }, o.paper)) + inner, GRAD);

  // ============ 动物 ============
  // 仓鼠：正面"团子"，pose = sleep / awake / stretch / cry
  function hamster(x, y, s = 1, o = {}) {
    let p = '';
    const pose = o.pose || 'awake';
    if (pose === 'stretch') {
      p += sh('M-40 6 C-54 -2 -66 -16 -72 -30 C-74 -38 -66 -42 -62 -36 C-56 -24 -46 -12 -36 -6Z', C.ham, 2.4) + circ(-68, -36, 7, C.hamB, 1.8);
      p += sh('M40 6 C54 -2 66 -16 72 -30 C74 -38 66 -42 62 -36 C56 -24 46 -12 36 -6Z', C.ham, 2.4) + circ(68, -36, 7, C.hamB, 1.8);
    }
    p += circ(-28, -30, 11, C.ham) + dot(-28, -30, 5.5, C.pink);
    p += circ(28, -30, 11, C.ham) + dot(28, -30, 5.5, C.pink);
    p += sh('M-48 18 C-52 -10 -36 -40 0 -40 C36 -40 52 -10 48 18 C46 34 30 38 0 38 C-30 38 -46 34 -48 18Z', C.ham, 2.6);
    p += fc('M-32 22 C-34 2 -20 -14 0 -14 C20 -14 34 2 32 22 C30 33 -30 33 -32 22Z', C.hamB);
    p += fc('M-8 -38 C-4 -30 4 -30 8 -38 C4 -40 -4 -40 -8 -38Z', '#c98a4a', .7);
    if (pose === 'sleep') p += ln('M-24 -6 q7 6 14 0') + ln('M10 -6 q7 6 14 0');
    else if (pose === 'cry') {
      p += ln('M-24 -10 l10 6 M-24 -2 l10 -6') + ln('M24 -10 l-10 6 M24 -2 l-10 -6');
      p += `<path d="M-20 2 q-4 10 0 14 q4 -4 0 -14Z M20 2 q-4 10 0 14 q4 -4 0 -14Z" fill="${C.blue}" opacity=".8"/>`;
    } else p += dot(-15, -6, 5) + dot(15, -6, 5) + dot(-16.5, -8, 1.8, '#fff') + dot(13.5, -8, 1.8, '#fff');
    p += `<path d="M-4 2 L4 2 L0 6Z" fill="${C.pink}" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`;
    p += pose === 'cry' ? ln('M-7 14 q7 -6 14 0', 2) : ln('M-7 9 q3.5 4 7 0 q3.5 4 7 0', 2);
    p += `<ellipse cx="-27" cy="7" rx="7" ry="4" fill="${C.red}" opacity=".35"/><ellipse cx="27" cy="7" rx="7" ry="4" fill="${C.red}" opacity=".35"/>`;
    if (pose !== 'stretch') p += ell(-13, 32, 7, 5, C.hamB, 1.8) + ell(13, 32, 7, 5, C.hamB, 1.8);
    if (o.scarf) p += sh('M-36 14 C-20 24 20 24 36 14 L38 22 C20 32 -20 32 -38 22Z M22 22 L30 46 L40 42 L32 20Z', C.red, 2);
    return g(p, `${at(x, y, s)} filter="url(#wob)"`);
  }
  // 刺猬
  function hedgehog(x, y, s = 1, o = {}) {
    let spikes = '';
    const n = 15;
    for (let i = 0; i <= n; i++) {
      const a = Math.PI * (1.05 + i / n * .9), r = i % 2 ? 34 : 50;
      spikes += `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r * .95 + 6).toFixed(1)}`;
    }
    spikes += 'L40 30 L-40 30Z';
    let p = sh(spikes, C.hedge, 2.2);
    p += circ(-22, -18, 7, C.face, 1.8) + circ(22, -18, 7, C.face, 1.8);
    p += sh('M-32 14 C-34 -8 -18 -20 0 -20 C18 -20 34 -8 32 14 C30 28 -30 28 -32 14Z', C.face, 2.4);
    if (o.pose === 'sleep') p += ln('M-17 2 q5 5 10 0') + ln('M7 2 q5 5 10 0');
    else p += dot(-11, 0, 4) + dot(11, 0, 4) + dot(-12, -1.5, 1.4, '#fff') + dot(10, -1.5, 1.4, '#fff');
    p += dot(0, 10, 4.5) + ln('M-5 17 q5 4 10 0', 1.8);
    p += `<ellipse cx="-21" cy="10" rx="6" ry="3.5" fill="${C.red}" opacity=".35"/><ellipse cx="21" cy="10" rx="6" ry="3.5" fill="${C.red}" opacity=".35"/>`;
    return g(p, `${at(x, y, s)} filter="url(#wob)"`);
  }
  // 松鼠
  function squirrel(x, y, s = 1, o = {}) {
    let p = sh('M12 34 C56 42 64 -6 44 -38 C34 -56 52 -72 66 -60 C88 -28 76 48 18 54Z', C.squ, 2.4);
    p += ln('M30 38 C54 30 58 -6 48 -30', 1.6, '#a85428');
    p += sh('M-24 22 C-26 -2 -14 -6 0 -6 C14 -6 26 -2 24 22 C22 46 -22 46 -24 22Z', C.squ, 2.4);
    p += fc('M-12 24 C-12 8 12 8 12 24 C12 38 -12 38 -12 24Z', C.hamB);
    p += sh('M-20 -38 L-14 -58 L-6 -40Z', C.squ, 2) + sh('M20 -38 L14 -58 L6 -40Z', C.squ, 2);
    p += circ(0, -24, 24, C.squ, 2.4);
    p += fc('M-12 -14 C-12 -22 12 -22 12 -14 C12 -6 -12 -6 -12 -14Z', C.hamB);
    p += dot(-9, -28, 3.8) + dot(9, -28, 3.8) + dot(-10, -29.5, 1.3, '#fff') + dot(8, -29.5, 1.3, '#fff');
    p += dot(0, -17, 3) + ln('M-4 -12 q4 3 8 0', 1.6);
    p += `<ellipse cx="-16" cy="-17" rx="5" ry="3" fill="${C.red}" opacity=".35"/><ellipse cx="16" cy="-17" rx="5" ry="3" fill="${C.red}" opacity=".35"/>`;
    if (o.acorn !== false) p += acorn(0, 14, .7);
    if (o.wave) p += sh('M-22 6 C-34 -2 -40 -16 -36 -26 C-32 -30 -28 -28 -28 -22 C-28 -14 -22 -6 -16 0', C.squ, 2);
    return g(p, `${at(x, y, s)} filter="url(#wob)"`);
  }
  // 小熊
  function bear(x, y, s = 1, o = {}) {
    let p = circ(-24, -48, 11, C.bear) + circ(24, -48, 11, C.bear) + dot(-24, -48, 5, '#c79a74') + dot(24, -48, 5, '#c79a74');
    p += sh('M-36 20 C-40 -4 -24 -10 0 -10 C24 -10 40 -4 36 20 C34 44 -34 44 -36 20Z', C.bear, 2.4);
    p += circ(0, -26, 30, C.bear, 2.4);
    p += fc('M-14 -16 C-14 -28 14 -28 14 -16 C14 -6 -14 -6 -14 -16Z', '#e2c09c');
    p += fc('M-16 22 C-16 6 16 6 16 22 C16 36 -16 36 -16 22Z', '#c79a74');
    if (o.pose === 'sleep') p += ln('M-18 -32 q5 5 10 0') + ln('M8 -32 q5 5 10 0');
    else p += dot(-12, -32, 4) + dot(12, -32, 4) + dot(-13, -33.5, 1.4, '#fff') + dot(11, -33.5, 1.4, '#fff');
    p += `<ellipse cx="0" cy="-21" rx="5" ry="3.6" fill="${INK}"/>` + ln('M-5 -14 q5 4 10 0', 1.8);
    p += `<ellipse cx="-22" cy="-20" rx="6" ry="3.5" fill="${C.red}" opacity=".3"/><ellipse cx="22" cy="-20" rx="6" ry="3.5" fill="${C.red}" opacity=".3"/>`;
    if (o.scarf) p += sh('M-30 -2 C-12 6 12 6 30 -2 L32 6 C12 14 -12 14 -32 6Z M16 6 L22 30 L32 26 L26 4Z', C.blue, 2);
    return g(p, `${at(x, y, s)} filter="url(#wob)"`);
  }
  // 青蛙
  function frog(x, y, s = 1) {
    let p = sh('M-28 26 C-32 6 -18 0 0 0 C18 0 32 6 28 26 C26 40 -26 40 -28 26Z', C.frog, 2.2);
    p += fc('M-14 26 C-14 14 14 14 14 26 C14 34 -14 34 -14 26Z', '#e8f0c4');
    p += circ(-20, -28, 13, C.frog) + circ(20, -28, 13, C.frog);
    p += sh('M-40 -4 C-42 -24 -22 -30 0 -30 C22 -30 42 -24 40 -4 C38 12 -38 12 -40 -4Z', C.frog, 2.4);
    p += circ(-20, -30, 8, '#fff', 1.6) + circ(20, -30, 8, '#fff', 1.6) + dot(-19, -29, 4) + dot(21, -29, 4);
    p += ln('M-18 -2 C-8 6 8 6 18 -2', 2);
    p += `<ellipse cx="-28" cy="-6" rx="6" ry="3.5" fill="${C.red}" opacity=".35"/><ellipse cx="28" cy="-6" rx="6" ry="3.5" fill="${C.red}" opacity=".35"/>`;
    return g(p, `${at(x, y, s)} filter="url(#wob)"`);
  }
  // 黄大仙（黄鼠狼）：正面站立，举爪
  function weasel(x, y, s = 1, o = {}) {
    let p = '';
    // 尾巴
    p += sh('M18 60 C70 70 92 22 82 -22 C80 -36 94 -44 102 -32 C114 4 100 74 28 84Z', C.weasel, 2.6);
    p += sh('M84 -20 C80 -36 94 -44 102 -32 C106 -22 104 -10 102 -2 C96 -8 90 -14 84 -20Z', C.weaselD, 2);
    // 腿
    p += ell(-18, 86, 13, 8, C.weasel) + ell(18, 86, 13, 8, C.weasel);
    // 身子
    p += sh('M-30 80 C-38 30 -32 -18 -22 -40 L22 -40 C32 -18 38 30 30 80 C20 92 -20 92 -30 80Z', C.weasel, 2.6);
    p += fc('M-13 -36 C-17 0 -15 40 -10 72 L10 72 C15 40 17 0 13 -36Z', C.hamB);
    // 手臂 + 爪子
    if (o.claw !== false) {
      p += sh('M-24 -16 C-40 -26 -50 -44 -48 -60 C-46 -66 -38 -66 -36 -58 C-36 -46 -30 -34 -18 -26', C.weasel, 2.4);
      p += sh('M24 -16 C40 -26 50 -44 48 -60 C46 -66 38 -66 36 -58 C36 -46 30 -34 18 -26', C.weasel, 2.4);
      p += ln('M-50 -62 l-4 -8 M-44 -65 l-1 -9 M-38 -63 l3 -8', 2.2) + ln('M50 -62 l4 -8 M44 -65 l1 -9 M38 -63 l-3 -8', 2.2);
    }
    // 头
    p += circ(-27, -92, 10, C.weasel) + circ(27, -92, 10, C.weasel) + dot(-27, -92, 4.5, C.weaselD) + dot(27, -92, 4.5, C.weaselD);
    p += sh('M-34 -62 C-36 -88 -18 -102 0 -102 C18 -102 36 -88 34 -62 C32 -46 16 -38 0 -38 C-16 -38 -32 -46 -34 -62Z', C.weasel, 2.6);
    p += fc('M-18 -54 C-18 -64 18 -64 18 -54 C18 -42 -18 -42 -18 -54Z', C.hamB);
    p += fc('M-6 -100 C-4 -88 4 -88 6 -100Z', C.weaselD, .8);
    // 坏笑的眼睛
    p += `<path d="M-24 -72 Q-16 -80 -8 -72 Q-16 -68 -24 -72Z" fill="${INK}"/><path d="M24 -72 Q16 -80 8 -72 Q16 -68 24 -72Z" fill="${INK}"/>`;
    p += dot(-14, -74, 1.8, C.red) + dot(14, -74, 1.8, C.red);
    p += ln('M-28 -82 L-10 -78', 2.2) + ln('M28 -82 L10 -78', 2.2);
    p += `<ellipse cx="0" cy="-59" rx="5" ry="3.6" fill="${INK}"/>`;
    p += ln('M-12 -50 Q0 -42 12 -50', 2) + `<path d="M-7 -48 L-5 -43 L-3 -47Z M7 -48 L5 -43 L3 -47Z" fill="#fff" stroke="${INK}" stroke-width="1"/>`;
    p += ln('M-14 -56 L-36 -60 M-14 -53 L-36 -50 M14 -56 L36 -60 M14 -53 L36 -50', 1.2);
    return g(p, `${at(x, y, s)} filter="url(#wob)"`);
  }
  // 老獾（小卖部掌柜）
  function badger(x, y, s = 1) {
    let p = sh('M-40 40 C-46 0 -30 -10 0 -10 C30 -10 46 0 40 40 C36 60 -36 60 -40 40Z', '#8e8a86', 2.4);
    p += sh('M-24 4 L24 4 L26 50 L-26 50Z', C.cream, 2) + ln('M-10 24 L10 24 L10 38 L-10 38Z', 1.6);
    p += circ(-26, -46, 9, '#8e8a86') + circ(26, -46, 9, '#8e8a86');
    p += sh('M-34 -22 C-36 -48 -18 -60 0 -60 C18 -60 36 -48 34 -22 C32 -8 16 -2 0 -2 C-16 -2 -32 -8 -34 -22Z', '#f4efe6', 2.4);
    p += fc('M-20 -58 C-18 -40 -16 -28 -12 -20 L-6 -22 C-8 -32 -8 -46 -8 -60Z', '#2f2a26') + fc('M20 -58 C18 -40 16 -28 12 -20 L6 -22 C8 -32 8 -46 8 -60Z', '#2f2a26');
    p += circ(-13, -30, 7, 'none', 1.8) + circ(13, -30, 7, 'none', 1.8) + ln('M-6 -30 L6 -30', 1.6);
    p += dot(-13, -30, 2.8) + dot(13, -30, 2.8);
    p += `<ellipse cx="0" cy="-14" rx="5" ry="3.6" fill="${INK}"/>` + ln('M-6 -8 q6 4 12 0', 1.8);
    return g(p, `${at(x, y, s)} filter="url(#wob)"`);
  }

  // ============ 小东西 ============
  function acorn(x, y, s = 1) {
    return g(sh('M-11 0 C-12 14 -4 20 0 22 C4 20 12 14 11 0Z', '#c98f4e', 2) + sh('M-13 1 C-14 -8 -6 -12 0 -12 C6 -12 14 -8 13 1Z', '#8b5a2b', 2) + ln('M0 -12 L1 -18', 2.2), `${at(x, y, s)}`);
  }
  const ICON = {
    cone(x, y, s = 1) { // 松果（局内钱）
      return g(sh('M0 -18 C12 -16 16 0 12 10 C8 18 -8 18 -12 10 C-16 0 -12 -16 0 -18Z', '#a86c38', 2) +
        ln('M-10 -4 Q0 2 10 -4 M-11 5 Q0 11 11 5 M-7 -12 Q0 -7 7 -12', 1.4) + ln('M-4 -16 L-6 14 M4 -16 L6 14', 1.2) + ln('M0 -18 L1 -24', 2.2), `${at(x, y, s)} filter="url(#wob)"`);
    },
    nut(x, y, s = 1) { // 榛子（局外钱）
      return g(sh('M-15 2 C-15 -12 15 -12 15 2 C15 16 6 20 0 20 C-6 20 -15 16 -15 2Z', '#b9783e', 2) +
        sh('M-15 -2 C-12 -16 12 -16 15 -2 C8 -6 -8 -6 -15 -2Z', '#e3c28c', 1.8) + `<ellipse cx="-6" cy="6" rx="3" ry="5" fill="#fff" opacity=".4"/>`, `${at(x, y, s)} filter="url(#wob)"`);
    },
    honey(x, y, s = 1) { // 蜂蜜（付费钱）
      return g(sh('M-13 -10 L13 -10 C16 -4 16 14 12 18 L-12 18 C-16 14 -16 -4 -13 -10Z', C.yellow, 2) +
        sh('M-15 -16 L15 -16 L15 -9 L-15 -9Z', '#c9873e', 1.8) + `<path d="M-6 -9 q-2 8 0 10 q2 -2 0 -10Z" fill="${C.orange}"/>` +
        S.text(0, 6, '蜜', { size: 13, font: 'hupo', mid: true, fill: INK }), `${at(x, y, s)} filter="url(#wob)"`);
    },
    fly(x, y, s = 1) { // 萤火
      return g(`<circle cx="4" cy="4" r="12" fill="url(#lampG)"/>` + ell(-4, -2, 7, 6, '#5c4a3a', 1.6) + ell(5, 5, 7, 6, C.yellow, 1.6) +
        `<path d="M-6 -8 C-14 -18 -4 -20 -2 -8 M0 -8 C4 -20 12 -14 2 -6" fill="#e4eef4" opacity=".9" stroke="${INK}" stroke-width="1.2"/>`, `${at(x, y, s)} filter="url(#wob)"`);
    },
    snow(x, y, s = 1) {
      let p = '';
      for (let i = 0; i < 3; i++) p += `<path d="M0 -14 L0 14 M-4 -10 L0 -6 L4 -10 M-4 10 L0 6 L4 10" transform="rotate(${i * 60})" stroke="${C.blue}" stroke-width="2.4" stroke-linecap="round" fill="none"/>`;
      return g(p, `${at(x, y, s)} filter="url(#wob)"`);
    },
    sprout(x, y, s = 1) {
      return g(ln('M0 14 C0 4 0 -2 0 -6', 2.6, '#4f7a34') + sh('M0 -4 C-4 -16 -16 -18 -18 -10 C-12 -4 -6 -4 0 -4Z', C.green, 1.8) +
        sh('M0 -6 C4 -18 16 -20 18 -12 C12 -6 6 -6 0 -6Z', C.green2, 1.8), `${at(x, y, s)} filter="url(#wob)"`);
    },
    calendar(x, y, s = 1) {
      return g(sh('M-16 -12 L16 -12 L16 16 L-16 16Z', C.cream, 2) + sh('M-16 -12 L16 -12 L16 -3 L-16 -3Z', C.red, 2) +
        ln('M-8 -16 L-8 -8 M8 -16 L8 -8', 2.4) + S.text(0, 7, '7', { size: 14, font: 'hupo', mid: true }), `${at(x, y, s)} filter="url(#wob)"`);
    },
    list(x, y, s = 1) {
      return g(sh('M-14 -18 L14 -18 L14 18 L-14 18Z', C.cream, 2) + ln('M-6 -8 L8 -8 M-6 0 L8 0 M-6 8 L4 8', 1.8) +
        dot(-10, -8, 1.8) + dot(-10, 0, 1.8) + dot(-10, 8, 1.8) + acorn(10, 14, .55), `${at(x, y, s)} filter="url(#wob)"`);
    },
    book(x, y, s = 1) {
      return g(sh('M-18 -14 C-8 -18 -2 -14 0 -12 C2 -14 8 -18 18 -14 L18 16 C8 12 2 14 0 16 C-2 14 -8 12 -18 16Z', C.green2, 2) + ln('M0 -12 L0 16', 1.6) +
        `<path d="M-12 -2 C-10 -8 -4 -8 -4 -2" fill="none" stroke="${INK}" stroke-width="1.4"/>`, `${at(x, y, s)} filter="url(#wob)"`);
    },
    mail(x, y, s = 1) {
      return g(sh('M-18 -12 L18 -12 L18 14 L-18 14Z', C.cream, 2) + ln('M-18 -12 L0 3 L18 -12', 1.8) +
        sh('M8 2 C6 -4 14 -6 14 0 C14 6 8 8 8 2Z', C.green, 1.4), `${at(x, y, s)} filter="url(#wob)"`);
    },
    shopI(x, y, s = 1) { // 树洞招牌
      return g(sh('M-18 16 L-18 -4 C-18 -22 18 -22 18 -4 L18 16Z', C.wood2, 2) + sh('M-10 16 L-10 0 C-10 -10 10 -10 10 0 L10 16Z', C.soilD, 1.6) +
        sh('M-20 -2 L20 -2 L18 6 L-18 6Z', C.yellow, 1.6), `${at(x, y, s)} filter="url(#wob)"`);
    },
    nestI(x, y, s = 1) {
      return g(sh('M-20 0 C-20 14 20 14 20 0 C20 -6 -20 -6 -20 0Z', C.straw, 2) + ln('M-14 2 L-6 8 M-4 2 L4 9 M6 2 L14 7', 1.3) +
        circ(-4, -6, 7, C.ham, 1.6) + circ(6, -8, 6, C.hamB, 1.4), `${at(x, y, s)} filter="url(#wob)"`);
    },
    moon(x, y, s = 1) {
      return g(sh('M6 -18 C-8 -18 -16 -6 -14 6 C-12 18 2 22 12 16 C0 14 -6 4 -4 -6 C-2 -14 2 -16 6 -18Z', C.yellow, 2) +
        S.text(14, -8, 'z', { size: 13, font: 'hupo', mid: true, fill: INK }) + S.text(20, -18, 'z', { size: 10, font: 'hupo', mid: true, fill: INK }), `${at(x, y, s)} filter="url(#wob)"`);
    },
    paw(x, y, s = 1) {
      return g(ell(0, 6, 11, 9, C.pink, 2) + circ(-12, -8, 5, C.pink, 1.6) + circ(-4, -14, 5, C.pink, 1.6) + circ(5, -14, 5, C.pink, 1.6) + circ(13, -8, 5, C.pink, 1.6), `${at(x, y, s)} filter="url(#wob)"`);
    },
    trophy(x, y, s = 1) {
      return g(sh('M-12 -16 L12 -16 C12 0 6 6 0 6 C-6 6 -12 0 -12 -16Z', C.yellow, 2) + ln('M-12 -12 C-20 -12 -20 -2 -10 -2 M12 -12 C20 -12 20 -2 10 -2', 1.8) +
        ln('M0 6 L0 12', 2.4) + sh('M-9 12 L9 12 L9 17 L-9 17Z', C.wood2, 1.8) + acorn(0, -8, .4), `${at(x, y, s)} filter="url(#wob)"`);
    },
    adI(x, y, s = 1) { // 看广告：小电视
      return g(sh('M-16 -10 L16 -10 L16 12 L-16 12Z', C.cream, 2) + `<path d="M-4 -4 L6 1 L-4 6Z" fill="${C.red}"/>` + ln('M-6 -16 L0 -10 L6 -16', 1.8), `${at(x, y, s)} filter="url(#wob)"`);
    },
    fur(x, y, s = 1) { // 黄大仙的毛
      return g(sh('M-4 16 C-12 4 -10 -10 2 -18 C0 -8 8 -2 6 8 C5 12 2 15 -4 16Z', C.weasel, 2) + ln('M-2 10 C-4 2 -2 -6 2 -12', 1.2, C.weaselD), `${at(x, y, s)} filter="url(#wob)"`);
    }
  };

  // 炮台/设施（俯视里用正面画）
  const BUILD = {
    sling(x, y, s = 1) { // 松果弹弓
      return g(sh('M-4 22 L-4 2 C-16 -4 -18 -16 -16 -24 L-10 -24 C-10 -14 -6 -8 0 -6 C6 -8 10 -14 10 -24 L16 -24 C18 -16 16 -4 4 2 L4 22Z', C.wood2, 2.2) +
        ln('M-13 -22 C-8 -8 8 -8 13 -22', 1.8, C.red) + g(ICON.cone(0, -10, .55)), `${at(x, y, s)} filter="url(#wob)"`);
    },
    hive(x, y, s = 1) { // 蜂窝
      return g(sh('M-18 18 C-24 -2 -14 -22 0 -22 C14 -22 24 -2 18 18Z', C.yellow, 2.2) + ln('M-20 4 L20 4 M-16 -8 L16 -8', 1.6, '#b78726') +
        sh('M-5 18 C-5 12 5 12 5 18Z', C.soilD, 1.4) + bee(-20, -18) + bee(18, -20), `${at(x, y, s)} filter="url(#wob)"`);
    },
    burr(x, y, s = 1) { // 栗子刺球（地雷）
      let p = '';
      for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; p += `<path d="M${Math.cos(a) * 12} ${Math.sin(a) * 12} L${Math.cos(a) * 22} ${Math.sin(a) * 22}" stroke="#5e7c34" stroke-width="2.6" stroke-linecap="round"/>`; }
      return g(p + circ(0, 0, 14, '#8fb85a', 2) + sh('M-6 -2 C-6 -10 6 -10 6 -2 C6 6 -6 6 -6 -2Z', '#8b5a2b', 1.4), `${at(x, y, s)} filter="url(#wob)"`);
    },
    lamp(x, y, s = 1) { // 萤火灯（发电）
      return g(`<circle cx="0" cy="2" r="30" fill="url(#lampG)"/>` + sh('M-12 -14 L12 -14 C16 -6 16 14 12 20 L-12 20 C-16 14 -16 -6 -12 -14Z', '#f7f2d0', 2.2) +
        sh('M-14 -20 L14 -20 L14 -13 L-14 -13Z', C.wood2, 1.8) + dot(-4, 2, 3.4, C.yellow) + dot(5, 9, 3, C.yellow) + dot(3, -4, 2.6, C.yellow), `${at(x, y, s)} filter="url(#wob)"`);
    },
    spider(x, y, s = 1) { // 蜘蛛（修门）
      let legs = '';
      [-1, 1].forEach(d => [[-6, -12], [-2, -14], [2, -14], [6, -10]].forEach(([oy, ex]) => {
        legs += ln(`M${d * 6} ${oy * .6} q${d * 10} -8 ${d * (12 + Math.abs(ex) * .4)} ${4 + oy * .2}`, 1.8);
      }));
      return g(ln('M0 -26 L0 -10', 1.2, '#999') + legs + circ(0, 0, 10, '#5b4a6e', 2) + circ(0, -10, 6, '#5b4a6e', 1.8) +
        dot(-2.5, -11, 1.6, '#fff') + dot(2.5, -11, 1.6, '#fff') + sh('M-6 18 L6 18 L4 24 L-4 24Z', C.cream, 1.4), `${at(x, y, s)} filter="url(#wob)"`);
    },
    shroom(x, y, s = 1) { // 蘑菇（催眠减速）
      return g(sh('M-7 4 L-8 20 L8 20 L7 4Z', C.cream, 2) + sh('M-22 6 C-24 -14 -10 -22 0 -22 C10 -22 24 -14 22 6Z', C.red, 2.2) +
        dot(-10, -8, 3.4, '#fff') + dot(6, -12, 2.8, '#fff') + dot(12, -2, 2.4, '#fff') + dot(-2, 0, 2, '#fff'), `${at(x, y, s)} filter="url(#wob)"`);
    }
  };
  function bee(x, y) {
    return g(ell(0, 0, 6, 4.5, C.yellow, 1.4) + ln('M-1 -4 L-1 4 M2 -4 L2 4', 1.2) + `<ellipse cx="-1" cy="-6" rx="3.5" ry="2.4" fill="#eef4f8" stroke="${INK}" stroke-width="1"/>`, at(x, y));
  }

  // 窝：草窝里睡着一只
  function nest(x, y, s = 1, who = 'hamster', lvTag) {
    let p = ell(0, 14, 66, 30, C.straw, 2.4);
    for (let i = 0; i < 12; i++) { const a = Math.PI * (.08 + i * .07); p += ln(`M${Math.cos(a) * 62} ${14 + Math.sin(a) * 26} l${-6 + (i % 3) * 4} -8`, 1.4, '#b79246'); }
    p += ell(0, 8, 52, 20, '#f6e3a8', 1.8);
    const body = who === 'hedgehog' ? hedgehog(0, -4, .8, { pose: 'sleep' }) : who === 'bear' ? bear(0, 0, .7, { pose: 'sleep' }) : hamster(0, -4, .82, { pose: 'sleep' });
    p += body;
    p += sh('M-44 10 C-30 -2 30 -6 48 8 C40 26 -36 28 -44 10Z', C.green, 2.2) + ln('M-30 12 C-10 6 20 6 40 10', 1.4, '#4f7a34');
    p += S.text(52, -30, 'z', { size: 20, font: 'hupo', fill: C.blue, mid: true }) + S.text(66, -48, 'Z', { size: 26, font: 'hupo', fill: C.blue, mid: true });
    if (lvTag) p += tag(0, 52, lvTag);
    return g(p, at(x, y, s));
  }
  function tag(x, y, t, col = C.yellow) {
    const w = t.length * 14 + 18;
    return S.rect(x - w / 2, y - 13, w, 26, { r: 13, fill: col, sw: 1.8, passes: 1, jit: .5 }) + T(x, y + 1, t, { size: 15, font: 'you', weight: 'bold', mid: true });
  }

  // 贴纸标题：外圈白边 + 铅笔棕描边 + 填色，上半截一道高光
  function ttl(x, y, text, o = {}) {
    const a = { size: o.size || 80, font: 'hupo', mid: true, ls: o.ls || 2 };
    let s = T(x, y + 5, text, Object.assign({}, a, { fill: '#3f2c20', stroke: '#3f2c20', sw: (o.sw || 7) + 12, op: .25 }));
    s += T(x, y, text, Object.assign({}, a, { fill: '#fff', stroke: '#fff', sw: (o.sw || 7) + 12 }));
    s += T(x, y, text, Object.assign({}, a, { fill: o.fill || C.orange, stroke: INK, sw: o.sw || 7 }));
    s += T(x, y, text, Object.assign({}, a, { fill: 'url(#shineG)', op: .6 }));
    return g(s, 'filter="url(#wob)"');
  }
  // 缝线：圆角框里一圈虚线
  const stitch = (x, y, w, h, r, col = INK, op = .45) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="none" stroke="${col}" stroke-width="1.6" stroke-dasharray="5 5" opacity="${op}"/>`;

  // ---------- 按钮 ----------
  // 枕头形主按钮
  function pillow(x, y, w, h, label, o = {}) {
    const d = `M${x + 16} ${y + 6} C${x + w * .3} ${y + 14} ${x + w * .7} ${y + 14} ${x + w - 16} ${y + 6} C${x + w - 4} ${y + h * .3} ${x + w - 4} ${y + h * .7} ${x + w - 16} ${y + h - 6} C${x + w * .7} ${y + h - 14} ${x + w * .3} ${y + h - 14} ${x + 16} ${y + h - 6} C${x + 4} ${y + h * .7} ${x + 4} ${y + h * .3} ${x + 16} ${y + 6}Z`;
    let s = `<path d="${d}" fill="#000" opacity=".12" transform="translate(0 6)" filter="url(#soft)"/>`;
    s += sh(d, o.col || C.yellow, 3);
    s += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="1.6" stroke-dasharray="5 6" transform="translate(${x + w / 2} ${y + h / 2}) scale(.88 .78) translate(${-x - w / 2} ${-y - h / 2})" opacity=".55"/>`;
    s += T(x + w / 2, y + h / 2 + (o.sub ? -10 : 2), label, { size: o.size || 44, font: 'hupo', mid: true, fill: o.fg || INK, ls: o.ls || 4 });
    if (o.sub) s += T(x + w / 2, y + h / 2 + 26, o.sub, { size: 18, font: 'you', weight: 'bold', mid: true, fill: o.fg || INK, op: .8 });
    return g(s, 'filter="url(#wob)"');
  }
  function btn(x, y, w, h, label, o = {}) {
    let s = S.rect(x, y + 6, w, h, { r: h / 2.4, fill: '#3f2c20', fo: .22, stroke: 'none', jit: .6 });
    s += S.rect(x, y, w, h, { r: h / 2.4, fill: o.col || C.cream, sw: 2.6, jit: 1, ff: 'crayon' });
    s += S.rect(x + 3, y + h * .55, w - 6, h * .42, { r: h / 3, fill: '#3f2c20', fo: .08, stroke: 'none', jit: .3 });
    s += `<path d="M${x + h * .45} ${y + 7} H${x + w - h * .45}" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>` + stitch(x + 6, y + 6, w - 12, h - 12, h / 3);
    s += T(x + w / 2 + (o.icon ? 16 : 0), y + h / 2 + (o.dy || 0), label, { size: o.size || 26, font: o.font || 'hupo', mid: true, fill: o.fg || INK, ls: o.ls || 1 });
    if (o.icon) s += o.icon(x + w / 2 - (o.iconDx || 50), y + h / 2, o.iconS || 1);
    return s;
  }
  function pill(x, y, w, icon, val, o = {}) {
    let s = S.rect(x, y + 4, w, 40, { r: 20, fill: '#3f2c20', fo: .18, stroke: 'none', jit: .4 }) + S.rect(x, y, w, 40, { r: 20, fill: C.cream, fo: .92, sw: 2, passes: 1 }) + `<path d="M${x + 20} ${y + 6} H${x + w - 24}" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>`;
    s += icon(x + 20, y + 20, .9);
    s += T(x + 42, y + 21, val, { size: 22, font: 'hupo', anchor: 'start', mid: true });
    if (o.plus !== false) s += S.circle(x + w - 18, y + 20, 11, { fill: C.green, sw: 1.6, passes: 1, jit: .5 }) + T(x + w - 18, y + 20, '+', { size: 20, font: 'hupo', fill: '#fff', mid: true });
    return s;
  }
  function star(x, y, r, on) {
    const P = [];
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .5 : r; P.push([x + rr * Math.cos(a), y + rr * Math.sin(a)]); }
    return S.poly(P, { fill: on ? C.yellow : '#fff', fo: on ? 1 : .5, stroke: on ? INK : C.grey, sw: 1.8, passes: 1, jit: .5, step: 6, ff: on ? 'crayon' : null });
  }
  function topbar(o = {}) {
    let s = circ(70, 136, 41, C.orange, 2.6) + S.circle(70, 136, 36, { fill: '#fff4dc', sw: 1.6, passes: 1, jit: .3 }) + stitch(32, 98, 76, 76, 38, '#fff', .8);
    s += `<clipPath id="avc"><circle cx="70" cy="136" r="35"/></clipPath><g clip-path="url(#avc)">${hamster(70, 150, .72)}</g>`;
    s += T(124, 124, o.name || '阿糯', { size: 28, anchor: 'start', font: 'hupo' });
    s += S.rect(124, 142, 112, 26, { r: 13, fill: C.blue, sw: 1.6, passes: 1, jit: .5 });
    s += T(180, 156, o.rank || '酣睡 Ⅲ', { size: 16, font: 'you', weight: 'bold', fill: '#fff', mid: true });
    const stars = o.stars ?? ST().stars ?? 2;
    s += [0, 1, 2].map(i => star(254 + i * 24, 155, 10, i < stars)).join('');
    if (o.cur !== false) {
      s += pill(420, 186, 160, ICON.nut, fmt(ST().nut ?? 3420));
      s += pill(594, 186, 140, ICON.honey, fmt(ST().honey ?? 45));
    }
    return s;
  }
  function nav(active) {
    const tabs = [['小卖部', ICON.shopI], ['窝', ICON.nestI], ['冬眠', null], ['伙伴', ICON.paw], ['排行', ICON.trophy]];
    let s = S.rect(-10, 1212, 770, 146, { fill: '#3f2c20', fo: .15, stroke: 'none' }) + S.rect(-10, 1218, 770, 140, { fill: C.cream, sw: 2.6, jit: 1.2, ff: 'crayon' }) + `<path d="M0 1228 H750" stroke="${INK}" stroke-width="1.6" stroke-dasharray="6 6" opacity=".35"/>`;
    tabs.forEach(([name, ic], i) => {
      const x = 75 + i * 150, on = name === active;
      if (i === 2) {
        s += S.circle(x, 1236, 58, { fill: on ? C.blue : C.cream, sw: 3, ff: 'crayon' });
        s += ICON.moon(x - 2, 1226, 1.6);
        s += T(x, 1278, '冬眠', { size: 24, font: 'hupo', mid: true, fill: on ? '#fff' : INK });
        return;
      }
      if (on) s += S.ell(x, 1268, 52, 42, { fill: C.yellow, fo: .55, stroke: 'none', ff: 'crayon' });
      s += ic(x, 1258, 1.25);
      s += T(x, 1306, name, { size: 21, font: on ? 'hupo' : 'you', weight: on ? null : 'bold', mid: true, fill: on ? C.orange : INK });
    });
    return s;
  }
  // 雪花点点
  function snowfall(x0, y0, w, h, n, seed) {
    S.seed(seed);
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + S.rand() * w, y = y0 + S.rand() * h, r = 2 + S.rand() * 4;
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#fff" stroke="${C.snowB}" stroke-width="1"/>`;
    }
    return s;
  }
  // 土层：底色 + 小石子 + 根须 + 蚯蚓
  function soil(x, y, w, h, o = {}) {
    const base = o.col || C.soil;
    let s = S.rect(x, y, w, h, { fill: base, stroke: 'none', jit: 2, ff: 'crayon' });
    S.seed(o.seed || 9);
    // 土层：几道起伏的深浅带
    for (let i = 0; i < 4; i++) {
      const by = y + h * (.18 + i * .22), amp = 10 + S.rand() * 10, th = 26 + S.rand() * 30;
      const top = [], bot = [];
      for (let k = 0; k <= 6; k++) { const px = x - 20 + (w + 40) * k / 6; top.push([px, by + Math.sin(k * 1.3 + i) * amp]); bot.push([px, by + th + Math.sin(k * 1.1 + i * 2) * amp]); }
      s += `<path d="${S.spline(S.sampleSpline(top, false, 6).concat(S.sampleSpline(bot, false, 6).reverse()), true)}" fill="${SK.mix(base, i % 2 ? '#2a1408' : '#e8c89a', .16)}" opacity=".7" filter="url(#crayon)"/>`;
    }
    for (let i = 0; i < Math.round((o.stones || 26) * .7); i++) {
      const px = x + S.rand() * w, py = y + S.rand() * h, r = 3.5 + S.rand() * 8;
      const c = S.rand() > .5 ? '#b49478' : '#7d6250';
      s += S.vol(SK.ellD(px, py, r, r * .7), { fill: c, k: r * .35, lk: r * .25, lo: .5, sw: 1.4, stroke: '#4a3426' });
    }
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#deepG)"/>`;
    for (let i = 0; i < (o.roots || 0); i++) {
      const px = x + S.rand() * w, py = y + S.rand() * h * .5;
      s += S.curve([[px, py], [px + S.rr(-30, 30), py + 40], [px + S.rr(-40, 40), py + 90]], { stroke: '#e0c39a', sw: 2.4, op: .7 });
    }
    (o.worms || []).forEach(([wx, wy]) => {
      s += S.brush([[wx, wy], [wx + 14, wy - 8], [wx + 28, wy], [wx + 42, wy - 6]], { w: 7, w0: .7, w1: .7, fill: C.pink, wav: 0 });
      s += dot(wx + 40, wy - 7, 1.4);
    });
    return s;
  }
  // 一间洞：不规则圆角
  function cave(cx, cy, rx, ry, o = {}) {
    S.seed(o.seed || 3);
    const P = [];
    for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2, k = 1 + S.rr(-.05, .05); P.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
    const d = S.spline(P, true);
    const fill = o.fill || C.floor;
    let s = `<path d="${d}" fill="${fill}" opacity=".75"/><path d="${d}" fill="${fill}" filter="url(#crayon)"/>`;
    s += S.vol(d, { fill: 'none', shade: '#6a4528', k: -Math.min(rx, ry) * .16, ky: 1.2, soft: true, light: false, so: .55, stroke: 'none', sf: 'crayon' });
    s += S.vol(d, { fill: 'none', shade: '#fff3d0', k: Math.min(rx, ry) * .08, soft: true, light: false, so: .5, stroke: 'none' });
    for (let i = 0; i < 10; i++) { const a = S.rand() * Math.PI * 2, rr = Math.sqrt(S.rand()) * .7; s += `<ellipse cx="${N(cx + Math.cos(a) * rx * rr)}" cy="${N(cy + Math.sin(a) * ry * rr)}" rx="${N(2 + S.rand() * 3)}" ry="${N(1.4 + S.rand() * 1.6)}" fill="#b89068" opacity=".45"/>`; }
    s += `<path d="${d}" fill="none" stroke="${C.soilD}" stroke-width="6" opacity=".6" filter="url(#wob)"/><path d="${d}" fill="none" stroke="${INK}" stroke-width="2.4" filter="url(#wob)"/>`;
    return s;
  }
  // 门
  function door(cx, cy, w, o = {}) {
    let s = S.rect(cx - w / 2, cy - 18, w, 44, { r: 6, fill: '#3f2c20', fo: .25, stroke: 'none' }) + sh(`M${cx - w / 2 + 6} ${cy - 22} H${cx + w / 2 - 6} Q${cx + w / 2} ${cy - 22} ${cx + w / 2} ${cy - 16} V${cy + 16} Q${cx + w / 2} ${cy + 22} ${cx + w / 2 - 6} ${cy + 22} H${cx - w / 2 + 6} Q${cx - w / 2} ${cy + 22} ${cx - w / 2} ${cy + 16} V${cy - 16} Q${cx - w / 2} ${cy - 22} ${cx - w / 2 + 6} ${cy - 22}Z`, o.col || C.wood, 2.4, 4);
    s += `<path d="M${cx - w / 2 + 4} ${cy - 8} H${cx + w / 2 - 4} M${cx - w / 2 + 4} ${cy + 10} H${cx + w / 2 - 4}" stroke="#7a5232" stroke-width="3" opacity=".5"/>`;
    [[cx - w / 2 + 10, cy - 8], [cx + w / 2 - 10, cy - 8], [cx - w / 2 + 10, cy + 10], [cx + w / 2 - 10, cy + 10]].forEach(([a, b]) => { s += dot(a, b, 2.2, '#5a4a40') + dot(a - .6, b - .6, .8, '#d8d0c6'); });
    for (let i = 1; i < 4; i++) s += S.line([[cx - w / 2 + w * i / 4, cy - 20], [cx - w / 2 + w * i / 4, cy + 20]], { sw: 1.6, op: .7 });
    if (o.tin) s += S.circle(cx, cy, 15, { fill: '#c9ced2', sw: 2, ff: 'crayon' }) + S.circle(cx, cy, 9, { stroke: '#8d969c', sw: 1.4, passes: 1 });
    if (o.scratch) s += S.brush([[cx - 26, cy - 16], [cx - 14, cy + 12]], { w: 4, fill: C.red }) + S.brush([[cx - 16, cy - 18], [cx - 4, cy + 14]], { w: 4, fill: C.red }) + S.brush([[cx - 6, cy - 16], [cx + 6, cy + 12]], { w: 4, fill: C.red });
    if (o.lv) s += S.circle(cx + w / 2 + 2, cy - 22, 15, { fill: C.blue, sw: 1.8, passes: 1, jit: .4 }) + T(cx + w / 2 + 2, cy - 22, o.lv, { size: 14, font: 'hupo', fill: '#fff', mid: true });
    return s;
  }
  function hpbar(x, y, w, v, col = C.red, h = 12) {
    return S.rect(x, y, w, h, { r: h / 2, fill: '#fff', fo: .8, sw: 1.8, passes: 1, jit: .4 }) +
      S.rect(x + 2, y + 2, Math.max(4, (w - 4) * v), h - 4, { r: (h - 4) / 2, fill: col, stroke: 'none', jit: .3, ff: 'crayon' });
  }
  function bubble(x, y, w, h, text, o = {}) {
    const tx = o.tail || [x + 24, y + h + 14];
    let s = S.curve([[x, y + h / 2], [x + w * .1, y], [x + w * .9, y], [x + w, y + h / 2], [x + w * .9, y + h], [x + 40, y + h], tx, [x + 18, y + h - 2], [x + w * .05, y + h * .9]], { closed: true, fill: o.fill || '#fff', sw: 2.2, passes: 1 });
    s += T(x + w / 2, y + h / 2 + 1, text, { size: o.size || 20, font: 'hupo', mid: true, fill: o.col || INK });
    return s;
  }

  // 霍比特式圆顶木门（剖面图里的门）
  function archDoor(x, y, w, h, o = {}) {
    const d = `M${x - w / 2} ${y + h / 2} L${x - w / 2} ${y - h / 2 + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w / 2} ${y - h / 2 + w / 2} L${x + w / 2} ${y + h / 2}Z`;
    let s = sh(d, o.col || C.wood, 2.6);
    for (let i = 1; i < 4; i++) s += ln(`M${x - w / 2 + w * i / 4} ${y - h / 2 + (i === 2 ? 2 : 8)} L${x - w / 2 + w * i / 4} ${y + h / 2 - 2}`, 1.6);
    s += ln(`M${x - w / 2 + 4} ${y - 4} L${x + w / 2 - 4} ${y - 4}`, 3, C.wood2) + dot(x + w / 2 - 12, y + 8, 4, C.yellow);
    if (o.lv) s += S.circle(x + w / 2, y - h / 2 + 8, 15, { fill: C.blue, sw: 1.8, passes: 1, jit: .4 }) + T(x + w / 2, y - h / 2 + 8, o.lv, { size: 14, font: 'hupo', fill: '#fff', mid: true });
    return g(s, 'filter="url(#wob)"');
  }

  // ============ 页面 ============
  // ---------- 01 主页：雪地下面一间暖洞 ----------
  function home() {
    let s = '';
    s += `<rect x="0" y="0" width="750" height="470" fill="url(#skyG)" opacity=".95"/>`;
    s += snowfall(0, 236, 750, 220, 40, 4);
    // 远山 + 右边一棵光秃秃的树
    s += S.curve([[-20, 420], [120, 370], [260, 404], [400, 362], [560, 398], [770, 366], [770, 470], [-20, 470]], { closed: true, fill: '#e9f0f3', stroke: C.snowB, sw: 2, ff: 'crayon' });
    s += S.poly([[676, 470], [682, 380], [668, 330], [684, 330], [694, 370], [716, 318], [730, 324], [706, 384], [708, 470]], { fill: '#8a6244', sw: 2.4, ff: 'crayon', step: 12 });
    s += S.curve([[704, 324], [722, 312], [740, 314]], { sw: 6, stroke: '#fff' }) + S.curve([[662, 332], [676, 326], [688, 330]], { sw: 6, stroke: '#fff' });
    // 地下
    s += soil(0, 470, 750, 760, { seed: 5, stones: 30, worms: [[610, 1046], [420, 540]] });
    s += S.rect(0, 470, 750, 200, { fill: '#a97a50', fo: .45, stroke: 'none', ff: 'crayon' });
    s += S.curve([[-20, 466], [100, 452], [230, 470], [380, 456], [520, 470], [660, 452], [770, 464], [770, 492], [-20, 494]], { closed: true, fill: '#fff', stroke: C.snowB, sw: 2.4, ff: 'crayon' });
    [[690, 490, 640, 560, 590, 600], [700, 490, 720, 560, 744, 600]].forEach(([a, b, c, d, e, f]) => {
      s += S.brush([[a, b], [c, d], [e, f]], { w: 9, w0: 1, w1: .2, fill: '#6b4a31' });
    });
    // 地面洞口 → 斜隧道 → 门
    s += S.curve([[230, 520], [222, 556], [200, 604], [196, 652]], { sw: 64, stroke: C.tunnel, passes: 1, jit: 1.2 });
    s += S.rect(198, 486, 64, 40, { fill: C.tunnel, stroke: 'none', jit: .5 });
    s += S.ell(232, 486, 36, 12, { fill: C.soilD, sw: 2, ff: 'crayon' });
    s += S.curve([[204, 492], [192, 548], [168, 600], [164, 646]], { sw: 2.2, op: .7 }) + S.curve([[260, 492], [252, 548], [232, 600], [228, 646]], { sw: 2.2, op: .7 });
    // 主洞：暖光
    s += cave(392, 830, 282, 172, { seed: 8, fill: '#f0d9a6' });
    s += `<circle cx="392" cy="780" r="240" fill="url(#lampG)" opacity=".6"/>`;
    s += archDoor(196, 690, 66, 92, { lv: '3' });
    s += S.rect(484, 690, 70, 54, { r: 4, fill: C.cream, sw: 2.2, ff: 'crayon' }) + S.rect(491, 697, 56, 40, { fill: C.sky, stroke: 'none', ff: 'crayon' }) + ICON.sprout(519, 722, .9);
    s += S.line([[392, 660], [392, 700]], { sw: 1.6 }) + BUILD.lamp(392, 722, 1.1);
    [[566, 884], [594, 888], [580, 866], [610, 876], [552, 872]].forEach(([px, py]) => { s += ICON.cone(px, py, .9); });
    s += nest(374, 880, 1.85, 'hamster');
    // 侧洞：刺猬、松鼠
    s += cave(88, 1012, 88, 60, { seed: 12, fill: '#e8cf9d' }) + hedgehog(94, 1020, .6, { pose: 'sleep' }) + T(132, 980, 'z', { size: 18, font: 'hupo', fill: C.blue, mid: true });
    s += cave(676, 590, 66, 56, { seed: 15, fill: '#e8cf9d' }) + squirrel(672, 600, .52);
    // 右下暗处一双眼
    s += S.curve([[640, 1000], [700, 984], [780, 996]], { sw: 44, stroke: '#2b1d14', passes: 1, op: .92 });
    s += `<circle cx="690" cy="990" r="9" fill="url(#eyeG)"/><circle cx="714" cy="988" r="9" fill="url(#eyeG)"/>` + dot(690, 990, 2.4, INK) + dot(714, 988, 2.4, INK);
    // 标题 + 字头积雪
    s += ttl(375, 304, '躺平过冬', { size: 104, ls: 4 });
    [[212, 256, 44], [322, 254, 40], [432, 254, 46], [538, 256, 40]].forEach(([x, y, w]) => {
      s += S.curve([[x - w / 2, y + 6], [x - w / 4, y - 5], [x + w / 4, y - 4], [x + w / 2, y + 6], [x + w / 4, y + 11], [x, y + 7], [x - w / 4, y + 12]], { closed: true, fill: '#fff', sw: 2, ff: 'crayon' });
    });
    s += T(375, 376, '地 下 冬 眠 塔 防', { size: 24, font: 'you', weight: 'bold', mid: true, fill: C.soilD, ls: 2 });
    // 左侧入口
    [['签到', ICON.calendar, 1], ['任务', ICON.list, 1], ['图鉴', ICON.book, 0], ['信箱', ICON.mail, 0]].forEach(([n, ic, dotOn], i) => {
      const y = 560 + i * 100;
      s += S.circle(52, y, 32, { fill: C.cream, sw: 2.2, ff: 'crayon' }) + ic(52, y - 2, 1);
      s += T(52, y + 47, n, { size: 17, font: 'you', weight: 'bold', mid: true, fill: '#fff', stroke: INK, sw: 3 });
      if (dotOn) s += S.circle(77, y - 24, 8, { fill: C.red, sw: 1.4, passes: 1, jit: .3 });
    });
    // 按钮
    s += pillow(210, 1066, 330, 118, '开始冬眠', { sub: '6 只小动物 · 熬到春天', size: 46 });
    s += btn(36, 1078, 156, 94, '当黄大仙', { size: 24, col: '#f3dcae', dy: -14 });
    s += hpbar(66, 1128, 106, (ST().fur ?? 7) / 12, C.orange, 14) + ICON.fur(56, 1134, .6) + T(114, 1156, `毛 ${ST().fur ?? 7}/12`, { size: 14, font: 'you', weight: 'bold', mid: true });
    s += btn(558, 1078, 156, 94, '好友房', { size: 26, dy: -12 });
    s += T(636, 1148, '一起睡', { size: 15, font: 'you', weight: 'bold', mid: true, fill: C.grey });
    s += topbar();
    s += nav('冬眠');
    return page(s);
  }

  // 圆形头像（把动物裁进圆里）
  let avN = 0;
  function avatar(x, y, r, who, o = {}) {
    const id = 'av' + (++avN);
    const k = r / 38;
    const body = who === 'hedgehog' ? hedgehog(x, y + 14 * k, .9 * k) : who === 'squirrel' ? squirrel(x - 6 * k, y + 30 * k, .9 * k, { acorn: false })
      : who === 'frog' ? frog(x, y + 16 * k, .9 * k) : who === 'bear' ? bear(x, y + 34 * k, .95 * k) : hamster(x, y + 14 * k, .72 * k);
    let s = S.circle(x, y, r, { fill: o.bg || C.cream, sw: 2.2, stroke: o.ring || INK, ff: 'crayon' });
    s += `<clipPath id="${id}"><circle cx="${x}" cy="${y}" r="${r - 3}"/></clipPath><g clip-path="url(#${id})"${o.out ? ' opacity=".35"' : ''}>${body}</g>`;
    if (o.out) s += S.line([[x - r * .6, y - r * .6], [x + r * .6, y + r * .6]], { stroke: C.red, sw: 4 }) + S.line([[x + r * .6, y - r * .6], [x - r * .6, y + r * .6]], { stroke: C.red, sw: 4 });
    return s;
  }
  function tunnelBand(pts, w) {
    return S.curve(pts, { sw: w, stroke: C.tunnel, passes: 1, jit: 2 }) + S.curve(pts, { sw: w - 10, stroke: '#d5b084', passes: 1, jit: 2, op: .6 });
  }

  // ---------- 02 匹配：排队进洞 ----------
  const MATES = [['hamster', '阿糯', 1], ['hedgehog', '刺刺'], ['squirrel', '小栗'], ['frog', '呱呱'], ['bear', '阿墩'], ['hamster', '团子']];
  const holeXY = i => [175 + (i % 3) * 200, 466 + Math.floor(i / 3) * 240, 82];
  function matchHole(i, filled) {
    const [x, y, r] = holeXY(i), [w, name, me] = MATES[i];
    let s = S.circle(x, y, r + 10, { fill: C.soilD, stroke: 'none', jit: 2, ff: 'crayon' });
    if (filled) {
      s += avatar(x, y, r, w, { bg: '#f3dca8', ring: INK });
      s += `<circle cx="${x}" cy="${y - 20}" r="${r}" fill="url(#lampG)" opacity=".35"/>`;
      s += T(x, y + r + 32, name, { size: 22, font: 'hupo', mid: true, fill: C.cream });
      if (me) s += tag(x + 58, y - 64, '我', C.yellow);
    } else {
      s += S.circle(x, y, r, { fill: '#3d2a1d', stroke: C.cream, sw: 2.4, passes: 1, dash: '8 10', jit: .8 });
      s += T(x, y + 4, '?', { size: 70, font: 'hupo', mid: true, fill: '#8a7360' });
      s += T(x, y + r + 32, '寻找中…', { size: 20, font: 'you', weight: 'bold', mid: true, fill: '#d8c3a5' });
    }
    return s;
  }
  function matchText(found, sec) {
    return ttl(375, 884, `已找到 ${found} / 6 只`, { size: 46, sw: 5, fill: C.yellow }) +
      T(375, 934, `00:${String(sec).padStart(2, '0')}　·　${found >= 6 ? '人齐了，开睡！' : `预计还要 ${Math.max(1, 6 - found) * 2} 秒`}`, { size: 21, font: 'you', weight: 'bold', mid: true, fill: '#f1e3c8' });
  }
  function match(o = {}) {
    const found = o.found ?? 4;
    let s = `<rect x="0" y="0" width="750" height="330" fill="url(#nightG)"/>`;
    s += snowfall(0, 60, 750, 260, 34, 7).replace(/fill="#fff"/g, 'fill="#fff" opacity=".8"');
    s += S.circle(620, 150, 40, { fill: '#fff3c4', sw: 2, stroke: '#e8d48a', ff: 'crayon' });
    s += S.curve([[-20, 318], [160, 300], [360, 322], [560, 302], [770, 316], [770, 344], [-20, 344]], { closed: true, fill: '#fff', stroke: C.snowB, sw: 2.4, ff: 'crayon' });
    s += soil(0, 340, 750, 1000, { seed: 21, stones: 34, col: C.soil2, worms: [[620, 1180]] });
    s += ttl(375, 200, '找伙伴一起冬眠', { size: 52, sw: 6, fill: C.cream });
    s += T(375, 262, '凑齐 6 只就开睡', { size: 22, font: 'you', weight: 'bold', mid: true, fill: '#e7eef4' });
    for (let i = 0; i < 6; i++) s += matchHole(i, i < found);
    if (!o.noText) s += matchText(found, 8);
    s += S.curve([[-20, 990], [200, 974], [420, 996], [600, 978], [770, 990]], { sw: 64, stroke: '#2b1d14', passes: 1, jit: 3, op: .92 });
    s += `<circle cx="600" cy="982" r="12" fill="url(#eyeG)"/><circle cx="632" cy="980" r="12" fill="url(#eyeG)"/>` + dot(600, 982, 3, INK) + dot(632, 980, 3, INK);
    s += T(300, 986, '黄大仙也在赶来的路上……', { size: 20, font: 'you', weight: 'bold', mid: true, fill: C.yellow });
    s += S.rect(56, 1046, 638, 92, { r: 18, fill: C.cream, sw: 2.6, ff: 'crayon' });
    s += avatar(110, 1092, 32, 'hamster');
    s += T(160, 1076, '本局：仓鼠 阿糯', { size: 24, font: 'hupo', anchor: 'start', mid: true });
    s += T(160, 1110, '天赋「囤粮」：睡觉攒松果 +10%', { size: 18, font: 'you', weight: 'bold', anchor: 'start', mid: true, fill: C.soil2 });
    s += btn(580, 1068, 96, 48, '换', { size: 24, col: C.green2 });
    s += btn(265, 1172, 220, 72, '取消', { size: 30 });
    s += T(375, 1296, '小贴士：开局先捡松果，攒够 50 个先造弹弓。', { size: 19, font: 'you', weight: 'bold', mid: true, fill: '#f1e3c8' });
    return page(s);
  }

  // ---------- 03 战斗：黄大仙在挠你的门 ----------
  const BT = {   // 战斗里的数值和位置（演示也用）
    tile: (c, r) => [132 + c * 82, 700 + r * 82],
    isNest: (c, r) => r >= 2 && c >= 4,
    door: [375, 648], doorA: [150, 446], tunnelY: 520,
    cards: [['sling', '松果弹弓', 50, 0, '推荐'], ['burr', '栗子刺球', 30, 0], ['hive', '蜂窝', 120, 2], ['shroom', '瞌睡菇', 80, 1], ['spider', '织补蜘蛛', 100, 0], ['lamp', '萤火灯', 60, 0]],
    nestName: ['草窝', '干草窝', '棉絮窝', '羽绒窝'], nestRate: [6, 10, 16, 24], nestCost: [60, 160, 360],
    doorMax: [400, 800, 1400, 2200], doorCost: [80, 200, 400]
  };
  // 不变的：泥土、隧道、两家邻居、我的洞和空地框、顶栏底、建造面板底
  function battleStatic() {
    let s = soil(0, 220, 750, 880, { seed: 31, stones: 30, worms: [[30, 640], [660, 1040]] });
    s += tunnelBand([[-30, 528], [160, 506], [375, 530], [560, 506], [780, 524]], 112);
    s += tunnelBand([[150, 540], [150, 440]], 70) + tunnelBand([[600, 540], [600, 440]], 70) + tunnelBand([[375, 560], [375, 650]], 84);
    s += cave(140, 346, 132, 96, { seed: 41 });
    s += nest(96, 336, .62, 'hedgehog') + BUILD.sling(214, 318, .9) + BUILD.burr(196, 398, .8) + BUILD.lamp(36, 380, .7);
    s += door(150, 446, 84, { lv: '2' });
    s += T(54, 286, '刺刺', { size: 17, font: 'you', weight: 'bold', mid: true, fill: C.soilD });
    s += cave(612, 346, 132, 96, { seed: 43 });
    s += squirrel(584, 352, .78, { wave: true }) + BUILD.hive(690, 330, .85) + BUILD.lamp(512, 344, .7) + BUILD.sling(676, 404, .75);
    s += door(600, 446, 84, { lv: '4', col: '#b9b4ab' });
    s += cave(375, 870, 338, 206, { seed: 47 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
      if (BT.isNest(c, r)) continue;
      const [x, y] = BT.tile(c, r);
      s += S.rect(x + 3, y + 3, 70, 70, { r: 10, stroke: C.floor2, sw: 2, passes: 1, jit: .6, dash: '6 6' });
    }
    s += S.rect(-10, -10, 770, 232, { fill: C.cream, stroke: 'none', ff: 'crayon' });
    s += S.curve([[-10, 222], [160, 228], [170, 224]], { sw: 2.6 }) + S.curve([[580, 224], [600, 230], [770, 220]], { sw: 2.6 });
    s += T(36, 100, '离春天还有', { size: 17, font: 'you', weight: 'bold', anchor: 'start', mid: true, fill: C.soil2 });
    s += S.rect(178, 110, 340, 24, { r: 12, fill: '#e6eef3', sw: 2, passes: 1, jit: .6 });
    s += ICON.snow(176, 122, .9) + ICON.sprout(524, 118, 1);
    [['hamster'], ['hedgehog'], ['squirrel'], ['frog'], ['bear'], ['hamster', 0, 1]].forEach(([w, out, me], i) => {
      s += avatar(450 + i * 48, 176, 20, w, { out: !!out, ring: me ? C.orange : INK });
    });
    s += S.rect(-10, 1080, 770, 280, { r: 30, fill: C.cream, sw: 2.8, jit: 1.4, ff: 'crayon' });
    return s;
  }
  // 会变的：设施、选中、窝、门、顶栏数字、警示、建造卡、升级按钮
  function bTiles(st) {
    let s = '';
    Object.entries(st.grid).forEach(([k, b]) => { const [c, r] = k.split(',').map(Number), [x, y] = BT.tile(c, r); s += BUILD[b](x + 38, y + 42, 1.05); });
    if (st.sel) { const [x, y] = BT.tile(st.sel[0], st.sel[1]); s += S.rect(x, y, 76, 76, { r: 12, fill: C.yellow, fo: .3, stroke: C.orange, sw: 3.4, passes: 1, dash: '9 7', jit: .6 }) + T(x + 38, y + 40, '+', { size: 46, font: 'hupo', mid: true, fill: C.orange }); }
    return s;
  }
  function bNest(st) {
    return nest(540, 936, 1.05, 'hamster') + tag(540, 1012, `${BT.nestName[st.nestLv - 1]} Lv.${st.nestLv}`, C.cream) +
      ICON.cone(512, 852, .8) + T(530, 852, `+${st.rate}/秒`, { size: 18, font: 'hupo', anchor: 'start', mid: true, fill: C.soilD });
  }
  function bDoor(st) {
    let s = door(375, 648, 108, { lv: String(st.doorLv), scratch: st.scratch });
    s += T(482, 632, '门', { size: 17, font: 'hupo', mid: true, fill: C.cream, stroke: INK, sw: 3 }) + hpbar(498, 624, 120, Math.max(0, st.doorHp / st.doorMax), st.doorHp / st.doorMax < .3 ? C.red : C.orange, 16) +
      T(560, 652, `${Math.ceil(st.doorHp)} / ${st.doorMax}`, { size: 14, font: 'hupo', mid: true, fill: C.cream, stroke: INK, sw: 3 });
    if (st.spider) s += Object.entries(st.grid).filter(([, b]) => b === 'spider').map(([k]) => { const [c, r] = k.split(',').map(Number), [x, y] = BT.tile(c, r); return S.line([[x + 38, y + 20], [350 + c * 4, 664]], { stroke: '#fff', sw: 1.6, op: .9 }); }).join('');
    return s;
  }
  function bHud(st) {
    const left = Math.max(0, st.left), mm = Math.floor(left / 60), ss = Math.floor(left % 60);
    let s = T(36, 132, `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`, { size: 38, font: 'hupo', anchor: 'start', mid: true, fill: left < 20 ? C.green : INK });
    s += S.rect(181, 113, Math.max(10, 334 * st.frac), 18, { r: 9, fill: C.green2, stroke: 'none', jit: .4, ff: 'crayon' }) + ICON.moon(181 + 334 * st.frac, 122, .7);
    s += pill(30, 158, 220, ICON.cone, Number(Math.floor(st.cones)).toLocaleString('en-US'), { plus: false }) + T(224, 179, `+${st.rate}/秒`, { size: 14, font: 'hupo', anchor: 'end', mid: true, fill: C.green });
    s += pill(262, 158, 142, ICON.fly, `${st.flyUsed}/${st.flyCap}`, { plus: false });
    if (st.warn) s += S.rect(170, 206, 410, 38, { r: 19, fill: C.red, sw: 2.2, passes: 1, jit: .8, ff: 'crayon' }) + T(375, 226, st.warn, { size: 21, font: 'hupo', mid: true, fill: '#fff' });
    return s;
  }
  function bPanel(st) {
    let s = T(40, 1112, st.sel ? '在这块地上造点什么？' : '先点洞里一块空地，再选要造的', { size: 22, font: 'hupo', anchor: 'start', mid: true, fill: st.sel ? INK : C.grey });
    if (st.sel) s += T(712, 1112, '×', { size: 34, font: 'hupo', anchor: 'end', mid: true, fill: C.grey });
    BT.cards.forEach(([b, name, cost, fly, hot], i) => {
      const x = 36 + i * 114, y = 1134;
      const ok = st.sel && st.cones >= cost && (st.flyCap - st.flyUsed) >= fly;
      let c = S.rect(x, y, 104, 126, { r: 14, fill: '#fff', fo: .9, sw: 2.2, jit: .8 });
      c += BUILD[b](x + 52, y + 44, 1.05);
      c += T(x + 52, y + 92, name, { size: 17, font: 'hupo', mid: true });
      c += ICON.cone(x + 30, y + 114, .5) + T(x + 42, y + 114, String(cost), { size: 16, font: 'hupo', anchor: 'start', mid: true, fill: st.cones >= cost ? INK : C.red });
      if (fly) c += ICON.fly(x + 78, y + 114, .45) + T(x + 88, y + 115, String(fly), { size: 14, font: 'hupo', anchor: 'start', mid: true, fill: (st.flyCap - st.flyUsed) >= fly ? INK : C.red });
      if (hot) c += tag(x + 82, y + 4, hot, C.orange);
      s += st.sel && !ok ? g(c, 'opacity=".55"') : !st.sel ? g(c, 'opacity=".7"') : c;
    });
    const nc = BT.nestCost[st.nestLv - 1], dc = BT.doorCost[st.doorLv - 1];
    s += btn(36, 1274, 250, 48, nc ? `升级窝 Lv.${st.nestLv + 1}` : '窝已满级', { size: 20, col: C.green2 }) + (nc ? T(274, 1298, String(nc), { size: 15, font: 'hupo', anchor: 'end', mid: true, fill: st.cones >= nc ? C.soilD : C.red }) : '');
    s += btn(298, 1274, 250, 48, dc ? `加固门 Lv.${st.doorLv + 1}` : '门已满级', { size: 20, col: '#f6d6a6' }) + (dc ? T(536, 1298, String(dc), { size: 15, font: 'hupo', anchor: 'end', mid: true, fill: st.cones >= dc ? C.soilD : C.red }) : '');
    s += btn(560, 1274, 154, 48, '喊话', { size: 20, col: '#e3edf4' });
    return s;
  }
  function weaselBar(x, y, lv, hpFrac) {
    return T(x - 70, y, '黄大仙', { size: 18, font: 'hupo', anchor: 'end', mid: true, fill: C.cream, stroke: INK, sw: 3 }) + hpbar(x - 63, y - 8, 126, Math.max(0, hpFrac), C.red, 16) + tag(x + 95, y, `Lv.${lv}`, C.red);
  }
  const BATTLE_SAMPLE = {
    grid: { '0,0': 'lamp', '1,0': 'sling', '2,0': 'burr', '3,0': 'burr', '4,0': 'sling', '5,0': 'hive', '0,1': 'shroom', '2,1': 'spider', '5,1': 'lamp' },
    sel: [3, 1], nestLv: 3, rate: 18, doorLv: 3, doorHp: 820, doorMax: 1200, scratch: true, spider: true,
    left: 200, frac: .72, cones: 1260, flyUsed: 12, flyCap: 16, warn: '黄大仙正在挠你的门！'
  };
  function battle() {
    const st = BATTLE_SAMPLE;
    let s = battleStatic() + bTiles(st) + bNest(st) + bDoor(st);
    s += bubble(440, 276, 100, 42, '加油！', { size: 20, tail: [548, 318] });
    s += weasel(375, 500, .95) + weaselBar(375, 380, 6, .62);
    [[208, 738, 318, 470], [536, 738, 432, 470]].forEach(([x0, y0, x1, y1]) => {
      const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 40;
      s += `<path d="M${x0} ${y0 - 20} Q${mx} ${my} ${x1} ${y1}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round" opacity=".9"/>`;
      s += ICON.cone((x0 + 2 * mx + x1) / 4, (y0 - 20 + 2 * my + y1) / 4, .55);
    });
    s += bee(560, 640) + bee(510, 600) + bee(470, 560) + `<path d="M612 716 C590 680 540 640 470 560" fill="none" stroke="${C.yellow}" stroke-width="2.4" stroke-dasharray="2 7" opacity=".9"/>`;
    const num = (x, y, t, big) => g(T(x, y, t, { size: big ? 34 : 26, font: 'hupo', mid: true, fill: big ? C.red : '#fff', stroke: INK, sw: 4, rot: -6 }), 'filter="url(#wob)"');
    s += num(268, 452, '-36') + num(470, 438, '-36') + num(500, 530, '蜂蜇 -58', true);
    s += bHud(st) + bPanel(st);
    s += T(258, 848, '修补 +12/秒', { size: 13, font: 'you', weight: 'bold', mid: true, fill: C.soilD });
    return page(s, { paper: { vig: .3 } });
  }

  // ---------- 04 结算：春天来了 ----------
  function flower(x, y, col, s = 1) {
    let p = '';
    for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; p += circ(Math.cos(a) * 7, Math.sin(a) * 7, 6, col, 1.4); }
    return g(ln('M0 6 L0 26', 2, '#4f7a34') + p + dot(0, 0, 4.5, C.yellow), `${at(x, y, s)} filter="url(#wob)"`);
  }
  function win() {
    const R = ST().last || {};
    let s = `<rect x="0" y="0" width="750" height="640" fill="url(#springG)"/>`;
    // 太阳
    s += S.circle(620, 150, 56, { fill: C.yellow, sw: 2.6, ff: 'crayon' });
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; s += S.brush([[620 + Math.cos(a) * 70, 150 + Math.sin(a) * 70], [620 + Math.cos(a) * 92, 150 + Math.sin(a) * 92]], { w: 6, fill: C.orange, w0: .8, w1: .5 }); }
    s += dot(604, 144, 4) + dot(636, 144, 4) + ln('M606 162 Q620 172 634 162', 2.4);
    // 化了一半的雪 + 草地
    s += S.curve([[-20, 560], [140, 540], [300, 566], [470, 544], [620, 562], [770, 548], [770, 660], [-20, 660]], { closed: true, fill: C.green2, sw: 2.6, ff: 'crayon' });
    s += S.curve([[30, 566], [80, 552], [130, 560], [120, 574], [60, 578]], { closed: true, fill: '#fff', stroke: C.snowB, sw: 2, ff: 'crayon' });
    s += S.curve([[600, 568], [660, 556], [720, 566], [700, 580], [630, 582]], { closed: true, fill: '#fff', stroke: C.snowB, sw: 2, ff: 'crayon' });
    [[60, 610, C.pink], [210, 596, '#fff'], [300, 618, C.yellow], [470, 604, C.pink], [560, 620, '#fff'], [690, 600, C.yellow]].forEach(([x, y, c]) => { s += flower(x, y, c, .9); });
    s += soil(0, 640, 750, 700, { seed: 51, stones: 18, col: C.soil });
    // 洞口 + 伸懒腰
    // 洞口：身子下半截藏在洞沿后面
    s += S.ell(375, 590, 100, 26, { fill: C.soilD, sw: 2.6, ff: 'crayon' });
    s += `<clipPath id="holeClip"><path d="M0 0 H750 V590 H475 A100 26 0 0 1 275 590 H0Z"/></clipPath>`;
    s += g(hamster(375, 540, 2.3, { pose: 'stretch' }), 'clip-path="url(#holeClip)"');
    s += sh('M266 588 A109 30 0 0 0 484 588 A109 44 0 0 1 266 588Z', C.green2, 2.6, 3);
    for (let i = 0; i < 9; i++) { const gx = 290 + i * 22; s += ln(`M${gx} ${612 + Math.sin(i) * 4} l-3 -12 M${gx + 6} ${614 + Math.sin(i) * 4} l3 -10`, 1.6, '#4f7a34'); }
    s += S.ell(130, 602, 44, 14, { fill: C.soilD, sw: 2, ff: 'crayon' }) + hedgehog(130, 584, .72);
    s += squirrel(640, 520, .95, { wave: true });
    // 蝴蝶
    s += g(sh('M0 0 C-14 -16 -26 -4 -16 6 C-22 14 -8 20 0 4 C8 20 22 14 16 6 C26 -4 14 -16 0 0Z', C.pink, 1.8) + ln('M0 -4 L0 10', 2.2), `${at(200, 380, 1.1, -12)} filter="url(#wob)"`);
    s += ttl(375, 236, '春天来了！', { size: 96, fill: '#8fcf5a' });
    // 成绩卡
    s += S.rect(40, 664, 670, 420, { r: 26, fill: C.cream, sw: 2.8, jit: 1.2, ff: 'crayon' });
    s += T(375, 714, '熬过了一整个冬天', { size: 34, font: 'hupo', mid: true });
    s += T(375, 754, '坚持 12:00 · 一次都没被叼走', { size: 19, font: 'you', weight: 'bold', mid: true, fill: C.soil2 });
    s += tag(232, 800, '酣睡 Ⅲ', C.blue).replace('fill="#3f2c20"', 'fill="#fff"');
    [0, 1, 2].forEach(i => { s += star(318 + i * 46, 800, 18, true); });
    for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; s += S.brush([[410 + Math.cos(a) * 24, 800 + Math.sin(a) * 24], [410 + Math.cos(a) * 34, 800 + Math.sin(a) * 34]], { w: 3.4, fill: C.orange, w0: .9, w1: .3 }); }
    s += T(472, 802, '+1', { size: 30, font: 'hupo', mid: true, fill: C.orange });
    const rew = [[ICON.nut, '+80', '榛子'], [ICON.honey, '+2', '蜂蜜'], [ICON.fur, '+1', `黄大仙的毛 ${ST().fur ?? 8}/12`], [ICON.moon, '+50', '睡眠经验']];
    rew.forEach(([ic, n, name], i) => {
      const x = 66 + i * 156, y = 838;
      s += S.rect(x, y, 140, 118, { r: 16, fill: '#fff', fo: .85, sw: 2.2, jit: .8 });
      s += ic(x + 70, y + 36, 1.35);
      s += T(x + 70, y + 80, n, { size: 26, font: 'hupo', mid: true, fill: C.orange });
      s += T(x + 70, y + 104, name, { size: 14, font: 'you', weight: 'bold', mid: true, fill: C.soil2 });
    });
    [['打退黄大仙', `${R.repels ?? 3} 次`], ['造了设施', `${R.builds ?? 14} 座`], ['门被挠了', `${fmt(R.scratch ?? 2860)} 下`]].forEach(([a, b], i) => {
      const x = 148 + i * 228;
      s += T(x, 994, a, { size: 17, font: 'you', weight: 'bold', mid: true, fill: C.soil2 });
      s += T(x, 1030, b, { size: 28, font: 'hupo', mid: true });
    });
    s += S.line([[262, 980], [262, 1044]], { sw: 1.6, op: .4 }) + S.line([[490, 980], [490, 1044]], { sw: 1.6, op: .4 });
    s += btn(46, 1120, 292, 96, '双倍领取', { size: 28, icon: ICON.adI, iconDx: 86, iconS: 1.3 });
    s += pillow(360, 1110, 344, 116, '再睡一冬', { size: 42, col: C.green2 });
    s += T(375, 1290, '回窝里　·　晒一晒', { size: 21, font: 'you', weight: 'bold', mid: true, fill: '#f1e3c8' });
    return page(s);
  }

  // ---------- 05 结算：被叼走了 ----------
  function lose() {
    const R = ST().last || {};
    const left = R.left ?? 198;
    let s = `<rect x="0" y="0" width="750" height="1334" fill="url(#nightG)"/>`;
    s += snowfall(0, 60, 750, 340, 30, 9).replace(/fill="#fff"/g, 'fill="#fff" opacity=".7"');
    s += S.ell(600, 120, 34, 34, { fill: '#fff3c4', sw: 2, stroke: '#e8d48a', ff: 'crayon' }) + S.ell(616, 110, 30, 30, { fill: '#26304a', stroke: 'none' });
    s += soil(0, 420, 750, 920, { seed: 61, stones: 24, col: '#5a3d29' });
    s += S.curve([[-20, 418], [160, 404], [360, 424], [560, 406], [770, 418], [770, 440], [-20, 440]], { closed: true, fill: '#fff', stroke: C.snowB, sw: 2.4, ff: 'crayon' });
    s += tunnelBand([[-30, 700], [200, 680], [420, 712], [780, 690]], 300);
    s += `<rect x="0" y="420" width="750" height="914" fill="#1d1830" opacity=".35"/>`;
    // 碎门板
    [[96, 812, -20], [150, 836, 14], [60, 846, 40]].forEach(([x, y, r]) => { s += g(S.rect(-30, -8, 60, 16, { r: 3, fill: C.wood, sw: 2, ff: 'crayon' }), `${at(x, y, 1, r)}`); });
    // 脚印
    for (let i = 0; i < 5; i++) s += g(ICON.paw(0, 0, .45), `${at(180 + i * 46, 830 - (i % 2) * 18, 1)} opacity=".45"`);
    // 黄大仙叼着仓鼠走
    s += g(weasel(0, 0, 1.45, { claw: false }), 'transform="translate(430 650)"');
    s += g(hamster(0, 0, .8, { pose: 'cry' }), 'transform="translate(482 622) rotate(28)"');
    s += `<path d="M418 578 Q438 586 458 580" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M440 580 L444 592 L448 581Z M452 579 L456 590 L460 578Z" fill="#fff" stroke="${INK}" stroke-width="1.4"/>`;
    [[340, 560], [330, 610], [344, 660]].forEach(([x, y]) => { s += S.line([[x, y], [x - 60, y + 4]], { sw: 2.6, stroke: '#d9c3a0', op: .7 }); });
    s += bubble(560, 500, 130, 52, '呜呜…', { size: 24, tail: [520, 590] });
    s += ttl(375, 226, '被叼走了……', { size: 84, sw: 6, fill: C.cream });
    s += T(375, 306, `离春天只差 ${String(Math.floor(left / 60)).padStart(2, '0')}:${String(Math.floor(left % 60)).padStart(2, '0')}`, { size: 24, font: 'you', weight: 'bold', mid: true, fill: C.yellow });
    // 下次怎么办
    s += S.rect(56, 900, 638, 198, { r: 24, fill: C.cream, sw: 2.6, ff: 'crayon' });
    s += T(92, 944, '下次试试', { size: 26, font: 'hupo', anchor: 'start', mid: true });
    s += T(92, 990, '① 门先加固到 Lv.4，再去造炮', { size: 20, font: 'you', weight: 'bold', anchor: 'start', mid: true });
    s += T(92, 1028, '② 门后面放两颗栗子刺球', { size: 20, font: 'you', weight: 'bold', anchor: 'start', mid: true });
    s += BUILD.burr(600, 1012, 1.4) + BUILD.burr(648, 1040, 1);
    s += ICON.nut(110, 1070, .8) + T(130, 1071, '+20', { size: 20, font: 'hupo', anchor: 'start', mid: true, fill: C.orange });
    s += ICON.fur(230, 1070, .8) + T(250, 1071, '+0', { size: 20, font: 'hupo', anchor: 'start', mid: true, fill: C.grey });
    s += btn(46, 1140, 292, 92, '观战到春天', { size: 26 });
    s += pillow(360, 1128, 344, 112, '再来一局', { size: 42 });
    s += T(375, 1292, '回窝里', { size: 21, font: 'you', weight: 'bold', mid: true, fill: '#d8c8b0' });
    return page(s, { paper: { vig: .6 } });
  }

  // ---------- 06 商店：树洞小卖部 ----------
  const GOODS = {
    tinDoor(x, y) {
      let p = circ(0, 0, 44, '#c9ced2', 2.6) + circ(0, 0, 34, '#dfe3e6', 1.8);
      for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; p += ln(`M${Math.cos(a) * 36} ${Math.sin(a) * 36} L${Math.cos(a) * 43} ${Math.sin(a) * 43}`, 1.4, '#8d969c'); }
      p += sh('M-16 -4 C-16 -14 16 -14 16 -4 L12 -4 C12 -8 -12 -8 -12 -4Z', '#8d969c', 1.8) + S.text(0, 18, '豆', { size: 18, font: 'hupo', mid: true, fill: C.red });
      return g(p, `${at(x, y)} filter="url(#wob)"`);
    },
    goldSling(x, y) { return BUILD.sling(x, y, 2).replace(new RegExp(C.wood2, 'g'), '#e2b33c'); },
    scarf(x, y) {
      return g(sh('M-40 -10 C-20 4 20 4 40 -10 L44 6 C20 22 -20 22 -44 6Z', C.red, 2.4) + sh('M18 10 L28 52 L44 46 L32 6Z', C.red, 2.2) +
        ln('M-30 2 L-28 12 M-10 8 L-9 18 M10 8 L9 18', 2, '#fff'), `${at(x, y)} filter="url(#wob)"`);
    },
    furs(x, y) { return ICON.fur(x - 22, y + 6, 1.6) + ICON.fur(x, y - 6, 1.8) + ICON.fur(x + 24, y + 8, 1.5); },
    honeyPack(x, y) { return ICON.honey(x - 18, y + 8, 1.7) + ICON.honey(x + 22, y + 4, 2); }
  };
  function shopItems() {
    return [
      [GOODS.tinDoor, '铁罐盖门', ICON.nut, '800'], [GOODS.goldSling, '金弹弓', ICON.honey, '30'], [GOODS.scarf, '暖暖围巾', ICON.nut, '500', true],
      [(x, y) => bear(x, y + 6, 1.15, { scarf: true }), '胖熊阿墩', ICON.honey, '128'], [GOODS.furs, '黄大仙的毛×3', ICON.nut, '300'], [GOODS.honeyPack, '一罐蜂蜜×60', null, '6 元']
    ];
  }
  function shop() {
    let s = S.rect(-10, 220, 770, 1010, { fill: '#c99a64', stroke: 'none', ff: 'crayon' });
    for (let i = 0; i < 6; i++) s += S.ell(375, 760, 120 + i * 90, 80 + i * 70, { stroke: '#a77845', sw: 2, passes: 1, op: .45, jit: 4 });
    // 招牌
    s += S.line([[150, 220], [170, 276]], { sw: 2.4 }) + S.line([[420, 220], [400, 276]], { sw: 2.4 });
    s += S.rect(60, 270, 450, 96, { r: 14, fill: C.wood, sw: 3, ff: 'crayon' });
    s += S.line([[78, 300], [492, 296]], { sw: 1.4, op: .4 }) + S.line([[78, 340], [492, 344]], { sw: 1.4, op: .4 });
    s += ttl(285, 320, '树洞小卖部', { size: 54, sw: 5, fill: C.cream });
    s += T(285, 392, '冬天也不打烊', { size: 18, font: 'you', weight: 'bold', mid: true, fill: C.soilD });
    s += badger(632, 336, 1.15);
    s += bubble(500, 238, 128, 44, '随便看看~', { size: 18, tail: [600, 296] });
    // 分页
    [['推荐', 1], ['窝'], ['门'], ['伙伴'], ['道具']].forEach(([t, on], i) => {
      const x = 82 + i * 146;
      if (on) s += S.rect(x - 52, 418, 104, 44, { r: 22, fill: C.yellow, sw: 2.2, ff: 'crayon' });
      s += T(x, 441, t, { size: on ? 26 : 23, font: 'hupo', mid: true, fill: on ? INK : C.cream, stroke: on ? null : INK, sw: 3 });
    });
    // 头牌：云朵窝
    s += S.rect(36, 482, 678, 236, { r: 24, fill: C.cream, sw: 2.8, jit: 1.2, ff: 'crayon' });
    s += S.rect(56, 500, 250, 200, { r: 18, fill: '#2f3a52', sw: 2.2, ff: 'crayon' });
    [[86, 530], [270, 524], [250, 676], [96, 670], [180, 518]].forEach(([x, y]) => { s += star(x, y, 7, true); });
    s += S.curve([[80, 650], [86, 618], [116, 608], [140, 590], [180, 588], [212, 600], [248, 600], [280, 624], [282, 652], [250, 670], [110, 672]], { closed: true, fill: '#fff', stroke: INK, sw: 2.4, ff: 'crayon' });
    s += S.curve([[100, 654], [180, 664], [266, 650]], { stroke: C.snowB, sw: 6 });
    s += hamster(182, 600, .9, { pose: 'sleep' }) + T(250, 560, 'z', { size: 24, font: 'hupo', fill: '#fff', mid: true }) + T(270, 540, 'Z', { size: 30, font: 'hupo', fill: '#fff', mid: true });
    s += T(332, 534, '云朵窝', { size: 42, font: 'hupo', anchor: 'start', mid: true });
    s += tag(526, 534, '冬季限定', C.orange);
    s += T(332, 584, '软得像睡在天上', { size: 21, font: 'you', weight: 'bold', anchor: 'start', mid: true });
    s += T(332, 616, '只换样子，不改数值', { size: 17, font: 'you', weight: 'bold', anchor: 'start', mid: true, fill: C.grey });
    s += ICON.honey(346, 664, 1) + T(366, 666, '60', { size: 30, font: 'hupo', anchor: 'start', mid: true, fill: C.orange });
    s += T(416, 668, '88', { size: 18, font: 'hupo', anchor: 'start', mid: true, fill: C.grey }) + S.line([[412, 668], [446, 662]], { sw: 2, stroke: C.grey });
    s += pillow(540, 634, 154, 70, '买', { size: 32 });
    // 两层货架
    const shelf = (y) => S.rect(20, y, 710, 24, { r: 6, fill: C.wood2, sw: 2.6, ff: 'crayon' }) + S.rect(40, y + 24, 16, 30, { fill: '#7b5130', stroke: 'none' }) + S.rect(694, y + 24, 16, 30, { fill: '#7b5130', stroke: 'none' });
    const priceTag = (x, y, ic, p, sold, got) => {
      let t = S.line([[x, y], [x + 4, y + 18]], { sw: 1.6 });
      t += g(S.rect(x - 52, y + 16, 112, 40, { r: 8, fill: sold ? '#e3ddd3' : got ? C.green2 : '#fff', sw: 2, passes: 1, jit: .6 }) +
        (sold ? T(x + 4, y + 37, '卖光啦', { size: 20, font: 'hupo', mid: true, fill: C.grey }) : got ? T(x + 4, y + 37, '买到啦', { size: 20, font: 'hupo', mid: true }) : ic(x - 26, y + 36, .75) + T(x - 8, y + 37, p, { size: 21, font: 'hupo', anchor: 'start', mid: true })), `transform="rotate(-4 ${x} ${y + 36})"`);
      return t;
    };
    const items = shopItems();
    s += shelf(860) + shelf(1070);
    items.forEach(([draw, name, ic, p, sold], i) => {
      const x = 140 + (i % 3) * 235, base = i < 3 ? 860 : 1070;
      s += draw(x, base - 62);
      if (i === 3) s += tag(x + 56, base - 120, '新伙伴', C.green2);
      s += T(x, base + 12, name, { size: 17, font: 'hupo', mid: true, fill: C.cream });
      s += priceTag(x, base + 24, ic || ((a, b) => ''), p, sold, ST().bought && ST().bought[name]);
    });
    s += S.rect(-10, 1218, 770, 4, { fill: INK, stroke: 'none', jit: .2 });
    s += topbar();
    s += nav('小卖部');
    return page(s);
  }

  window.META = {
    title: '躺平过冬', subtitle: '地下冬眠塔防　|　《躺平发育》动物题材改编',
    theme: { bg: '#efe6d4', ink: INK, accent: C.orange, titleFont: SK.FONTS.hupo },
    concept: [
      '<b>躺平 = 冬眠</b>：宿舍换成地底下的小洞，床换成草窝，睡着就能攒松果；撑到天亮改成熬到春天。',
      '<b>猛鬼 = 黄大仙</b>：挠门的换成黄鼠狼，越晚越壮；攒够它掉的毛，就能反过来当黄大仙。',
      '<b>彩铅 · 蜡笔 · 绘本</b>：棕色铅笔线，蜡笔上色留纸纹，暖灯光对冷雪地。'
    ],
    palette: [['纸', C.paper], ['铅笔棕', INK], ['泥土', C.soil], ['暖灯', C.yellow], ['橘', C.orange], ['雪蓝', C.blue], ['嫩芽', C.green], ['黄大仙', C.weasel]],
    footer: '页面尺寸 750×1334（竖屏小游戏），右上角留出小游戏胶囊按钮位置。'
  };
  window.PAGES = [
    { id: 'home', name: '主页', seed: 3, draw: home, note: '雪地下面一间暖洞；右下角暗处一双眼，是黄大仙。' },
    { id: 'match', name: '匹配', seed: 7, draw: match, note: '六个洞口一只只亮起来；黄大仙也在路上。' },
    { id: 'battle', name: '战斗', seed: 5, draw: battle, note: '黄大仙在挠我的门；弹弓、蜂窝在打，蜘蛛在补门。' },
    { id: 'win', name: '结算-春天来了', seed: 13, draw: win, note: '熬到春天：从洞里钻出来伸个懒腰。' },
    { id: 'lose', name: '结算-被叼走', seed: 19, draw: lose, note: '输了也给一句"下次试试"，告诉玩家差在哪。' },
    { id: 'shop', name: '商店', seed: 17, draw: shop, note: '树洞小卖部，老獾掌柜；货摆在两层木架上。' }
  ];
  window.PARTS = { hedgehog, squirrel, bear, frog, badger, nest, pillow, btn, pill, door, hpbar, avatar, C, GRAD, page, BT, BUILD, ICON, battleStatic, bTiles, bNest, bDoor, bHud, bPanel, weasel, weaselBar, hamster, bee, bubble, match, matchHole, matchText, holeXY, MATES, shopItems, tag, T, g, at };
})();
