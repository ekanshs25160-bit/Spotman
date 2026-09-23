import { Router } from "express";
import { createFolder, getFolders } from "../controllers/folder.controllers";

const router = Router();

router.route("/folders").get(getFolders).post(createFolder);

export default router;
