# Development Log

## 2026-06-29 20:59:44 +08:00

### 修改范围

- 公开日历功能实现计划
- 下一步任务交接同步

### 涉及文件

- `docs/superpowers/plans/2026-06-29-mikan-public-calendar.md`
- `docs/next-tasks.md`
- `development-log.md`

### 具体内容

- 新增公开日历实现计划，拆分内容同步与校验、日历工具、页面路由、样式、文档、浏览器视觉验收和 push 步骤。
- 明确第一版不接入 Google Calendar，不提供前台创建/编辑入口，日程由公开内容文件维护。
- 在计划中补充公开节日示例和农历日标签实现要求，避免页面只展示普通事件列表。
- 同步 `docs/next-tasks.md`，将公开日历目标状态更新为进入实现执行中。

### 验证情况

- 已运行 `git status --short`，确认计划文件外无其他未提交改动。
- 已运行文本检索，确认现有 `src/styles/resources.css` 没有负字距规则，后续日历样式防溢出契约不会被旧样式误伤。
- 本次仅新增和更新计划、交接与日志文档，未改动应用代码，因此未运行应用测试或构建。

## 2026-06-29 21:18:15 +08:00

### 修改范围

- 公开日历功能实现
- 内容模型、同步与校验规则
- 导航、面包屑、页面、样式与文档同步

### 涉及文件

- `content.example/calendar/events.json`
- `scripts/sync-content.mjs`
- `scripts/validate-content.mjs`
- `src/data/mikan.ts`
- `src/utils/calendar-utils.ts`
- `src/pages/calendar.astro`
- `src/config/navBarConfig.ts`
- `src/utils/focused-breadcrumb.ts`
- `src/styles/resources.css`
- `tests/mikan-data.test.ts`
- `tests/calendar-utils.test.ts`
- `tests/mikan-pages.test.ts`
- `package.json`
- `package-lock.json`
- `README.md`
- `docs/content-repository.md`
- `docs/next-tasks.md`
- `CHANGELOG.md`
- `development-log.md`

### 具体内容

- 新增 `content.example/calendar/events.json`，用公开示例事件演示节日、纪念日、一次性日程、周重复、月重复和站点维护事件。
- 内容同步脚本新增 `calendar/ -> src/data/content/calendar/` 映射，内容校验脚本新增公开日历事件字段、时间范围、重复规则、颜色和 `visibility: "public"` 校验。
- `src/data/mikan.ts` 新增公开日历事件类型和 `getMikanCalendarEvents()` 数据读取。
- 新增 `src/utils/calendar-utils.ts`，支持日期格式化、农历日标签、事件实例展开、按日期聚合、月格生成、周起点、日/周时间轴位置计算和文章发布事件转换。
- “我的”下拉新增 `/calendar/` 日历入口，聚焦面包屑新增“主页 › 日历”。
- 新增 `/calendar/` 公开日历页，合并内容事件和文章发布事件，提供年 / 月 / 周 / 日视图；周视图和日视图使用 24 小时时间轴展示公开定时事件。
- 新增公开日历样式，包含三栏桌面布局、月格、年卡片、周 / 日时间轴、事件色彩、移动端单列和横向滚动防溢出规则。
- 更新 README、内容仓库说明、CHANGELOG 和下一步任务，记录公开日历数据路径、字段规则、验证命令和隐私边界。

### 验证情况

- 已运行 `npm.cmd run sync:content`，确认 `calendar -> src/data/content/calendar` 被同步。
- 已运行 `npm.cmd run validate:content`，内容校验通过。
- 已运行 `npm.cmd run test:content-model`，内容模型测试通过。
- 已运行 `npm.cmd run test:calendar`，日历工具测试通过。
- 已运行 `npm.cmd run test:pages`，页面契约测试通过。
- 全量 `check`、`build` 和浏览器视觉验收待后续收尾执行。

## 2026-06-29 20:39:48 +08:00

### 修改范围

- 公开日历功能方案设计
- 视觉伴随规则补充收尾
- CHANGELOG 与下一步交接同步

### 涉及文件

- `docs/superpowers/specs/2026-06-29-mikan-public-calendar-design.md`
- `docs/next-tasks.md`
- `CHANGELOG.md`
- `AGENTS.md`
- `.agents/skills/mikan-archive-project/SKILL.md`
- `development-log.md`

### 具体内容

- 根据用户确认，公开日历第一版不接入 Google Calendar，不做前台创建/编辑日程，不引入后台、数据库、登录或访客提交能力。
- 新增公开日历设计规格，确定 `/calendar/` 进入“我的”下拉，采用内容文件维护公开日程，支持年 / 月 / 周 / 日视图。
- 明确周视图和日视图使用 24 小时时间轴展示公开日程，但不支持拖拽、创建、编辑或删除。
- 记录 fqzlr/my-blog 公开日历实现的参考结论：可借鉴节日预生成、农历换算、事件聚合和月视图，但其本身不包含多视图或前台创建能力。
- 同步 `docs/next-tasks.md`，把下一步记录为等待用户审阅公开日历设计规格。
- 同步 CHANGELOG，并补充本轮已完成的视觉伴随默认规则文档更新。

### 验证情况

- 已运行文本检索，确认公开日历规格未包含 `TBD` 或 `TODO`；Google 同步、前台创建等相关表述均用于“不接入 / 不做范围”的边界说明。
- 已运行文本检索，确认 `AGENTS.md` 与项目专属 Skill 均包含“视觉伴随”和“视觉对比”的默认启用规则。
- 本次仅新增和更新设计、规则、交接与日志文档，未改动应用代码，因此未运行应用测试或构建。

## 2026-06-29 19:44:54 +08:00

### 修改范围

- 项目视觉伴随默认规则补充
- 项目专属 Skill 规则同步

### 涉及文件

- `AGENTS.md`
- `.agents/skills/mikan-archive-project/SKILL.md`
- `development-log.md`

### 具体内容

- 将原“浏览器视觉对比默认启用”规则扩展为“浏览器视觉伴随和浏览器视觉对比默认启用”。
- 明确视觉伴随覆盖方案讨论、低保真 mockup、布局方向对比和视觉细节确认，视觉对比覆盖实现前后对照与桌面 / 移动端验收。
- 补充当前工具环境无法启动视觉伴随或浏览器检查时的降级说明。
- 同步项目专属 Skill，避免后续 UI、布局、样式和交互任务再次误以为需要重复确认是否启用视觉伴随。

### 验证情况

- 已运行文本检索，确认 `AGENTS.md` 与项目专属 Skill 均包含“视觉伴随”和“视觉对比”的默认启用规则。
- 本次仅修改项目规则文档和开发日志，未改动应用代码，因此未运行应用测试或构建。

## 2026-06-29 18:54:14 +08:00

### 修改范围

- 新增站点概览功能页
- “我的”下拉与页脚公开入口调整
- 站点统计口径统一
- 项目规则、README、CHANGELOG、设计说明和交接文档同步

### 涉及文件

- `src/pages/site.astro`
- `src/config/navBarConfig.ts`
- `src/config/profileConfig.ts`
- `src/components/layout/Footer.astro`
- `src/components/widget/SiteStats.astro`
- `src/styles/resources.css`
- `src/utils/focused-breadcrumb.ts`
- `tests/mikan-pages.test.ts`
- `README.md`
- `AGENTS.md`
- `.agents/skills/mikan-archive-project/SKILL.md`
- `docs/next-tasks.md`
- `docs/superpowers/specs/2026-06-27-mikan-archive-firefly-rebuild-design.md`
- `docs/superpowers/specs/2026-06-27-mikan-archive-focused-content-layout-design.md`
- `docs/superpowers/specs/2026-06-29-mikan-site-overview-design.md`
- `docs/superpowers/plans/2026-06-29-mikan-site-overview.md`
- `CHANGELOG.md`
- `development-log.md`

### 具体内容

- 新增 `/site/` 站点概览页，使用聚焦内容布局展示运行统计、站点信息、构建信息和相关入口。
- 将“我的”下拉调整为“个人介绍 / 站点概览”，移除下拉中的 GitHub 和 RSS。
- 将用户提供的 GitHub 与 B 站公开链接写入 `profileConfig`，并在页脚与站点概览页展示；页脚同时保留 RSS。
- 页脚新增“已运行 X 天”和“最后更新于 X 天前”状态。
- 站点统计组件移除重复的“标签”统计，只保留以文章标签为口径的“分类标签”统计。
- 新增页面契约测试覆盖站点概览、导航、页脚状态和统计口径。
- 同步 README、AGENTS、项目专属 Skill、正式设计规格、CHANGELOG 与本次实施计划。

### 验证情况

