# Development Log

## 2026-06-27 11:06:53 +08:00

### 修改范围

- 收藏数据模型与内容校验
- 收藏总览、工具导航与摘录收藏页面
- 足迹年份 / 月份 / 记录三层分支归档
- 导航、测试、设计规格与内容仓库文档同步

### 涉及文件

- `content.example/resources/resources.json`
- `scripts/validate-content.mjs`
- `src/data/mikan.ts`
- `src/pages/resources/index.astro`
- `src/pages/resources/tools.astro`
- `src/pages/resources/clips/index.astro`
- `src/pages/records/index.astro`
- `src/config/navBarConfig.ts`
- `tests/mikan-data.test.ts`
- `tests/mikan-pages.test.ts`
- `package.json`
- `README.md`
- `docs/content-repository.md`
- `docs/superpowers/specs/2026-06-27-mikan-archive-firefly-rebuild-design.md`
- `docs/next-tasks.md`
- `CHANGELOG.md`
- `AGENTS.md`
- `.agents/skills/mikan-archive-project/SKILL.md`
- `.agents/skills/mikan-archive-maintenance/SKILL.md`
- `development-log.md`

### 具体内容

- 为资源收藏增加必填 `kind` 字段，支持 `tool` 与 `clip`，并补充摘录来源、适用场景和收藏日期示例。
- 新增资源类型筛选、分类分组和足迹年份 / 月份归档 helper；时间线类型同步支持可选 `category`。
- 采用红绿测试完成 4 项数据 helper 测试和 5 项收藏 / 足迹页面契约测试。
- 将收藏入口改为总览页，并新增工具导航与摘录收藏独立路由；顶部“收藏”保持单一一级入口，通过下拉菜单进入三个页面。
- 将足迹扁平时间线改为连接主干的年份、月份、记录三层分支；鼠标 hover 或键盘 focus 时当前分支由浅色虚线切换为主题色实线。
- 同步 README、内容仓库说明、CHANGELOG、正式 Firefly 设计规格、AGENTS 和项目专属 Skill，并在任务完成后清理交接文档正文。

### 验证情况

- `node --check scripts/validate-content.mjs`：通过。
- `npm.cmd run sync:content`：通过。
- `npm.cmd run validate:content`：通过。
- `npm.cmd run test:content-model`：4 项通过，0 项失败。
- `npm.cmd run test:pages`：5 项通过，0 项失败。
- `npm.cmd run check`：160 个文件，0 errors、0 warnings、1 个既有 Calendar 未使用事件参数提示。
- `npm.cmd run build`：通过，生成 15 个页面及 Pagefind 索引；保留 Firefly 既有动态导入与 chunk 体积警告。
- 本地预览检查 `/resources/`、`/resources/tools/`、`/resources/clips/`、`/records/`：桌面和 390px 移动视口标题、内容与导航正确，无横向溢出，浏览器控制台无 error/warning。
- 足迹月份分支样式实测：默认 `dashed`，聚焦后变为 `2px solid` 主题色。
- `git diff --check`：通过。

## 2026-06-27 04:46:01 +08:00

### 修改范围

- 下一步任务交接文档
- 跨会话任务管理规则
- 项目专属 Skill 维护流程同步

### 涉及文件

- `docs/next-tasks.md`
- `AGENTS.md`
- `.agents/skills/mikan-archive-project/SKILL.md`
- `.agents/skills/mikan-archive-maintenance/SKILL.md`
- `development-log.md`

### 具体内容

- 新增 `docs/next-tasks.md`，用于记录跨会话待执行任务、技术实现步骤、阻塞点和下一次继续的位置。
- 将收藏拆分与足迹归档精修的背景、技术步骤、验证命令和当前执行状态写入 `docs/next-tasks.md`。
- 在 `AGENTS.md` 中新增“下一步任务交接”规则，明确它与 `development-log.md` 的区别和维护方式。
- 同步更新 `mikan-archive-project` 与 `mikan-archive-maintenance` 项目专属 Skill，要求每次修改前读取 `docs/next-tasks.md`，暂停、阻塞、完成步骤或跨会话交接时更新它。
- 清理被打断前残留的临时 `tests/` 目录；本次不继续实现收藏和足迹功能代码。

