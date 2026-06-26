# MikanArchive

MikanArchive 是一个个人知识收藏博客，不是普通个人主页。它用于整理教程、笔记、资源收藏、友链、个人资料和写作足迹，整体气质是轻二次元收藏馆 + 可读教程博客 + 可展示给简历访客的专业感。

项目采用公开框架仓库与私有内容仓库分离的方式：公开仓库保存主题代码、组件、样式、文档、脚本和示例内容；私有内容仓库保存真实文章、图片、头像、背景、友链、收藏数据、个人资料和时间线。

## 特点

- Astro 静态站点，适合部署到 Cloudflare Pages、Vercel 等平台。
- Markdown/MDX 写文章，便于长期维护教程和笔记。
- Tailwind CSS v3 + PostCSS + shadcn 风格组件，兼顾轻视觉个性和技术阅读体验。
- 第一版导航固定为：主页 / 文库 / 收藏 / 友邻 / 足迹 / 我的。
- 支持 `content.example/` 示例内容兜底，没有私有内容仓库也可以本地构建示例站点。
- 通过内容同步脚本接入私有内容仓库，避免把真实内容和私密资料提交到公开仓库。

## 技术栈

- Astro
- Markdown / MDX
- Tailwind CSS
- shadcn 风格组件
- React islands
- TypeScript
- Zod

当前 Astro 版本要求 Node.js `>=22.12.0`，推荐使用 `.node-version` 中记录的 Node `22.16.0` 或更新版本。

## 导航与页面

第一版包含以下页面方向：

- 主页：最近文章、精选收藏、足迹小组件、友邻预览、简介卡片、可配置背景。
- 文库：文章/教程列表、分类、标签、搜索、归档、草稿过滤。
- 文章详情：MDX 正文、代码高亮、目录、阅读进度、上一篇/下一篇。
- 收藏：资源卡片、分类筛选、标签筛选、收藏理由。
- 友邻：友链名片墙、分类筛选、申请指南弹窗、复制本站信息。
- 足迹：日历、写作热力图、时间线、最近更新、统计。
- 我的：个人介绍、技能栈、项目入口、简历链接、联系方式。

第一版不包含后台登录、网站内一键上传、数据库、用户注册、复杂 CMS 或自动友链审核。

## 本地开发

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
category: "教程"
tags: ["Windows", "工具", "问题解决"]
cover: "/assets/images/example-cover.png"
draft: false
---

正文内容写在这里。
```

建议必填字段：

- `title`
- `description`
- `published`
- `category`
- `tags`
- `draft`

常用可选字段：

- `updated`
- `cover`
- `type`
- `featured`
- `series`

示例内容只能作为结构参考，不能冒充真实内容。

## 验证命令

常用检查：

```bash
npm run sync:content
npm run validate:content
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
- Build command：`npm run sync:content && npm run build`
- Output directory：`dist`
- Node.js：建议设置 `NODE_VERSION=22.16.0` 或使用更新的 Node 22/24 版本。

私有内容仓库访问方式、环境变量配置和故障排查见 `docs/deployment-cloudflare-pages.md`。

Vercel 可作为兼容备选，核心思路相同：先同步内容，再执行 Astro 构建，输出静态站点。

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
