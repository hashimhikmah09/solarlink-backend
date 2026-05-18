// src/controllers/uploadController.ts
import type { Request, Response } from "express";
import cloudinary from "../config/cloudinary.js";
import { prisma } from "../config/db.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const uploadFile = async (req: Request, res: Response) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // convert buffer to base64
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // upload to cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "solarlink",
    });

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};

//company upload
// src/controllers/companyUploadController.ts



export const uploadCompanyLogo = async (req: Request<{ id: string }>, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const companyId = req.params.id;

    const url = await uploadToCloudinary(req.file);

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: { logo: url },
    });

    return res.status(200).json({
      success: true,
      message: "Logo uploaded successfully",
      data: updatedCompany,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload logo",
    });
  }
};

//product upload

export const uploadProductImage = async (req: Request<{ id: string }>, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const productId = req.params.id;

    const url = await uploadToCloudinary(req.file);

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { image: url },
    });

    return res.status(200).json({
      success: true,
      message: "Product image uploaded",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload product image",
    });
  }
};


//multiple images upload for product


export const uploadInstallationImage = async (req: Request<{id: string}>, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const installationId = req.params.id;

    const url = await uploadToCloudinary(req.file);

    const updatedInstallation = await prisma.installation.update({
      where: { id: installationId },
      data: {
        images: {
          push: url,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Installation image uploaded",
      data: updatedInstallation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload installation image",
    });
  }
};