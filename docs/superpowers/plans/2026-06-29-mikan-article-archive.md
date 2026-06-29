# MikanArchive 文章归档热力图与标签时间线实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `/archive/` 改造成支持标签筛选联动的文章活动热力图与年/月/文章连续时间线，并准确展示总计、年份和月份文章数量。

**Architecture:** `src/utils/archive-utils.ts` 承担可独立测试的标签汇总、筛选、年月分组与热力图计算；`ArchivePanel.svelte` 统一管理 URL、下拉菜单、热力图年份和时间线高亮状态；`archive.astro` 继续只负责读取文章并提供单列页面壳层。实现不改变文章 frontmatter、导航、部署与内容仓库结构。

**Tech Stack:** Astro 7、Svelte 5、TypeScript、Node.js test runner、Tailwind CSS 4、组件内 CSS

---

## 文件结构

- 新增 `src/utils/archive-utils.ts`：纯归档数据变换，不访问 DOM 或 Astro 运行时。
- 新增 `tests/archive-utils.test.ts`：覆盖标签、筛选、统计、年月分组和热力图日期口径。
- 修改 `package.json`：新增可重复运行的 `test:archive` 命令。
- 修改 `src/components/controls/ArchivePanel.svelte`：标签下拉、热力图、汇总、连续时间线与交互。
- 修改 `src/pages/archive.astro`：删除无效横幅标题脚本，保留标题壳层并传入文章数据。
- 修改 `tests/mikan-pages.test.ts`：归档页和组件契约测试。
- 修改 `CHANGELOG.md`、`development-log.md`、`docs/next-tasks.md`：公开行为、验证与交接同步。

### Task 1: 归档纯数据模型

**Files:**
- Create: `tests/archive-utils.test.ts`
- Create: `src/utils/archive-utils.ts`
- Modify: `package.json`

- [ ] **Step 1: 写入失败的数据测试**

创建 `tests/archive-utils.test.ts`，使用三篇跨年份、跨月份、含 `updated` 的合成文章：

```ts
import assert from "node:assert/strict";
import test from "node:test";
import {
	buildArchiveHeatmaps,
	filterArchivePosts,
	getArchiveActivityDate,
	groupArchivePosts,
	summarizeArchiveTags,
} from "../src/utils/archive-utils";

const posts = [
	{ id: "new", data: { title: "新文章", tags: ["Astro", "博客"], category: "教程", published: new Date("2026-06-20"), updated: new Date("2026-06-29") } },
	{ id: "old", data: { title: "旧文章", tags: ["Astro"], category: "笔记", published: new Date("2026-05-03") } },
	{ id: "last-year", data: { title: "去年文章", tags: ["收藏"], category: "收藏", published: new Date("2025-12-18") } },
];

test("标签汇总按数量降序并在同数量时按名称稳定排序", () => {
	assert.deepEqual(summarizeArchiveTags(posts), [
		{ name: "Astro", count: 2 },
		{ name: "博客", count: 1 },
		{ name: "收藏", count: 1 },
	]);
});

test("单标签筛选保持发布时间倒序且未知标签为空", () => {
	assert.deepEqual(filterArchivePosts(posts, "Astro").map((post) => post.id), ["new", "old"]);
	assert.deepEqual(filterArchivePosts(posts, "missing"), []);
});

test("年月分组提供总数、年份数和月份数", () => {
	const result = groupArchivePosts(posts);
	assert.equal(result.postCount, 3);
	assert.equal(result.yearCount, 2);
	assert.equal(result.years[0].year, 2026);
	assert.equal(result.years[0].totalCount, 2);
	assert.deepEqual(result.years[0].months.map((month) => [month.month, month.count]), [[6, 1], [5, 1]]);
});

test("热力图优先使用更新日期并回退发布时间", () => {
	assert.equal(getArchiveActivityDate(posts[0]).toISOString().slice(0, 10), "2026-06-29");
	assert.equal(getArchiveActivityDate(posts[1]).toISOString().slice(0, 10), "2026-05-03");
	const heatmaps = buildArchiveHeatmaps(posts);
	assert.deepEqual(heatmaps.map((item) => item.year), [2026, 2025]);
	assert.equal(heatmaps[0].grid[3][5].count, 1);
	assert.equal(heatmaps[0].grid[0][4].count, 1);
});
```

