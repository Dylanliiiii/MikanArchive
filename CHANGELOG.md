# Changelog

## Unreleased

### Added

- 新增 GitHub Pages Actions 工作流，支持通过 Astro 构建并部署 `dist/`。
- 初始化 Astro + MDX + React + Tailwind CSS 的静态站点框架。
- 新增首页、文库、文章详情、收藏、友邻、足迹和我的页面。
- 新增搜索弹窗、友链申请弹窗、日历、写作热力图、文章卡片、资源卡片和友链卡片。
- 新增 `content.example/` 示例内容和 SVG 示例资产，支持公开仓库独立运行。
- 新增内容同步脚本和内容校验脚本，支持公开示例内容、本地私有内容目录和远程私有内容仓库。
- 初始化 MikanArchive 项目设计文档、协作规则、项目专属 Skill、开发日志和更新日志。
- 确定第一版采用公开框架仓库与私有内容仓库分离的维护方式。
- 确定第一版导航为 `主页 / 文库 / 收藏 / 友邻 / 足迹 / 我的`。

### Changed

- 为站内链接和公开资产路径增加 base path 处理，兼容 GitHub Pages `/MikanArchive/` 子路径部署。
- 升级到 Astro 7 依赖栈，改用 `src/content.config.ts` + Content Layer `glob()` loader。
- 移除已弃用的 `@astrojs/tailwind` 集成，改为 Tailwind CSS v3 + PostCSS + Autoprefixer。
- 明确 Node.js 最低要求为 `>=22.12.0`，并新增 `.node-version` 记录推荐版本。
- 将公开文档中的本机绝对路径示例改为相对路径或泛化描述。
- 将内容同步目标统一为文章/profile Markdown 同步到 `src/content/`，JSON 数据同步到 `src/data/content/`，公开资源同步到 `public/assets/`。

### Fixed

- 修复 GitHub Pages 默认 Jekyll 构建 Astro 源码导致的部署失败问题。
- 通过升级 Astro 依赖链清理 `npm audit --omit=dev` 报告中的安全公告。

### Docs

- 新增 `README.md`，说明项目定位、本地开发、内容仓库分离、验证命令和部署概要。
- 新增 `docs/content-repository.md`，记录内容仓库结构、字段格式和同步映射。
- 新增 `docs/deployment-cloudflare-pages.md`，记录 Cloudflare Pages 构建命令、输出目录和环境变量。
- 新增 `docs/maintenance.md`，记录日常维护、日志、CHANGELOG、验证和发布边界。
- 新增 `AGENTS.md`，记录项目协作、文档同步、日志和提交规则。
- 新增 `docs/superpowers/specs/2026-06-26-mikan-archive-design.md`，记录已确认的产品和架构设计。

### Deploy

- 配置 Cloudflare Pages 推荐构建流程：`npm run sync:content && npm run build`，输出目录为 `dist`。
