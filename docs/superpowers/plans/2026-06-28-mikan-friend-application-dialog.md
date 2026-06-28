# MikanArchive 友链申请说明弹窗 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在友链页标题区提供“如何申请友链”按钮和文档式弹窗，并从留言页移除重复的友链申请入口。

**Architecture:** 新增职责单一的 Astro 原生 `<dialog>` 组件，弹窗通过 slot 复用现有 `friends.mdx` 内容；友链页只负责入口位置和内容注入。留言页回归纯留言职责，不新增独立申请路由或外部链接。

**Tech Stack:** Astro 7、TypeScript、Tailwind CSS 4、原生 HTML Dialog API、Node.js `node:test`、项目内浏览器视觉验证。

---

### Task 1: 建立友链申请入口职责的失败测试

**Files:**
- Modify: `tests/mikan-pages.test.ts`
- Test: `tests/mikan-pages.test.ts`

- [x] **Step 1: 添加友链页按钮与弹窗契约**

```ts
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
```

- [x] **Step 2: 添加留言页纯留言职责契约**

```ts
test("留言页不再承载友链申请入口", () => {
	const source = readSource("src/pages/guestbook.astro");

	assert.doesNotMatch(source, /友链申请/);
	assert.doesNotMatch(source, /查看友链说明/);
	assert.doesNotMatch(source, /url\("\/friends\/"\)/);
	assert.doesNotMatch(source, /@\/utils\/url-utils/);
	assert.match(source, /随手留言/);
	assert.match(source, /私密信息/);
});
```

- [x] **Step 3: 运行页面测试并确认失败**

```powershell
npm.cmd run test:pages
```

Expected: 新增测试因为弹窗组件不存在、友链页缺少按钮，以及留言页仍含友链申请内容而失败。

### Task 2: 实现文档式友链申请弹窗

**Files:**
- Create: `src/components/pages/FriendApplyDialog.astro`
- Modify: `src/pages/friends.astro`
- Test: `tests/mikan-pages.test.ts`

- [x] **Step 1: 创建原生弹窗组件**

组件必须包含：

```astro
<dialog
	id="friend-apply-dialog"
	class="friend-guide-dialog"
	aria-labelledby="friend-guide-title"
	aria-modal="true"
	data-friend-guide-dialog
>
	<article class="friend-guide-dialog__panel" data-friend-guide-panel>
		<header class="friend-guide-dialog__header">
			<div>
				<p class="friend-guide-dialog__eyebrow">FRIEND LINK GUIDE</p>
				<h2 id="friend-guide-title">友链申请说明</h2>
				<p>先阅读申请格式与互换说明，后续可再接入独立文档或外部申请地址。</p>
			</div>
			<button type="button" data-close-friend-guide aria-label="关闭友链申请说明">关闭</button>
		</header>
		<div class="friend-guide-dialog__body"><slot /></div>
	</article>
</dialog>
```

脚本使用 document 级事件委托，根据 `data-open-friend-guide` 打开 `aria-controls` 指向的 dialog，根据 `data-close-friend-guide` 或点击 dialog 遮罩调用 `dialog.close()`；Escape 使用原生 `<dialog>` 行为。

```js
(function () {
	if (window.__mikanFriendGuideReady) return;
	window.__mikanFriendGuideReady = true;

	document.addEventListener("click", function (event) {
		const target = event.target instanceof Element ? event.target : null;
		if (!target) return;

		const openButton = target.closest("[data-open-friend-guide]");
		if (openButton) {
			const dialogId = openButton.getAttribute("aria-controls");
			const dialog = dialogId ? document.getElementById(dialogId) : null;
			if (dialog instanceof HTMLDialogElement && !dialog.open) dialog.showModal();
			return;
		}

		const closeButton = target.closest("[data-close-friend-guide]");
		if (closeButton) {
			const dialog = closeButton.closest("dialog");
			if (dialog instanceof HTMLDialogElement) dialog.close();
			return;
		}

		if (target instanceof HTMLDialogElement && target.matches("[data-friend-guide-dialog]")) {
			target.close();
		}
	});
})();
```

- [x] **Step 2: 添加响应式与亮暗模式样式**

