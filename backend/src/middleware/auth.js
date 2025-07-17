//backend/src/middleware/auth.js
const { requireAuth } = require("@clerk/express");

// Simple wrapper that ensures proper error handling
const requireAuthWithErrorHandling = async (req, res, next) => {
  try {
    // Apply Clerk's requireAuth middleware
    await new Promise((resolve, reject) => {
      requireAuth()(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    
    // If we get here, authentication was successful
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ 
      error: "Authentication required",
      message: "Please log in to access this resource"
    });
  }
};

// Middleware to get user info (optional use)
const getUser = (req, res, next) => {
  try {
    // If authenticated, req.auth contains user data
    next();
  } catch (error) {
    console.error("Error getting user:", error);
    next();
  }
};

module.exports = {
  requireAuth: requireAuthWithErrorHandling,
  getUser,
};