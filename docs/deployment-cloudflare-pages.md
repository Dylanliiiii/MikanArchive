# Cloudflare Pages 部署说明

MikanArchive 第一版优先支持 Cloudflare Pages。部署流程的核心是：先同步内容，再执行 Astro 构建，最后发布 `dist/` 静态目录。

## 前置约定

- 公开框架仓库：保存站点代码、文档、脚本和 `content.example/`。
- 私有内容仓库：保存真实文章、图片、友链、收藏、个人资料和时间线。
- 没有私有内容仓库或未启用同步时，项目使用 `content.example/` 作为兜底内容。
- 不要把 token、cookie、账号密码、部署密钥或带凭据的仓库 URL 写入仓库文件。

## 创建 Cloudflare Pages 项目

1. 在 Cloudflare Dashboard 进入 Workers & Pages。
2. 选择 Create application，再选择 Pages。
3. 连接公开框架仓库。
4. 选择需要部署的分支。
5. 配置构建参数。

推荐构建配置：

```text
Framework preset: Astro
Build command: npm run sync:content && npm run build
Output directory: dist
```

当前 Astro 版本要求 Node.js `>=22.12.0`。项目根目录的 `.node-version` 记录了推荐版本，Cloudflare Pages 也建议在环境变量中显式设置：

```text
NODE_VERSION=22.16.0
```

## 环境变量

Cloudflare Pages 的 Production 和 Preview 环境可按需配置以下变量：

```env
ENABLE_CONTENT_SYNC=false
CONTENT_REPO_URL=
CONTENT_BRANCH=main
CONTENT_LOCAL_PATH=
```

变量说明：

- `ENABLE_CONTENT_SYNC`：是否启用私有内容同步。`false` 时使用 `content.example/`。
- `CONTENT_REPO_URL`：私有内容仓库地址。启用远程同步时必填。
- `CONTENT_BRANCH`：私有内容仓库分支，默认 `main`。
- `CONTENT_LOCAL_PATH`：本地内容仓库相对路径，主要用于本地开发；Cloudflare Pages 通常不需要设置。

示例内容构建：

```env
ENABLE_CONTENT_SYNC=false
CONTENT_REPO_URL=
CONTENT_BRANCH=main
CONTENT_LOCAL_PATH=
```

私有内容构建：

```env
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=<private-content-repository-url>
CONTENT_BRANCH=main
CONTENT_LOCAL_PATH=
```

`CONTENT_REPO_URL` 只描述私有内容仓库位置，不应在文档、README、日志或提交记录中暴露带凭据的地址。

## 私有仓库访问方式

Cloudflare Pages 构建私有内容时，需要让构建环境可以读取私有内容仓库。可选方式包括：

- 使用部署平台支持的仓库授权或集成，让 Cloudflare Pages 具备读取对应仓库的权限。
- 使用只读部署密钥，并通过平台的 Secret/Environment Variables 管理访问凭据。
- 使用机器用户或专用访问令牌，但必须限制权限并存放在平台密钥中。

安全要求：

- 优先使用只读权限。
- 不要在仓库文件中保存 token、账号密码或带凭据的 URL。
- 不要把真实私有文章、图片、简历、头像原图或未公开资料复制进公开仓库。
- 构建日志中如果出现敏感信息，需要立即轮换凭据并清理日志可见范围。

## 没有私有内容时

当 `ENABLE_CONTENT_SYNC=false` 时，`npm run sync:content` 会从 `content.example/` 同步示例内容。这个模式适合：

- 开源仓库展示。
- 新环境首次构建。
- 没有私有内容仓库的协作者本地预览。
- 排查私有仓库访问问题。

示例内容只能展示结构和组件效果，不能冒充真实内容。

## Vercel 兼容提示

Vercel 可作为兼容备选。配置思路与 Cloudflare Pages 一致：

```text
Build Command: npm run sync:content && npm run build
Output Directory: dist
```

同样需要在 Vercel 的环境变量或 Secret 中配置 `ENABLE_CONTENT_SYNC`、`CONTENT_REPO_URL`、`CONTENT_BRANCH`。私有仓库访问凭据必须放在平台密钥中，不写入公开仓库。

## 故障排查

### 构建提示找不到内容文件

先确认构建命令包含同步步骤：

```bash
npm run sync:content && npm run build
```

如果未启用私有同步，检查 `content.example/` 是否存在并包含支持的目录结构。

### 启用私有同步后 clone 失败

检查：

- `ENABLE_CONTENT_SYNC` 是否为 `true`。
- `CONTENT_REPO_URL` 是否为空。
- `CONTENT_BRANCH` 是否存在。
- Cloudflare Pages 是否具备读取私有仓库的权限。
- 私有仓库访问凭据是否过期或权限过大。

不要把带凭据的完整 URL 复制到 issue、日志、README 或聊天记录中。

### 本地同步了私有内容，但部署仍使用示例内容

检查 Cloudflare Pages 的环境变量是否只配置在 Preview 或 Production 的其中一个环境。Production 和 Preview 需要按环境分别设置。

### 构建命令里重复同步内容

当前 `npm run build` 会先运行内容校验再执行 Astro 构建。Cloudflare Pages 仍建议使用：

```bash
npm run sync:content && npm run build
```

这样可以保证部署环境先生成内容目录，再进入校验和构建阶段。

### Node 版本不兼容

如果出现依赖安装、Astro 构建或 TypeScript 运行异常，先确认 Cloudflare Pages 使用的 Node.js 版本。建议设置：

```text
NODE_VERSION=22.16.0
```

或使用 Astro 当前支持的更新 Node 22/24 版本。

### 输出目录配置错误

Astro 默认构建输出为 `dist/`。Cloudflare Pages 的 Output directory 必须配置为：

```text
dist
```
