// src/utils/uploadToCloudinary.ts
import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (file: Express.Multer.File) => {
  const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(fileBase64, {
    folder: "solarlink",
  });

  return result.secure_url;
};