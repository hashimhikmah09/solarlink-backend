// src/middleware/upload.ts
import multer from "multer";

// store file in memory (important for cloud upload)
const storage = multer.memoryStorage();

// file filter (jpg, png, pdf only)
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only jpg, png, pdf files are allowed"), false);
  }

  cb(null, true);
};

// max size 5MB
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});