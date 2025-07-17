// backend/src/controllers/swapController.js
const Swap = require("../models/Swap");
const User = require("../models/User");
const Item = require("../models/Item");

// Request a swap or point redemption
const requestSwap = async (req, res) => {
  try {
    // Add detailed logging
    console.log("Swap request received:");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("Auth:", req.auth);

    const { requestedItemId, offeredItemId, type } = req.body;
    const requesterClerkId = req.auth.userId;

    // Validate required fields
    if (!requestedItemId) {
      return res.status(400).json({
        error: "Validation error",
        message: "requestedItemId is required",
      });
    }

    if (!type) {
      return res.status(400).json({
        error: "Validation error",
        message: "type is required",
      });
    }

    if (!["direct_swap", "point_redemption"].includes(type)) {
      return res.status(400).json({
        error: "Validation error",
        message: "type must be either 'direct_swap' or 'point_redemption'",
      });
    }

    if (!requesterClerkId) {
      return res.status(400).json({
        error: "Authentication error",
        message: "User authentication required",
      });
    }

    // Get requester user
    const requester = await User.findOne({ clerkId: requesterClerkId });
    if (!requester) {
      return res.status(404).json({
        error: "User not found",
        message: "Requester not found",
      });
    }

    // Get requested item and validate
    const requestedItem = await Item.findById(requestedItemId);
    if (!requestedItem) {
      return res.status(404).json({
        error: "Item not found",
        message: "Requested item not found",
      });
    }

    if (!requestedItem.isActive || requestedItem.status !== "approved") {
      return res.status(400).json({
        error: "Item unavailable",
        message: "Requested item is not available for swapping",
      });
    }

    // Get provider user
    const provider = await User.findById(requestedItem.owner);
    if (!provider) {
      return res.status(404).json({
        error: "User not found",
        message: "Item owner not found",
      });
    }

    // Prevent self-swapping
    if (requester._id.toString() === provider._id.toString()) {
      return res.status(400).json({
        error: "Invalid request",
        message: "Cannot request your own item",
      });
    }

    let pointsExchanged = 0;
    let offeredItem = null;

    // Handle different swap types
    if (type === "direct_swap") {
      if (!offeredItemId) {
        return res.status(400).json({
          error: "Validation error",
          message: "offeredItemId is required for direct swaps",
        });
      }

      // Validate offered item
      offeredItem = await Item.findById(offeredItemId);
      if (!offeredItem) {
        return res.status(404).json({
          error: "Item not found",
          message: "Offered item not found",
        });
      }

      if (!offeredItem.isActive || offeredItem.status !== "approved") {
        return res.status(400).json({
          error: "Item unavailable",
          message: "Offered item is not available for swapping",
        });
      }

      // Check if requester owns the offered item
      if (offeredItem.owner.toString() !== requester._id.toString()) {
        return res.status(403).json({
          error: "Permission denied",
          message: "You don't own the offered item",
        });
      }
    } else if (type === "point_redemption") {
      pointsExchanged = requestedItem.pointValue;

      // Check if requester has enough points
      if (requester.points < pointsExchanged) {
        return res.status(400).json({
          error: "Insufficient points",
          message: `You need ${pointsExchanged} points but only have ${requester.points}`,
        });
      }
    }

    // Check for existing pending swap
    const existingSwap = await Swap.findOne({
      requester: requester._id,
      requestedItem: requestedItem._id,
      status: "pending",
    });

    if (existingSwap) {
      return res.status(400).json({
        error: "Duplicate request",
        message: "You already have a pending request for this item",
      });
    }

    // Create swap request
    const newSwap = new Swap({
      requester: requester._id,
      provider: provider._id,
      requestedItem: requestedItem._id,
      offeredItem: offeredItemId || null,
      type,
      pointsExchanged,
      status: "pending",
    });

    await newSwap.save();

    // Populate the response
    const populatedSwap = await Swap.findById(newSwap._id)
      .populate(
        "requester",
        "firstName lastName username profileImageUrl clerkId"
      )
      .populate(
        "provider",
        "firstName lastName username profileImageUrl clerkId"
      )
      .populate("requestedItem", "title images category status pointValue")
      .populate("offeredItem", "title images category status pointValue");

    res.status(201).json({
      success: true,
      swap: populatedSwap,
      message: "Swap request created successfully",
    });
  } catch (error) {
    console.error("Error requesting swap:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to request swap",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get user's swap requests (as requester or provider)
const getUserSwaps = async (req, res) => {
  try {
    // FIX: Use the authenticated user's clerkId instead of hardcoded value
    const userClerkId = req.auth.userId;
    const { status, role, page = 1, limit = 10 } = req.query;

    console.log("Getting swaps for user:", userClerkId);

    const user = await User.findOne({ clerkId: userClerkId });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User not found",
      });
    }

    const query = {};

    if (role === "requester") {
      query.requester = user._id;
    } else if (role === "provider") {
      query.provider = user._id;
    } else {
      query.$or = [{ requester: user._id }, { provider: user._id }];
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitValue = parseInt(limit);

    console.log("Fetching swaps with query:", query);
    console.time("Swap Query Time");

    const swaps = await Swap.find(query)
      .populate(
        "requester",
        "firstName lastName username profileImageUrl clerkId"
      )
      .populate(
        "provider",
        "firstName lastName username profileImageUrl clerkId"
      )
      .populate("requestedItem", "title images category status pointValue")
      .populate("offeredItem", "title images category status pointValue")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitValue)
      .lean();

    console.timeEnd("Swap Query Time");

    const total = await Swap.countDocuments(query);

    res.json({
      success: true,
      swaps,
      pagination: {
        total,
        page: parseInt(page),
        limit: limitValue,
        pages: Math.ceil(total / limitValue),
      },
    });
  } catch (error) {
    console.error("Error getting user swaps:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to get swaps",
    });
  }
};

