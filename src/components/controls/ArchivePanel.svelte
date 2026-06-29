<script lang="ts">
import { onMount, tick } from "svelte";

import {
	buildArchiveHeatmaps,
	filterArchivePosts,
	groupArchivePosts,
	summarizeArchiveTags,
	type ArchivePost,
} from "@/utils/archive-utils";
import { getPostUrlBySlug } from "@/utils/url-utils";

export let sortedPosts: ArchivePost[] = [];
export let githubUsername = "";
export let githubProfile = "";

const months = Array.from({ length: 12 }, (_, index) => index + 1);
const githubMonths = Array.from({ length: 12 }, (_, index) => index + 1);
const levels = [0, 1, 2, 3, 4];
const tagColors = ["#d69b42", "#4eb69b", "#6f9ee8", "#d97fa8", "#8d83dc"];
const githubDayLabels = ["", "一", "", "三", "", "五", ""];

type GithubContributionDay = {
	date: string;
	count: number;
	level: number;
};

type GithubHeatmapCell = {
	date: string;
	count: number;
	level: number;
	visible: boolean;
};

let activeTag: string | null = null;
let activeCategory: string | null = null;
let showUncategorized = false;
let filterOpen = false;
let selectedHeatmapYear = 0;
let filterButtonEl: HTMLButtonElement;
let panelEl: HTMLElement;

let activePostId: string | null = null;
let highlightedYear: number | null = null;
let highlightedMonth: string | null = null;
let highlightPathD = "";
let githubWeeks: GithubHeatmapCell[][] = [];
let githubFetchState: "idle" | "loading" | "ready" | "error" = "idle";
let githubError = "";
let githubTotalContributions = 0;
let githubActiveDays = 0;

const yearNodeRefs = new Map<number, HTMLElement>();
const monthNodeRefs = new Map<string, HTMLElement>();
const postNodeRefs = new Map<string, HTMLElement>();

$: tagOptions = summarizeArchiveTags(sortedPosts);
$: filteredPosts = filterArchivePosts(
	sortedPosts,
	activeTag,
	activeCategory,
	showUncategorized,
);
$: timeline = groupArchivePosts(filteredPosts);
$: heatmaps = buildArchiveHeatmaps(filteredPosts);
$: heatmapYearIndex = heatmaps.findIndex(
	(item) => item.year === selectedHeatmapYear,
);
$: activeHeatmap = heatmaps.find(
	(item) => item.year === selectedHeatmapYear,
);
$: activeFilterLabel = activeTag
	? "标签"
	: activeCategory || showUncategorized
		? "分类"
		: "归档";
$: activeFilterValue = activeTag
	? `#${activeTag}`
	: activeCategory || (showUncategorized ? "未分类" : "全部");
$: githubLink = githubProfile || (githubUsername ? "https://github.com/" + githubUsername : "");
$: if (
	heatmaps.length > 0 &&
	!heatmaps.some((item) => item.year === selectedHeatmapYear)
) {
	selectedHeatmapYear = heatmaps[0].year;
}
$: if (heatmaps.length === 0 && selectedHeatmapYear !== 0) {
	selectedHeatmapYear = 0;
}

