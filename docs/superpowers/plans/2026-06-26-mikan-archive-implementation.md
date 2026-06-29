# MikanArchive Implementation Plan

> 历史说明：本计划记录 2026-06-26 初版 Astro 实现路线。当前主题重构已改以 `docs/superpowers/plans/2026-06-27-mikan-archive-firefly-rebuild.md` 为准，旧计划中的 React islands、`cover` 字段和重复同步构建命令仅保留作历史背景。2026-06-29 起，当前公开站点已删除独立 `/records/` 足迹功能页，顶部导航调整为 `主页 / 文库 / 收藏 / 联系我 / 我的`，`/about/` 入口显示为“个人介绍”；本计划中涉及 records 页面和旧导航的条目不再作为后续验收目标。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first version of MikanArchive as an Astro static personal knowledge blog with separated public framework and private content support.

**Architecture:** The public repository contains the Astro theme, components, example content, scripts, docs, and validation. Real content is loaded from a private content repository during local development or deployment through a sync script, with `content.example/` as the public fallback. Pages are statically generated, with React islands only for interactive search, filters, dialogs, calendar/heatmap widgets, and theme controls.

**Tech Stack:** Astro, TypeScript, Markdown/MDX, Tailwind CSS, shadcn-style UI primitives, React islands, Node scripts, Cloudflare Pages.

---

## File Structure

Create or maintain these files:

```text
AGENTS.md
CHANGELOG.md
development-log.md
.env.example
.gitignore
README.md
package.json
astro.config.mjs
postcss.config.mjs
tailwind.config.mjs
tsconfig.json
src/content.config.ts
src/
  config/site.ts
  data/loaders.ts
  data/content/
  layouts/BaseLayout.astro
  layouts/PostLayout.astro
  components/
    site/SiteNav.astro
    site/SiteFooter.astro
    home/HomeHero.astro
    home/RecentPosts.astro
    home/FeaturedResources.astro
    home/FootprintPreview.astro
    cards/PostCard.astro
    cards/ResourceCard.astro
    cards/FriendCard.astro
    widgets/CalendarWidget.tsx
    widgets/WritingHeatmap.tsx
    dialogs/FriendApplyDialog.tsx
    search/SearchDialog.tsx
  pages/
    index.astro
    posts/index.astro
    posts/[...slug].astro
    resources/index.astro
    friends/index.astro
    records/index.astro
    about/index.astro
  styles/global.css
content.example/
  posts/2026-06-26-welcome-to-mikan-archive.md
  resources/resources.json
  links/friends.json
  links/sites.json
  profile/about.md
  profile/resume.json
  records/timeline.json
  records/updates.json
  assets/
    images/
    backgrounds/
    avatars/
    files/
public/
  assets/
scripts/
  sync-content.mjs
  validate-content.mjs
docs/
  content-repository.md
  deployment-cloudflare-pages.md
  maintenance.md
```

Responsibilities:

- `src/config/site.ts`: public site metadata and navigation.
- `src/content.config.ts`: Astro Content Layer collection schemas and `glob()` loaders for posts and profile Markdown.
- `src/data/loaders.ts`: typed loaders for JSON data in resources, links, records, and profile.
- `scripts/sync-content.mjs`: copy `content.example/` or clone/copy private content, then map posts/profile Markdown to `src/content/`, JSON data to `src/data/content/`, and public assets to `public/assets/`.
- `scripts/validate-content.mjs`: validate synced JSON data and post frontmatter before build.
- `content.example/`: safe public sample content only.
- `docs/`: human maintenance docs for content, deployment, and project conventions.

---

## Task 1: Initialize Astro Project Shell

**Files:**

- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `tsconfig.json`
- Create: `.node-version`
- Create: `.gitignore`
- Create: `.env.example`
- Modify: `development-log.md`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Create package metadata and scripts**

Create `package.json`:

```json
{
  "name": "mikan-archive",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22.12.0",
    "npm": ">=9.6.5"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "npm run validate:content && astro build",
    "preview": "astro preview",
    "sync:content": "node scripts/sync-content.mjs",
    "validate:content": "node scripts/validate-content.mjs",
    "check": "astro check"
  },
  "dependencies": {
    "@astrojs/markdown-satteri": "^0.3.2",
    "@astrojs/mdx": "^7.0.0",
    "@astrojs/react": "^6.0.0",
    "@astrojs/sitemap": "^3.7.3",
    "@tailwindcss/typography": "^0.5.20",
    "astro": "^7.0.3",
    "clsx": "latest",
    "lucide-react": "latest",
    "react": "latest",
    "react-dom": "latest",
    "tailwind-merge": "latest",
    "tailwindcss": "^3.4.19",
    "typescript": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.9",
    "autoprefixer": "^10.5.2",
    "postcss": "^8.5.15"
  }
}
```

- [ ] **Step 2: Create Astro config**

Create `astro.config.mjs`:

```js
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://example.com",
  integrations: [
    mdx(),
    react(),
    sitemap()
  ],
  markdown: {
    shikiConfig: {
      theme: "github-light"
    }
  }
});
```