### 验证情况

- 已读回 `docs/next-tasks.md` 前 60 行，确认文档已落盘并包含当前目标和技术步骤。
- 已使用 `Select-String` 检查 `AGENTS.md` 中“下一步任务交接”和“开发记录”标题位置，发现并修复了一次重复标题。
- 本次只修改文档和项目规则，未运行应用构建或页面预览。

## 2026-06-27 02:09:10 +08:00

### 修改范围

- Firefly 风格主题重构实施
- 内容同步与 Firefly 内容集合适配
- 核心页面、导航、侧栏和文章体验迁移
- 构建配置、依赖、安全审计和文档同步

### 涉及文件

- `LICENSE`
- `package.json`
- `package-lock.json`
- `astro.config.mjs`
- `tsconfig.json`
- `postcss.config.mjs`
- `svelte.config.js`
- `pagefind.yml`
- `.github/workflows/pages.yml`
- `.gitignore`
- `AGENTS.md`
- `.agents/skills/mikan-archive-project/SKILL.md`
- `README.md`
- `CHANGELOG.md`
- `docs/content-repository.md`
- `docs/deployment-cloudflare-pages.md`
- `docs/maintenance.md`
- `docs/superpowers/plans/2026-06-27-mikan-archive-firefly-rebuild.md`
- `docs/superpowers/specs/2026-06-27-mikan-archive-firefly-rebuild-design.md`
- `content.example/posts/2026-06-26-welcome-to-mikan-archive.md`
- `scripts/sync-content.mjs`
- `scripts/validate-content.mjs`
- `src/`
- `development-log.md`

### 具体内容

- 以 Firefly 主题结构重建 `src/` 页面层，接入 Firefly 风格的壁纸横幅、玻璃导航、左右侧栏、文章列表、文章详情、友邻墙、搜索、显示设置、返回顶部和阅读目录等体验。
- 保留 MikanArchive 的公开框架仓库与私有内容仓库分离边界，继续使用 `content.example/` 作为私有内容仓库未创建时的兜底内容源。
- 更新内容同步脚本，使示例或未来私有内容同步到 `src/content/posts/`、`src/content/profile/`、`src/content/spec/`、`src/data/content/` 和 `public/assets/`。
- 将示例文章封面字段从旧的 `cover` 改为 Firefly 使用的 `image`，并让 Content Layer 对 `published`、`updated` 字符串日期做兼容转换。
- 新增 `src/data/mikan.ts`，用结构化 JSON 读取资源收藏、友链、足迹、最近更新和简历数据，供 Firefly 风格页面使用。
- 保留核心页面：主页、文库、文章详情、收藏、友邻、足迹、我的、归档、分类、标签、搜索、RSS、robots 和 404；移除暂不启用且阻塞构建的番组、追番、相册、留言和打赏页面入口。
- 新增 `LICENSE` 并保留 MikanArchive、Firefly 与 fuwari 的 MIT 版权声明；没有复制 fqzlr.com 的真实文章、头像、个人资料或私有素材，也没有提交 Firefly 默认角色壁纸、模型、音乐或打赏二维码。
- 曾评估 `@swup/astro` 作为 Firefly 页面过渡集成，但其最新版仍带有无可用修复的 high severity npm audit 传递依赖链；因此当前移除 Swup 集成，保留普通静态页面跳转，并保留 guarded `window.swup` 兼容类型以便未来恢复时减少改动。
- 更新 README、内容仓库说明、Cloudflare Pages 部署文档、维护说明、CHANGELOG、AGENTS 和项目专属 Skill，使构建命令、内容映射、Firefly 方向和版权边界与当前实现一致。
- 同步 GitHub Pages workflow，移除重复的独立内容同步步骤；`npm run check` 会先执行内容同步，`npm run build` 统一执行同步、校验、构建和 Pagefind 索引。

### 验证情况

