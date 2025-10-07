# Deployment Guide

This guide covers deploying your Social Media Backend API to various platforms.

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Error handling implemented
- [ ] API documentation complete
- [ ] Git repository clean

## Platform-Specific Guides

### 1. Heroku Deployment

#### Prerequisites

```bash
# Install Heroku CLI
# Windows (Chocolatey)
choco install heroku-cli

# macOS
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

#### Steps

1. **Login to Heroku**

   ```bash
   heroku login
   ```

2. **Create Heroku App**

   ```bash
   heroku create your-app-name
   ```

3. **Add PostgreSQL**

   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set Environment Variables**

   ```bash
   heroku config:set JWT_SECRET=your_jwt_secret_here
   heroku config:set NODE_ENV=production
   ```

5. **Create Procfile**

   ```
   web: node src/server.js
   ```

6. **Deploy**

   ```bash
   git push heroku main
   ```

7. **Open App**
   ```bash
   heroku open
   heroku logs --tail
   ```

#### Database URL Configuration

Heroku automatically sets `DATABASE_URL`. Update `src/config/database.js`:

```javascript
// Add this at the top
if (process.env.DATABASE_URL) {
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
}
```

---

### 2. Railway Deployment

#### Steps

1. **Sign Up**

   - Visit https://railway.app
   - Sign in with GitHub

2. **Create Project**

   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Add PostgreSQL**

   - Click "New"
   - Select "Database"
   - Choose "PostgreSQL"

4. **Configure Environment Variables**

   - Go to your service
   - Click "Variables"
   - Add:
     - `JWT_SECRET`
     - `NODE_ENV=production`
   - Railway auto-configures database variables

5. **Deploy**
   - Railway automatically deploys on push
   - View logs in dashboard

---

### 3. Render Deployment

#### Steps

1. **Sign Up**

   - Visit https://render.com
   - Sign up with GitHub

2. **Create Web Service**

   - Click "New +"
   - Select "Web Service"
   - Connect your repository

3. **Configure Service**

   ```
   Name: social-media-api
   Environment: Node
   Build Command: npm install
   Start Command: node src/server.js
   ```

4. **Create PostgreSQL Database**

   - Click "New +"
   - Select "PostgreSQL"
   - Note the Internal Database URL

5. **Environment Variables**

   - Add environment variables:
     - `DATABASE_URL` (from PostgreSQL)
     - `JWT_SECRET`
     - `NODE_ENV=production`

6. **Deploy**
   - Click "Create Web Service"
   - Render automatically deploys

---

### 4. DigitalOcean App Platform

#### Steps

1. **Create Account**

   - Visit https://www.digitalocean.com
   - Sign up and create account

2. **Create App**

   - Go to Apps
   - Click "Create App"
   - Connect GitHub repository

3. **Add Database**

   - Click "Add Resource"
   - Select "Database"
   - Choose PostgreSQL

4. **Configure App**

   ```
   Name: social-media-api
   Source: GitHub repository
   Build Command: npm install
   Run Command: node src/server.js
   ```

5. **Environment Variables**

   - Add variables:
     - `JWT_SECRET`
     - `NODE_ENV=production`
   - Database URL is auto-configured

6. **Deploy**
   - Click "Create Resources"
   - Wait for deployment

---

### 5. AWS (EC2 + RDS)

#### Prerequisites

```bash
# Install AWS CLI
# Windows (MSI Installer)
# Download from: https://aws.amazon.com/cli/

# macOS
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

#### Steps

1. **Create RDS PostgreSQL Instance**

   - Go to AWS Console > RDS
   - Create database
   - Choose PostgreSQL
   - Configure instance size
   - Set master username/password
   - Note the endpoint

2. **Create EC2 Instance**

   - Go to EC2 Dashboard
   - Launch instance
   - Choose Ubuntu Server
   - Configure security group:
     - Port 22 (SSH)
     - Port 3000 (API)
     - Port 5432 (PostgreSQL - from EC2 only)

3. **Connect to EC2**

   ```bash
   ssh -i "your-key.pem" ubuntu@your-ec2-ip
   ```

4. **Setup Server**

   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PM2
   sudo npm install -g pm2

   # Clone repository
   git clone https://github.com/yourusername/express-postgres-api.git
   cd express-postgres-api

   # Install dependencies
   npm install

   # Create .env file
   nano .env
   # Add your environment variables

   # Start with PM2
   pm2 start src/server.js --name social-media-api
   pm2 startup
   pm2 save
   ```

5. **Configure Nginx (Optional)**

   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/api
   ```

   Add configuration:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:

   ```bash
   sudo ln -s /etc/nginx/sites-available/api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

### 6. Docker Deployment

#### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
```

#### Create .dockerignore

```
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
.vscode
```

#### Create docker-compose.yml

```yaml
version: "3.8"

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=social_media_db
      - DB_USER=postgres
      - DB_PASSWORD=postgres
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=social_media_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

#### Deploy

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Environment Variables for Production

Create a `.env.production` file:

```env
NODE_ENV=production
PORT=3000

# Database (use your production DB)
DB_HOST=your-production-db-host
DB_PORT=5432
DB_NAME=social_media_db
DB_USER=your_db_user
DB_PASSWORD=your_secure_password

# JWT (generate strong secret)
JWT_SECRET=your_very_strong_jwt_secret_min_32_chars
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Security Best Practices

1. **Environment Variables**

   - Never commit `.env` file
   - Use strong JWT secret (min 32 characters)
   - Rotate secrets regularly

2. **Database**

   - Use SSL/TLS for database connections
   - Restrict database access by IP
   - Regular backups
   - Strong passwords

3. **API**

   - Enable HELMET security headers
   - Implement rate limiting
   - Input validation on all endpoints
   - HTTPS only in production

4. **Monitoring**
   - Set up error logging (Sentry, LogRocket)
   - Monitor API performance
   - Track rate limit violations
   - Database query monitoring

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.14
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
```

## Health Checks

Add health check endpoint (already included):

```javascript
// GET /
{
  "success": true,
  "message": "Social Media API is running",
  "version": "1.0.0",
  "timestamp": "2025-10-07T..."
}
```

## Performance Optimization

1. **Database**

   - Add indexes on foreign keys
   - Use connection pooling
   - Optimize queries

2. **Caching**

   - Implement Redis for session storage
   - Cache frequently accessed data
   - Use ETags for API responses

3. **Scaling**
   - Horizontal scaling with load balancer
   - Database read replicas
   - CDN for static assets

## Monitoring Tools

- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, Rollbar
- **Performance**: New Relic, DataDog
- **Logs**: Papertrail, Loggly

## Post-Deployment

1. ✅ Test all endpoints
2. ✅ Verify database connectivity
3. ✅ Check error logging
4. ✅ Monitor performance
5. ✅ Set up alerts
6. ✅ Document API URL
7. ✅ Share with team

## Rollback Strategy

```bash
# Heroku
heroku rollback

# Railway/Render
# Use dashboard to redeploy previous version

# AWS/EC2
git reset --hard HEAD~1
pm2 restart all
```

## Support

For deployment issues:

1. Check platform status pages
2. Review deployment logs
3. Verify environment variables
4. Test database connectivity
5. Check security group/firewall rules

---

**Note**: Always test in staging environment before deploying to production!
