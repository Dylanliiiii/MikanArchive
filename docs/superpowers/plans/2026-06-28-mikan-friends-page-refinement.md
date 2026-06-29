# MikanArchive 友链页精简与筛选胶囊修复 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `/friends/` 调整为纯友链页面，并让标签筛选在亮暗模式与桌面 / 移动视口下始终显示工具导航同款彩色滑动胶囊。

**Architecture:** 保留现有 `friend-filter` 自定义元素、友链数据和共享 `resources.css`，只在友链页删除联系总览区并补齐胶囊 DOM 与定位逻辑。测试继续采用仓库现有的源码契约测试，浏览器验收覆盖真实渲染、交互、控制台和横向溢出。

**Tech Stack:** Astro 7、TypeScript、Tailwind CSS 4、Node.js `node:test`、项目内浏览器视觉验证。

---

### Task 1: 为纯友链页面与滑动胶囊建立失败测试

**Files:**
- Modify: `tests/mikan-pages.test.ts`
- Test: `tests/mikan-pages.test.ts`

- [x] **Step 1: 写入友链页面职责测试**

在现有联系我导航测试附近增加：

```ts
test("友链页只展示友链内容，不重复联系我入口", () => {
	const source = readSource("src/pages/friends.astro");

	assert.match(source, /const title = "友链"/);
	assert.match(source, /FRIENDS/);
	assert.doesNotMatch(source, /const contactEntries/);
	assert.doesNotMatch(source, /contactEntries\.map/);
	assert.doesNotMatch(source, /contact-entry/);
	assert.doesNotMatch(source, /id="friends-board"/);
});
```

- [x] **Step 2: 写入筛选胶囊契约测试**

```ts
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
```

- [x] **Step 3: 运行页面测试并确认按预期失败**

Run:

```powershell
npm.cmd run test:pages
```

Expected: 新增两个测试失败；失败原因分别是页面仍声明 `联系我` / `contactEntries`，以及友链筛选缺少 `data-friend-tab-indicator` 和 `updateIndicator`。

### Task 2: 精简友链页并补齐胶囊定位

**Files:**
- Modify: `src/pages/friends.astro`
- Test: `tests/mikan-pages.test.ts`

- [x] **Step 1: 删除联系总览数据与无用依赖**

删除 `url` 导入、`contactEntries` 数组和三张入口卡片，将页面元信息改为：

```ts
const title = "友链";
const description = "把值得常去的站点放在近处，也可以按标签寻找同好。公开示例只展示结构，不包含真实私人联系方式。";
```

- [x] **Step 2: 把页面头部改为友链标题**

```astro
<header class="tools-page-header relative z-10 mb-7">
	<div class="tools-eyebrow-row">
		<Icon is:inline name="material-symbols:group-rounded" />
		<p class="tools-eyebrow">FRIENDS</p>
	</div>
	<h1 class="tools-page-title">{title}</h1>
	<p class="tools-page-description">{description}</p>
</header>
```

搜索、标签、卡片和申请说明直接跟随头部，不再使用第二个“友链”分组标题或 `id="friends-board"` 包装层。

- [x] **Step 3: 在筛选容器中加入共享胶囊指示器**

```astro
<div class="tools-tab-pill" data-friend-tab-nav>
	<div class="tools-tab-indicator" data-friend-tab-indicator></div>
	<button type="button" data-tag="all" class="tools-tab-btn tools-tab-btn-active" aria-pressed="true">
		全部
		<span class="tools-tab-badge">{items.length}</span>
	</button>
	{allTags.map((tag) => (
		<button type="button" data-tag={tag} class="tools-tab-btn tools-tab-btn-inactive" aria-pressed="false">
			{tag}
		</button>
	))}
</div>
```

- [x] **Step 4: 为自定义元素补齐初始化、点击和缩放定位**

在 `FriendFilter` 中增加：