- [ ] **Step 3: Create Tailwind config**

Create `tailwind.config.mjs`:

```js
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        accent: "hsl(var(--accent))",
        muted: "hsl(var(--muted))"
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px"
      },
      boxShadow: {
        soft: "0 18px 60px rgb(66 46 62 / 12%)"
      }
    }
  },
  plugins: [typography]
};
```

Create `postcss.config.mjs`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

- [ ] **Step 4: Create TypeScript config**

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 5: Create environment and ignore files**

Create `.env.example`:

```text
ENABLE_CONTENT_SYNC=false
CONTENT_REPO_URL=
CONTENT_BRANCH=main
CONTENT_LOCAL_PATH=
```

Create `.node-version`:

```text
22.16.0
```

Create `.gitignore`:

```text
node_modules/
dist/
.astro/
.env
.env.local
content/
.tmp-content-repo/
src/content/posts/
src/content/profile/
src/data/content/
public/assets/
.DS_Store
Thumbs.db
```

- [ ] **Step 6: Install dependencies**

Run:

```powershell
npm install
```

Expected: `package-lock.json` is created and install exits with code 0.

- [ ] **Step 7: Verify shell config**

Run:

```powershell
npm run check
```

Expected initially: may fail because `src/` does not exist yet. If it fails only because app files are not created, continue to Task 2 and re-run after layouts/pages exist.

- [ ] **Step 8: Record log**

Append a new entry to `development-log.md` describing the project shell initialization, dependency install, and check result.

- [ ] **Step 9: Commit**

Run:

```powershell
git add package.json package-lock.json astro.config.mjs postcss.config.mjs tailwind.config.mjs tsconfig.json .env.example .node-version .gitignore development-log.md CHANGELOG.md
git commit -m "chore: initialize astro project shell"
```

---

## Task 2: Create Example Content And Content Schemas

**Files:**

- Create: `content.example/posts/2026-06-26-welcome-to-mikan-archive.md`
- Create: `content.example/resources/resources.json`
- Create: `content.example/links/friends.json`
- Create: `content.example/links/sites.json`
- Create: `content.example/profile/about.md`
- Create: `content.example/profile/resume.json`
- Create: `content.example/records/timeline.json`
- Create: `content.example/records/updates.json`
- Create: `content.example/assets/images/welcome-cover.svg`
- Create: `content.example/assets/avatars/example-friend.svg`
- Create: `src/content.config.ts`
- Create: `src/data/loaders.ts`
- Modify: `development-log.md`

- [ ] **Step 1: Create sample post**

Create `content.example/posts/2026-06-26-welcome-to-mikan-archive.md`:

```md
---
title: "欢迎来到 MikanArchive"
description: "一篇示例文章，用于展示教程、收藏和个人记录如何组织。"
published: "2026-06-26"
updated: "2026-06-26"
category: "教程"
tags: ["Astro", "博客", "示例"]
cover: "/assets/images/welcome-cover.svg"
draft: false
type: "tutorial"
featured: true
---

这里是 MikanArchive 的示例文章。

你可以把教程、排错记录、资料整理和个人笔记写成 Markdown 或 MDX。
```

- [ ] **Step 2: Create sample resources**

Create `content.example/resources/resources.json`:

```json
[
  {
    "title": "Astro 文档",
    "url": "https://docs.astro.build/",
    "category": "文档",
    "tags": ["Astro", "静态站点"],
    "note": "用于查询 Astro 项目结构、内容集合和部署方式。",
    "featured": true,
    "addedAt": "2026-06-26"
  },
  {
    "title": "shadcn/ui",
    "url": "https://ui.shadcn.com/",
    "category": "组件",
    "tags": ["UI", "React", "Tailwind"],
    "note": "作为 MikanArchive 简洁高级组件风格的参考。",
    "featured": true,
    "addedAt": "2026-06-26"
  }
]
```

- [ ] **Step 3: Create friend and site links**

Create `content.example/links/friends.json`:

```json
[
  {
    "name": "夏夜流萤",
    "url": "https://blog.cuteleaf.cn",
    "avatar": "/assets/avatars/example-friend.svg",
    "description": "飞萤之火自无梦的长夜亮起。",
    "category": "Blog",
    "tags": ["Astro", "博客", "二次元"],
    "featured": true,
    "status": "active",
    "addedAt": "2026-06-26"
  }
]
```

Create `content.example/links/sites.json`:

```json
[
  {
    "name": "GitHub",
    "url": "https://github.com",
    "description": "代码托管与开源协作入口。",
    "category": "开发",
    "tags": ["Code", "Open Source"]
  }
]
```

- [ ] **Step 4: Create profile and records data**

Create `content.example/profile/about.md`:

```md
---
title: "关于我"
description: "MikanArchive 的示例个人介绍。"
---

这里放个人介绍、技能栈、项目入口和联系方式。
```

Create `content.example/profile/resume.json`:

```json
{
  "name": "MikanArchive",
  "headline": "个人知识收藏博客",
  "location": "China",
  "links": [
    {
      "label": "GitHub",
      "url": "https://github.com"
    }
  ],
  "skills": ["Astro", "TypeScript", "Markdown", "Design Systems"]
}
```

