# MikanArchive Post Reading Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance article detail pages with a clearer active TOC frame, truthful page-view status, and a header share action.

**Architecture:** Keep the static Astro article page and existing `TOCManager`. Extend the generated TOC markup/styles for a framed active indicator, and add a small client-side share script inside the article metadata row. Page-view rendering stays provider-aware through existing comment config.

**Tech Stack:** Astro 7, TypeScript, Tailwind utility classes, shared CSS, Node test runner.

---

### Task 1: Lock Page Structure With Tests

**Files:**
- Modify: `tests/mikan-pages.test.ts`

- [ ] Add assertions that `PostMeta.astro` always exposes a post page-view item, a share button, share feedback text, and provider-specific visitor count hooks.
- [ ] Add assertions that `SidebarTOC.astro`, `toc.css`, and `toc-utils.ts` expose the framed TOC and active range attributes.
- [ ] Run `npm run test:pages` and confirm the new assertions fail before implementation.

### Task 2: Add Header Metadata Actions

**Files:**
- Modify: `src/components/layout/PostMeta.astro`
- Modify: `src/env.d.ts`

- [ ] Add provider-aware page-view rendering that shows real Twikoo / Waline / Artalk hooks when configured.
- [ ] Add a non-provider fallback that displays `统计不可用`.
- [ ] Add a share button with `data-post-share-button`, `data-post-share-url`, `data-post-share-title`, and `data-post-share-feedback`.
- [ ] Add a small client script that uses `navigator.share` first, then `navigator.clipboard.writeText`.

### Task 3: Strengthen TOC Active Frame

**Files:**
- Modify: `src/components/widget/SidebarTOC.astro`
- Modify: `src/components/controls/FloatingTOC.astro`
- Modify: `src/utils/toc-utils.ts`
- Modify: `src/styles/toc.css`

- [ ] Wrap desktop and floating TOC scroll areas with a consistent `toc-frame`.
- [ ] Add data attributes for active range state in generated TOC content.
- [ ] Update `TOCManager.updateActiveIndicator()` to track active heading IDs and move the indicator using transform-friendly styles.
- [ ] Style the active indicator as a visible bordered small frame without resizing TOC items.

### Task 4: Verify And Record

**Files:**
- Modify: `docs/next-tasks.md`
- Modify: `development-log.md`

- [ ] Run `npm run sync:content`.
- [ ] Run `npm run validate:content`.
- [ ] Run `npm run test:pages`.
- [ ] Run `npm run check`.
- [ ] Run `npm run build`.
- [ ] Start local dev or preview server and inspect the article page in desktop and mobile browser viewports.
- [ ] Update `development-log.md` with scope, files, and verification.
- [ ] Clear the completed current task from `docs/next-tasks.md`.
