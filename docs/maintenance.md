# 维护说明

本文档记录 MikanArchive 的日常维护规则。项目定位、协作边界和更完整的流程以 `AGENTS.md` 与项目专属 Skill 为准。

## 每次修改前

开始修改代码、文档、配置或规则前，先阅读：

- `AGENTS.md`
- `.agents/skills/mikan-archive-project/SKILL.md`
- `.agents/skills/mikan-archive-maintenance/SKILL.md`

如果本次任务只允许修改特定文件，以用户给出的写入范围为最高优先级；不要顺手修改范围外文件。

## 开发记录

通常每次生成或修改代码、文档、配置、规则或项目专属 Skill，都必须同步更新 `development-log.md`。

日常记录标题使用日期时间，不写版本号：

```markdown
## YYYY-MM-DD HH:mm:ss +08:00
```

记录内容应包括：

- 修改范围。
- 涉及文件。
- 具体内容。
- 验证情况。
- 未运行验证时的原因。

如果用户明确禁止修改 `development-log.md`，按用户要求执行，并在最终报告中说明该限制。

## CHANGELOG 何时更新

`CHANGELOG.md` 是面向开源用户和未来自己的概要记录，不代替 `development-log.md`。

需要同步更新 `CHANGELOG.md` 的常见情况：

- 新增或删除页面、组件、脚本、内容模型。
- 修改入口命令、环境变量、部署流程或目录结构。
- 影响开源使用者理解 README、示例内容或部署方式。
- 修复会影响使用体验的问题。
- 创建版本 tag、正式发布站点版本或编写 Release 说明。

日常很小的内部文档或实现调整，可以只记录到 `development-log.md`，但需要在收尾时确认不会让 README、部署说明或维护说明过期。

## 提交、push 与 Release

普通提交和 push 不等于 Release。

普通更新流程：

1. 修改文件。
2. 更新 `development-log.md`。
3. 按影响面检查 README、文档、示例内容、配置和项目专属 Skill。
4. 运行匹配风险的验证。
5. 检查 `git status --short` 和关键 diff。
6. 用户要求时再提交并 push。

只有用户明确要求以下事项时，才创建版本 tag 或 GitHub Release：

- 创建版本。
- 创建 tag。
- 正式发布版本。
- 生成 Release。
- 编写发布说明并发布。

如果用户只说“更新一下”“提交一下”“推到 GitHub”，按普通提交/push 理解，不自动创建 Release。若“更新版本”的意图不清楚，需要先确认。

## 保护私有内容

公开框架仓库不能写入：

- 真实私有文章。
- 私有图片、头像原图、背景图和文件资料。
- token、cookie、账号密码、部署密钥。
- 带凭据的私有仓库 URL。
- 未公开的简历、联系方式或个人资料。

可以写入公开仓库的是：

- 主题代码。
- 页面布局。
- 组件。
- 样式系统。
- 示例内容。
- 配置模板。
- README、CHANGELOG、文档和脚本。

`content.example/` 只能放示例数据。示例内容要明确是示例，不能伪装成真实内容。

## 安全检查

提交或交付前检查：

- 文档是否出现本机绝对路径。
- 文档是否出现 token、cookie、密码、密钥或带凭据 URL。
- 示例内容是否可能被误解为真实私有内容。
- 环境变量说明是否只描述变量用途，不包含真实值。
- 构建日志、错误信息或截图中是否泄露私有仓库地址和凭据。

可用 `rg` 辅助检查敏感词，但人工判断仍然必要：

```bash
rg "token|cookie|password|secret|key|CONTENT_REPO_URL" README.md docs .env.example
```

同时人工检查文档中是否出现 Windows 盘符或其他本机绝对路径。

## 验证清单

根据改动范围选择验证命令：

```bash
npm run sync:content
npm run validate:content
npm run check
npm run build
```

文档类改动至少检查关键术语和相对路径：

```bash
rg "MikanArchive|Cloudflare Pages|content.example|ENABLE_CONTENT_SYNC|development-log|Release" README.md docs
```

如果验证命令失败，需要说明失败原因、已确认的范围，以及是否属于当前任务写入范围之外的问题。

`npm run check` 当前会先执行内容同步再运行 Astro 检查；`npm run build` 会自动执行内容同步、内容校验、Astro 构建和 Pagefind 索引生成。需要分段排查时，再单独运行 `sync:content` 或 `validate:content`。

## 文档同步检查

修改以下内容时，需要同步检查相关文档：

- 项目定位、导航、页面范围。
- 内容结构、frontmatter、JSON 数据模型。
- 脚本命令、环境变量、目录结构。
- Cloudflare Pages、Vercel 或其他部署流程。
- 维护流程、开发记录规则、CHANGELOG 规则。
- `AGENTS.md` 或 `.agents/skills/*/SKILL.md` 中的项目规则。

检查方向：

- README 是否仍能指导新协作者运行项目。
- `docs/deployment-cloudflare-pages.md` 是否仍匹配实际构建命令和变量。
- `docs/maintenance.md` 是否仍匹配维护 Skill 和 `AGENTS.md`。
- `.env.example` 是否包含文档提到的变量。
- `content.example/` 是否能支撑没有私有内容时的示例构建。

如果发现文档和实际实现不一致，但当前任务禁止修改对应文件，需要在最终报告中标明风险，不要擅自越权修改。