Create `content.example/records/timeline.json`:

```json
[
  {
    "date": "2026-06-26",
    "title": "MikanArchive 设计完成",
    "description": "确定博客架构、视觉方向、内容分离和第一版范围。"
  }
]
```

Create `content.example/records/updates.json`:

```json
[
  {
    "date": "2026-06-26",
    "type": "docs",
    "title": "初始化项目设计",
    "description": "创建设计文档、协作规则和维护流程。"
  }
]
```

- [ ] **Step 5: Create sample SVG assets**

Create `content.example/assets/images/welcome-cover.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 480" role="img" aria-label="MikanArchive welcome cover">
  <rect width="960" height="480" fill="#fff7fb"/>
  <circle cx="780" cy="96" r="140" fill="#bfdbfe" opacity="0.65"/>
  <circle cx="150" cy="390" r="130" fill="#fde68a" opacity="0.65"/>
  <rect x="190" y="150" width="580" height="190" rx="18" fill="#ffffff" stroke="#f9a8d4" stroke-width="4"/>
  <text x="240" y="235" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="#be185d">MikanArchive</text>
  <text x="242" y="285" font-family="Arial, sans-serif" font-size="24" fill="#64748b">Tutorials · Resources · Footprints</text>
</svg>
```

Create `content.example/assets/avatars/example-friend.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" role="img" aria-label="Example friend avatar">
  <rect width="160" height="160" rx="32" fill="#fff7fb"/>
  <circle cx="80" cy="64" r="34" fill="#f9a8d4"/>
  <path d="M32 138c8-30 30-48 48-48s40 18 48 48" fill="#bfdbfe"/>
  <circle cx="66" cy="60" r="5" fill="#1f2937"/>
  <circle cx="94" cy="60" r="5" fill="#1f2937"/>
</svg>
```

- [ ] **Step 6: Create content schema**

Create `src/content.config.ts`:

```ts
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.string(),
    tags: z.array(z.string()),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
    type: z.enum(["tutorial", "note", "reference"]).default("note"),
    featured: z.boolean().default(false),
    series: z.string().optional()
  })
});

const profile = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/profile" }),
  schema: z.object({
    title: z.string(),
    description: z.string()
  })
});

export const collections = { posts, profile };
```

- [ ] **Step 7: Create JSON loaders**

Create `src/data/loaders.ts`:

```ts
import { readFile } from "node:fs/promises";
import { z } from "zod";

const dataRoot = new URL("./content/", import.meta.url);

export const resourceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  category: z.string(),
  tags: z.array(z.string()),
  note: z.string(),
  featured: z.boolean().default(false),
  cover: z.string().optional(),
  source: z.string().optional(),
  addedAt: z.string().optional()
});

export const friendSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  avatar: z.string(),
  description: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  featured: z.boolean().default(false),
  status: z.enum(["active", "featured", "unavailable"]).default("active"),
  lastCheckedAt: z.string().optional(),
  addedAt: z.string().optional()
});

export const timelineItemSchema = z.object({
  date: z.string(),
  title: z.string(),
  description: z.string()
});

export const updateItemSchema = z.object({
  date: z.string(),
  type: z.string(),
  title: z.string(),
  description: z.string()
});

async function readJson<T>(relativePath: string, schema: z.ZodType<T>): Promise<T> {
  const fileUrl = new URL(relativePath, dataRoot);
  const raw = await readFile(fileUrl, "utf-8");
  return schema.parse(JSON.parse(raw));
}

export function getResources() {
  return readJson("resources/resources.json", z.array(resourceSchema));
}

export function getFriends() {
  return readJson("links/friends.json", z.array(friendSchema));
}

export function getSites() {
  return readJson("links/sites.json", z.array(
    z.object({
      name: z.string(),
      url: z.string().url(),
      description: z.string(),
      category: z.string(),
      tags: z.array(z.string())
    })
  ));
}

export function getTimeline() {
  return readJson("records/timeline.json", z.array(timelineItemSchema));
}

export function getUpdates() {
  return readJson("records/updates.json", z.array(updateItemSchema));
}
```

- [ ] **Step 8: Run validation**

Run:

```powershell
npm run validate:content
```

Expected initially: FAIL because `scripts/validate-content.mjs` is not created yet. Continue to Task 3.

- [ ] **Step 9: Record log and commit**

Update `development-log.md`, then run:

```powershell
git add content.example src/content.config.ts src/content src/data development-log.md
git commit -m "feat: add example content and content schemas"
```

---

## Task 3: Implement Content Sync And Validation Scripts

**Files:**

- Create: `scripts/sync-content.mjs`
- Create: `scripts/validate-content.mjs`
- Modify: `package.json`
- Modify: `docs/content-repository.md`
- Modify: `development-log.md`

- [ ] **Step 1: Write failing validation scenario**

Before implementing scripts, create a temporary invalid file:

```powershell
Copy-Item content.example/resources/resources.json content.example/resources/resources.invalid.json
```

Edit `content.example/resources/resources.invalid.json` to remove `note` from one item.

Run:

