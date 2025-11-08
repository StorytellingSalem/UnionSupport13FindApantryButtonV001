# Food Pantry Finder - Production Deployment Guide

## Overview
This is a full-stack Node.js + React application for finding and managing food pantries. The app uses Express.js for the backend API, React for the frontend, and SQLite for persistent data storage.

## System Requirements

### Node.js & Runtime
- **Node.js**: 18.0.0 or higher (LTS recommended)
- **npm**: 9.0.0 or higher
- **Runtime Environment**: Linux, macOS, or Windows

### Database
- **SQLite**: 3.0+ (included with better-sqlite3)
- **Database Location**: `/data/database.sqlite`
- **Persistent Storage**: Volume mount required for `/data/` directory

<!-- For Future Upgrade use; uncomment this: -->
<!-- ### MySQL Database (Future Upgrade)
- **MySQL**: 5.7 or 8.0+
- **Database Host**: Configurable via environment variable
- **Database Port**: Default 3306
- **Driver**: mysql2 or mysql package -->

<!-- For Future Upgrade use; uncomment this: -->
<!-- ### Docker Requirements
- **Docker**: 20.10+
- **Docker Compose**: 1.29+
- **Container Runtime**: Linux kernel 4.4+ recommended -->


## Dependencies & Package.json

### Production Dependencies

#### Frontend UI Framework
- `react` - 18.2.0 - React library
- `react-dom` - 18.2.0 - React DOM rendering
- `react-router-dom` - 7.9.4 - Client-side routing

#### UI Components & Styling
- `@radix-ui/react-checkbox` - 1.1.3 - Checkbox component
- `@radix-ui/react-dialog` - 1.1.5 - Modal/Dialog component
- `@radix-ui/react-label` - 2.1.1 - Form label component
- `@radix-ui/react-popover` - 1.1.5 - Popover component
- `@radix-ui/react-progress` - 1.1.1 - Progress bar component
- `@radix-ui/react-radio-group` - 1.3.8 - Radio button component
- `@radix-ui/react-select` - 2.1.5 - Select dropdown component
- `@radix-ui/react-slider` - 1.2.2 - Slider component
- `@radix-ui/react-slot` - 1.1.1 - Slot utility for composition
- `@radix-ui/react-switch` - 1.1.2 - Toggle switch component
- `@radix-ui/react-toggle` - 1.1.1 - Toggle button component
- `@radix-ui/react-tooltip` - 1.1.7 - Tooltip component

#### Styling & CSS
- `tailwindcss` - 3.4.17 - Utility-first CSS framework (devDependency)
- `tailwind-merge` - 3.2.0 - Merge Tailwind classes intelligently
- `tailwindcss-animate` - 1.0.7 - Animation utilities for Tailwind
- `class-variance-authority` - 0.7.1 - CSS class management
- `clsx` - 2.1.1 - Conditional CSS class names

#### Maps & Location
- `leaflet` - 1.9.4 - JavaScript mapping library
- `react-leaflet` - 4.2.1 - React bindings for Leaflet (compatible with React 18)
- `@types/leaflet` - 1.9.21 - TypeScript types for Leaflet

#### Backend & Server
- `express` - 5.1.0 - HTTP server framework
- `@types/express` - 5.0.0 - TypeScript types for Express (devDependency)

#### Database
- `kysely` - 0.28.8 - Type-safe SQL query builder
- `better-sqlite3` - 12.4.1 - SQLite database driver
- `@types/better-sqlite3` - 7.6.13 - TypeScript types for better-sqlite3

#### Utilities
- `lucide-react` - 0.474.0 - Icon library for React
- `react-day-picker` - 9.9.0 - Calendar component
- `cmdk` - 1.1.1 - Command menu component
- `dotenv` - 16.4.7 - Environment variable loader

