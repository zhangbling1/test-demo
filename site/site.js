/* 测试demo · 网站交互和动效
   开场（标题逐字落下、截图发牌、首页两栏滑进来）写在页面里，第一帧就开始，见 tools/build-site.py。
   这里管：拖动有惯性和倾斜、点开从原位放大、章节滚到再进场、角色原地晃和悬停跳、首页截图跟着鼠标倾斜。
   方向页在加载本文件前放好 window.SITE = { defs, lineup(), parts() }。 */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const SITE = window.SITE || {};
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE = 'cubic-bezier(.2,.8,.2,1)', SPRING = 'cubic-bezier(.34,1.5,.5,1)';
  const anim = (el, kf, o) => still || !el ? null : el.animate(kf, Object.assign({ fill: 'backwards', easing: EASE }, o));
  if (still) document.documentElement.classList.remove('js');

  // ---------- 章节进场：给元素挂上 data-anim，滚到了再放 ----------
  const AUTO = [['.sec-h h2', 'h'], ['.sec-h span', 'wipe'], ['.idea > div', 'up'], ['.cmp tbody', 'rows'], ['.h3', 'up'],
    ['#lineup', 'stage'], ['#parts', 'pop'], ['.pal', 'pop'], ['.type', 'rows'], ['.play-phone', 'up'], ['.panel', 'up'], ['.foot', 'up']];
  function reveals() {
    if (still) return;
    AUTO.forEach(([sel, kind]) => $$(sel).forEach(el => {
      el.dataset.anim = kind;
      [...el.children].forEach((c, i) => c.style.setProperty('--i', i));
    }));
    $$('.panel').forEach(el => el.style.setProperty('--dl', '.12s'));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('on');
      if (e.target.dataset.anim === 'stage') hopIn(e.target);
      io.unobserve(e.target);
    }), { rootMargin: '0px 0px -12% 0px' });
    $$('[data-anim]').forEach(el => io.observe(el));
  }

  // ---------- 顶栏：当前章节高亮，下划线滑过去 ----------
  function navSpy() {
    const box = $('.nav .links');
    if (!box) return;
    const links = $$('a', box), ink = document.createElement('i');
    ink.className = 'ink'; box.appendChild(ink);
    let cur = null;
    const put = a => {
      if (!a) { ink.style.opacity = 0; return; }
      ink.style.opacity = 1; ink.style.width = a.offsetWidth + 'px'; ink.style.transform = `translateX(${a.offsetLeft}px)`;
    };
    links.forEach(a => { a.addEventListener('mouseenter', () => put(a)); });
    box.addEventListener('mouseleave', () => put(cur));
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      cur = map.get(e.target.id);
      links.forEach(a => a.classList.toggle('on', a === cur));
      put(cur);
    }), { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((a, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    addEventListener('resize', () => put(cur));
  }

  // ---------- 截图横滑（截图本身写在页面里） ----------
  let shots = [];
  function gallery() {
    const box = $('#gallery');
    if (!box) return;
    shots = $$('.shot', box).map(f => ({ no: $('em', f).textContent, name: $('b', f).textContent, src: $('img', f).getAttribute('src'), big: f.dataset.big }));
    rail(box, shots.length);
    lightbox(box);
  }

  function rail(box, n) {
    const ctl = document.createElement('div');
    ctl.className = 'rail-ctl';
    ctl.innerHTML = `<span class="rail-no"><b>01</b> / ${String(n).padStart(2, '0')}</span><div class="rail-bar"><i></i></div><button class="rail-btn pv" aria-label="上一张">←</button><button class="rail-btn nx" aria-label="下一张">→</button>`;
    box.after(ctl);
    const bar = $('.rail-bar i', ctl), no = $('.rail-no b', ctl), pv = $('.pv', ctl), nx = $('.nx', ctl);
    const step = () => { const f = $('.shot', box); return f ? f.getBoundingClientRect().width + parseFloat(getComputedStyle(box).columnGap || 40) : 400; };
    const sync = () => {
      const max = box.scrollWidth - box.clientWidth, k = max > 0 ? box.scrollLeft / max : 0, vis = box.clientWidth / box.scrollWidth;
      bar.style.width = (vis * 100).toFixed(1) + '%';
      bar.style.transform = `translateX(${(k * (1 / vis - 1) * 100).toFixed(1)}%)`;
      const edge = box.scrollLeft + box.clientWidth * .35;
      let cur = 0; $$('.shot', box).forEach((f, i) => { if (f.offsetLeft <= edge) cur = i; });
      if (box.scrollLeft > max - 4) cur = Math.max(cur, n - 1);
      const t = String(cur + 1).padStart(2, '0');
      if (no.textContent !== t) { no.textContent = t; anim(no, [{ transform: 'translateY(8px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 260 }); }
      pv.disabled = box.scrollLeft < 4; nx.disabled = box.scrollLeft > max - 4;
    };
    // 跟着滑动速度倾斜一点，停下来回正
    let lastL = box.scrollLeft, lastT = performance.now(), tilt = 0, tiltRaf = 0, dragging = false;
    const tiltLoop = () => {
      tilt *= dragging ? .97 : .9;
      box.style.setProperty('--tilt', tilt.toFixed(2) + 'deg');
      tiltRaf = Math.abs(tilt) > .05 ? requestAnimationFrame(tiltLoop) : (box.style.setProperty('--tilt', '0deg'), 0);
    };
    box.addEventListener('scroll', () => {
      sync();
      if (still) return;
      const now = performance.now(), v = (box.scrollLeft - lastL) / Math.max(8, now - lastT);
      lastL = box.scrollLeft; lastT = now;
      tilt = Math.max(-12, Math.min(12, tilt * .6 - v * 5));
      if (!tiltRaf) tiltRaf = requestAnimationFrame(tiltLoop);
    }, { passive: true });
    addEventListener('resize', sync);
    pv.onclick = () => box.scrollBy({ left: -step(), behavior: 'smooth' });
    nx.onclick = () => box.scrollBy({ left: step(), behavior: 'smooth' });
    // 鼠标拖：松手带惯性滑一段，再吸到最近一张
    let down = null, moved = false, vel = 0, lastX = 0, lastMT = 0, glide = 0;
    box.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button) return;
      cancelAnimationFrame(glide);
      down = { x: e.clientX, l: box.scrollLeft }; moved = false; vel = 0; lastX = e.clientX; lastMT = performance.now();
    });
    addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - down.x;
      if (!moved && Math.abs(dx) > 6) { moved = true; dragging = true; box.classList.add('drag'); }
      if (!moved) return;
      box.scrollLeft = down.l - dx;
      const now = performance.now();
      vel = vel * .6 + ((e.clientX - lastX) / Math.max(8, now - lastMT)) * .4;
      lastX = e.clientX; lastMT = now;
    });
    addEventListener('pointerup', () => {
      if (!down) return;
      down = null; dragging = false;
      if (!moved) return;
      box.addEventListener('click', e => { e.stopPropagation(); e.preventDefault(); }, { capture: true, once: true });
      let v = -vel * 16;
      const snap = () => { box.classList.remove('drag'); const w = step(); box.scrollTo({ left: Math.round(box.scrollLeft / w) * w, behavior: 'smooth' }); };
      if (still || Math.abs(v) < 2) return snap();
      const run = () => { box.scrollLeft += v; v *= .93; if (Math.abs(v) > 1.5) glide = requestAnimationFrame(run); else snap(); };
      glide = requestAnimationFrame(run);
    });
    sync();
  }

  // ---------- 看大图：从缩略图的位置放大出来，关的时候缩回去 ----------
  function lightbox(box) {
    const lb = document.createElement('div');
    lb.className = 'lb';
    lb.innerHTML = `<button class="pv" aria-label="上一张">←</button><figure><div class="device"><img alt=""></div><figcaption></figcaption></figure><button class="nx" aria-label="下一张">→</button><button class="x" aria-label="关闭">✕</button>`;
    document.body.appendChild(lb);
    const dev = $('.device', lb), img = $('img', lb);
    let cur = 0;
    const thumb = i => $$('#gallery .shot img')[i];
    const fromRect = (el) => {
      const a = el.getBoundingClientRect(), b = dev.getBoundingClientRect();
      return `translate(${(a.left + a.width / 2) - (b.left + b.width / 2)}px,${(a.top + a.height / 2) - (b.top + b.height / 2)}px) scale(${a.width / b.width})`;
    };
    const show = (i, dir) => {
      cur = (i + shots.length) % shots.length;
      const s = shots[cur];
      img.src = s.src; img.alt = s.name;
      const hi = new Image(); hi.onload = () => { if (shots[cur] === s) img.src = s.big; }; hi.src = s.big;
      $('figcaption', lb).innerHTML = `<em>${s.no} / ${String(shots.length).padStart(2, '0')}</em>${s.name}`;
      if (dir) anim(dev, [{ transform: `translateX(${dir * 70}px)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 380 });
    };
    const open = i => {
      show(i);
      lb.classList.add('on'); document.body.style.overflow = 'hidden';
      const t = thumb(cur);
      if (t) { t.style.visibility = 'hidden'; anim(dev, [{ transform: fromRect(t), borderRadius: '16px' }, { transform: 'none' }], { duration: 520 }).onfinish = () => { t.style.visibility = ''; }; }
    };
    const close = () => {
      const t = thumb(cur), done = () => { lb.classList.remove('on'); document.body.style.overflow = ''; };
      if (!t || still) return done();
      t.scrollIntoView({ inline: 'nearest', block: 'nearest' });
      lb.style.transition = 'opacity .35s ease .15s'; lb.classList.remove('on'); document.body.style.overflow = '';
      t.style.visibility = 'hidden';
      dev.animate([{ transform: 'none' }, { transform: fromRect(t) }], { duration: 420, easing: EASE }).onfinish = () => { t.style.visibility = ''; lb.style.transition = ''; };
    };
    box.addEventListener('click', e => { const f = e.target.closest('.shot'); if (f) open(+f.dataset.i); });
    $('.pv', lb).onclick = () => show(cur - 1, -1);
    $('.nx', lb).onclick = () => show(cur + 1, 1);
    $('.x', lb).onclick = close;
    lb.addEventListener('click', e => { if (e.target === lb || e.target.tagName === 'FIGURE') close(); });
    addEventListener('keydown', e => {
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(cur - 1, -1);
      if (e.key === 'ArrowRight') show(cur + 1, 1);
    });
    let sx = null;
    lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); sx = null; });
  }

  // ---------- 角色台和界面零件 ----------
  function art() {
    if (!window.SK) return;
    const d = document.createElement('div');
    d.innerHTML = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${SK.defs(SITE.defs || '')}</svg>`;
    document.body.appendChild(d.firstChild);
    const st = $('#lineup');
    if (st && SITE.lineup) {
      SK.seed(9);
      // 角色台：先整张画出来量每个角色的位置，再拆成「底图 + 一个角色一张图」，动的时候只挪图片（滤镜不用每帧重算）
      const tmp = document.createElement('div');
      tmp.style.cssText = 'position:absolute;left:-99999px;top:0;width:1200px;visibility:hidden';
      tmp.innerHTML = SITE.lineup();
      document.body.appendChild(tmp);
      const svg = $('svg', tmp), vb = svg.viewBox.baseVal, W = vb.width, H = vb.height;
      const defs = SK.defs(SITE.defs || '');
      const img = (inner, x, y, w, h) => URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${Math.round(w * 2)}" height="${Math.round(h * 2)}">${defs}${inner}</svg>`], { type: 'image/svg+xml' }));
      const hops = $$('.hop', svg).map(h => { const bb = h.getBBox(), pad = 16; return { html: h.outerHTML, x: bb.x - pad, y: bb.y - pad, w: bb.width + pad * 2, h: bb.height + pad * 2 }; });
      $$('.hop', svg).forEach(h => h.remove());
      const bg = img(svg.innerHTML, 0, 0, W, H);
      tmp.remove();
      const pc = (v, t) => (v / t * 100).toFixed(3) + '%';
      st.innerHTML = `<div class="lu"><img class="bg" src="${bg}" alt="" draggable="false">` +
        hops.map((h, i) => `<img class="hop" style="--i:${i};left:${pc(h.x, W)};top:${pc(h.y, H)};width:${pc(h.w, W)}" src="${img(h.html, h.x, h.y, h.w, h.h)}" alt="" draggable="false">`).join('') + '</div>';
      $$('.hop', st).forEach(h => {
        const jump = () => { if (h.classList.contains('jump')) return; h.classList.add('jump'); h.addEventListener('animationend', () => h.classList.remove('jump'), { once: true }); };
        h.addEventListener('mouseenter', jump); h.addEventListener('click', jump);
      });
    }
    const parts = $('#parts');
    if (parts && SITE.parts) {
      SK.seed(11);
      const defs = SK.defs(SITE.defs || '');
      parts.innerHTML = SITE.parts().map(([svg, name]) => {
        const m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/), w = +m[1], h = +m[2];
        const url = URL.createObjectURL(new Blob([svg.replace('<svg ', `<svg width="${w * 2}" height="${h * 2}" `).replace(/(<svg[^>]*>)/, '$1' + defs)], { type: 'image/svg+xml' }));
        return `<div class="part"><img src="${url}" alt="" draggable="false"><span>${name}</span></div>`;
      }).join('');
    }
    // 空闲时把这些 SVG 图预先画成位图，滚到的时候不用现算滤镜
    const imgs = $$('#lineup img, #parts img');
    const toPng = im => new Promise(res => {
      const src = new Image();
      src.onload = () => {
        const c = document.createElement('canvas'); c.width = src.naturalWidth; c.height = src.naturalHeight;
        c.getContext('2d').drawImage(src, 0, 0);
        c.toBlob(b => { if (!b) return res(); const u = URL.createObjectURL(b), n = new Image(); n.src = u; n.decode().catch(() => {}).then(() => { im.src = u; res(); }); }, 'image/png');
      };
      src.onerror = () => res();
      src.src = im.src;
    });
    // 只在用户停手的时候做（画一张要几十毫秒，别赶上正在拖、正在滚）；大底图放最后
    imgs.sort((x, y) => (x.classList.contains('bg') ? 1 : 0) - (y.classList.contains('bg') ? 1 : 0));
    let lastInput = performance.now();
    ['pointermove', 'pointerdown', 'wheel', 'scroll', 'keydown', 'touchstart'].forEach(t => addEventListener(t, () => { lastInput = performance.now(); }, { passive: true, capture: true }));
    const next = () => {
      if (!imgs.length) return;
      if (performance.now() - lastInput < 700) return setTimeout(next, 400);
      (window.requestIdleCallback || (g => setTimeout(g, 50)))(() => toPng(imgs.shift()).then(() => setTimeout(next, 60)));
    };
    setTimeout(next, 2400);
  }
  // 角色一个个蹦上台
  function hopIn(stage) {
    $$('.hop', stage).forEach((h, i) => anim(h, [
      { transform: 'translateY(70px) scale(.7, 1.2)', opacity: 0 },
      { transform: 'translateY(-26px) scale(.95, 1.06)', opacity: 1, offset: .55 },
      { transform: 'translateY(0) scale(1.1, .9)', offset: .8 },
      { transform: 'none', opacity: 1 }
    ], { duration: 720, delay: 120 + i * 110 }));
  }

  // ---------- 首页：截图跟着鼠标倾斜 ----------
  function hub() {
    if (still || matchMedia('(pointer: coarse)').matches) return;
    $$('.hub .leaf').forEach(lf => {
      const tilt = $('.tilt', lf), a = $('.shot-a', lf);
      if (!tilt) return;
      lf.addEventListener('pointermove', e => {
        const r = a.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) / innerWidth, y = (e.clientY - (r.top + r.height / 2)) / innerHeight;
        tilt.style.setProperty('--ry', (x * 22).toFixed(2) + 'deg'); tilt.style.setProperty('--rx', (-y * 16).toFixed(2) + 'deg');
      });
      lf.addEventListener('pointerleave', () => { tilt.style.setProperty('--ry', '0deg'); tilt.style.setProperty('--rx', '0deg'); });
    });
  }

  // 试玩不在视口里就暂停
  function demoPause() {
    const ph = $('#phone');
    if (!ph || !window.Demo) return;
    new IntersectionObserver(es => { window.Demo.paused = !es[0].isIntersecting; }).observe(ph);
  }

  const start = () => { art(); gallery(); navSpy(); reveals(); hub(); demoPause(); };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', start); else start();
})();
