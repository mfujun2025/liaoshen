# 小娟海参官网 · 静态回放镜像

`https://xjhzp.com/` 的静态回放（GCW 交付契约 **A：可运行回放**），用于 GitHub Pages 演示、归档与离线查看。

- 源站：`https://xjhzp.com/`（大连小娟海珍品有限公司官网）
- 镜像方式：抓取源站 prerender 后的 HTML 与静态资源，去除 SPA 运行时，补一层回放脚本
- 构建日期：2026-11-11

## 页面清单

| 路径 | 页面 |
| --- | --- |
| `/` | 首页 |
| `/about/` | 关于我们 |
| `/products/` | 品牌产品 |
| `/advantages/` | 核心优势 |
| `/shop/` | 商铺直达 |
| `/contact/` | 联系我们 |
| `/news/xiaojuan-sea-cucumber-factory-visit-2026/` | 开门溯源见匠心（2026 上半年工厂参观） |
| `/news/feini-moshu-tebie-qihua/` | 《非你莫属》特别企划 |
| `/news/chuangye-mianduimian/` | 《创业面对面》 |

> 源站 `/news` 列表页本身返回 404，镜像不提供该路由，与源站行为一致。

## 目录结构

```
index.html                 首页
about|products|advantages|shop|contact|news/<slug>/index.html
assets/
  index-ff_Klkkk.css       源站主样式（已改为相对路径）
  advantages-page-*.css    核心优势页样式
  replay.css / replay.js   回放补丁（本项目新增，非源站代码）
AppUpload/Image/*          图片素材
AppUpload/Video/*          视频素材（首页宣传片、新闻视频）
404.html / .nojekyll / robots.txt
```

## 部署

仓库根目录即站点根，GitHub Pages 用 **Deploy from a branch → `main` → `/ (root)`** 即可。

- 项目站点地址：`https://mfujun2025.github.io/liaoshen/`
- 所有链接与素材均为相对路径，可在 `/liaoshen/` 子路径下直接运行；自定义域名同样可用。

## 回放补丁做了什么

源站是 Vite + React 的 prerendered SPA，去掉 JS 包后静态内容完整，但少数交互需要补回。`assets/replay.js` 仅实现这些视觉行为：

- `.fade-in` 滚动入场（原 `useLegacyReveal` 的等价实现）
- 首页统计数字滚动计数（原 DOM 中初始为 `0`）
- 移动端汉堡菜单、`商铺直达` 下拉、导航栏滚动吸顶
- 首页「点击播放视频」→ 灯箱播放宣传片
- 表单提交拦截并提示（回放无后端）

## 已知差距（Known Gaps）

1. **不含 SPA 运行时**：客户端路由、数据请求、会员/登录等逻辑不在镜像范围内；页面间跳转为整页加载。
2. **表单不提交**：`/contact` 等表单只做前端提示，不写入任何后端。
3. **动态状态未复刻**：Toast、加载骨架、图片懒加载动画等仅保留静态终态。
4. **未做像素级比对**：构建环境无 Node/Playwright，未执行截图 Diff；仅完成资源完整性（278 处引用）与子路径 HTTP 200 校验。
5. **视频体积**：3 段 mp4 共约 26 MB，占仓库体积主要部分。

## 素材与权属

页面文案、图片、视频、Logo、字体排版均来自 `xjhzp.com`，由站点所有者（本项目委托人）提供授权用于此镜像。`assets/replay.js`、`assets/replay.css` 为本项目新写的补丁代码。

## 索引

`robots.txt` 默认 `Disallow: /`，避免镜像与源站产生重复收录。如需对外公开索引，删除该文件或将 `Disallow` 改为 `Allow`。
