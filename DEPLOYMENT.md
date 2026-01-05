# Deployment Guide

This guide covers different deployment options for the Inventory Management System.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ installed (for local development)
- PostgreSQL 16+ (if not using Docker)

## Local Development

### 1. Start the database

\`\`\`bash
npm run docker:up
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Run development server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## Production Deployment with Docker

### Option 1: Docker Compose (Recommended)

\`\`\`bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
\`\`\`

### Option 2: Manual Docker Build

\`\`\`bash
# Build the image
docker build -t inventory-app:latest .

# Run the container
docker run -d \\
  --name inventory-app \\
  -p 3000:3000 \\
  -e POSTGRES_HOST=your-db-host \\
  -e POSTGRES_USER=your-db-user \\
  -e POSTGRES_PASSWORD=your-db-password \\
  -e POSTGRES_DB=inventory_db \\
  inventory-app:latest
\`\`\`

## CI/CD Pipeline

The project includes GitHub Actions workflows for:

- **Continuous Integration**: Runs on every push and pull request
  - Linting
  - Building
  - Docker testing

- **Docker Publishing**: Builds and publishes Docker images to GitHub Container Registry
  - Triggered on main branch pushes and version tags
  - Available at: \`ghcr.io/[your-username]/[repo-name]\`

### Setting up CI/CD

1. Fork or clone the repository
2. Enable GitHub Actions in your repository settings
3. The workflows will run automatically on push/PR

### Environment Variables for Production

Create a \`.env\` file or set environment variables:

\`\`\`env
POSTGRES_USER=inventory_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=inventory_db
\`\`\`

## Deployment Platforms

### Vercel (Recommended for Next.js)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### AWS / GCP / Azure

1. Use the Docker image from GitHub Container Registry
2. Deploy to:
   - AWS ECS / Fargate
   - Google Cloud Run
   - Azure Container Instances

### VPS / Traditional Hosting

1. Install Docker on your server
2. Clone the repository
3. Run with docker-compose:

\`\`\`bash
git clone [your-repo]
cd inventory-management
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

## Database Backup

### Create backup

\`\`\`bash
docker exec inventory-db pg_dump -U inventory_user inventory_db > backup.sql
\`\`\`

### Restore backup

\`\`\`bash
docker exec -i inventory-db psql -U inventory_user inventory_db < backup.sql
\`\`\`

## Monitoring

- Check application logs: \`docker-compose logs -f app\`
- Check database logs: \`docker-compose logs -f postgres\`
- Monitor container health: \`docker-compose ps\`

## Scaling

For production environments with high traffic:

1. Use a managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
2. Deploy multiple app instances behind a load balancer
3. Use Redis for session storage and caching
4. Enable CDN for static assets

## Security Checklist

- [ ] Change default database credentials
- [ ] Use HTTPS in production
- [ ] Set strong passwords
- [ ] Enable database encryption at rest
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Backup strategy in place
- [ ] Monitor logs for suspicious activity
\`\`\`
