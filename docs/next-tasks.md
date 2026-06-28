# MikanArchive 下一步任务

这个文档用于跨会话交接“接下来要做什么”。它和 `development-log.md` 不同：`development-log.md` 记录已经完成的事实；本文件只记录待执行、执行中或刚完成但还未收尾确认的步骤。

使用规则：

- 每次开始修改代码、文档、配置或规则前，先读取本文件。
- 每次新增目标、拆分步骤或发现阻塞点时，及时更新本文件。
- 已完成并验证的步骤可以删除，或临时标记为 `~~已完成~~`，等同一目标全部完成后再清理。
- 所有当前目标完成、验证、记录、提交和 push 后，清空本文件正文，只保留本段使用规则。
- 不把私有内容、密钥、本机 token、cookie 或真实私人资料写入本文件。

## 当前任务：联系我板块与全站标题/快捷栏整理

- 状态：本地代码、文档、验证、敏感信息检查和提交已完成；远端 push 受本机 GitHub 连接阻塞，等待网络或 GitHub 凭据通道恢复后重试。
- 已完成：
  - 本地提交已创建，提交内容为“联系我”导航、留言页、全站标题系统、移除通用分类快捷栏、文档同步和验证记录。
  - 提交前验证已通过：`sync:content`、`validate:content`、`test:content-model`、`test:pages`、`check`、`build`。
  - `git diff --check` 和敏感信息扫描已完成，未发现空白错误或实际 secret。
- 阻塞：
  - `git push -u origin codex/firefly-rebuild` 连续多次失败，报错为无法连接 `github.com:443`。
  - `curl.exe -I https://github.com` 同样在 HTTPS 请求阶段卡住；Git 未配置代理。
  - SSH push 报 `Permission denied (publickey)`，当前本机没有可用 GitHub SSH 公钥权限。
- 下一步：
  - 网络或 GitHub 访问恢复后运行：`git push -u origin codex/firefly-rebuild`。
