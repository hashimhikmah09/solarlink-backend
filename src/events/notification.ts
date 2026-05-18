import { notificationEmitter } from "../controllers/quoteController.js";

//Listen for events
notificationEmitter.on("quoteStatusUpdated", (data) => {
    console.log(`Quote ${data.quoteId} status updated to ${data.status} for user ${data.userId}`);
});