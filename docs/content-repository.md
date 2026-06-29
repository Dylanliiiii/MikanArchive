# 内容仓库说明

MikanArchive 使用公开框架仓库和私有内容仓库分离的方式维护内容。公开仓库保存主题代码、页面、组件、样式、脚本、示例内容和文档；私有内容仓库保存真实文章、图片、资源收藏、友链、个人资料、简历配置和时间线记录。

没有私有内容仓库时，项目会从 `content.example/` 同步示例内容，保证公开仓库可以独立运行和演示。示例内容只能用于说明字段结构，不能冒充真实内容。

## 推荐目录结构

私有内容仓库和 `content.example/` 建议保持一致：

```text
content.example/
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

如果私有内容仓库额外包了一层 `content/` 目录，可以把 `CONTENT_LOCAL_PATH` 指向仓库根目录或 `content/` 目录；同步脚本会自动识别可用的内容根目录。

## 同步目标

`npm run sync:content` 会清理并重新生成以下目录：

```text
src/content/posts/
src/content/profile/
src/content/spec/
src/data/content/
public/assets/
```

映射关系：

```text
posts/               -> src/content/posts/
profile/             -> src/content/profile/
profile/about.md     -> src/content/spec/about.md
resources/           -> src/data/content/resources/
links/               -> src/data/content/links/
records/             -> src/data/content/records/
profile/resume.json  -> src/data/content/profile/resume.json
assets/              -> public/assets/
```

这些生成目录已被 `.gitignore` 忽略，避免把真实私有内容提交到公开框架仓库。

## 本地开发

使用示例内容：

```bash
npm run sync:content
npm run validate:content
npm run dev
```

使用本地私有内容目录：

```bash
ENABLE_CONTENT_SYNC=true CONTENT_LOCAL_PATH=../mikan-archive-content npm run sync:content
npm run validate:content
npm run dev
```

Windows PowerShell 可使用：

```powershell
$env:ENABLE_CONTENT_SYNC="true"
$env:CONTENT_LOCAL_PATH="../mikan-archive-content"
npm run sync:content
```

## 部署同步

部署平台可以通过环境变量启用私有内容同步：

```text
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=<private repository url>
CONTENT_BRANCH=main
CONTENT_LOCAL_PATH=
```

当 `ENABLE_CONTENT_SYNC=false` 时，脚本只读取 `content.example/`。当 `ENABLE_CONTENT_SYNC=true` 且设置了 `CONTENT_LOCAL_PATH` 时，脚本优先使用本地路径；否则使用 `CONTENT_REPO_URL` 和 `CONTENT_BRANCH` 克隆内容仓库到 `.tmp-content-repo/` 后同步。源路径可以是内容根目录，也可以是包含 `content/` 子目录的仓库根目录。

不要把私有仓库 token、cookie、账号密码或部署密钥写入 `.env.example`、README、文档或日志。部署平台需要认证时，应使用平台的 Secret 或环境变量能力。

## 文章 Frontmatter

文章支持 Markdown 和 MDX，放在 `posts/` 下：

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

必填字段：

- `title`：文章标题。
- `description`：文章摘要。
- `published`：发布日期，建议使用 `YYYY-MM-DD`。
- `tags`：分类标签数组，例如 `教程`、`笔记`、`资料`。文章的标签同时承担分类用途。
- `draft`：是否为草稿，必须是布尔值。

可选字段：

- `updated`：更新日期。
- `category`：兼容旧内容的分类字段。新文章建议主要使用 `tags` 做分类标签。
- `image`：封面图路径。旧内容如果仍使用 `cover`，建议在接入私有内容仓库前迁移为 `image`。
- `type`：文章类型。
- `featured`：是否精选。
- `series`：所属系列。

## 资源收藏

`resources/resources.json` 使用数组：

```json
[
  {
    "title": "Astro 文档",
    "url": "https://docs.astro.build/",
    "kind": "tool",
	"category": "开发文档",
    "tags": ["Astro", "静态站点"],
    "note": "用于查询 Astro 项目结构和内容集合配置。",
	"icon": "simple-icons:astro",
    "featured": true
  },
  {
    "title": "内容集合指南示例",
    "url": "https://docs.astro.build/en/guides/content-collections/",
    "kind": "clip",
    "category": "Astro",
    "tags": ["内容集合", "教程线索"],
    "note": "演示如何保存一篇针对具体问题有帮助的网页。",
    "sourceName": "Astro 官方文档",
    "scenario": "需要确认内容集合配置方式时查阅。",
    "addedAt": "2026-06-27"
  }
]
```

必填字段：`title`、`url`、`kind`、`category`、`tags`、`note`。

`kind` 只允许以下值：

- `tool`：工具导航。用于长期反复打开的网站、平台、文档和效率工具。
- `clip`：摘录收藏。用于某一篇在具体问题或知识点上有帮助的网页。

摘录收藏可额外使用：

- `sourceName`：来源名称，例如官方文档、CSDN、知乎或个人博客。
- `scenario`：适用场景，说明遇到什么问题时值得重新打开。
- `addedAt`：收藏日期，建议使用 `YYYY-MM-DD`。

工具导航页会按 `category` 分组；摘录收藏页会优先展示来源、适用场景、收藏日期和标签。示例内容只用于解释结构，不能冒充真实私人收藏。

工具导航可额外使用：

- `icon`：可选。优先填写项目已安装的 Iconify 名称，例如 `simple-icons:astro`、`simple-icons:openai` 或 `material-symbols:speed-rounded`；也可以填写 `https://` 开头的公开图标 URL。配置的 Iconify 名称必须真实存在于已安装图标集，缺失时页面会回退到通用收藏图标。

