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
	assert.match(source, /CategoryBar/);
	assert.match(source, /Footer/);
	assert.match(source, /FloatingControls/);
	assert.match(source, /SidebarTOC/);
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

test("收藏总览提供工具导航和摘录收藏入口", () => {
	const source = readSource("src/pages/resources/index.astro");

	assert.match(source, /工具导航/);
	assert.match(source, /摘录收藏/);
	assert.match(source, /resources\/tools/);
	assert.match(source, /resources\/clips/);
});

test("工具导航页按 kind 和分类读取资源", () => {
	const source = readSource("src/pages/resources/tools.astro");

	assert.match(source, /getMikanResourcesByKind\("tool"\)/);
	assert.match(source, /groupMikanResourcesByCategory/);
});

test("工具导航提供可访问分类标签、分组线、图标和外链箭头", () => {
	const source = readSource("src/pages/resources/tools.astro");

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

test("收藏总览与摘录收藏使用紧凑标题区", () => {
	for (const page of [
		"src/pages/resources/index.astro",
		"src/pages/resources/clips/index.astro",
	]) {
		const source = readSource(page);

		assert.match(source, /compact-page-header/, `${page} 应使用紧凑标题区`);
		assert.doesNotMatch(source, /class="card-base px-6 py-7 sm:px-8 mb-4"/);
	}
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
