const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { validate } = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');

/**
 * Validation rules
 */
const createCommentValidation = [
  param('postId')
    .isInt({ min: 1 }).withMessage('Invalid post ID'),
  body('content')
    .trim()
    .notEmpty().withMessage('Comment content is required')
    .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters')
];

const updateCommentValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid comment ID'),
  body('content')
    .trim()
    .notEmpty().withMessage('Comment content is required')
    .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters')
];

const commentIdValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid comment ID')
];

const postIdValidation = [
  param('postId')
    .isInt({ min: 1 }).withMessage('Invalid post ID')
];

/**
 * Routes
 */
router.get('/post/:postId', postIdValidation, validate, getCommentsByPost);
router.post('/post/:postId', authenticate, createCommentValidation, validate, createComment);
router.put('/:id', authenticate, updateCommentValidation, validate, updateComment);
router.delete('/:id', authenticate, commentIdValidation, validate, deleteComment);

module.exports = router;
