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

## License
Private project - all rights reserved
