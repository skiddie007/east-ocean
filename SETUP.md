# East Ocean - Complete Setup Guide

## Prerequisites

- **Node.js** 18+ & npm 9+
- **Docker** & **Docker Compose**
- **Git**
- **PostgreSQL** 14+ (if running locally without Docker)
- **Claude API Key** (from Anthropic)

## Quickstart with Docker (Recommended)

### Option 1: Docker Compose (5 minutes)

```bash
# 1. Clone repository
git clone https://github.com/skiddie007/east-ocean.git
cd east-ocean

# 2. Setup environment
cp .env.example .env

# 3. Add your Claude API key to .env
nano .env  # or use your preferred editor
# Update: CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxx

# 4. Start all services
docker-compose up --build

# 5. In another terminal, initialize database
docker-compose exec backend npm run migrate
docker-compose exec backend npm run seed

# 6. Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# API Docs: http://localhost:3001/api/docs (when available)
```

### Option 2: Local Development Setup

#### A. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Database setup
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/east_ocean
npx prisma migrate dev --name init
npx prisma db seed

# Start backend
npm run dev
# Server runs on http://localhost:3001
```

#### B. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local

# Start frontend
npm run dev
# App runs on http://localhost:3000
```

#### C. PostgreSQL Setup (if not using Docker)

```bash
# Create database
createdb east_ocean

# Or using psql:
psql -c "CREATE DATABASE east_ocean;"
```

## Backend Implementation

### Project Structure

See `docs/ARCHITECTURE.md` for complete folder structure.

### Key Files to Create

```
backend/
├── src/
│   ├── server.js                    # Express app
│   ├── config/
│   │   ├── database.js
│   │   ├── jwt.js
│   │   └── claude.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── trade.js
│   │   ├── ai.js
│   │   └── company.js
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── ai/                          # AI prompts & logic
│   │   ├── prompts.js
│   │   ├── hsClassifier.js
│   │   ├── riskEngine.js
│   │   └── complianceEngine.js
│   └── utils/
├── prisma/
│   └── schema.prisma                # Database schema
└── package.json
```

### Backend package.json

```json
{
  "name": "east-ocean-backend",
  "version": "0.1.0",
  "main": "src/server.js",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "migrate": "prisma migrate dev",
    "seed": "prisma db seed",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@prisma/client": "^5.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "@anthropic-ai/sdk": "^0.7.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-validator": "^7.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0",
    "prisma": "^5.0.0"
  }
}
```

## Frontend Implementation

### Frontend package.json

```json
{
  "name": "east-ocean-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@reduxjs/toolkit": "^1.9.0",
    "react-redux": "^8.1.0",
    "axios": "^1.5.0",
    "tailwindcss": "^3.3.0",
    "next-auth": "^4.23.0"
  }
}
```

## API Usage Examples

### Authentication

```bash
# Sign up
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "EXPORTER"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123"
  }'
```

### Create Trade Deal

```bash
curl -X POST http://localhost:3001/api/trade/deals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "buyerId": "user-id-buyer",
    "sellerI": "user-id-seller",
    "products": [
      {
        "description": "Cotton T-shirts",
        "hsCode": "6204",
        "quantity": 1000,
        "unit": "pcs",
        "unitPrice": "5.00",
        "currency": "USD"
      }
    ],
    "incoterms": "FOB",
    "paymentTerm": "LC"
  }'
```

### AI Risk Scoring

```bash
curl -X POST http://localhost:3001/api/ai/risk-score \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "dealId": "deal-id",
    "buyerCountry": "US",
    "sellerCountry": "IN",
    "amount": "50000",
    "paymentTerm": "LC"
  }'
```

## Deployment

### Production Checklist

- [ ] Set NODE_ENV=production
- [ ] Configure PostgreSQL with backups
- [ ] Set strong JWT_SECRET (min 32 chars)
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS for production domain
- [ ] Set up rate limiting
- [ ] Enable logging and monitoring
- [ ] Implement error tracking (Sentry)
- [ ] Setup CI/CD pipeline
- [ ] Run security tests

### Deploy to Heroku

```bash
# Create Procfile
echo "web: npm run start" > Procfile

# Initialize Git
git init
git add .
git commit -m "Initial commit"

# Create Heroku app
heroku create east-ocean

# Set environment variables
heroku config:set CLAUDE_API_KEY=sk-ant-xxxxx
heroku config:set DATABASE_URL=postgresql://...
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

## Testing

### Sample Test Scenarios

1. **User Registration & Login**
   - Sign up with valid credentials
   - Verify JWT token received
   - Login with same credentials
   - Verify token reissued

2. **Create & Manage Trade Deal**
   - Create deal with seller & buyer
   - Add products with HS codes
   - Verify deal status transitions
   - Get deal details

3. **AI Features**
   - HS code classification for textile
   - Risk scoring for high-value deal
   - Document generation (Invoice)
   - Compliance check for GST

4. **Error Handling**
   - Invalid JWT token (401)
   - Unauthorized role access (403)
   - Missing required fields (400)
   - Resource not found (404)

## Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL running
psql -U postgres -d east_ocean -c "SELECT 1;"

# Reset database
docker-compose down -v
docker-compose up db
```

### Port Already in Use

```bash
# Find and kill process on port
lsof -i :3000  # or 3001, 5432, 6379
kill -9 <PID>
```

### Claude API Error

- Verify API key is correct in .env
- Check Anthropic account has credits
- Test with curl:

```bash
curl https://api.anthropic.com/v1/complete \
  -H "x-api-key: $CLAUDE_API_KEY" \
  -H "content-type: application/json" \
  -d '{"prompt": "Hello"}'
```

## Documentation

- **Architecture**: `docs/ARCHITECTURE.md` - System design & ERD
- **Database**: `docs/DATABASE.md` - Prisma schema & setup
- **API Docs**: Will be auto-generated at `/api/docs`
- **Main README**: `README.md` - Project overview

## Next Steps

1. Complete backend implementation (follow `docs/ARCHITECTURE.md`)
2. Build frontend components
3. Implement AI prompts
4. Write and run tests
5. Deploy to staging
6. Collect feedback & iterate
7. Production deployment

## Support

- **Issues**: GitHub Issues
- **Email**: support@eastocean.trade
- **Docs**: Full documentation in `/docs` folder
