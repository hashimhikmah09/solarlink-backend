import type { Request, Response } from "express";
import { prisma } from "../config/db.js";
import EventEmitter from "events";
import type { $Enums } from "@prisma/client";
import { createNotification } from "../utils/NotificationHelper.js";
import { sendEmail } from "../utils/sendEmail.js";
import { io } from "../socket/socket.js";

//CREATE QUOTE

export const createQuote = async (
  req: Request,
  res: Response
) => {
  try {

    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    

    // Extract request body
    const {
      systemSize,
      address,
      energyNeeds,
      budget,
      companyId,
    } = req.body;

    // Check if company exists
    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Create quote
    const quote = await prisma.quote.create({
      data: {
        systemSize,
        address,
        energyNeeds,
        budget: Number(budget),

        // Connect customer
        userId: req.user.id,

        // Connect company
        companyId,
      },
    });

    return res.status(201).json({
      success: true,
      data: quote,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create quote",
    });
  }
};

//get quotes for user and company
export const getQuotes = async (req: Request, res: Response) => {
  try {  
    //authenticated user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    let quotes: ({ company: { name: string; id: string; createdAt: Date; location: string; description: string; ownerId: string; }; } & { id: string; systemSize: string; address: string; energyNeeds: string; budget: number; status: $Enums.QuoteStatus; userId: string; companyId: string; createdAt: Date; })[] | ({ user: { role: $Enums.UserRole; name: string; id: string; createdAt: Date; email: string; password: string; }; } & { id: string; systemSize: string; address: string; energyNeeds: string; budget: number; status: $Enums.QuoteStatus; userId: string; companyId: string; createdAt: Date; })[] = [];
    // If user is a regular user, return only their quotes. If admin, return all quotes.
    if (req.user.role?.toUpperCase() === "USER") {
      console.log("Logged in user ID:", req.user.id);
      quotes = await prisma.quote.findMany({
        where: { userId: req.user.id },
        include: {
          company: true,
        },
      });
      //company view
    } else if (req.user.role?.toUpperCase() === "COMPANY") {
      console.log("User role:", req.user.role);
      // Find the company associated with the user
      const company = await prisma.company.findFirst({
        where: {ownerId: req.user.id },
      });
      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }
      quotes = await prisma.quote.findMany({
        where: { companyId: company.id },
        include: {
          user: true,
        },  
      });
    } return res.status(200).json({
      success: true,
      data: quotes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve quotes",
    });
  }
};
 //update quote
//create notification emmitter

export const notificationEmitter = new EventEmitter();

export const updateQuoteStatus = async (req: Request, res: Response) => {
  try {
    //authentication and authorization should be handled in the route handler
    if(!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    const quoteId = req.params.id as string;
    const { status } = req.body;
    // Check if quote exists
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        company: true,
        user: true,
      },
    });
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }
    //ensure only the company that owns the quote can update the status
    if (quote.company.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    // Update quote status
    const updatedQuote = await prisma.quote.update({
      where: { id: quoteId },
      data: { status },
    });

//Notification logic. save notification to db
    await createNotification({
      userId: quote.userId,
      title: "Quote Updated",
      message: `Your quote status is now ${status}`,
      type: "QUOTE_UPDATE",
    });
 // Send email
    await sendEmail(
      quote.user.email,
      "Quote Updated",
      `Your quote is now ${status}`
    );
        //socket notification will be handled by the event emitter and listener in the socket file

    io.emit("notification", {
      userId: quote.userId,
      title: "Quote Updated",
      message: `Your quote status is now ${status}`,
    });
   
    // Emit notification event
    notificationEmitter.emit("quoteStatusUpdated", {
      quoteId,
      status,
      userId: quote.userId,
    });
    return res.status(200).json({
      success: true,
      data: updatedQuote,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
        success: false,
        message: "Failed to update quote status",
    });
  }
};