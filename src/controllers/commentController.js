const { Comment, User, Post } = require('../models');

/**
 * @route   GET /api/comments/post/:postId
 * @desc    Get all comments for a post
 * @access  Public
 */
const getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Check if post exists
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const { count, rows: comments } = await Comment.findAndCountAll({
      where: { postId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        comments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/comments/post/:postId
 * @desc    Add a comment to a post
 * @access  Private
 */
const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Check if post exists
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = await Comment.create({
      content,
      userId,
      postId
    });

    // Fetch comment with author info
    const commentWithAuthor = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        comment: commentWithAuthor
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/comments/:id
 * @desc    Update a comment
 * @access  Private (Owner only)
 */
const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check ownership
    if (comment.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this comment'
      });
    }

    comment.content = content;
    await comment.save();

    // Fetch updated comment with author info
    const updatedComment = await Comment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: {
        comment: updatedComment
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/comments/:id
 * @desc    Delete a comment
 * @access  Private (Owner only)
 */
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check ownership
    if (comment.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this comment'
      });
    }

    await comment.destroy();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment
};
