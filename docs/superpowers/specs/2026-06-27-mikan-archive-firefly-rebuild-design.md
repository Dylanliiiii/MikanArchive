# MikanArchive Firefly 重构设计规格

日期：2026-06-27

> 后续细化：非主页单列布局、横幅与通用侧栏移除、文章独立目录和工具导航细节，以 `docs/superpowers/specs/2026-06-27-mikan-archive-focused-content-layout-design.md` 为准；该规格覆盖本文中与非主页横幅、通用侧栏和收藏页面布局冲突的旧描述。

## 概要

MikanArchive 下一阶段不再沿用当前第一版页面做小修小补，而是以 CuteLeaf/Firefly 的主题能力和 fqzlr.com 的公开页面体验为主要参考，重建站点壳层、首页、文章列表、文章详情、友链、收藏和个人资料页。

重构目标不是复制 fqzlr.com 的个人内容、头像、图片、文案或私有配置，而是复刻它背后的体验结构：

- 大幅壁纸或横幅背景。
- 玻璃质感导航栏。
- 左右侧栏或响应式侧栏小组件。
- 文章列表的卡片、网格或瀑布流布局。
- 文章详情页的横幅标题、正文卡片、目录、相关推荐和阅读辅助。
- 友链页的搜索、标签筛选和头像卡片墙。
- 可配置主题色、亮暗色和壁纸显示模式。

MikanArchive 仍保持个人知识收藏博客定位，继续服务教程、笔记、资源收藏、友链和个人资料。

## 重要结论

当前私有内容仓库 `mikan-archive-content` 尚未创建，这不阻塞重构。

第一阶段继续使用公开仓库内的 `content.example/` 作为示例内容兜底。本地开发、GitHub Pages、Cloudflare Pages 和 Vercel 都应能在没有私有内容仓库时构建出示例站点。等私有内容仓库创建后，再通过现有内容同步脚本和环境变量接入真实内容。

## 设计依据

参考对象：

- fqzlr.com 首页与文章页公开体验。
- CuteLeaf/Firefly 主题源码与文档说明。
- MikanArchive 既有内容分离、部署和维护规则。

Firefly 是 MIT 许可的 Astro 静态博客主题，允许修改和分发，但必须保留版权声明。MikanArchive 如果引入 Firefly 的布局或代码，应在 README、页脚或许可证说明中保留：

- Copyright (c) 2024 saicaca - fuwari
- Copyright (c) 2025 CuteLeaf - Firefly
- Powered by Astro & Firefly 或等价致谢入口

## 范围

### 本次重构包含

- 以 Firefly 为底座或强参考重建 Astro 主题结构。
- 迁移到 Firefly 风格的配置体系，至少包含站点、导航、侧栏、壁纸、个人资料、友链、页脚、文章列表和文章页配置。
- 保留 MikanArchive 的公开框架仓库与私有内容仓库分离策略。
- 保留 `content.example/`，并让它映射到 Firefly 期望的内容目录。
- 导航保留 MikanArchive 的一级信息架构：`主页 / 文库 / 收藏 / 联系我 / 我的`。
- 文库可在 Firefly 的 `archive`、`categories`、`tags` 和文章分页体系上重命名和重组。
- 联系我入口使用 Firefly 风格下拉组织友链、留言和 QQ 群；友链页保留头像卡片墙、搜索和标签筛选。
- 文章详情页使用横幅元信息、目录、正文卡片、上一篇/下一篇、阅读进度或返回顶部等阅读辅助。
- 首页使用壁纸/横幅首屏、侧栏小组件、文章列表、站点统计、日历/热力图和个人资料卡。
- 收藏页以 MikanArchive 自有数据模型实现，视觉上接入 Firefly 的卡片语言。
- README、CHANGELOG、开发日志、部署说明和项目专属 Skill 同步到新版方向。

### 本次重构不包含

- 后台登录管理。
- 网站内一键上传。
- 数据库。
- 用户注册。
- 复杂 CMS。
- 自动友链审核。
- 复制 fqzlr.com 的真实文章、头像、个人资料、私有图片、站点文案或账号链接。
- 直接使用 Firefly 示例中的受第三方版权保护角色图片作为 MikanArchive 默认资产。

## 技术路线

推荐路线：以 Firefly 为底座重做。

原因：

- 用户明确更喜欢 fqzlr.com 的页面体验，而该站页脚显示使用 Firefly。
- 当前第一版是轻量自研壳层，继续补样式难以达到 Firefly 的布局密度和主题能力。
- Firefly 已经提供壁纸模式、侧边栏、文章布局切换、Pagefind 搜索、日历、站点统计、目录、主题色、亮暗色和页脚致谢等成熟模块。
- MikanArchive 的内容同步脚本和 `content.example/` 仍可保留，作为公开/私有内容分离层接到 Firefly 内容目录。

技术选择：