弹窗宽度使用 `min(46rem, calc(100% - 2rem))`，最大高度不超过 `84vh`，正文内部滚动；移动端宽度改为 `calc(100% - 1rem)`、最大高度 `90vh`。遮罩使用低透明黑色和轻微模糊，面板颜色复用 `--card-bg`、`--line-divider`、`--tools-text-*` 和 `--primary`。

```css
.friend-guide-dialog {
	width: min(46rem, calc(100% - 2rem));
	max-height: 84vh;
	margin: auto;
	padding: 0;
	border: 1px solid var(--line-divider);
	border-radius: 1.25rem;
	background: var(--card-bg);
	color: var(--tools-text-strong);
	box-shadow: 0 24px 80px rgba(20, 36, 48, 0.3);
	overflow: hidden;
}

.friend-guide-dialog::backdrop {
	background: rgba(15, 23, 32, 0.52);
	backdrop-filter: blur(6px);
}

.friend-guide-dialog__panel {
	max-height: 84vh;
	overflow-y: auto;
}

@media (max-width: 640px) {
	.friend-guide-dialog {
		width: calc(100% - 1rem);
		max-height: 90vh;
	}

	.friend-guide-dialog__panel {
		max-height: 90vh;
	}
}
```

- [x] **Step 3: 把友链页头部改为左右布局并注入现有内容**

```astro
<header class="tools-page-header relative z-10 mb-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
	<div class="min-w-0">
		<div class="tools-eyebrow-row">
			<Icon is:inline name="material-symbols:group-rounded" />
			<p class="tools-eyebrow">FRIENDS</p>
		</div>
		<h1 class="tools-page-title">{title}</h1>
		<p class="tools-page-description">{description}</p>
	</div>
	<button
		type="button"
		data-open-friend-guide
		aria-haspopup="dialog"
		aria-controls="friend-apply-dialog"
		class="friend-guide-trigger"
	>
		<Icon is:inline name="material-symbols:help-outline-rounded" />
		如何申请友链
	</button>
</header>
```

在友链页面内容末尾使用：

```astro
{friendsPageConfig.showCustomContent !== false && (
	<FriendApplyDialog>
		<Markdown class=""><Content /></Markdown>
	</FriendApplyDialog>
)}
```

删除原先页面底部内联申请说明 section。

- [x] **Step 4: 运行页面测试并确认通过**

```powershell
npm.cmd run test:pages
```

Expected: 页面契约测试全部通过，0 项失败。

### Task 3: 精简留言页职责

**Files:**
- Modify: `src/pages/guestbook.astro`
- Test: `tests/mikan-pages.test.ts`

- [x] **Step 1: 删除友链申请卡和底部链接**

删除 `url-utils` 导入、`guideItems` 中的“友链申请”对象，以及留言系统未启用区域的 `/friends/` 链接。页面说明改为：

```ts
const description = "把想法、反馈、问题或想继续交流的话放在这里。公开示例不会写入真实联系方式。";
```

两张说明卡使用 `sm:grid-cols-2`，未启用提示只保留标题和评论系统配置说明。

- [x] **Step 2: 运行页面测试并确认通过**

```powershell
npm.cmd run test:pages
```

Expected: 页面契约测试全部通过，留言页源码不再出现友链申请入口。

### Task 4: 验证、记录、提交与推送

**Files:**
- Modify: `docs/superpowers/specs/2026-06-28-mikan-friends-page-refinement-design.md`
- Modify: `docs/superpowers/plans/2026-06-28-mikan-friend-application-dialog.md`
- Modify: `docs/next-tasks.md`
- Modify: `development-log.md`

- [x] **Step 1: 运行完整自动化验证**

```powershell
npm.cmd run sync:content
npm.cmd run validate:content
npm.cmd run test:content-model
npm.cmd run test:pages
npm.cmd run check
npm.cmd run build
```

- [x] **Step 2: 浏览器验证友链页与留言页**

桌面和约 390×844 移动视口分别确认：友链按钮位置正确、弹窗打开/关闭/遮罩/Escape 可用、正文可滚动、亮暗模式可读、页面无横向溢出；留言页只剩留言与隐私说明，不再出现友链申请入口。

- [ ] **Step 3: 同步记录并提交推送**

更新设计状态、勾选本计划、记录 TDD 红绿结果与浏览器验证；检查 `git diff --check`、关键 diff 和敏感信息后创建普通提交并推送 `codex/firefly-rebuild`。本次不创建 tag 或 Release。