- TDD 红灯：运行 `npm.cmd run test:pages`，45 个页面契约中 5 个失败，失败点为 `/site/` 页面不存在、“我的”下拉仍有 GitHub/RSS、页脚缺少公开入口和运行状态、站点统计仍同时使用分类和标签。
- 已运行 `npm.cmd run test:pages`，45/45 通过。
- 已运行 `npm.cmd run test:content-model`，6/6 通过。
- 已运行 `npm.cmd run test:archive`，6/6 通过。
- 已运行 `npm.cmd run check`，结果为 165 个文件、0 errors、0 warnings，仅保留既有 `src/components/widget/Calendar.astro` 未读参数 hint。
- 已运行完整验证链：`npm.cmd run sync:content`、`npm.cmd run validate:content`、`npm.cmd run test:content-model`、`npm.cmd run test:archive`、`npm.cmd run test:pages`、`npm.cmd run check`、`npm.cmd run build`，全部退出码为 0。
- `npm.cmd run build` 构建成功并生成 15 个页面，包含 `/site/index.html`；保留既有 Vite dynamic import、chunk size、路由优先级、Markdown deprecation、Pagefind 中文 stemming 和 npm 新版本提示。
- 使用系统 Chrome + Playwright 检查 `http://127.0.0.1:4321/site/` 的 1440×900 桌面端和 390×844 移动端，以及 `http://127.0.0.1:4321/` 的桌面端页脚与“我的”下拉：站点概览内容、页脚 GitHub/B站/RSS、已运行天数、最后更新时间均可见，“我的”下拉只包含个人介绍和站点概览，所有检查视口均无横向溢出。
- 浏览器检查控制台仅记录开发环境 Vite/Pagefind 信息和既有 favicon 404；截图已保存到已忽略目录 `output/playwright/site-overview-desktop.png`、`output/playwright/site-overview-mobile.png`、`output/playwright/home-footer-menu-desktop.png`。

## 2026-06-29 18:10:23 +08:00

### 修改范围

- 删除独立足迹功能页
- 顶部导航与首页入口调整
- `/about/` 展示名称改为“个人介绍”
- 项目规则、设计说明、README、CHANGELOG 和交接文档同步

### 涉及文件

- `src/config/navBarConfig.ts`
- `src/pages/index.astro`
- `src/pages/about.astro`
- `src/pages/records/index.astro`
- `src/utils/focused-breadcrumb.ts`
- `src/config/siteConfig.ts`
- `src/config/profileConfig.ts`
- `src/config/backgroundWallpaper.ts`
- `content.example/profile/about.md`
- `content.example/posts/2026-06-26-welcome-to-mikan-archive.md`
- `content.example/assets/images/welcome-cover.svg`
- `content.example/records/timeline.json`
- `content.example/records/updates.json`
- `tests/mikan-pages.test.ts`
- `README.md`
- `AGENTS.md`
- `.agents/skills/mikan-archive-project/SKILL.md`
- `docs/content-repository.md`
- `docs/next-tasks.md`
- `docs/superpowers/plans/2026-06-26-mikan-archive-implementation.md`
- `docs/superpowers/plans/2026-06-27-mikan-archive-firefly-rebuild.md`
- `docs/superpowers/plans/2026-06-27-mikan-archive-focused-content-layout.md`
- `docs/superpowers/specs/2026-06-26-mikan-archive-design.md`
- `docs/superpowers/specs/2026-06-27-mikan-archive-firefly-rebuild-design.md`
- `docs/superpowers/specs/2026-06-27-mikan-archive-focused-content-layout-design.md`
- `CHANGELOG.md`
- `development-log.md`

### 具体内容

- 先为“足迹功能页和入口已删除”与“我的下拉和关于页标题改为个人介绍”新增页面契约测试，确认当前代码仍保留 `/records/` 页面、`足迹` 导航和旧“我的/关于我”文案时测试失败。
- 删除 `src/pages/records/index.astro`，移除导航中的 `LinkPresets.Records` 和面包屑 `/records/` 映射。
- 将 `/about/` 页面标题、导航下拉子项、面包屑和公开示例 `profile/about.md` 标题统一改为“个人介绍”。
- 将首页原“足迹”卡片改为“个人介绍”预览，并移除首页对 `getMikanTimeline` 和 `getMikanUpdates` 的读取。
- 同步站点描述、首页打字机文案、示例文章和封面 SVG 中仍会暴露给访客的“足迹”措辞。
- 同步 README、AGENTS、项目专属 Skill、内容仓库说明、正式设计规格、历史实现计划、CHANGELOG 与交接文档，明确当前第一版不再提供独立足迹功能页；`records/` 数据仅作为可选历史记录数据源保留。

### 验证情况

- TDD 红灯：运行 `npm.cmd run test:pages`，42 个页面契约中 3 个失败，失败点为 `/records/` 页面仍存在、导航仍有“足迹”、`/about/` 仍未显示为“个人介绍”。
- TDD 红灯补充：为 `Key.about` 的中文翻译新增“个人介绍 / 個人介紹”契约后运行 `npm.cmd run test:pages`，42 个页面契约中 1 个失败，失败点为简体中文仍显示“关于我”。
- 已运行 `npm.cmd run sync:content`，内容同步成功。
- 已运行 `npm.cmd run validate:content`，内容校验通过。
- 已运行 `npm.cmd run test:content-model`，6/6 通过。
- 已运行 `npm.cmd run test:archive`，6/6 通过。
- 已运行 `npm.cmd run test:pages`，42/42 通过。
- 已运行 `npm.cmd run check`，结果为 164 个文件、0 errors、0 warnings，仅保留既有 `src/components/widget/Calendar.astro` 未读参数 hint。
- 已运行 `npm.cmd run build`，构建成功并生成 14 个页面；保留既有 Vite dynamic import、chunk size、路由优先级、Markdown deprecation、Pagefind 中文 stemming 和 npm 新版本提示。
- 使用系统 Chrome DevTools Protocol 检查 `http://127.0.0.1:4321/` 与 `/about/` 的 1440×900 桌面端和 390×844 移动端：导航和页面中均无 `/records/` 链接或“足迹”入口，`/about/` H1 和面包屑均为“个人介绍”，所有检查视口均无横向溢出。
- 浏览器检查确认 `/records/` 返回 404 页面；控制台仅记录既有 favicon 404 和主动访问 `/records/` 的预期 404。截图已保存到已忽略目录 `output/playwright/home-no-records-desktop.png`、`output/playwright/home-my-menu-desktop.png`、`output/playwright/about-profile-desktop.png`、`output/playwright/home-no-records-mobile.png`、`output/playwright/about-profile-mobile.png`。

## 2026-06-29 17:29:25 +08:00

### 修改范围

- 文章总列表无封面长条卡片
- `/posts/` 整条文章卡片可点击
- 页面契约测试、设计说明、README、CHANGELOG 和交接文档同步

### 涉及文件

- `src/pages/posts/index.astro`
- `src/styles/resources.css`
- `tests/mikan-pages.test.ts`
- `README.md`
- `CHANGELOG.md`
- `docs/next-tasks.md`
- `docs/superpowers/specs/2026-06-27-mikan-archive-firefly-rebuild-design.md`
- `docs/superpowers/specs/2026-06-27-mikan-archive-focused-content-layout-design.md`
- `development-log.md`

### 具体内容

- 接续 `docs/next-tasks.md` 中“文章总列表卡片改为无封面整条可点击”的未完成任务，确认上一轮卡在已新增测试但页面仍使用 `PostCard` 的红灯阶段。
- 将 `/posts/` 文章分组列表从 `PostCard` 替换为无封面的 `article-strip-card` 长条链接，移除总列表对 `entry.data.image` 的传入与封面展示依赖。
- 长条卡片展示标题、发布日期、更新时间、兼容分类、摘要、标签、置顶和草稿状态，并让整张卡片作为进入文章详情的链接。
- 新增长条卡片桌面和移动端样式，保留分类标签筛选与分组结构，避免小屏文字和右侧入口挤压。
- 同步页面契约测试、README、CHANGELOG 与两份正式设计规格，明确 `/posts/` 总列表不展示封面图。

### 验证情况

- TDD 红灯：接手后运行 `npm.cmd run test:pages`，41 个页面契约中 1 个失败，失败点为 `/posts/` 仍导入并使用 `PostCard`。
- 已运行 `npm.cmd run test:archive`，6/6 通过。
- 已运行 `npm.cmd run test:content-model`，6/6 通过。
- 已运行 `npm.cmd run test:pages`，41/41 通过。
- 已运行 `npm.cmd run build`，构建成功并生成 15 个页面；保留既有 Vite dynamic import、chunk size、路由优先级、Markdown deprecation 和 Pagefind 中文 stemming 提示。
- 并行运行 `npm.cmd run check` 与 `npm.cmd run build` 时，`check` 曾因两边同时执行 `sync:content` 删除同一生成目录而出现 `EPERM: operation not permitted, rmdir 'src/content/profile'`；随后顺序重跑 `npm.cmd run check` 通过，结果为 165 个文件、0 errors、0 warnings，仅保留既有 `src/components/widget/Calendar.astro` 未读参数 hint。
- Playwright 使用系统 Chrome 检查 `http://127.0.0.1:4321/posts/` 的 1440×900 桌面端和 390×844 移动端：确认 `.article-strip-card` 共 6 条、旧 `.post-card-wrapper` / `.post-card-image` 为 0、文章页内图片为 0、首条卡片整条链接指向文章详情，桌面和移动端均无横向溢出。
- 浏览器控制台仅记录既有 favicon 404；已保存截图到已忽略目录 `output/playwright/posts-desktop.png` 和 `output/playwright/posts-mobile.png`。

