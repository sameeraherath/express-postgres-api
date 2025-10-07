# Social Media Backend API

A comprehensive social media backend built with Node.js, Express, and PostgreSQL featuring user authentication, posts, comments, and likes functionality.

## Features

- 🔐 **User Authentication** - JWT-based authentication with secure password hashing
- 📝 **Post Management** - Full CRUD operations for posts
- 💬 **Comments** - Users can comment on posts
- ❤️ **Likes** - Like and unlike posts
- 🛡️ **Security** - Rate limiting, input validation, and sanitization
- 📊 **Pagination** - Efficient data retrieval with pagination support
- 📚 **API Documentation** - OpenAPI/Swagger documentation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Security**: helmet, express-rate-limit

## Project Structure

```
express-postgres-api/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── models/
│   │   ├── index.js             # Model associations
│   │   ├── User.js              # User model
│   │   ├── Post.js              # Post model
│   │   ├── Comment.js           # Comment model
│   │   └── Like.js              # Like model
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── postController.js    # Post CRUD operations
│   │   ├── commentController.js # Comment operations
│   │   └── likeController.js    # Like operations
│   ├── middlewares/
│   │   ├── auth.js              # JWT authentication middleware
│   │   ├── validate.js          # Input validation middleware
│   │   └── errorHandler.js      # Centralized error handling
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication routes
│   │   ├── postRoutes.js        # Post routes
│   │   ├── commentRoutes.js     # Comment routes
│   │   └── likeRoutes.js        # Like routes
│   ├── utils/
│   │   └── helpers.js           # Helper functions
│   ├── app.js                   # Express app configuration
│   └── server.js                # Server entry point
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore file
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd express-postgres-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**

   - Install PostgreSQL if not already installed
   - Create a database named `social_media_db`

   ```sql
   CREATE DATABASE social_media_db;
   ```

4. **Configure environment variables**

   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

   ```bash
   cp .env.example .env
   ```

5. **Start the server**

   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

| Method | Endpoint             | Description         | Auth Required |
| ------ | -------------------- | ------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new user | No            |
| POST   | `/api/auth/login`    | Login user          | No            |
| GET    | `/api/auth/me`       | Get current user    | Yes           |

### Posts

| Method | Endpoint                  | Description               | Auth Required |
| ------ | ------------------------- | ------------------------- | ------------- |
| GET    | `/api/posts`              | Get all posts (paginated) | No            |
| GET    | `/api/posts/:id`          | Get single post           | No            |
| POST   | `/api/posts`              | Create a new post         | Yes           |
| PUT    | `/api/posts/:id`          | Update a post             | Yes (Owner)   |
| DELETE | `/api/posts/:id`          | Delete a post             | Yes (Owner)   |
| GET    | `/api/posts/user/:userId` | Get user's posts          | No            |

### Comments

| Method | Endpoint                     | Description         | Auth Required |
| ------ | ---------------------------- | ------------------- | ------------- |
| GET    | `/api/comments/post/:postId` | Get post comments   | No            |
| POST   | `/api/comments/post/:postId` | Add comment to post | Yes           |
| PUT    | `/api/comments/:id`          | Update a comment    | Yes (Owner)   |
| DELETE | `/api/comments/:id`          | Delete a comment    | Yes (Owner)   |

### Likes

| Method | Endpoint                  | Description          | Auth Required |
| ------ | ------------------------- | -------------------- | ------------- |
| POST   | `/api/likes/post/:postId` | Like a post          | Yes           |
| DELETE | `/api/likes/post/:postId` | Unlike a post        | Yes           |
| GET    | `/api/likes/post/:postId` | Get post likes count | No            |

## API Usage Examples

### Register a User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Create a Post

```bash
POST /api/posts
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "My First Post",
  "content": "This is the content of my first post!"
}
```

### Add a Comment

```bash
POST /api/comments/post/1
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "content": "Great post!"
}
```

### Like a Post

```bash
POST /api/likes/post/1
Authorization: Bearer <your-jwt-token>
```

## Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [] // Optional array of validation errors
}
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: express-validator for all inputs
- **Rate Limiting**: Prevents brute force attacks
- **Helmet**: Security headers
- **CORS**: Configurable cross-origin resource sharing
- **SQL Injection Prevention**: Sequelize ORM parameterized queries

## Database Schema

### Users

- id (Primary Key)
- username (Unique)
- email (Unique)
- password (Hashed)
- fullName
- bio (Optional)
- timestamps

### Posts

- id (Primary Key)
- title
- content
- userId (Foreign Key → Users)
- timestamps

### Comments

- id (Primary Key)
- content
- userId (Foreign Key → Users)
- postId (Foreign Key → Posts)
- timestamps

### Likes

- id (Primary Key)
- userId (Foreign Key → Users)
- postId (Foreign Key → Posts)
- timestamps
- Unique constraint on (userId, postId)

## Environment Variables

| Variable                | Description             | Default         |
| ----------------------- | ----------------------- | --------------- |
| PORT                    | Server port             | 3000            |
| NODE_ENV                | Environment mode        | development     |
| DB_HOST                 | Database host           | localhost       |
| DB_PORT                 | Database port           | 5432            |
| DB_NAME                 | Database name           | social_media_db |
| DB_USER                 | Database user           | postgres        |
| DB_PASSWORD             | Database password       | -               |
| JWT_SECRET              | JWT secret key          | -               |
| JWT_EXPIRE              | JWT expiration time     | 7d              |
| RATE_LIMIT_WINDOW_MS    | Rate limit window       | 900000          |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100             |

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Commit Message Convention

This project follows conventional commit messages:

- `feat:` - New features
- `fix:` - Bug fixes
- `refactor:` - Code refactoring
- `docs:` - Documentation updates
- `style:` - Code style changes
- `test:` - Test additions/updates
- `chore:` - Build/tooling changes

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## Support

For issues and questions, please open an issue in the repository.
