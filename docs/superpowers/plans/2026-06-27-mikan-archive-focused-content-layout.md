# MikanArchive Focused Content Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 保留首页现有 Firefly 横幅与双侧栏，把所有非主页改成无大横幅、无通用人物/统计侧栏的聚焦内容布局，并把工具导航重做为接近 `fqzlr/my-blog` 开源实现的紧凑分类导航。

> 2026-06-29 更新：当前公开站点已删除独立 `/records/` 足迹功能页，顶部导航调整为 `主页 / 文库 / 收藏 / 联系我 / 我的`，`/about/` 入口显示为“个人介绍”。本计划中涉及 `src/pages/records/index.astro` 和 `/records/` 验证的条目仅作为历史实施记录保留，不再作为后续验收目标。

**Architecture:** 保留 `src/layouts/MainGridLayout.astro` 只供首页使用；新增 `src/layouts/ContentGridLayout.astro` 承载非主页的 Navbar、CategoryBar、单列内容、Footer、浮动控件和文章桌面目录。通过 `Layout.astro` 的显式 `contentOnly` 属性关闭非主页壁纸定位逻辑，避免 Swup 与本地壁纸模式把横幅样式重新加回。工具导航继续从公开/私有内容同步后的 `src/data/content/resources/resources.json` 读取数据，只扩展可选 `icon` 字段，不复制参考博主的真实内容。

**Tech Stack:** Astro 7、TypeScript、Tailwind CSS 4、Astro Icon / Iconify、Node.js 内置测试、现有内容同步与校验脚本、应用内浏览器视觉对比。

---

## File Structure

- 新增 `src/layouts/ContentGridLayout.astro`：非主页单列布局与文章桌面目录。
- 修改 `src/layouts/Layout.astro`：增加 `contentOnly` 布局开关，阻止非主页壁纸/横幅定位脚本生效。
- 修改所有非主页 `src/pages/**/*.astro`：从 `MainGridLayout` 迁移到 `ContentGridLayout`；`src/pages/index.astro` 保持不变。
- 修改 `src/pages/resources/tools.astro`：实现参考项目的标题、标签、分组和卡片交互。
- 新增 `src/styles/resources.css`：集中维护工具导航响应式样式。
- 修改 `src/data/mikan.ts`、`content.example/resources/resources.json`、`scripts/validate-content.mjs`：增加可选图标字段及公开示例数据。
- 修改 `tests/mikan-pages.test.ts`、`tests/mikan-data.test.ts`：先写失败契约，再实现布局与工具导航。
- 同步 README、内容仓库说明、设计文档、CHANGELOG、开发日志和跨会话交接。

## Task 1: Lock The Focused Layout Contract With Failing Tests

**Files:**
- Modify: `tests/mikan-pages.test.ts`
- Test: `tests/mikan-pages.test.ts`

- [ ] 新增首页布局保护测试，断言 `src/pages/index.astro` 仍导入并使用 `MainGridLayout`。
- [ ] 新增非主页迁移表，逐个检查以下页面导入并使用 `ContentGridLayout`，且不再包含 `MainGridLayout`：

```ts
const focusedPages = [
  "src/pages/[...page].astro",
  "src/pages/404.astro",
  "src/pages/about.astro",
  "src/pages/archive.astro",
  "src/pages/categories/index.astro",
  "src/pages/friends.astro",
  "src/pages/posts/[...slug].astro",
  "src/pages/posts/index.astro",
  "src/pages/records/index.astro",
  "src/pages/resources/index.astro",
  "src/pages/resources/tools.astro",
  "src/pages/resources/clips/index.astro",
  "src/pages/rss.astro",
  "src/pages/search.astro",
  "src/pages/tags/index.astro",
];
```

- [ ] 新增 `ContentGridLayout` 源码契约：必须包含 `Navbar`、`CategoryBar`、`Footer`、`FloatingControls`、`SidebarTOC` 和 `contentOnly`；不得包含 `SideBar`、`wallpaper-wrapper`、`banner-page-title`、`Live2DWidget` 或 `SpineModel`。
- [ ] 运行 `npm.cmd run test:pages`，确认测试因 `ContentGridLayout.astro` 尚不存在、页面尚未迁移而失败。
- [ ] 不修改实现来绕过测试；记录失败信息供下一任务验证。

