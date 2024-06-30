import express from "express";
import path from "path";
import {
  generateFileList,
  generateFullTree,
  getFileContent,
} from "../utils/fileUtils";

const router = express.Router();

router.post("/generate-tree", async (req, res) => {
  try {
    const { folderPath } = req.body;
    if (!folderPath) {
      return res.status(400).json({ error: "Folder path is required" });
    }
    const tree = await generateFullTree(folderPath);
    res.json({ tree });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/file-list", async (req, res) => {
  try {
    const { folderPath } = req.body;
    if (!folderPath) {
      return res.status(400).json({ error: "Folder path is required" });
    }
    const fileList = await generateFileList(folderPath);
    res.json({ fileList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/file-content", async (req, res) => {
  try {
    const { filePath, folderPath } = req.body;
    if (!filePath) {
      return res.status(400).json({ error: "File path is required" });
    }

    let fullPath = filePath;
    if (folderPath) {
      fullPath = path.join(folderPath, filePath);
    }

    const content = await getFileContent(fullPath);
    res.json({ content, fullPath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
