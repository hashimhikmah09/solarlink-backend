import { Server } from "socket.io";

let io: Server;

export const initializeSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // =========================
    // JOIN CONVERSATION ROOM
    // =========================
    socket.on("joinConversation", (conversationId: string) => {
      socket.join(conversationId);
      console.log(`Joined room: ${conversationId}`);
    });

    // =========================
    // REAL-TIME MESSAGE EVENT
    // =========================
    socket.on("sendMessage", (message) => {
      const { conversationId } = message;

      // broadcast to everyone in that conversation
      io.to(conversationId).emit("newMessage", message);
    });

    // =========================
    // DISCONNECT
    // =========================
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export { io };