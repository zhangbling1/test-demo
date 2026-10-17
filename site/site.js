/* 测试demo · 网站交互：进场动画、顶栏高亮、页面一览 + 看大图、开场视差、角色台。
   方向页在加载本文件前放好 window.SITE = { dir, shots, lineup(), parts() }。 */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SITE = window.SITE || {};

  // 进场：滚到视口里再淡入
  function reveal() {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('.rv').forEach(el => io.observe(el));
  }

  // 顶栏：当前章节高亮
  function navSpy() {
    const links = $$('.nav .links a');
    if (!links.length) return;
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('on', a === map.get(e.target.id)));
    }), { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((a, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  }

  // 页面一览：用导出的 2 倍图，点开看大图
  function gallery() {
    const box = $('#gallery');
    if (!box || !window.PAGES) return;
    const shots = window.PAGES.map((p, i) => ({ no: String(i + 1).padStart(2, '0'), name: p.name, note: p.note || '', src: `export/web/${String(i + 1).padStart(2, '0')}-${p.name}.jpg`, big: `export/${String(i + 1).padStart(2, '0')}-${p.name}.png` }));
    box.innerHTML = shots.map((s, i) => `<figure class="shot rv" style="--d:${(i % 4) * .08}s" data-i="${i}"><div class="device"><img src="${s.src}" alt="${s.name}" decoding="async" draggable="false"></div><figcaption><b><em>${s.no}</em>${s.name.replace('-', ' · ')}</b><span>${s.note}</span></figcaption></figure>`).join('');
    rail(box, shots.length);
    const lb = document.createElement('div');
    lb.className = 'lb';
    lb.innerHTML = `<button class="pv" aria-label="上一张">‹</button><figure><div class="device"><img alt=""></div><figcaption></figcaption></figure><button class="nx" aria-label="下一张">›</button><button class="x" aria-label="关闭">✕</button>`;
    document.body.appendChild(lb);
    let cur = 0;
    const show = i => {
      cur = (i + shots.length) % shots.length;
      const s = shots[cur], img = $('img', lb);
      img.src = s.src; img.alt = s.name;
      const hi = new Image(); hi.onload = () => { if (shots[cur] === s) img.src = s.big; }; hi.src = s.big;
      $('figcaption', lb).innerHTML = `<em>${s.no} / ${String(shots.length).padStart(2, '0')}</em>${s.name.replace('-', ' · ')}`;
      const d = $('.device', lb); d.style.animation = 'none'; void d.offsetWidth; d.style.animation = '';
    };
    const open = i => { show(i); lb.classList.add('on'); document.body.style.overflow = 'hidden'; };
    const close = () => { lb.classList.remove('on'); document.body.style.overflow = ''; };
    box.addEventListener('click', e => { const f = e.target.closest('.shot'); if (f) open(+f.dataset.i); });
    $('.pv', lb).onclick = () => show(cur - 1);
    $('.nx', lb).onclick = () => show(cur + 1);
    $('.x', lb).onclick = close;
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    addEventListener('keydown', e => {
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
    let sx = null;
    lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1)); sx = null; });
  }

  // 横滑图带：进度条、页码、左右按钮、鼠标拖着滑
  function rail(box, n) {
    const ctl = document.createElement('div');
    ctl.className = 'rail-ctl';
    ctl.innerHTML = `<div class="rail-bar"><i></i></div><span class="rail-no"><b>01</b> / ${String(n).padStart(2, '0')}</span><button class="rail-btn pv" aria-label="上一张">←</button><button class="rail-btn nx" aria-label="下一张">→</button>`;
    box.after(ctl);
    const bar = $('.rail-bar i', ctl), no = $('.rail-no b', ctl), pv = $('.pv', ctl), nx = $('.nx', ctl);
    const step = () => { const f = $('.shot', box); return f ? f.getBoundingClientRect().width + parseFloat(getComputedStyle(box).columnGap || 36) : 400; };
    const sync = () => {
      const max = box.scrollWidth - box.clientWidth, k = max > 0 ? box.scrollLeft / max : 0;
      const vis = box.clientWidth / box.scrollWidth;
      bar.style.width = (vis * 100).toFixed(1) + '%';
      bar.style.transform = `translateX(${(k * (1 / vis - 1) * 100).toFixed(1)}%)`;
      const center = box.scrollLeft + box.clientWidth / 2;
      let cur = 0; $$('.shot', box).forEach((f, i) => { if (f.offsetLeft <= center) cur = i; });
      if (box.scrollLeft < 4) cur = 0; if (box.scrollLeft > max - 4) cur = n - 1;
      no.textContent = String(cur + 1).padStart(2, '0');
      pv.disabled = box.scrollLeft < 4; nx.disabled = box.scrollLeft > max - 4;
    };
    box.addEventListener('scroll', sync, { passive: true });
    addEventListener('resize', sync);
    pv.onclick = () => box.scrollBy({ left: -step(), behavior: 'smooth' });
    nx.onclick = () => box.scrollBy({ left: step(), behavior: 'smooth' });
    // 鼠标拖着滑（触屏本来就能滑）
    let down = null, moved = false;
    box.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button) return; down = { x: e.clientX, l: box.scrollLeft }; moved = false; });
    addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - down.x;
      if (!moved && Math.abs(dx) > 6) { moved = true; box.classList.add('drag'); }
      if (moved) box.scrollLeft = down.l - dx;
    });
    addEventListener('pointerup', () => {
      if (!down) return;
      down = null;
      if (moved) {
        box.classList.remove('drag');
        const w = step(), target = Math.round(box.scrollLeft / w) * w;
        box.scrollTo({ left: target, behavior: 'smooth' });
        box.addEventListener('click', e => { e.stopPropagation(); e.preventDefault(); }, { capture: true, once: true });
      }
    });
    box.addEventListener('keydown', e => { if (e.key === 'ArrowRight') nx.click(); if (e.key === 'ArrowLeft') pv.click(); });
    sync();
  }

  // 开场两部手机跟着鼠标轻轻动
  function parallax() {
    const st = $('.stack');
    if (!st || reduce || matchMedia('(pointer: coarse)').matches) return;
    const d1 = $('.d1', st), d2 = $('.d2', st);
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const step = () => {
      x += (tx - x) * .08; y += (ty - y) * .08;
      d1.style.transform = `translate(${x * 14}px,${y * 10}px) rotate(${-4 + x * 2}deg)`;
      d2.style.transform = `translate(${x * -10}px,${y * -8}px) rotate(${7 + x * 1.5}deg) scale(.86)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > .001 ? requestAnimationFrame(step) : 0;
    };
    addEventListener('pointermove', e => {
      tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5;
      if (!raf) raf = requestAnimationFrame(step);
    });
  }

  // 角色台和界面零件：直接用游戏里的画法画
  function art() {
    if (!window.SK) return;
    const defs = document.createElement('div');
    defs.innerHTML = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${SK.defs(SITE.defs || '')}</svg>`;
    document.body.appendChild(defs.firstChild);
    const st = $('#lineup');
    if (st && SITE.lineup) { SK.seed(9); st.insertAdjacentHTML('afterbegin', SITE.lineup()); }
    const parts = $('#parts');
    if (parts && SITE.parts) { SK.seed(11); parts.innerHTML = SITE.parts().map(([svg, name], i) => `<div class="part rv" style="--d:${(i % 6) * .06}s">${svg}<span>${name}</span></div>`).join(''); }
  }

  // 试玩：手机不在视口里就暂停，省电
  function demoPause() {
    const ph = $('#phone');
    if (!ph || !window.Demo) return;
    new IntersectionObserver(es => { window.Demo.paused = !es[0].isIntersecting; }).observe(ph);
  }

  addEventListener('DOMContentLoaded', () => { art(); gallery(); reveal(); navSpy(); parallax(); demoPause(); });
})();