#### Build Tools (devDependencies)
- `vite` - 6.3.1 - Frontend build tool
- `@vitejs/plugin-react` - 4.3.4 - React plugin for Vite
- `typescript` - 5.8.2 - TypeScript compiler
- `tsx` - 4.19.3 - TypeScript execution for Node.js
- `esbuild` - 0.25.1 - JavaScript bundler
- `postcss` - 8.4.35 - CSS transformation (devDependency)
- `autoprefixer` - 10.4.18 - PostCSS plugin for vendor prefixes
- `@types/node` - 22.13.5 - TypeScript types for Node.js (devDependency)
- `@types/react` - 18.2.0 - TypeScript types for React (devDependency)
- `@types/react-dom` - 18.2.0 - TypeScript types for React DOM (devDependency)
- `ignore` - 7.0.3 - Ignore file parser

## Installation for Production

### 1. Clone Repository
```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build Application
```bash
npm run build
```

This will:
- Build the React frontend with Vite (`vite build`)
- Compile TypeScript backend (`tsc --project tsconfig.server.json`)

### 4. Prepare Data Directory
```bash
mkdir -p /home/app/data
chmod 755 /home/app/data
```

## Running in Production

### Environment Variables
Create a `.env` file in the root directory:
```
NODE_ENV=production
PORT=4000
DATA_DIRECTORY=/home/app/data/
```

### Start Application
```bash
# Development (with hot reload)
npm start

# Production (after build)
node dist/server/index.js
```

### Port Configuration
- **Development**: API on port 3001, frontend dev server on port 3000
- **Production**: Both API and static files on port 4000

## Database

### Location
- SQLite database: `/data/database.sqlite`
- Temporary files: `/data/database.sqlite-shm`, `/data/database.sqlite-wal`

### Backup Strategy
Backup the `/data/database.sqlite` file regularly. The SQLite database handles all data persistence.

### Migrations
Database schema migrations are managed via the application. Check `server/db.ts` and `server/types.ts` for current schema.

## Deployment Checklist

- [ ] Node.js 18+ installed on server
- [ ] npm dependencies installed (`npm install`)
- [ ] Application built (`npm run build`)
- [ ] `/data/` directory exists and is writable
- [ ] Environment variables configured
- [ ] PORT 4000 (or configured port) is accessible
- [ ] Reverse proxy configured (nginx/Apache) if behind load balancer
- [ ] SSL/TLS certificates configured
- [ ] Database backups scheduled
- [ ] Error logging configured
- [ ] Monitoring set up for process health

## Scripts

```json
{
  "build": "vite build && tsc --project tsconfig.server.json",
  "start": "tsx watch scripts/dev.ts"
}
```

- `npm run build` - Build frontend and compile backend
- `npm start` - Start development server with hot reload

## Docker Deployment (Optional)

To containerize this application:

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["node", "dist/server/index.js"]
```

## Technology Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Routing | React Router v7 |
| Styling | Tailwind CSS 3 |
| Components | shadcn/ui (Radix UI) |
| Maps | Leaflet + React Leaflet |
| Backend | Express 5 |
| Database | SQLite + Kysely |
| Type Safety | TypeScript 5 |

## Support & Troubleshooting

### Common Issues

**Port already in use**
```bash
# Change PORT environment variable
PORT=3002 npm start
```

**Database locked**
- Ensure no other processes are accessing the database
- Delete `.sqlite-shm` and `.sqlite-wal` files if corrupted

**Build fails**
- Clear cache: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`

<!-- For Future Upgrade use; uncomment this: -->
<!-- ## Docker Compose Configuration (Future Upgrade)

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "4000:4000"
    environment:
      NODE_ENV: production
      PORT: 4000
      DATA_DIRECTORY: /app/data/
    volumes:
      - app_data:/app/data/
    restart: unless-stopped

  # For MySQL integration (Future Upgrade)
  # mysql:
  #   image: mysql:8.0
  #   environment:
  #     MYSQL_ROOT_PASSWORD: root_password
  #     MYSQL_DATABASE: food_pantry_db
  #   volumes:
  #     - mysql_data:/var/lib/mysql
  #   ports:
  #     - "3306:3306"
  #   restart: unless-stopped

volumes:
  app_data:
    driver: local
  # mysql_data:
  #   driver: local
```

