import type {
  Request,
  Response
} from "express";

import { prisma }
from "../config/db.js";


// CREATE CONVERSATION
export const createConversation = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      customerId,
      companyId,
    } = req.body;

    //validation
    const customer = await prisma.user.findUnique({
  where: { id: customerId },
});

const company = await prisma.company.findUnique({
  where: { id: companyId },
});

if (!customer || !company) {
  return res.status(404).json({
    success: false,
    message: "Invalid customer or company ID",
  });
}

    // check existing conversation
    const existingConversation =
      await prisma.conversation.findFirst({

        where: {
          customerId,
          companyId,
        },
      });

    if (existingConversation) {

      return res.status(200).json({
        success: true,
        data: existingConversation,
      });
    }

    const conversation =
      await prisma.conversation.create({

        data: {
          customer: {
          connect: { id: customerId },
            },
            company: {
            connect: { id: companyId },
            },
      },
      });

    return res.status(201).json({
      success: true,
      data: conversation,
    });

  } catch (error) {

    console.error("GET CONVERSATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
         error instanceof Error
        ? error.message
        : "Failed to load conversations",
    });
  }
};


// GET USER CONVERSATIONS

export const getUserConversations = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    let conversations;

    // =========================
    // CUSTOMER VIEW
    // =========================
    if (user.role === "CUSTOMER") {
      conversations = await prisma.conversation.findMany({
        where: {
          customerId: user.id,
        },

        include: {
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1, // last message only
          },

          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // =========================
    // COMPANY VIEW
    // =========================
    if (user.role === "COMPANY") {
      const company = await prisma.company.findFirst({
        where: {
          ownerId: user.id, // IMPORTANT: adjust if your schema differs
        },
      });

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found for this user",
        });
      }

      conversations = await prisma.conversation.findMany({
        where: {
          companyId: company.id,
        },

        include: {
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },

          customer: {
            select: {
              id: true,
              name: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: conversations,
    });

  } catch (error) {
    console.error("GET CONVERSATIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
};