## 2026-06-29 16:11:09 +08:00

### 修改范围

- 文库文章页标题与分组展示调整
- 独立标签页删除与文库下拉精简
- 分类页改为分类标签扇形统计图
- 分类标签语义、文档和项目规则同步

### 涉及文件

- `src/pages/posts/index.astro`
- `src/pages/categories/index.astro`
- `src/pages/tags/index.astro`
- `src/styles/resources.css`
- `src/config/navBarConfig.ts`
- `src/utils/focused-breadcrumb.ts`
- `src/components/widget/Categories.astro`
- `src/components/widget/Tags.astro`
- `src/i18n/languages/*.ts`
- `tests/mikan-pages.test.ts`
- `README.md`
- `AGENTS.md`
- `.agents/skills/mikan-archive-project/SKILL.md`
- `docs/content-repository.md`
- `docs/superpowers/specs/2026-06-27-mikan-archive-firefly-rebuild-design.md`
- `docs/superpowers/specs/2026-06-27-mikan-archive-focused-content-layout-design.md`
- `docs/next-tasks.md`
- `CHANGELOG.md`
- `development-log.md`

### 具体内容

- 将文库下拉从“文章 / 归档 / 分类 / 标签”调整为“文章 / 归档 / 分类标签”，移除独立标签入口和 `/tags/` 页面。
- 将 `/posts/` 页面首屏标题改为“文章”，新增工具导航同款分类标签筛选条，并按文章标签分组展示文章卡片。
- 将 `/categories/` 改为“分类标签”统计页，使用基于文章标签的扇形图、标签引导线、右侧篇数清单和 hover/focus 联动动效替换旧分类卡片。
- 让首页侧栏分类组件改用文章标签统计，保持“分类标签”口径一致；文章旧 `category` 字段和归档分类查询继续作为兼容能力保留。
- 同步 README、AGENTS、项目专属 Skill、内容仓库说明、正式设计规格、CHANGELOG 与多语言基础文案。

### 验证情况

- TDD 红灯：新增页面契约后首次运行 `npm.cmd run test:pages` 按预期失败，覆盖旧导航仍含标签入口、`/tags/` 仍存在、文章页仍显示“文库”、分类页仍为旧卡片布局。
- 已运行 `npm.cmd run test:pages`，40/40 通过。
- 已运行 `npm.cmd run test:content-model`，6/6 通过。
- 已运行 `npm.cmd run test:archive`，6/6 通过。
- 已运行 `npm.cmd run check`，0 errors、0 warnings，仅保留既有 `src/components/widget/Calendar.astro` 未读参数 hint。
- 已按顺序运行 `npm.cmd run sync:content`、`npm.cmd run validate:content`、`npm.cmd run test:archive`、`npm.cmd run test:content-model`、`npm.cmd run test:pages`、`npm.cmd run check`、`npm.cmd run build`，全部退出码为 0；构建生成 15 个页面，`/tags/` 不再生成。
- Playwright CLI 检查 `http://127.0.0.1:4321/posts/` 和 `http://127.0.0.1:4321/categories/` 的桌面与 390×844 移动端；确认文库下拉为“文章 / 归档 / 分类标签”，文章页标题为“文章”，分类标签页扇形图和篇数清单可见，两个页面移动端均无横向溢出，控制台无新增 error。
- 已保存视觉验收截图到已忽略目录 `output/playwright/posts-desktop.png`、`output/playwright/categories-desktop.png`、`output/playwright/posts-mobile.png`、`output/playwright/categories-mobile.png`。

## 2026-06-29 15:28:43 +08:00

### 修改范围

- 归档页 GitHub 贡献热力图布局微调
- 顶部导航与下拉菜单图标显示修复
- 页面契约测试与浏览器视觉验收

### 涉及文件

- `src/components/controls/ArchivePanel.svelte`
- `src/components/layout/DropdownMenu.astro`
- `src/components/layout/NavMenuPanel.astro`
- `src/styles/navbar.css`
- `tests/mikan-pages.test.ts`
- `development-log.md`

### 具体内容

- 将 GitHub 贡献热力图从“只按当前已发生月份计算边界”调整为完整年度网格，始终展示 1–12 月，让桌面端在卡片内居中铺开，减少右侧空白。
- 保留移动端横向滚动，并在小屏下从左侧 1 月开始显示，避免首屏只露出中间月份。
- 移除旧的 `githubMonthBoundaries` 与 `buildGithubMonthBoundaries` 逻辑，修复浏览器运行时残留调用导致的 Svelte 错误。
- 为桌面主导航、下拉菜单项和移动菜单项增加固定尺寸图标类，移除 1280px 以下隐藏 `.navbar-icon` 的规则，使“主页 / 文库 / 收藏 / 联系我 / 足迹 / 我的”和下拉项前均稳定显示对应小图标。
- 新增页面契约测试，覆盖年度 12 月 GitHub 热力图布局、移动端左起滚动、旧边界函数不再残留，以及导航图标不再被隐藏。

### 验证情况

- TDD 红灯：新增 `test:pages` 页面契约后，首次运行按预期失败，暴露 GitHub 热力图仍使用旧月份边界、导航图标仍可被隐藏。
- 绿灯验证已运行 `npm.cmd run test:pages`，35/35 通过。
- 已运行 `npm.cmd run test:archive`，6/6 通过。
- 已运行 `npm.cmd run check`，结果为 166 个文件、0 errors、0 warnings，仅保留既有 `src/components/widget/Calendar.astro` 未读参数 hint。
- 已运行 `npm.cmd run build`，构建成功并生成 16 个页面；仍保留既有 Vite 动态导入、大 chunk、路由优先级、Markdown deprecation 和 Pagefind 中文 stemming 提示，本次没有新增构建失败。
- Playwright CLI 使用项目内 `.npm-cache` 打开 `http://127.0.0.1:4321/archive/`，确认桌面端导航图标可见，GitHub 贡献热力图在卡片内铺开且不再挤在左侧；生成截图 `output/playwright/archive-desktop.png`。
- Playwright CLI 以 390×844 视口检查移动端，生成 `output/playwright/archive-mobile.png`，并确认 `innerWidth=390`、`scrollWidth=390`、`overflow=false`。
- 浏览器控制台中本次引入的 `buildGithubMonthBoundaries is not defined` 运行时错误已修复；当前仅剩既有 `/favicon/favicon.ico` 404 与开发模式 Pagefind mock 日志。

## 2026-06-29 12:08:52 +08:00

### 修改范围

- 归档页 GitHub 贡献热力图与周度文章分布双面板
- 周度文章热力图固定色阶阈值
- 聚焦页面面包屑与功能页直达路径
- 收藏总览移除与收藏导航精简
- README、AGENTS、项目专属 Skill、设计规格、CHANGELOG 与交接文档同步

### 涉及文件

- `src/utils/archive-utils.ts`
- `src/components/controls/ArchivePanel.svelte`
- `src/pages/archive.astro`
- `src/pages/index.astro`
- `src/pages/resources/index.astro`
- `src/config/navBarConfig.ts`
- `src/config/siteConfig.ts`
- `src/types/siteConfig.ts`
- `src/layouts/ContentGridLayout.astro`
- `src/components/layout/FocusedBreadcrumb.astro`
- `src/utils/focused-breadcrumb.ts`
- `tests/archive-utils.test.ts`
- `tests/mikan-pages.test.ts`
- `README.md`
- `AGENTS.md`
- `.agents/skills/mikan-archive-project/SKILL.md`
- `CHANGELOG.md`
- `docs/superpowers/specs/2026-06-29-mikan-article-archive-design.md`
- `docs/superpowers/specs/2026-06-27-mikan-archive-focused-content-layout-design.md`
- `docs/superpowers/specs/2026-06-27-mikan-archive-firefly-rebuild-design.md`
- `docs/next-tasks.md`
- `development-log.md`

### 具体内容

- 将 `/archive/` 活动区从单个周度文章热力图改为左右双面板：左侧展示配置用户 `Dylanliiiii` 的 GitHub 贡献热力图并链接到 GitHub 主页，右侧展示当前标签/分类筛选下的周度文章分布。
- GitHub 贡献数据使用公开贡献接口在客户端加载，失败时保留卡片提示与 GitHub 主页链接，不需要 token，也不影响文章归档时间线。
- 将周度文章热力图色阶改为固定阈值：0 篇为空，1–2 篇浅色，3–4 篇中浅色，5 篇较深色，6 篇及以上才是最高色阶，避免示例 1 篇文章显示成最深色。
- 新增 `FocusedBreadcrumb` 与 `focused-breadcrumb.ts`，在聚焦布局中显示“主页 › 当前功能页”；友链、留言、工具导航、摘录收藏等下拉子功能直接从主页指向自身，不经过“联系我”或“收藏”空父级。
- 从顶部“收藏”下拉中移除“收藏总览”，只保留“工具导航”和“摘录收藏”；`/resources/` 保留为兼容跳转到 `/resources/tools/`，首页精选收藏“全部”也改为直达工具导航。
- 同步更新 README、AGENTS、项目专属 Skill、归档规格、聚焦布局规格、Firefly 重构规格和 CHANGELOG，使当前信息架构不再描述收藏总览功能页。

