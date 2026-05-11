import type { Request, Response } from "express";
import { prisma } from "../config/db.js";

/**
 * ==========================================
 * GET ALL COMPANIES
 * Pagination + Filtering
 * ==========================================
 */
export const getCompanies = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const location = req.query.location as string;
    const serviceType = req.query.serviceType as string;

    // Build filters dynamically
    const filters: any = {};

    if (location) {
      filters.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    if (serviceType) {
      filters.serviceType = {
        contains: serviceType,
        mode: "insensitive",
      };
    }

    const companies = await prisma.company.findMany({
      where: filters,
      skip,
      take: limit,
      include: {
        products: true,
        reviews: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.company.count({
      where: filters,
    });

    return res.status(200).json({
      success: true,
      data: companies,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get Companies Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch companies",
    });
  }
};

/**
 * ==========================================
 * GET SINGLE COMPANY
 * With Products + Reviews
 * ==========================================
 */
export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        products: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error("Get Company Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch company",
    });
  }
};

/**
 * ==========================================
 * ADD PRODUCT (COMPANY OWNER ONLY)
 * ==========================================
 */
export const addProduct = async (req: Request, res: Response) => {
  try {
    const { id: companyId } = req.params;
    const { name, price, description } = req.body;

    // Check company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Ensure user is logged in
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Ownership check
    if (company.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to add products to this company",
      });
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        description,
        companyId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    console.error("Add Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add product",
    });
  }
};