```powershell
npm run validate:content
```

Expected: FAIL because script does not exist yet.

- [ ] **Step 2: Implement sync script**

Create `scripts/sync-content.mjs`:

```js
import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const astroContentDir = path.join(root, "src", "content");
const dataContentDir = path.join(root, "src", "data", "content");
const publicAssetsDir = path.join(root, "public", "assets");
const exampleDir = path.join(root, "content.example");
const tempDir = path.join(root, ".tmp-content-repo");

const enableSync = process.env.ENABLE_CONTENT_SYNC === "true";
const repoUrl = process.env.CONTENT_REPO_URL;
const branch = process.env.CONTENT_BRANCH || "main";
const localPath = process.env.CONTENT_LOCAL_PATH;

async function replaceContentFrom(contentSourceDir) {
  if (!existsSync(contentSourceDir)) {
    throw new Error(`Content source does not exist: ${contentSourceDir}`);
  }
  const sourceAssets = path.join(contentSourceDir, "assets");

  await rm(path.join(astroContentDir, "posts"), { recursive: true, force: true });
  await rm(path.join(astroContentDir, "profile"), { recursive: true, force: true });
  await rm(dataContentDir, { recursive: true, force: true });
  await rm(publicAssetsDir, { recursive: true, force: true });

  await mkdir(astroContentDir, { recursive: true });
  await mkdir(dataContentDir, { recursive: true });
  await mkdir(publicAssetsDir, { recursive: true });

  await cp(path.join(contentSourceDir, "posts"), path.join(astroContentDir, "posts"), { recursive: true });
  await cp(path.join(contentSourceDir, "profile"), path.join(astroContentDir, "profile"), { recursive: true });
  await cp(path.join(contentSourceDir, "resources"), path.join(dataContentDir, "resources"), { recursive: true });
  await cp(path.join(contentSourceDir, "links"), path.join(dataContentDir, "links"), { recursive: true });
  await cp(path.join(contentSourceDir, "records"), path.join(dataContentDir, "records"), { recursive: true });

  if (existsSync(sourceAssets)) {
    await cp(sourceAssets, publicAssetsDir, { recursive: true });
  }
}

if (enableSync) {
  if (localPath) {
    await replaceContentFrom(path.join(localPath, "content"));
  } else if (repoUrl) {
    await rm(tempDir, { recursive: true, force: true });
    const clone = spawnSync("git", ["clone", "--depth", "1", "--branch", branch, repoUrl, tempDir], {
      stdio: "inherit"
    });
    if (clone.status !== 0) {
      throw new Error("Failed to clone content repository.");
    }
    await replaceContentFrom(path.join(tempDir, "content"));
    await rm(tempDir, { recursive: true, force: true });
  } else {
    throw new Error("ENABLE_CONTENT_SYNC=true requires CONTENT_REPO_URL or CONTENT_LOCAL_PATH.");
  }
} else {
  await replaceContentFrom(exampleDir);
}

console.log("Content synced to src/content, src/data/content, and public/assets.");
```

- [ ] **Step 3: Implement validation script**

Create `scripts/validate-content.mjs`:

```js
import { readdir, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const astroContentRoot = path.join(root, "src", "content");
const dataContentRoot = path.join(root, "src", "data", "content");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function readJson(relativePath) {
  const fullPath = path.join(dataContentRoot, relativePath);
  const raw = await readFile(fullPath, "utf-8");
  return JSON.parse(raw);
}

function validateResource(item, index) {
  for (const key of ["title", "url", "category", "tags", "note"]) {
    assert(item[key] !== undefined, `resources[${index}] missing ${key}`);
  }
  assert(Array.isArray(item.tags), `resources[${index}].tags must be an array`);
}

function validateFriend(item, index) {
  for (const key of ["name", "url", "avatar", "description", "category", "tags"]) {
    assert(item[key] !== undefined, `friends[${index}] missing ${key}`);
  }
  assert(Array.isArray(item.tags), `friends[${index}].tags must be an array`);
}

async function validatePosts() {
  const postsDir = path.join(astroContentRoot, "posts");
  assert(existsSync(postsDir), "src/content/posts is required");
  const files = await readdir(postsDir);
  const markdownFiles = files.filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
  assert(markdownFiles.length > 0, "src/content/posts must contain at least one Markdown or MDX file");
  for (const file of markdownFiles) {
    const raw = await readFile(path.join(postsDir, file), "utf-8");
    assert(raw.startsWith("---"), `${file} must start with frontmatter`);
    const end = raw.indexOf("\\n---", 3);
    assert(end !== -1, `${file} must close frontmatter`);
    const frontmatter = raw.slice(3, end);
    for (const key of ["title:", "description:", "published:", "category:", "tags:", "draft:"]) {
      assert(frontmatter.includes(key), `${file} missing frontmatter field ${key.replace(":", "")}`);
    }
  }
}

async function validateJsonFiles() {
  const resources = await readJson("resources/resources.json");
  assert(Array.isArray(resources), "resources/resources.json must be an array");
  resources.forEach(validateResource);

  const friends = await readJson("links/friends.json");
  assert(Array.isArray(friends), "links/friends.json must be an array");
  friends.forEach(validateFriend);

  for (const file of ["links/sites.json", "records/timeline.json", "records/updates.json", "profile/resume.json"]) {
    const fullPath = path.join(dataContentRoot, file);
    assert((await stat(fullPath)).isFile(), `${file} must exist`);
    JSON.parse(await readFile(fullPath, "utf-8"));
  }
}

await validatePosts();
await validateJsonFiles();
console.log("Content validation passed.");
```