function formatDate(date: Date) {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${month}-${day}`;
}

function formatDateKey(date: Date) {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return date.getFullYear() + "-" + month + "-" + day;
}

function getGithubFallbackLevel(count: number, maxCount: number) {
	if (count <= 0) return 0;
	if (maxCount <= 1) return 1;
	const ratio = count / maxCount;
	if (ratio <= 0.25) return 1;
	if (ratio <= 0.5) return 2;
	if (ratio <= 0.75) return 3;
	return 4;
}

function getAlignedYearStart(year: number) {
	const start = new Date(year, 0, 1);
	const startDay = start.getDay();
	const startOffset = startDay === 0 ? -6 : 1 - startDay;
	start.setDate(start.getDate() + startOffset);
	return start;
}

function buildGithubWeeks(contributions: GithubContributionDay[]) {
	const now = new Date();
	const currentYear = now.getFullYear();
	const yearEnd = new Date(currentYear, 11, 31);
	const countByDate = new Map(contributions.map((day) => [day.date, day.count]));
	const levelByDate = new Map(contributions.map((day) => [day.date, day.level]));
	const maxCount = Math.max(1, ...contributions.map((day) => day.count));
	const weeks: GithubHeatmapCell[][] = [];
	const current = getAlignedYearStart(currentYear);

	while (current <= yearEnd || current.getDay() !== 1) {
		const week: GithubHeatmapCell[] = [];
		for (let day = 0; day < 7; day += 1) {
			const date = formatDateKey(current);
			const visible = current.getFullYear() === currentYear;
			const count = visible && current <= now ? (countByDate.get(date) ?? 0) : 0;
			const level = visible && current <= now
				? (levelByDate.get(date) ?? getGithubFallbackLevel(count, maxCount))
				: 0;
			week.push({ date, count, level, visible });
			current.setDate(current.getDate() + 1);
		}
		weeks.push(week);
		if (weeks.length > 54) break;
	}

	return weeks;
}

async function loadGithubContributions(signal: AbortSignal) {
	if (!githubUsername) return;
	githubFetchState = "loading";
	githubError = "";
	githubWeeks = buildGithubWeeks([]);

	try {
		const response = await fetch(
			"https://github-contributions-api.jogruber.de/v4/" + encodeURIComponent(githubUsername) + "?y=last",
			{ signal },
		);
		if (!response.ok) throw new Error("GitHub contributions API " + response.status);
		const data = await response.json();
		const contributions = (data.contributions ?? []).map(
			(day: { date: string; count: number; level?: number }): GithubContributionDay => ({
				date: day.date,
				count: day.count,
				level: day.level ?? 0,
			}),
		);

		githubTotalContributions = contributions.reduce((total, day) => total + day.count, 0);
		githubActiveDays = contributions.filter((day) => day.count > 0).length;
		githubWeeks = buildGithubWeeks(contributions);
		githubFetchState = "ready";
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") return;
		githubFetchState = "error";
		githubError = "GitHub 贡献数据暂时无法加载，点击可直接查看主页。";
	}
}

function getPrimaryTag(post: ArchivePost) {
	if (activeTag && post.data.tags.includes(activeTag)) return activeTag;
	return post.data.tags[0] ?? "未标签";
}

function getTagStyle(tag: string) {
	let hash = 0;
	for (const character of tag) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
	return `--archive-tag-color: ${tagColors[hash % tagColors.length]}`;
}

function readFiltersFromUrl() {
	const { searchParams } = new URL(window.location.href);
	const tag = searchParams.get("tag");
	const category = searchParams.get("category");
	activeTag = tag?.trim() || null;
	activeCategory = category?.trim() || null;
	showUncategorized = searchParams.has("uncategorized");
	selectedHeatmapYear = buildArchiveHeatmaps(
		filterArchivePosts(
			sortedPosts,
			activeTag,
			activeCategory,
			showUncategorized,
		),
	)[0]?.year ?? 0;
	clearHighlight();
}

function selectTag(tag: string | null) {
	activeTag = tag;
	activeCategory = null;
	showUncategorized = false;
	filterOpen = false;
	selectedHeatmapYear = buildArchiveHeatmaps(
		filterArchivePosts(sortedPosts, activeTag),
	)[0]?.year ?? 0;
	clearHighlight();

	const nextUrl = new URL(window.location.href);
	if (tag) nextUrl.searchParams.set("tag", tag);
	else nextUrl.searchParams.delete("tag");
	nextUrl.searchParams.delete("category");
	nextUrl.searchParams.delete("uncategorized");
	window.history.pushState({}, "", nextUrl);
	void tick().then(() => filterButtonEl?.focus());
}

function closeFilter() {
	filterOpen = false;
}

function handleKeydown(event: KeyboardEvent) {
	if (event.key !== "Escape" || !filterOpen) return;
	filterOpen = false;
	filterButtonEl?.focus();
}

function changeHeatmapYear(offset: number) {
	const nextIndex = heatmapYearIndex + offset;
	if (nextIndex < 0 || nextIndex >= heatmaps.length) return;
	selectedHeatmapYear = heatmaps[nextIndex].year;
}

function registerYearNode(node: HTMLElement, year: number) {
	yearNodeRefs.set(year, node);
	return { destroy: () => yearNodeRefs.delete(year) };
}

function registerMonthNode(
	node: HTMLElement,
	value: { year: number; month: number },
) {
	const key = `${value.year}-${value.month}`;
	monthNodeRefs.set(key, node);
	return { destroy: () => monthNodeRefs.delete(key) };
}

function registerPostNode(node: HTMLElement, postId: string) {
	postNodeRefs.set(postId, node);
	return { destroy: () => postNodeRefs.delete(postId) };
}

function findPostLocation(postId: string) {
	for (const yearGroup of timeline.years) {
		for (const monthGroup of yearGroup.months) {
			if (monthGroup.posts.some((post) => post.id === postId)) {
				return { year: yearGroup.year, month: monthGroup.month };
			}
		}
	}
	return null;
}

function getCenter(element: HTMLElement, parentRect: DOMRect) {
	const rect = element.getBoundingClientRect();
	return {
		x: rect.left - parentRect.left + rect.width / 2,
		y: rect.top - parentRect.top + rect.height / 2,
	};
}

async function computeHighlight(postId: string) {
	await tick();
	const location = findPostLocation(postId);
	if (!panelEl || !location) {
		clearHighlight();
		return;
	}

	const yearNode = yearNodeRefs.get(location.year);
	const monthNode = monthNodeRefs.get(`${location.year}-${location.month}`);
	const postNode = postNodeRefs.get(postId);
	if (!yearNode || !monthNode || !postNode) {
		clearHighlight();
		return;
	}

	const panelRect = panelEl.getBoundingClientRect();
	const year = getCenter(yearNode, panelRect);
	const month = getCenter(monthNode, panelRect);
	const post = getCenter(postNode, panelRect);
	const radius = Math.min(6, Math.max(3, (month.x - year.x) / 4));

	highlightedYear = location.year;
	highlightedMonth = `${location.year}-${location.month}`;
	highlightPathD = [
		`M ${year.x} ${year.y}`,
		`L ${year.x} ${month.y - radius}`,
		`Q ${year.x} ${month.y} ${year.x + radius} ${month.y}`,
		`L ${month.x - radius} ${month.y}`,
		`Q ${month.x} ${month.y} ${month.x} ${month.y + radius}`,
		`L ${month.x} ${post.y - radius}`,
		`Q ${month.x} ${post.y} ${month.x + radius} ${post.y}`,
		`L ${post.x} ${post.y}`,
	].join(" ");
}

function activatePost(postId: string) {
	activePostId = postId;
	void computeHighlight(postId);
}

function clearHighlight() {
	activePostId = null;
	highlightedYear = null;
	highlightedMonth = null;
	highlightPathD = "";
}

function handleResize() {
	if (activePostId) void computeHighlight(activePostId);
}

onMount(() => {
	readFiltersFromUrl();
	githubWeeks = buildGithubWeeks([]);
	const controller = new AbortController();
	void loadGithubContributions(controller.signal);
	window.addEventListener("popstate", readFiltersFromUrl);
	window.addEventListener("resize", handleResize);

	return () => {
		controller.abort();
		window.removeEventListener("popstate", readFiltersFromUrl);
		window.removeEventListener("resize", handleResize);
	};
});
</script>

<svelte:window on:click={closeFilter} on:keydown={handleKeydown} />

<div class="archive-panel" bind:this={panelEl}>
	<div class="archive-toolbar" data-archive-filter>
		<div class="archive-filter-wrap">
			<button
				bind:this={filterButtonEl}
				type="button"
				class="archive-filter-trigger"
				aria-haspopup="menu"
				aria-controls="archive-filter-menu"
				aria-expanded={filterOpen}
				on:click|stopPropagation={() => (filterOpen = !filterOpen)}
			>
				<span>归档 · {activeFilterValue.replace(/^#/, "")}</span>
				<svg viewBox="0 0 24 24" aria-hidden="true" class:open={filterOpen}>
					<path d="m7 10 5 5 5-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</button>

			{#if filterOpen}
				<div
					id="archive-filter-menu"
					class="archive-filter-menu"
					role="menu"
				>
					<button
						type="button"
						role="menuitem"
						class:active={!activeTag && !activeCategory && !showUncategorized}
						aria-current={!activeTag && !activeCategory && !showUncategorized ? "true" : undefined}
						on:click={() => selectTag(null)}
					>
						<span>归档 · 全部</span>
						<small>{sortedPosts.length}</small>
					</button>
					{#each tagOptions as tag}
						<button
							type="button"
							role="menuitem"
							class:active={activeTag === tag.name}
							aria-current={activeTag === tag.name ? "true" : undefined}
							on:click={() => selectTag(tag.name)}
						>
							<span>#{tag.name}</span>
							<small>{tag.count}</small>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div class="archive-heatmap-layout" data-archive-heatmap>
		<section class="archive-heatmap archive-heatmap--github" data-github-heatmap aria-label="GitHub 贡献热力图">
			<header class="archive-heatmap-header">
				<div>
					<p class="archive-section-eyebrow archive-section-eyebrow--github">GITHUB CONTRIBUTIONS</p>
					<h2>GitHub 贡献</h2>
				</div>
				{#if githubUsername}
					<a class="github-heatmap-profile" href={githubLink} target="_blank" rel="noopener noreferrer" aria-label={"打开 " + githubUsername + " 的 GitHub 主页"}>
						@{githubUsername}
					</a>
				{/if}
			</header>

			{#if githubUsername}
				<a class="github-heatmap-link" href={githubLink} target="_blank" rel="noopener noreferrer">
					<div class="github-heatmap-stats" aria-live="polite">
						{#if githubFetchState === "ready"}
							<span>{githubActiveDays}d · {githubTotalContributions} contributions</span>
						{:else if githubFetchState === "error"}
							<span>{githubError}</span>
						{:else}
							<span>正在连接 GitHub 贡献数据…</span>
						{/if}
					</div>
					<div class="github-heatmap-frame" data-github-heatmap-frame>
						<div class="github-heatmap-body">
							<div class="github-heatmap-months">
								{#each githubMonths as month}
									<span>{month}</span>
								{/each}
							</div>
							<div class="github-heatmap-grid-wrap">
								<div class="github-heatmap-days">
									{#each githubDayLabels as label}<span>{label}</span>{/each}
								</div>
								<div class="github-heatmap-grid">
									{#each githubWeeks as week}
										<div class="github-heatmap-week">
											{#each week as cell}
												<span
													class={"github-heatmap-cell level-" + cell.level}
													role="img"
													aria-label={cell.visible ? cell.date + "：" + cell.count + " 次贡献" : ""}
													title={cell.visible ? cell.date + "：" + cell.count + " 次贡献" : ""}
													style={cell.visible ? "" : "visibility: hidden"}
												></span>
											{/each}
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				</a>
				<footer class="archive-heatmap-legend github-heatmap-legend" aria-label="GitHub 贡献色阶">
					<span>少</span>
					{#each levels as level}
						<span class={"github-heatmap-cell level-" + level} aria-hidden="true"></span>
					{/each}
					<span>多</span>
				</footer>
			{:else}
				<p class="archive-empty-heatmap">还没有配置 GitHub 用户名。</p>
			{/if}
		</section>

		<section class="archive-heatmap archive-heatmap--posts" data-weekly-post-heatmap aria-label="周度文章分布热力图">
		<header class="archive-heatmap-header">
			<div>
				<p class="archive-section-eyebrow">POST ACTIVITY</p>
				<h2>文章分布</h2>
			</div>
			{#if heatmaps.length > 0}
				<div class="archive-heatmap-years">
					<button
						type="button"
						aria-label="上一年"
						on:click={() => changeHeatmapYear(1)}
						disabled={heatmapYearIndex >= heatmaps.length - 1}
					>‹</button>
					<span>{selectedHeatmapYear}</span>
					<button
						type="button"
						aria-label="下一年"
						on:click={() => changeHeatmapYear(-1)}
						disabled={heatmapYearIndex <= 0}
					>›</button>
				</div>
			{/if}
		</header>

		{#if activeHeatmap}
			<div class="archive-heatmap-scroll">
				<div class="archive-heatmap-grid">
					<div class="archive-heatmap-months">
						<span aria-hidden="true"></span>
						{#each months as month}<span>{month}</span>{/each}
					</div>
					{#each activeHeatmap.grid as row, period}
						<div class="archive-heatmap-row">
							<span class="archive-heatmap-week">W{period + 1}</span>
							{#each row as cell}
								<span
									class={`archive-heatmap-cell level-${cell.level}`}
									role="img"
									aria-label={`${cell.month + 1} 月第 ${cell.period + 1} 周：${cell.count} 篇文章`}
									title={`${cell.month + 1} 月第 ${cell.period + 1} 周：${cell.count} 篇文章`}
								></span>
							{/each}
						</div>
					{/each}
				</div>
			</div>
			<footer class="archive-heatmap-legend" aria-label="文章数量色阶">
				<span>少</span>
				{#each levels as level}
					<span class={`archive-heatmap-cell level-${level}`} aria-hidden="true"></span>
				{/each}
				<span>多</span>
			</footer>
		{:else}
			<p class="archive-empty-heatmap">当前筛选还没有可统计的文章活动。</p>
		{/if}
	</section>
	</div>

	<div class="archive-summary">
		<div>
			<span class="archive-summary-label">{activeFilterLabel}</span>
			<span class="archive-summary-divider">/</span>
			<strong>{activeFilterValue}</strong>
		</div>
		<span class="archive-summary-count">{timeline.postCount} 篇文章 · {timeline.yearCount} 年</span>
	</div>

	{#if timeline.years.length > 0}
		<div class="archive-timeline">
			{#each timeline.years as yearGroup}
				<section class="ap-year-block">
					<header class="ap-year-header">
						<div class="ap-node-column">
							<span
								class="ap-node ap-year-node"
								class:highlighted={highlightedYear === yearGroup.year}
								use:registerYearNode={yearGroup.year}
							></span>
						</div>
						<h2>{yearGroup.year}年 <small>共 {yearGroup.totalCount} 篇文章</small></h2>
					</header>

					<div class="ap-months">
						{#each yearGroup.months as monthGroup}
							<section class="ap-month-block">
								<header class="ap-month-header">
									<div class="ap-node-column">
										<span
											class="ap-node ap-month-node"
											class:highlighted={highlightedMonth === `${yearGroup.year}-${monthGroup.month}`}
											use:registerMonthNode={{ year: yearGroup.year, month: monthGroup.month }}
										></span>
									</div>
									<h3>{monthGroup.month}月 <small>{monthGroup.count} 篇文章</small></h3>
								</header>

								<div class="ap-posts">
									{#each monthGroup.posts as post}
										<div class="ap-post-row">
											<div class="ap-node-column">
												<span
													class="ap-node ap-post-node"
													class:highlighted={activePostId === post.id}
													use:registerPostNode={post.id}
												></span>
											</div>
											<a
												href={getPostUrlBySlug(post.id)}
												aria-label={post.data.title}
												on:mouseenter={() => activatePost(post.id)}
												on:mouseleave={clearHighlight}
												on:focus={() => activatePost(post.id)}
												on:blur={clearHighlight}
											>
												<time datetime={post.data.published.toISOString()}>{formatDate(post.data.published)}</time>
												<span class="ap-tag" style={getTagStyle(getPrimaryTag(post))}>{getPrimaryTag(post)}</span>
												<span class="ap-title">{post.data.title}</span>
											</a>
										</div>
									{/each}
								</div>
							</section>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	{:else}
		<div class="archive-empty-state">
			<strong>没有找到当前筛选下的文章</strong>
			<p>筛选条件可能已经调整，或者公开示例内容尚未包含该类型。</p>
			<button type="button" on:click={() => selectTag(null)}>查看全部文章</button>
		</div>
	{/if}

	{#if highlightPathD}
		<svg class="ap-highlight-svg" aria-hidden="true">
			<path d={highlightPathD}></path>
		</svg>
	{/if}
</div>

<style>
.archive-panel {
	--tree-step: 2rem;
	position: relative;
}

.archive-toolbar {
	display: flex;
	position: relative;
	z-index: 20;
	margin-bottom: 1rem;
}

.archive-filter-wrap {
	position: relative;
}

.archive-filter-trigger {
	display: inline-flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.85rem;
	min-width: 9.5rem;
	min-height: 2.6rem;
	padding: 0.55rem 0.8rem;
	border: 1px solid var(--line-divider);
	border-radius: 0.8rem;
	background: color-mix(in srgb, var(--card-bg) 90%, transparent);
	color: var(--deep-text);
	font-weight: 700;
	cursor: pointer;
	transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;
}

.archive-filter-trigger:hover,
.archive-filter-trigger:focus-visible {
	border-color: color-mix(in srgb, var(--primary) 55%, var(--line-divider));
	box-shadow: 0 8px 22px color-mix(in srgb, var(--primary) 10%, transparent);
	outline: none;
}

.archive-filter-trigger svg {
	width: 1rem;
	height: 1rem;
	transition: transform 160ms ease;
}

.archive-filter-trigger svg.open {
	transform: rotate(180deg);
}

.archive-filter-menu {
	position: absolute;
	top: calc(100% + 0.5rem);
	left: 0;
	width: min(18rem, 80vw);
	max-height: 22rem;
	overflow-y: auto;
	padding: 0.45rem;
	border: 1px solid var(--line-divider);
	border-radius: 0.9rem;
	background: color-mix(in srgb, var(--card-bg) 96%, transparent);
	box-shadow: 0 18px 44px color-mix(in srgb, black 18%, transparent);
	backdrop-filter: blur(18px);
}

.archive-filter-menu button {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	min-height: 2.4rem;
	padding: 0.5rem 0.65rem;
	border: 0;
	border-radius: 0.6rem;
	background: transparent;
	color: var(--content-meta);
	font-weight: 650;
	text-align: left;
	cursor: pointer;
}

.archive-filter-menu button:hover,
.archive-filter-menu button:focus-visible,
.archive-filter-menu button.active {
	background: color-mix(in srgb, var(--primary) 11%, transparent);
	color: var(--deep-text);
	outline: none;
}

.archive-filter-menu small {
	color: var(--content-meta);
	font-size: 0.72rem;
}

.archive-heatmap-layout {
	display: grid;
	grid-template-columns: minmax(0, 1.28fr) minmax(18rem, 0.92fr);
	gap: 1rem;
	margin-bottom: 1.6rem;
}

.archive-heatmap {
	position: relative;
	z-index: 1;
	min-width: 0;
	padding: 1rem 1rem 0.85rem;
	border: 1px solid var(--line-divider);
	border-radius: 1rem;
	background: color-mix(in srgb, var(--card-bg) 72%, transparent);
}

.archive-heatmap--github {
	background: linear-gradient(135deg, color-mix(in srgb, var(--card-bg) 80%, transparent), color-mix(in srgb, #0a8f55 5%, var(--card-bg)));
}

.archive-heatmap--posts {
	background: linear-gradient(135deg, color-mix(in srgb, var(--card-bg) 82%, transparent), color-mix(in srgb, #3d6fd7 6%, var(--card-bg)));
}

.archive-heatmap-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 1rem;
	margin-bottom: 0.85rem;
}

.archive-section-eyebrow {
	margin: 0 0 0.18rem;
	color: var(--primary);
	font-size: 0.64rem;
	font-weight: 800;
	letter-spacing: 0.12em;
}

.archive-section-eyebrow--github {
	color: #0b8f56;
}

:root.dark .archive-section-eyebrow--github {
	color: #22c77d;
}

.archive-heatmap h2 {
	margin: 0;
	color: var(--deep-text);
	font-size: 1rem;
	font-weight: 800;
}

.archive-heatmap-years {
	display: flex;
	align-items: center;
	gap: 0.35rem;
}

.archive-heatmap-years button {
	display: grid;
	width: 1.75rem;
	height: 1.75rem;
	place-items: center;
	border: 1px solid var(--line-divider);
	border-radius: 0.5rem;
	background: var(--card-bg);
	color: var(--deep-text);
	font-size: 1.15rem;
	cursor: pointer;
}

.archive-heatmap-years button:disabled {
	opacity: 0.32;
	cursor: not-allowed;
}

.archive-heatmap-years span {
	min-width: 3rem;
	color: var(--deep-text);
	font-size: 0.78rem;
	font-weight: 800;
	text-align: center;
	font-variant-numeric: tabular-nums;
}

.github-heatmap-profile {
	flex: 0 0 auto;
	border-radius: 999px;
	padding: 0.3rem 0.55rem;
	color: #0b8f56;
	background: color-mix(in srgb, #0b8f56 9%, transparent);
	font-size: 0.72rem;
	font-weight: 800;
	text-decoration: none;
}

.github-heatmap-link {
	display: block;
	color: inherit;
	text-decoration: none;
}

.github-heatmap-stats {
	min-height: 1rem;
	margin: -0.25rem 0 0.45rem 2.4rem;
	color: var(--content-meta);
	font-size: 0.66rem;
	font-variant-numeric: tabular-nums;
}

.github-heatmap-frame {
	display: flex;
	justify-content: center;
	overflow-x: auto;
	padding: 0 0.05rem 0.28rem;
}

.github-heatmap-body {
	width: 100%;
	min-width: 42rem;
	max-width: 48rem;
}

.github-heatmap-months {
	display: grid;
	grid-template-columns: repeat(12, minmax(0, 1fr));
	gap: 0.36rem;
	margin: 0 0 0.3rem 2.35rem;
	color: var(--content-meta);
	font-size: 0.64rem;
}

.github-heatmap-months span {
	text-align: center;
}

.github-heatmap-grid-wrap {
	display: grid;
	grid-template-columns: 1.95rem minmax(0, 1fr);
	align-items: flex-start;
	gap: 0.4rem;
}

.github-heatmap-days {
	display: grid;
	grid-template-rows: repeat(7, minmax(0.72rem, 1fr));
	gap: 0.18rem;
	color: var(--content-meta);
	font-size: 0.64rem;
	line-height: 1;
	text-align: right;
}

.github-heatmap-days span {
	display: grid;
	place-items: center end;
}

.github-heatmap-grid {
	display: grid;
	grid-template-columns: repeat(53, minmax(0.56rem, 1fr));
	gap: 0.18rem;
}

.github-heatmap-week {
	display: grid;
	grid-template-rows: repeat(7, minmax(0.72rem, 1fr));
	gap: 0.18rem;
}

.github-heatmap-cell {
	display: block;
	width: 100%;
	aspect-ratio: 1;
	min-width: 0.56rem;
	border-radius: 0.2rem;
	background: color-mix(in srgb, var(--line-divider) 70%, transparent);
	transition: transform 150ms ease, outline-color 150ms ease;
}

.github-heatmap-cell[role="img"]:hover {
	position: relative;
	z-index: 2;
	transform: scale(1.35);
	outline: 2px solid color-mix(in srgb, #0b8f56 65%, transparent);
}

.github-heatmap-cell.level-1 { background: color-mix(in srgb, #0b8f56 28%, var(--card-bg)); }
.github-heatmap-cell.level-2 { background: color-mix(in srgb, #0b8f56 50%, var(--card-bg)); }
.github-heatmap-cell.level-3 { background: color-mix(in srgb, #0b8f56 72%, var(--card-bg)); }
.github-heatmap-cell.level-4 { background: #09935a; }

.archive-heatmap-scroll {
	overflow-x: auto;
	padding-bottom: 0.3rem;
}

.archive-heatmap-grid {
	display: grid;
	min-width: 26rem;
	gap: 0.3rem;
}

.archive-heatmap-months,
.archive-heatmap-row {
	display: grid;
	grid-template-columns: 2.2rem repeat(12, minmax(1.35rem, 1fr));
	gap: 0.3rem;
}

.archive-heatmap-months span,
.archive-heatmap-week {
	color: var(--content-meta);
	font-size: 0.65rem;
	text-align: center;
}

.archive-heatmap-week {
	display: grid;
	place-items: center end;
	padding-right: 0.15rem;
}

.archive-heatmap-cell {
	display: block;
	min-width: 0.8rem;
	height: 1.45rem;
	border-radius: 0.36rem;
	background: color-mix(in srgb, var(--line-divider) 68%, transparent);
	transition: transform 150ms ease, outline-color 150ms ease;
}

.archive-heatmap-cell[role="img"]:hover {
	position: relative;
	z-index: 2;
	transform: scale(1.13);
	outline: 2px solid color-mix(in srgb, var(--primary) 70%, transparent);
}

.archive-heatmap-cell.level-1 { background: color-mix(in srgb, var(--primary) 22%, var(--card-bg)); }
.archive-heatmap-cell.level-2 { background: color-mix(in srgb, var(--primary) 42%, var(--card-bg)); }
.archive-heatmap-cell.level-3 { background: color-mix(in srgb, var(--primary) 66%, var(--card-bg)); }
.archive-heatmap-cell.level-4 { background: var(--primary); }

.archive-heatmap-legend {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 0.28rem;
	margin-top: 0.55rem;
	color: var(--content-meta);
	font-size: 0.62rem;
}

.github-heatmap-legend .github-heatmap-cell {
	width: 0.7rem;
	height: 0.7rem;
}

.archive-heatmap-legend .archive-heatmap-cell {
	width: 0.7rem;
	height: 0.7rem;
	border-radius: 0.22rem;
}

.archive-empty-heatmap {
	margin: 0;
	padding: 1.2rem 0;
	color: var(--content-meta);
	font-size: 0.85rem;
	text-align: center;
}

.archive-summary {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	margin: 0.25rem 0 1.75rem;
	padding: 0 0.35rem;
	color: var(--content-meta);
	font-size: 0.83rem;
}

.archive-summary strong {
	color: var(--deep-text);
	font-weight: 800;
}

.archive-summary-divider {
	margin: 0 0.65rem;
	color: var(--line-divider);
}

.archive-summary-count {
	font-variant-numeric: tabular-nums;
}

.archive-timeline {
	position: relative;
}

.ap-year-block {
	position: relative;
	margin-bottom: 2.4rem;
}

.ap-year-block:last-child {
	margin-bottom: 0;
}

.ap-year-block::before,
.ap-month-block::before {
	content: "";
	position: absolute;
	left: 0.55rem;
	top: 0.85rem;
	bottom: 0.7rem;
	border-left: 2px dashed var(--line-divider);
}

.ap-year-header,
.ap-month-header,
.ap-post-row {
	display: flex;
	position: relative;
	align-items: center;
	min-height: 2.2rem;
}

.ap-node-column {
	display: block;
	position: relative;
	width: 1.1rem;
	height: 100%;
	min-height: 2.2rem;
	flex: 0 0 1.1rem;
}

.ap-node {
	position: absolute;
	top: 50%;
	left: 50%;
	z-index: 4;
	width: 0.42rem;
	height: 0.42rem;
	border-radius: 999px;
	background: var(--line-divider);
	transform: translate(-50%, -50%);
	transition: background 150ms ease, box-shadow 150ms ease, transform 150ms ease;
}

.ap-year-node {
	width: 0.72rem;
	height: 0.72rem;
	border: 2px solid var(--line-divider);
	background: var(--card-bg);
}

.ap-month-node {
	width: 0.54rem;
	height: 0.54rem;
}

.ap-node.highlighted {
	background: var(--primary);
	border-color: var(--primary);
	box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary) 13%, transparent);
	transform: translate(-50%, -50%) scale(1.08);
}

.ap-year-header h2,
.ap-month-header h3 {
	display: flex;
	align-items: baseline;
	gap: 0.65rem;
	margin: 0 0 0 0.55rem;
	color: var(--deep-text);
}

.ap-year-header h2 {
	font-size: 1.35rem;
	font-weight: 850;
}

.ap-month-header h3 {
	font-size: 1rem;
	font-weight: 800;
}

.ap-year-header small,
.ap-month-header small {
	color: var(--content-meta);
	font-size: 0.72rem;
	font-weight: 500;
}

.ap-months,
.ap-posts {
	margin-left: var(--tree-step);
}

.ap-month-block {
	position: relative;
	padding: 0.15rem 0 1rem;
}

.ap-month-block:last-child {
	padding-bottom: 0;
}

.ap-month-header::before,
.ap-post-row::before {
	content: "";
	position: absolute;
	top: 50%;
	left: calc(-1 * var(--tree-step) + 0.55rem);
	width: var(--tree-step);
	border-top: 2px dashed var(--line-divider);
	transform: translateY(-50%);
}

.ap-post-row {
	min-height: 2.5rem;
}

.ap-post-row a {
	display: flex;
	position: relative;
	z-index: 4;
	align-items: center;
	gap: 0.65rem;
	min-width: 0;
	min-height: 2.25rem;
	flex: 1;
	padding: 0.3rem 0.65rem;
	border-radius: 0.65rem;
	color: var(--deep-text);
	text-decoration: none;
	transition: background 150ms ease, color 150ms ease, transform 150ms ease;
}

.ap-post-row a:hover,
.ap-post-row a:focus-visible {
	background: color-mix(in srgb, var(--primary) 8%, transparent);
	color: var(--primary);
	transform: translateX(0.2rem);
	outline: none;
}

.ap-post-row time {
	width: 2.8rem;
	flex: 0 0 2.8rem;
	color: var(--content-meta);
	font-size: 0.8rem;
	font-variant-numeric: tabular-nums;
	text-align: right;
}

.ap-tag {
	flex: 0 0 auto;
	color: var(--archive-tag-color);
	font-size: 0.75rem;
	font-weight: 800;
}

.ap-title {
	min-width: 0;
	overflow: hidden;
	font-size: 0.86rem;
	font-weight: 600;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.ap-highlight-svg {
	position: absolute;
	inset: 0;
	z-index: 3;
	width: 100%;
	height: 100%;
	overflow: visible;
	pointer-events: none;
}

.ap-highlight-svg path {
	fill: none;
	stroke: var(--primary);
	stroke-width: 3;
	stroke-linecap: round;
	stroke-linejoin: round;
	filter: drop-shadow(0 0 3px color-mix(in srgb, var(--primary) 28%, transparent));
}

.archive-empty-state {
	padding: 2.4rem 1rem;
	border: 1px dashed var(--line-divider);
	border-radius: 1rem;
	color: var(--content-meta);
	text-align: center;
}

.archive-empty-state strong {
	display: block;
	color: var(--deep-text);
}

.archive-empty-state p {
	margin: 0.55rem 0 1rem;
	font-size: 0.82rem;
}

.archive-empty-state button {
	padding: 0.55rem 0.85rem;
	border: 0;
	border-radius: 0.65rem;
	background: var(--primary);
	color: white;
	font-weight: 750;
	cursor: pointer;
}

@media (max-width: 640px) {
	.archive-panel {
		--tree-step: 1.35rem;
	}

	.archive-heatmap-layout {
		grid-template-columns: minmax(0, 1fr);
		gap: 0.9rem;
	}

	.archive-filter-wrap,
	.archive-filter-trigger {
		width: 100%;
	}

	.archive-filter-menu {
		width: 100%;
		max-height: 18rem;
	}

	.archive-heatmap {
		margin-inline: -0.25rem;
		padding-inline: 0.75rem;
	}

	.github-heatmap-body {
		min-width: 38rem;
	}

	.github-heatmap-frame {
		justify-content: flex-start;
	}

	.archive-heatmap-grid {
		min-width: 25rem;
	}

	.archive-heatmap-months,
	.archive-heatmap-row {
		grid-template-columns: 2rem repeat(12, minmax(1.32rem, 1fr));
		gap: 0.22rem;
	}

	.archive-heatmap-cell {
		height: 1.3rem;
	}

	.archive-summary {
		align-items: flex-start;
		flex-direction: column;
		gap: 0.35rem;
	}

	.ap-year-header h2 {
		font-size: 1.18rem;
	}

	.ap-year-header h2,
	.ap-month-header h3 {
		gap: 0.45rem;
	}

	.ap-post-row a {
		gap: 0.45rem;
		padding-right: 0.2rem;
	}

	.ap-post-row time {
		width: 2.55rem;
		flex-basis: 2.55rem;
		font-size: 0.74rem;
	}

	.ap-tag {
		font-size: 0.7rem;
	}

	.ap-title {
		font-size: 0.8rem;
	}
}
</style>