### 验证情况

- TDD 红灯：新增归档工具测试后，`test:archive` 首次因缺少 `getArchiveActivityLevel` 导出失败；新增页面契约后，`test:pages` 按预期暴露收藏总览仍存在、面包屑组件缺失、归档未连接 GitHub 的失败。
- 绿灯验证已运行 `npm.cmd run test:archive`，6/6 通过。
- 绿灯验证已运行 `npm.cmd run test:pages`，32/32 通过。
- 完整自动验证已运行 `npm.cmd run sync:content`、`validate:content`、`test:archive`、`test:content-model`、`test:pages`、`check` 和 `build`，最终全部退出码为 0。
- `test:archive` 为 6/6 通过；`test:content-model` 为 6/6 通过；`test:pages` 为 33/33 通过。
- `astro check` 结果为 166 个文件、0 errors、0 warnings，仅保留既有 `Calendar.astro` 未读参数 hint。
- 生产构建生成 16 个页面，Pagefind 索引完成；仍保留既有 Vite 动态导入、大 chunk、路由优先级、Markdown deprecation 和中文 stemming 提示，本次没有新增构建失败。
- Playwright CLI 使用项目内 `.npm-cache` 生成桌面和 390px 移动端截图；桌面确认 `/archive/` 左 GitHub 贡献热力图、右文章分布热力图并排显示，移动端确认双面板上下堆叠且内容可横向滚动。
- Playwright 截图确认 `/resources/tools/` 面包屑为“主页 › 工具导航”，没有经过“收藏”父级；HTTP 检查确认 `/archive/`、`/resources/tools/`、`/resources/clips/`、`/guestbook/`、`/friends/`、`/resources/` 均返回 200 且包含聚焦面包屑。
- 浏览器检查期间首次 `npm exec --package playwright` 因系统 npm cache 权限失败；改用项目内 `.npm-cache` 后成功完成截图。`/resources/` 初版 Astro redirect 曾导致 Pagefind 无 `<html>` 提示，已改为极薄兼容跳转页并重新构建通过。

## 2026-06-29 11:01:00 +08:00

### 修改范围

- 文章归档活动热力图
- URL 标签筛选与既有分类查询兼容
- 年/月/文章连续时间线与三级统计
- 归档数据测试、页面契约、响应式与构建验收

### 涉及文件

- `src/utils/archive-utils.ts`
- `src/components/controls/ArchivePanel.svelte`
- `src/pages/archive.astro`
- `tests/archive-utils.test.ts`
- `tests/mikan-pages.test.ts`
- `package.json`
- `CHANGELOG.md`
- `docs/superpowers/specs/2026-06-29-mikan-article-archive-design.md`
- `docs/superpowers/plans/2026-06-29-mikan-article-archive.md`
- `docs/next-tasks.md`
- `development-log.md`

### 具体内容

- 新增归档纯数据 helper，负责标签数量汇总、单标签筛选、既有分类/未分类查询兼容、年月分组、总文章数、覆盖年份数和基于 `updated ?? published` 的文章活动热力图。
- 将 `/archive/` 改为可见标签下拉、文章活动热力图、结果摘要和年/月/文章三层连续时间线；标签选择写入 `?tag=`，刷新和分享链接可恢复。
- 热力图使用 12 月 × 4 时间段网格、0 至 4 级色阶、中文单元说明、年份切换和少到多图例；筛选后热力图与时间线共同更新。
- 汇总区显示“文章数 · 覆盖年份数”，年份与月份标题分别显示对应文章数量；文章行显示日期、主要标签和标题。
- 时间线使用静态虚线表达完整层级，文章 hover/focus 时计算单条圆角 SVG 路径，从年份节点经过月份节点连接文章节点。
- 增加未知标签空状态和“查看全部文章”恢复入口；390px 视口中页面不横向溢出，热力图在自身区域滚动。
- 保留 `/archive/?category=` 与 `/archive/?uncategorized=1` 的既有入口，修复 Svelte 模板辅助函数无法追踪分类显示状态的问题，分类筛选同样联动热力图、统计和时间线。
- 移除聚焦布局中已经无效的横幅标题修改脚本，并移除筛选菜单非交互容器上的点击拦截，清理 Svelte 无障碍警告。
- README 对文库归档的现有概述仍准确；本次不改变导航、内容模型、示例内容、部署命令、环境变量、AGENTS 或项目专属 Skill，无需同步这些文件。

### 验证情况

- 基线验证：内容模型 6/6、页面契约 24/24 通过，`astro check` 为 0 errors，仅保留既有 `Calendar.astro` 未读参数 hint。
- TDD 数据红灯：`tests/archive-utils.test.ts` 首次因 `archive-utils.ts` 不存在失败；最小实现后 4/4 通过，加入分类兼容回归后按预期 1 项失败、修复后最终 5/5 通过。
- TDD 页面红灯：新增归档结构测试后为旧测试 24 项通过、新测试 2 项按预期失败；实现后转绿。分类查询、菜单无障碍和 Svelte 派生状态问题均先添加失败契约再修复，最终页面测试 29/29 通过。
- 完整自动验证已按顺序运行 `npm.cmd run sync:content`、`validate:content`、`test:archive`、`test:content-model`、`test:pages`、`check` 和 `build`，全部退出码为 0。
- `astro check` 最终结果为 164 个文件、0 errors、0 warnings、1 个既有 hint；生产构建生成 16 个页面和 `/archive/index.html`，Pagefind 索引完成。
- 构建仍保留既有动态导入、大 chunk、路由优先级、Markdown deprecation 和中文 stemming 提示，本次没有新增构建失败或类型错误。
- 应用内浏览器桌面验收：默认热力图为 48 格，标签菜单显示全部及标签数量；选择 `Astro` 后 URL 变为 `?tag=Astro`，热力图、总计、年份、月份和文章同步，刷新后状态恢复。
- 未知标签验收：显示 0 篇文章、0 年、热力图空状态和恢复按钮；点击后恢复全部文章。既有 `?category=教程` 显示“分类 / 教程”，`?uncategorized=1` 显示“分类 / 未分类”。
- 移动端约 390×844 验收：页面级横向溢出为 0，热力图容器宽 302px、内部滚动宽 504px，筛选菜单完整落在 375px 客户区内，三级数量保留。
- 亮暗色模式的计算样式均使用现有变量；最终浏览器控制台无错误或警告。开发服务热更新期间曾出现一次 Astro `astro:server-app.js` 全量重载错误，重启 dev daemon 后路由均返回 200，不影响生产构建。
- 浏览器 DOM 与自动契约确认文章链接具备 mouseenter/mouseleave/focus/blur 连续路径入口；应用内浏览器的鼠标移动和 Tab 注入没有触发可观察的 hover/focus 状态，因此没有把连续高亮视觉记为直接实测，保留为源码、类型检查和契约测试验证项。
- 已创建数据 helper 提交 `4f3d2f5`、归档界面提交 `0d7dffc`、分类兼容修复提交 `daa5502` 和文档提交 `03de3dd`，并成功推送到 `origin/codex/firefly-rebuild`。
- 本次目标已完成验证、记录、提交和 push，`docs/next-tasks.md` 已清空当前目标，只保留文档使用规则。

## 2026-06-29 10:24:29 +08:00

### 修改范围

- 文章归档热力图与标签时间线实施计划
- 跨会话执行步骤同步

### 涉及文件

- `docs/superpowers/plans/2026-06-29-mikan-article-archive.md`
- `docs/next-tasks.md`
- `development-log.md`

### 具体内容

- 将已确认规格拆分为归档数据 helper、页面契约、Svelte 交互、文档同步与完整验收四个任务。
- 明确每个任务的失败测试、预期红灯、最小实现、绿灯命令、提交边界和浏览器验收视口。
- 固定新增 `src/utils/archive-utils.ts` 与 `tests/archive-utils.test.ts` 的职责，避免标签、统计、年月分组和热力图计算继续堆积在界面组件中。
- 当前会话按 inline execution 执行，不启用未获用户明确要求的子代理。

### 验证情况

- 已对照设计规格完成计划自审，覆盖标签 URL 状态、筛选联动、活动日期回退、三级数量、连续高亮路径、空状态、响应式、可访问性和完整验证。
- 已扫描并清除计划中的占位项和模糊变更位置，检查类型名、函数签名与后续使用保持一致。
- 本次只编写实施计划，尚未修改生产代码或测试代码；正式红绿灯从下一任务开始记录。

