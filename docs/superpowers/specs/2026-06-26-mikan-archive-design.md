# MikanArchive Design Spec

Date: 2026-06-26

## Summary

MikanArchive is a personal knowledge-collection blog: a readable tutorial blog with a light anime-inspired archive aesthetic. It should feel like a personal library for tutorials, resources, links, notes, and update traces, while staying professional enough to include on a resume.

The first version will be a static Astro site with a public framework repository and a separate private content repository. The public repository contains the theme, components, configuration templates, example content, documentation, and update logs. The private content repository contains the author's real posts, images, backgrounds, friend links, resource records, profile data, and timeline/update data.

## Goals

- Build a visually distinctive personal blog rather than a generic homepage.
- Prioritize writing, collecting, and rediscovering tutorials and useful resources.
- Keep maintenance simple: Markdown/MDX files, JSON data files, and image folders.
- Allow the blog framework to be open source without exposing private source content.
- Support public access through a shareable URL even when the local computer is off.
- Make the site suitable for resume use.
- Preserve room for later features such as comments, albums, anime tracking, music, and CMS support.

## Non-Goals For Version 1

- No admin login dashboard.
- No in-site one-click upload flow.
- No database.
- No public user registration.
- No complex CMS.
- No fully automated friend-link approval.

These can be added later if they become worth the added complexity.

## Recommended Architecture

MikanArchive will use:

- Astro as the main static-site framework.
- Markdown and MDX for posts and long-form content.
- Tailwind CSS for the styling system.
- shadcn-style components for buttons, cards, dialogs, badges, search surfaces, and other UI primitives.
- Small React islands only where interactivity is needed, such as search, filters, friend-link dialogs, calendars, heatmaps, and theme controls.
- Static generation for fast hosting on Cloudflare Pages or Vercel.

Repository layout:

```text
mikan-archive
- public framework repository
- theme source code
- layouts and components
- style system
- example content
- configuration templates
- README
- CHANGELOG
- docs

mikan-archive-content
- private content repository
- real posts
- images and background assets
- resource collection data
- friend-link data
- profile and resume data
- timeline and update records
```

During deployment, the hosting platform builds the public framework repository. Before the Astro build runs, a content sync step pulls the private content repository using deployment environment variables and copies it into the expected local content paths.

Result:

- Visitors opening the blog URL see the final published site and real content.
- People browsing the public GitHub repository see the reusable framework and example content.
- The author's real source content can remain in a private repository.

## Deployment Model

Primary deployment target: Cloudflare Pages.

Secondary deployment target: Vercel.

Version 1 must include a working Cloudflare Pages deployment path. Vercel support should be documented as a compatible alternative, but the first implementation plan should optimize for Cloudflare Pages first because it is cost-friendly, static-site friendly, and suitable for a globally accessible personal site.

Build flow:

```text
1. Push public framework repository.
2. Hosting platform starts a build.
3. Build reads environment variables.
4. If content sync is enabled, clone or fetch the private content repository.
5. Copy content into the framework project's content paths.
6. Run Astro build.
7. Publish the generated static site.
```

Environment variables:

```text
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=<private content repository URL>
CONTENT_BRANCH=main
```

The public repository should also work without private content sync by falling back to `content.example/`.

## Site Navigation

The top navigation should be:

```text
主页 / 文库 / 收藏 / 友邻 / 足迹 / 我的
```

This structure is more expressive than a plain "posts/resources/about" navigation while still being clear and resume-friendly.

Navigation meaning:

- 主页: landing page and overview.
- 文库: tutorials, notes, archives, and tags.
- 收藏: resource cards, tools, references, documents, and useful external links.
- 友邻: friend links, recommended sites, and friend-link application guide.
- 足迹: calendar, writing heatmap, timeline, recent updates, and stats.
- 我的: profile, resume, projects, skills, devices/workflow, and external accounts.

## Version 1 Pages

### Home

Route: `/`

The home page should present the blog as a living knowledge archive, not a marketing landing page.

Required sections:

- Glass-like top navigation.
- Configurable background image or soft animated background layer.
- Site title and one-sentence intro.
- Recent posts from 文库.
- Featured resources from 收藏.
- Footprint widget: calendar, writing heatmap, or recent update feed.
- Friend-link preview.
- Small profile card that links to 我的.

