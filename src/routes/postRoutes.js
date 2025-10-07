const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const { validate } = require("../middlewares/validate");
const { authenticate, optionalAuth } = require("../middlewares/auth");
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByUser,
} = require("../controllers/postController");

/**
 * Validation rules
 */
const createPostValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long"),
];

const updatePostValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid post ID"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("content")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long"),
];

const postIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid post ID"),
];

const userIdValidation = [
  param("userId").isInt({ min: 1 }).withMessage("Invalid user ID"),
];

/**
 * Routes
 */
router.get("/", getAllPosts);
router.get("/:id", postIdValidation, validate, optionalAuth, getPostById);
router.post("/", authenticate, createPostValidation, validate, createPost);
router.put("/:id", authenticate, updatePostValidation, validate, updatePost);
router.delete("/:id", authenticate, postIdValidation, validate, deletePost);
router.get("/user/:userId", userIdValidation, validate, getPostsByUser);

module.exports = router;