- Astro 7。
- Tailwind CSS，按 Firefly 版本选择 v4 或在迁移计划中明确 v3 到 v4 的变更。
- Markdown / MDX 内容集合。
- Svelte islands 可引入，用于沿用 Firefly 的搜索、显示设置和布局切换组件。
- Pagefind 用于生产环境全文搜索。
- 继续保留现有 Node.js 22+ 约束。

## 内容仓库策略

公开框架仓库继续包含：

```text
主题代码
页面布局
组件
样式系统
示例内容
配置模板
README / CHANGELOG / docs / scripts
Firefly / Fuwari 版权声明
```

私有内容仓库未来建议包含：

```text
content/
  posts/
  resources/resources.json
  links/friends.json
  links/sites.json
  profile/about.md
  profile/resume.json
  records/timeline.json
  records/updates.json
  assets/images/
  assets/backgrounds/
  assets/avatars/
  assets/files/
```

同步映射建议：

- `content/posts/` -> `src/content/posts/`
- `content/profile/about.md` -> `src/content/spec/about.md` 或 MikanArchive 自定义 profile 内容入口
- `content/links/friends.json` -> Firefly 风格友链配置生成源
- `content/resources/resources.json` -> MikanArchive 收藏页数据源
- `content/records/*.json` -> 可选历史记录数据源，当前公开站点不提供独立足迹页
- `content/assets/` -> `public/assets/`

如果没有私有内容仓库：

- `npm run sync:content` 从 `content.example/` 生成同样的目标目录。
- 示例内容必须清楚标记为示例，不能冒充真实内容。

## 信息架构

顶部导航保留：

```text
主页 / 文库 / 收藏 / 联系我 / 我的
```

可在 Firefly 的下拉菜单能力中展开二级入口：

- 文库：文章、归档、分类标签；文章的标签同时作为分类依据，不再提供独立标签页面。
- 收藏：工具导航、摘录收藏；收藏本身只作为下拉分组，不设空总览页。
- 联系我：友链、留言、QQ群。
- 我的：个人介绍、GitHub、RSS 等入口。

顶部一级导航仍保持简洁，不把所有入口平铺出来。

## 页面设计

### 主页

主页改为 Firefly 风格首屏：

- 大幅横幅或全屏壁纸。
- 中央站点标题 `MikanArchive` 和一句短介绍。
- 可选打字机副标题。
- 玻璃导航悬浮在顶部。
- 横幅底部使用柔和渐变或波浪过渡到内容区。
- 内容区使用主列 + 侧栏网格。
- 侧栏包含个人资料、公告、日历/热力图、分类、标签、站点统计或音乐小组件。
- 主列展示最近文章、精选收藏、个人介绍预览和友链预览。

### 文库

文库基于 Firefly 的文章列表能力：

- `/posts/` 文章总列表采用按分类标签分组的无封面长条卡片，不展示文章 `image` 字段或正文封面图。
- 每条文章长条卡片整体可点击进入详情，标题、元信息、摘要和标签共同组成扫描信息。
- 支持置顶、分类标签、发布日期、更新时间和摘要；旧 `category` 字段仅作为兼容元数据保留。
- 文章 `image` 字段仍可服务首页、推荐位、详情页横幅或后续明确需要封面的展示位，但不参与 `/posts/` 总列表渲染。
- 支持分页。
- 支持 Pagefind 搜索。
- 草稿默认不进入生产构建。

路由可保留 `/posts/`，同时可提供 `/archive/` 作为归档入口。

### 文章详情

文章详情页视觉应接近 Firefly/Fqzlr：

- 桌面端显示横幅标题与文章元信息。
- 正文卡片居中，文章页比首页更克制。
- 右侧或移动端折叠目录。
- 支持代码高亮、提醒块、图片预览、数学公式或图表能力按计划逐步接入。
- 支持上一篇/下一篇、相关文章或随机文章。
- 保留阅读进度、返回顶部和目录跳转。

### 收藏

收藏区是 MikanArchive 自有页面，使用 Firefly 的卡片语言并拆成两类实际功能：

- 收藏一级入口只作为顶部下拉分组；旧 `/resources/` 兼容跳转到工具导航。
- 工具导航保存长期反复使用的网站、平台、文档与效率工具，按分类分组展示。
- 摘录收藏保存针对某个问题或知识点有用的网页，展示标题、说明、来源、适用场景、标签和收藏日期。
- 顶部导航仍只保留“收藏”一个一级入口，通过下拉菜单进入工具导航和摘录收藏。

### 联系我与友链

联系我入口参考 fqzlr.com 的公开信息架构，使用下拉菜单集中放置友链、留言和 QQ 群入口；公开仓库只保留示例或待配置文案，不写入真实私人联系方式。

友链区域使用 Firefly 风格头像卡片墙：

- 搜索框。
- 标签筛选。
- 头像、站名、描述、标签和外链图标。
- hover 时边框高亮、头像轻微放大、外链图标出现。
- 保留 MikanArchive 的申请指南弹窗或等价内容块。
- 友链数据来自 `content.example/links/friends.json` 或未来私有内容仓库。

### 我的

我的下拉中的个人介绍页可参考 Firefly `about` 页：