- 已运行 `npm.cmd install --cache .npm-cache --registry=https://registry.npmjs.org`，通过并更新 `package-lock.json`。首次使用全局 npm cache 安装时曾因本机全局缓存目录 EPERM 失败，改用仓库内 `.npm-cache/` 后通过。
- 已运行 `npm.cmd run sync:content`，通过，确认没有私有内容仓库时可从 `content.example/` 生成站点内容。
- 已运行 `npm.cmd run validate:content`，通过，输出 `Content validation passed.`。
- 已运行 `npm.cmd run check`，通过，命令会先执行 `sync:content`，结果为 0 errors、0 warnings、1 hint；剩余 hint 是 Firefly 日历组件中一个未使用的事件参数，不阻塞构建。
- 已运行 `npm.cmd run build`，通过，生成 13 个静态页面、sitemap 和 Pagefind 索引。构建仍提示若干 Firefly 动态导入不会拆分 chunk、部分 chunk 超过 500KB、Astro markdown gfm/smartypants 未来弃用提示，以及中文 Pagefind 不支持 stemming；这些是优化项，不影响当前构建。
- 已运行 `npm.cmd audit --omit=dev --json`，生产依赖安全公告数量为 0。完整 `npm.cmd audit --json` 仍有 5 个 moderate dev 依赖公告，来源为 `@astrojs/check` 的语言服务链，当前 npm 没有非破坏性修复。
- 已启动 `npm.cmd run preview -- --host 127.0.0.1 --port 4321`，预览地址为 `http://127.0.0.1:4321/`。
- 已使用系统 Chrome 通过 Playwright 检查 `/`、`/posts/`、`/posts/2026-06-26-welcome-to-mikan-archive/`、`/resources/`、`/friends/`、`/records/`、`/about/`，均返回 200，页面标题和首个 `h1` 正常，导航可见，内容包含 `MikanArchive`。
- 已使用移动视口检查首页，确认移动端菜单按钮可见，首屏内容包含 `MikanArchive`。
- 已保存预览截图到 `.tmp/preview-final-home.png` 和 `.tmp/preview-final-home-mobile.png`；`.tmp/` 已被 `.gitignore` 忽略。

## 2026-06-27 01:25:47 +08:00

### 修改范围

- Firefly 重构方向确认
- 设计规格新增
- 项目规则、README、CHANGELOG 和忽略规则同步
- Firefly 主题与 fqzlr.com 参考边界调研

### 涉及文件

- `.gitignore`
- `AGENTS.md`
- `.agents/skills/mikan-archive-project/SKILL.md`
- `README.md`
- `CHANGELOG.md`
- `docs/superpowers/specs/2026-06-27-mikan-archive-firefly-rebuild-design.md`
- `development-log.md`

### 具体内容

- 新增 Firefly 重构设计规格，明确下一阶段以 CuteLeaf/Firefly 为底座或强参考重建 MikanArchive 的壁纸、玻璃导航、侧栏、文章列表、文章详情、友链、收藏、足迹和我的页面体验。
- 明确当前私有内容仓库 `mikan-archive-content` 尚未创建不阻塞重构，第一阶段继续使用 `content.example/` 兜底，后续通过现有内容同步脚本和环境变量接入私有内容仓库。
- 明确可以复刻 fqzlr.com 的公开布局体验和交互结构，但不能复制该博主的真实文章、头像、图片、个人资料、私有配置或账号文案。
- 明确如果引入 Firefly 代码或组件设计，需要保留 Firefly 与 fuwari 的 MIT 版权声明和清晰致谢。
- 将 `.superpowers/` 和 `.tmp/` 加入 `.gitignore`，避免本地可视化伴随会话和 Firefly 调研仓库进入公开提交。
- 同步更新 `AGENTS.md`、项目专属 Skill、README 和 CHANGELOG，使项目规则指向当前 Firefly 重构设计规格。

### 验证情况

