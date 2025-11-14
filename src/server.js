require("dotenv").config();
const app = require("./app");
const { testConnection } = require("./config/database");
const { syncDatabase } = require("./models");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test DB connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error("Failed to connect to database.");
      process.exit(1);
    }

    // Sync DB models
    await syncDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Server start error:", error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

startServer();
