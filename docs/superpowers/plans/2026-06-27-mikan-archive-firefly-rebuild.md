# MikanArchive Firefly Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild MikanArchive on a Firefly-style Astro blog foundation while preserving public/private content separation and example-content fallback.

> 2026-06-29 更新：当前公开站点已删除独立 `/records/` 足迹功能页，顶部导航调整为 `主页 / 文库 / 收藏 / 联系我 / 我的`，`/about/` 入口显示为“个人介绍”。本计划中涉及 records 页面和旧导航的条目仅作为历史实施记录保留，不再作为后续验收目标。

**Architecture:** Keep the existing content sync and validation scripts as the boundary between public framework and future private content. Replace the current lightweight `src/` theme layer with a Firefly-derived layout, configuration, navigation, sidebar, article, friends, resources, records, and about experience. Do not ship fqzlr.com private content or Firefly third-party character assets as default MikanArchive assets.

**Tech Stack:** Astro 7, MD/MDX content collections, Tailwind CSS, Svelte islands where Firefly components require them, Pagefind-ready search, TypeScript, existing Node.js 22+ scripts.

---

## File Structure

- Replace most of `src/` with a Firefly-style theme layer.
- Keep and update `content.example/`, `scripts/sync-content.mjs`, `scripts/validate-content.mjs`, `.env.example`, docs, and maintenance files.
- Copy Firefly source modules selectively from `.tmp/Firefly/src/`, then adapt configs and routes to MikanArchive.
- Do not copy `.tmp/Firefly/public/pio`, gallery demo assets, sponsor QR images, music files, or character wallpapers as default public assets.
- Add or adapt local assets under `content.example/assets/` only when they are original/simple placeholders.

## Task 1: Dependency And Config Foundation

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `astro.config.mjs`
- Modify: `tsconfig.json`
- Add/modify: `svelte.config.js`
- Add/modify: `pagefind.yml`
- Modify: `postcss.config.mjs`

- [x] Update dependencies to include Firefly-required Astro integrations and runtime packages used by selected components: `@astrojs/svelte`, `astro-icon`, `astro-expressive-code`, `pagefind`, `svelte`, `dayjs`, `reading-time`, and Iconify icon JSON packages actually referenced by the adapted theme. `@swup/astro` was evaluated and removed because npm audit reports an unfixed high-severity transitive chain.
- [x] Keep npm as the package manager unless the repository is intentionally migrated; do not introduce `pnpm-lock.yaml` unless the whole repo is switched.
- [x] Update `astro.config.mjs` for base path compatibility using existing `SITE_URL` and `BASE_PATH`, plus selected Firefly integrations.
- [x] Update TypeScript aliases for `@/*`, `@components/*`, `@layouts/*`, `@utils/*`, `@i18n/*`, `@assets/*`, and `@constants/*`.
- [x] Run `npm.cmd install --registry=https://registry.npmjs.org`.

## Task 2: Firefly Theme Core

**Files:**
- Create/replace: `src/config/*`
- Create/replace: `src/types/*`
- Create/replace: `src/constants/*`
- Create/replace: `src/i18n/*`
- Create/replace: `src/utils/*`
- Create/replace: `src/styles/*`
- Create/replace: `src/layouts/Layout.astro`
- Create/replace: `src/layouts/MainGridLayout.astro`

- [x] Copy the Firefly config/type/i18n/utils/style/layout backbone into `src/`.
- [x] Adapt `siteConfig` to MikanArchive: title, subtitle, description, URL, nav labels, page switches, theme hue, page width, and post list layout.
- [x] Disable unneeded demo features by default: sponsor, guestbook comments, bangumi, gallery, anime, Live2D/Spine, ads, external analytics, encrypted posts.
- [x] Preserve footer attribution to Astro, Firefly, and fuwari.
- [x] Replace Firefly default images in config with MikanArchive example assets or neutral local placeholders.

## Task 3: Content Model And Sync Mapping

