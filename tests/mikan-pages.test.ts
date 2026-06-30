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
	"src/pages/calendar.astro",
	"src/pages/friends.astro",
	"src/pages/guestbook.astro",
	"src/pages/posts/[...slug].astro",
	"src/pages/posts/index.astro",
	"src/pages/resources/tools.astro",
	"src/pages/resources/clips/index.astro",
	"src/pages/rss.astro",
	"src/pages/search.astro",
	"src/pages/site.astro",
];

test("首页使用角色空间专用布局并保留真实导航", () => {
	const source = readSource("src/pages/index.astro");
	const siteConfigSource = readSource("src/config/siteConfig.ts");

	assert.match(source, /import Layout/);
	assert.match(source, /import Navbar/);
	assert.match(source, /import Footer/);
	assert.match(source, /import FloatingControls/);
	assert.match(source, /<Layout[\s\S]*contentOnly/);
	assert.match(source, /<Navbar/);
	assert.match(source, /id="main-grid"/);
	assert.match(source, /id="swup-container"/);
	assert.match(source, /id="content-wrapper"/);
	assert.doesNotMatch(source, /ContentGridLayout/);
	assert.doesNotMatch(source, /import MainGridLayout/);
	assert.doesNotMatch(source, /<MainGridLayout/);
	assert.match(siteConfigSource, /type:\s*"image"/);
	assert.match(siteConfigSource, /assets\/home\/mikan-avatar\.webp/);
});