## 2026-06-29 10:16:43 +08:00

### 修改范围

- 文章归档热力图、标签筛选与连续时间线设计
- 归档统计数量与跨会话实施交接

### 涉及文件

- `docs/superpowers/specs/2026-06-29-mikan-article-archive-design.md`
- `docs/next-tasks.md`
- `development-log.md`

### 具体内容

- 根据用户提供的公开参考站、开源仓库和截图，确定 `/archive/` 使用“标签筛选 + 文章活动热力图 + 年/月/文章连续时间线”的结构。
- 明确筛选后热力图同步更新，活动日期使用 `updated ?? published`，时间线仍按发布时间归档。
- 补充当前结果“文章数 · 覆盖年份数”、每年文章数和每月文章数三级统计。
- 选择单个 Svelte 归档组件管理筛选与视图状态，纯标签、分组和热力图计算拆入可测试的 TypeScript 模块。
- 记录后续 TDD、完整验证、浏览器视觉验收、提交和 push 步骤。
- 本次只新增设计与交接文档，尚未修改生产代码；不影响导航、内容模型、部署命令、环境变量、README、AGENTS、项目专属 Skill 或示例内容。

### 验证情况

- 已对照当前 `/archive/`、`ArchivePanel.svelte`、文章内容工具、现有页面测试、正式布局设计和参考仓库归档源码完成现状检查。
- 已在应用内浏览器检查参考站的文章热力图、年/月/文章层级、筛选入口和数量展示，并检查用户提供的三张截图。
- 已完成规格自审：没有 `TBD`、`TODO`、范围冲突或未决实现项；筛选联动、日期口径、统计口径、空状态、响应式、可访问性和验证标准均已明确。
- 本次为设计文档更新，未运行代码测试；实施阶段将按规格运行完整项目验证和浏览器验收。

## 2026-06-28 22:47:00 +08:00

### 修改范围

- 友链申请说明文档弹窗
- 友链页标题区申请入口
- 留言页职责精简
- 页面契约测试与响应式验收

### 涉及文件

- `src/components/pages/FriendApplyDialog.astro`
- `src/pages/friends.astro`
- `src/pages/guestbook.astro`
- `tests/mikan-pages.test.ts`
- `docs/superpowers/specs/2026-06-28-mikan-friends-page-refinement-design.md`
- `docs/superpowers/plans/2026-06-28-mikan-friend-application-dialog.md`
- `docs/next-tasks.md`
- `development-log.md`

### 具体内容

- 在友链页标题区右侧新增“如何申请友链”按钮，移动端自动换行到标题说明下方。
- 新增原生 `<dialog>` 文档弹窗，复用既有 `friends.mdx` 申请格式；支持关闭按钮、点击遮罩关闭、焦点返回和弹窗内部滚动，并为后续切换独立文档或外部链接保留稳定入口。
- 删除友链页底部内联申请说明，避免同一页重复展示入口与正文。
- 从留言页删除“友链申请”说明卡和“查看友链说明”链接，仅保留随手留言、私密信息及评论系统状态说明。
- 新增两项页面契约测试，覆盖友链页弹窗职责和留言页不再承载友链申请入口。
- 本次不改变内容模型、部署流程或公开使用方式，无需同步 README、AGENTS、项目专属 Skill、示例内容和 CHANGELOG。

### 验证情况

- TDD 红灯：`npm.cmd run test:pages` 为 22 项通过、2 项按预期失败；实现后为 24 项通过、0 项失败。
- 已运行 `npm.cmd run sync:content`、`npm.cmd run validate:content`、`npm.cmd run test:content-model`、`npm.cmd run test:pages`、`npm.cmd run check` 和 `npm.cmd run build`，最终均通过；`check` 为 0 errors，保留既有 `Calendar.astro` 未读参数 hint。
- 第一轮并行验证时，`check` 与 `build` 同时执行内容同步，`check` 因临时目录占用出现一次 `EPERM`；改为独立串行重跑后通过，确认不是代码错误。
- 应用内浏览器桌面验收：按钮位于友链标题区右侧，弹窗打开、关闭按钮、遮罩关闭和关闭后焦点返回均正常，页面横向溢出为 0，控制台无错误或警告。
- 应用内浏览器约 390×844 移动端验收：按钮正确换行，弹窗宽约 341px 且完全位于视口内，内容区域无页面级横向溢出；留言页不再出现友链申请卡或说明链接。
- 弹窗使用浏览器原生 `<dialog>` 的 Escape 取消行为；应用内浏览器的键盘注入未触发原生取消事件，因此本轮以原生语义和关闭/遮罩实测作为交互依据。
- 构建成功生成 16 个页面并完成 Pagefind 索引；仍只有既有动态导入、大 chunk、路由优先级、Markdown deprecation 和中文 stemming 提示。
- 已创建实现提交 `b97348f feat: add friend application dialog` 并成功推送到 `origin/codex/firefly-rebuild`；随后勾完实施计划并清空本次 `docs/next-tasks.md` 目标段。

## 2026-06-28 22:13:57 +08:00

### 修改范围

- 友链申请说明入口调整设计
- 跨会话任务交接

### 涉及文件

- `docs/superpowers/specs/2026-06-28-mikan-friends-page-refinement-design.md`
- `docs/next-tasks.md`
- `development-log.md`

### 具体内容

- 根据用户截图，将“如何申请友链”入口确定在友链页标题区右侧，不再由留言页承担友链申请说明。
- 确认第一阶段使用原生文档式弹窗复用现有 `friends.mdx` 内容，暂不新增独立路由或外部链接，为后续替换入口目标保留稳定契约。
- 明确留言页移除“友链申请”说明卡和“查看友链说明”链接，仅保留留言与隐私提醒。
- 在 `docs/next-tasks.md` 记录 TDD、实现、浏览器验收与提交步骤。
- 新增 `docs/superpowers/plans/2026-06-28-mikan-friend-application-dialog.md`，将后续工作拆分为失败测试、弹窗组件、留言页精简和完整验收四个任务。

### 验证情况

- 已完成设计规格的方案、范围、交互、响应式、可访问性和验证标准自审；未发现 `TBD`、`TODO`、范围冲突或未决实现项。
- 本次条目仅记录设计与交接，尚未修改生产代码；实施阶段将运行页面测试、类型检查、构建和浏览器视觉验证。

## 2026-06-28 21:39:44 +08:00

### 修改范围

- 友链页内容职责精简
- 标签筛选滑动胶囊修复
- 搜索筛选解析时序修复
- 页面契约测试、设计规格和实施计划同步

### 涉及文件

- `src/pages/friends.astro`
- `tests/mikan-pages.test.ts`
- `docs/superpowers/specs/2026-06-28-mikan-friends-page-refinement-design.md`
- `docs/superpowers/plans/2026-06-28-mikan-friends-page-refinement.md`
- `docs/next-tasks.md`
- `development-log.md`

### 具体内容

- 将 `/friends/` 从重复的“联系我”总览改为纯友链页面，删除友链、留言、QQ群三张入口卡片，并把主标题、英文眉标和说明改为友链语义。
- 移除内容区重复的第二个“友链”分组标题，让页面按“标题说明 / 搜索 / 标签 / 卡片 / 申请说明”顺序展开。
- 在友链标签栏加入工具导航同款 `tools-tab-indicator`，首次载入、点击标签和视口缩放时同步胶囊位置、尺寸与激活状态。
- 浏览器验收发现 `<head>` 脚本中的自定义元素会在子输入框解析前执行 `connectedCallback()`；将搜索监听改为宿主元素上的 `input` 事件委托，避免直接查询子节点导致监听漏绑。
- 新增页面契约测试，覆盖纯友链页面职责、滑动胶囊 DOM 与定位、缩放监听、搜索事件委托和原有筛选入口。
- 新增并执行实施计划，同步设计规格和跨会话任务状态；本次是日常局部修复，不调整内容模型、部署流程或公开使用方式，因此无需修改 README、AGENTS、项目专属 Skill、示例内容和 CHANGELOG。

### 验证情况