- [ ] **Step 2: 运行测试并确认红灯**

Run: `npx.cmd tsx tests/archive-utils.test.ts`

Expected: FAIL，原因是 `src/utils/archive-utils.ts` 尚不存在。

- [ ] **Step 3: 实现最小纯数据模块**

创建 `src/utils/archive-utils.ts`：

```ts
export type ArchivePost = {
	id: string;
	data: {
		title: string;
		tags: string[];
		category?: string | null;
		published: Date;
		updated?: Date;
	};
};

export type ArchiveMonthGroup = { month: number; count: number; posts: ArchivePost[] };
export type ArchiveYearGroup = { year: number; totalCount: number; months: ArchiveMonthGroup[] };
export type ArchiveTimeline = { postCount: number; yearCount: number; years: ArchiveYearGroup[] };
export type ArchiveHeatmapCell = { month: number; period: number; count: number; level: number };
export type ArchiveHeatmapYear = { year: number; grid: ArchiveHeatmapCell[][] };

export function summarizeArchiveTags(posts: ArchivePost[]) {
	const counts = new Map<string, number>();
	for (const post of posts) for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
	return [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-CN"));
}

export function filterArchivePosts(posts: ArchivePost[], tag: string | null) {
	return posts.filter((post) => !tag || post.data.tags.includes(tag)).slice().sort((a, b) => b.data.published.getTime() - a.data.published.getTime());
}

export function groupArchivePosts(posts: ArchivePost[]): ArchiveTimeline {
	const years = new Map<number, Map<number, ArchivePost[]>>();
	for (const post of filterArchivePosts(posts, null)) {
		const year = post.data.published.getFullYear();
		const month = post.data.published.getMonth() + 1;
		const months = years.get(year) ?? new Map<number, ArchivePost[]>();
		months.set(month, [...(months.get(month) ?? []), post]);
		years.set(year, months);
	}
	const groups = [...years].sort(([a], [b]) => b - a).map(([year, months]) => {
		const monthGroups = [...months].sort(([a], [b]) => b - a).map(([month, items]) => ({ month, count: items.length, posts: items }));
		return { year, totalCount: monthGroups.reduce((sum, month) => sum + month.count, 0), months: monthGroups };
	});
	return { postCount: posts.length, yearCount: groups.length, years: groups };
}

export function getArchiveActivityDate(post: ArchivePost) {
	return post.data.updated ?? post.data.published;
}

export function buildArchiveHeatmaps(posts: ArchivePost[]): ArchiveHeatmapYear[] {
	const counts = new Map<number, number[][]>();
	for (const post of posts) {
		const date = getArchiveActivityDate(post);
		const year = date.getFullYear();
		const grid = counts.get(year) ?? Array.from({ length: 4 }, () => Array(12).fill(0));
		const period = Math.min(3, Math.floor((date.getDate() - 1) / 7));
		grid[period][date.getMonth()] += 1;
		counts.set(year, grid);
	}
	return [...counts].sort(([a], [b]) => b - a).map(([year, countsGrid]) => {
		const max = Math.max(1, ...countsGrid.flat());
		const grid = countsGrid.map((row, period) => row.map((count, month) => ({ month, period, count, level: count === 0 ? 0 : Math.max(1, Math.ceil((count / max) * 4)) }));
		return { year, grid };
	});
}
```

- [ ] **Step 4: 新增测试命令并确认绿灯**

在 `package.json` 的 `scripts` 中加入：

```json
"test:archive": "tsx tests/archive-utils.test.ts"
```

