# East Ocean - AI-Powered Export Trading SaaS

## Overview
East Ocean is a cutting-edge AI-powered SaaS platform designed to empower exporters, importers, and manufacturers to execute seamless international trade deals with AI-driven insights, regulatory compliance, and real-time risk assessment.

**Status:** MVP/Test Environment
**Version:** 0.1.0
**License:** MIT

## Key Features

✅ **User Management** - Role-based access (Exporter, Importer, Manufacturer, Admin)  
✅ **Trade Deal Management** - Create, manage, and track trade deals  
✅ **AI Trade Assistant** - Chat-based AI assistant for trade queries  
✅ **HS Code Classifier** - AI-powered HS code classification  
✅ **Document Generation** - Auto-generate compliant trade documents  
✅ **Risk Scoring** - AI-based trade risk assessment  
✅ **Compliance Engine** - India-focused FTP 2024-29, FEMA, GST compliance checks  
✅ **Payment Terms Recommendation** - Smart payment term suggestions  
✅ **Real-time Dashboard** - Trade analytics and KPI tracking  

## Compliance & Standards

- **India:** Foreign Trade Policy (FTP 2024-29), FEMA Regulations, GST, SEZ Rules
- **Global:** WTO Standards, UCP 600, Incoterms 2020

## Tech Stack

### Frontend
- **Framework:** Next.js 14+
- **Styling:** Tailwind CSS
- **State:** Redux Toolkit
- **UI Components:** Shadcn/ui

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Authentication:** JWT
- **Database:** PostgreSQL 14+
- **ORM:** Prisma

### AI & Integration
- **LLM:** Claude API (via Anthropic SDK)
- **Environment:** Docker & Docker Compose

## Project Structure

```
east-ocean/
├── frontend/           # Next.js React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── next.config.js
├── backend/            # Express.js API server
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── ai/
│   │   └── utils/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── server.js
├── docs/               # Documentation
├── docker-compose.yml
├── .env.example
└── README.md
```

## Quick Start (Docker)

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 14+ (or use Docker Postgres)
- Claude API key (Anthropic)

### Setup Instructions

#### 1. Clone & Setup
```bash
git clone https://github.com/skiddie007/east-ocean.git
cd east-ocean
cp .env.example .env
```

#### 2. Configure Environment
Edit `.env` and set:
```
DATABASE_URL=postgresql://user:password@postgres:5432/east_ocean
JWT_SECRET=your_jwt_secret_key
CLAUDE_API_KEY=your_claude_api_key
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

#### 3. Start Services
```bash
docker-compose up --build
```

#### 4. Initialize Database
```bash
# In a new terminal:
docker-compose exec backend npm run migrate
docker-compose exec backend npm run seed
```

#### 5. Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **API Docs:** http://localhost:3001/api/docs

## Local Development (Without Docker)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with local database URL
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## API Documentation

### Base URL
`http://localhost:3001/api`

### Authentication
```bash
POST /auth/signup
POST /auth/login
GET  /auth/profile (requires JWT token)
```

### Trade Deals
```bash
GET    /trade/deals
POST   /trade/deals
GET    /trade/deals/:id
PUT    /trade/deals/:id
DELETE /trade/deals/:id
```

### AI Services
```bash
POST /ai/hs-classify          # Classify HS code
POST /ai/risk-score           # Calculate risk score
POST /ai/payment-recommend    # Recommend payment terms
POST /ai/compliance-check     # Validate compliance
POST /ai/document-generate    # Generate documents
POST /ai/chat                 # Trade assistant chat
```

## Database Schema

See [DATABASE.md](./docs/DATABASE.md) for complete ERD and schema details.

Key Tables:
- `users` - User accounts
- `companies` - Company profiles
- `trade_deals` - Trade transactions
- `products` - Product catalog
- `documents` - Generated documents
- `payments` - Payment records
- `ai_logs` - AI service logs
- `compliance_checks` - Compliance validations

## Testing

### Run Tests
```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

### Sample Test Scenarios

1. **User Signup & Login**
   - Create exporter account
   - Verify JWT token

2. **Create Trade Deal**
   - Add buyer (importer)
   - Add product with HS code
   - Select Incoterms & payment terms

3. **AI Features**
   - HS code classification
   - Risk scoring
   - Document generation

4. **Compliance**
   - GST validation
   - IEC verification mock
   - Export eligibility check

## Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure PostgreSQL with backups
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set rate limiting
- [ ] Enable logging & monitoring
- [ ] Configure CDN for static assets

### Deploy to AWS/Heroku/GCP

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for cloud-specific instructions.

## AI & LLM Integration

All AI features use Claude API via prompt-based microservices:

- **Trade Assistant:** Multi-turn conversational AI
- **HS Classifier:** Code classification from product descriptions
- **Document Generator:** Compliance-aware document creation
- **Risk Scorer:** Trade partner risk assessment
- **Compliance Validator:** Regulatory rule checking

See [AI_PROMPTS.md](./docs/AI_PROMPTS.md) for detailed prompt specifications.

## Security

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation & sanitization
- HTTPS/TLS encryption
- Rate limiting
- CORS protection
- SQL injection prevention (via Prisma ORM)
- XSS protection

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
docker-compose ps

# Reset database
docker-compose down -v
docker-compose up db
```

### API Not Responding
```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Frontend Build Issues
```bash
# Clear cache and reinstall
rm -rf frontend/node_modules frontend/.next
cd frontend && npm install && npm run build
```

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit Pull Request

## Roadmap

- [ ] Multi-currency support
- [ ] Advanced analytics & reporting
- [ ] Mobile app (React Native)
- [ ] Bank integration APIs
- [ ] Letter of Credit automation
- [ ] Blockchain-based settlement
- [ ] Real-time market data integration
- [ ] Predictive analytics

## Support

For issues, questions, or suggestions:
- **GitHub Issues:** [Report Issue](https://github.com/skiddie007/east-ocean/issues)
- **Documentation:** [Full Docs](./docs/)
- **Email:** support@eastocean.trade

## License

MIT License - see LICENSE file for details

## Author

**Principal Architect:** AI Engineer & International Trade Expert  
**Organization:** East Ocean Trade Finance  
**Year:** 2026

---

**Ready to transform global trade? Start building with East Ocean!**