- TDD 基线：`npm.cmd run test:pages` 为 20 项通过、0 项失败。
- 第一轮红灯：新增纯友链与胶囊契约后为 20 项通过、2 项按预期失败；最小实现后为 22 项通过、0 项失败。
- 浏览器复测搜索时发现事件监听时序问题；补充事件委托契约后为 21 项通过、1 项按预期失败，修复后为 22 项通过、0 项失败。
- `npm.cmd run sync:content`、`npm.cmd run validate:content`、`npm.cmd run test:content-model`、`npm.cmd run test:pages`、`npm.cmd run check`、`npm.cmd run build` 均已通过；`check` 为 0 errors，保留既有 `Calendar.astro` 未读参数 hint，构建保留既有动态导入、大 chunk、路由优先级、Markdown deprecation 和 Pagefind 中文 stemming 提示。
- 浏览器桌面亮色验证：页面无“联系我”标题和入口卡片；默认与 Maker 标签胶囊均和激活按钮重合，Maker 筛选只显示 1 张匹配卡片；搜索不存在词条时显示“找不到相关结果”。
- 浏览器移动端验证：约 390×844 视口下标签栏换行，第二行“示例”胶囊与按钮重合并只显示 1 张匹配卡片；页面级横向溢出为 0。
- 浏览器暗色验证：桌面与移动端激活文字均为白色，胶囊不透明度为 1，页面级横向溢出为 0；检查结束后已恢复默认视口和亮色模式。
- 浏览器控制台未发现新增错误或警告。
- 已创建并推送提交 `48a5704 fix: refine friends page filters` 到 `origin/codex/firefly-rebuild`；此前未推送的两份设计记录也一并同步到远端。
- 推送成功后将设计规格标记为“已实现并验证”、勾完实施计划，并清空 `docs/next-tasks.md` 的已完成目标段。

## 2026-06-28 21:17:04 +08:00

### 修改范围

- 友链页精简与筛选胶囊修复设计
- 跨会话任务交接

### 涉及文件

- `docs/superpowers/specs/2026-06-28-mikan-friends-page-refinement-design.md`
- `docs/next-tasks.md`
- `development-log.md`

### 具体内容

- 根据用户确认，将 `/friends/` 定义为纯友链页面，不再重复展示“联系我”标题和友链、留言、QQ群三张入口卡片。
- 明确友链标签筛选复用工具导航的彩色滑动胶囊，并在首次载入、点击和视口变化后同步定位。
- 记录局部修复、固定背景和抽取共享组件三种方案的取舍，采用影响面最小的友链页局部修复。
- 在 `docs/next-tasks.md` 记录书面规格复核、TDD 实现和视觉验证的后续步骤。
- 用户复核书面规格后，新增 `docs/superpowers/plans/2026-06-28-mikan-friends-page-refinement.md`，将实施拆分为失败测试、最小实现、自动化与浏览器验收、记录与提交四个任务。

### 验证情况

- 已完成规格占位符、矛盾、范围和歧义自审，未发现 `TBD`、`TODO` 或未决实现项。
- 本次仅新增设计与交接文档，尚未修改生产代码，因此未运行页面测试、类型检查和构建；实现阶段将按规格完整验证。
- 已创建提交 `bea5cd5 docs: define friends page refinement`；连续三次尝试推送 `origin/codex/firefly-rebuild` 均因无法连接 `github.com:443` 失败，已在 `docs/next-tasks.md` 保留恢复网络后推送的阻塞记录。

## 2026-06-28 19:30:20 +08:00

### 修改范围

- 联系我板块重构
- 顶部导航与全站二级快捷栏整理
- 主要非主页大标题视觉统一
- 项目规则、设计文档和更新日志同步

### 涉及文件

- src/config/navBarConfig.ts
- src/config/siteConfig.ts
- src/config/friendsConfig.ts
- src/layouts/ContentGridLayout.astro
- src/layouts/MainGridLayout.astro
- src/pages/friends.astro
- src/pages/guestbook.astro
- src/pages/about.astro
- src/pages/categories/index.astro
- src/pages/tags/index.astro
- src/pages/rss.astro
- src/pages/search.astro
- src/pages/records/index.astro
- src/pages/index.astro
- src/components/pages/AdvancedSearch.svelte
- tests/mikan-pages.test.ts
- README.md
- AGENTS.md
- .agents/skills/mikan-archive-project/SKILL.md
- docs/superpowers/specs/2026-06-27-mikan-archive-firefly-rebuild-design.md
- docs/superpowers/specs/2026-06-27-mikan-archive-focused-content-layout-design.md
- CHANGELOG.md
- docs/next-tasks.md
- .gitignore
- development-log.md

### 具体内容

- 将顶部一级导航“友邻”改为“联系我”，下拉菜单包含“友链 / 留言 / QQ群”，并启用留言页开关。
- 新增 /guestbook/ 留言页，提供留言说明、友链申请提示、隐私提醒和评论系统未配置时的占位说明。
- 将 /friends/ 改为联系我入口页，使用工具导航同款大标题系统，增加友链、留言、QQ 群三张入口卡片，并保留友链搜索与标签筛选。
- 从 MainGridLayout 和 ContentGridLayout 移除导航下方通用分类快捷栏，避免其他页面继续显示“主页 / 归档 / 分类 / 更多”区域。
- 将文库、归档、收藏、联系我、留言、分类、标签、RSS、足迹、关于和搜索等主要非主页的可见大标题统一为工具导航同款英文眉标、图标、主标题和说明节奏。
- 将首页友链预览与足迹统计中的“友邻”文案调整为“友链”，避免和新的一级入口“联系我”混淆。
- 同步 README、AGENTS、项目专属 Skill、Firefly 重构设计规格、聚焦布局规格和 CHANGELOG 中的导航、联系我页面职责和快捷栏规则。
- 补充页面契约测试，覆盖 /guestbook/ 路由、联系我下拉、全站移除通用分类快捷栏、联系我相关页面与主要非主页标题系统统一，并纳入文库与归档页头。
- 构建过程中发现 material-symbols:timeline-rounded 不存在；已验证本轮新增图标，确认仅该图标缺失，并替换为已安装的 material-symbols:timeline。
- 清理本地 Headless Chrome / Playwright 检查产物，并将 `.playwright-cli/` 与 `output/` 加入 `.gitignore`，避免后续截图和控制台日志误进入提交范围。
- 完成最终 diff、未跟踪文件和敏感信息检查后，清空 `docs/next-tasks.md` 中本轮已完成任务段，仅保留文档使用规则。

### 验证情况

- 已先运行 npm.cmd run test:pages，确认新增契约在实现前按预期失败。
- npm.cmd run validate:content：通过。
- npm.cmd run test:content-model：6 项通过，0 项失败。
- npm.cmd run test:pages：20 项通过，0 项失败。
- npm.cmd run check：通过，0 errors；保留既有 src/components/widget/Calendar.astro 未读参数提示。
- npm.cmd run build：通过；保留既有 Vite 动态导入、大 chunk、Astro markdown deprecation 和 Pagefind 中文 stemming 提示。
- 使用 Headless Chrome 生成并目检截图：output/visual/friends-desktop.png、output/visual/guestbook-desktop.png、output/visual/friends-mobile.png、output/visual/guestbook-mobile.png。
- 使用 HTTP/HTML 结构检查 /friends/、/guestbook/、/categories/、/tags/、/rss/、/records/、/about/、/search/：均包含 tools-page-title 与 tools-eyebrow-row，且均未渲染 category-bar-wrapper 或 id=category-bar。
- 视觉检查发现联系我和留言入口卡片复用 onload-animation 时在 headless 截图中出现透明空白；已移除该类入口卡片的入场透明动画，并新增 contact-entry 紧凑高度后重新截图确认桌面和移动端卡片可见。
- 2026-06-28 19:54 重新运行提交前验证：`npm.cmd run sync:content`、`npm.cmd run validate:content`、`npm.cmd run test:content-model`、`npm.cmd run test:pages`、`npm.cmd run check`、`npm.cmd run build` 均通过。
- `npm.cmd run test:content-model`：6 项通过，0 项失败；`npm.cmd run test:pages`：20 项通过，0 项失败。
- `npm.cmd run check`：0 errors，保留既有 `src/components/widget/Calendar.astro` 未读参数 hint。
- `git diff --check`：未发现空白错误，仅有 Windows 换行提示。
- 敏感信息扫描：未发现真实 token、cookie、密码、私有仓库凭据、本机绝对路径或真实私人联系方式；命中项均为规则说明文案或测试正则误报。
- Git 提交已创建并推送到 `origin/codex/firefly-rebuild`。推送前几次曾因无法连接 `github.com:443` 失败；随后 HTTPS push 恢复并成功完成，`docs/next-tasks.md` 已清空本轮任务段。

## 2026-06-28 18:24:55 +08:00

### 修改范围

- 摘录收藏单分类筛选布局调整
- 页面契约测试同步

### 涉及文件

- `src/pages/resources/clips/index.astro`
- `src/styles/resources.css`
- `tests/mikan-pages.test.ts`
- `development-log.md`

### 具体内容

- 为摘录收藏页增加 `data-clips-filtered` 状态，区分“全部”和单分类筛选模式。
- 单分类筛选时隐藏当前分组标题、数量和横向分割线，只保留筛选后的卡片内容。
- “全部”模式继续显示所有分组标题线，顶部分类标签的数量徽章保持不变。
- 补充页面契约测试，覆盖筛选状态属性、单分类隐藏分组标题和清除额外顶部间距。

### 验证情况