### Library

Route: `/posts`

The library is the core writing area.

Required features:

- Post list.
- Category filter.
- Tag filter.
- Search.
- Archive entry points.
- Draft support through a `draft` frontmatter field.
- Support for tutorial, note, and reference-style posts.

### Post Detail

Route: `/posts/[slug]`

Required features:

- Markdown/MDX body.
- Code highlighting.
- Table of contents.
- Reading time.
- Previous and next post links.
- Tags and category.
- Cover image.
- Optional MDX components such as callouts, warnings, link cards, and resource embeds.
- Reading progress indicator.

The post detail page should be visually calmer than the home page so tutorials stay easy to read.

### Collection

Route: `/resources`

The collection page stores useful external links and downloaded/reference materials.

Required features:

- Resource card grid.
- Category filter.
- Tag filter.
- Featured/recommended marker.
- Notes explaining why an item was saved or what problem it solved.
- Support for external links and local public files.

Suggested categories:

- 工具
- 教程
- 文档
- 软件
- 资料
- 灵感

### Friends

Route: `/friends`

The friends page should use a friend-card wall inspired by common blogroll pages, but with MikanArchive's own light anime archive style.

Required features:

- Friend-card grid.
- Each card displays avatar, site name, description, tags, and link.
- Optional card states: featured, recently updated, unavailable.
- Category filter: all, blogs, docs, tools, friends.
- Hover interaction with slight lift, border glow, or soft gradient.
- Responsive layout: single column or two columns on small screens.
- Friend-link application guide dialog.

Friend-link guide dialog:

- Shows this site's own friend-link information.
- Provides copy buttons for site name, description, URL, and avatar URL.
- Explains the application flow:
  1. Add MikanArchive to the applicant's friend-link page.
  2. Send site information by email or another configured contact method.
  3. Wait for manual review.
- Shows a template with site name, site description, site URL, and avatar URL.
- Lists requirements: HTTPS support, healthy content, no illegal or harmful content, and removal policy for long-term inaccessible sites.

Version 1 should use manual review plus JSON configuration. Later versions can add GitHub Issue applications, email forms, availability checks, and favicon or Open Graph image fetching.

### Footprints

Route: `/records`

Required features:

- Calendar widget.
- Writing heatmap.
- Timeline.
- Recent updates.
- Post, tag, resource, and friend-link counts.

### About

Route: `/about`

Required features:

- Personal introduction.
- Skill stack.
- Project links.
- Resume link area.
- Contact methods.
- External accounts such as GitHub, Bilibili, email, or other configured links.
- Light visual personality without reducing professional readability.

## Content Repository Structure

The private content repository should use this structure:

```text
content/
  posts/
    2026-06-26-example-tutorial.md
  resources/
    resources.json
  links/
    friends.json
    sites.json
  profile/
    about.md
    resume.json
  records/
    timeline.json
    updates.json
  assets/
    images/
    backgrounds/
    avatars/
    files/
```

The public framework repository should include matching example content under:

```text
content.example/
```

## Post Format

Posts should use frontmatter like this:

```md
---
title: "Windows 下某个问题的解决记录"
description: "记录一次搜索资料并解决问题的过程"
published: "2026-06-26"
updated: "2026-06-26"
category: "教程"
tags: ["Windows", "工具", "问题解决"]
cover: "/assets/images/example-cover.png"
draft: false
---

正文内容写在这里。
```

Required frontmatter fields:

- `title`
- `description`
- `published`
- `category`
- `tags`
- `draft`

Optional frontmatter fields:

- `updated`
- `cover`
- `type`
- `featured`
- `series`

## Resource Data Format

Resources should be stored in JSON:

```json
[
  {
    "title": "某个教程",
    "url": "https://example.com",
    "category": "教程",
    "tags": ["Astro", "博客"],
    "note": "解决了 Astro 内容同步的问题",
    "featured": true
  }
]
```

Required fields:

- `title`
- `url`
- `category`
- `tags`
- `note`

Optional fields:

- `featured`
- `cover`
- `source`
- `addedAt`

