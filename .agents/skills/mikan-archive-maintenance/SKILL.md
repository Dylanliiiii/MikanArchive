---
name: mikan-archive-maintenance
description: 仅用于 MikanArchive 项目的维护、日志、提交、push、部署和版本判断。用于普通代码/文档更新后的 development-log 与 CHANGELOG 检查、README/AGENTS/项目专属 Skill 同步、GitHub 提交推送、Cloudflare Pages 部署说明、版本 tag 或 Release 意图判断。
---

# MikanArchive 维护技能

## 核心原则

- 只服务当前 MikanArchive 仓库，不作为全局通用发布流程。
- 普通维护开始前读取 `docs/next-tasks.md`，确认是否有未完成目标、阻塞点或下一步动作。
- 暂停任务、跨会话交接、发现阻塞或完成某个待办步骤时，更新 `docs/next-tasks.md`；目标全部完成、验证、记录、提交和 push 后，清空对应任务内容，只保留文档使用规则。
- 每次修改代码、文档、配置、规则或项目专属 Skill 后，必须同步更新 `development-log.md`。
- 普通更新完成并验证后，可以提交并 push 到 GitHub；不自动创建 Release。
- MikanArchive 是静态网站项目，不需要桌面安装包、不需要 LaunchDock 那种双平台安装包 Release 流程。
- 只有用户明确要求创建版本、tag、Release、发布说明或正式站点版本时，才执行版本发布流程。
- 如果用户只说“更新一下”“更新 GitHub”“提交一下”等，按普通更新处理；如果“更新版本”含义不清，先询问是普通 push 还是创建版本 tag/Release。
- 不把 token、cookie、账号密码、私有内容仓库凭据、真实私有文章或部署密钥写入仓库、日志、README、CHANGELOG 或发布说明。

## 普通更新流程

1. 读取 `AGENTS.md` 和相关项目专属 Skill。
2. 读取 `docs/next-tasks.md`，明确本次继续的目标和下一步动作。
3. 修改代码、文档、配置或规则。
4. 同步更新 `docs/next-tasks.md`，记录完成步骤、剩余步骤或阻塞点。
5. 同步更新 `development-log.md`，日常条目标题使用普通日期时间，不写版本号。
6. 如果代码结构、入口命令、内容模型、页面范围、模块职责、环境变量、同步脚本、部署流程或功能行为变化，检查并同步更新：
   - README。
   - `AGENTS.md`。
   - `.agents/skills/*/SKILL.md`。
   - `docs/` 下相关设计或计划。
   - `.env.example`。
   - `content.example/`。
   - 部署说明和脚本说明。
7. 运行与改动风险匹配的验证。
8. 检查 `git status --short` 和关键 diff。
9. `git add`、`git commit`、`git push origin main`。

普通更新不创建 tag，不创建 GitHub Release，不更改版本号。

## Development Log 规则

`development-log.md` 顶部追加最新记录。

日常格式：

```markdown
## YYYY-MM-DD HH:mm:ss +08:00

### 修改范围

- ...

### 涉及文件

- `path`

### 具体内容

- ...

### 验证情况

- ...
```

只有明确创建版本 tag 或正式发布站点版本时，才使用：

```markdown
## Version x.x.x - YYYY-MM-DD HH:mm:ss +08:00
```

## CHANGELOG 规则

`CHANGELOG.md` 用于面向开源用户和未来自己的概要记录，不代替 `development-log.md`。

推荐分类：

- `Added`：新增页面、组件、功能。
- `Changed`：体验、样式、架构或行为调整。
- `Fixed`：问题修复。
- `Content`：示例文章、资源、友链、个人资料或公开资产更新。
- `Docs`：文档更新。
- `Deploy`：部署、环境变量、构建脚本或站点发布相关事项。

日常小改可以只更新 `development-log.md`；当变更会影响用户理解、部署、开源使用或版本发布时，同步更新 `CHANGELOG.md`。

## 版本与部署判断

- Cloudflare Pages 是第一版主部署路径。
- Vercel 只作为兼容备选说明。
- 普通 push 后由部署平台自动构建，不等同于 GitHub Release。
- 创建版本 tag 或 Release 前，必须确认版本号和发布范围。
- 正式版本说明从上一次带 `Version` 的开发记录之后提炼重点，避免内部调试细节。

## 收尾检查

完成普通更新或版本发布前，确认：

- `development-log.md` 已记录本次变更。
- `docs/next-tasks.md` 已记录剩余待办、阻塞点或已清理完成目标。
- README、`AGENTS.md`、项目专属 Skill、设计/计划文档、`.env.example`、示例内容和部署说明没有因本次修改过期。
- 没有把私有内容、密钥或本机绝对路径写入开源文件。
- 已运行必要验证；未运行的验证已说明原因。
- `git status --short` 的剩余变更已解释清楚。
