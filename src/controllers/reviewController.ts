import type{ Request, Response } from "express";
import { prisma } from "../config/db.js";



export const createReview = async (req: Request<{id: string}>,
     res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const companyId = req.params.id;
    const { rating, comment } = req.body;

    // validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // check company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // create review (unique constraint will block duplicates)
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId: req.user.id,
        companyId,
      },
    });

    // 🔥 recompute average rating
    const stats = await prisma.review.aggregate({
      where: { companyId },
      _avg: { rating: true },
      _count: true,
    });

    const avgRating = stats._avg.rating ?? 0;

    await prisma.company.update({
      where: { id: companyId },
      data: {
        rating: avgRating, // store cached rating
      },
    });

    return res.status(201).json({
      success: true,
      data: review,
      averageRating: avgRating,
    });
  } catch (error) {

    // handle duplicate review error
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create review",
    });
  }
};

export const getCompanyReviews = async (req: Request<{id: string}>, res: Response) => {
  try {
    const companyId = req.params.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // ✅ check company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // ⭐ fetch reviews
    const reviews = await prisma.review.findMany({
      where: { companyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // 📊 total count
    const total = await prisma.review.count({
      where: { companyId },
    });

    return res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET COMPANY REVIEWS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};