Run: `npm.cmd run test:archive`

Expected: 4 tests PASS，0 FAIL。

- [ ] **Step 5: 提交数据模型**

```powershell
git add package.json src/utils/archive-utils.ts tests/archive-utils.test.ts
git commit -m "feat: add archive data helpers"
```

### Task 2: 归档页面结构契约

**Files:**
- Modify: `tests/mikan-pages.test.ts`

- [ ] **Step 1: 写入失败的页面契约测试**

在 `tests/mikan-pages.test.ts` 末尾加入：

```ts
test("文章归档提供标签筛选、活动热力图和三级数量", () => {
	const page = readSource("src/pages/archive.astro");
	const panel = readSource("src/components/controls/ArchivePanel.svelte");
	assert.match(page, /<ArchivePanel/);
	assert.doesNotMatch(page, /banner-page-title-text/);
	assert.match(panel, /summarizeArchiveTags/);
	assert.match(panel, /data-archive-filter/);
	assert.match(panel, /data-archive-heatmap/);
	assert.match(panel, /archive-summary-count/);
	assert.match(panel, /yearGroup\.totalCount/);
	assert.match(panel, /monthGroup\.count/);
});

test("文章归档使用年、月、文章连续路径并支持键盘聚焦", () => {
	const panel = readSource("src/components/controls/ArchivePanel.svelte");
	assert.match(panel, /ap-year-block/);
	assert.match(panel, /ap-month-block/);
	assert.match(panel, /ap-highlight-svg/);
	assert.match(panel, /computeHighlight/);
	assert.match(panel, /on:focus=/);
	assert.match(panel, /on:blur=/);
});
```

- [ ] **Step 2: 运行页面测试并确认红灯**

Run: `npm.cmd run test:pages`

Expected: 既有测试通过，新归档测试因缺少筛选、热力图和连续路径标记而 FAIL。

### Task 3: 标签筛选、热力图和连续时间线界面

**Files:**
- Modify: `src/components/controls/ArchivePanel.svelte`
- Modify: `src/pages/archive.astro`

- [ ] **Step 1: 重建组件状态与数据流**

`ArchivePanel.svelte` 导入纯函数并建立响应式状态：

```ts
import { onMount, tick } from "svelte";
import {
	buildArchiveHeatmaps,
	filterArchivePosts,
	groupArchivePosts,
	summarizeArchiveTags,
	type ArchivePost,
} from "@/utils/archive-utils";

export let sortedPosts: ArchivePost[] = [];
let activeTag: string | null = null;
let filterOpen = false;
let selectedHeatmapYear = 0;
$: tagOptions = summarizeArchiveTags(sortedPosts);
$: filteredPosts = filterArchivePosts(sortedPosts, activeTag);
$: timeline = groupArchivePosts(filteredPosts);
$: heatmaps = buildArchiveHeatmaps(filteredPosts);
$: if (!heatmaps.some((item) => item.year === selectedHeatmapYear)) selectedHeatmapYear = heatmaps[0]?.year ?? 0;
$: activeHeatmap = heatmaps.find((item) => item.year === selectedHeatmapYear);
```

`onMount` 从 `location.search` 读取单一 `tag`，注册 `popstate` 与 `resize`，销毁时移除监听。选择标签时更新 `activeTag`，用 `history.pushState` 写入或清除 `?tag=`，关闭菜单并把热力图年份回到最新可用年份。

- [ ] **Step 2: 实现筛选器与热力图标记**

组件顶部使用以下稳定结构：

