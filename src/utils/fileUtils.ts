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
  const originalCwd = process.cwd();

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
  } finally {
    // 恢复原始工作目录
    process.chdir(originalCwd);
  }
}

export async function createFileWithContent(
  filePath: string,
  content: string
): Promise<void> {
  try {
    // 规范化路径
    const normalizedPath = path.normalize(filePath);

    // 获取目录路径
    const dirPath = path.dirname(normalizedPath);

    // 确保目录存在，如果不存在则创建
    await fs.mkdir(dirPath, { recursive: true });

    // 写入文件内容
    await fs.writeFile(normalizedPath, content, "utf-8");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create file: ${error.message}`);
    } else {
      throw new Error(`Failed to create file: Unknown error`);
    }
  }
}

type FileInfo = {
  fullPath: string;
  changeType: "added" | "modified" | "deleted" | "untracked";
  content: string | null;
  diff: string;
};

async function getDirectoryContents(dirPath: string): Promise<FileInfo[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  let contents: FileInfo[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      contents = contents.concat(await getDirectoryContents(fullPath));
    } else {
      contents.push({
        fullPath,
        changeType: "untracked",
        content: await getFileContent(fullPath),
        diff: "",
      });
    }
  }

  return contents;
}

export async function getChangedFilesInfo(
  folderPath: string
): Promise<FileInfo[]> {
  try {
    const gitRoot = await getGitRoot(folderPath);
    const relativePath = path.relative(gitRoot, folderPath);
    const pathSpec = relativePath || ".";

    const { stdout } = await execPromise(
      `git -C "${gitRoot}" status --porcelain "${pathSpec}"`
    );

    const changedFiles = stdout
      .split("\n")
      .filter(Boolean)
      .map((line) => ({
        status: line.slice(0, 2).trim(),
        file: line.slice(3),
      }))
      .filter(({ file }) => {
        // 如果 relativePath 为空，不进行过滤
        if (!relativePath) return true;
        return file.startsWith(relativePath);
      });

    let filesInfo: FileInfo[] = [];

    for (const { status, file } of changedFiles) {
      const fullPath = path.join(gitRoot, file);
      let changeType: "added" | "modified" | "deleted" | "untracked";
      let content: string | null = null;
      let diff: string = "";

      if (status === "D") {
        filesInfo.push({
          fullPath,
          changeType: "deleted",
          content: "",
          diff: (await execPromise(`git -C "${gitRoot}" diff -- "${file}"`))
            .stdout,
        });
        continue;
      }

      if (status === "A") {
        filesInfo.push({
          fullPath,
          changeType: "added",
          content: await getFileContent(fullPath),
          diff: "",
        });
        continue;
      }

      const isDirectory = (await fs.stat(fullPath)).isDirectory();

      if (isDirectory && (status === "??" || status === "A")) {
        const dirContents = await getDirectoryContents(fullPath);
        filesInfo = filesInfo.concat(dirContents);
        continue;
      }
      console.log("💥", status, fullPath);
      switch (status) {
        case "A":
          changeType = "added";
          content = await getFileContent(fullPath);
          diff = (
            await execPromise(
              `git -C "${gitRoot}" diff --no-index /dev/null "${file}"`
            )
          ).stdout;
          break;
        case "M":
          changeType = "modified";
          content = await getFileContent(fullPath);
          diff = (await execPromise(`git -C "${gitRoot}" diff "${file}"`))
            .stdout;
          break;
        case "D":
          changeType = "deleted";
          diff = (await execPromise(`git -C "${gitRoot}" diff -- "${file}"`))
            .stdout;
          break;
        case "??":
          changeType = "untracked";
          content = await getFileContent(fullPath);
          break;
        default:
          changeType = "modified";
          content = await getFileContent(fullPath);
          diff = (await execPromise(`git -C "${gitRoot}" diff "${file}"`))
            .stdout;
      }

      filesInfo.push({ fullPath, changeType, content, diff });
    }

    return filesInfo;
  } catch (error) {
    console.error("Error getting changed files info:", error);
    throw new Error("Failed to get changed files info");
  }
}

async function getGitRoot(dir: string): Promise<string> {
  try {
    const { stdout } = await execPromise("git rev-parse --show-toplevel", {
      cwd: dir,
    });
    return stdout.trim();
  } catch (error) {
    throw new Error("Not a git repository");
  }
}
