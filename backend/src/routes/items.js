//backend/src/routes/items.js
const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  moderateItem,
  toggleLikeItem, // NEW
  shareItem, // NEW
} = require("../controllers/itemController");
const { isAdmin } = require("../controllers/adminController");

const router = express.Router();

// Public routes
router.get("/", getItems); // Anyone can browse items

// Auth required routes
router.post("/", requireAuth, upload.array("images", 10), createItem);
router.get("/:id", getItemById);
router.put("/:id", requireAuth, upload.array("images", 10), updateItem);
router.delete("/:id", requireAuth, deleteItem);

// 👍 NEW: Like/Unlike routes
router.post("/:id/like", requireAuth, toggleLikeItem);

// 📤 NEW: Share routes (public - no auth required for share tracking)
router.post("/:id/share", shareItem);

// Admin routes
router.post("/moderate", requireAuth, isAdmin, moderateItem);

module.exports = router;
