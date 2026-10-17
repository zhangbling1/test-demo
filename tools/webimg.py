# 把 export 里的 2 倍 PNG 压成网页用的 JPG（750 宽）：python tools/webimg.py
import os, sys, glob
from PIL import Image
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for d in ['方向一-赵云与阿斗', '方向二-躺平过冬']:
    src = os.path.join(root, d, 'export'); dst = os.path.join(src, 'web')
    os.makedirs(dst, exist_ok=True)
    for f in sorted(glob.glob(os.path.join(src, '*.png'))):
        name = os.path.splitext(os.path.basename(f))[0]
        if name.startswith('00'): continue
        im = Image.open(f).convert('RGB')
        im = im.resize((750, round(im.height * 750 / im.width)), Image.LANCZOS)
        out = os.path.join(dst, name + '.jpg')
        im.save(out, 'JPEG', quality=86, optimize=True, progressive=True)
        print(os.path.relpath(out, root), os.path.getsize(out) // 1024, 'KB')