- 已读取 `AGENTS.md`、MikanArchive 项目专属 Skill、维护 Skill 和既有设计文档。
- 已浅克隆 `CuteLeaf/Firefly` 到本地临时目录并读取 README、LICENSE、配置、布局、导航、侧栏、友链和文章列表相关源码。
- 已确认 Firefly README 说明其为 Astro 静态博客主题，并提供壁纸模式、侧边栏、文章布局、Pagefind 搜索、主题色和亮暗色等能力。
- 已确认 Firefly LICENSE 为 MIT，并包含 `Copyright (c) 2024 saicaca` 与 `Copyright (c) 2025 CuteLeaf`。
- 已启动 brainstorming 可视化伴随服务，并输出 Firefly 重构幅度选项到本地页面。
- 曾尝试使用 Playwright CLI 抓取 fqzlr.com 首页和文章页截图；首次受全局 npm cache 权限影响失败，改用项目内 npm cache 后又因 PowerShell 执行策略和 CLI 参数版本差异未完成截图。本次为设计文档与规则同步，尚未修改应用代码或运行构建验证。

## 2026-06-27 00:44:34 +08:00

### 修改范围

- GitHub Pages 部署修复
- 子路径部署兼容
- README 使用说明补充
- 部署文档与日志同步

### 涉及文件

- `.github/workflows/pages.yml`
- `astro.config.mjs`
- `src/utils/paths.ts`
- `src/config/site.ts`
- `src/pages/_data.ts`
- `src/components/site/SiteNav.astro`
- `src/components/site/SiteFooter.astro`
- `src/components/home/HomeHero.astro`
- `src/components/home/RecentPosts.astro`
- `src/components/home/FeaturedResources.astro`
- `src/components/cards/FriendCard.astro`
- `src/layouts/PostLayout.astro`
- `src/pages/index.astro`
- `README.md`
- `CHANGELOG.md`
- `docs/deployment-cloudflare-pages.md`
- `development-log.md`

### 具体内容

- 新增 GitHub Pages Actions 工作流，使用 Node、npm、Astro 构建流程部署 `dist/`，替代 GitHub Pages 默认 Jekyll 构建。
- 确认线上失败根因为 GitHub Pages legacy 分支部署触发 `actions/jekyll-build-pages`，Jekyll 将 `.astro` 组件误当作 YAML frontmatter 解析。
- 将 `astro.config.mjs` 改为读取 `SITE_URL` 和 `BASE_PATH` 环境变量，GitHub Pages 工作流使用 `SITE_URL=https://dylanliiiii.github.io`、`BASE_PATH=/MikanArchive`。
- 新增 `src/utils/paths.ts`，统一处理站内链接和 `/assets/...` 公开资产路径，兼容 GitHub Pages 子路径部署。
- 更新导航、首页入口、文章链接、文章封面和友链头像等内部路径。
- 在 README 中补充本地使用步骤、GitHub Pages 部署说明和 Jekyll 报错原因。
- 在部署文档中补充 GitHub Pages 兼容部署、Pages Source 设置和故障排查说明。

### 验证情况

- 已运行 `gh run view 28251467753 --log-failed`，确认失败日志为 `Build with Jekyll` 和 `.astro` 文件 `Invalid YAML front matter`。
- 已在 `SITE_URL=https://dylanliiiii.github.io`、`BASE_PATH=/MikanArchive` 环境下运行 `npm.cmd run sync:content`、`npm.cmd run validate:content`、`npm.cmd run check` 和 `npm.cmd run build`，均通过，构建生成 7 个静态页面和 sitemap。
- 已运行 `npm.cmd ci --registry=https://registry.npmjs.org` 模拟 GitHub Actions 安装流程；首次因 Windows 本机 native `.node` 文件占用出现 EPERM，结束残留 Node 进程后重试通过。
- 已检查 `dist/` 中首页、文库、文章详情和友邻页面，确认站内链接、Astro 静态资源、文章封面和友链头像均带有 `/MikanArchive/` base path。
- 已运行 `npm.cmd audit --omit=dev --json`，生产依赖安全公告数量为 0。
- 已运行完整 `npm.cmd audit --json`，仍有 5 个 moderate dev 依赖公告，来源为 `@astrojs/check` 的 `@astrojs/language-server`/`volar-service-yaml`/`yaml-language-server` 链；不进入生产构建产物，且 npm 当前给出的修复方案是降级 `@astrojs/check`。
- 已通过 GitHub Pages API 将仓库 Pages `build_type` 从 `legacy` 切换为 `workflow`。
- 已运行 `gh run watch 28252393148 --exit-status`，新的 `pages build and deployment` workflow 成功，包含 build 和 deploy 两个 job。
- 已访问 `https://dylanliiiii.github.io/MikanArchive/`，返回 200，页面内容包含 `/MikanArchive/` base path。

