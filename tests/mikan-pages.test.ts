import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

function readSource(relativePath: string) {
	const fullPath = path.join(root, relativePath);
	assert.ok(existsSync(fullPath), `${relativePath} 应存在`);
	return readFileSync(fullPath, "utf8");
}

const focusedPages = [
	"src/pages/[...page].astro",
	"src/pages/404.astro",
	"src/pages/about.astro",
	"src/pages/archive.astro",
	"src/pages/categories/index.astro",
	"src/pages/friends.astro",
	"src/pages/guestbook.astro",
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

test("首页继续使用带横幅和双侧栏的 MainGridLayout", () => {
	const source = readSource("src/pages/index.astro");

	assert.match(source, /import MainGridLayout/);
	assert.match(source, /<MainGridLayout/);
	assert.doesNotMatch(source, /ContentGridLayout/);
});

test("所有非主页统一使用 ContentGridLayout", () => {
	for (const page of focusedPages) {
		const source = readSource(page);

		assert.match(source, /import ContentGridLayout/, `${page} 应导入 ContentGridLayout`);
		assert.match(source, /<ContentGridLayout/, `${page} 应使用 ContentGridLayout`);
		assert.doesNotMatch(source, /MainGridLayout/, `${page} 不应继续使用 MainGridLayout`);
	}
});

test("聚焦布局不渲染横幅和通用侧栏，但保留文章目录与浮动控件", () => {
	const source = readSource("src/layouts/ContentGridLayout.astro");

	assert.match(source, /contentOnly/);
	assert.match(source, /Navbar/);
	assert.match(source, /Footer/);
	assert.match(source, /FloatingControls/);
	assert.match(source, /SidebarTOC/);
	assert.doesNotMatch(source, /CategoryBar/);
	assert.doesNotMatch(source, /<SideBar/);
	assert.doesNotMatch(source, /wallpaper-wrapper/);
	assert.doesNotMatch(source, /banner-page-title/);
	assert.doesNotMatch(source, /Live2DWidget/);
	assert.doesNotMatch(source, /SpineModel/);
});

test("通用布局脚本不会给无侧栏页面重新添加侧栏网格", () => {
	const source = readSource("src/layouts/Layout.astro");

	assert.match(source, /sidebarPosition === "none"/);
	assert.match(source, /newGridClasses = "grid-cols-1"/);
});

test("聚焦布局为固定导航预留完整高度", () => {
	const source = readSource("src/layouts/ContentGridLayout.astro");

	assert.match(source, /:global\(body\.sticky-navbar\) \.focused-page-shell/);
	assert.match(source, /padding-top:\s*4\.5rem/);
});

test("收藏总览提供工具导航和摘录收藏入口", () => {
	const source = readSource("src/pages/resources/index.astro");

	assert.match(source, /工具导航/);
	assert.match(source, /摘录收藏/);
	assert.match(source, /resources\/tools/);
	assert.match(source, /resources\/clips/);
});

test("全站聚焦页面不再渲染导航下方通用分类快捷栏", () => {
	const layoutSource = readSource("src/layouts/ContentGridLayout.astro");
	assert.doesNotMatch(layoutSource, /showCategoryBar\?:\s*boolean/);
	assert.doesNotMatch(layoutSource, /siteConfig\.categoryBar/);
	assert.doesNotMatch(layoutSource, /category-bar-wrapper/);
	assert.doesNotMatch(layoutSource, /<CategoryBar/);

	for (const page of focusedPages) {
		const source = readSource(page);
		assert.doesNotMatch(source, /showCategoryBar=/, page + " 不应再传递通用分类栏开关");
	}
});

test("主导航把友邻升级为联系我下拉，并包含友链、留言和 QQ 群", () => {
	const source = readSource("src/config/navBarConfig.ts");
	const siteSource = readSource("src/config/siteConfig.ts");

	assert.match(source, /name:\s*"联系我"/);
	assert.match(source, /LinkPresets\.Friends/);
	assert.match(source, /LinkPresets\.Guestbook/);
	assert.match(source, /LinkPresets\.QQGroup/);
	assert.match(source, /name:\s*"友链"/);
	assert.match(source, /name:\s*"留言"/);
	assert.match(source, /name:\s*"QQ群"/);
	assert.match(siteSource, /guestbook:\s*true/);
	assert.doesNotMatch(source, /links\.push\(LinkPresets\.Friends\)/);
});

test("友链页只展示友链内容，不重复联系我入口", () => {
	const source = readSource("src/pages/friends.astro");

	assert.match(source, /const title = "友链"/);
	assert.match(source, /FRIENDS/);
	assert.doesNotMatch(source, /const contactEntries/);
	assert.doesNotMatch(source, /contactEntries\.map/);
	assert.doesNotMatch(source, /contact-entry/);
	assert.doesNotMatch(source, /id="friends-board"/);
});

test("友链标签筛选复用工具导航滑动胶囊", () => {
	const source = readSource("src/pages/friends.astro");

	assert.match(source, /data-friend-tab-nav/);
	assert.match(source, /data-friend-tab-indicator/);
	assert.match(source, /tools-tab-indicator/);
	assert.match(source, /updateIndicator\(targetButton\)/);
	assert.match(source, /window\.addEventListener\("resize"/);
	assert.match(source, /window\.removeEventListener\("resize"/);
	assert.match(source, /this\.addEventListener\("input", this\.handleInput\)/);
	assert.match(source, /this\.removeEventListener\("input", this\.handleInput\)/);
	assert.doesNotMatch(source, /input\.addEventListener\("input"/);
	assert.match(source, /data-search/);
	assert.match(source, /applyFilters\(\)/);
});

test("友链申请说明由友链页文档弹窗承载", () => {
	const pageSource = readSource("src/pages/friends.astro");
	const dialogSource = readSource("src/components/pages/FriendApplyDialog.astro");

	assert.match(pageSource, /FriendApplyDialog/);
	assert.match(pageSource, /data-open-friend-guide/);
	assert.match(pageSource, /aria-controls="friend-apply-dialog"/);
	assert.match(pageSource, /<FriendApplyDialog>[\s\S]*<Markdown/);
	assert.doesNotMatch(pageSource, /showCustomContent[\s\S]*<section class="relative z-10 mt-6/);
	assert.match(dialogSource, /<dialog/);
	assert.match(dialogSource, /aria-modal="true"/);
	assert.match(dialogSource, /data-close-friend-guide/);
	assert.match(dialogSource, /showModal\(\)/);
	assert.match(dialogSource, /dialog\.close\(\)/);
	assert.match(dialogSource, /::backdrop/);
});

test("留言页不再承载友链申请入口", () => {
	const source = readSource("src/pages/guestbook.astro");

	assert.doesNotMatch(source, /友链申请/);
	assert.doesNotMatch(source, /查看友链说明/);
	assert.doesNotMatch(source, /url\("\/friends\/"\)/);
	assert.doesNotMatch(source, /@\/utils\/url-utils/);
	assert.match(source, /随手留言/);
	assert.match(source, /私密信息/);
});

test("工具导航页按 kind 和分类读取资源", () => {
	const source = readSource("src/pages/resources/tools.astro");

	assert.match(source, /getMikanResourcesByKind\("tool"\)/);
	assert.match(source, /groupMikanResourcesByCategory/);
});

test("工具导航提供可访问分类标签、分组线、图标和外链箭头", () => {
	const source = readSource("src/pages/resources/tools.astro");

	assert.match(source, /tools-eyebrow-row/);
	assert.match(source, /MIKAN TOOLBOX/);
	assert.match(source, /data-tools-tab-nav/);
	assert.match(source, /data-tools-tab-indicator/);
	assert.match(source, /data-tools-section/);
	assert.match(source, /tools-category-line/);
	assert.match(source, /tools-card-jump-icon/);
	assert.match(source, /item\.icon/);
	assert.match(source, /aria-pressed/);
});

test("工具导航样式在桌面、平板和手机使用三二一列", () => {
	const source = readSource("src/styles/resources.css");

	assert.match(source, /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
	assert.match(source, /@media\s*\(max-width:\s*1024px\)/);
	assert.match(source, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
	assert.match(source, /@media\s*\(max-width:\s*640px\)/);
	assert.match(source, /grid-template-columns:\s*minmax\(0,\s*1fr\)/);
	assert.match(source, /tools-tab-indicator/);
	assert.match(source, /tools-card:hover \.tools-card-jump-icon/);
	assert.doesNotMatch(source, /var\(--content-(?:90|50|30)\)/);
});

test("摘录收藏页展示来源与适用场景", () => {
	const source = readSource("src/pages/resources/clips/index.astro");

	assert.match(source, /getMikanResourcesByKind\("clip"\)/);
	assert.match(source, /sourceName/);
	assert.match(source, /scenario/);
});

test("收藏总览与摘录收藏使用工具导航同款标题系统和 section 打底", () => {
	for (const page of [
		"src/pages/resources/index.astro",
		"src/pages/resources/clips/index.astro",
	]) {
		const source = readSource(page);

		assert.match(source, /resources-page card-base/, `${page} 应使用半透明 section 打底`);
		assert.match(source, /tools-eyebrow-row/, `${page} 应使用带图标的英文眉标`);
		assert.match(source, /tools-page-title/, `${page} 应复用工具导航标题字号`);
		assert.match(source, /tools-page-description/, `${page} 应复用工具导航描述节奏`);
		assert.doesNotMatch(source, /compact-page-header/, `${page} 不应继续使用旧紧凑标题区`);
		assert.doesNotMatch(source, /class="card-base px-6 py-7 sm:px-8 mb-4"/);
	}
});

test("联系我相关页面复用工具导航同款大标题系统", () => {
	for (const page of ["src/pages/friends.astro", "src/pages/guestbook.astro"]) {
		const source = readSource(page);

		assert.match(source, /resources-page card-base/, page + " 应使用半透明 section 打底");
		assert.match(source, /tools-eyebrow-row/, page + " 应使用带图标的英文眉标");
		assert.match(source, /tools-page-title/, page + " 应复用工具导航标题字号");
		assert.match(source, /tools-page-description/, page + " 应复用工具导航描述节奏");
		assert.doesNotMatch(source, /text-3xl font-bold/, page + " 不应继续使用旧页面内标题");
	}
});

test("主要非主页可见大标题统一使用工具导航同款标题系统", () => {
	for (const page of [
		"src/pages/about.astro",
		"src/pages/categories/index.astro",
		"src/pages/archive.astro",
		"src/pages/posts/index.astro",
		"src/pages/tags/index.astro",
		"src/pages/rss.astro",
		"src/pages/records/index.astro",
		"src/components/pages/AdvancedSearch.svelte",
	]) {
		const source = readSource(page);

		assert.match(source, /resources-page card-base/, page + " 应使用半透明 section 打底");
		assert.match(source, /tools-eyebrow-row/, page + " 应使用带图标的英文眉标");
		assert.match(source, /tools-page-title/, page + " 应复用工具导航标题字号");
		assert.match(source, /tools-page-description/, page + " 应复用工具导航描述节奏");
	}
});

test("留言页提供评论锚点和未配置评论系统时的说明", () => {
	const source = readSource("src/pages/guestbook.astro");

	assert.match(source, /id="guestbook-comments"/);
	assert.match(source, /Comment/);
	assert.match(source, /commentConfig/);
	assert.match(source, /留言系统暂未启用/);
});

test("摘录收藏分类标签和卡片交互与工具导航统一", () => {
	const pageSource = readSource("src/pages/resources/clips/index.astro");
	const styleSource = readSource("src/styles/resources.css");
	const clipActiveRule =
		/\.clip-filter-pill \.tools-tab-btn-active\s*\{(?<rule>[\s\S]*?)\}/.exec(styleSource)
			?.groups?.rule ?? "";

	assert.match(pageSource, /clip-filter-pill/);
	assert.match(pageSource, /data-clips-tab-nav/);
	assert.match(pageSource, /data-clips-tab-indicator/);
	assert.match(pageSource, /data-clips-tab=\{group\.category\}/);
	assert.match(pageSource, /data-clips-section=\{group\.category\}/);
	assert.match(pageSource, /href=\{getClipsCategoryUrl\(group\.category\)\}/);
	assert.match(pageSource, /history\.pushState/);
	assert.match(pageSource, /URLSearchParams/);
	assert.match(pageSource, /data-clips-filtered/);
	assert.match(pageSource, /tools-tab-btn tools-tab-btn-active/);
	assert.match(pageSource, /href=\{item\.url\}/);
	assert.match(pageSource, /class="clip-card group/);
	assert.doesNotMatch(pageSource, /class="clip-link\s/);
	assert.match(styleSource, /\.clip-filter-pill \.tools-tab-btn-active/);
	assert.match(clipActiveRule, /background:\s*linear-gradient\(135deg, #cf7958/);
	assert.doesNotMatch(clipActiveRule, /var\(--primary\)/);
	assert.match(styleSource, /\.clip-card:hover/);
	assert.match(styleSource, /box-shadow:\s*0 18px 44px/);
	assert.match(styleSource, /\[data-clips-filtered="true"\] \.tools-category-header/);
	assert.match(styleSource, /display:\s*none/);
	assert.match(styleSource, /\[data-clips-filtered="true"\] \.tools-category-group/);
	assert.match(styleSource, /margin-top:\s*0/);
});

test("收藏标题使用轻微正字距避免中文标题挤压", () => {
	const source = readSource("src/styles/resources.css");

	assert.match(source, /\.tools-page-title[\s\S]*letter-spacing:\s*0\.015em/);
	assert.doesNotMatch(source, /\.tools-page-title[\s\S]*letter-spacing:\s*-0\.055em/);
});

test("收藏导航保留主入口并提供两个子入口", () => {
	const source = readSource("src/config/navBarConfig.ts");

	assert.match(source, /收藏总览/);
	assert.match(source, /\/resources\/tools\//);
	assert.match(source, /\/resources\/clips\//);
});

test("足迹页使用三层归档分支结构", () => {
	const source = readSource("src/pages/records/index.astro");

	assert.match(source, /getMikanArchiveGroups\(\)/);
	assert.match(source, /archive-trunk/);
	assert.match(source, /archive-month-branch/);
	assert.match(source, /archive-record-branch/);
});

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