## Task 2: Add The Non-Home Content Layout

**Files:**
- Create: `src/layouts/ContentGridLayout.astro`
- Modify: `src/layouts/Layout.astro`
- Modify: `src/pages/[...page].astro`
- Modify: `src/pages/404.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/archive.astro`
- Modify: `src/pages/categories/index.astro`
- Modify: `src/pages/friends.astro`
- Modify: `src/pages/posts/[...slug].astro`
- Modify: `src/pages/posts/index.astro`
- Modify: `src/pages/records/index.astro`
- Modify: `src/pages/resources/index.astro`
- Modify: `src/pages/resources/tools.astro`
- Modify: `src/pages/resources/clips/index.astro`
- Modify: `src/pages/rss.astro`
- Modify: `src/pages/search.astro`
- Modify: `src/pages/tags/index.astro`
- Test: `tests/mikan-pages.test.ts`

- [ ] 在 `Layout.astro` 的 `Props` 中加入 `contentOnly?: boolean`，并把初始横幅状态改为：

```ts
const { contentOnly = false } = Astro.props;
const enableBanner = !contentOnly && backgroundWallpaper.mode === "banner";
```

- [ ] 把 `contentOnly` 传入壁纸初始化的 `define:vars`；当它为 `true` 时，脚本只设置 `body.no-banner-layout`、移除 `body.enable-banner`，跳过 `wallpaper-wrapper` 与主内容横幅定位分支。Swup 的 `astro:page-load` / `swup:contentReplaced` 后也重新执行同一规则。
- [ ] 创建 `ContentGridLayout.astro`，沿用 `MainGridLayout` 的公开 Props，根结构固定为：

```astro
<Layout {...seoProps} contentOnly>
  <Navbar />
  <div class="focused-page-shell">
    <div id="left-sidebar-dynamic" class="hidden transition-swup-fade"></div>
    <div id="right-sidebar-dynamic" class="hidden transition-swup-fade"></div>
    <div id="banner-overlay-container" class="hidden"></div>
    <div id="banner-dim-container" class="hidden"></div>
    <div class="focused-page-inner">
      {postCategory && <CategoryBar currentPostCategory={postCategory} />}
      <main id="swup-container" class="transition-main">
        <h1 class="sr-only">{title}</h1>
        <div id="content-wrapper"><slot /></div>
      </main>
      {headings?.length > 0 && (
        <aside class="focused-article-toc"><SidebarTOC headings={headings} /></aside>
      )}
      <Footer />
    </div>
  </div>
  <FloatingControls headings={headings} />
</Layout>
```

- [ ] 布局宽度使用现有 `--page-width`，普通内容居中；有文章 headings 时桌面端形成“正文 + 目录”两列。目录从 `xl` 断点开始 `position: sticky; top: 6rem`，小于该断点隐藏，移动端由现有 `FloatingTOC` 提供目录。
- [ ] 为 Swup 保留现有容器 id 和隐藏占位节点，防止导航时退化为整页刷新。
- [ ] 把列出的全部非主页导入和标签替换为 `ContentGridLayout`。文章页继续传递 `headings`、`postCategory`、SEO 与结构化数据参数，但不再传递/渲染文章封面横幅元数据；文章正文内部封面保持不变。
- [ ] 保持 `src/pages/index.astro` 完全使用 `MainGridLayout`，不删首页横幅、人物卡、公告、统计、日历等现有组件。
- [ ] 运行 `npm.cmd run test:pages`，预期布局契约测试通过。
- [ ] 运行 `npm.cmd run check`，修复所有 Astro/TypeScript 错误后再继续。
- [ ] 提交阶段性变更：`git add src/layouts src/pages tests/mikan-pages.test.ts && git commit -m "feat: add focused non-home layout"`。

## Task 3: Extend The Resource Model With Tool Icons

**Files:**
- Modify: `tests/mikan-data.test.ts`
- Modify: `src/data/mikan.ts`
- Modify: `scripts/validate-content.mjs`
- Modify: `content.example/resources/resources.json`
- Test: `tests/mikan-data.test.ts`

