# MikanArchive Site Overview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增 `/site/` 站点概览页，调整“我的”下拉和页脚状态，并统一站点统计口径。

**Architecture:** 站点概览页沿用 `ContentGridLayout` 与 `resources.css` 的非主页视觉系统；导航只保留页面入口，个人外链由 `profileConfig.links` 统一提供给页脚和资料卡；统计字段继续在 Astro 服务端计算，运行天数和最后活动相对时间在客户端刷新。

**Tech Stack:** Astro 7、TypeScript、Tailwind CSS 4、Astro Icon、Node.js test runner

---

## 文件结构

- 修改 `tests/mikan-pages.test.ts`：先增加导航、页面、页脚和统计字段契约测试。
- 修改 `src/config/navBarConfig.ts`：新增“站点概览”预设并移除“我的”下拉中的 GitHub/RSS。
- 修改 `src/config/profileConfig.ts`：写入用户提供的 GitHub 与 B 站公开链接。
- 新增 `src/pages/site.astro`：站点概览功能页。
- 修改 `src/components/layout/Footer.astro`：展示个人链接、RSS、运行天数和最后更新状态。
- 修改 `src/components/widget/SiteStats.astro`：移除重复“标签”统计，分类标签统计改用文章标签数量。
- 修改 `src/styles/resources.css`：补充站点概览响应式样式。
- 修改 `src/utils/focused-breadcrumb.ts`：新增 `/site/` 面包屑。
- 同步 README、设计文档、CHANGELOG、development-log 和 docs/next-tasks。

## 实施步骤

- [x] 写入失败的 `tests/mikan-pages.test.ts` 契约测试，覆盖 `/site/`、导航、页脚、站点统计和公开链接。
- [x] 运行 `npm.cmd run test:pages`，确认新增测试失败。
- [x] 实现导航、资料链接、站点统计和页脚状态。
- [x] 新增 `/site/` 页面与样式，并补充面包屑。
- [x] 运行 `npm.cmd run test:pages`，确认页面契约变绿。
- [x] 同步 README、设计说明、CHANGELOG、development-log 和 next-tasks。
- [x] 运行完整验证：`sync:content`、`validate:content`、`test:content-model`、`test:archive`、`test:pages`、`check`、`build`。
- [x] 启动本地服务，检查 `/site/`、`/about/`、首页页脚在桌面和移动端显示正常。
- [ ] 检查 diff，提交并 push。
