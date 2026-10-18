/* 测试demo · 网站交互：截图横滑 + 看大图、顶栏高亮、角色台和零件、试玩不在视口就暂停。
   方向页在加载本文件前放好 window.SITE = { defs, lineup(), parts() }。 */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const SITE = window.SITE || {};

  // 顶栏：当前章节高亮
  function navSpy() {
    const links = $$('.nav .links a');
    if (!links.length) return;
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a === map.get(e.target.id)));
    }), { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((a, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  }

  // 截图：网页图做缩略，点开看 2 倍原图
  function gallery() {
    const box = $('#gallery');
    if (!box || !window.PAGES) return;
    const shots = window.PAGES.map((p, i) => {
      const no = String(i + 1).padStart(2, '0');
      return { no, name: p.name.replace('-', ' · '), note: p.note || '', src: `export/web/${no}-${p.name}.jpg`, big: `export/${no}-${p.name}.png` };
    });
    box.innerHTML = shots.map((s, i) => `<figure class="shot" data-i="${i}"><img src="${s.src}" alt="${s.name}" decoding="async" draggable="false"><figcaption><em>${s.no}</em><b>${s.name}</b><span>${s.note}</span></figcaption></figure>`).join('');
    rail(box, shots.length);

    const lb = document.createElement('div');
    lb.className = 'lb';
    lb.innerHTML = `<button class="pv" aria-label="上一张">←</button><figure><div class="device"><img alt=""></div><figcaption></figcaption></figure><button class="nx" aria-label="下一张">→</button><button class="x" aria-label="关闭">✕</button>`;
    document.body.appendChild(lb);
    let cur = 0;
    const show = i => {
      cur = (i + shots.length) % shots.length;
      const s = shots[cur], img = $('img', lb);
      img.src = s.src; img.alt = s.name;
      const hi = new Image(); hi.onload = () => { if (shots[cur] === s) img.src = s.big; }; hi.src = s.big;
      $('figcaption', lb).innerHTML = `<em>${s.no} / ${String(shots.length).padStart(2, '0')}</em>${s.name}`;
    };
    const open = i => { show(i); lb.classList.add('on'); document.body.style.overflow = 'hidden'; };
    const close = () => { lb.classList.remove('on'); document.body.style.overflow = ''; };
    box.addEventListener('click', e => { const f = e.target.closest('.shot'); if (f) open(+f.dataset.i); });
    $('.pv', lb).onclick = () => show(cur - 1);
    $('.nx', lb).onclick = () => show(cur + 1);
    $('.x', lb).onclick = close;
    lb.addEventListener('click', e => { if (e.target === lb || e.target.tagName === 'FIGURE') close(); });
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

  // 横滑：页码、进度线、左右按钮、鼠标拖动
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
      no.textContent = String(cur + 1).padStart(2, '0');
      pv.disabled = box.scrollLeft < 4; nx.disabled = box.scrollLeft > max - 4;
    };
    box.addEventListener('scroll', sync, { passive: true });
    addEventListener('resize', sync);
    pv.onclick = () => box.scrollBy({ left: -step(), behavior: 'smooth' });
    nx.onclick = () => box.scrollBy({ left: step(), behavior: 'smooth' });
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
      if (!moved) return;
      box.classList.remove('drag');
      const w = step();
      box.scrollTo({ left: Math.round(box.scrollLeft / w) * w, behavior: 'smooth' });
      box.addEventListener('click', e => { e.stopPropagation(); e.preventDefault(); }, { capture: true, once: true });
    });
    sync();
  }

  // 角色台和界面零件：用游戏里的画法直接画
  function art() {
    if (!window.SK) return;
    const d = document.createElement('div');
    d.innerHTML = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${SK.defs(SITE.defs || '')}</svg>`;
    document.body.appendChild(d.firstChild);
    const st = $('#lineup');
    if (st && SITE.lineup) { SK.seed(9); st.innerHTML = SITE.lineup(); }
    const parts = $('#parts');
    if (parts && SITE.parts) { SK.seed(11); parts.innerHTML = SITE.parts().map(([svg, name]) => `<div class="part">${svg}<span>${name}</span></div>`).join(''); }
  }

  // 试玩不在视口里就暂停
  function demoPause() {
    const ph = $('#phone');
    if (!ph || !window.Demo) return;
    new IntersectionObserver(es => { window.Demo.paused = !es[0].isIntersecting; }).observe(ph);
  }

  addEventListener('DOMContentLoaded', () => { art(); gallery(); navSpy(); demoPause(); });
})();
