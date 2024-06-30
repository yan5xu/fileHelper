import express from "express";
import apiRoutes from "./routes/api";

const app = express();
const port = 3003; // 你可以根据需要更改端口号

// 中间件
app.use(express.json()); // 用于解析 JSON 请求体

// 中间件 记录请求日志
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  console.log("Request Body:", req.body);
  next();
});

// 路由
app.use("/api", apiRoutes);

// 基本的根路由
app.get("/", (req, res) => {
  res.send("Welcome to the File Helper API");
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// 错误处理中间件
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  }
);

export default app;