## 2026-06-27 00:29:46 +08:00

### 修改范围

- Astro 依赖安全升级
- Tailwind 集成方式迁移
- Astro Content Layer 迁移
- Node 版本与部署文档同步

### 涉及文件

- `package.json`
- `package-lock.json`
- `.node-version`
- `astro.config.mjs`
- `postcss.config.mjs`
- `src/content.config.ts`
- `src/content/config.ts`
- `src/pages/_data.ts`
- `src/pages/posts/[...slug].astro`
- `README.md`
- `CHANGELOG.md`
- `docs/deployment-cloudflare-pages.md`
- `docs/superpowers/plans/2026-06-26-mikan-archive-implementation.md`
- `development-log.md`

### 具体内容

- 将 Astro 依赖栈升级到 Astro 7，包含 `@astrojs/mdx`、`@astrojs/react`、`@astrojs/sitemap` 和 `@astrojs/markdown-satteri` 的兼容版本。
- 移除已弃用且不兼容 Astro 6/7 的 `@astrojs/tailwind` 集成，新增 `postcss.config.mjs`，通过 Tailwind CSS v3 + PostCSS + Autoprefixer 继续处理全局样式。
- 新增 `.node-version` 并在 `package.json` 中声明 Node.js `>=22.12.0`、npm `>=9.6.5`，与 Astro 7 的运行要求保持一致。
- 将旧的 `src/content/config.ts` 迁移为 `src/content.config.ts`，使用 Astro Content Layer 的 `glob()` loader 加载文章和 profile Markdown。
- 将文章路由从旧 `post.slug` 改为 Content Layer entry 的 `post.id`，并将文章详情页从 `post.render()` 改为 `render(post)`。
- 同步 README、Cloudflare Pages 部署文档、CHANGELOG 和实现计划中的 Node 版本、依赖栈、Tailwind 集成和 Content Layer 示例。

### 验证情况

- 已运行 `npm.cmd install --registry=https://registry.npmjs.org`，通过并重新生成 `package-lock.json`；安装过程中曾出现旧 Rollup 临时目录清理 EPERM 警告，不影响最终依赖树。
- 已运行 `npm.cmd ls astro @astrojs/mdx @astrojs/react @astrojs/sitemap @astrojs/markdown-satteri @astrojs/tailwind tailwindcss postcss autoprefixer vite esbuild`，确认安装树使用 Astro 7.0.3、Vite 8.1.0、esbuild 0.28.1，且不再安装 `@astrojs/tailwind`。
- 已运行 `npm.cmd run sync:content`，通过。
- 已运行 `npm.cmd run validate:content`，通过，输出 `Content validation passed.`。
- 已运行 `npm.cmd run check`，通过，结果为 0 errors、0 warnings、0 hints。
- 已运行 `npm.cmd run build`，通过，生成 7 个静态页面和 sitemap。
- 已运行 `npm.cmd audit --omit=dev --json`，通过，安全公告数量为 0。
- 已启动本地预览并使用 `Invoke-WebRequest` 检查 `/`、`/posts/`、`/resources/`、`/friends/`、`/records/`、`/about/`、`/posts/2026-06-26-welcome-to-mikan-archive/`，均返回 200。

## 2026-06-26 23:42:22 +08:00

### 修改范围

- Astro 第一版站点实现
- 示例内容、内容同步与校验
- 页面组件、交互 islands 与视觉系统
- README、内容仓库、Cloudflare Pages 和维护文档
- GitHub 远端配置与推送尝试

