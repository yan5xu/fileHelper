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
- API 目前不支持文件写入操作，仅提供读取功能。

更多 API 使用示例和最佳实践，请参考我们的 [API 使用指南](api-usage-guide.md)。