- 已先运行 `npm.cmd run test:pages`，确认新增测试在修复前按预期失败。
- `npm.cmd run test:pages`：16 项通过，0 项失败。
- 已使用 Playwright 运行时脚本验证：全部模式显示 2 个分组标题，点击分类后 `data-clips-filtered="true"`、仅显示 1 个分组、该分组标题 computed display 为 `none`，活动标签数量徽章仍显示 `1`，回到“全部”后标题恢复。
- 已使用 Playwright CLI 截图验证 `/resources/clips/` 全部模式和 `/resources/clips/?category=Astro` 单分类稳定状态。

## 2026-06-28 18:01:45 +08:00

### 修改范围

- 摘录收藏分类活动胶囊颜色调整
- 页面契约测试同步

### 涉及文件

- `src/styles/resources.css`
- `tests/mikan-pages.test.ts`
- `development-log.md`

### 具体内容

- 将摘录收藏分类活动胶囊从工具导航的青蓝色改为与 `MIKAN CLIPPINGS` 眉标一致的深橙色渐变。
- 为深色模式补充更亮的橙色活动胶囊渐变和阴影，保持暗色可读性。
- 调整页面契约测试，明确摘录收藏活动胶囊不能继续使用 `var(--primary)` 工具导航主色。

### 验证情况

- 已先运行 `npm.cmd run test:pages`，确认更新后的颜色契约测试在修复前按预期失败。
- `npm.cmd run test:pages`：16 项通过，0 项失败。
- 已使用 Playwright CLI 截图验证 `/resources/clips/` 默认状态和 `/resources/clips/?category=Astro` 分类状态。
- 已使用 Playwright 运行时脚本读取活动胶囊 computed style，确认背景为 `rgb(207, 121, 88) -> rgb(184, 95, 67)` 的橙色渐变。

## 2026-06-28 17:30:03 +08:00

### 修改范围

- 收藏三页标题字距微调
- 摘录收藏分类标签可见性与点击筛选修复
- 页面契约测试补充

### 涉及文件

- `src/pages/resources/clips/index.astro`
- `src/styles/resources.css`
- `tests/mikan-pages.test.ts`
- `development-log.md`

### 具体内容

- 将收藏、工具导航、摘录收藏共用的 `tools-page-title` 从负字距改为轻微正字距，避免中文标题笔画挤压。
- 将摘录收藏分类标签从静态 `span` 改为可访问链接，提供 `?category=` URL fallback。
- 为摘录收藏增加 `data-clips-tab`、`data-clips-section` 与页面内脚本，使点击“全部”、分类标签后同步更新 URL、选中态和可见分组。
- 为摘录收藏活动标签补充胶囊背景，修复浅色模式下“全部”标签不明显的问题。
- 补充页面契约测试，覆盖摘录分类链接、URL 参数、选中态脚本结构、活动胶囊背景和标题字距。

### 验证情况

- 已先运行 `npm.cmd run test:pages`，确认新增测试在修复前按预期失败。
- `npm.cmd run test:pages`：16 项通过，0 项失败。
- `npm.cmd run check`：0 errors；保留既有 `src/components/widget/Calendar.astro` 未使用事件参数 hint。
- 已使用 Playwright CLI 通过临时 npm cache 截图验证 `/resources/`、`/resources/tools/`、`/resources/clips/`、`/resources/clips/?category=Astro` 桌面状态，以及 `/resources/clips/` 390px 移动视口。
- Playwright CLI 的 iPhone 设备预设因本机缺少 WebKit 浏览器失败，已改用 Chromium 390×844 视口完成移动截图验证。
- 已使用 Playwright 运行时脚本验证摘录收藏点击交互：默认“全部”、点击第一个分类、点击 `Astro`、返回“全部”时，URL、活动标签和可见分组均正确同步。

## 2026-06-28 17:08:22 +08:00

### 修改范围

- 项目协作规则更新
- 项目专属 Skill 维护规则同步
- 更新后页面链接交付要求

### 涉及文件

- `AGENTS.md`
- `.agents/skills/mikan-archive-project/SKILL.md`
- `.agents/skills/mikan-archive-maintenance/SKILL.md`
- `development-log.md`

### 具体内容

- 新增“更新后链接规则”，要求每次完成页面、UI、布局、交互、内容展示、导航或可浏览文档相关更新后，在最终回复中提供开发者可直接打开的对应页面链接。
- 明确本地服务运行时优先给 `http://localhost:4321/...` 的具体页面路径，未运行时必须同时给启动命令和页面路径。
- 明确未合并分支的改动需要说明正式线上站点暂时看不到，应使用本地链接查看。
- 同步更新 `mikan-archive-project` 和 `mikan-archive-maintenance` 项目专属 Skill，使后续项目任务收尾时默认执行该链接交付规则。

### 验证情况

- 已运行文本检索确认 `AGENTS.md`、两个项目专属 Skill 和 `development-log.md` 均包含更新后链接规则相关内容。
- 本次只修改项目规则和维护说明，未修改应用代码或页面样式，因此未运行应用构建。
- `git diff --check`：通过。

## 2026-06-28 16:35:40 +08:00

### 修改范围

- 收藏总览、工具导航与摘录收藏视觉统一
- 摘录收藏整卡跳转与 hover 交互
- 收藏三页顶部通用分类条移除
- 结构测试、设计规格、CHANGELOG 与任务交接同步

### 涉及文件

- `src/layouts/ContentGridLayout.astro`
- `src/pages/resources/index.astro`
- `src/pages/resources/tools.astro`
- `src/pages/resources/clips/index.astro`
- `src/styles/resources.css`
- `tests/mikan-pages.test.ts`
- `docs/superpowers/specs/2026-06-27-mikan-archive-focused-content-layout-design.md`
- `docs/next-tasks.md`
- `CHANGELOG.md`
- `development-log.md`

### 具体内容

- 为 `ContentGridLayout` 增加 `showCategoryBar` 开关，并在收藏总览、工具导航和摘录收藏三页关闭顶部通用分类条。
- 将收藏总览与摘录收藏包入与工具导航一致的白色 / 半透明 section 打底容器，统一标题字号、英文眉标、图标和描述文案节奏。
- 将工具导航英文眉标从 `MIKAN COLLECTIONS` 调整为 `MIKAN TOOLBOX`，并增加火箭图标，使语义更贴合长期工具入口。
- 将摘录收藏分类标签改为工具导航胶囊风格，分组标题改为图标、数量与延展分割线结构。
- 将摘录条目从内部“查看原文”按钮跳转改为整张卡片外链跳转；“查看原文”保留为视觉提示，不再作为唯一点击区域。
- 为摘录卡片增加暖色底色、轻边框、底部 / 右侧层级阴影，以及 hover 时的彩色阴影和提示按钮反馈。
- 新增页面源码契约测试，覆盖收藏三页关闭通用分类条、标题系统统一、section 打底、摘录整卡跳转和 hover 样式。
- 同步更新聚焦内容布局设计规格、CHANGELOG 和 `docs/next-tasks.md`，记录收藏页当前视觉规则。

### 验证情况

- 已先运行 `npm.cmd run test:pages` 并观察到新增测试按预期失败，再完成实现。
- `npm.cmd run test:pages`：15 项通过，0 项失败。
- `npm.cmd run sync:content`：通过，示例内容同步成功。
- `npm.cmd run validate:content`：通过，输出 `Content validation passed.`。
- `npm.cmd run test:content-model`：6 项通过，0 项失败。
- `npm.cmd run check`：0 errors、0 warnings、1 个既有 Calendar 未使用事件参数 hint。
- `npm.cmd run build`：通过，生成 15 个页面并完成 Pagefind 索引；保留既有动态导入、chunk 体积、catch-all 首页冲突、Markdown 旧选项和中文 Pagefind stemming 警告。
- 已使用 Playwright CLI 截图检查 `/resources/`、`/resources/tools/`、`/resources/clips/` 的桌面视口，以及 `/resources/`、`/resources/clips/` 的 390px 移动视口。
- 已使用 Playwright 脚本验证：收藏三页均无 `#category-bar`，均有 1 个 section 打底，英文眉标和中文标题正确，桌面与移动端横向溢出为 0，浏览器 console error/warning 为 0。
- 已验证摘录收藏首张卡片 hover 前后 `box-shadow` 发生变化，点击整张卡片可打开 MDN 原文 URL。

## 2026-06-27 17:54:49 +08:00

### 修改范围

- 非主页单列布局与工具导航正式设计
- 项目视觉对比默认规则
- 跨会话实施交接

### 涉及文件

- `docs/superpowers/specs/2026-06-27-mikan-archive-focused-content-layout-design.md`
- `docs/superpowers/specs/2026-06-27-mikan-archive-firefly-rebuild-design.md`
- `docs/next-tasks.md`
- `AGENTS.md`
- `.agents/skills/mikan-archive-project/SKILL.md`
- `development-log.md`

### 具体内容

