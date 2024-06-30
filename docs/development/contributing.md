# 贡献指南

我们非常欢迎并感谢任何形式的贡献！以下是一些参与项目的方式：

## 报告问题

如果你发现了 bug 或有新功能建议，请通过 GitHub Issues 来报告。在创建 issue 时，请：

1. 检查是否已经存在相似的 issue。
2. 使用清晰和描述性的标题。
3. 提供尽可能详细的信息，包括复现步骤、错误日志等。

## 提交变更

1. Fork 这个仓库。
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)。
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)。
4. 推送到分支 (`git push origin feature/AmazingFeature`)。
5. 创建一个 Pull Request。

## 代码风格

- 我们使用 ESLint 和 Prettier 来保持代码风格的一致性。
- 在提交代码之前，请运行 `pnpm run lint` 来检查代码风格。
- 确保所有的测试都能通过 (`pnpm test`)。

## 提交信息指南

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。每个提交信息应该包含以下结构：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

例如：

```
feat(api): add new endpoint for file search
```

## 开发流程

1. 选择一个你想要处理的 issue。
2. 在 issue 下留言，表明你想要处理这个问题。
3. Fork 仓库并创建你的分支。
4. 进行开发和测试。
5. 提交 Pull Request。
6. 等待审核和合并。

## 行为准则

请确保你的行为符合我们的 [行为准则](CODE_OF_CONDUCT.md)。

感谢你为这个项目做出的贡献！