```js
handleResize = () => {
	const targetButton = this.querySelector(".tools-tab-btn-active");
	this.updateIndicator(targetButton);
};

updateIndicator(targetButton) {
	const nav = this.querySelector("[data-friend-tab-nav]");
	const indicator = this.querySelector("[data-friend-tab-indicator]");
	if (!nav || !indicator || !targetButton) return;

	indicator.style.left = targetButton.offsetLeft + "px";
	indicator.style.top = targetButton.offsetTop + "px";
	indicator.style.width = targetButton.offsetWidth + "px";
	indicator.style.height = targetButton.offsetHeight + "px";
	indicator.style.opacity = "1";
}
```

`connectedCallback()` 注册 `window.resize` 并在 `requestAnimationFrame` 中调用 `handleResize()`；`disconnectedCallback()` 移除监听。标签点击更新类名后，再在 `requestAnimationFrame` 中调用 `updateIndicator(button)`。

由于脚本位于 `<head>`，`connectedCallback()` 触发时子输入框可能尚未完成解析；搜索监听必须使用宿主元素上的事件委托：

```js
this.addEventListener("input", this.handleInput);
```

断开时对应调用 `this.removeEventListener("input", this.handleInput)`，不能在连接阶段直接查询并绑定子输入框。

- [x] **Step 5: 运行页面测试并确认通过**

Run:

```powershell
npm.cmd run test:pages
```

Expected: 全部页面契约测试通过，0 项失败。

### Task 3: 完成自动化与浏览器验收

**Files:**
- Verify: `src/pages/friends.astro`
- Verify: `tests/mikan-pages.test.ts`

- [x] **Step 1: 运行完整自动化验证**

```powershell
npm.cmd run sync:content
npm.cmd run validate:content
npm.cmd run test:content-model
npm.cmd run test:pages
npm.cmd run check
npm.cmd run build
```

Expected: 所有命令退出码为 0；只允许记录仓库已有且与本次无关的提示，不接受新增错误。

- [x] **Step 2: 验证桌面端亮色页面**

打开 `http://127.0.0.1:4321/friends/`，确认：

- 只有“友链”主标题，没有“联系我”和三张入口卡片。
- 默认“全部”具有彩色胶囊底和可读白字。
- 点击任一标签后胶囊移动到目标标签，卡片正确筛选。
- 搜索不存在的内容时显示无结果提示。
- 控制台无新增错误，页面无横向溢出。

- [x] **Step 3: 验证 390×844 移动端和暗色模式**

确认标签容器可换行且无横向溢出，激活胶囊在换行后仍与按钮重合；暗色模式下激活文字、徽章、卡片和申请说明均可读。

### Task 4: 同步记录、提交并推送

**Files:**
- Modify: `docs/next-tasks.md`
- Modify: `development-log.md`

- [x] **Step 1: 更新设计与任务状态**

把设计规格状态改为“已实现并验证”，在本计划中勾选已完成步骤；若全部完成且推送成功，清空 `docs/next-tasks.md` 的当前目标段。

- [x] **Step 2: 更新开发日志**

在 `development-log.md` 顶部条目补充实际修改文件、TDD 红绿过程、全部命令结果、桌面 / 移动与亮暗模式浏览器结果，以及推送状态。

- [x] **Step 3: 检查差异与敏感信息**

```powershell
git diff --check
git status --short
git diff -- src/pages/friends.astro tests/mikan-pages.test.ts docs/superpowers/specs/2026-06-28-mikan-friends-page-refinement-design.md docs/superpowers/plans/2026-06-28-mikan-friends-page-refinement.md docs/next-tasks.md development-log.md
```

Expected: 无空白错误、无私有内容或凭据、无本机绝对路径进入仓库文件。

- [x] **Step 4: 创建普通提交并推送当前分支**

```powershell
git add -- src/pages/friends.astro tests/mikan-pages.test.ts docs/superpowers/specs/2026-06-28-mikan-friends-page-refinement-design.md docs/superpowers/plans/2026-06-28-mikan-friends-page-refinement.md docs/next-tasks.md development-log.md
git commit -m "fix: refine friends page filters"
git push origin codex/firefly-rebuild
```

Expected: 提交和推送成功；本次不创建 tag 或 GitHub Release。
