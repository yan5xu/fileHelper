# API 文档

## 基础 URL

所有 API 路径都以 `/api` 为前缀。

## 端点

### 1. 生成文件树

- **URL**: `/api/generate-tree`
- **方法**: POST
- **请求体**:

  ```json
  {
    "folderPath": "路径/到/文件夹"
  }
  ```

- **响应**: 返回文件夹的树状结构
- **示例响应**:

  ```json
  {
    "tree": ".\n├── file1.txt\n├── file2.js\n└── subfolder\n    └── file3.md"
  }
  ```

### 2. 获取文件列表

- **URL**: `/api/file-list`
- **方法**: POST
- **请求体**:

  ```json
  {
    "folderPath": "路径/到/文件夹"
  }
  ```

- **响应**: 返回文件夹中的文件列表
- **示例响应**:

  ```json
  {
    "fileList": [
      "file1.txt",
      "file2.js",
      "subfolder/file3.md"
    ]
  }
  ```

### 3. 获取文件内容

- **URL**: `/api/file-content`
- **方法**: POST
- **请求体**:

  ```json
  {
    "filePath": "路径/到/文件",
    "folderPath": "可选的基础路径"
  }
  ```

- **响应**: 返回指定文件的内容
- **示例响应**:

  ```json
  {
    "content": "文件的内容..."
  }
  ```

### 4. 创建文件

- **URL**: `/api/create-file`
- **方法**: POST
- **请求体**:

  ```json
  {
    "filePath": "路径/到/新文件.txt",
    "content": "文件的初始内容"
  }
  ```

- **响应**: 返回文件创建的结果
- **示例响应**:

  ```json
  {
    "success": true,
    "message": "文件创建成功",
    "filePath": "路径/到/新文件.txt"
  }
  ```

### 5. 获取变动文件信息

- **URL**: `/api/changed-files`
- **方法**: POST
- **请求体**:

  ```json
  {
    "folderPath": "路径/到/文件夹"
  }
  ```

- **响应**: 返回指定路径下变动的文件信息
- **示例响应**:

  ```json
  {
    "changedFiles": [
      {
        "fullPath": "完整文件路径",
        "changeType": "added | modified | deleted | untracked",
        "content": "当前文件内容",
        "diff": "git diff 输出"
      },
      // ... 其他变动文件
    ]
  }
  ```

## 错误处理

所有 API 端点在发生错误时都会返回一个 JSON 对象，包含一个 `error` 字段描述错误信息。

示例错误响应：

```json
{
  "error": "文件未找到"
}
```

## 注意事项

- 确保服务器有足够的权限访问指定的文件夹和文件。
- 大文件可能会导致响应时间增加，请考虑在客户端实现超时处理。
- 对于 `/api/create-file` 端点，确保提供有效的文件路径和内容。
- `/api/changed-files` 端点需要在 Git 仓库中使用，并且可能会对大型仓库的性能产生影响。
- 所有请求都会被记录，包括请求方法、URL 和请求体，以便于调试和监控。

更多 API 使用示例和最佳实践，请参考我们的 [API 使用指南](api-usage-guide.md)。
