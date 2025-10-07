# API Testing Guide

This guide provides examples for testing all API endpoints using various tools.

## Prerequisites

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL Database**
   ```sql
   CREATE DATABASE social_media_db;
   ```

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update database credentials

4. **Start the Server**
   ```bash
   npm run dev
   ```

## Testing Tools

You can use any of the following:
- **cURL** (command line)
- **Postman** (GUI)
- **Thunder Client** (VS Code extension)
- **REST Client** (VS Code extension)

---

## Authentication Endpoints

### 1. Register User

**cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"johndoe\",
    \"email\": \"john@example.com\",
    \"password\": \"SecurePass123!\",
    \"fullName\": \"John Doe\",
    \"bio\": \"Software developer\"
  }"
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "bio": "Software developer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

**cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"john@example.com\",
    \"password\": \"SecurePass123!\"
  }"
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Current User

**cURL:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Post Endpoints

### 1. Get All Posts

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/posts?page=1&limit=10"
```

### 2. Get Single Post

**cURL:**
```bash
curl -X GET http://localhost:3000/api/posts/1
```

### 3. Create Post

**cURL:**
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"My First Post\",
    \"content\": \"This is the content of my first post. It's great!\"
  }"
```

### 4. Update Post

**cURL:**
```bash
curl -X PUT http://localhost:3000/api/posts/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Updated Title\",
    \"content\": \"Updated content\"
  }"
```

### 5. Delete Post

**cURL:**
```bash
curl -X DELETE http://localhost:3000/api/posts/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Get User's Posts

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/posts/user/1?page=1&limit=10"
```

---

## Comment Endpoints

### 1. Get Post Comments

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/comments/post/1?page=1&limit=20"
```

### 2. Add Comment

**cURL:**
```bash
curl -X POST http://localhost:3000/api/comments/post/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{
    \"content\": \"Great post! Really enjoyed reading it.\"
  }"
```

### 3. Update Comment

**cURL:**
```bash
curl -X PUT http://localhost:3000/api/comments/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{
    \"content\": \"Updated comment text\"
  }"
```

### 4. Delete Comment

**cURL:**
```bash
curl -X DELETE http://localhost:3000/api/comments/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Like Endpoints

### 1. Like Post

**cURL:**
```bash
curl -X POST http://localhost:3000/api/likes/post/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 2. Unlike Post

**cURL:**
```bash
curl -X DELETE http://localhost:3000/api/likes/post/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Get Post Likes

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/likes/post/1?page=1&limit=20"
```

### 4. Get User Likes

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/likes/user/1?page=1&limit=10"
```

---

## Postman Collection

### Import into Postman

1. Create a new collection
2. Add environment variables:
   - `base_url`: `http://localhost:3000`
   - `token`: (will be set after login)

3. For authenticated requests, add this to Headers:
   ```
   Authorization: Bearer {{token}}
   ```

### Sample Postman Request

```json
{
  "info": {
    "name": "Social Media API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"johndoe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"SecurePass123!\",\n  \"fullName\": \"John Doe\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/auth/register",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "register"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## Testing Workflow

### Complete User Flow Example

```bash
# 1. Register a user
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test123!","fullName":"Test User"}' \
  | jq -r '.data.token')

echo "Token: $TOKEN"

# 2. Create a post
POST_ID=$(curl -s -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Post","content":"This is a test post content"}' \
  | jq -r '.data.post.id')

echo "Post ID: $POST_ID"

# 3. Add a comment
curl -X POST http://localhost:3000/api/comments/post/$POST_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Great post!"}'

# 4. Like the post
curl -X POST http://localhost:3000/api/likes/post/$POST_ID \
  -H "Authorization: Bearer $TOKEN"

# 5. Get the post with all data
curl -X GET http://localhost:3000/api/posts/$POST_ID
```

---

## Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Must be a valid email address",
      "value": "invalid-email"
    }
  ]
}
```

### Authentication Error
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Authorization Error
```json
{
  "success": false,
  "message": "You are not authorized to update this post"
}
```

### Not Found Error
```json
{
  "success": false,
  "message": "Post not found"
}
```

---

## Rate Limiting

The API implements rate limiting:
- **Window**: 15 minutes
- **Max Requests**: 100 per IP

If you exceed the limit:
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

---

## Tips

1. **Save your token** after login/register for authenticated requests
2. **Use environment variables** in Postman for easier testing
3. **Check response status codes**:
   - 200: Success
   - 201: Created
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 500: Server Error

4. **Pagination**: Always use page and limit parameters for large datasets
5. **Token expiry**: Tokens expire after 7 days (configurable in .env)