### 涉及文件

- `package.json`
- `package-lock.json`
- `astro.config.mjs`
- `tailwind.config.mjs`
- `tsconfig.json`
- `.env.example`
- `.gitignore`
- `README.md`
- `CHANGELOG.md`
- `content.example/`
- `docs/content-repository.md`
- `docs/deployment-cloudflare-pages.md`
- `docs/maintenance.md`
- `docs/superpowers/specs/2026-06-26-mikan-archive-design.md`
- `docs/superpowers/plans/2026-06-26-mikan-archive-implementation.md`
- `scripts/sync-content.mjs`
- `scripts/validate-content.mjs`
- `src/`
- `development-log.md`

### 具体内容

- 初始化 Astro、MDX、React、Tailwind、Sitemap、TypeScript 和内容校验相关依赖与脚本。
- 新增 `content.example/` 公开示例内容，包含示例文章、资源收藏、友链、站点链接、个人资料、足迹记录和 SVG 示例资产。
- 新增内容同步脚本，支持 `content.example/`、本地私有内容目录、远程私有内容仓库，并自动识别内容根目录或外层 `content/` 目录。
- 新增内容校验脚本，校验文章 frontmatter、资源、友链、站点、时间线、更新记录和简历 JSON 的基础结构。
- 实现首页、文库、文章详情、收藏、友邻、足迹和我的页面，以及站点导航、页脚、卡片、首页区块、搜索弹窗、友链申请弹窗、日历和写作热力图。
- 建立轻二次元收藏馆风格的 Tailwind 视觉系统，保持粉、蓝、暖黄、薄荷绿和中性色的平衡，并让文章详情页保持克制阅读体验。
- 新增 README、内容仓库说明、Cloudflare Pages 部署说明和维护说明。
- 清理公开设计/计划/日志文档中的本机绝对路径示例，改用相对路径或泛化描述。
- 根据最终审查反馈，统一 `profile/resume.json` 的运行时 schema、校验脚本和内容仓库文档契约，避免真实内容接入时出现校验通过但构建失败。
- 配置 GitHub 远端 `https://github.com/Dylanliiiii/MikanArchive.git`，但推送因当前环境无法连接 GitHub 443 端口而未完成。

### 验证情况

- 已运行 `node --check scripts/sync-content.mjs`，通过。
- 已运行 `node --check scripts/validate-content.mjs`，通过。
- 已运行 `npm.cmd run sync:content`，通过，生成内容目录保持在 `.gitignore` 忽略范围内。
- 已运行 `npm.cmd run validate:content`，通过，输出 `Content validation passed.`。
- 已运行 `npm.cmd run check`，通过，结果为 0 errors、0 warnings、0 hints。
- 已运行 `npm.cmd run build`，通过，生成 7 个静态页面和 sitemap。
- 已在修复最终审查反馈后重新运行 `npm.cmd run validate:content`、`npm.cmd run check` 和 `npm.cmd run build`，均通过。
- 已运行 `npm.cmd audit --omit=dev --json`，发现 Astro 5.x 依赖链存在安全公告；修复需要跨到 Astro 6.4.6+，但当前 Tailwind 集成稳定版 peer 范围仍以 Astro 3-5 为主，本次未做破坏性依赖迁移，后续应单独评估升级。
- 已启动 `npm.cmd run preview -- --host 127.0.0.1 --port 4321`，并使用 `Invoke-WebRequest` 检查 `/`、`/posts/`、`/resources/`、`/friends/`、`/records/`、`/about/`、`/posts/2026-06-26-welcome-to-mikan-archive/` 均返回 200。
- 已检索 `dist/`，确认首页、导航、文章、搜索 island 和友链申请 island 进入构建产物，未发现 `未找到内容数据` 等构建错误残留。
- 曾尝试用 Playwright 做截图和点击式视觉验证，但 Chromium 浏览器二进制下载超时，未完成截图级视觉验证。
- 曾尝试 `git push -u origin main` 和 `git ls-remote origin`，均因当前环境连接 GitHub 失败而未完成远端推送。