```svelte
<div class="archive-toolbar" data-archive-filter>
	<button type="button" class="archive-filter-trigger" aria-expanded={filterOpen} on:click|stopPropagation={() => filterOpen = !filterOpen}>
		归档 · {activeTag ?? "全部"}
	</button>
	{#if filterOpen}
		<div class="archive-filter-menu" role="menu">
			<button type="button" on:click={() => selectTag(null)}>归档 · 全部 <span>{sortedPosts.length}</span></button>
			{#each tagOptions as tag}
				<button type="button" class:active={activeTag === tag.name} on:click={() => selectTag(tag.name)}>#{tag.name} <span>{tag.count}</span></button>
			{/each}
		</div>
	{/if}
</div>

<section class="archive-heatmap" data-archive-heatmap aria-label="文章活动热力图">
	<header class="archive-heatmap-header">
		<h2>文章活动</h2>
		<div class="archive-heatmap-years">
			<button type="button" aria-label="上一年" on:click={() => changeHeatmapYear(1)} disabled={heatmapYearIndex >= heatmaps.length - 1}>‹</button>
			<span>{selectedHeatmapYear}</span>
			<button type="button" aria-label="下一年" on:click={() => changeHeatmapYear(-1)} disabled={heatmapYearIndex <= 0}>›</button>
		</div>
	</header>
	<div class="archive-heatmap-scroll">
		<div class="archive-heatmap-grid">
			<div class="archive-heatmap-months">{#each Array.from({ length: 12 }, (_, index) => index + 1) as month}<span>{month}</span>{/each}</div>
			{#each activeHeatmap?.grid ?? [] as row, period}
				<div class="archive-heatmap-row"><span>W{period + 1}</span>{#each row as cell}<span class={`archive-heatmap-cell level-${cell.level}`} title={`${cell.month + 1} 月第 ${cell.period + 1} 周：${cell.count} 篇文章`}></span>{/each}</div>
			{/each}
		</div>
	</div>
	<footer class="archive-heatmap-legend"><span>少</span>{#each [0, 1, 2, 3, 4] as level}<span class={`archive-heatmap-cell level-${level}`}></span>{/each}<span>多</span></footer>
</section>
```

热力图每个单元使用 `level-0` 至 `level-4`，`title` 为 `${month + 1} 月第 ${period + 1} 周：${count} 篇文章`。上一年和下一年按钮按 `heatmaps` 中的年份索引切换并在边界禁用。

- [ ] **Step 3: 实现统计与连续时间线**

时间线稳定结构：

```svelte
<div class="archive-summary">
	<span>{activeTag ? `标签 / #${activeTag}` : "归档 / 全部"}</span>
	<span class="archive-summary-count">{timeline.postCount} 篇文章 · {timeline.yearCount} 年</span>