test("首页顶部导航使用浅色胶囊样式并保留原导航图标", () => {
	const source = readSource("src/pages/index.astro");
	const navbarSource = readSource("src/components/layout/DropdownMenu.astro");
	const styleSource = readSource("src/styles/navbar.css");

	assert.match(source, /home-top-row--light/);
	assert.match(source, /--mikan-navbar-bg/);
	assert.match(source, /width:\s*min\(96vw,\s*118rem\)/);
	assert.match(styleSource, /#navbar>div\s*\{[\s\S]*border-radius:\s*calc\(var\(--mikan-navbar-height\) \/ 2\)/);
	assert.match(styleSource, /backdrop-filter:\s*blur\(22px\)/);
	assert.match(navbarSource, /navbar-menu-icon/);
	assert.doesNotMatch(source, /navbar-menu-icon[\s\S]{0,160}display:\s*none/);
});

test("首页第二屏内容滚动到位后再逐步显现", () => {
	const source = readSource("src/pages/index.astro");

	assert.match(source, /data-home-reveal/);
	assert.doesNotMatch(source, /\[data-home-reveal\]\s*\{[\s\S]{0,120}opacity:\s*0/);
	assert.match(source, /\[data-home-reveal\]\s*\{[\s\S]*opacity:\s*1/);
	assert.match(source, /\[data-home-reveal\]\.home-reveal-pending\s*\{[\s\S]*opacity:\s*0/);
	assert.match(source, /item\.classList\.add\("home-reveal-pending"\)/);
	assert.match(source, /item\.closest\("\.home-hero"\)/);
	assert.match(source, /rootMargin:\s*"0px 0px -28% 0px"/);
	assert.match(source, /threshold:\s*0\.24/);
	assert.doesNotMatch(source, /closest\("#home-second-screen"\)/);
});

test("首页头像、状态胶囊和主标题共用左侧视觉轴线", () => {
	const source = readSource("src/pages/index.astro");
	const statusRule = /\.home-avatar-status\s*\{(?<rule>[\s\S]*?)\n\t\}/.exec(source)?.groups?.rule ?? "";

	assert.match(source, /\.home-avatar-wrap\s*\{[\s\S]*width:\s*11rem/);
	assert.match(source, /\.home-avatar-wrap\s*\{[\s\S]*height:\s*11rem/);
	assert.match(source, /\.home-avatar-wrap\s*\{[\s\S]*margin:\s*0\s+0\s+1\.6rem\s+0/);
	assert.match(statusRule, /left:\s*calc\(100% - 2\.35rem\)/);
	assert.match(statusRule, /width:\s*2\.35rem/);
	assert.match(statusRule, /height:\s*2\.35rem/);
	assert.match(source, /\.home-avatar-status:hover,\s*\.home-avatar-status:focus-visible\s*\{[\s\S]*width:\s*15\.25rem/);
	assert.match(source, /\.home-avatar-status:hover,\s*\.home-avatar-status:focus-visible\s*\{[\s\S]*transform:\s*translateX\(0\.45rem\)/);
	assert.doesNotMatch(statusRule, /right:/);
});

test("首页状态胶囊展开不再被头像圆形遮罩裁掉", () => {
	const source = readSource("src/pages/index.astro");
	const avatarWrapRule = /\.home-avatar-wrap\s*\{(?<rule>[\s\S]*?)\n\t\}/.exec(source)?.groups?.rule ?? "";
	const statusRule = /\.home-avatar-status\s*\{(?<rule>[\s\S]*?)\n\t\}/.exec(source)?.groups?.rule ?? "";

	assert.match(source, /class="home-avatar-mask"[\s\S]*data-home-reveal[\s\S]*data-reveal-kind="iris"/);
	assert.match(avatarWrapRule, /overflow:\s*visible/);
	assert.match(avatarWrapRule, /z-index:\s*12/);
	assert.match(statusRule, /z-index:\s*14/);
	assert.doesNotMatch(source, /\[data-reveal-kind="iris"\]\.is-visible\s*\{[\s\S]*circle\(80% at 50% 50%\)/);
});

test("首页角色线稿只服务首屏并裁掉向下溢出的部分", () => {
	const source = readSource("src/pages/index.astro");
	const heroRule = /\.home-hero\s*\{(?<rule>[\s\S]*?)\n\t\}/.exec(source)?.groups?.rule ?? "";
	const artRule = /\.home-art-stage\s*\{(?<rule>[\s\S]*?)\n\t\}/.exec(source)?.groups?.rule ?? "";
	const heroArtRule = /\.home-hero-art\s*\{(?<rule>[\s\S]*?)\n\t\}/.exec(source)?.groups?.rule ?? "";
	const mobileArtRule = /@media \(max-width: 960px\)[\s\S]*?\.home-art-stage\s*\{(?<rule>[\s\S]*?)\n\t\t\}/.exec(source)?.groups?.rule ?? "";

	assert.match(heroRule, /min-height:\s*100svh/);
	assert.match(heroRule, /overflow:\s*hidden/);
	assert.match(artRule, /bottom:\s*-1\.2rem/);
	assert.match(artRule, /width:\s*min\(56rem,\s*54vw\)/);
	assert.match(heroArtRule, /animation:\s*homeArtFloat\s+9s\s+ease-in-out\s+infinite/);
	assert.match(source, /@keyframes homeArtFloat/);
	assert.match(source, /translate3d\(-0\.45rem,\s*-0\.7rem,\s*0\)/);
	assert.match(mobileArtRule, /position:\s*absolute/);
	assert.match(mobileArtRule, /bottom:\s*-5\.5rem/);
	assert.doesNotMatch(artRule, /bottom:\s*-7\.2rem/);
	assert.doesNotMatch(mobileArtRule, /position:\s*relative/);
});

test("首页卡片显现遮罩保留圆角并避免方形阴影边", () => {
	const source = readSource("src/pages/index.astro");

	assert.match(source, /--home-card-radius:\s*1\.7rem/);
	assert.match(source, /--reveal-radius:\s*var\(--home-card-radius\)/);
	assert.match(source, /\[data-home-reveal\]\.is-visible\s*\{[\s\S]*round var\(--reveal-radius/);
	assert.match(source, /\.home-gateway-card::after\s*\{[\s\S]*border-radius:\s*inherit/);
	assert.doesNotMatch(source, /\[data-home-reveal\]\.is-visible\s*\{[\s\S]*round 0/);
});

test("首页资源轨道数字居中且标签只在上半区旋转入场", () => {
	const source = readSource("src/pages/index.astro");
	const orbitCenterRule = /\.home-orbit-center\s*\{(?<rule>[\s\S]*?)\n\t\}/.exec(source)?.groups?.rule ?? "";
	const orbitChipRule = /\.home-orbit-chip\s*\{(?<rule>[\s\S]*?)\n\t\}/.exec(source)?.groups?.rule ?? "";
	const orbitFieldRule = /\.home-orbit-field\s*\{(?<rule>[\s\S]*?)\n\t\}/.exec(source)?.groups?.rule ?? "";
	const visitCapsuleRule = /\.home-visit-capsule\s*\{(?<rule>[\s\S]*?)\n\t\}/.exec(source)?.groups?.rule ?? "";

	assert.match(source, /featuredResources\.slice\(0,\s*4\)/);
	assert.match(source, /const orbitChipAngles = \[-152, -134, -46, -28\]/);
	assert.match(source, /--chip-angle:\s*\$\{orbitChipAngles\[index\]\}deg/);
	assert.match(orbitCenterRule, /align-content:\s*center/);
	assert.match(orbitCenterRule, /justify-items:\s*center/);
	assert.match(orbitFieldRule, /min-height:\s*22rem/);
	assert.match(orbitChipRule, /--angle:\s*var\(--chip-angle\)/);
	assert.match(orbitChipRule, /translateX\(15\.8rem\)/);
	assert.match(visitCapsuleRule, /bottom:\s*1\.25rem/);
	assert.match(source, /\.home-reveal-pending\s+\.home-orbit-chip\s*\{/);
});

test("首页入口卡片提供鼠标跟随倾斜和厚玻璃 hover 反馈", () => {
	const source = readSource("src/pages/index.astro");
	const gatewayGridRule = /\.home-gateway-grid\s*\{(?<rule>[\s\S]*?)\n\t\}/.exec(source)?.groups?.rule ?? "";
	const gatewayCardRule = /\.home-gateway-card\s*\{(?<rule>[\s\S]*?)\n\t\}/.exec(source)?.groups?.rule ?? "";

	assert.match(gatewayGridRule, /perspective:\s*70rem/);
	assert.match(gatewayCardRule, /--tilt-x:\s*0deg/);
	assert.match(gatewayCardRule, /--tilt-y:\s*0deg/);
	assert.match(gatewayCardRule, /radial-gradient\(circle at var\(--glow-x\) var\(--glow-y\)/);
	assert.match(gatewayCardRule, /backdrop-filter:\s*blur\(18px\)/);
	assert.match(gatewayCardRule, /inset 0 1px 0 rgba\(255,\s*255,\s*255,\s*0\.72\)/);
	assert.match(gatewayCardRule, /rotateX\(var\(--tilt-x\)\)/);
	assert.match(gatewayCardRule, /rotateY\(var\(--tilt-y\)\)/);
	assert.match(source, /\.home-gateway-card\[data-home-reveal\]\.is-visible\s*\{[\s\S]*rotateX\(var\(--tilt-x\)\)/);
	assert.match(source, /\.home-gateway-card\[data-home-reveal\]\.is-visible\.is-interacting\s*\{[\s\S]*transition-delay:\s*0ms/);
	assert.match(source, /querySelectorAll\("\.home-gateway-card"\)/);
	assert.match(source, /addEventListener\("pointermove"/);
	assert.match(source, /classList\.add\("is-interacting"\)/);
	assert.match(source, /style\.setProperty\("--tilt-x"/);
	assert.match(source, /style\.setProperty\("--glow-x"/);
	assert.match(source, /dataset\.tiltBound/);
});

test("全站主导航统一使用首页同款胶囊与同心圆激活底", () => {
	const layoutSource = readSource("src/layouts/ContentGridLayout.astro");
	const navbarSource = readSource("src/components/layout/Navbar.astro");
	const dropdownSource = readSource("src/components/layout/DropdownMenu.astro");
	const styleSource = readSource("src/styles/navbar.css");

	assert.match(layoutSource, /mikan-glass-top-row/);
	assert.match(navbarSource, /data-current-path/);
	assert.match(navbarSource, /isNavLinkActive/);
	assert.match(dropdownSource, /isActive/);
	assert.match(dropdownSource, /aria-current=\{isActive/);
	assert.match(dropdownSource, /navbar-nav-item/);
	assert.match(dropdownSource, /navbar-nav-item--active/);
	assert.match(styleSource, /--mikan-navbar-height:\s*4\.8rem/);
	assert.match(styleSource, /#navbar-wrapper #navbar > div\s*\{[\s\S]*border-radius:\s*calc\(var\(--mikan-navbar-height\) \/ 2\)/);
	assert.match(styleSource, /\.navbar-nav-item,\s*#navbar \.btn-plain\s*\{[\s\S]*border-radius:\s*calc\(var\(--mikan-navbar-control-height\) \/ 2\)/);
	assert.match(styleSource, /\.navbar-nav-item--active\s*\{[\s\S]*border-radius:\s*calc\(var\(--mikan-navbar-control-height\) \/ 2\)/);
	assert.doesNotMatch(dropdownSource, /rounded-lg/);
});

test("首页角色视觉使用透明线稿和圆形头像资产", () => {
	const source = readSource("src/pages/index.astro");

	assert.match(source, /mikanAvatar/);
	assert.match(source, /animeLineart/);
	assert.match(source, /class="home-avatar/);
	assert.match(source, /class="home-hero-art/);
	assert.match(source, /src=\{animeLineart\.src\}/);
	assert.doesNotMatch(source, /anime_avatar_expanded_4x_darker_lines/);
	assert.doesNotMatch(source, /anime_lineart_transparent/);
});

test("首页内容区使用真实数据映射且访问量不伪造", () => {
	const source = readSource("src/pages/index.astro");

	assert.match(source, /getSortedPostsList/);
	assert.match(source, /getMikanResources/);
	assert.match(source, /getMikanFriends/);
	assert.match(source, /getMikanUpdates/);
	assert.match(source, /siteConfig\.siteStartDate/);
	assert.match(source, /featuredResources/);
	assert.match(source, /siteRunningDays/);
	assert.match(source, /latestActivityLabel/);
	assert.match(source, /统计未接入/);
	assert.doesNotMatch(source, /12,846/);
	assert.doesNotMatch(source, /今日 128/);
});

test("首页提供遮罩入场、滚动显现和低动态偏好保护", () => {
	const source = readSource("src/pages/index.astro");

	assert.match(source, /data-home-reveal/);
	assert.match(source, /data-home-parallax/);
	assert.match(source, /IntersectionObserver/);
	assert.match(source, /requestAnimationFrame/);
	assert.match(source, /prefers-reduced-motion:\s*reduce/);
	assert.match(source, /@keyframes homeTitleReveal/);
	assert.match(source, /clip-path/);
	assert.match(source, /--home-scroll/);
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

test("文章元信息区提供浏览量状态和分享入口", () => {
	const pageSource = readSource("src/pages/posts/[...slug].astro");
	const metaSource = readSource("src/components/layout/PostMeta.astro");

	assert.match(pageSource, /shareTitle=\{entry\.data\.title\}/);
	assert.match(pageSource, /shareDescription=\{entry\.data\.description/);

	assert.match(metaSource, /const shouldShowPostActions =/);
	assert.match(metaSource, /post-meta-pageviews/);
	assert.match(metaSource, /post-meta-pageviews--unavailable/);
	assert.match(metaSource, /twikoo_visitors/);
	assert.match(metaSource, /waline-pageview-count/);
	assert.match(metaSource, /artalk-pv-count/);
	assert.match(metaSource, /data-post-share-button/);
	assert.match(metaSource, /data-post-share-url/);
	assert.match(metaSource, /data-post-share-title/);
	assert.match(metaSource, /data-post-share-description/);
	assert.match(metaSource, /data-post-share-feedback/);
	assert.match(metaSource, /navigator\.share/);
	assert.match(metaSource, /navigator\.clipboard\.writeText/);
	assert.match(metaSource, /shareFeedbackTimer/);
});

test("文章目录使用带活动范围的小框高亮当前阅读位置", () => {
	const sidebarSource = readSource("src/components/widget/SidebarTOC.astro");
	const floatingSource = readSource("src/components/controls/FloatingTOC.astro");
	const tocStyleSource = readSource("src/styles/toc.css");
	const tocUtilsSource = readSource("src/utils/toc-utils.ts");

	assert.match(sidebarSource, /toc-frame/);
	assert.match(sidebarSource, /data-toc-kind="sidebar"/);
	assert.match(floatingSource, /toc-frame/);
	assert.match(floatingSource, /data-toc-kind="floating"/);
	assert.match(tocStyleSource, /\.toc-frame/);
	assert.match(tocStyleSource, /\.toc-content\[data-active-range="true"\]/);
	assert.match(tocStyleSource, /\.toc-active-indicator/);
	assert.match(tocStyleSource, /border:\s*1px solid/);
	assert.match(tocStyleSource, /transform:\s*translateY\(var\(--toc-indicator-top/);
	assert.match(tocUtilsSource, /data-active-range/);
	assert.match(tocUtilsSource, /data-active-heading-ids/);
	assert.match(tocUtilsSource, /--toc-indicator-top/);
	assert.match(tocUtilsSource, /--toc-indicator-height/);
});

test("文章右侧目录拥有整段正文的 sticky 滚动范围", () => {
	const source = readSource("src/layouts/ContentGridLayout.astro");

	assert.match(source, /class="focused-article-toc__sticky"/);
	assert.match(source, /\.focused-article-toc\s*\{[\s\S]*align-self:\s*stretch/);
	assert.match(source, /\.focused-article-toc__sticky\s*\{[\s\S]*position:\s*sticky/);
	assert.match(source, /\.focused-article-toc__sticky\s*\{[\s\S]*top:\s*6rem/);
	assert.doesNotMatch(source, /<div class="sticky top-24">/);
});

test("聚焦布局会忽略本地残留的旧壁纸模式", () => {
	const layoutSource = readSource("src/layouts/Layout.astro");
	const settingSource = readSource("src/utils/setting-utils.ts");

	assert.match(layoutSource, /const storedWallpaperMode/);
	assert.match(layoutSource, /contentOnly \? WALLPAPER_NONE : storedWallpaperMode/);
	assert.match(settingSource, /function isContentOnlyPage/);
	assert.match(settingSource, /isContentOnlyPage\(\) \? WALLPAPER_NONE : mode/);
	assert.match(settingSource, /isContentOnlyPage\(\) \? WALLPAPER_NONE : getStoredWallpaperMode\(\)/);
});

test("通用布局脚本不会给无侧栏页面重新添加侧栏网格", () => {
	const source = readSource("src/layouts/Layout.astro");

	assert.match(source, /sidebarPosition === "none"/);
	assert.match(source, /newGridClasses = "grid-cols-1"/);
});

test("聚焦布局为固定导航预留完整高度", () => {
	const source = readSource("src/layouts/ContentGridLayout.astro");

	assert.match(source, /:global\(body\.sticky-navbar\) \.focused-page-shell/);
	assert.match(source, /padding-top:\s*6\.35rem/);
});

test("收藏页不再作为收藏总览功能页，只保留旧链接兼容跳转", () => {
	const source = readSource("src/pages/resources/index.astro");

	assert.match(source, /http-equiv="refresh"/);
	assert.match(source, /\/resources\/tools\//);
	assert.doesNotMatch(source, /collections\.map/);
	assert.doesNotMatch(source, /resource-entry/);
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

test("摘录收藏使用工具导航同款标题系统和 section 打底", () => {
	for (const page of ["src/pages/resources/clips/index.astro"]) {
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
		"src/pages/rss.astro",
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

	assert.doesNotMatch(source, /收藏总览/);
	assert.doesNotMatch(source, /LinkPresets\.Resources/);
	assert.match(source, /\/resources\/tools\//);
	assert.match(source, /\/resources\/clips\//);
});

test("文库下拉只保留文章、归档和分类标签", () => {
	const source = readSource("src/config/navBarConfig.ts");

	assert.match(source, /LinkPresets\.Posts/);
	assert.match(source, /LinkPresets\.Archive/);
	assert.match(source, /LinkPresets\.CategoryTags/);
	assert.match(source, /name:\s*"分类标签"/);
	assert.match(source, /url:\s*"\/categories\/"/);
	assert.doesNotMatch(source, /LinkPresets\.Tags/);
	assert.doesNotMatch(source, /url:\s*"\/tags\/"/);
});

test("足迹功能页和入口已删除", () => {
	const navSource = readSource("src/config/navBarConfig.ts");
	const homeSource = readSource("src/pages/index.astro");
	const breadcrumbSource = readSource("src/utils/focused-breadcrumb.ts");

	assert.equal(existsSync(path.join(root, "src/pages/records/index.astro")), false);
	assert.doesNotMatch(navSource, /LinkPresets\.Records/);
	assert.doesNotMatch(navSource, /name:\s*"足迹"/);
	assert.doesNotMatch(navSource, /url:\s*"\/records\/"/);
	assert.doesNotMatch(homeSource, /href="\/records\/"/);
	assert.doesNotMatch(homeSource, /<h2 class="text-xl font-bold text-90">足迹<\/h2>/);
	assert.doesNotMatch(breadcrumbSource, /"\/records\/"/);
});

test("我的下拉和关于页标题改为个人介绍", () => {
	const navSource = readSource("src/config/navBarConfig.ts");
	const aboutSource = readSource("src/pages/about.astro");
	const breadcrumbSource = readSource("src/utils/focused-breadcrumb.ts");
	const aboutContent = readSource("content.example/profile/about.md");
	const zhCnSource = readSource("src/i18n/languages/zh_CN.ts");
	const zhTwSource = readSource("src/i18n/languages/zh_TW.ts");

	assert.match(navSource, /name:\s*"个人介绍"[\s\S]{0,120}url:\s*"\/about\/"/);
	assert.doesNotMatch(navSource, /About:\s*\{[\s\S]{0,160}name:\s*"我的"/);
	assert.match(aboutSource, /const title = "个人介绍"/);
	assert.doesNotMatch(aboutSource, /i18n\(I18nKey\.about\)/);
	assert.match(breadcrumbSource, /\/about\/[\s\S]*label:\s*"个人介绍"/);
	assert.match(aboutContent, /title:\s*"个人介绍"/);
	assert.match(zhCnSource, /\[Key\.about\]:\s*"个人介绍"/);
	assert.match(zhTwSource, /\[Key\.about\]:\s*"個人介紹"/);
});

test("我的下拉包含个人介绍和站点概览，外部入口移动到页脚", () => {
	const navSource = readSource("src/config/navBarConfig.ts");
	const footerSource = readSource("src/components/layout/Footer.astro");
	const profileSource = readSource("src/config/profileConfig.ts");
	const myChildren = /name:\s*"我的"[\s\S]*?children:\s*\[([\s\S]*?)\]\s*,\s*\}/.exec(
		navSource,
	)?.[1] ?? "";

	assert.match(myChildren, /LinkPresets\.About/);
	assert.match(myChildren, /LinkPresets\.SiteOverview/);
	assert.doesNotMatch(myChildren, /GitHub/);
	assert.doesNotMatch(myChildren, /RSS/);
	assert.match(navSource, /SiteOverview:\s*\{[\s\S]*name:\s*"站点概览"/);
	assert.match(navSource, /url:\s*"\/site\/"/);

	assert.match(footerSource, /footer-social-links/);
	assert.match(footerSource, /footer-runtime-status/);
	assert.match(footerSource, /data-footer-stat-id="running-days"/);
	assert.match(footerSource, /data-footer-stat-id="last-update"/);
	assert.match(profileSource, /https:\/\/github\.com\/Dylanliiiii/);
	assert.match(profileSource, /https:\/\/space\.bilibili\.com\/37007345/);
	assert.match(profileSource, /name:\s*"B站"/);
});

test("我的下拉包含日历入口，公开日历页面使用聚焦布局", () => {
	const navSource = readSource("src/config/navBarConfig.ts");
	const pageSource = readSource("src/pages/calendar.astro");
	const breadcrumbSource = readSource("src/utils/focused-breadcrumb.ts");
	const myChildren = /name:\s*"我的"[\s\S]*?children:\s*\[([\s\S]*?)\]\s*,\s*\}/.exec(
		navSource,
	)?.[1] ?? "";

	assert.match(myChildren, /LinkPresets\.Calendar/);
	assert.match(navSource, /Calendar:\s*\{[\s\S]*name:\s*"日历"/);
	assert.match(navSource, /url:\s*"\/calendar\/"/);
	assert.match(pageSource, /import ContentGridLayout/);
	assert.match(pageSource, /<ContentGridLayout title=\{title\}/);
	assert.match(pageSource, /MIKAN CALENDAR/);
	assert.match(pageSource, /data-calendar-page/);
	for (const view of ["year", "month", "week", "day"]) {
		assert.match(pageSource, new RegExp(`data-calendar-view-button="${view}"`));
		assert.match(pageSource, new RegExp(`data-calendar-view="${view}"`));
	}
	assert.match(breadcrumbSource, /\/calendar\/[\s\S]*label:\s*"日历"/);
});

test("公开日历页面不提供前台创建或后台编辑入口", () => {
	const source = readSource("src/pages/calendar.astro");

	assert.doesNotMatch(source, /新建日程|创建日程|编辑日程|删除日程/);
	assert.doesNotMatch(source, /<form/);
	assert.doesNotMatch(source, /contenteditable/);
	assert.doesNotMatch(source, /fetch\(["']\/api\/calendar/);
});

test("公开日历点击日期会联动右侧日期详情", () => {
	const source = readSource("src/pages/calendar.astro");

	assert.match(source, /data-calendar-events-json/);
	assert.match(source, /data-calendar-detail-date/);
	assert.match(source, /data-calendar-detail-list/);
	assert.match(source, /aria-pressed=\{cell\.dateKey === todayKey \? "true" : "false"\}/);
	assert.match(source, /querySelectorAll\("\[data-calendar-date\]"\)/);
	assert.match(source, /function selectCalendarDate\(dateKey/);
	assert.match(source, /history\.replaceState\([\s\S]*`#date-\$\{dateKey\}`/);
	assert.match(source, /选择的日期没有公开日程/);
});

test("公开日历样式包含多视图、时间轴和移动端防溢出规则", () => {
	const source = readSource("src/styles/resources.css");

	assert.match(source, /\.calendar-shell/);
	assert.match(source, /\.calendar-view-switch/);
	assert.match(source, /\.calendar-month-grid/);
	assert.match(source, /\.calendar-cell-lunar/);
	assert.match(source, /\.calendar-year-grid/);
	assert.match(source, /\.calendar-week-timeline/);
	assert.match(source, /\.calendar-day-view/);
	assert.match(source, /\.calendar-timeline-event/);
	assert.match(source, /grid-template-columns:\s*minmax\(12rem,\s*0\.72fr\)\s*minmax\(0,\s*1\.8fr\)\s*minmax\(14rem,\s*0\.8fr\)/);
	assert.match(source, /@media\s*\(max-width:\s*1100px\)/);
	assert.match(source, /@media\s*\(max-width:\s*640px\)/);
	assert.match(source, /overflow-x:\s*auto/);
	assert.doesNotMatch(source, /letter-spacing:\s*-/);
});

test("公开日历暗色模式保留标题和事件卡片可读性", () => {
	const source = readSource("src/styles/resources.css");

	assert.match(source, /:root\.dark \.calendar-toolbar h2/);
	assert.match(source, /:root\.dark \.calendar-view-button\.is-active/);
	assert.match(source, /:root\.dark \.calendar-month-cell\.is-selected/);
	assert.match(source, /:root\.dark \.calendar-year-card strong/);
	assert.match(source, /:root\.dark \.calendar-year-card span/);
	assert.match(source, /:root\.dark \.calendar-cell-day/);
	assert.match(source, /:root\.dark \.calendar-mini-item small,\s*:root\.dark \.calendar-detail-item span/);
	assert.match(source, /:root\.dark \.calendar-event--blue/);
	assert.match(source, /:root\.dark \.calendar-event--blue[\s\S]*background:\s*color-mix\(in oklab, #60a5fa/);
	assert.doesNotMatch(source, /:root\.dark \.calendar-event--blue[\s\S]{0,120}white\s+35%/);
	assert.doesNotMatch(source, /\.calendar-view-button\.is-active\s*\{[\s\S]{0,120}background:\s*var\(--deep-text\)/);
});

test("显示设置面板只保留仍有效的主题色设置", () => {
	const source = readSource("src/components/controls/DisplaySettingsIntegrated.svelte");
	const navbarSource = readSource("src/components/layout/Navbar.astro");

	assert.match(source, /I18nKey\.themeColor/);
	assert.match(source, /id="colorSlider"/);
	assert.match(navbarSource, /const hasDisplaySettings = showThemeColor/);
	assert.doesNotMatch(source, /I18nKey\.wallpaperMode/);
	assert.doesNotMatch(source, /I18nKey\.wallpaperSettings/);
	assert.doesNotMatch(source, /I18nKey\.effectsSettings/);
	assert.doesNotMatch(source, /I18nKey\.postListLayout/);
	assert.doesNotMatch(source, /WALLPAPER_BANNER|WALLPAPER_FULLSCREEN|WALLPAPER_OVERLAY|WALLPAPER_NONE/);
	assert.doesNotMatch(source, /setWallpaperMode|setWavesEnabled|setGradientEnabled|setSakuraEnabled/);
	assert.doesNotMatch(source, /switchLayout|layoutChange/);
});

test("站点概览页展示站点统计、构建信息和相关入口", () => {
	const source = readSource("src/pages/site.astro");
	const breadcrumbSource = readSource("src/utils/focused-breadcrumb.ts");
	const styleSource = readSource("src/styles/resources.css");

	assert.match(source, /const title = "站点概览"/);
	assert.match(source, /MIKAN SITE/);
	assert.match(source, /getSortedPosts/);
	assert.match(source, /getTagList/);
	assert.match(source, /site-overview-stat-grid/);
	assert.match(source, /data-site-stat-id="running-days"/);
	assert.match(source, /data-site-stat-id="last-update"/);
	assert.match(source, /站点信息/);
	assert.match(source, /构建信息/);
	assert.match(source, /相关入口/);
	assert.match(source, /profileConfig\.links/);
	assert.match(breadcrumbSource, /\/site\/[\s\S]*label:\s*"站点概览"/);
	assert.match(styleSource, /\.site-overview-stat-grid/);
});

test("站点统计只保留分类标签统计并使用文章标签口径", () => {
	const source = readSource("src/components/widget/SiteStats.astro");

	assert.match(source, /getTagList/);
	assert.doesNotMatch(source, /getCategoryList/);
	assert.match(source, /siteStatsCategoryCount/);
	assert.doesNotMatch(source, /siteStatsTagCount/);
});

test("独立标签页面已删除，文章标签只作为分类标签使用", () => {
	assert.equal(existsSync(path.join(root, "src/pages/tags/index.astro")), false);
});

test("文章列表页标题改为文章，并提供分类标签筛选和分组", () => {
	const source = readSource("src/pages/posts/index.astro");

	assert.match(source, /ContentGridLayout title="文章"/);
	assert.match(source, /MIKAN ARTICLES/);
	assert.match(source, /<h1 class="tools-page-title">文章<\/h1>/);
	assert.doesNotMatch(source, /<h1 class="tools-page-title">文库<\/h1>/);
	assert.match(source, /data-post-tag-nav/);
	assert.match(source, /data-post-tag-indicator/);
	assert.match(source, /data-post-tag="all"/);
	assert.match(source, /data-post-tag-section="all"/);
	assert.match(source, /data-post-tag-section=\{group\.tag\}/);
	assert.match(source, /groupPostsByTag/);
	assert.match(source, /tools-category-header/);
});

test("文章总列表不展示封面图，并使用整条可点击长条卡片", () => {
	const source = readSource("src/pages/posts/index.astro");
	const styleSource = readSource("src/styles/resources.css");

	assert.doesNotMatch(source, /PostCard/);
	assert.doesNotMatch(source, /image=\{entry\.data\.image\}/);
	assert.doesNotMatch(source, /post-card-image/);
	assert.match(source, /<a[\s\S]*class="article-strip-card group/);
	assert.match(source, /href=\{getPostUrlBySlug\(entry\.id\)\}/);
	assert.match(source, /aria-label=\{`打开文章：\$\{entry\.data\.title\}`\}/);
	assert.match(source, /article-strip-title/);
	assert.match(source, /article-strip-meta/);
	assert.match(source, /article-strip-tags/);
	assert.match(styleSource, /\.article-strip-card/);
	assert.match(styleSource, /\.article-strip-card:hover/);
	assert.doesNotMatch(styleSource, /\.article-strip-card[\s\S]{0,260}background-image/);
});

test("分类标签页使用扇形统计图和标签篇数清单", () => {
	const source = readSource("src/pages/categories/index.astro");

	assert.match(source, /MIKAN TAXONOMY/);
	assert.match(source, /<h1 class="tools-page-title">分类标签<\/h1>/);
	assert.match(source, /taxonomy-chart/);
	assert.match(source, /taxonomy-sector/);
	assert.match(source, /data-taxonomy-sector/);
	assert.match(source, /stroke-dasharray/);
	assert.match(source, /stroke-dashoffset/);
	assert.match(source, /taxonomy-leader-line/);
	assert.match(source, /taxonomy-list/);
	assert.match(source, /共 \{totalPosts\} 篇文章/);
	assert.doesNotMatch(source, /categories\.map\(\(category, index\)/);
});

test("首页侧栏分类组件也使用文章标签作为分类标签来源", () => {
	const source = readSource("src/components/widget/Categories.astro");

	assert.match(source, /getTagList/);
	assert.match(source, /getTagUrl/);
	assert.match(source, /categoryTags/);
	assert.doesNotMatch(source, /getCategoryList/);
});

test("聚焦布局提供从主页直达当前功能页的面包屑", () => {
	const layoutSource = readSource("src/layouts/ContentGridLayout.astro");
	const breadcrumbSource = readSource("src/components/layout/FocusedBreadcrumb.astro");
	const breadcrumbConfigSource = readSource("src/utils/focused-breadcrumb.ts");

	assert.match(layoutSource, /FocusedBreadcrumb/);
	assert.match(layoutSource, /<FocusedBreadcrumb/);
	assert.match(breadcrumbSource, /aria-label="面包屑"/);
	assert.match(breadcrumbSource, /getFocusedBreadcrumb/);
	assert.match(breadcrumbSource, /item\.label/);
	assert.match(breadcrumbSource, /item\.icon/);
	assert.match(breadcrumbSource, /:root\.dark \.focused-breadcrumb__link/);
	assert.match(breadcrumbSource, /:root\.dark \.focused-breadcrumb__current/);
	assert.match(breadcrumbConfigSource, /label:\s*"主页"/);
	assert.match(breadcrumbConfigSource, /material-symbols:home-rounded/);
});

test("面包屑配置跳过无实质页面的父级入口", () => {
	const source = readSource("src/utils/focused-breadcrumb.ts");

	assert.match(source, /\/guestbook\/[\s\S]*label:\s*"留言"/);
	assert.doesNotMatch(source, /联系我[\s\S]{0,120}留言/);
	assert.match(source, /\/friends\/[\s\S]*label:\s*"友链"/);
	assert.match(source, /\/resources\/tools\/[\s\S]*label:\s*"工具导航"/);
	assert.match(source, /\/resources\/clips\/[\s\S]*label:\s*"摘录收藏"/);
	assert.doesNotMatch(source, /收藏[\s\S]{0,120}工具导航/);
});

test("面包屑只使用已安装的可构建图标", () => {
	const source = readSource("src/utils/focused-breadcrumb.ts");

	assert.doesNotMatch(source, /material-symbols:timeline-rounded/);
	assert.doesNotMatch(source, /material-symbols:timeline/);
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

test("文章归档活动区左侧连接 GitHub 贡献，右侧展示周度文章分布", () => {
	const page = readSource("src/pages/archive.astro");
	const panel = readSource("src/components/controls/ArchivePanel.svelte");
	const config = readSource("src/config/siteConfig.ts");
	const typeSource = readSource("src/types/siteConfig.ts");

	assert.match(page, /githubProfile/);
	assert.match(page, /githubUsername/);
	assert.match(panel, /export let githubUsername/);
	assert.match(panel, /export let githubProfile/);
	assert.match(panel, /data-github-heatmap/);
	assert.match(panel, /GitHub 贡献/);
	assert.match(panel, /github-contributions-api\.jogruber\.de/);
	assert.match(panel, /data-weekly-post-heatmap/);
	assert.match(panel, /文章分布/);
	assert.match(config, /heatmap:/);
	assert.match(config, /username:\s*"Dylanliiiii"/);
	assert.match(config, /profileUrl:\s*"https:\/\/github\.com\/Dylanliiiii"/);
	assert.match(typeSource, /heatmap\?:/);
});

test("GitHub 贡献热力图使用年度 12 月网格并在卡片内居中铺开", () => {
	const panel = readSource("src/components/controls/ArchivePanel.svelte");

	assert.match(panel, /const githubMonths = Array\.from\(\{ length: 12 \}/);
	assert.match(panel, /data-github-heatmap-frame/);
	assert.match(panel, /\.github-heatmap-frame\s*\{[\s\S]*justify-content:\s*center/);
	assert.match(panel, /\.github-heatmap-months\s*\{[\s\S]*grid-template-columns:\s*repeat\(12,\s*minmax\(0,\s*1fr\)\)/);
	assert.match(panel, /\.github-heatmap-body\s*\{[\s\S]*width:\s*100%/);
	assert.match(panel, /\.github-heatmap-body\s*\{[\s\S]*min-width:\s*42rem/);
	assert.match(panel, /@media\s*\(max-width:\s*640px\)\s*\{[\s\S]*\.github-heatmap-frame\s*\{[\s\S]*justify-content:\s*flex-start/);
	assert.doesNotMatch(panel, /buildGithubMonthBoundaries/);
	assert.doesNotMatch(panel, /githubMonthBoundaries/);
	assert.doesNotMatch(panel, /\.github-heatmap-months\s*\{[\s\S]*grid-template-columns:\s*repeat\(53,\s*0\.72rem\)/);
});

test("主导航和下拉菜单图标固定占位且不会在桌面宽度被隐藏", () => {
	const menu = readSource("src/components/layout/DropdownMenu.astro");
	const mobileMenu = readSource("src/components/layout/NavMenuPanel.astro");
	const styles = readSource("src/styles/navbar.css");

	assert.match(menu, /navbar-menu-icon/);
	assert.match(menu, /navbar-submenu-icon/);
	assert.match(mobileMenu, /navbar-mobile-icon/);
	assert.match(styles, /\.navbar-menu-icon,\s*\.navbar-submenu-icon,\s*\.navbar-mobile-icon\s*\{/);
	assert.match(styles, /flex:\s*0\s*0\s*auto/);
	assert.doesNotMatch(styles, /\.navbar-icon\s*\{\s*display:\s*none\s*!important;\s*\}/);
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

test("文章归档保留既有分类与未分类查询兼容", () => {
	const panel = readSource("src/components/controls/ArchivePanel.svelte");

	assert.match(panel, /searchParams\.get\("category"\)/);
	assert.match(panel, /searchParams\.has\("uncategorized"\)/);
	assert.match(panel, /activeCategory/);
});

test("文章归档筛选菜单不在非交互容器上拦截点击", () => {
	const panel = readSource("src/components/controls/ArchivePanel.svelte");
	const menuElement = /<div[\s\S]{0,240}?role="menu"[\s\S]{0,120}?>/.exec(
		panel,
	)?.[0];

	assert.ok(menuElement, "归档筛选菜单应存在");
	assert.doesNotMatch(menuElement, /on:click/);
});

test("文章归档筛选标题使用可追踪的 Svelte 派生状态", () => {
	const panel = readSource("src/components/controls/ArchivePanel.svelte");

	assert.match(panel, /\$: activeFilterLabel =/);
	assert.match(panel, /\$: activeFilterValue =/);
	assert.doesNotMatch(panel, /function getActiveFilterLabel/);
	assert.doesNotMatch(panel, /function getActiveFilterValue/);
});
