# MikanArchive 下一步任务

这个文档用于跨会话交接“接下来要做什么”。它和 `development-log.md` 不同：`development-log.md` 记录已经完成的事实；本文件只记录待执行、执行中或刚完成但还未收尾确认的步骤。

使用规则：

- 每次开始修改代码、文档、配置或规则前，先读取本文件。
- 每次新增目标、拆分步骤或发现阻塞点时，及时更新本文件。
- 已完成并验证的步骤可以删除，或临时标记为 `~~已完成~~`，等同一目标全部完成后再清理。
- 所有当前目标完成、验证、记录、提交和 push 后，清空本文件正文，只保留本段使用规则。
- 不把私有内容、密钥、本机 token、cookie 或真实私人资料写入本文件。

## 当前目标：非主页单列布局与工具导航重做

### 已确认设计

- 首页保留现有 Firefly 横幅和双侧栏。
- 所有非主页移除大幅标题横幅与人物、公告、统计、日历等通用侧栏。
- 文章详情保留独立悬浮目录，移动端自动收起。
- 工具导航按照 fqzlr/my-blog 开源 `collections.astro` 与 `collections.css` 的结构重做，并使用 MikanArchive 配色与背景。
- 本项目视觉任务默认启用浏览器视觉对比，不再重复询问。

### 当前状态

- 正式设计规格已写入 `docs/superpowers/specs/2026-06-27-mikan-archive-focused-content-layout-design.md`。
- 用户已确认正式规格，并要求开始实施。
- 详细实施计划已写入 `docs/superpowers/plans/2026-06-27-mikan-archive-focused-content-layout.md`。
- 已完成非主页布局、全部页面迁移、工具图标模型、工具导航重做、收藏标题区压缩和桌面/移动端视觉对比。
- 当前剩余：完整构建与路由检查、最终 diff 审阅、开发日志收尾、提交并 push 当前分支。

### 实施顺序

1. 运行同步、内容校验、两组测试、Astro 检查和完整构建。
2. 检查关键路由返回 200、浏览器控制台与最终 diff。
3. 完成 `development-log.md` 验证记录。
4. 提交并 push 当前 `codex/firefly-rebuild` 分支；未经明确要求不合并 `main`。