### Docker Volumes Explanation
- `app_data` - Persistent storage for SQLite database and uploads
- `mysql_data` - (Future) MySQL data directory for database persistence

### Running with Docker Compose
```bash
docker-compose up -d
docker-compose logs -f app
docker-compose down  # To stop
```

### Volume Management
```bash
# Backup data volume
docker run --rm -v app_data:/data -v $(pwd):/backup alpine tar czf /backup/app_data_backup.tar.gz -C /data .

# Restore data volume
docker run --rm -v app_data:/data -v $(pwd):/backup alpine tar xzf /backup/app_data_backup.tar.gz -C /data
``` -->

## Windows Development Setup with Docker & GitHub Deployment

### Prerequisites for Windows
1. **Install Git for Windows**
   - Download from https://git-scm.com/download/win
   - Select "Git Bash Here" during installation
   - Verify: Open PowerShell and run `git --version`

2. **Install Visual Studio Code**
   - Download from https://code.visualstudio.com/
   - Install the following extensions:
     - Remote - Containers (Microsoft)
     - Docker (Microsoft)
     - Git Graph (mhutchie)
     - ES7+ React/Redux/React-Native snippets

3. **Install Docker Desktop for Windows**
   - Download from https://www.docker.com/products/docker-desktop
   - Enable WSL 2 (Windows Subsystem for Linux 2) during setup
   - Restart computer after installation
   - Verify: Open PowerShell and run `docker --version`

### Step-by-Step Windows Development Workflow

