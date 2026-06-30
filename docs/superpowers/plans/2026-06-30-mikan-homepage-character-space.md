# Mikan Homepage Character Space Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved MikanArchive homepage as a character-space landing page with real navigation, real content data, transparent line-art background, and scroll-linked animations.

**Architecture:** Keep the existing global `Layout` and `Navbar` so navigation, search, theme controls, and Swup containers remain compatible. Replace `src/pages/index.astro` with a homepage-specific shell that reads existing posts/resources/friends/updates data and uses local optimized assets from `src/assets/home/`. Add page-level CSS and small vanilla JS for reveal/mask/parallax interactions.

**Tech Stack:** Astro 7, TypeScript, existing Mikan data helpers, Astro asset imports, CSS keyframes, IntersectionObserver, requestAnimationFrame.

---

### Task 1: Add Regression Tests

**Files:**
- Modify: `tests/mikan-pages.test.ts`

- [ ] Add tests asserting the homepage uses `Layout` + `Navbar`, imports the avatar and transparent line-art assets, exposes homepage animation hooks, keeps truthful visit copy, and does not use `MainGridLayout`.
- [ ] Run `npm.cmd run test:pages` and verify the new tests fail before implementation.

### Task 2: Prepare Homepage Assets

**Files:**
- Create: `src/assets/home/mikan-avatar.webp`
- Create: `src/assets/home/anime-lineart.webp`
- Modify: `src/config/siteConfig.ts`

- [ ] Generate optimized assets from `anime_avatar_expanded_4x_darker_lines.png` and `anime_lineart_transparent.png`.
- [ ] Change `siteConfig.navbar.logo` to use `assets/home/mikan-avatar.webp`.
- [ ] Run `npm.cmd run test:pages` and verify asset/logo assertions progress.

### Task 3: Implement Homepage Shell

**Files:**
- Modify: `src/pages/index.astro`

- [ ] Replace the old card homepage with a `Layout contentOnly` page.
- [ ] Render the real `<Navbar />`, hidden Swup compatibility containers, `#main-grid`, `#swup-container`, `#content-wrapper`, `<Footer />`, and `<FloatingControls />`.
- [ ] Read real posts, resources, friends and updates from existing helpers.
- [ ] Link all navigation chips and content cards to real routes or URLs.

### Task 4: Implement Visual System And Animations

**Files:**
- Modify: `src/pages/index.astro`

- [ ] Add scoped homepage CSS for the hero, avatar status, transparent line-art art layer, ticker, article panel, site stats, preview modules,整理流,资源轨道 and visit capsule.
- [ ] Add mask-reveal animation, scroll-linked reveal variables, resource orbit hover, visit capsule hover, and reduced-motion rules.
- [ ] Add inline JS that initializes reveal elements on `astro:page-load` and `swup:contentReplaced`.

### Task 5: Documentation And Maintenance

**Files:**
- Modify: `docs/next-tasks.md`
- Modify: `development-log.md`
- Optionally modify: `CHANGELOG.md`

- [ ] Record the homepage implementation in the development log.
- [ ] Keep `docs/next-tasks.md` either updated with remaining review steps or clear if complete.
- [ ] Update `CHANGELOG.md` if the homepage change is user-facing enough to need release notes.

### Task 6: Verification

**Commands:**
- `npm.cmd run sync:content`
- `npm.cmd run validate:content`
- `npm.cmd run test:content-model`
- `npm.cmd run test:pages`
- `npm.cmd run check`
- `npm.cmd run build`

- [ ] Start or reuse a local dev server.
- [ ] Inspect `/` in desktop and mobile widths.
- [ ] Confirm the top navigation links are clickable.
- [ ] Confirm the transparent line-art background has no white square.
- [ ] Confirm scroll animations are smooth and reduced-motion safe.

## Self-Review

- Spec coverage: The plan covers the approved hero, transparent line-art asset, real data mapping, site stats, visit capsule, navigation, animation, responsive behavior, and verification.
- Placeholder scan: No open-ended implementation placeholders remain; optional `CHANGELOG.md` is conditional because the maintenance skill allows small updates to skip it, but this change is expected to update it.
- Type consistency: Planned files and helpers match the current project names: `getSortedPostsList`, `getMikanResources`, `getMikanFriends`, `getMikanUpdates`, `siteConfig`, `Layout`, `Navbar`, `Footer`, and `FloatingControls`.
