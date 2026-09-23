import { Router } from "express";
import { createFolder, deleteFolder, getFolders, updateFolder, viewFolderContent } from "../controllers/folder.controllers.js";

const router = Router();

router.route("/").get(getFolders).post(createFolder);
router.route('/:folderId').get(viewFolderContent).put(updateFolder).delete(deleteFolder)

export default router;