// Respond to a swap request
const respondToSwap = async (req, res) => {
  try {
    const { swapId, response } = req.body;
    const providerClerkId = req.auth.userId;

    // Validate input
    if (!swapId) {
      return res.status(400).json({
        error: "Validation error",
        message: "swapId is required",
      });
    }

    if (!response) {
      return res.status(400).json({
        error: "Validation error",
        message: "response is required",
      });
    }

    if (!["accepted", "rejected"].includes(response)) {
      return res.status(400).json({
        error: "Validation error",
        message: "response must be either 'accepted' or 'rejected'",
      });
    }

    // Get provider user
    const provider = await User.findOne({ clerkId: providerClerkId });
    if (!provider) {
      return res.status(404).json({
        error: "User not found",
        message: "Provider not found",
      });
    }

    // Get swap and validate
    const swap = await Swap.findById(swapId);
    if (!swap) {
      return res.status(404).json({
        error: "Swap not found",
        message: "Swap request not found",
      });
    }

    // Verify provider owns the item
    if (swap.provider.toString() !== provider._id.toString()) {
      return res.status(403).json({
        error: "Permission denied",
        message: "Not authorized to respond to this swap",
      });
    }

    // Check if swap is still pending
    if (swap.status !== "pending") {
      return res.status(400).json({
        error: "Invalid status",
        message: "This swap request is no longer pending",
      });
    }

    // Update swap status
    swap.status = response;

    // If accepted, process the swap
    if (response === "accepted") {
      // Get the items and users involved
      const requestedItem = await Item.findById(swap.requestedItem);
      const requester = await User.findById(swap.requester);

      if (!requestedItem || !requester) {
        return res.status(404).json({
          error: "Data not found",
          message: "Item or requester no longer exists",
        });
      }

      // For point redemption
      if (swap.type === "point_redemption") {
        // Verify requester still has enough points
        if (requester.points < swap.pointsExchanged) {
          swap.status = "rejected";
          await swap.save();
          return res.status(400).json({
            error: "Insufficient points",
            message: "Requester no longer has enough points",
          });
        }

        // Update points
        requester.points -= swap.pointsExchanged;
        provider.points += swap.pointsExchanged;

        // Update item status
        requestedItem.status = "swapped";

        await requester.save();
        await provider.save();
        await requestedItem.save();
      }
      // For direct swap
      else if (swap.type === "direct_swap" && swap.offeredItem) {
        const offeredItem = await Item.findById(swap.offeredItem);

        if (!offeredItem) {
          return res.status(404).json({
            error: "Item not found",
            message: "Offered item no longer exists",
          });
        }

        // Update both items' status
        requestedItem.status = "swapped";
        offeredItem.status = "swapped";

        await requestedItem.save();
        await offeredItem.save();
      }

      // Complete the swap
      swap.status = "completed";
    }

    await swap.save();

    // Populate response
    const populatedSwap = await Swap.findById(swap._id)
      .populate(
        "requester",
        "firstName lastName username profileImageUrl clerkId"
      )
      .populate(
        "provider",
        "firstName lastName username profileImageUrl clerkId"
      )
      .populate("requestedItem", "title images category status pointValue")
      .populate("offeredItem", "title images category status pointValue");

    res.json({
      success: true,
      swap: populatedSwap,
      message: `Swap ${
        response === "accepted" ? "accepted and completed" : "rejected"
      }`,
    });
  } catch (error) {
    console.error("Error responding to swap:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to respond to swap",
    });
  }
};

// Add message to swap
const addSwapMessage = async (req, res) => {
  try {
    const { swapId, content } = req.body;
    const userClerkId = req.auth.userId;

    // Validate input
    if (!swapId) {
      return res.status(400).json({
        error: "Validation error",
        message: "swapId is required",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        error: "Validation error",
        message: "Message content is required",
      });
    }

    const user = await User.findOne({ clerkId: userClerkId });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User not found",
      });
    }

    const swap = await Swap.findById(swapId);
    if (!swap) {
      return res.status(404).json({
        error: "Swap not found",
        message: "Swap not found",
      });
    }

    // Check if user is part of this swap
    if (
      swap.requester.toString() !== user._id.toString() &&
      swap.provider.toString() !== user._id.toString()
    ) {
      return res.status(403).json({
        error: "Permission denied",
        message: "Not authorized to message in this swap",
      });
    }

    // Add message
    swap.messages.push({
      sender: user._id,
      content: content.trim(),
      timestamp: new Date(),
    });

    await swap.save();

    // Populate response
    const populatedSwap = await Swap.findById(swap._id)
      .populate(
        "requester",
        "firstName lastName username profileImageUrl clerkId"
      )
      .populate(
        "provider",
        "firstName lastName username profileImageUrl clerkId"
      )
      .populate("requestedItem", "title images category status pointValue")
      .populate("offeredItem", "title images category status pointValue")
      .populate(
        "messages.sender",
        "firstName lastName username profileImageUrl clerkId"
      );

    res.json({
      success: true,
      message: "Message sent successfully",
      swap: populatedSwap,
    });
  } catch (error) {
    console.error("Error adding swap message:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to send message",
    });
  }
};

module.exports = {
  requestSwap,
  respondToSwap,
  getUserSwaps,
  addSwapMessage,
};