## Friend-Link Data Format

Friend links should be stored in JSON:

```json
[
  {
    "name": "夏夜流萤",
    "url": "https://blog.cuteleaf.cn",
    "avatar": "/assets/avatars/cuteleaf.png",
    "description": "飞萤之火自无梦的长夜亮起。",
    "category": "Blog",
    "tags": ["Astro", "博客", "二次元"],
    "featured": true
  }
]
```

Required fields:

- `name`
- `url`
- `avatar`
- `description`
- `category`
- `tags`

Optional fields:

- `featured`
- `status`
- `lastCheckedAt`
- `addedAt`

Avatar sources can be:

- The friend's own avatar URL.
- GitHub avatar.
- QQ avatar URL.
- Gravatar.
- A locally stored image under `assets/avatars/`.

## Visual Direction

The visual direction is:

```text
light anime archive + knowledge library + readable tutorial blog
```

Tone:

- Gentle.
- Personal.
- Slightly dreamy.
- Clean enough for technical reading.
- Professional enough for a resume link.

Color direction:

- Primary: soft pink, sakura, berry tones.
- Secondary: light blue, warm yellow, mint green.
- Neutrals: near-white, pale gray, ink-like dark text.
- Dark mode: deep gray/black with low-saturation neon accents.

Visual elements:

- Configurable background image.
- Configurable home banner.
- Glass-like navigation.
- Small badges and status dots.
- Avatar cards.
- Resource cards.
- Calendar and heatmap widgets.
- Post cover images.

Interactions:

- Page fade-in.
- Card hover lift.
- Tag hover state.
- Soft animated background or subtle parallax.
- Search dialog.
- Friend-link application dialog.
- Back-to-top button.
- Reading progress bar.

Design constraints:

- Do not let decorative animation hurt readability.
- Do not make the whole UI only pink.
- Do not overcrowd the top navigation.
- Do not make the home page feel like a generic personal homepage.
- Keep post pages calmer than the home and collection pages.

## Required Project Files

The public framework repository should include:

```text
README.md
CHANGELOG.md
.env.example
content.example/
docs/
scripts/
```

README should explain:

- What MikanArchive is.
- Local development.
- Public framework/private content split.
- Deployment setup.
- Configuration.
- How to write posts.

`.env.example` should include:

```text
ENABLE_CONTENT_SYNC=false
CONTENT_REPO_URL=
CONTENT_BRANCH=main
```

Version 1 scripts should cover:

- Syncing content repository.
- Validating content shape.

Statistics can be generated during the Astro build from loaded content collections and JSON data. A separate statistics script can be added later if build-time generation becomes messy.

## Changelog Rules

The changelog should record code, design, content, documentation, and release-maintenance changes.

Recommended format:

```md
## [version] - YYYY-MM-DD

### Added
- New features, pages, components.

### Changed
- Experience, style, architecture, or behavior changes.

### Fixed
- Bug fixes.

### Content
- Posts, resources, friend links, profile, or asset updates.

### Docs
- Documentation changes.

### Release
- Deployment, versioning, and release-maintenance notes.
```

This structure keeps ordinary development work and publishing/maintenance work visible in the same history.

## Future Extensions

Possible later features:

- Comment system.
- Enhanced full-text search.
- Music player.
- Album page.
- Anime tracking page.
- Project portfolio page.
- GitHub Issue friend-link application.
- Friend-link availability checker.
- CMS integration.
- Image hosting/CDN support.
- Optional admin dashboard.

These should remain out of version 1 unless the user explicitly changes scope.

## Naming

Project display name:

```text
MikanArchive
```

Public repository:

```text
mikan-archive
```

Private content repository:

```text
mikan-archive-content
```

Local folder names are environment-specific. Project documents and examples should use repository-relative paths instead of developer-machine absolute paths.

## References Considered

- shadcn/ui for clean, component-oriented interface styling.
- Astro blog themes such as Mizuki and Firefly for static blog feature ideas, content organization, background customization, and rich personal-blog widgets.
- fqzlr.com for navigation grouping and friend-link card/application patterns.

The implementation should borrow structural ideas only. MikanArchive should keep its own visual identity and content model.