**Files:**
- Modify: `src/content.config.ts`
- Modify: `scripts/sync-content.mjs`
- Modify: `scripts/validate-content.mjs`
- Modify: `content.example/posts/*`
- Modify/add: `content.example/profile/about.md`
- Modify/add: `content.example/resources/resources.json`
- Modify/add: `content.example/links/friends.json`
- Modify/add: `content.example/records/*.json`
- Modify/add: `content.example/assets/*`

- [x] Align post frontmatter with Firefly fields while accepting MikanArchive fields: `title`, `published`, `updated`, `draft`, `description`, `image`, `tags`, `category`, `pinned`, `comment`.
- [x] Make `sync-content` generate the Firefly `src/content/posts` and `src/content/spec/about.md` / `src/content/spec/friends.mdx` targets while preserving JSON data under `src/data/content/`.
- [x] Update validation so example content passes the new post field names and required JSON data.
- [x] Keep `content.example/` source format stable for the future private content repo.

## Task 4: Pages And Navigation

**Files:**
- Create/replace: `src/pages/index.astro`
- Create/replace: `src/pages/[...page].astro`
- Create/replace: `src/pages/posts/[...slug].astro`
- Create/replace: `src/pages/archive.astro`
- Create/replace: `src/pages/categories/index.astro`
- Create/replace: `src/pages/tags/index.astro`
- Create/replace: `src/pages/friends.astro`
- Create/replace: `src/pages/resources/index.astro`
- Create/replace: `src/pages/records/index.astro`
- Create/replace: `src/pages/about.astro`
- Keep compatibility wrappers if useful: `src/pages/posts/index.astro`, `src/pages/friends/index.astro`, `src/pages/about/index.astro`

- [x] Map MikanArchive navigation to Firefly-style routes: `主页 / 文库 / 收藏 / 友邻 / 足迹 / 我的`.
- [x] Keep `/posts/`, `/resources/`, `/friends/`, `/records/`, and `/about/` working for existing links.
- [x] Use Firefly-style home/list/post/friends structures where applicable.
- [x] Build MikanArchive resources and records pages in the same card/sidebar visual language.

## Task 5: Components And Interactions

**Files:**
- Create/replace: `src/components/common/*`
- Create/replace: `src/components/layout/*`
- Create/replace: `src/components/controls/*`
- Create/replace: `src/components/widget/*`
- Create/replace: `src/components/features/*` only for enabled features
- Create/adapt: MikanArchive resource and records components where needed

- [x] Copy/adapt Firefly common, layout, controls, and widget components required by enabled pages.
- [x] Remove or disable components that depend on excluded third-party assets or unnecessary services.
- [x] Ensure friend filtering, post list layout switching, theme switching, search, back-to-top, and sidebar TOC work.
- [x] Ensure all user-facing UI text defaults to Chinese.

## Task 6: Docs, Attribution, And Maintenance

**Files:**
- Modify: `README.md`
- Modify: `docs/content-repository.md`
- Modify: `docs/deployment-cloudflare-pages.md`
- Modify: `docs/maintenance.md`
- Modify: `AGENTS.md`
- Modify: `.agents/skills/mikan-archive-project/SKILL.md`
- Modify: `.agents/skills/mikan-archive-maintenance/SKILL.md` if workflow changes
- Modify: `CHANGELOG.md`
- Modify: `development-log.md`

- [x] Document Firefly as the theme foundation and preserve MIT attribution.
- [x] Update commands, dependencies, content mapping, and deployment notes.
- [x] Confirm no docs tell users to put private content or tokens into the public repo.
- [x] Add a new development-log entry for implementation and verification.

## Task 7: Verification And Visual QA

**Commands:**
- `npm.cmd run sync:content`
- `npm.cmd run validate:content`
- `npm.cmd run check`
- `npm.cmd run build`
- `npm.cmd run dev -- --host 127.0.0.1 --port 4321`

- [x] Run sync, validation, Astro check, and build.
- [x] Start a local dev or preview server.
- [x] Check desktop and mobile routes: `/`, `/posts/`, one post detail, `/resources/`, `/friends/`, `/records/`, `/about/`.
- [x] Verify no private content, tokens, fqzlr.com personal assets, or Firefly third-party character assets are committed.
- [x] Check `git status --short` and key diffs before final report.
