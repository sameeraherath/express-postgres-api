const { Like, User, Post } = require("../models");

/**
 * @route   POST /api/likes/post/:postId
 * @desc    Like a post
 * @access  Private
 */
const likePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Check if post exists
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if already liked
    const existingLike = await Like.findOne({
      where: { userId, postId },
    });

    if (existingLike) {
      return res.status(400).json({
        success: false,
        message: "You have already liked this post",
      });
    }

    // Create like
    await Like.create({
      userId,
      postId,
    });

    // Get updated likes count
    const likesCount = await Like.count({
      where: { postId },
    });

    res.status(201).json({
      success: true,
      message: "Post liked successfully",
      data: {
        likesCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/likes/post/:postId
 * @desc    Unlike a post
 * @access  Private
 */
const unlikePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Check if post exists
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Find and delete like
    const like = await Like.findOne({
      where: { userId, postId },
    });

    if (!like) {
      return res.status(400).json({
        success: false,
        message: "You have not liked this post",
      });
    }

    await like.destroy();

    // Get updated likes count
    const likesCount = await Like.count({
      where: { postId },
    });

    res.status(200).json({
      success: true,
      message: "Post unliked successfully",
      data: {
        likesCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/likes/post/:postId
 * @desc    Get likes count and list for a post
 * @access  Public
 */
const getPostLikes = async (req, res, next) => {
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
        message: "Post not found",
      });
    }

    const { count, rows: likes } = await Like.findAndCountAll({
      where: { postId },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "fullName"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: {
        likesCount: count,
        likes,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/likes/user/:userId
 * @desc    Get posts liked by a user
 * @access  Public
 */
const getUserLikes = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Check if user exists
    const user = await User.findByPk(userId, {
      attributes: ["id", "username", "fullName"],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { count, rows: likes } = await Like.findAndCountAll({
      where: { userId },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Post,
          as: "post",
          include: [
            {
              model: User,
              as: "author",
              attributes: ["id", "username", "fullName"],
            },
          ],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        likes,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  likePost,
  unlikePost,
  getPostLikes,
  getUserLikes,
};
