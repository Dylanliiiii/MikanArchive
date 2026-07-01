# Mikan Liquid Navbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 MikanArchive 顶部主导航随滚动进度收缩，并在收缩过程中逐渐呈现液态玻璃质感。

**Architecture:** 使用 `Navbar.astro` 中的滚动监听把 `scrollTop / 160` 写入 `#navbar` 的 CSS 变量 `--navbar-scroll-progress`，样式层用该变量驱动宽度、内边距、玻璃强度、品牌文字透明度和搜索框宽度。搜索组件只暴露稳定类名和折叠后的按钮式行为，导航业务配置不变。

**Tech Stack:** Astro 7、Svelte 5、Tailwind CSS 4、现有 Node.js `node:test` 页面结构测试、Playwright 浏览器验收。

---

### Task 1: 导航结构测试

**Files:**
- Modify: `tests/mikan-pages.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
test("主导航随滚动进度收缩并渐变为液态玻璃", () => {
	const navbarSource = readSource("src/components/layout/Navbar.astro");
	const searchSource = readSource("src/components/controls/Search.svelte");
	const styleSource = readSource("src/styles/navbar.css");

	assert.match(navbarSource, /--navbar-scroll-progress/);
	assert.match(navbarSource, /initLiquidNavbarScroll/);
	assert.match(navbarSource, /navbar-brand-text/);
	assert.match(searchSource, /navbar-search-compactable/);
	assert.match(styleSource, /--mikan-navbar-compact-progress/);
	assert.match(styleSource, /width:\s*calc\(/);
	assert.match(styleSource, /backdrop-filter:\s*blur\(calc\(/);
	assert.match(styleSource, /\.navbar-brand-text/);
	assert.match(styleSource, /#navbar #search-bar\.navbar-search-compactable/);
	assert.match(styleSource, /prefers-reduced-motion:\s*reduce/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd run test:pages`

Expected: FAIL because the new scroll progress variable and compactable search class are not present yet.

### Task 2: 导航滚动进度与品牌结构

**Files:**
- Modify: `src/components/layout/Navbar.astro`

- [ ] **Step 1: Implement minimal navigation structure**

Add stable classes for the shell, brand link, logo and brand text. Add `initLiquidNavbarScroll()` that clamps scroll progress between `0` and `1`, writes `--navbar-scroll-progress`, and toggles `is-liquid-compact` when progress is nearly complete.

- [ ] **Step 2: Run page test**

Run: `npm.cmd run test:pages`

Expected: remaining FAIL entries point only to search/style rules.

### Task 3: 搜索与液态玻璃样式

**Files:**
- Modify: `src/components/controls/Search.svelte`
- Modify: `src/styles/navbar.css`

- [ ] **Step 1: Implement compactable search class**

Add `navbar-search-compactable` to the desktop search bar and make the desktop search shell clickable: when the navbar is compact and the user clicks the round search control outside the input, open the existing search panel and focus the input.

- [ ] **Step 2: Implement CSS progress mapping**

Use `--mikan-navbar-compact-progress: var(--navbar-scroll-progress, 0)` and `calc()` to animate wrapper width, padding, height, blur, saturation, shadows, brand text opacity/width, and search width. Add mobile media rules that keep the menu usable.

- [ ] **Step 3: Run page test**

Run: `npm.cmd run test:pages`

Expected: PASS.

### Task 4: 验证与维护记录

**Files:**
- Modify: `development-log.md`
- Modify: `docs/next-tasks.md`

- [ ] **Step 1: Run project verification**

Run:

```powershell
npm.cmd run sync:content
npm.cmd run validate:content
npm.cmd run test:pages
npm.cmd run check
npm.cmd run build
```

Expected: all commands exit with code 0.

- [ ] **Step 2: Run browser visual checks**

Open `http://127.0.0.1:4321/`, scroll desktop and mobile viewports, and confirm the navbar contracts, expands, and keeps controls usable without horizontal overflow.

- [ ] **Step 3: Update maintenance docs**

Append a `development-log.md` entry with modified files and verification results, then clear the current liquid-navbar section from `docs/next-tasks.md` after verification, commit, and push complete.