- [ ] 先新增失败测试：工具示例至少覆盖 3 个分类，每个工具的 `icon` 是非空字符串，分组 count 总和与工具数量一致。
- [ ] 运行 `npm.cmd run test:content-model`，确认现有 3 条工具数据因缺少 `icon` 或分类不足而失败。
- [ ] 给 `MikanResource` 增加 `icon?: string`，含义为 Iconify 名称或 `http(s)` 图标 URL；摘录收藏无需图标。
- [ ] 在 `validate-content.mjs` 增加可选非空字符串校验：当资源存在 `icon` 时必须是非空字符串，不能把图标设为必填，以保证未来私有内容向后兼容。
- [ ] 扩展示例工具数据，使用公开站点与 `simple-icons:*` / `material-symbols:*` 图标，至少包含“开发文档、AI 助手、开发工具、云平台”四组和 9 个工具；保留现有两条 `clip` 示例，不冒充真实私人收藏。
- [ ] 运行 `npm.cmd run sync:content`，再运行 `npm.cmd run validate:content` 与 `npm.cmd run test:content-model`，预期全部通过。

## Task 4: Lock The Tools Navigation Structure With Failing Tests

**Files:**
- Modify: `tests/mikan-pages.test.ts`
- Test: `tests/mikan-pages.test.ts`

- [ ] 把工具页测试扩展为以下源码契约：

```ts
assert.match(source, /data-tools-tab-nav/);
assert.match(source, /data-tools-tab-indicator/);
assert.match(source, /data-tools-section/);
assert.match(source, /tools-category-line/);
assert.match(source, /tools-card-jump-icon/);
assert.match(source, /item\.icon/);
assert.match(source, /aria-pressed/);
```

- [ ] 新增 `src/styles/resources.css` 契约：3 列、1024px 下 2 列、640px 下 1 列，并包含 active tab 指示器和卡片 hover 箭头。
- [ ] 运行 `npm.cmd run test:pages`，确认当前工具页缺少完整交互和样式文件而失败。

## Task 5: Rebuild The Tools Navigation Page

**Files:**
- Modify: `src/pages/resources/tools.astro`
- Create: `src/styles/resources.css`
- Test: `tests/mikan-pages.test.ts`

- [ ] 按参考项目公开 `collections.astro` 的信息结构重写页面：顶部只保留小号 eyebrow、`工具导航` 标题和一句说明，不再使用大面积标题卡。
- [ ] 实现椭圆标签容器：`全部 + 总数`、每个分类名和数量；活动标签由可移动的 `.tools-tab-indicator` 填充，按钮同步 `aria-pressed` 与 `disabled`。
- [ ] “全部”标签按分类分组展示；分类标题使用 label 图标、分类名、数量和延伸分隔线 `.tools-category-line`。独立分类标签只展示对应卡片，不重复分类标题。
- [ ] 每张卡片展示：图标（URL 使用 `<img>`，Iconify 名称使用 `<Icon>`，缺失时回退 `material-symbols:bookmarks-rounded`）、名称、两行说明、域名底栏和 hover 时出现的右上外链箭头。
- [ ] 页面交互使用一次性 document 事件委托并兼容 Astro/Swup：点击标签、刷新 hash、浏览器前进后退和 resize 都能恢复活动标签及指示器位置；hash 格式为 `#tools-${encodeURIComponent(category)}`。
- [ ] 在 `resources.css` 中使用 MikanArchive 的 `--primary`、`--card-bg`、`--line-divider` 等变量替换参考项目纯黑白视觉；保留 3/2/1 列断点、卡片入场、hover 抬升和外链箭头细节。
- [ ] 为空数据保留中文空状态，避免内容仓库尚未配置时页面崩溃。
- [ ] 运行 `npm.cmd run test:pages`，预期工具导航契约测试通过。
- [ ] 运行 `npm.cmd run check`，修复模板、图标名称和脚本类型错误。
- [ ] 提交阶段性变更：`git add src/data src/pages/resources/tools.astro src/styles/resources.css content.example/resources/resources.json scripts/validate-content.mjs tests && git commit -m "feat: rebuild tools navigation"`。

