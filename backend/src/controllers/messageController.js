const Message = require("../models/Message");
const User = require("../models/User");
const Item = require("../models/Item");

const messageController = {
  sendMessage: async (req, res) => {
    try {
      const { toUserId, itemId, subject, message } = req.body;
      const fromUserId = req.auth.userId;

      if (!toUserId || !itemId || !subject || !message) {
        return res.status(400).json({
          error: "All fields are required",
        });
      }

      const [fromUser, toUser] = await Promise.all([
        User.findOne({ clerkId: fromUserId }),
        User.findOne({ clerkId: toUserId }),
      ]);

      if (!fromUser || !toUser) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      const item = await Item.findById(itemId);
      if (!item) {
        return res.status(404).json({
          error: "Item not found",
        });
      }

      if (fromUser._id.toString() === toUser._id.toString()) {
        return res.status(400).json({
          error: "Cannot send message to yourself",
        });
      }

      const newMessage = new Message({
        from: fromUser._id,
        to: toUser._id,
        item: itemId,
        subject,
        message,
      });

      await newMessage.save();

      const populatedMessage = await Message.findById(newMessage._id)
        .populate("from", "firstName lastName username profileImageUrl clerkId")
        .populate("to", "firstName lastName username profileImageUrl clerkId")
        .populate("item", "title images category");

      res.status(201).json({
        message: "Message sent successfully",
        data: populatedMessage,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({
        error: "Failed to send message",
      });
    }
  },

  getMessages: async (req, res) => {
    try {
      const userId = req.auth.userId;
      const { type = "received", page = 1, limit = 20 } = req.query;

      const user = await User.findOne({ clerkId: userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const query = type === "sent" ? { from: user._id } : { to: user._id };

      const messages = await Message.find(query)
        .populate("from", "firstName lastName username profileImageUrl clerkId")
        .populate("to", "firstName lastName username profileImageUrl clerkId")
        .populate("item", "title images category status")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Message.countDocuments(query);

      res.json({
        messages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({
        error: "Failed to fetch messages",
      });
    }
  },

  markAsRead: async (req, res) => {
    try {
      const { messageId } = req.params;
      const userId = req.auth.userId;

      const user = await User.findOne({ clerkId: userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const message = await Message.findOne({
        _id: messageId,
        to: user._id,
      });

      if (!message) {
        return res.status(404).json({
          error: "Message not found",
        });
      }

      message.isRead = true;
      await message.save();

      res.json({
        message: "Message marked as read",
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({
        error: "Failed to mark message as read",
      });
    }
  },

  getUnreadCount: async (req, res) => {
    try {
      const userId = req.auth.userId;

      const user = await User.findOne({ clerkId: userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const unreadCount = await Message.countDocuments({
        to: user._id,
        isRead: false,
      });

      res.json({ unreadCount });
    } catch (error) {
      console.error("Error getting unread count:", error);
      res.status(500).json({
        error: "Failed to get unread count",
      });
    }
  },
};

module.exports = messageController;