- [ ] **Step 4: Verify validation fails on invalid data**

Run:

```powershell
npm run sync:content
Copy-Item content.example/resources/resources.invalid.json src/data/content/resources/resources.json
npm run validate:content
```

Expected: FAIL with a message containing `missing note`.

- [ ] **Step 5: Verify validation passes on valid data**

Run:

```powershell
npm run sync:content
npm run validate:content
```

Expected: PASS with `Content validation passed.`

Remove the temporary invalid file:

```powershell
Remove-Item content.example/resources/resources.invalid.json
```

- [ ] **Step 6: Document content repository**

Create `docs/content-repository.md` with this content:

    # 内容仓库说明

    MikanArchive 的公开框架仓库不保存真实文章和私有图片。真实内容建议放在私有仓库 `mikan-archive-content`。

    ## 结构

    ```text
    content/
      posts/
      resources/resources.json
      links/friends.json
      links/sites.json
      profile/about.md
      profile/resume.json
      records/timeline.json
      records/updates.json
      assets/images/
      assets/backgrounds/
      assets/avatars/
      assets/files/
    ```

    ## 本地预览

    未配置私有内容时：

    ```powershell
    npm run sync:content
    npm run dev
    ```

    使用本地私有内容目录：

    ```powershell
    $env:ENABLE_CONTENT_SYNC="true"
    $env:CONTENT_LOCAL_PATH="../mikan-archive-content"
    npm run sync:content
    ```

- [ ] **Step 7: Record log and commit**

Update `development-log.md`, then run:

```powershell
git add scripts docs/content-repository.md package.json content.example development-log.md
git commit -m "feat: add content sync and validation"
```

---

## Task 4: Build Base Layout And Visual System

**Files:**

- Create: `src/styles/global.css`
- Create: `src/config/site.ts`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/layouts/PostLayout.astro`
- Create: `src/components/site/SiteNav.astro`
- Create: `src/components/site/SiteFooter.astro`
- Modify: `development-log.md`

- [ ] **Step 1: Write minimal layout files**

Create `src/config/site.ts`:

```ts
export const siteConfig = {
  name: "MikanArchive",
  description: "个人知识收藏博客",
  nav: [
    { label: "主页", href: "/" },
    { label: "文库", href: "/posts/" },
    { label: "收藏", href: "/resources/" },
    { label: "友邻", href: "/friends/" },
    { label: "足迹", href: "/records/" },
    { label: "我的", href: "/about/" }
  ],
  friendInfo: {
    name: "MikanArchive",
    description: "一个记录教程、收藏资源和整理足迹的个人知识收藏博客。",
    url: "https://example.com",
    avatar: "https://example.com/avatar.png"
  }
};
```

- [ ] **Step 2: Create global styles**

Create `src/styles/global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 330 45% 98%;
  --foreground: 240 18% 14%;
  --border: 330 22% 86%;
  --primary: 335 72% 50%;
  --accent: 204 82% 70%;
  --muted: 330 24% 94%;
}

html {
  min-height: 100%;
  scroll-behavior: smooth;
}

