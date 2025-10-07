# Database Setup Guide

This guide will help you set up PostgreSQL for the Social Media Backend API.

## Option 1: Local PostgreSQL Installation

### Windows

1. **Download PostgreSQL**

   - Visit https://www.postgresql.org/download/windows/
   - Download the latest version
   - Run the installer

2. **Installation Steps**

   - Choose installation directory
   - Select components (PostgreSQL Server, pgAdmin, Command Line Tools)
   - Set data directory
   - Set password for postgres user (remember this!)
   - Set port (default: 5432)
   - Complete installation

3. **Create Database**

   ```powershell
   # Open PowerShell or Command Prompt
   # Navigate to PostgreSQL bin directory
   cd "C:\Program Files\PostgreSQL\15\bin"

   # Connect to PostgreSQL
   .\psql -U postgres

   # Enter your password when prompted

   # Create database
   CREATE DATABASE social_media_db;

   # Verify database creation
   \l

   # Exit
   \q
   ```

### macOS

1. **Install with Homebrew**

   ```bash
   # Install Homebrew if not installed
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

   # Install PostgreSQL
   brew install postgresql@15

   # Start PostgreSQL service
   brew services start postgresql@15
   ```

2. **Create Database**

   ```bash
   # Connect to PostgreSQL
   psql postgres

   # Create database
   CREATE DATABASE social_media_db;

   # Verify
   \l

   # Exit
   \q
   ```

### Linux (Ubuntu/Debian)

1. **Install PostgreSQL**

   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib

   # Start PostgreSQL service
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

2. **Create Database**

   ```bash
   # Switch to postgres user
   sudo -u postgres psql

   # Create database
   CREATE DATABASE social_media_db;

   # Create a user (optional)
   CREATE USER myuser WITH PASSWORD 'mypassword';

   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE social_media_db TO myuser;

   # Exit
   \q
   ```

## Option 2: Docker PostgreSQL

### Using Docker

1. **Create docker-compose.yml**

   ```yaml
   version: "3.8"

   services:
     postgres:
       image: postgres:15-alpine
       container_name: social_media_db
       environment:
         POSTGRES_DB: social_media_db
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: postgres
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data
       restart: unless-stopped

   volumes:
     postgres_data:
   ```

2. **Start Container**

   ```bash
   docker-compose up -d
   ```

3. **Verify**
   ```bash
   docker-compose ps
   docker exec -it social_media_db psql -U postgres -d social_media_db
   ```

## Option 3: Cloud PostgreSQL

### Heroku Postgres

1. **Create Heroku Account**

   - Visit https://heroku.com
   - Sign up for free account

2. **Install Heroku CLI**

   ```bash
   # Windows (using Chocolatey)
   choco install heroku-cli

   # macOS
   brew tap heroku/brew && brew install heroku

   # Linux
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

3. **Create Database**
   ```bash
   heroku login
   heroku addons:create heroku-postgresql:mini -a your-app-name
   heroku config:get DATABASE_URL -a your-app-name
   ```

### Railway

1. **Create Account**

   - Visit https://railway.app
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - Click "New Project"
   - Select "Provision PostgreSQL"
   - Copy connection details

### Supabase

1. **Create Account**

   - Visit https://supabase.com
   - Sign up for free

2. **Create Project**
   - Create new project
   - Set database password
   - Wait for project setup
   - Get connection string from Settings > Database

### ElephantSQL

1. **Create Account**

   - Visit https://www.elephantsql.com
   - Sign up for free

2. **Create Instance**
   - Create new instance
   - Select free plan
   - Choose region
   - Get connection URL

## Configuration

### Update .env File

After setting up PostgreSQL, update your `.env` file:

```env
# For Local PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=social_media_db
DB_USER=postgres
DB_PASSWORD=your_password

# For Docker
DB_HOST=localhost
DB_PORT=5432
DB_NAME=social_media_db
DB_USER=postgres
DB_PASSWORD=postgres

# For Cloud (using connection string)
# Parse the DATABASE_URL if needed
# postgres://user:password@host:port/database
```

## Verify Connection

Run the following to test database connection:

```bash
npm run dev
```

You should see:

```
✅ Database connection established successfully.
✅ Database synchronized successfully.
```

## Database Tables

The application will automatically create these tables:

1. **users**

   - id, username, email, password, fullName, bio
   - timestamps (createdAt, updatedAt)

2. **posts**

   - id, title, content, userId
   - timestamps (createdAt, updatedAt)

3. **comments**

   - id, content, userId, postId
   - timestamps (createdAt, updatedAt)

4. **likes**
   - id, userId, postId
   - timestamps (createdAt, updatedAt)
   - Unique constraint on (userId, postId)

## Troubleshooting

### Connection Refused

```bash
# Check if PostgreSQL is running
# Windows
Get-Service -Name postgresql*

# macOS/Linux
sudo systemctl status postgresql
```

### Authentication Failed

- Verify username and password in .env
- Check pg_hba.conf for authentication method
- Ensure user has proper privileges

### Port Already in Use

```bash
# Check what's using port 5432
# Windows
netstat -ano | findstr :5432

# macOS/Linux
lsof -i :5432
```

### Database Doesn't Exist

```sql
-- Connect to PostgreSQL
psql -U postgres

-- List databases
\l

-- Create if missing
CREATE DATABASE social_media_db;
```

## Useful PostgreSQL Commands

```sql
-- List all databases
\l

-- Connect to database
\c social_media_db

-- List all tables
\dt

-- Describe table structure
\d users

-- View table data
SELECT * FROM users;

-- Count records
SELECT COUNT(*) FROM posts;

-- Drop database (careful!)
DROP DATABASE social_media_db;

-- Create new user
CREATE USER newuser WITH PASSWORD 'password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE social_media_db TO newuser;
```

## Backup and Restore

### Backup

```bash
# Backup entire database
pg_dump -U postgres -d social_media_db > backup.sql

# Backup with custom format
pg_dump -U postgres -F c -d social_media_db > backup.dump
```

### Restore

```bash
# Restore from SQL file
psql -U postgres -d social_media_db < backup.sql

# Restore from custom format
pg_restore -U postgres -d social_media_db backup.dump
```

## Next Steps

After setting up the database:

1. ✅ Verify connection
2. ✅ Start the server
3. ✅ Test API endpoints
4. ✅ Create your first user
5. ✅ Start building!

For API testing, see [API_TESTING.md](./API_TESTING.md)
