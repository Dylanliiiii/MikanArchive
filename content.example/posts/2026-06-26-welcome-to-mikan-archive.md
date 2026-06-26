---
title: "欢迎来到 MikanArchive"
description: "一篇公开示例文章，用于展示教程、收藏和个人记录如何组织。"
published: "2026-06-26"
updated: "2026-06-26"
category: "教程"
tags: ["Astro", "博客", "示例"]
cover: "/assets/images/welcome-cover.svg"
draft: false
type: "tutorial"
featured: true
---

这里是 MikanArchive 的公开示例文章。它只用于演示内容结构、页面排版和数据模型，不代表任何真实个人经历或私有笔记。

## 可以写什么

MikanArchive 更像一间个人知识收藏馆，而不是普通个人主页。你可以把下面这些内容整理成 Markdown 或 MDX：

- 学习某个技术时留下的教程笔记。
- 排查问题时保留下来的步骤和参考链接。
- 值得长期收藏的工具、文档和文章。
- 写作、项目和站点维护过程中的时间线。

## 示例文章结构

一篇教程文章通常包含背景、操作步骤、注意事项和参考资料。文章页会优先保证阅读体验，所以示例内容保持简洁，不使用会干扰阅读的大段装饰。

```ts
const archive = {
  name: "MikanArchive",
  purpose: "整理教程、收藏资源和记录足迹"
};
```

## 内容分离提醒

公开仓库只应该保存安全示例内容。真实文章、图片、头像、资源列表和个人资料应放在私有内容仓库中，再通过同步脚本复制到构建目录。
