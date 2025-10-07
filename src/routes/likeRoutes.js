const express = require("express");
const router = express.Router();
const { param } = require("express-validator");
const { validate } = require("../middlewares/validate");
const { authenticate } = require("../middlewares/auth");
const {
  likePost,
  unlikePost,
  getPostLikes,
  getUserLikes,
} = require("../controllers/likeController");

/**
 * Validation rules
 */
const postIdValidation = [
  param("postId").isInt({ min: 1 }).withMessage("Invalid post ID"),
];

const userIdValidation = [
  param("userId").isInt({ min: 1 }).withMessage("Invalid user ID"),
];

/**
 * Routes
 */
router.post(
  "/post/:postId",
  authenticate,
  postIdValidation,
  validate,
  likePost
);
router.delete(
  "/post/:postId",
  authenticate,
  postIdValidation,
  validate,
  unlikePost
);
router.get("/post/:postId", postIdValidation, validate, getPostLikes);
router.get("/user/:userId", userIdValidation, validate, getUserLikes);

module.exports = router;
