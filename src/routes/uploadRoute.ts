// src/routes/uploadRoutes.ts
import express from "express";
import { upload } from "../middleware/upload.js";
import { uploadCompanyLogo, uploadFile, uploadInstallationImage, uploadProductImage } from "../controllers/uploadController.js";

const router = express.Router();

// single file upload
router.post("/", upload.single("file"), uploadFile);

//add company logo upload route
router.post("/:id/logo", upload.single("file"), uploadCompanyLogo);

//add product image upload route
router.post("/:id/image", upload.single("file"), uploadProductImage);

//add installation image upload route
router.post("/:id/images", upload.single("file"), uploadInstallationImage);

export default router;