- 个人介绍 Markdown。
- 技能栈。
- 项目入口。
- 简历入口。
- 联系方式和外部账号。
- 保持轻视觉个性，但不要像纯个人主页一样弱化知识博客定位。

## 视觉系统

整体关键词：

```text
Firefly 风格博客壳层 + MikanArchive 知识收藏馆 + 可读教程博客
```

色彩：

- 主题色默认可使用偏薄荷/青绿或柔粉，但必须支持可配置 hue。
- 保留粉、蓝、暖黄、薄荷绿和中性色的平衡。
- 不做全站单一粉色。
- 暗色模式要使用低饱和深色背景和清晰正文对比。

组件形态：

- 玻璃导航。
- 16px 左右圆角的博客卡片和侧栏小组件。
- 横幅壁纸、全屏壁纸、透明壁纸或纯色模式。
- 侧栏粘性组件。
- 小图标按钮用于搜索、主题、显示设置、返回顶部和目录。
- 友链、资源、文章卡片要有清晰 hover 状态。

资产：

- 默认资产不能直接使用 fqzlr.com 的私有图片。
- 默认资产不能直接使用 Firefly 示例中可能属于第三方游戏版权的角色图片。
- 可以使用 MikanArchive 自制 SVG/占位图、用户后续提供的图片、或后续通过图像生成创建原创壁纸。

## 交互

优先实现：

- 亮暗色切换。
- 搜索。
- 返回顶部。
- 文章列表布局切换。
- 壁纸模式切换。
- 标签和分类筛选。
- 友链搜索和筛选。
- 侧栏目录。

可后续实现：

- 音乐播放器。
- 看板娘或 Live2D。
- 分享海报。
- 相册。
- Bangumi/追番。
- 评论系统。

## 部署

部署策略不变：

- 第一优先：Cloudflare Pages。
- 兼容：GitHub Pages、Vercel。

没有私有内容仓库时：

```bash
npm run sync:content
npm run build
```

应使用 `content.example/` 构建示例站点。

有私有内容仓库后：

```env
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=<private content repository URL>
CONTENT_BRANCH=main
```

不要把带 token 的仓库地址写入公开文件。

## 迁移策略

推荐采取“保留内容同步层，重建主题层”的方式：

1. 保留 `content.example/`、`scripts/sync-content.mjs`、`scripts/validate-content.mjs` 和公开/私有内容分离规则。
2. 用 Firefly 目录结构重建 `src/`、配置文件、布局、组件和样式。
3. 将 MikanArchive 导航和页面需求映射到 Firefly 的主题能力。
4. 对 Firefly 中暂时不需要的页面开关设为关闭或不接入，例如 sponsor、guestbook、bangumi、gallery、anime。
5. 添加 MikanArchive 自有收藏页和个人介绍页。
6. 更新 README、部署文档、项目 Skill、CHANGELOG 和 development-log。
7. 跑通 `sync:content`、内容校验、类型检查、构建和本地浏览器检查。

## 验收标准

功能验收：

- 没有私有内容仓库也能使用 `content.example/` 构建。
- 首页、文库、文章详情、收藏、联系我、我的和个人介绍都可访问。
- 顶部导航为 `主页 / 文库 / 收藏 / 联系我 / 我的`，联系我下拉包含友链、留言和 QQ 群入口，我的下拉包含个人介绍、GitHub 和 RSS。
- 文章、收藏、友链和个人资料都来自内容层或配置层，不写死真实私有内容。
- 友链支持搜索和标签筛选。
- 文章页有目录、阅读辅助和清晰正文。
- README 与部署文档说明新的 Firefly 底座和内容同步方式。
- 页脚或文档保留 Astro、Firefly、Fuwari 的致谢与版权声明。

视觉验收：

- 首页第一眼接近 Firefly/Fqzlr 的博客体验，而不是通用个人主页。
- 壁纸、导航、侧栏、小组件和文章卡片构成统一博客壳层。
- 文章页比首页更克制，正文阅读不被装饰干扰。
- 移动端无横向溢出，导航、侧栏组件和卡片能合理折叠。
- 色彩不单一，且亮暗色模式都可读。

验证验收：

- `npm run sync:content`
- `npm run validate:content`
- `npm run check`
- `npm run build`
- 本地开发或预览服务器浏览检查桌面与移动视口。

## 风险

- Firefly 依赖栈较重，引入 Svelte、Pagefind、Tailwind v4、图像处理和更多配置，构建复杂度会高于当前第一版。
- 如果直接复制过多 Firefly 文件，需要谨慎处理 MikanArchive 路由、内容模型和部署 base path。
- Firefly 示例资产中有第三方版权素材，不能作为公开仓库默认资产直接沿用。
- 视觉复刻只能复刻公开体验结构，不能复制 fqzlr.com 的个人内容和素材。

## 决策

采用“以 Firefly 为底座重做”的路线。当前内容仓库未创建不影响执行，先以 `content.example/` 作为公开示例内容完成主题重构和构建验证。
