import type {
  Request,
  Response
} from "express";

import { prisma }
from "../config/db.js";

import { io }
from "../socket/socket.js";


// // SEND MESSAGE
// export const sendMessage = async (
//   req: Request,
//   res: Response
// ) => {
// try
//    {

//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const {
//       receiverId,
//       conversationId,
//       content,
//       attachmentUrl,
//     } = req.body;

//     const message =
//       await prisma.message.create({
//         data: {
//           senderId: req.user.id,
//           receiverId,
//           conversationId,
//           content,
//           attachmentUrl,
//         },
//       });

//     // realtime emit
//     io.to(conversationId).emit(
//       "newMessage",
//       message
//     );

//     return res.status(201).json({
//       success: true,
//       data: message,
//     });

//   } catch (error) {

//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to send message",
//     });
//   }
// };




// export const sendMessage = async (
//   req: Request,
//   res: Response
// ) => {

//   try {
//     console.log("USER:", req.user);
// console.log("BODY:", req.body);

//     const {
//       senderId = req.user?.id, // Use authenticated user ID as sender
//       receiverId,
//       conversationId,
//       content,
//       attachmentUrl,
//     } = req.body;

//     // validation
//     if (
//       !receiverId ||
//       !conversationId ||
//       !content
//     ) {

//       return res.status(400).json({
//         success: false,
//         message:
//           "Missing required fields",
//       });
//     }

//     const message = await prisma.message.create({

//   data: {

//     content,

//     attachmentUrl,

//     sender: {
//       connect: {
//         id: senderId, // Replace with actual sender ID from req.user.id
//       },
//     },

//     receiver: {
//       connect: {
//         id: receiverId,
//       },
//     },

//     conversation: {
//       connect: {
//         id: conversationId,
//       },
//     },
//   },
// });
//     io.to(conversationId).emit(
//       "newMessage",
//       message
//     );

//     return res.status(201).json({
//       success: true,
//       data: message,
//     });

//   } catch (error) {

//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to send message",
//     });
//   }
// };
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { receiverId, conversationId, content, attachmentUrl } = req.body;

    if (!conversationId || !receiverId || !content) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }

    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId,
        conversationId,
        content,
        attachmentUrl,
      },
    });

    return res.status(201).json({
      success: true,
      data: message,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

// GET MESSAGES
export const getMessages = async (
  req: Request<{ conversationId: string }>,
  res: Response
) => {

  try {

    const conversationId =
      req.params.conversationId;

    const page =
      Number(req.query.page) || 1;

    const limit = 20;

    const skip =
      (page - 1) * limit;

    const messages =
      await prisma.message.findMany({

        where: {
          conversationId,
        },

        include: {
          sender: {
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

    return res.status(200).json({
      success: true,
      data: messages.reverse(),
      page,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch messages",
    });
  }
};