- 根据用户截图、浏览器视觉对比和 fqzlr/my-blog 公开源码，确定首页保留 Firefly 氛围布局，所有非主页改用无大横幅、无通用双侧栏的单列内容布局。
- 确认文章详情保留独立悬浮目录，移动端自动收起。
- 记录工具导航的分类胶囊、数量徽章、分组线、三列卡片、工具 Logo、域名与 hover 外链箭头等细节。
- 在项目规则与项目专属 Skill 中新增“视觉任务默认启用浏览器对比”的约定，并说明 `.superpowers/` 只保存本地忽略草稿。
- 更新 `docs/next-tasks.md`，记录当前等待规格审阅，确认后进入实施计划。

### 验证情况

- 已对照 fqzlr/my-blog `master` 分支的 `src/pages/collections.astro`、`src/styles/collections.css` 与 `src/layouts/MainGridLayout.astro`。
- 已检查新规格不存在 `TODO`、`TBD` 或未决占位内容。
- 本次只更新设计与项目规则，未运行应用构建；代码尚未修改。
- `git diff --check`：通过。

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
## 2026-06-27 18:07:13 +08:00

### 修改范围

- 非主页聚焦布局与工具导航实施计划
- 跨会话任务交接

### 涉及文件

- `docs/superpowers/plans/2026-06-27-mikan-archive-focused-content-layout.md`
- `docs/next-tasks.md`
- `development-log.md`

### 具体内容

- 根据已确认的聚焦布局设计新增详细实施计划，明确首页继续使用现有 `MainGridLayout`，所有非主页迁移到新增 `ContentGridLayout`。
- 将工作拆分为布局契约测试、非主页迁移、工具图标模型、工具导航结构测试、工具页重做、收藏页面压缩、文档同步和视觉验证八个任务。
- 明确工具导航参考 `fqzlr/my-blog` 的开源结构，但只复用公开布局与交互思路，不复制真实内容、头像或私有配置。
- 把项目默认视觉对比纳入最终验证，覆盖桌面与移动端：首页保留检查、非主页横幅/侧栏移除、工具标签筛选和文章目录响应式行为。
- 更新 `docs/next-tasks.md`，把状态从等待规格确认切换为等待执行 Task 1。

### 验证情况

- 已读取已确认设计规格、现有 `MainGridLayout` / `Layout`、工具导航页面、资源数据模型、内容校验脚本和现有测试，确认计划中的文件路径与当前仓库一致。
- 已读取参考仓库公开 `collections.astro` 与 `collections.css`，确认计划覆盖标签滑动指示器、分类数量、分组线、图标、域名底栏、hover 外链箭头和 3/2/1 列响应式行为。
- 本次仅新增实施计划和交接记录，尚未修改应用代码，因此未运行应用测试或构建；这些验证已列入实施计划 Task 8。
## 2026-06-27 18:39:37 +08:00

### 修改范围

- 非主页聚焦内容布局
- 工具导航重做与资源图标模型
- 收藏页面首屏压缩
- 回归测试、视觉对比与文档同步

### 涉及文件

- `src/layouts/Layout.astro`
- `src/layouts/ContentGridLayout.astro`
- `src/pages/**/*.astro`
- `src/pages/resources/index.astro`
- `src/pages/resources/tools.astro`
- `src/pages/resources/clips/index.astro`
- `src/styles/resources.css`
- `src/data/mikan.ts`
- `content.example/resources/resources.json`
- `scripts/validate-content.mjs`
- `tests/mikan-data.test.ts`
- `tests/mikan-pages.test.ts`
- `README.md`
- `docs/content-repository.md`
- `docs/superpowers/specs/2026-06-27-mikan-archive-focused-content-layout-design.md`
- `docs/superpowers/plans/2026-06-27-mikan-archive-focused-content-layout.md`
- `docs/next-tasks.md`
- `CHANGELOG.md`
- `development-log.md`

### 具体内容

- 新增 `ContentGridLayout`，将所有非主页从原三栏横幅布局迁移为导航栏下方直接开始的聚焦内容布局；首页继续使用原 `MainGridLayout`。
- 非主页不再渲染壁纸横幅、人物资料、公告、分类、标签、站点统计、站点信息和日历通用侧栏；文章详情宽屏保留独立 sticky 目录，移动端继续使用浮动目录。
- 为 `Layout.astro` 增加 `contentOnly` 状态，并修复通用网格脚本把 `data-sidebar-position="none"` 错当成左侧栏、导致正文缩窄的问题。
- 工具导航按 `fqzlr/my-blog` 开源 collections 页面结构重做，包含紧凑标题、分类胶囊、滑动指示器、分类数量、分组线、图标、域名底栏、hover 外链箭头和三/二/一列响应式布局。
- 资源模型新增可选 `icon` 字段；公开示例扩展为测试数据、开发文档、图片工具和 AI 助手四组九个工具，并新增 Iconify 名称存在性测试，避免无效图标阻断页面渲染。
- 收藏总览与摘录收藏移除大块标题卡，改用紧凑标题区直接衔接入口卡片和内容列表。
- 同步 README、内容仓库字段说明、CHANGELOG、设计规格、实施计划和下一步任务交接。

### 验证情况

- 已按 TDD 先后观察到非主页迁移、工具分类/图标、工具导航结构、紧凑标题、Iconify 图标和无侧栏网格契约测试按预期失败，再完成实现并运行通过。
- 已运行 `npm.cmd run test:content-model`，6 项测试通过；其中包含已安装 Iconify 图标集存在性检查。
- 已运行 `npm.cmd run test:pages`，12 项测试通过。
- 已运行 `npm.cmd run check`，结果为 0 errors、0 warnings、1 个既有 Calendar 未使用事件参数 hint。
- 已使用应用内浏览器在 1440×900 桌面视口检查首页、工具导航和文章详情：首页横幅与双侧栏保留，工具页无横幅和通用侧栏且三列卡片正常，文章详情显示独立目录。
- 已在 390×844 移动视口检查工具导航和文章详情：工具标签完整换行、卡片单列、文章桌面目录隐藏且浮动目录按钮显示；两页横向溢出均为 0。
- 已点击 `AI 助手` 分类，确认 `aria-pressed`、disabled、hash、内容区和滑动指示器同步更新，显示 3 张对应卡片。
- 已重新运行完整验证链：`sync:content`、`validate:content`、`test:content-model`、`test:pages`、`check` 和 `build` 全部通过；正式构建生成 15 个页面，Pagefind 索引 3 个页面、205 个词。
- 构建保留既有的重复动态导入、单个大 chunk、catch-all 首页冲突和 Markdown 旧选项弃用警告，本次改动未新增构建失败。
- 已启动正式构建预览并检查 `/`、`/posts/`、示例文章、`/resources/`、`/resources/tools/`、`/resources/clips/`、`/friends/`、`/records/`、`/about/`，9 个路由均返回 200。
- 已检查应用内浏览器控制台，错误日志为 0。
- 已创建实现提交 `d8ac3ac`（`feat: focus content pages and tools navigation`），并成功推送到 `origin/codex/firefly-rebuild`。
## 2026-06-27 19:11:46 +08:00

### 修改范围

- 聚焦布局固定导航遮挡修复
- 页面布局回归测试与视觉验证

### 涉及文件

- `src/layouts/ContentGridLayout.astro`
- `tests/mikan-pages.test.ts`
- `docs/superpowers/specs/2026-06-27-mikan-archive-focused-content-layout-design.md`
- `docs/next-tasks.md`
- `CHANGELOG.md`
- `development-log.md`

### 具体内容

- 确认 `body.sticky-navbar` 会把 `#top-row` 固定为 `4.5rem` 高度，而聚焦内容容器此前没有预留空间，导致 CategoryBar 在首屏与导航重叠约 `48px`。
- 为 `body.sticky-navbar` 下的 `.focused-page-shell` 增加 `4.5rem` 顶部占位，不改变首页布局，也不隐藏分类条。
- 新增源码契约测试，防止后续移除固定导航占位后重新出现遮挡。
- 在聚焦布局设计规格中明确固定导航必须预留完整高度。

### 验证情况

- 已先运行新增回归测试并观察到预期失败，再添加布局样式后运行 `npm.cmd run test:pages`，13 项测试全部通过。
- 已运行 `npm.cmd run check`，结果为 0 errors、0 warnings、1 个既有 Calendar 未使用事件参数 hint。
- 已在当前浏览器默认视口验证：页面顶部导航结束于 `72px`，CategoryBar 从 `96px` 开始，重叠由 `48px` 降为 `0px`，横向溢出为 0。
- 已在 `390×844` 移动视口验证：导航结束于 `63px`，CategoryBar 从 `77px` 开始，重叠为 0，横向溢出为 0。
- 已重新运行 `npm.cmd run test:pages`，13 项测试通过；运行 `npm.cmd run check` 为 0 errors、0 warnings、1 个既有 hint；运行 `npm.cmd run build` 成功生成 15 个页面并完成 Pagefind 索引。
- 构建仍只有既有的重复动态导入、大 chunk、catch-all 首页冲突和 Markdown 旧选项弃用警告，本次修复未新增构建错误。
- 已创建修复提交 `d02113c`（`fix: offset focused content below navbar`），并成功推送到 `origin/codex/firefly-rebuild`。