## 2026-06-26 22:16:00 +08:00

### 修改范围

- 实现计划编写
- 项目规则一致性调整

### 涉及文件

- `AGENTS.md`
- `docs/superpowers/plans/2026-06-26-mikan-archive-implementation.md`
- `development-log.md`

### 具体内容

- 新增 MikanArchive 第一版实现计划，拆分为 Astro 项目初始化、示例内容与内容模型、内容同步与校验脚本、基础布局和视觉系统、页面与核心组件、README/部署文档、最终验证和 GitHub 准备七个任务。
- 在实现计划中明确私有内容仓库到 Astro 项目的同步映射：文章和 profile Markdown 同步到 `src/content/`，JSON 数据同步到 `src/data/content/`，公开资源同步到 `public/assets/`。
- 补全友链卡片、资源卡片、日历、热力图、搜索弹窗和友链申请弹窗的具体实现示例，减少后续执行时的歧义。
- 从 `AGENTS.md` 中移除本机绝对项目根目录说明，改为要求仓库文档使用相对路径，本地目录以实际克隆位置为准。

### 验证情况

- 已运行文本检索，检查实现计划中没有 `TBD`、`TODO`、旧 localhost 预览端口、旧 numbered workspace 路径、错误的 `src/dialogs` 路径或旧同步变量。
- 已运行文本检索，确认实现计划包含 `content.example`、`src/data/content`、`public/assets`、`src/content/posts`、Cloudflare Pages、项目导航和维护规则等关键内容。

## 2026-06-26 22:10:00 +08:00

### 修改范围

- 项目目录与协作规则初始化
- 项目专属 Skill 初始化
- 开发日志与更新日志规则初始化

### 涉及文件

- `AGENTS.md`
- `.agents/skills/mikan-archive-project/SKILL.md`
- `.agents/skills/mikan-archive-project/agents/openai.yaml`
- `.agents/skills/mikan-archive-maintenance/SKILL.md`
- `.agents/skills/mikan-archive-maintenance/agents/openai.yaml`
- `development-log.md`
- `CHANGELOG.md`
- `docs/superpowers/specs/2026-06-26-mikan-archive-design.md`
- `preview/blog-direction.html`

### 具体内容

- 将后续项目工作根目录调整为当前 `MikanArchive` 工作区；原临时工作区因当前进程占用无法直接重命名，已将现有设计文档和预览文件迁移到新目录。
- 新增 `AGENTS.md`，记录 MikanArchive 的默认语言、项目定位、第一版页面范围、内容分离规则、文档同步规则、开发记录规则、普通更新与提交规则。
- 新增 `mikan-archive-project` 项目专属 Skill，用于维护博客架构、内容模型、页面信息架构、视觉方向和内容分离约定。
- 新增 `mikan-archive-maintenance` 项目专属 Skill，用于维护开发日志、CHANGELOG、文档同步、普通提交、push、Cloudflare Pages 部署和版本判断流程。
- 新增 `development-log.md`，作为每次代码、文档、配置、规则或 Skill 修改的详细开发记录。
- 新增 `CHANGELOG.md`，作为面向开源用户和后续维护的概要更新记录。

### 验证情况

- 已参考既有项目的 `AGENTS.md`、`development-log.md` 和项目专属 Skill 结构，提取适合静态博客项目的维护规则。
- 已运行文本检索，确认 `AGENTS.md`、两个项目专属 Skill、`development-log.md` 和 `CHANGELOG.md` 均包含项目专属 Skill、日志、CHANGELOG、Cloudflare Pages 和导航规则的关键引用。
- 已运行轻量 frontmatter 校验，确认两个项目专属 Skill 都包含 `name` 和 `description` 字段。
- 曾尝试运行 skill-creator 的 `quick_validate.py`，但当前 Python 环境缺少 `yaml` 模块，未使用该脚本完成校验。
- 本次为项目规则、文档和项目专属 Skill 初始化，未运行应用构建或单元测试。
