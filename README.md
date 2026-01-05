# Inventory Management System

A modern, full-stack inventory management application built with Next.js, PostgreSQL, and Docker.

## Features

- **Dashboard**: Real-time statistics and inventory overview
- **Product Management**: Complete CRUD operations for products
- **Category Management**: Organize products by categories
- **Supplier Management**: Track and manage suppliers
- **Stock Movements**: Monitor stock changes and history
- **Low Stock Alerts**: Visual indicators for products below minimum stock
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS v4
- **Backend**: Next.js API Routes, PostgreSQL
- **Database**: PostgreSQL 16 (Docker)
- **Deployment**: Docker, GitHub Actions CI/CD

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ installed

### Installation

1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd inventory-management
\`\`\`

2. Start the PostgreSQL database with Docker
\`\`\`bash
docker-compose up -d
\`\`\`

3. Install dependencies
\`\`\`bash
npm install
\`\`\`

4. Create a `.env.local` file (optional, uses defaults if not provided)
\`\`\`env
POSTGRES_USER=inventory_user
POSTGRES_PASSWORD=inventory_pass
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=inventory_db
\`\`\`

5. Run the development server
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Docker Commands

\`\`\`bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View logs
docker-compose logs -f

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
\`\`\`

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── products/          # Products pages
│   ├── categories/        # Categories pages
│   └── suppliers/         # Suppliers pages
├── components/            # React components
├── lib/                   # Utility functions and DB connection
├── scripts/              # Database initialization scripts
├── docker-compose.yml    # Docker configuration
└── .github/workflows/    # CI/CD pipeline
\`\`\`

## API Endpoints

- `GET /api/products` - List all products
- `POST /api/products` - Create new product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `GET /api/categories` - List all categories
- `GET /api/suppliers` - List all suppliers
- `GET /api/stats` - Get dashboard statistics

## License

MIT