#### Step 1: Clone Repository in VS Code
1. Open VS Code
2. Press `Ctrl + Shift + P` and type "Git: Clone"
3. Paste repository URL: `https://github.com/your-username/your-repo.git`
4. Select folder to clone into (e.g., `C:\Users\YourName\Projects\`)
5. Open the cloned folder in VS Code

#### Step 2: Open Git Bash Terminal
1. In VS Code, press `Ctrl + ~` to open terminal
2. Click the dropdown arrow in the terminal
3. Select "Git Bash" from the list
4. Terminal will now use Git Bash commands

#### Step 3: Install Node Dependencies
```bash
# In Git Bash terminal
npm install
```

#### Step 4: Create Environment File
1. Right-click in Explorer panel → New File
2. Name it `.env`
3. Add contents:
```
NODE_ENV=development
PORT=3001
DATA_DIRECTORY=./data/
```

#### Step 5: Create Dockerfile
1. Right-click in project root → New File
2. Name it `Dockerfile` (no extension)
3. Copy this content:
```dockerfile
# Build stage
FROM node:22-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine
WORKDIR /app
RUN npm install -g tsx

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY scripts ./scripts
COPY tsconfig.server.json ./

# Create data directory
RUN mkdir -p /app/data
VOLUME ["/app/data"]

EXPOSE 4000
ENV NODE_ENV=production
ENV PORT=4000
ENV DATA_DIRECTORY=/app/data/

CMD ["node", "dist/server/index.js"]
```

#### Step 6: Create .dockerignore File
1. Right-click in project root → New File
2. Name it `.dockerignore`
3. Add:
```
node_modules
npm-debug.log
dist
.git
.gitignore
README.md
.env.local
.DS_Store
data/database.sqlite*
```

#### Step 7: Create docker-compose.yml
1. Right-click in project root → New File
2. Name it `docker-compose.yml`
3. Copy this content:
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      NODE_ENV: production
      PORT: 4000
      DATA_DIRECTORY: /app/data/
    volumes:
      - app_data:/app/data/
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:4000/"]
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  app_data:
    driver: local
```

#### Step 8: Build Docker Image
1. In Git Bash terminal, run:
```bash
# Build the Docker image
docker build -t food-pantry-finder:latest .

# Verify image was created
docker images | grep food-pantry-finder
```

#### Step 9: Test Docker Container Locally
```bash
# Run container
docker run -d --name food-pantry-test -p 4000:4000 -v food-pantry-data:/app/data food-pantry-finder:latest

# Check if running
docker ps

# View logs
docker logs food-pantry-test

# Stop container
docker stop food-pantry-test

# Clean up
docker rm food-pantry-test
docker volume rm food-pantry-data
```

#### Step 10: Create .gitignore for GitHub
1. Right-click in project root → New File
2. Name it `.gitignore`
3. Add:
```
# Dependencies
node_modules/
package-lock.json

# Build outputs
dist/
build/

# Environment
.env
.env.local
.env.*.local

# Database
data/database.sqlite
data/database.sqlite-shm
data/database.sqlite-wal

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Docker
.dockerignore
docker-compose.override.yml

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

#### Step 11: Initialize & Configure Git Repository
```bash
# Initialize git (if not already done)
git init

# Configure your GitHub credentials (do this once)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Food Pantry Finder app with Docker setup"
```

#### Step 12: Create GitHub Repository
1. Go to https://github.com/new
2. Name: `food-pantry-finder`
3. Description: "Food pantry location finder application"
4. Choose Public or Private
5. Click "Create repository"
6. Copy the repository URL (HTTPS)

#### Step 13: Push to GitHub from Git Bash
```bash
# Add remote origin (replace URL with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/food-pantry-finder.git

# Rename branch to main if needed
git branch -M main

# Push to GitHub
git push -u origin main

# Verify push was successful
git log --oneline -5
```

#### Step 14: Create GitHub Actions for CI/CD (Optional)
1. Create folder structure: `.github/workflows/`
2. Right-click `.github/workflows` → New File
3. Name it `docker-build.yml`
4. Add:
```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Build Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: false
        tags: food-pantry-finder:latest
```

#### Step 15: Commit GitHub Actions
```bash
git add .github/
git commit -m "Add GitHub Actions CI/CD workflow"
git push
```

### Daily Development Workflow

**To start development:**
```bash
# Open Git Bash in VS Code (Ctrl + ~)
npm start
```

**To run with Docker locally:**
```bash
docker-compose up -d
# App will be available at http://localhost:4000
docker-compose logs -f app
```

**To push changes to GitHub:**
```bash
git add .
git commit -m "Description of changes"
git push
```

**To update Docker image after changes:**
```bash
docker-compose down
docker build -t food-pantry-finder:latest .
docker-compose up -d
```

### Useful Git Bash Commands

```bash
# Check git status
git status

# View commit history
git log --oneline -10

# Create new branch for feature
git checkout -b feature/new-feature-name

# Switch to existing branch
git checkout main

# Delete branch
git branch -d feature/old-feature-name

# Stash uncommitted changes
git stash

# Pull latest changes from GitHub
git pull origin main

# Amend last commit
git commit --amend --no-edit

# View diff of changes
git diff
```

### Docker Useful Commands

```bash
# List all containers
docker ps -a

# View container logs
docker logs container-name

# Stop all containers
docker stop $(docker ps -q)

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Access container shell
docker exec -it container-name sh

# Rebuild without cache
docker build --no-cache -t food-pantry-finder:latest .
```

### Troubleshooting on Windows

**Port 4000 already in use:**
```bash
# Find process using port
netstat -ano | findstr :4000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Docker daemon not running:**
- Open Docker Desktop application
- Wait for it to fully start
- Try command again

**Permission denied errors:**
- Run VS Code as Administrator
- Or use Windows Terminal with Admin privileges

**Git authentication issues:**
- Use GitHub Personal Access Token instead of password
- Generate token at https://github.com/settings/tokens
- Use token when prompted for password

**Large database file won't push:**
- Add to `.gitignore`: `data/database.sqlite*`
- Commit: `git commit -m "Remove database from git"`
- Use backup strategy instead (cloud storage, separate backup tool)

## License
Private project - all rights reserved
