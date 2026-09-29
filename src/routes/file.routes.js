import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { deleteFile, downloadFile, getFileById, uploadFile } from "../controllers/file.controller.js";

const router = Router()

router.route('/folders/:folderId/files').post(upload.single('file'),uploadFile)
router.route('/files/:fileId').get(getFileById).delete(deleteFile)
router.route('/files/:fileId/download').get(downloadFile)
router.route('/files').post(upload.single('file'),uploadFile)

export default router