## Task 6: Compact The Remaining Resource Pages

**Files:**
- Modify: `src/pages/resources/index.astro`
- Modify: `src/pages/resources/clips/index.astro`
- Modify: `tests/mikan-pages.test.ts`

- [ ] 将收藏总览和摘录收藏的首屏大标题卡改为紧凑标题块：小图标/eyebrow、标题、简短说明、必要的筛选标签；移除“返回收藏总览”等占用较大高度的前导区域。
- [ ] 保留收藏总览的“工具导航 / 摘录收藏”双入口，以及摘录收藏的来源、收藏日期、场景与查看原文功能。
- [ ] 新增测试断言两页都使用 `ContentGridLayout`，并保留已有入口/字段契约。
- [ ] 运行 `npm.cmd run test:pages` 与 `npm.cmd run check`，预期通过。

## Task 7: Sync Documentation And Maintenance Records

**Files:**
- Modify: `README.md`
- Modify: `docs/content-repository.md`
- Modify: `docs/superpowers/specs/2026-06-27-mikan-archive-firefly-rebuild-design.md`
- Modify: `docs/superpowers/specs/2026-06-27-mikan-archive-focused-content-layout-design.md`
- Modify: `CHANGELOG.md`
- Modify: `development-log.md`
- Modify: `docs/next-tasks.md`

- [ ] README 说明首页与非主页的布局分工，以及工具资源可选 `icon` 字段。
- [ ] 内容仓库说明补充 `icon` 的 Iconify/URL 示例、可选规则和隐私边界。
- [ ] Firefly 重构设计继续指向本聚焦布局规格作为后续覆盖规则；聚焦布局规格标记进入实现并补充最终偏差（如有）。
- [ ] CHANGELOG 在 `Unreleased` 中记录非主页聚焦布局、工具导航交互和示例数据扩展，不创建 tag 或 Release。
- [ ] development-log 记录准确日期时间、涉及文件、验证和视觉对比结果。
- [ ] `docs/next-tasks.md` 在实施中逐项更新；只有代码、验证、记录、提交和 push 全部完成后，才清空当前目标正文。

## Task 8: Full Verification And Visual Comparison

**Files:**
- Verify: all modified files
- Verify routes: `/`, `/posts/`, `/posts/2026-06-26-welcome-to-mikan-archive/`, `/resources/`, `/resources/tools/`, `/resources/clips/`, `/friends/`, `/records/`, `/about/`

- [ ] 依次运行：

```powershell
npm.cmd run sync:content
npm.cmd run validate:content
npm.cmd run test:content-model
npm.cmd run test:pages
npm.cmd run check
npm.cmd run build
```

- [ ] 启动或复用本地预览，确认列出的每个路由返回 200。
- [ ] 使用项目默认视觉对比，在桌面 1440×900 检查：首页横幅与双侧栏仍在；所有非主页没有大横幅、人物卡、公告栏、统计栏和日历；工具页为紧凑标题、标签、分组线和三列卡片；文章页桌面目录独立悬浮。
- [ ] 在移动端 390×844 检查：工具卡片单列、标签可换行、没有横向滚动；文章桌面目录隐藏且浮动目录按钮可用；导航和页脚不遮挡内容。
- [ ] 点击“全部”和至少两个分类标签，确认卡片筛选、数量、hash、滑动指示器与 resize 后位置均正确；打开一个外链确认使用新标签页。
- [ ] 检查浏览器控制台无错误，运行页面宽度检查 `document.documentElement.scrollWidth === document.documentElement.clientWidth`。
- [ ] 运行 `git status --short` 与 `git diff --check`，审阅关键 diff，确保未引入私有内容、token、cookie 或参考博主资料。
- [ ] 更新 development-log 的最终验证结果，并按项目维护流程提交：`git add -A && git commit -m "feat: focus content pages and tools navigation"`。
- [ ] push 当前分支：`git push origin codex/firefly-rebuild`。确认远端成功后清理 `docs/next-tasks.md` 当前目标并补一次收尾提交/push；不合并 `main`，除非用户明确要求。
