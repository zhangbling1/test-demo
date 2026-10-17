# 测试demo · 游戏 UI

两个方向，各一套竖屏小游戏界面（750×1334），战斗可以试玩。

| 方向 | 改编自 | 做法 | 画风 |
|---|---|---|---|
| [方向一《赵云与阿斗》](方向一-赵云与阿斗/设计说明.md) | 《赵云与阿斗》 | 人物、玩法照原作，画面换成西游 | Q版小人、祥云路、天宫金瓦红柱 |
| [方向二《躺平过冬》](方向二-躺平过冬/设计说明.md) | 《躺平发育》 | 躺平 = 冬眠，猛鬼 = 黄大仙 | 彩铅、蜡笔、绘本 |

## 怎么看

- **网页**：打开 `index.html`（或双击 `打开演示.bat`）。首页左右两扇，各进一个方向的方案页：改编思路 → 视觉 → 页面一览 → 试玩。
- **全屏试玩**：`方向X/demo.html`。
- **图片**：`方向X/export/` 里是 2 倍图（1500×2668）和展板 `00-展板.png`；`export/web/` 是网页用的压缩图。

本地打开就能用，不用装东西。想用本地服务器也行：

```bash
python -m http.server 5195 --directory 测试demo
```

## 文件

- `index.html`：首页
- `site/`：网站的样式和交互（`site.css`、`site.js`）
- `方向X/index.html`：方案页；`方向X/demo.html`：全屏试玩
- `方向X/pages.js`：游戏画面（SVG）；`方向X/demo.js`：页面跳转和战斗玩法
- `方向X/board.html`：出图用的展板页
- `tools/sketch.js`：手绘感的笔触；`tools/demo.js`、`demo.css`：试玩引擎（手机舞台、换页、拖拽、粒子、合成层动画）
- `tools/export.cjs`：导出 PNG；`tools/webimg.py`：压网页图；`tools/demo-check.cjs`：把试玩自动走一遍

改了 `pages.js` 之后重新出图：

```bash
node tools/export.cjs 方向一-赵云与阿斗 --board
python tools/webimg.py
```

## 关于画面

画面是代码画的草稿：题材、版式、交互流程和风格方向都定好了，角色和图标是简单造型。各方向「设计说明」末尾有一份手绘清单，列了建议亲手重画的部分。