公开仓库的工具数据只用于演示分类、数量和卡片布局，不应写入真实私人收藏或账号资料。

## 友链与站点收藏

`links/friends.json` 用于友链：

```json
[
  {
    "name": "示例朋友",
    "url": "https://example.com",
    "avatar": "/assets/avatars/example.png",
    "description": "一个用于演示字段结构的示例站点。",
    "category": "Blog",
    "tags": ["博客", "技术"],
    "featured": false
  }
]
```

必填字段：`name`、`url`、`avatar`、`description`、`category`、`tags`。

`links/sites.json` 用于普通站点收藏，必填字段为 `name`、`url`、`description`、`category`、`tags`。

## 足迹记录

`records/timeline.json` 用于较长周期的重要节点：

```json
[
  {
    "title": "开始整理 MikanArchive",
    "date": "2026-06-26",
    "description": "确定公开框架仓库与私有内容仓库分离。"
  }
]
```

`records/updates.json` 用于最近更新：

```json
[
  {
    "title": "新增内容同步脚本",
    "date": "2026-06-26",
    "type": "dev"
  }
]
```

## 个人资料

`profile/about.md` 保存“我的”页面中的长文本介绍。

`profile/resume.json` 保存结构化简历信息，基础字段示例：

```json
{
  "name": "示例昵称",
  "headline": "个人知识收藏博客作者",
  "summary": "这里是示例介绍，不代表真实个人资料。",
  "skills": ["Astro", "TypeScript", "Markdown"],
  "contacts": [
    {
      "label": "示例邮箱",
      "value": "hello@example.com"
    }
  ]
}
```

必填字段：`name`、`headline`、`skills`、`contacts`。`contacts` 中每一项需要包含 `label` 和 `value`。

常用可选字段：`title`、`location`、`bio`、`summary`、`links`、`projects`。

## 校验

运行：

```bash
npm run validate:content
```

校验脚本会检查生成后的 `src/content/` 和 `src/data/content/`。如果尚未运行同步，或 `content.example/` 尚未创建，校验会失败并提示缺失目录或文件。`npm run build` 会自动先运行同步和校验；日常单独检查时可先运行 `npm run sync:content`，再运行 `npm run validate:content`。
