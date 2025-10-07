# Quick Start Guide

Get your Social Media Backend API up and running in 5 minutes!

## Prerequisites

- Node.js (v14 or higher) - [Download here](https://nodejs.org/)
- PostgreSQL (v12 or higher) - [Setup guide](./docs/DATABASE_SETUP.md)
- Git - [Download here](https://git-scm.com/)

## Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd express-postgres-api
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- Express.js (web framework)
- Sequelize (ORM)
- PostgreSQL driver
- JWT for authentication
- bcrypt for password hashing
- And more...

## Step 3: Set Up PostgreSQL Database

### Option A: Using PostgreSQL (Windows)

```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE social_media_db;

# Exit
\q
```

### Option B: Using Docker (All Platforms)

```bash
docker run --name postgres-social-media \
  -e POSTGRES_DB=social_media_db \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15-alpine
```

📖 **Need help?** See [DATABASE_SETUP.md](./docs/DATABASE_SETUP.md)

## Step 4: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Update the values in `.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=social_media_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

⚠️ **Important**: Change `JWT_SECRET` to a strong random string!

```bash
# Generate a random secret (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 5: Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

You should see:

```
✅ Database connection established successfully.
✅ Database synchronized successfully.
🚀 ============================================
🚀 Server is running on port 3000
🚀 Environment: development
🚀 API URL: http://localhost:3000
🚀 ============================================
```

## Step 6: Test the API

### Health Check

```bash
curl http://localhost:3000
```

Expected response:
```json
{
  "success": true,
  "message": "Social Media API is running",
  "version": "1.0.0"
}
```

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"testuser\",
    \"email\": \"test@example.com\",
    \"password\": \"Test123!\",
    \"fullName\": \"Test User\"
  }"
```

You'll receive a JWT token in the response. Copy it for the next steps!

### Create a Post

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"My First Post\",
    \"content\": \"This is my first post on the social media platform!\"
  }"
```

### Get All Posts

```bash
curl http://localhost:3000/api/posts
```

## What's Next?

### 🎯 Learn the API

- 📚 [API Documentation](./docs/api-docs.yaml)
- 🧪 [API Testing Guide](./docs/API_TESTING.md)
- 📖 [Complete README](./README.md)

### 🚀 Deploy Your API

Ready to deploy? Check out:
- [Deployment Guide](./docs/DEPLOYMENT.md)

### 🛠 Development Tips

1. **Use a REST Client**
   - Install [Thunder Client](https://www.thunderclient.com/) (VS Code extension)
   - Or use [Postman](https://www.postman.com/)

2. **View Database**
   - Install [pgAdmin](https://www.pgadmin.org/)
   - Or use [DBeaver](https://dbeaver.io/)

3. **Monitor Logs**
   ```bash
   # Watch logs in development
   npm run dev
   
   # Or use nodemon directly
   npx nodemon src/server.js
   ```

## Common Issues

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error

1. Check if PostgreSQL is running
2. Verify credentials in `.env`
3. Ensure database exists
4. Check firewall settings

### Cannot Find Module Error

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Quick Reference

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/posts` | Get all posts |
| POST | `/api/posts` | Create post (auth) |
| GET | `/api/posts/:id` | Get single post |
| PUT | `/api/posts/:id` | Update post (auth) |
| DELETE | `/api/posts/:id` | Delete post (auth) |
| GET | `/api/comments/post/:postId` | Get comments |
| POST | `/api/comments/post/:postId` | Add comment (auth) |
| POST | `/api/likes/post/:postId` | Like post (auth) |
| DELETE | `/api/likes/post/:postId` | Unlike post (auth) |

### Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server (auto-reload)
npm test           # Run tests (when implemented)
```

## Need Help?

- 📖 Check the [full README](./README.md)
- 🔍 Search [GitHub Issues](../../issues)
- 💬 Ask for help in discussions

## Success! 🎉

You're now running a complete social media backend with:
- ✅ User authentication (JWT)
- ✅ Post management (CRUD)
- ✅ Comments system
- ✅ Likes functionality
- ✅ Input validation
- ✅ Error handling
- ✅ Security features
- ✅ Rate limiting

Happy coding! 🚀
