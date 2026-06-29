# MikanArchive

MikanArchive 是一个个人知识收藏博客，不是普通个人主页。它用于整理教程、笔记、资源收藏、友链、联系入口、个人资料和写作足迹，整体气质是 Firefly 风格博客壳层 + 轻二次元收藏馆 + 可读教程博客 + 可展示给简历访客的专业感。

项目采用公开框架仓库与私有内容仓库分离的方式：公开仓库保存主题代码、组件、样式、文档、脚本和示例内容；私有内容仓库保存真实文章、图片、头像、背景、友链、收藏数据、个人资料和时间线。

## 特点

- Astro 静态站点，适合部署到 Cloudflare Pages、Vercel 等平台。
- Markdown/MDX 写文章，便于长期维护教程和笔记。
- 当前重构方向以 CuteLeaf/Firefly 为底座或强参考，重建壁纸、玻璃导航、侧栏、文章列表、文章页、联系我入口和友链墙体验。
- 第一版导航固定为：主页 / 文库 / 收藏 / 联系我 / 足迹 / 我的；收藏、联系我等分组入口不设置空总览页，下拉项直接从主页路径指向实际功能页；联系我下拉包含友链、留言和 QQ 群入口。
- 收藏区分为工具导航与摘录收藏：前者保存长期反复使用的站点入口，后者保存针对具体问题或知识点的网页线索。
- 支持 `content.example/` 示例内容兜底，没有私有内容仓库也可以本地构建示例站点。
- 通过内容同步脚本接入私有内容仓库，避免把真实内容和私密资料提交到公开仓库。
- 如果引入 Firefly 代码或组件设计，将保留 Firefly 与 fuwari 的 MIT 版权声明和致谢。

## 技术栈

- Astro
- Markdown / MDX
- Tailwind CSS
- Firefly 风格主题组件
- Svelte islands（用于主题切换、搜索和少量交互）
- TypeScript
- Zod

当前 Astro 版本要求 Node.js `>=22.12.0`，推荐使用 `.node-version` 中记录的 Node `22.16.0` 或更新版本。

## 当前设计方向

当前正式重构规格见：

```text
docs/superpowers/specs/2026-06-27-mikan-archive-firefly-rebuild-design.md
```

重构目标是接近 fqzlr.com 所呈现的 Firefly 博客体验，同时按页面职责拆分布局：首页保留大幅壁纸、玻璃导航和左右侧栏；文库、收藏、联系我、足迹、我的与文章详情等非主页使用导航栏下方直接开始的聚焦内容布局，不重复展示人物、公告、统计、日历侧栏或导航下方通用分类快捷栏。文章详情在宽屏保留独立目录，移动端使用浮动目录入口。MikanArchive 只复刻公开布局体验和交互结构，不复制该博主的真实文章、头像、图片、个人资料、私有配置或账号文案。

## 导航与页面

第一版包含以下页面方向：

- 主页：最近文章、精选收藏、足迹小组件、友链预览、简介卡片、可配置背景。
- 文库：文章/教程列表、按分类标签分组、搜索、归档、草稿过滤；文章的标签同时承担分类用途，不再单独区分“分类页”和“标签页”；文章总列表使用无封面长条卡片，整条卡片可点击进入详情。
- 文章详情：MDX 正文、代码高亮、目录、阅读进度、上一篇/下一篇。
- 工具导航：按分类整理长期使用的网站、平台、文档和效率工具，提供分类数量、图标、域名和响应式三/二/一列卡片。
- 摘录收藏：记录网页标题、说明、来源、适用场景、标签和收藏日期。
- 联系我：集中展示友链、留言和 QQ 群入口；友链保留名片墙、搜索筛选和申请说明，公开示例不写入真实联系方式。
- 足迹：日历、写作热力图、时间线、最近更新、统计。
- 我的：个人介绍、技能栈、项目入口、简历链接、联系方式。

第一版不包含后台登录、网站内一键上传、数据库、用户注册、复杂 CMS 或自动友链审核。

## 本地开发

需要 Node.js `>=22.12.0`。本仓库提供 `.node-version`，推荐使用 Node `22.16.0` 或更新的 Node 22/24。

安装依赖：

```bash
npm install
```

同步内容：

```bash
npm run sync:content
```

未启用私有内容同步时，脚本会使用 `content.example/` 作为示例内容来源。

启动开发服务器：

```bash
npm run dev
```

默认本地地址通常是：

```text
http://localhost:4321/
```

构建站点：

```bash
npm run build
```

预览构建结果：

```bash
npm run preview
```

## 内容仓库分离

公开框架仓库应包含：

```text
主题代码
页面布局
组件
样式系统
示例内容
配置模板
README / CHANGELOG / docs / scripts
```

私有内容仓库建议包含：

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

内容同步后会映射到项目内的内容目录，例如文章进入 `src/content/posts/`，资料数据进入 `src/data/content/`，公开资源进入 `public/assets/`。

`resources/resources.json` 中每条资源必须包含 `kind`：`tool` 表示工具导航，`clip` 表示摘录收藏。工具可额外使用 `icon`，值为已安装的 Iconify 图标名或公开图标 URL；缺失时页面使用通用收藏图标。摘录可额外使用 `sourceName`、`scenario` 和 `addedAt`，分别记录来源、适用场景与收藏日期。完整示例见 `docs/content-repository.md`。

