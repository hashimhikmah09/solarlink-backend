import type { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { redis } from "../config/redis.js";

export const searchCompanies = async (req: Request, res: Response) => {
  try {
    const {
      query = "",
      location,
      serviceType,
      minRating,
      page = "1",
      limit = "10",
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // 🔑 CACHE KEY (important for performance)
    const cacheKey = `search:${query}:${location}:${serviceType}:${minRating}:${page}:${limit}`;

    // 1. Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    // 2. Build filters
    const filters: any = {
      AND: [
        query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            }
          : {},
        location ? { location } : {},
        minRating ? { rating: { gte: Number(minRating) } } : {},
        serviceType
          ? {
              products: {
                some: {
                  name: { contains: serviceType, mode: "insensitive" },
                },
              },
            }
          : {},
      ],
    };

    // 3. Query DB
    const companies = await prisma.company.findMany({
      where: filters,
      skip,
      take: limitNum,
      include: {
        products: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 4. total count
    const total = await prisma.company.count({ where: filters });

    const response = {
      success: true,
      data: companies,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };

    // 5. Save to cache (5 min TTL)
    await redis.setEx(cacheKey, 300, JSON.stringify(response));

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};