</div>
{#each timeline.years as yearGroup}
	<section class="ap-year-block">
		<h2>{yearGroup.year}年 <small>共 {yearGroup.totalCount} 篇文章</small></h2>
		{#each yearGroup.months as monthGroup}
			<section class="ap-month-block">
				<h3>{monthGroup.month}月 <small>{monthGroup.count} 篇文章</small></h3>
				{#each monthGroup.posts as post}
					<a href={getPostUrlBySlug(post.id)} on:mouseenter={() => activatePost(post.id)} on:mouseleave={clearHighlight} on:focus={() => activatePost(post.id)} on:blur={clearHighlight}>
						{formatDate(post.data.published)} · {post.data.tags[0] ?? "未标签"} · {post.data.title}
					</a>
				{/each}
			</section>
		{/each}
	</section>
{/each}
{#if highlightPathD}<svg class="ap-highlight-svg" aria-hidden="true"><path d={highlightPathD} /></svg>{/if}
```

用 `use:` action 保存年份、月份和文章 DOM 引用；`computeHighlight` 读取节点中心坐标，生成带圆角弧线的单条 SVG path。筛选后清理引用和高亮状态；窗口尺寸变化时若仍有活动文章则重新计算。

- [ ] **Step 4: 完成组件样式与响应式**

组件内 CSS 使用这些关键约束：

```css
.archive-panel { position: relative; --tree-step: 2rem; }
.archive-heatmap-grid { min-width: 42rem; display: grid; gap: .3rem; }
.archive-heatmap-scroll { overflow-x: auto; }
.ap-year-block::before, .ap-month-block::before { border-left: 2px dashed var(--line-divider); }
.ap-highlight-svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.ap-highlight-svg path { fill: none; stroke: var(--primary); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
@media (max-width: 640px) {
	.archive-panel { --tree-step: 1.35rem; }
	.archive-filter-menu { left: 0; right: 0; max-height: 18rem; overflow-y: auto; }
	.archive-summary { align-items: flex-start; flex-direction: column; }
}
```

亮暗色只使用现有 `--card-bg`、`--line-divider`、`--primary` 与文本变量；标签色由稳定的索引调色板生成，不写入文章数据。

- [ ] **Step 5: 清理归档页无效脚本并运行绿灯**

从 `src/pages/archive.astro` 删除操作 `.banner-page-title-text` 的内联脚本，因为聚焦布局没有横幅标题。保留：

```astro
<ArchivePanel sortedPosts={sortedPostsList} client:only="svelte" />
```

Run:

```powershell
npm.cmd run test:archive
npm.cmd run test:pages
npm.cmd run check
```

Expected: 数据测试和页面测试全部 PASS；`astro check` 0 errors，允许仅保留改动前已有 hint。

- [ ] **Step 6: 提交归档界面**

```powershell
git add src/components/controls/ArchivePanel.svelte src/pages/archive.astro tests/mikan-pages.test.ts
git commit -m "feat: rebuild article archive timeline"
```

### Task 4: 文档同步、完整验证与视觉验收

**Files:**
- Modify: `CHANGELOG.md`
- Modify: `development-log.md`
- Modify: `docs/next-tasks.md`

- [ ] **Step 1: 同步公开变更说明**

在 `CHANGELOG.md` 的 `## Unreleased` → `### Changed` 顶部加入：`- 文章归档页新增文章活动热力图、URL 标签筛选、年/月/文章连续时间线，以及总结果、年份和月份三级文章数量。` 不记录参考站私人数据。

在 `development-log.md` 顶部追加当前时间条目，列出实际文件、红绿灯结果、完整验证、浏览器验收与未运行项。将 `docs/next-tasks.md` 的步骤按实际进度勾选；全部提交并 push 后清空当前目标，只保留使用规则。

- [ ] **Step 2: 运行完整自动验证**

按顺序运行，避免内容同步临时目录竞争：

```powershell
npm.cmd run sync:content
npm.cmd run validate:content
npm.cmd run test:archive
npm.cmd run test:content-model
npm.cmd run test:pages
npm.cmd run check
npm.cmd run build
```

Expected: 所有命令退出码 0；`astro check` 为 0 errors；生产构建生成 `/archive/index.html` 并完成 Pagefind 索引。

- [ ] **Step 3: 浏览器桌面验收**

启动或复用：

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 4321
```

在 `http://localhost:4321/archive/` 验证默认统计、标签菜单、热力图年份、筛选 URL、筛选联动、刷新恢复、未知标签空状态、hover/focus 连续线、文章跳转和控制台。切换亮暗色各检查一次。

- [ ] **Step 4: 浏览器移动端验收**

使用 390×844 视口验证菜单位于视口内、热力图自身滚动、页面级横向溢出为 0、三级数量可见、时间线缩进清晰和控制台无新增错误。

- [ ] **Step 5: 检查关键 diff 并提交文档**

```powershell
git diff --check
git status --short
git diff -- CHANGELOG.md development-log.md docs/next-tasks.md
git add CHANGELOG.md development-log.md docs/next-tasks.md docs/superpowers/plans/2026-06-29-mikan-article-archive.md
git commit -m "docs: record article archive rebuild"
```

- [ ] **Step 6: 推送并确认远端分支**

```powershell
git push origin codex/firefly-rebuild
git status --short
git ls-remote origin refs/heads/codex/firefly-rebuild
```

Expected: 工作树为空；远端分支提交哈希与本地 `HEAD` 一致。
