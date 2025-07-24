const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const messageController = require("../controllers/messageController");

router.post("/", requireAuth, messageController.sendMessage);
router.get("/", requireAuth, messageController.getMessages);
router.patch("/:messageId/read", requireAuth, messageController.markAsRead);
router.get("/unread-count", requireAuth, messageController.getUnreadCount);

module.exports = router;
