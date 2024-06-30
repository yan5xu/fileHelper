import { exec } from "child_process";
import util from "util";
import fs from "fs/promises";
import os from "os";
import path from "path";

const execPromise = util.promisify(exec);

function urldecode(str: string): string {
  return decodeURIComponent((str + "").replace(/\+/g, "%20"));
}

export async function generateFullTree(folderPath: string): Promise<string> {
  try {
    // 切换到指定目录
    process.chdir(folderPath);

    // 创建临时文件
    const tempFile = path.join(os.tmpdir(), `tree-${Date.now()}.txt`);

    // 执行Git命令并收集文件列表
    const gitCommands = [
      "git ls-files",
      "git ls-files --modified",
      "git diff --cached --name-only",
      "git ls-files --others --exclude-standard",
    ];

    const fileList = new Set<string>();
    for (const cmd of gitCommands) {
      const { stdout } = await execPromise(cmd);
      stdout
        .split("\n")
        .filter(Boolean)
        .forEach((file) => fileList.add(file));
    }

    // 处理文件名并写入临时文件
    const decodedFiles = Array.from(fileList).map((file) =>
      urldecode(file.replace(/"/g, ""))
    );
    await fs.writeFile(tempFile, decodedFiles.join("\n"));

    // 使用tree命令生成树结构
    const { stdout: treeOutput } = await execPromise(
      `tree --fromfile < "${tempFile}"`
    );

    // 删除临时文件
    await fs.unlink(tempFile);

    return treeOutput;
  } catch (error) {
    console.error("Error generating full tree:", error);
    throw new Error("Failed to generate full tree");
  }
}

export async function getFileContent(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    throw new Error(`Failed to read file: ${error}`);
  }
}

export async function generateFileList(folderPath: string): Promise<string[]> {
  try {
    // 切换到指定目录
    process.chdir(folderPath);

    // 定义Git命令
    const gitCommands = [
      "git ls-files",
      "git ls-files --modified",
      "git diff --cached --name-only",
      "git ls-files --others --exclude-standard",
    ];

    // 并行执行Git命令
    const results = await Promise.all(
      gitCommands.map((cmd) => execPromise(cmd))
    );

    // 收集并处理文件列表
    const fileSet = new Set<string>();
    results.forEach(({ stdout }) => {
      stdout
        .split(os.EOL)
        .filter(Boolean)
        .forEach((file) => fileSet.add(file));
    });

    // 处理文件名
    const decodedFiles = Array.from(fileSet).map((file) =>
      decodeURIComponent(file.replace(/"/g, ""))
    );

    return decodedFiles;
  } catch (error) {
    console.error("Error generating file list:", error);
    throw new Error("Failed to generate file list");
  }
}
