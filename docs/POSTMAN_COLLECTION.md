# Postman Collection for Social Media API

## Import Instructions

1. Open Postman
2. Click "Import" button
3. Select "Raw text"
4. Paste the JSON below
5. Click "Import"

## Collection JSON

```json
{
  "info": {
    "name": "Social Media Backend API",
    "description": "Complete API collection for testing Social Media Backend",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000",
      "type": "string"
    },
    {
      "key": "token",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register User",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 201) {",
                  "    var jsonData = pm.response.json();",
                  "    pm.environment.set('token', jsonData.data.token);",
                  "    pm.collectionVariables.set('token', jsonData.data.token);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"johndoe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"SecurePass123!\",\n  \"fullName\": \"John Doe\",\n  \"bio\": \"Software developer and tech enthusiast\"\n}",
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
        },
        {
          "name": "Login",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    var jsonData = pm.response.json();",
                  "    pm.environment.set('token', jsonData.data.token);",
                  "    pm.collectionVariables.set('token', jsonData.data.token);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"SecurePass123!\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/auth/login",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "login"]
            }
          }
        },
        {
          "name": "Get Current User",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/auth/me",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "me"]
            }
          }
        }
      ]
    },
    {
      "name": "Posts",
      "item": [
        {
          "name": "Get All Posts",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/posts?page=1&limit=10",
              "host": ["{{base_url}}"],
              "path": ["api", "posts"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "10"
                }
              ]
            }
          }
        },
        {
          "name": "Get Single Post",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/posts/1",
              "host": ["{{base_url}}"],
              "path": ["api", "posts", "1"]
            }
          }
        },
        {
          "name": "Create Post",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"My First Post\",\n  \"content\": \"This is the content of my first post. It's about building amazing APIs!\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/posts",
              "host": ["{{base_url}}"],
              "path": ["api", "posts"]
            }
          }
        },
        {
          "name": "Update Post",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "PUT",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Updated Post Title\",\n  \"content\": \"Updated content here\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/posts/1",
              "host": ["{{base_url}}"],
              "path": ["api", "posts", "1"]
            }
          }
        },
        {
          "name": "Delete Post",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/posts/1",
              "host": ["{{base_url}}"],
              "path": ["api", "posts", "1"]
            }
          }
        }
      ]
    },
    {
      "name": "Comments",
      "item": [
        {
          "name": "Get Post Comments",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/comments/post/1",
              "host": ["{{base_url}}"],
              "path": ["api", "comments", "post", "1"]
            }
          }
        },
        {
          "name": "Add Comment",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"content\": \"Great post! Really enjoyed reading it.\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/comments/post/1",
              "host": ["{{base_url}}"],
              "path": ["api", "comments", "post", "1"]
            }
          }
        },
        {
          "name": "Update Comment",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "PUT",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"content\": \"Updated comment text\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/comments/1",
              "host": ["{{base_url}}"],
              "path": ["api", "comments", "1"]
            }
          }
        }
      ]
    },
    {
      "name": "Likes",
      "item": [
        {
          "name": "Like Post",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "POST",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/likes/post/1",
              "host": ["{{base_url}}"],
              "path": ["api", "likes", "post", "1"]
            }
          }
        },
        {
          "name": "Unlike Post",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/likes/post/1",
              "host": ["{{base_url}}"],
              "path": ["api", "likes", "post", "1"]
            }
          }
        },
        {
          "name": "Get Post Likes",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/likes/post/1",
              "host": ["{{base_url}}"],
              "path": ["api", "likes", "post", "1"]
            }
          }
        }
      ]
    }
  ]
}
```

## Usage Tips

1. **Set Base URL**
   - Collection variable `base_url` defaults to `http://localhost:3000`
   - Change for production: `https://your-api.com`

2. **Authentication**
   - Register or Login automatically saves token
   - Token is used in all protected endpoints

3. **Testing Flow**
   - Run "Register User" or "Login"
   - Token is automatically saved
   - All authenticated requests will use this token

4. **Variables**
   - `{{base_url}}` - API base URL
   - `{{token}}` - JWT authentication token

## Alternative: cURL Commands

If you prefer command line, see [API_TESTING.md](./API_TESTING.md)
