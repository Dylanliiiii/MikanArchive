# Changelog

## Unreleased

### Added

- 新增工具导航与摘录收藏独立页面，分别承载长期站点入口和面向具体问题的网页线索。
- 新增收藏与归档数据 helper 测试、收藏页面路由契约测试。
- 引入 Firefly 风格主题骨架，新增壁纸横幅、玻璃导航、左右侧栏、文章列表、文章详情、友邻墙、搜索和显示设置等主题能力。
- 新增 `LICENSE`，保留 MikanArchive、Firefly 与 fuwari 的 MIT 版权声明。
- 新增 Firefly 重构设计规格，确定下一阶段以 CuteLeaf/Firefly 为底座或强参考重建博客壳层和页面体验。
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

- 收藏主入口改为总览页，下拉菜单新增收藏总览、工具导航和摘录收藏。
- 资源内容模型新增必填 `kind` 字段，并支持摘录来源、适用场景和收藏日期。
- 足迹时间线改为年份、月份、记录三层分支归档，分支在 hover 或键盘聚焦时高亮。
- 将站点 `src/` 主题层整体改造为 Firefly 风格结构，并保留 MikanArchive 的内容同步和公开/私有内容分离边界。
- `npm run build` 现在会自动执行内容同步、内容校验、Astro 构建和 Pagefind 索引生成。
- 文章示例封面字段改为 Firefly 使用的 `image`。
- 为避免无可用修复的 `@swup/astro` high audit 链，当前暂不启用 Swup 无刷新页面过渡。
- 当前视觉方向调整为接近 Firefly / fqzlr.com 的公开博客体验，同时保留 MikanArchive 的内容分离和知识收藏定位。
- 为站内链接和公开资产路径增加 base path 处理，兼容 GitHub Pages `/MikanArchive/` 子路径部署。
- 升级到 Astro 7 依赖栈，改用 `src/content.config.ts` + Content Layer `glob()` loader。
- 移除已弃用的 `@astrojs/tailwind` 集成，改为 Tailwind CSS v3 + PostCSS + Autoprefixer。
- 明确 Node.js 最低要求为 `>=22.12.0`，并新增 `.node-version` 记录推荐版本。
- 将公开文档中的本机绝对路径示例改为相对路径或泛化描述。
- 将内容同步目标统一为文章/profile Markdown 同步到 `src/content/`，JSON 数据同步到 `src/data/content/`，公开资源同步到 `public/assets/`。

### Fixed

- 修复 Firefly 组件迁移到 Astro 7 后的模板编译问题，并移除未启用可选页面中的编译阻塞点。
- 修复 GitHub Pages 默认 Jekyll 构建 Astro 源码导致的部署失败问题。
- 通过升级 Astro 依赖链清理 `npm audit --omit=dev` 报告中的安全公告。

### Docs

- 更新 README、AGENTS 和项目专属 Skill，说明 Firefly 重构方向、版权致谢要求和 fqzlr.com 参考边界。
- 新增 `README.md`，说明项目定位、本地开发、内容仓库分离、验证命令和部署概要。
- 新增 `docs/content-repository.md`，记录内容仓库结构、字段格式和同步映射。
- 新增 `docs/deployment-cloudflare-pages.md`，记录 Cloudflare Pages 构建命令、输出目录和环境变量。
- 新增 `docs/maintenance.md`，记录日常维护、日志、CHANGELOG、验证和发布边界。
- 新增 `AGENTS.md`，记录项目协作、文档同步、日志和提交规则。
- 新增 `docs/superpowers/specs/2026-06-26-mikan-archive-design.md`，记录已确认的产品和架构设计。

### Deploy

- 配置 Cloudflare Pages 推荐构建流程：`npm run build`，输出目录为 `dist`。
