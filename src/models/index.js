const { sequelize } = require("../config/database");
const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");
const Like = require("./Like");

// Define associations

// User associations
User.hasMany(Post, {
  foreignKey: "userId",
  as: "posts",
  onDelete: "CASCADE",
});

User.hasMany(Comment, {
  foreignKey: "userId",
  as: "comments",
  onDelete: "CASCADE",
});

User.hasMany(Like, {
  foreignKey: "userId",
  as: "likes",
  onDelete: "CASCADE",
});

// Post associations
Post.belongsTo(User, {
  foreignKey: "userId",
  as: "author",
});

Post.hasMany(Comment, {
  foreignKey: "postId",
  as: "comments",
  onDelete: "CASCADE",
});

Post.hasMany(Like, {
  foreignKey: "postId",
  as: "likes",
  onDelete: "CASCADE",
});

// Comment associations
Comment.belongsTo(User, {
  foreignKey: "userId",
  as: "author",
});

Comment.belongsTo(Post, {
  foreignKey: "postId",
  as: "post",
});

// Like associations
Like.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Like.belongsTo(Post, {
  foreignKey: "postId",
  as: "post",
});

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log("✅ Database synchronized successfully.");
  } catch (error) {
    console.error("❌ Error synchronizing database:", error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Post,
  Comment,
  Like,
  syncDatabase,
};
