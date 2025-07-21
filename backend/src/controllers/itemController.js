//src/controllers/itemController.js
const Item = require("../models/Item");
const User = require("../models/User");
const { cloudinary } = require("../middleware/upload");

// Create new item
const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      size,
      condition,
      tags,
      pointValue,
    } = req.body;
    const owner = await User.findOne({ clerkId: req.auth.userId });

    if (!owner) {
      return res.status(404).json({ error: "User not found" });
    }

    // Handle image files - Cloudinary URLs are now available in req.files
    const images = req.files?.map((file) => file.path) || []; // file.path contains the Cloudinary URL

    if (images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    const newItem = new Item({
      title,
      description,
      category,
      type,
      size,
      condition,
      images,
      tags: tags?.split(",").map((tag) => tag.trim()) || [],
      pointValue: pointValue || 10,
      owner: owner._id,
    });

    await newItem.save();
    res.status(201).json({ item: newItem, message: "Item added successfully" });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: "Failed to create item" });
  }
};

// Get all items with filters
const getItems = async (req, res) => {
  try {
    const {
      category,
      size,
      condition,
      search,
      page = 1,
      limit = 10,
      status = "approved",
      userId,
    } = req.query;

    const query = { isActive: true };

    // 🧑‍⚖️ Filter by item owner if userId is provided
    if (userId) {
      const user = await User.findOne({ clerkId: userId });
      if (user) {
        query.owner = user._id;
      } else {
        return res.status(404).json({ error: "User not found for userId" });
      }
    }

    // Only admins can see pending/rejected items in the main listing
    const user = await User.findOne({ clerkId: req.auth?.userId });
    if (!user || user.role !== "admin") {
      query.status = status;
    }

    if (category) query.category = category;
    if (size) query.size = size;
    if (condition) query.condition = condition;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const items = await Item.find(query)
      .populate("owner", "firstName lastName username profileImageUrl clerkId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Item.countDocuments(query);

    res.json({
      items,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error getting items:", error);
    res.status(500).json({ error: "Failed to get items" });
  }
};

// Get item by ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("owner", "firstName lastName username profileImageUrl clerkId")
      .populate("likes", "firstName lastName username"); // Populate likes

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ item });
  } catch (error) {
    console.error("Error getting item:", error);
    res.status(500).json({ error: "Failed to get item" });
  }
};

// Get user's liked items
const getUserLikedItems = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const {
      category,
      size,
      condition,
      search,
      page = 1,
      limit = 12,
    } = req.query;

    // Base query: items liked by the current user
    const query = {
      likes: user._id,
      isActive: true,
      status: "approved",
    };

    // Apply filters
    if (category) query.category = category;
    if (size) query.size = size;
    if (condition) query.condition = condition;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const items = await Item.find(query)
      .populate("owner", "firstName lastName username profileImageUrl clerkId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Item.countDocuments(query);

    res.json({
      items,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error getting liked items:", error);
    res.status(500).json({ error: "Failed to get liked items" });
  }
};

// Update item
const updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const updateData = req.body;
    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the item
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Check if user is owner or admin
    if (
      item.owner.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this item" });
    }

    // Handle removed images
    let finalImages = [...item.images];
    if (updateData.removedImages) {
      try {
        const removedImageUrls = JSON.parse(updateData.removedImages);
        finalImages = finalImages.filter(
          (url) => !removedImageUrls.includes(url)
        );

        //Delete removed images from Cloudinary
        for (const imageUrl of removedImageUrls) {
          try {
            const urlParts = imageUrl.split("/");
            const filename = urlParts[urlParts.length - 1];
            const publicId = `rewear/items/${filename.split(".")[0]}`;
            await cloudinary.uploader.destroy(publicId);
          } catch (cloudinaryError) {
            console.error(
              "Error deleting image from Cloudinary:",
              cloudinaryError
            );
            // Continue even if Cloudinary deletion fails
          }
        }
      } catch (error) {
        console.error("Error processing removed images:", error);
      }
    }

    // Handle new images if any
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path); // Cloudinary URLs
      finalImages = [...finalImages, ...newImages];
    }

    // Ensure we don't exceed the limit
    if (finalImages.length > 6) {
      return res.status(400).json({ error: "Maximum 6 images allowed" });
    }

    // Ensure at least one image remains
    if (finalImages.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    updateData.images = finalImages;

    // Handle tags if provided as a string
    if (updateData.tags && typeof updateData.tags === "string") {
      updateData.tags = updateData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    }

    // Remove removedImages from updateData as it's not part of the schema
    delete updateData.removedImages;

    // If not an admin and item was approved, set status back to pending for re-review
    if (user.role !== "admin" && item.status === "approved") {
      updateData.status = "pending";
    }

    const updatedItem = await Item.findByIdAndUpdate(itemId, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ item: updatedItem, message: "Item updated successfully" });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Failed to update item" });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the item
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Check if user is owner or admin
    if (
      item.owner.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this item" });
    }

    // Delete images from Cloudinary
    if (item.images && item.images.length > 0) {
      try {
        const deletePromises = item.images.map((imageUrl) => {
          // Extract public_id from Cloudinary URL
          const urlParts = imageUrl.split("/");
          const filename = urlParts[urlParts.length - 1];
          const publicId = `rewear/items/${filename.split(".")[0]}`;
          return cloudinary.uploader.destroy(publicId);
        });
        await Promise.all(deletePromises);
      } catch (cloudinaryError) {
        console.error(
          "Error deleting images from Cloudinary:",
          cloudinaryError
        );
        // Continue with item deletion even if Cloudinary deletion fails
      }
    }

    // Soft delete by setting isActive to false
    await Item.findByIdAndUpdate(itemId, {
      isActive: false,
      status: "inactive",
    });

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Failed to delete item" });
  }
};

// Admin: Approve or reject item
const moderateItem = async (req, res) => {
  try {
    const { itemId, action } = req.body;

    if (!["approve", "reject"].includes(action)) {
      return res
        .status(400)
        .json({ error: "Invalid action. Use 'approve' or 'reject'" });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Update item status
    item.status = action === "approve" ? "approved" : "rejected";
    await item.save();

    // If approving, award points to the user
    if (action === "approve") {
      const owner = await User.findById(item.owner);
      if (owner) {
        owner.points += item.pointValue;
        await owner.save();
      }
    }

    res.json({
      message: `Item ${action}d successfully`,
      item: item,
    });
  } catch (error) {
    console.error("Error moderating item:", error);
    res.status(500).json({ error: "Failed to moderate item" });
  }
};

// Like/Unlike item
const toggleLikeItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const isLiked = item.likes.includes(user._id);

    if (isLiked) {
      // Unlike: Remove user from likes array
      item.likes = item.likes.filter((like) => !like.equals(user._id));
      item.likeCount = Math.max(0, item.likeCount - 1);
    } else {
      // Like: Add user to likes array
      item.likes.push(user._id);
      item.likeCount += 1;
    }

    await item.save();

    res.json({
      message: isLiked ? "Item unliked" : "Item liked",
      isLiked: !isLiked,
      likeCount: item.likeCount,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Failed to toggle like" });
  }
};

// Share item (increment share count)
const shareItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Increment share count
    item.shareCount += 1;
    await item.save();

    res.json({
      message: "Item shared successfully",
      shareCount: item.shareCount,
    });
  } catch (error) {
    console.error("Error sharing item:", error);
    res.status(500).json({ error: "Failed to share item" });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  getUserLikedItems,
  updateItem,
  deleteItem,
  moderateItem,
  toggleLikeItem,
  shareItem,
};