## 内容同步变量

复制 `.env.example` 后按需配置：

```env
ENABLE_CONTENT_SYNC=false
CONTENT_REPO_URL=
CONTENT_BRANCH=main
CONTENT_LOCAL_PATH=
```

- `ENABLE_CONTENT_SYNC`：是否启用私有内容同步。`false` 时使用 `content.example/`。
- `CONTENT_REPO_URL`：私有内容仓库地址。不要把 token 或带凭据的地址写入公开文件。
- `CONTENT_BRANCH`：私有内容仓库分支，默认 `main`。
- `CONTENT_LOCAL_PATH`：本地内容仓库相对路径。设置后优先从本地路径同步，适合本地开发。

## 写文章

文章放在内容仓库的 `content/posts/` 中，使用 Markdown 或 MDX。基本 frontmatter 示例：

```md
---
title: "Windows 下某个问题的解决记录"
description: "记录一次搜索资料并解决问题的过程"
published: "2026-06-26"
updated: "2026-06-26"
tags: ["Windows", "工具", "问题解决"]
image: "/assets/images/example-cover.png"
draft: false
---

正文内容写在这里。
```

建议必填字段：

- `title`
- `description`
- `published`
- `tags`
- `draft`

常用可选字段：

- `updated`
- `category`（兼容旧内容，可继续填写；新文章建议主要使用 `tags` 做分类标签）
- `image`
- `type`
- `featured`
- `series`

示例内容只能作为结构参考，不能冒充真实内容。

## 验证命令

常用检查：

```bash
npm run sync:content
npm run validate:content
npm run test:content-model
npm run test:pages
npm run check
npm run build
```

文档检查可使用：

```bash
rg "MikanArchive|Cloudflare Pages|content.example|ENABLE_CONTENT_SYNC|development-log" README.md docs
```

## Cloudflare Pages 部署概要

第一版优先使用 Cloudflare Pages。

推荐配置：

- Framework preset：Astro
- Build command：`npm run build`
- Output directory：`dist`
- Node.js：建议设置 `NODE_VERSION=22.16.0` 或使用更新的 Node 22/24 版本。

私有内容仓库访问方式、环境变量配置和故障排查见 `docs/deployment-cloudflare-pages.md`。

Vercel 可作为兼容备选，核心思路相同：先同步内容，再执行 Astro 构建，输出静态站点。

## GitHub Pages 部署

本仓库同时提供 GitHub Pages 的 Actions 工作流：`.github/workflows/pages.yml`。

GitHub 仓库需要在 Settings → Pages 中把 Build and deployment 的 Source 设置为 `GitHub Actions`。不要使用默认的 `Deploy from a branch`，它会触发 Jekyll 构建并把 `.astro` 文件当作 YAML frontmatter 解析。

当前 GitHub Pages 示例地址：

```text
https://dylanliiiii.github.io/MikanArchive/
```

工作流会执行：

```bash
npm ci
npm run check
npm run build
```

`npm run check` 和 `npm run build` 都会先同步内容，因此 GitHub Actions 的干净环境不需要单独维护内容目录。GitHub Pages 使用仓库子路径 `/MikanArchive/`，工作流已通过 `BASE_PATH=/MikanArchive` 配置 Astro 的 base。

## 快速使用

1. 克隆仓库并进入目录。
2. 运行 `npm install`。
3. 运行 `npm run build`，生成示例内容并完成静态构建。
4. 运行 `npm run dev`，在本地浏览器打开开发服务器。
5. 修改 `content.example/` 查看示例效果，真实内容后续放到私有内容仓库。
6. 提交并推送到 `main` 后，GitHub Actions 或 Cloudflare Pages 会自动构建。

## 目录结构

```text
.
├── .agents/                 # 项目专属协作 Skill
├── content.example/         # 示例内容兜底
├── docs/                    # 设计、部署和维护文档
├── scripts/                 # 内容同步与校验脚本
├── src/                     # Astro 页面、组件、内容集合和数据入口
├── .env.example             # 环境变量模板
├── .node-version            # 推荐 Node.js 版本
├── AGENTS.md                # 项目协作规则
├── CHANGELOG.md             # 面向用户和开源使用者的概要变更记录
├── development-log.md       # 日常开发记录
├── package.json             # 项目脚本和依赖
└── README.md                # 项目说明
```

## 维护规则摘要

- 修改前阅读 `AGENTS.md` 和相关项目专属 Skill。
- 默认使用中文维护项目文档、说明、注释和界面文案。
- 每次修改代码、文档、配置或规则，通常都需要同步更新 `development-log.md`；如当前任务明确禁止修改日志，则在交付报告中说明。
- 影响项目定位、导航、页面范围、内容结构、部署流程、命令、环境变量或维护流程时，同步检查 README、部署文档、维护文档、设计文档、示例内容和项目专属 Skill。
- 普通提交和 push 不等于 Release；只有用户明确要求创建 tag、正式版本或 GitHub Release 时才执行发布流程。
- 不把真实私有内容、token、cookie、账号密码、部署密钥或带凭据的仓库地址写入公开仓库。
