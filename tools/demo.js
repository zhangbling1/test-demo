/* demo.js — 演示框架：手机框、换页、可点区域、拖拽坐标、提示条、右侧控制面板。
   画面分两种：
   · 不动的：整页底图先画成一张图片（滤镜只算一次）。
   · 会动的：精灵是 <img>，飘字/光圈是 <div>，都只改 CSS transform / opacity —— 交给 GPU 合成，不重绘。
   · 偶尔会变的（血条数字、按钮状态）：各自一个小 SVG 层，变了才重画，不连累别的层。
   每个方向的 demo.js 用 Demo.def(id, {name, render, enter}) 定义页面；Demo.defs 放这个方向的渐变。 */
(function () {
  const D = window.Demo = { pages: {}, order: [], speed: 1, state: {}, defs: '' };
  const NS = 'http://www.w3.org/2000/svg';
  const phone = document.getElementById('phone'), stage = document.getElementById('stage'), panel = document.getElementById('panel');
  let scale = 1, loops = [], timers = [], handlers = null, baseUrl = null;

  // 手机多大由页面的 CSS 决定（宽度 + 750:1334 的比例），这里只把 750×1334 的舞台缩进去
  function fit() {
    const w = phone.clientWidth || 375;
    scale = w / 750;
    stage.style.transform = `scale(${scale})`;
  }
  if (window.ResizeObserver) new ResizeObserver(fit).observe(phone);
  window.addEventListener('resize', fit);
  fit();

  D.def = (id, spec) => { D.pages[id] = spec; D.order.push(id); };
  const blobUrl = svg => URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));

  // 换页：清掉上一页的循环、计时器、输入，底图画成图片，解码好了再揭幕
  D.go = (id, arg) => {
    const spec = D.pages[id];
    if (!spec) return;
    const same = D.id === id, oldBase = stage.querySelector('img.base'), oldUrl = baseUrl;
    loops = []; timers.forEach(clearTimeout); timers = []; handlers = null;
    stage.classList.remove('dragging');
    SK.seed(spec.seed || 1);
    const url = baseUrl = blobUrl(spec.render(arg));
    stage.innerHTML = `<svg class="defs" width="0" height="0" aria-hidden="true">${SK.defs(D.defs)}</svg><img class="base" alt="" draggable="false"><div class="root"></div><div class="hot"></div><div class="curtain${same ? '' : ' on'}"></div>`;
    const base = stage.querySelector('img.base'), cur = stage.querySelector('.curtain');
    if (same && oldBase) base.src = oldBase.src;          // 同一页刷新：先挂旧图，新图解码好再换，不闪
    const im = new Image();
    im.src = url;
    im.decode().catch(() => {}).then(() => {
      if (baseUrl !== url) return;
      base.src = url;
      if (oldUrl && oldUrl !== url) setTimeout(() => URL.revokeObjectURL(oldUrl), 500);
      requestAnimationFrame(() => cur.classList.remove('on'));
    });
    D.id = id;
    D.root = stage.querySelector('.root');
    D.hotLayer = stage.querySelector('.hot');
    D.over = null;
    if (spec.enter) spec.enter(arg);
    renderPanel();
  };
  // 软切换：淡到黑再换页
  D.cut = (id, arg) => {
    const c = stage.querySelector('.curtain');
    if (c) c.classList.add('on');
    setTimeout(() => D.go(id, arg), 220);
  };

  // ---------- 层 ----------
  // 一个独立的 SVG 层，返回里面的 <g>；g.remove() 会连层一起删
  D.group = () => {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'ov'); svg.setAttribute('viewBox', '0 0 750 1334');
    const g = document.createElementNS(NS, 'g');
    svg.appendChild(g);
    D.root.appendChild(svg);
    g.layer = svg;
    g.remove = () => svg.remove();
    return g;
  };
  D.el = (html, parent) => {
    if (parent) { const g = document.createElementNS(NS, 'g'); g.innerHTML = html; parent.appendChild(g); return g; }
    const g = D.group(); g.innerHTML = html; return g;
  };
  // 精灵缓存：一段 SVG 画成图片
  const spriteCache = {};
  D.sprite = (key, inner, box, extraDefs) => {
    if (spriteCache[key]) return spriteCache[key];
    const [x, y, w, h] = box;
    return (spriteCache[key] = blobUrl(`<svg xmlns="${NS}" viewBox="${x} ${y} ${w} ${h}" width="${w * 2}" height="${h * 2}">${SK.defs(extraDefs || D.defs)}${inner}</svg>`));
  };
  // 一个可移动的容器 div（原点在 0,0），里面放精灵
  D.unit = (parent) => { const d = document.createElement('div'); d.className = 'unit'; (parent || D.root).appendChild(d); return d; };
  // 精灵 <img>：box 是它相对原点的范围；变换中心就是原点
  D.image = (url, box, parent) => {
    const im = document.createElement('img');
    im.className = 'spr'; im.src = url; im.draggable = false;
    Object.assign(im.style, { left: box[0] + 'px', top: box[1] + 'px', width: box[2] + 'px', height: box[3] + 'px', transformOrigin: `${-box[0]}px ${-box[1]}px` });
    if (!parent || !(parent instanceof HTMLElement)) { im.style.transform = 'translate3d(-9999px,0,0)'; D.root.appendChild(im); } else parent.appendChild(im);
    return im;
  };
  // 移动：HTML 元素走 CSS transform（合成），SVG <g> 走属性
  D.move = (el, x, y, extra = '') => {
    if (el instanceof SVGGElement) el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})${extra}`);
    else el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)${extra}`;
  };
  D.anim = (el, frames, ms, o = {}) => el.animate(frames, Object.assign({ duration: ms / D.speed, fill: 'forwards', easing: 'ease-out' }, o));

  D.after = (ms, fn) => { const t = setTimeout(fn, ms / D.speed); timers.push(t); return t; };
  // 每帧循环，dt 已乘速度；换页自动停
  D.loop = fn => {
    const token = {};
    loops.push(token);
    let last = performance.now();
    const step = now => {
      if (!loops.includes(token)) return;
      if (D.paused) { last = now; requestAnimationFrame(step); return; }
      const dt = Math.min(.05, (now - last) / 1000) * D.speed;
      last = now;
      fn(dt, now);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // ---------- 可点区域 ----------
  D.hot = (x, y, w, h, fn, label) => {
    const el = document.createElement('div');
    Object.assign(el.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
    if (label) el.title = label;
    el.addEventListener('click', e => { ripple(D.pt(e)); fn(e); });
    D.hotLayer.appendChild(el);
    return el;
  };
  function ripple(p) {
    const r = document.createElement('div');
    r.className = 'ripple';
    r.style.left = p.x + 'px'; r.style.top = p.y + 'px';
    stage.appendChild(r);
    setTimeout(() => r.remove(), 500);
  }
  D.ripple = ripple;
  D.pt = e => { const r = stage.getBoundingClientRect(); return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale }; };

  // 页面级指针事件（战斗里拖拽用）
  D.input = h => { handlers = h; };
  stage.addEventListener('pointerdown', e => { if (handlers && handlers.down) { const p = D.pt(e); if (handlers.down(p, e) !== false) stage.setPointerCapture(e.pointerId); } });
  stage.addEventListener('pointermove', e => { if (handlers && handlers.move) handlers.move(D.pt(e), e); });
  stage.addEventListener('pointerup', e => { if (handlers && handlers.up) handlers.up(D.pt(e), e); });

  D.toast = text => {
    stage.querySelectorAll('.toast').forEach(t => t.remove());
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    stage.appendChild(t);
    setTimeout(() => t.remove(), 1900);
  };

  // ---------- 手感（全部是合成层动画） ----------
  const outline = (w, c) => { const a = []; for (let i = 0; i < 12; i++) { const t = i / 12 * Math.PI * 2; a.push(`${(Math.cos(t) * w).toFixed(1)}px ${(Math.sin(t) * w).toFixed(1)}px 0 ${c}`); } return a.join(','); };
  // 飘字：弹出来、往上飘、淡掉
  D.float = (x, y, text, o = {}) => {
    const d = document.createElement('div');
    d.className = 'flt'; d.textContent = text;
    const size = o.size || 24;
    Object.assign(d.style, { left: x + 'px', top: y + 'px', fontSize: size + 'px', color: o.fill || '#fff', fontFamily: SK.FONTS[o.font || 'song'] || o.font, textShadow: outline(Math.max(2, size / 9), o.stroke || SK.INK) + `,0 ${size / 6}px 0 ${o.stroke || SK.INK}` });
    D.root.appendChild(d);
    const rise = o.rise == null ? 56 : o.rise, life = (o.life || .7) * 1000;
    D.anim(d, [
      { transform: 'translate(-50%,-50%) translateY(0) scale(.4)', opacity: 0 },
      { transform: 'translate(-50%,-50%) translateY(-8px) scale(1.18)', opacity: 1, offset: .16 },
      { transform: `translate(-50%,-50%) translateY(${-rise * .45}px) scale(1)`, opacity: 1, offset: .55 },
      { transform: `translate(-50%,-50%) translateY(${-rise}px) scale(.96)`, opacity: 0 }
    ], life, { easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => d.remove();
  };
  // 光圈：一圈扩散
  D.ring = (x, y, color = '#fff', r = 60, ms = 360, w = 6) => {
    const d = document.createElement('div');
    d.className = 'ring';
    Object.assign(d.style, { left: x - 50 + 'px', top: y - 50 + 'px', borderColor: color, borderWidth: w * 50 / r + 'px' });
    D.root.appendChild(d);
    D.anim(d, [{ transform: `scale(${(12 / 50).toFixed(2)})`, opacity: 1 }, { transform: `scale(${(r / 50).toFixed(2)})`, opacity: 0 }], ms, { easing: 'cubic-bezier(.1,.6,.3,1)' }).onfinish = () => d.remove();
  };
  // 一个元素以它的变换中心弹一下（用独立的 scale 属性，不打架）
  D.bounce = (el, k = 1.12, ms = 180) => {
    if (!el || !el.animate) return;
    el.animate([{ scale: '1' }, { scale: String(k), offset: .35 }, { scale: '1' }], { duration: ms / D.speed, easing: 'ease-out' });
  };
  // 整个手机抖一下
  D.shake = (amp = 8, ms = 260) => {
    const f = []; for (let i = 0; i < 7; i++) { const k = 1 - i / 6; f.push({ transform: `translate(${((Math.random() * 2 - 1) * amp * k).toFixed(1)}px,${((Math.random() * 2 - 1) * amp * k).toFixed(1)}px)` }); }
    f.push({ transform: 'translate(0,0)' });
    phone.animate(f, { duration: ms, easing: 'linear' });
  };
  // 屏幕边缘泛一下颜色
  D.flash = (color = '#ff3b2a', ms = 380) => {
    const f = document.createElement('div');
    Object.assign(f.style, { position: 'absolute', inset: 0, pointerEvents: 'none', boxShadow: `inset 0 0 160px 40px ${color}`, opacity: 0, willChange: 'opacity' });
    stage.appendChild(f);
    f.animate([{ opacity: 0 }, { opacity: .9, offset: .25 }, { opacity: 0 }], { duration: ms }).onfinish = () => f.remove();
  };
  // 精灵沿弧线飞过去（关键帧沿二次曲线取点）
  D.fly = (url, box, from, to, ms = 520, done, o = {}) => {
    const im = D.image(url, box);
    const mx = (from[0] + to[0]) / 2 + (o.bend || 0), my = Math.min(from[1], to[1]) - (o.arc == null ? 120 : o.arc), f = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10, u = 1 - t;
      const x = u * u * from[0] + 2 * u * t * mx + t * t * to[0], y = u * u * from[1] + 2 * u * t * my + t * t * to[1];
      f.push({ transform: `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${(1 - t * (o.shrink == null ? .4 : o.shrink)).toFixed(2)}) rotate(${((o.spin || 0) * t).toFixed(0)}deg)` });
    }
    D.anim(im, f, ms, { easing: o.easing || 'cubic-bezier(.45,0,.7,1)' }).onfinish = () => { im.remove(); if (done) done(); };
    return im;
  };
  // 飘落/升起的粒子：每个粒子一段无限循环的合成动画
  // o: html(i) 粒子的 SVG；area [x0,y0,x1,y1] 出生范围；dy 走多远；dx [min,max] 横向漂；dur [min,max] 秒；sway 摇摆幅度；spin 转多少度；fade 透明度关键帧
  D.drift = (n, o) => {
    const S = o.size || 24;
    for (let i = 0; i < n; i++) {
      const w = document.createElement('div'), inner = document.createElement('div');
      w.className = 'pt'; inner.className = 'pti';
      const [x0, y0, x1, y1] = o.area, x = x0 + Math.random() * (x1 - x0), y = y0 + Math.random() * (y1 - y0);
      inner.innerHTML = `<svg width="${S}" height="${S}" viewBox="${-S / 2} ${-S / 2} ${S} ${S}" style="overflow:visible;display:block;margin:${-S / 2}px 0 0 ${-S / 2}px">${o.html(i)}</svg>`;
      w.appendChild(inner); D.root.appendChild(w);
      const dur = (o.dur[0] + Math.random() * (o.dur[1] - o.dur[0])) * 1000, dx = o.dx ? o.dx[0] + Math.random() * (o.dx[1] - o.dx[0]) : 0;
      const f0 = { transform: `translate3d(${x.toFixed(0)}px,${y.toFixed(0)}px,0)` }, f1 = { transform: `translate3d(${(x + dx).toFixed(0)}px,${(y + o.dy).toFixed(0)}px,0)` };
      const frames = o.fade ? [Object.assign(f0, { opacity: o.fade[0] }), { opacity: o.fade[1], offset: .5 }, Object.assign(f1, { opacity: o.fade[2] })] : [f0, f1];
      w.animate(frames, { duration: dur, iterations: Infinity, delay: -Math.random() * dur, easing: 'linear' });
      if (o.sway || o.spin) {
        const sd = 1200 + Math.random() * 1400, a = o.sway || 0, sp = o.spin ? (Math.random() * 2 - 1) * o.spin : 0;
        inner.animate([{ transform: `translateX(${-a}px) rotate(${-sp}deg)` }, { transform: `translateX(${a}px) rotate(${sp}deg)` }], { duration: sd, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out', delay: -Math.random() * sd });
      }
      if (o.twinkle) w.firstChild.animate([{ opacity: 1 }, { opacity: .2 }], { duration: 500 + Math.random() * 700, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
    }
  };
  // 闪光点：原地一闪一闪
  D.twinkle = (points, html) => {
    points.forEach(([x, y, r], i) => {
      const w = document.createElement('div'); w.className = 'pt';
      w.innerHTML = `<svg width="${r * 2}" height="${r * 2}" viewBox="${-r} ${-r} ${r * 2} ${r * 2}" style="overflow:visible;display:block;margin:${-r}px 0 0 ${-r}px">${html(r)}</svg>`;
      w.style.transform = `translate3d(${x}px,${y}px,0)`;
      D.root.appendChild(w);
      w.firstChild.animate([{ transform: 'scale(.15) rotate(0deg)', opacity: 0 }, { transform: 'scale(1.1) rotate(45deg)', opacity: 1, offset: .5 }, { transform: 'scale(.15) rotate(90deg)', opacity: 0 }],
        { duration: 1500 + (i % 3) * 300, iterations: Infinity, delay: -i * 530, easing: 'ease-in-out' });
    });
  };
  // 一圈光边在某处呼吸（提示能点）
  D.glow = (d, color = '#ffe28c', w = 5) => {
    const g = D.el(`<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round"/>`);
    g.layer.animate([{ opacity: .2 }, { opacity: .9 }], { duration: 850, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
    return g;
  };
  // 无限循环的小动作（呼吸、上下浮）
  D.idle = (el, frames, ms, o = {}) => el.animate(frames, Object.assign({ duration: ms, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' }, o));

  // ---------- 控制面板 ----------
  D.panel = { title: '', intro: '', controls: [] };
  D.showHot = false;
  function renderPanel() {
    if (!panel) return;
    const P = D.panel;
    let h = `<div class="pn-sec"><div class="pn-h">跳到页面</div><div class="pn-pages">`;
    D.order.forEach((id, i) => { h += `<button data-go="${id}" class="${id === D.id ? 'on' : ''}"><em>${String(i + 1).padStart(2, '0')}</em>${D.pages[id].name}</button>`; });
    h += `</div></div><div class="pn-sec"><div class="pn-h">演示</div><div class="pn-row"><div class="seg"><button data-speed="1" class="${D.speed === 1 ? 'on' : ''}">×1</button><button data-speed="2" class="${D.speed === 2 ? 'on' : ''}">×2</button></div>`;
    h += `<button class="tgl${D.showHot ? ' on' : ''}" data-hot="1"><i></i>显示可点区域</button></div>`;
    const ctl = (P.controls || []).map((c, i) => [c, i]).filter(([c]) => !c.always);
    if (ctl.length) {
      const live = ctl.some(([c]) => !c.when || c.when());
      h += `<div class="pn-acts${live ? '' : ' off'}">` + ctl.map(([c, i]) => `<button data-ctl="${i}">${c.label}</button>`).join('') + `</div>`;
      if (!live) h += `<div class="pn-note">进入战斗后可用</div>`;
    }
    (P.controls || []).forEach((c, i) => { if (c.always) h += `<div class="pn-note"><a href="#" data-ctl="${i}">${c.label}</a></div>`; });
    h += `</div>`;
    if (P.tips) h += `<div class="pn-sec"><div class="pn-h">怎么玩</div><ol class="pn-tips">` + P.tips.map(t => `<li>${t}</li>`).join('') + `</ol></div>`;
    panel.innerHTML = h;
  }
  D.refreshPanel = renderPanel;
  if (panel) panel.addEventListener('click', e => {
    const b = e.target.closest('[data-go],[data-speed],[data-hot],[data-ctl]');
    if (!b) return;
    e.preventDefault();
    if (b.dataset.go) D.cut(b.dataset.go);
    else if (b.dataset.speed) { D.speed = +b.dataset.speed; renderPanel(); }
    else if (b.dataset.hot) { D.showHot = !D.showHot; stage.classList.toggle('showhot', D.showHot); renderPanel(); }
    else if (b.dataset.ctl) { const c = D.panel.controls[+b.dataset.ctl]; if (!c.when || c.when()) c.fn(); }
  });
})();
