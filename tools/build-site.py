# 把截图带和开场动效直接写进页面（不靠脚本生成，第一帧就是对的）：python tools/build-site.py
# 改了 pages.js 里的页面名或说明、或者重新出图之后跑一次。
import io, os, re
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 开场：在页面第一次画出来之前就挂上动画（WAAPI 的 backwards 让元素先停在起点），不会闪
INTRO = r'''<script>
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var E = 'cubic-bezier(.2,.8,.2,1)', L = window.__intro = [];
  var A = function (el, kf, o) { if (!el) return; o.fill = 'backwards'; o.easing = o.easing || E; L.push(el.animate(kf, o)); };
  var q = function (s) { return document.querySelector(s); }, qa = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  // 标题逐字落下
  var drop = function (el, delay) {
    if (!el) return;
    el.innerHTML = Array.from(el.textContent).map(function (c) { return '<span class="c">' + c + '</span>'; }).join('');
    [].slice.call(el.children).forEach(function (c, i) {
      A(c, [{ transform: 'translateY(-60px) rotate(-10deg)', opacity: 0 }, { transform: 'translateY(8px) rotate(3deg)', opacity: 1, offset: .62 },
        { transform: 'translateY(-3px) rotate(-1deg)', offset: .82 }, { transform: 'none', opacity: 1 }], { duration: 760, delay: delay + i * 70 });
    });
  };
  var up = function (el, d) { A(el, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: d }); };
  if (q('.head')) {
    A(q('.nav'), [{ transform: 'translateY(-100%)' }, { transform: 'none' }], { duration: 600 });
    drop(q('.head .logo'), 80);
    up(q('.head p'), 380);
    qa('.head .meta > *').forEach(function (m, i) { up(m, 480 + i * 70); });
    // 截图像发牌一样一张张进来
    qa('#gallery .shot').forEach(function (f, i) {
      A(f, [{ transform: 'translateX(160px) rotate(6deg) scale(.9)', opacity: 0 }, { transform: 'translateX(-8px) rotate(-.6deg)', opacity: 1, offset: .7 },
        { transform: 'none', opacity: 1 }], { duration: 900, delay: 180 + i * 95 });
    });
  }
  qa('.hub .leaf').forEach(function (lf, i) {
    var dir = i ? 1 : -1;
    A(lf.querySelector('.shot-a'), [{ transform: 'translateX(' + dir * 90 + 'px) rotate(' + dir * 8 + 'deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 1000, delay: 120 + i * 140 });
    drop(lf.querySelector('.logo'), 380 + i * 160);
    up(lf.querySelector('.leaf-in p'), 700 + i * 140);
    up(lf.querySelector('.leaf-in .acts'), 820 + i * 140);
  });
})();
</script>'''
HEAD = '''<script>document.documentElement.classList.add('js');addEventListener('pagereveal',function(e){if(e.viewTransition)(window.__intro||[]).forEach(function(a){a.finish()})},{once:true});</script>'''

def put(html, start, end, inner):
    a = html.index(start) + len(start); b = html.index(end, a)
    return html[:a] + inner + html[b:]

def ensure(html, marker_before, block, tag):
    # 在 marker_before 前插入 block（已存在 tag 就替换）
    if tag in html:
        return re.sub(re.escape(tag) + r'.*?' + re.escape(tag.replace('<!-- ', '<!-- /')), lambda m: tag + block + tag.replace('<!-- ', '<!-- /'), html, flags=re.S)
    return html.replace(marker_before, tag + block + tag.replace('<!-- ', '<!-- /') + '\n' + marker_before, 1)

for d in ['方向一-赵云与阿斗', '方向二-躺平过冬']:
    pages = io.open(os.path.join(root, d, 'pages.js'), encoding='utf-8').read()
    items = re.findall(r"\{ id: '(\w+)', name: '([^']+)', seed: \d+, draw: \w+, note: '([^']*)' \}", pages)
    vt = 'zy' if '赵' in d else 'tp'
    figs = ''
    for i, (_, name, note) in enumerate(items):
        no = f'{i + 1:02d}'
        style = f' style="view-transition-name:{vt}-shot"' if i == 0 else ''
        figs += (f'\n    <figure class="shot" data-i="{i}" data-big="export/{no}-{name}.png"><img src="export/web/{no}-{name}.jpg" alt="{name.replace("-", " · ")}" decoding="async" draggable="false"{style}>'
                 f'<figcaption><em>{no}</em><b>{name.replace("-", " · ")}</b><span>{note}</span></figcaption></figure>')
    p = os.path.join(root, d, 'index.html')
    html = io.open(p, encoding='utf-8').read()
    html = re.sub(r'<div id="gallery" class="gallery">.*?</div>\n</div></section>', lambda m: '<div id="gallery" class="gallery">' + figs + '\n  </div>\n</div></section>', html, count=1, flags=re.S)
    html = re.sub(r'<h1 class="logo">', f'<h1 class="logo" style="view-transition-name:{vt}-logo">', html, count=1) if 'view-transition-name' not in html.split('<h1 class="logo"')[1][:60] else html
    html = ensure(html, '<section class="sec" id="idea">', '\n' + INTRO + '\n', '<!-- intro -->')
    if HEAD not in html: html = html.replace('</head>', HEAD + '\n</head>', 1)
    io.open(p, 'w', encoding='utf-8').write(html)
    print(d, len(items), '张')

p = os.path.join(root, 'index.html')
html = io.open(p, encoding='utf-8').read()
for vt in ['zy', 'tp']:
    html = re.sub(r'(<section class="leaf t-%s">.*?<img )(src=)' % vt, r'\1style="view-transition-name:%s-shot" \2' % vt, html, count=1, flags=re.S) if f'{vt}-shot' not in html else html
    html = re.sub(r'(<section class="leaf t-%s">.*?<h1 class="logo")>' % vt, r'\1 style="view-transition-name:%s-logo">' % vt, html, count=1, flags=re.S) if f'{vt}-logo' not in html else html
html = ensure(html, '<script src="site/site.js"></script>', '\n' + INTRO + '\n', '<!-- intro -->')
if HEAD not in html: html = html.replace('</head>', HEAD + '\n</head>', 1)
io.open(p, 'w', encoding='utf-8').write(html)
print('首页 ok')