body {
  min-height: 100%;
  margin: 0;
  background:
    radial-gradient(circle at 90% 10%, rgb(147 197 253 / 34%), transparent 28%),
    radial-gradient(circle at 10% 90%, rgb(253 230 138 / 38%), transparent 26%),
    hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

.container {
  width: min(1120px, calc(100% - 32px));
  margin-inline: auto;
}

.glass {
  background: rgb(255 255 255 / 72%);
  border: 1px solid hsl(var(--border) / 0.72);
  backdrop-filter: blur(18px);
}
```

- [ ] **Step 3: Create navigation and footer**

Create `src/components/site/SiteNav.astro`:

```astro
---
import { siteConfig } from "@/config/site";
---

<header class="sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur-xl">
  <nav class="container flex min-h-16 items-center justify-between gap-4">
    <a href="/" class="font-semibold tracking-normal">{siteConfig.name}</a>
    <div class="flex flex-wrap items-center justify-end gap-1 text-sm text-foreground/72">
      {siteConfig.nav.map((item) => (
        <a class="rounded-md px-3 py-2 transition hover:bg-muted hover:text-foreground" href={item.href}>
          {item.label}
        </a>
      ))}
    </div>
  </nav>
</header>
```

Create `src/components/site/SiteFooter.astro`:

```astro
---
import { siteConfig } from "@/config/site";
---

<footer class="mt-20 border-t border-border/70 py-8 text-sm text-foreground/60">
  <div class="container flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <p>{siteConfig.name} · {siteConfig.description}</p>
    <p>Built with Astro.</p>
  </div>
</footer>
```

- [ ] **Step 4: Create layouts**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import SiteFooter from "@/components/site/SiteFooter.astro";
import SiteNav from "@/components/site/SiteNav.astro";
import "@/styles/global.css";

interface Props {
  title?: string;
  description?: string;
}

const { title = "MikanArchive", description = "个人知识收藏博客" } = Astro.props;
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body>
    <SiteNav />
    <main>
      <slot />
    </main>
    <SiteFooter />
  </body>
</html>
```

Create `src/layouts/PostLayout.astro`:

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";

const { title, description } = Astro.props;
---

<BaseLayout title={title} description={description}>
  <article class="container mt-10 max-w-3xl rounded-lg border border-border/70 bg-white/78 p-6 shadow-soft">
    <slot />
  </article>
</BaseLayout>
```

- [ ] **Step 5: Verify style build**

Run:

```powershell
npm run sync:content
npm run check
```

Expected: may still fail because pages are missing. Continue to Task 5 and re-run.

- [ ] **Step 6: Record log and commit**

Update `development-log.md`, then run:

```powershell
git add src development-log.md
git commit -m "feat: add base layout and visual system"
```

---

## Task 5: Implement Pages And Core Components

**Files:**

- Create: components listed in File Structure.
- Create: all pages listed in File Structure.
- Modify: `development-log.md`

- [ ] **Step 1: Create reusable cards**

Create `src/components/cards/PostCard.astro`:

```astro
---
const { title, description, href, category, tags = [] } = Astro.props;
---

<a href={href} class="block rounded-lg border border-border/70 bg-white/78 p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40">
  <div class="mb-3 text-xs font-semibold text-primary">{category}</div>
  <h3 class="text-lg font-semibold">{title}</h3>
  <p class="mt-2 text-sm leading-6 text-foreground/66">{description}</p>
  <div class="mt-4 flex flex-wrap gap-2">
    {tags.map((tag) => <span class="rounded-md bg-muted px-2 py-1 text-xs text-foreground/64">{tag}</span>)}
  </div>
</a>
```

Create `src/components/cards/ResourceCard.astro`:

```astro
---
const { title, url, category, tags = [], note, featured = false } = Astro.props;
---

<a href={url} target="_blank" rel="noreferrer" class="block rounded-lg border border-border/70 bg-white/78 p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-accent/50">
  <div class="mb-3 flex items-center justify-between gap-3">
    <span class="text-xs font-semibold text-primary">{category}</span>
    {featured && <span class="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">推荐</span>}
  </div>
  <h3 class="text-lg font-semibold">{title}</h3>
  <p class="mt-2 text-sm leading-6 text-foreground/66">{note}</p>
  <div class="mt-4 flex flex-wrap gap-2">
    {tags.map((tag) => <span class="rounded-md bg-muted px-2 py-1 text-xs text-foreground/64">{tag}</span>)}
  </div>
</a>
```

Create `src/components/cards/FriendCard.astro`:

```astro
---
const { name, url, avatar, description, category, tags = [], featured = false, status = "active" } = Astro.props;
---

<a href={url} target="_blank" rel="noreferrer" class="group flex gap-4 rounded-lg border border-border/70 bg-white/78 p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40">
  <img src={avatar} alt={`${name} avatar`} class="h-16 w-16 shrink-0 rounded-lg border border-border object-cover" />
  <div class="min-w-0 flex-1">
    <div class="flex flex-wrap items-center gap-2">
      <h3 class="truncate text-base font-semibold">{name}</h3>
      <span class="rounded-md bg-muted px-2 py-1 text-xs text-foreground/60">{category}</span>
      {featured && <span class="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">推荐</span>}
      {status === "unavailable" && <span class="rounded-md bg-neutral-200 px-2 py-1 text-xs text-neutral-600">暂不可达</span>}
    </div>
    <p class="mt-2 line-clamp-2 text-sm leading-6 text-foreground/66">{description}</p>
    <div class="mt-3 flex flex-wrap gap-2">
      {tags.map((tag) => <span class="rounded-md bg-muted px-2 py-1 text-xs text-foreground/64">{tag}</span>)}
    </div>
  </div>
</a>
```

- [ ] **Step 2: Create interactive islands**

Create `src/components/dialogs/FriendApplyDialog.tsx`:

```tsx
import { Copy, Mail } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/config/site";

export function FriendApplyDialog() {
  const [open, setOpen] = useState(false);
  const fields = [
    ["站点名称", siteConfig.friendInfo.name],
    ["站点描述", siteConfig.friendInfo.description],
    ["站点链接", siteConfig.friendInfo.url],
    ["头像链接", siteConfig.friendInfo.avatar]
  ];

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
  }

  return (
    <>
      <button className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-white" onClick={() => setOpen(true)}>
        申请友链
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4">
          <section className="max-h-[88vh] w-full max-w-2xl overflow-auto rounded-lg bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">友链申请指南</h2>
              <button className="rounded-md px-3 py-2 text-sm hover:bg-neutral-100" onClick={() => setOpen(false)}>关闭</button>
            </div>
            <div className="mt-5 space-y-3">
              {fields.map(([label, value]) => (
                <div className="flex items-center justify-between gap-3 rounded-md bg-neutral-50 p-3" key={label}>
                  <div>
                    <div className="text-xs text-neutral-500">{label}</div>
                    <div className="text-sm font-medium">{value}</div>
                  </div>
                  <button aria-label={`复制${label}`} onClick={() => copy(value)} className="rounded-md p-2 hover:bg-neutral-200">
                    <Copy size={16} />
                  </button>
                </div>
              ))}
            </div>
            <ol className="mt-5 space-y-2 text-sm leading-6 text-neutral-700">
              <li>1. 请先把本站添加到你的友链页。</li>
              <li>2. 通过邮件或联系方式发送你的站点名称、描述、链接和头像。</li>
              <li>3. 确认可访问且内容健康后，我会手动加入友邻列表。</li>
            </ol>
            <a className="mt-5 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm" href="mailto:hello@example.com">
              <Mail size={16} /> 手动申请友链
            </a>
          </section>
        </div>
      )}
    </>
  );
}
```

Create `src/components/widgets/CalendarWidget.tsx`:

```tsx
type CalendarEvent = {
  date: string;
  title: string;
};

