# 安装指南

## 系统要求

- Node.js (版本 14 或更高)
- pnpm (推荐) 或 npm
- Git

## 安装步骤

1. 克隆仓库：

   ```bash
   git clone [仓库URL]
   cd file-api-server
   ```

2. 安装依赖：

   使用 pnpm（推荐）：

   ```bash
   pnpm install
   ```

   或者使用 npm：

   ```bash
   npm install
   ```

3. 配置环境变量：

   复制 `.env.example` 文件并重命名为 `.env`，然后根据你的环境设置相应的值。

   ```bash
   cp .env.example .env
   ```

4. 构建项目：

   ```bash
   pnpm run build
   ```

## 验证安装

安装完成后，你可以运行以下命令来验证安装是否成功：

```bash
pnpm run dev
```

如果一切正常，你应该能看到类似以下的输出：

```
Server running at http://localhost:3003
```

现在你已经成功安装了文件操作 API 服务器！请查看 [使用方法](usage.md) 文档来了解如何使用和配置服务器。
