const { Post, User, Comment, Like } = require('../models');

/**
 * @route   GET /api/posts
 * @desc    Get all posts with pagination
 * @access  Public
 */
const getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: posts } = await Post.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName']
        },
        {
          model: Comment,
          as: 'comments',
          attributes: ['id']
        },
        {
          model: Like,
          as: 'likes',
          attributes: ['id']
        }
      ],
      distinct: true
    });

    // Add counts to each post
    const postsWithCounts = posts.map(post => {
      const postJson = post.toJSON();
      return {
        ...postJson,
        commentsCount: postJson.comments.length,
        likesCount: postJson.likes.length,
        comments: undefined,
        likes: undefined
      };
    });

    res.status(200).json({
      success: true,
      data: {
        posts: postsWithCounts,
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
 * @route   GET /api/posts/:id
 * @desc    Get single post by ID
 * @access  Public
 */
const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName']
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'fullName']
            }
          ],
          order: [['createdAt', 'DESC']]
        },
        {
          model: Like,
          as: 'likes',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username']
            }
          ]
        }
      ]
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const postJson = post.toJSON();
    const responseData = {
      ...postJson,
      commentsCount: postJson.comments.length,
      likesCount: postJson.likes.length,
      isLikedByUser: req.user ? postJson.likes.some(like => like.userId === req.user.id) : false
    };

    res.status(200).json({
      success: true,
      data: {
        post: responseData
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/posts
 * @desc    Create a new post
 * @access  Private
 */
const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const post = await Post.create({
      title,
      content,
      userId
    });

    // Fetch post with author info
    const postWithAuthor = await Post.findByPk(post.id, {
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
      message: 'Post created successfully',
      data: {
        post: postWithAuthor
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/posts/:id
 * @desc    Update a post
 * @access  Private (Owner only)
 */
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check ownership
    if (post.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this post'
      });
    }

    // Update fields
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;

    await post.save();

    // Fetch updated post with author info
    const updatedPost = await Post.findByPk(id, {
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
      message: 'Post updated successfully',
      data: {
        post: updatedPost
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a post
 * @access  Private (Owner only)
 */
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check ownership
    if (post.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post'
      });
    }

    await post.destroy();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/posts/user/:userId
 * @desc    Get posts by user ID
 * @access  Public
 */
const getPostsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Check if user exists
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'fullName']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { count, rows: posts } = await Post.findAndCountAll({
      where: { userId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName']
        },
        {
          model: Comment,
          as: 'comments',
          attributes: ['id']
        },
        {
          model: Like,
          as: 'likes',
          attributes: ['id']
        }
      ]
    });

    // Add counts to each post
    const postsWithCounts = posts.map(post => {
      const postJson = post.toJSON();
      return {
        ...postJson,
        commentsCount: postJson.comments.length,
        likesCount: postJson.likes.length,
        comments: undefined,
        likes: undefined
      };
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        posts: postsWithCounts,
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

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByUser
};