export function CalendarWidget({ events = [] }: { events?: CalendarEvent[] }) {
  const today = new Date();
  const days = Array.from({ length: 35 }, (_, index) => index + 1);
  const eventDates = new Set(events.map((event) => event.date));

  return (
    <section className="rounded-lg border border-border/70 bg-white/78 p-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">记录日历</h2>
        <span className="text-xs text-foreground/60">{today.getFullYear()}</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const active = eventDates.has(dateKey);
          return (
            <div key={day} className={`grid aspect-square place-items-center rounded-md text-xs ${active ? "bg-primary text-white" : "bg-muted text-foreground/60"}`}>
              {day}
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

Create `src/components/widgets/WritingHeatmap.tsx`:

```tsx
type HeatmapItem = {
  date: string;
  count?: number;
};

export function WritingHeatmap({ items = [] }: { items?: HeatmapItem[] }) {
  const counts = new Map(items.map((item) => [item.date, item.count ?? 1]));
  const cells = Array.from({ length: 84 }, (_, index) => {
    const value = counts.size > 0 ? Array.from(counts.values())[index % counts.size] ?? 0 : index % 5 === 0 ? 1 : 0;
    return value;
  });

  return (
    <section className="rounded-lg border border-border/70 bg-white/78 p-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">写作热力图</h2>
        <span className="text-xs text-foreground/60">最近记录</span>
      </div>
      <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-hidden">
        {cells.map((value, index) => (
          <span key={index} className={`h-3 w-3 rounded-sm ${value > 2 ? "bg-primary" : value > 0 ? "bg-primary/40" : "bg-muted"}`} />
        ))}
      </div>
    </section>
  );
}
```

Create `src/components/search/SearchDialog.tsx`:

```tsx
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

type SearchItem = {
  title: string;
  description: string;
  href: string;
};

export function SearchDialog({ items = [] }: { items?: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items.slice(0, 6);
    return items.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(normalized)).slice(0, 8);
  }, [items, query]);

  return (
    <>
      <button className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm" onClick={() => setOpen(true)}>
        <Search size={16} /> 搜索
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-start bg-black/45 p-4 pt-24">
          <section className="mx-auto w-full max-w-2xl rounded-lg bg-white p-4 shadow-soft">
            <div className="flex gap-2">
              <input className="min-w-0 flex-1 rounded-md border border-border px-3 py-2" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索文章和收藏" />
              <button className="rounded-md px-3 py-2 text-sm hover:bg-neutral-100" onClick={() => setOpen(false)}>关闭</button>
            </div>
            <div className="mt-4 space-y-2">
              {results.map((item) => (
                <a key={item.href} href={item.href} className="block rounded-md p-3 hover:bg-neutral-50">
                  <div className="font-medium">{item.title}</div>
                  <div className="mt-1 text-sm text-neutral-600">{item.description}</div>
                </a>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 3: Create pages**

Create:

- `src/pages/index.astro`: home sections.
- `src/pages/posts/index.astro`: list non-draft posts.
- `src/pages/posts/[...slug].astro`: render post detail.
- `src/pages/resources/index.astro`: resource cards.
- `src/pages/friends/index.astro`: friend card wall and `FriendApplyDialog`.
- `src/pages/records/index.astro`: calendar, heatmap, timeline, updates.
- `src/pages/about/index.astro`: about Markdown and resume JSON.

Each page must use `BaseLayout`, call the appropriate data loaders, and keep copy in Chinese.

- [ ] **Step 4: Verify pages**

Run:

```powershell
npm run sync:content
npm run check
npm run build
```

Expected: all pass and `dist/` is generated.

- [ ] **Step 5: Visual smoke test**

Run:

```powershell
npm run dev
```

Open local URL and inspect:

- home page loads.
- `/posts/`, `/resources/`, `/friends/`, `/records/`, `/about/` load.
- friend application dialog opens and closes.
- cards do not overlap on desktop and mobile widths.

- [ ] **Step 6: Record log and commit**

Update `development-log.md`, then run:

```powershell
git add src development-log.md
git commit -m "feat: implement first version pages"
```

---

## Task 6: Write README And Deployment Docs

**Files:**

- Create: `README.md`
- Create: `docs/deployment-cloudflare-pages.md`
- Create: `docs/maintenance.md`
- Modify: `CHANGELOG.md`
- Modify: `development-log.md`

- [ ] **Step 1: Create README**

Create `README.md` with these sections:

    # MikanArchive

    MikanArchive 是一个轻二次元风格的个人知识收藏博客，用于记录教程、资源收藏、友链、个人资料和写作足迹。

    ## 特点

    - Astro 静态生成。
    - Markdown/MDX 写作。
    - 公开框架仓库与私有内容仓库分离。
    - 主页 / 文库 / 收藏 / 友邻 / 足迹 / 我的。
    - Cloudflare Pages 优先部署。

    ## 本地开发

    ```powershell
    npm install
    npm run sync:content
    npm run dev
    ```

    ## 内容仓库

    真实内容建议放在私有仓库 `mikan-archive-content`。公开仓库提供 `content.example/` 作为示例。

    ## 验证

    ```powershell
    npm run validate:content
    npm run check
    npm run build
    ```

- [ ] **Step 2: Create Cloudflare Pages deployment doc**

Create `docs/deployment-cloudflare-pages.md` explaining:

- Build command: `npm run build`
- Output directory: `dist`
- Required environment variables.
- Private repository access options.
- Fallback to `content.example/`.

- [ ] **Step 3: Create maintenance doc**

Create `docs/maintenance.md` explaining:

- Read `AGENTS.md`.
- Use project-local skills.
- Update `development-log.md` for every change.
- Update `CHANGELOG.md` for user-facing, deployment, or version-significant changes.
- Do not create Release unless explicitly requested.

- [ ] **Step 4: Update changelog**

Update `CHANGELOG.md` under `Unreleased` with:

- Astro shell.
- Content sync and validation.
- First version pages.
- Cloudflare Pages docs.

- [ ] **Step 5: Verify docs**

Run:

```powershell
rg -n "MikanArchive|Cloudflare Pages|development-log|content.example|主页 / 文库 / 收藏 / 友邻 / 足迹 / 我的" README.md docs AGENTS.md .agents CHANGELOG.md
```

Expected: relevant references are present.

- [ ] **Step 6: Record log and commit**

Update `development-log.md`, then run:

```powershell
git add README.md docs CHANGELOG.md development-log.md
git commit -m "docs: add project usage and deployment docs"
```

---

## Task 7: Final Verification And GitHub Preparation

**Files:**

- Modify: `development-log.md`
- Modify: `CHANGELOG.md` if final verification changes user-facing notes.

- [ ] **Step 1: Run full verification**

Run:

```powershell
npm run sync:content
npm run validate:content
npm run check
npm run build
```

Expected: all pass.

- [ ] **Step 2: Run local preview**

Run:

```powershell
npm run preview
```

Open preview URL and verify:

- Home page renders.
- Navigation links work.
- Post detail renders.
- Friend apply dialog works.
- No obvious text overlap on desktop and mobile.

- [ ] **Step 3: Check documentation consistency**

Run:

```powershell
rg -n "localhost:[0-9]+|CONTENT_REPO_URL|Cloudflare Pages|Release|主页 / 文库 / 收藏 / 友邻 / 足迹 / 我的" README.md docs AGENTS.md .agents CHANGELOG.md development-log.md
```

Expected:

- Public docs do not depend on a machine-specific numbered workspace path.
- Machine-specific localhost preview ports do not appear in project docs.
- Deployment variables and navigation are documented consistently.

- [ ] **Step 4: Record final log**

Update `development-log.md` with verification results.

- [ ] **Step 5: Commit final prep**

Run:

```powershell
git status --short
git add development-log.md CHANGELOG.md
git commit -m "chore: prepare mikan archive for github"
```

- [ ] **Step 6: Connect GitHub remote**

After the user creates the GitHub repository, run:

```powershell
git remote add origin https://github.com/Dylanliiiii/mikan-archive.git
git branch -M main
git push -u origin main
```

Expected: repository is pushed to GitHub.

---

## Self-Review Checklist

- Spec coverage:
  - Architecture: Tasks 1, 3, 4.
  - Content separation: Tasks 2, 3, 6.
  - Pages: Task 5.
  - Visual system: Task 4 and Task 5.
  - Friend-link dialog: Task 5.
  - Deployment: Task 6 and Task 7.
  - Maintenance rules: already initialized before this plan and reinforced in Tasks 6-7.
- Placeholder scan:
  - No unresolved placeholder markers are allowed in implementation artifacts.
  - `https://example.com` is allowed only as public example config before the user provides a real domain.
- Type consistency:
  - Resource and friend JSON fields match loader schemas and spec.
  - Navigation labels match `AGENTS.md` and spec.
  - Content sync copies to `content/`, and build validation reads from `content/`.
