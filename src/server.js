require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/database');
const { syncDatabase } = require('./models');

const PORT = process.env.PORT || 3000;

/**
 * Start server
 */
const startServer = async () => {
  try {
    // Test database connection
    console.log('🔄 Testing database connection...');
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error('❌ Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Sync database models
    console.log('🔄 Synchronizing database models...');
    await syncDatabase();

    // Start Express server
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 ============================================');
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🚀 API URL: http://localhost:${PORT}`);
      console.log('🚀 ============================================');
      console.log('');
      console.log('📚 Available endpoints:');
      console.log('   GET    /                          - Health check');
      console.log('   POST   /api/auth/register         - Register user');
      console.log('   POST   /api/auth/login            - Login user');
      console.log('   GET    /api/auth/me               - Get current user');
      console.log('   PUT    /api/auth/profile          - Update profile');
      console.log('   PUT    /api/auth/password         - Change password');
      console.log('   GET    /api/posts                 - Get all posts');
      console.log('   GET    /api/posts/:id             - Get single post');
      console.log('   POST   /api/posts                 - Create post');
      console.log('   PUT    /api/posts/:id             - Update post');
      console.log('   DELETE /api/posts/:id             - Delete post');
      console.log('   GET    /api/posts/user/:userId    - Get user posts');
      console.log('   GET    /api/comments/post/:postId - Get post comments');
      console.log('   POST   /api/comments/post/:postId - Create comment');
      console.log('   PUT    /api/comments/:id          - Update comment');
      console.log('   DELETE /api/comments/:id          - Delete comment');
      console.log('   POST   /api/likes/post/:postId    - Like post');
      console.log('   DELETE /api/likes/post/:postId    - Unlike post');
      console.log('   GET    /api/likes/post/:postId    - Get post likes');
      console.log('   GET    /api/likes/user/:userId    - Get user likes');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  console.error('🔄 Shutting down server...');
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  console.error('🔄 Shutting down server...');
  process.exit(1);
});

// Start the server
startServer();
