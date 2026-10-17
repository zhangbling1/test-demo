/* sketch.js — 手绘感 SVG 小工具（两个方向共用）
   只管"笔触"：抖动线条、毛笔笔锋、晕染、纸纹、蜡笔颗粒。画面内容写在各方向的 pages.js 里。 */
(function (G) {
  'use strict';
  const PI = Math.PI;
  const SK = {};

  // ---------- 可复现的随机 ----------
  function mulberry(a) {
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  let R = mulberry(7);
  SK.seed = s => { R = mulberry((s * 9973 + 17) >>> 0); };
  const rnd = (a = 1) => (R() * 2 - 1) * a;
  const rr = (a, b) => a + R() * (b - a);
  SK.rnd = rnd; SK.rr = rr; SK.rand = () => R();
  const N = v => Math.round(v * 10) / 10;
  SK.N = N;

  // ---------- 曲线 ----------
  function spline(P, closed, k = 1 / 6) {
    const n = P.length;
    if (n < 2) return '';
    const get = i => closed ? P[(i + n) % n] : P[Math.max(0, Math.min(n - 1, i))];
    let d = `M${N(P[0][0])} ${N(P[0][1])}`;
    const segs = closed ? n : n - 1;
    for (let i = 0; i < segs; i++) {
      const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
      d += `C${N(p1[0] + (p2[0] - p0[0]) * k)} ${N(p1[1] + (p2[1] - p0[1]) * k)} ` +
           `${N(p2[0] - (p3[0] - p1[0]) * k)} ${N(p2[1] - (p3[1] - p1[1]) * k)} ${N(p2[0])} ${N(p2[1])}`;
    }
    return d + (closed ? 'Z' : '');
  }
  // 沿 Catmull-Rom 曲线取密点
  function sampleSpline(P, closed, per = 8) {
    const n = P.length, out = [];
    const get = i => closed ? P[(i + n) % n] : P[Math.max(0, Math.min(n - 1, i))];
    const segs = closed ? n : n - 1;
    for (let i = 0; i < segs; i++) {
      const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
      for (let j = 0; j < per; j++) {
        const t = j / per, t2 = t * t, t3 = t2 * t;
        const f = (a, b, c, d) => .5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
        out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
      }
    }
    if (!closed) out.push(P[n - 1].slice());
    return out;
  }
  SK.spline = spline; SK.sampleSpline = sampleSpline;

  // 低频抖动：手画线不是逐点乱抖，而是整段缓慢地偏
  function wobble(P, amt, closed) {
    if (!amt) return P.map(p => p.slice());
    const n = P.length;
    const f1 = closed ? 2 + Math.floor(R() * 2) : rr(1, 2.5), f2 = closed ? 5 + Math.floor(R() * 3) : rr(3, 6);
    const a1 = rr(0, 6.28), a2 = rr(0, 6.28), b1 = rr(0, 6.28), b2 = rr(0, 6.28);
    return P.map((p, i) => {
      const t = i / (closed ? n : Math.max(1, n - 1)) * 2 * PI;
      return [p[0] + amt * (Math.sin(t * f1 + a1) * .62 + Math.sin(t * f2 + a2) * .38) + rnd(amt * .22),
              p[1] + amt * (Math.sin(t * f1 + b1) * .62 + Math.sin(t * f2 + b2) * .38) + rnd(amt * .22)];
    });
  }
  SK.wobble = wobble;

  // ---------- 取点 ----------
  function rectPts(x, y, w, h, r = 0, step = 14) {
    r = Math.min(r, w / 2, h / 2);
    const P = [];
    const line = (x0, y0, x1, y1) => {
      const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / step));
      for (let i = 0; i < n; i++) P.push([x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n]);
    };
    const arc = (cx, cy, a0, a1) => {
      if (r < 1) return;
      const n = Math.max(2, Math.round(r * Math.abs(a1 - a0) / step));
      for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * i / n; P.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    };
    line(x + r, y, x + w - r, y); arc(x + w - r, y + r, -PI / 2, 0);
    line(x + w, y + r, x + w, y + h - r); arc(x + w - r, y + h - r, 0, PI / 2);
    line(x + w - r, y + h, x + r, y + h); arc(x + r, y + h - r, PI / 2, PI);
    line(x, y + h - r, x, y + r); arc(x + r, y + r, PI, PI * 1.5);
    return P;
  }
  function ellPts(cx, cy, rx, ry, step = 12, a0 = 0) {
    const L = PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
    const n = Math.max(8, Math.round(L / step)), P = [];
    for (let i = 0; i < n; i++) { const a = a0 + i / n * 2 * PI; P.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
    return P;
  }
  function polyPts(V, closed = true, step = 14) {
    const P = [], n = V.length, segs = closed ? n : n - 1;
    for (let i = 0; i < segs; i++) {
      const a = V[i], b = V[(i + 1) % n];
      const m = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
      for (let j = 0; j < m; j++) P.push([a[0] + (b[0] - a[0]) * j / m, a[1] + (b[1] - a[1]) * j / m]);
    }
    if (!closed) P.push(V[n - 1].slice());
    return P;
  }
  SK.rectPts = rectPts; SK.ellPts = ellPts; SK.polyPts = polyPts;

  // ---------- 铅笔/钢笔线：描两遍，第二遍错位、首尾搭头 ----------
  SK.shape = function (P, o = {}) {
    const closed = o.closed !== false, stroke = o.stroke == null ? SK.INK : o.stroke, sw = o.sw == null ? 2.2 : o.sw;
    const fill = o.fill || 'none', jit = o.jit == null ? 1.5 : o.jit, passes = o.passes == null ? 2 : o.passes;
    let s = '';
    if (fill !== 'none') {
      const d = spline(wobble(P, jit * .5, closed), closed);
      if (o.ff === 'crayon' && o.under !== 0) s += `<path d="${d}" fill="${fill}" fill-opacity="${N((o.fo == null ? 1 : o.fo) * (o.under || .72))}"/>`;
      s += `<path d="${d}" fill="${fill}"` + (o.fo != null ? ` fill-opacity="${o.fo}"` : '') + (o.ff ? ` filter="url(#${o.ff})"` : '') + '/>';
    }
    if (stroke !== 'none') for (let k = 0; k < passes; k++) {
      let Q = wobble(P, jit, closed), cl = closed;
      if (closed && k > 0) {
        const st = Math.floor(R() * Q.length);
        Q = Q.slice(st).concat(Q.slice(0, st));
        Q = Q.concat(Q.slice(0, Math.max(1, Math.round(Q.length * .07))));
        cl = false;
      }
      s += `<path d="${spline(Q, cl)}" fill="none" stroke="${stroke}" stroke-width="${N(k ? sw * .55 : sw)}" ` +
        `stroke-linecap="round" stroke-linejoin="round"${k ? ' opacity=".55"' : ''}${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
    }
    const attrs = [o.op != null ? `opacity="${o.op}"` : '', o.f ? `filter="url(#${o.f})"` : '', o.tf ? `transform="${o.tf}"` : ''].join(' ').trim();
    return attrs ? `<g ${attrs}>${s}</g>` : s;
  };
  SK.rect = (x, y, w, h, o = {}) => SK.shape(rectPts(x, y, w, h, o.r || 0, o.step || 14), o);
  SK.ell = (cx, cy, rx, ry, o = {}) => SK.shape(ellPts(cx, cy, rx, ry, o.step || 12, rr(0, 6.28)), o);
  SK.circle = (cx, cy, r, o = {}) => SK.ell(cx, cy, r, r, o);
  SK.poly = (V, o = {}) => SK.shape(polyPts(V, o.closed !== false, o.step || 14), o);
  SK.line = (V, o = {}) => SK.shape(polyPts(V, false, o.step || 14), Object.assign({ passes: 1 }, o, { closed: false }));
  // 自由曲线：控制点 → 平滑 → 抖动
  SK.curve = (V, o = {}) => SK.shape(sampleSpline(V, !!o.closed, o.per || 4), Object.assign({ passes: o.closed ? 2 : 1 }, o));

  // ---------- 毛笔笔锋：按宽度剖面生成丝带 ----------
  SK.brush = function (V, o = {}) {
    const P = sampleSpline(V, false, o.per || 10), n = P.length;
    const w = o.w == null ? 6 : o.w, w0 = o.w0 == null ? .15 : o.w0, w1 = o.w1 == null ? .08 : o.w1;
    const head = o.head || .18, tail = o.tail || .35, ph = rr(0, 6), wav = o.wav == null ? .12 : o.wav;
    const sm = x => x * x * (3 - 2 * x), L = [], Rt = [];
    for (let i = 0; i < n; i++) {
      const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)];
      let tx = b[0] - a[0], ty = b[1] - a[1];
      const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
      const t = i / (n - 1);
      const ww = w * (w0 + (1 - w0) * sm(Math.min(1, t / head))) * (w1 + (1 - w1) * sm(Math.min(1, (1 - t) / tail))) * (1 + wav * Math.sin(t * 9 + ph));
      L.push([P[i][0] - ty * ww / 2, P[i][1] + tx * ww / 2]);
      Rt.push([P[i][0] + ty * ww / 2, P[i][1] - tx * ww / 2]);
    }
    const d = spline(L.concat(Rt.reverse()), true);
    return `<path d="${d}" fill="${o.fill || SK.INK}"${o.op != null ? ` opacity="${o.op}"` : ''}${o.f ? ` filter="url(#${o.f})"` : ''}${o.tf ? ` transform="${o.tf}"` : ''}/>`;
  };

  // ---------- 字 ----------
  SK.FONTS = {
    kai: "'STKaiti','KaiTi',serif", xing: "'STXingkai','STKaiti',serif", li: "'STLiti','LiSu',serif",
    shu: "'FZShuTi','STXingkai',serif", yao: "'FZYaoti','STKaiti',serif", hupo: "'STHupo','YouYuan',sans-serif",
    you: "'YouYuan','Microsoft YaHei',sans-serif", wei: "'STXinwei','STKaiti',serif", hei: "'Microsoft YaHei',sans-serif",
    song: "'STSong','SimSun',serif", zs: "'STZhongsong','STSong',serif"
  };
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  SK.text = function (x, y, s, o = {}) {
    const a = [`x="${N(x)}"`, `y="${N(y)}"`, `font-family="${SK.FONTS[o.font || 'kai'] || o.font}"`, `font-size="${o.size || 24}"`,
      `fill="${o.fill || SK.INK}"`, `text-anchor="${o.anchor || 'middle'}"`];
    if (o.mid) a.push('dominant-baseline="central"');
    if (o.weight) a.push(`font-weight="${o.weight}"`);
    if (o.ls) a.push(`letter-spacing="${o.ls}"`);
    if (o.op != null) a.push(`opacity="${o.op}"`);
    if (o.stroke) a.push(`stroke="${o.stroke}" stroke-width="${o.sw || 2}" paint-order="stroke" stroke-linejoin="round"`);
    if (o.f) a.push(`filter="url(#${o.f})"`);
    if (o.rot) a.push(`transform="rotate(${o.rot} ${N(x)} ${N(y)})"`);
    if (o.deco) a.push(`text-decoration="${o.deco}"`);
    return `<text ${a.join(' ')}>${esc(s)}</text>`;
  };
  SK.vtext = (x, y, s, o = {}) => [...s].map((c, i) => SK.text(x, y + i * (o.lh || (o.size || 24) * 1.08), c, o)).join('');

  // ---------- 滤镜 ----------
  // 所有滤镜都按元素包围盒放宽边界；别把滤镜直接挂在零高度的横线上
  SK.defs = function (extra = '') {
    return `<defs>
<filter id="wob" x="-8%" y="-8%" width="116%" height="116%"><feTurbulence type="fractalNoise" baseFrequency=".032" numOctaves="2" seed="7" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="2.6" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="wob2" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".022" numOctaves="2" seed="3" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="6" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="ink" x="-8%" y="-8%" width="116%" height="116%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" seed="2" result="w"/><feDisplacementMap in="SourceGraphic" in2="w" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="d"/><feTurbulence type="fractalNoise" baseFrequency=".09 .7" numOctaves="2" seed="8" result="s"/><feColorMatrix in="s" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 9 0 0 0 -2.3" result="m"/><feComposite in="d" in2="m" operator="in" result="c"/><feGaussianBlur in="c" stdDeviation=".3"/></filter>
<filter id="wash" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="3" seed="11" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="1.1" result="b"/><feMorphology in="b" operator="erode" radius="2.4" result="er"/><feComposite in="b" in2="er" operator="out" result="edge"/><feGaussianBlur in="edge" stdDeviation=".9" result="eb"/><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" seed="5" result="g"/><feColorMatrix in="g" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1.6 0 0 0 -.05" result="gm"/><feComposite in="b" in2="gm" operator="in" result="bg"/><feComponentTransfer in="bg" result="body"><feFuncA type="linear" slope=".8"/></feComponentTransfer><feMerge><feMergeNode in="body"/><feMergeNode in="eb"/></feMerge></filter>
<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="3" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="14" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="3"/></filter>
<filter id="stamp" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".5" numOctaves="3" seed="21" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 14 0 0 0 -4.3" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in" result="c"/><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="9" result="w"/><feDisplacementMap in="c" in2="w" scale="2.5" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="crayon" x="-6%" y="-6%" width="112%" height="112%"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="4" result="w"/><feDisplacementMap in="SourceGraphic" in2="w" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="d"/><feTurbulence type="fractalNoise" baseFrequency="1.1 .45" numOctaves="2" seed="9" result="t"/><feColorMatrix in="t" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 7 0 0 0 -2" result="tm"/><feComposite in="d" in2="tm" operator="in"/></filter>
<filter id="pencil" x="-6%" y="-6%" width="112%" height="112%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="6" result="w"/><feDisplacementMap in="SourceGraphic" in2="w" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="d"/><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="12" result="t"/><feColorMatrix in="t" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3 0 0 0 -.65" result="tm"/><feComposite in="d" in2="tm" operator="in"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="3"/><feColorMatrix type="matrix" values="0 0 0 0 .3 0 0 0 0 .24 0 0 0 0 .16 -2.6 0 0 0 1.3"/></filter>
<filter id="mottle" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".006 .014" numOctaves="4" seed="12"/><feColorMatrix type="matrix" values="0 0 0 0 .5 0 0 0 0 .4 0 0 0 0 .26 1.8 0 0 0 -.82"/></filter>
<filter id="fiber" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9 .012" numOctaves="2" seed="15"/><feColorMatrix type="matrix" values="0 0 0 0 .45 0 0 0 0 .36 0 0 0 0 .24 3 0 0 0 -1.62"/></filter>
<filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feGaussianBlur in="SourceAlpha" stdDeviation="5"/><feOffset dy="5" result="o"/><feFlood flood-color="#2a1d10" flood-opacity=".22"/><feComposite in2="o" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
<filter id="mblur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.5"/></filter>
<filter id="dshadow" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur in="SourceAlpha" stdDeviation="2.5"/><feOffset dy="4" result="o"/><feFlood flood-color="#2a1408" flood-opacity=".35"/><feComposite in2="o" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
${extra}
</defs>`;
  };

  // 整页纸面：底色 + 大块斑驳 + 纤维 + 细颗粒 + 四角压暗
  SK.paper = function (w, h, o = {}) {
    const base = o.base || '#efe5cf', edge = o.edge || '#cdb991';
    return `<radialGradient id="vig" cx="50%" cy="46%" r="75%"><stop offset="60%" stop-color="${edge}" stop-opacity="0"/><stop offset="100%" stop-color="${edge}" stop-opacity="${o.vig == null ? .7 : o.vig}"/></radialGradient>
<rect width="${w}" height="${h}" fill="${base}"/>
<rect width="${w}" height="${h}" filter="url(#mottle)" opacity="${o.mottle == null ? .5 : o.mottle}"/>
<rect width="${w}" height="${h}" filter="url(#fiber)" opacity="${o.fiber == null ? .35 : o.fiber}"/>
<rect width="${w}" height="${h}" filter="url(#grain)" opacity="${o.grain == null ? .28 : o.grain}"/>
<rect width="${w}" height="${h}" fill="url(#vig)"/>`;
  };

  // 斜线排线（铅笔阴影），裁进给定的路径
  let clipN = 0;
  SK.hatch = function (clipD, x, y, w, h, o = {}) {
    const id = 'hc' + (++clipN), gap = o.gap || 7, ang = (o.ang == null ? -35 : o.ang) * PI / 180;
    const c = Math.cos(ang), s = Math.sin(ang), L = w + h;
    let lines = '';
    for (let d = -L; d < L; d += gap + rnd(gap * .25)) {
      const cx = x + w / 2 + d * -s, cy = y + h / 2 + d * c;
      lines += `<path d="M${N(cx - c * L)} ${N(cy - s * L)}L${N(cx + c * L)} ${N(cy + s * L)}" />`;
    }
    return `<clipPath id="${id}"><path d="${clipD}"/></clipPath><g clip-path="url(#${id})" stroke="${o.stroke || SK.INK}" stroke-width="${o.sw || 1}" opacity="${o.op == null ? .35 : o.op}" stroke-linecap="round" fill="none">${lines}</g>`;
  };

  // ---------- 颜色 ----------
  const hex = c => { c = c.replace('#', ''); if (c.length === 3) c = [...c].map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16)); };
  SK.mix = (a, b, t) => { if (!/^#/.test(a)) return a; const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };

  // ---------- 体积：一个闭合形状 + 背光侧暗边 + 受光侧亮边（光从左上来） ----------
  // o: fill 底色；shade/light 不给就按底色自动调；k 暗边厚度；soft 暗边虚化（绘本用）；ff 底色滤镜；sw 描边；stroke 描边色
  let volN = 0;
  SK.vol = function (d, o = {}) {
    const id = 'v' + (++volN).toString(36) + Math.floor(R() * 1e5).toString(36);
    const fill = o.fill, k = o.k == null ? 6 : o.k, lk = o.lk == null ? k * .6 : o.lk;
    const shade = o.shade || SK.mix(fill, o.shadeTo || '#3a1c10', o.st == null ? .3 : o.st);
    const light = o.light || SK.mix(fill, '#ffffff', .55);
    const blur = o.soft ? ` filter="url(#mblur)"` : '';
    let s = o.under ? `<path d="${d}" fill="${fill}" opacity="${o.under}"/>` : '';
    s += `<path d="${d}" fill="${fill}"${o.ff ? ` filter="url(#${o.ff})"` : ''}/>`;
    s += `<mask id="${id}s" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="5000" height="5000"><path d="${d}" fill="#fff"/><path d="${d}" fill="#000" transform="translate(${-k} ${-k * (o.ky == null ? 1.15 : o.ky)})"${blur}/></mask>`;
    s += `<path d="${d}" fill="${shade}" mask="url(#${id}s)"${o.sf ? ` filter="url(#${o.sf})"` : ''}${o.so != null ? ` opacity="${o.so}"` : ''}/>`;
    if (o.light !== false && lk > 0) {
      s += `<mask id="${id}l" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="5000" height="5000"><path d="${d}" fill="#fff"/><path d="${d}" fill="#000" transform="translate(${lk} ${lk * 1.2})"${blur}/></mask>`;
      s += `<path d="${d}" fill="${light}" mask="url(#${id}l)" opacity="${o.lo == null ? .75 : o.lo}"/>`;
    }
    if (o.stroke !== 'none') s += `<path d="${d}" fill="none" stroke="${o.stroke || SK.INK}" stroke-width="${o.sw == null ? 3 : o.sw}" stroke-linejoin="round" stroke-linecap="round"/>`;
    return s;
  };
  SK.circD = (x, y, r) => `M${N(x - r)} ${N(y)}a${N(r)} ${N(r)} 0 1 0 ${N(2 * r)} 0a${N(r)} ${N(r)} 0 1 0 ${N(-2 * r)} 0Z`;
  SK.ellD = (x, y, rx, ry) => `M${N(x - rx)} ${N(y)}a${N(rx)} ${N(ry)} 0 1 0 ${N(2 * rx)} 0a${N(rx)} ${N(ry)} 0 1 0 ${N(-2 * rx)} 0Z`;

  SK.svg = (w, h, inner, defsExtra) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${SK.defs(defsExtra)}${inner}</svg>`;

  SK.INK = '#26221d';
  G.SK = SK;
})(window);
