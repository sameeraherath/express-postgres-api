const jwt = require("jsonwebtoken");
const { User } = require("../models");

/**
 * Middleware to authenticate JWT tokens
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Extract token
    const token = authHeader.substring(7);

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid token. User not found.",
        });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please login again.",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during authentication.",
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 * Useful for routes that work with or without authentication
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id, {
          attributes: { exclude: ["password"] },
        });

        if (user) {
          req.user = user;
        }
      } catch (error) {
        // Token invalid but we don't fail - just continue without user
        console.log("Optional auth: Invalid token, continuing without user");
      }
    }

    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    next();
  }
};

module.exports = { authenticate, optionalAuth };
