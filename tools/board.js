/* board.js — 把一个方向的所有页面排成展板；?p=页面id 时只出单页（导出用） */
(function () {
  const meta = window.META, pages = window.PAGES;
  const q = new URLSearchParams(location.search);
  const one = q.get('p');
  document.title = meta.title + ' · ' + meta.subtitle;

  if (one) {
    const pg = pages.find(p => p.id === one);
    document.body.className = 'single';
    SK.seed(pg.seed || 1);
    document.body.innerHTML = pg.draw();
    return;
  }

  const t = meta.theme;
  document.body.style.cssText = `margin:0;background:${t.bg};color:${t.ink};font-family:${SK.FONTS.kai}`;
  const sw = meta.palette.map(([n, c]) =>
    `<div class="sw"><i style="background:${c}"></i><b>${n}</b><span>${c}</span></div>`).join('');
  const cards = pages.map((p, i) => {
    SK.seed(p.seed || 1);
    const svg = p.draw().replace('width="750" height="1334"', 'width="480" height="854"');
    return `<figure><div class="pg">${svg}</div><figcaption><em>${String(i + 1).padStart(2, '0')}</em> ${p.name}<small>${p.note || ''}</small></figcaption></figure>`;
  }).join('');
  document.body.innerHTML = `
<style>
  .wrap{width:1560px;margin:0 auto;padding:64px 40px 80px}
  header{display:grid;grid-template-columns:1fr 520px;gap:48px;align-items:end;border-bottom:2px solid ${t.ink}22;padding-bottom:36px;margin-bottom:44px}
  h1{font-family:${t.titleFont};font-weight:normal;font-size:96px;margin:0;line-height:1;color:${t.ink}}
  h1 small{display:block;font-family:${SK.FONTS.kai};font-size:26px;margin-top:18px;color:${t.accent};letter-spacing:.2em}
  .concept p{font-size:21px;line-height:1.75;margin:0 0 10px}
  .concept p b{color:${t.accent};font-weight:normal}
  .pal{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}
  .sw{display:flex;flex-direction:column;align-items:center;font-size:15px;gap:2px}
  .sw i{width:50px;height:50px;border-radius:50% 46% 52% 48%;box-shadow:inset 0 0 0 2px ${t.ink}18}
  .sw span{font-family:Consolas,monospace;font-size:11px;opacity:.6}
  .grid{display:grid;grid-template-columns:repeat(3,480px);gap:60px 40px}
  figure{margin:0}
  .pg{width:480px;height:854px;border-radius:26px;overflow:hidden;box-shadow:0 18px 40px -18px #0006,0 0 0 1px #0002}
  .pg svg{display:block}
  figcaption{margin-top:16px;font-size:24px}
  figcaption em{font-style:normal;font-family:Georgia,serif;color:${t.accent};margin-right:6px}
  figcaption small{display:block;font-size:16px;opacity:.7;margin-top:6px;line-height:1.6}
  footer{margin-top:56px;font-size:16px;opacity:.6}
</style>
<div class="wrap">
  <header>
    <div><h1>${meta.title}<small>${meta.subtitle}</small></h1></div>
    <div class="concept">${meta.concept.map(c => `<p>${c}</p>`).join('')}<div class="pal">${sw}</div></div>
  </header>
  <div class="grid">${cards}</div>
  <footer>${meta.footer || ''}</footer>
</div>`;
})();
