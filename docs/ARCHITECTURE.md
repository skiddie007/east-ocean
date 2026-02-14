# East Ocean - System Architecture

## High-Level System Design

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  Next.js 14 + React + Tailwind + Redux Toolkit          │
│  (http://localhost:3000)                                │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST
┌──────────────────────▼──────────────────────────────────┐
│                   API Gateway (CORS)                     │
│          JWT Authentication & Authorization             │
│          Request Validation & Logging                   │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│            Backend API Layer (Express.js)              │
│           http://localhost:3001/api                     │
│  ┌────────────────┐  ┌────────────────┐                │
│  │ Trade Routes   │  │ Auth Routes    │                │
│  │ AI Routes      │  │ Compliance     │                │
│  └────────────────┘  └────────────────┘                │
└──────────────┬────────────────────┬──────────────────────┘
               │                    │
       ┌───────▼────────┐   ┌──────▼───────────┐
       │  Database      │   │  AI Layer        │
       │  (PostgreSQL)  │   │  (Claude API)    │
       │  port 5432     │   │  + Prompts       │
       └────────────────┘   │  + Processing    │
                            └──────────────────┘
```

## Database Schema (ERD)

### Core Tables

```
┌─────────────────┐         ┌─────────────────┐
│    users        │         │   companies     │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │────┐┌──│ id (PK)         │
│ email           │    ││  │ user_id (FK)    │
│ password_hash   │    ││  │ name            │
│ first_name      │    ││  │ iec_number      │
│ last_name       │    ││  │ gst_number      │
│ role            │    ││  │ country         │
│ created_at      │    ││  │ created_at      │
└─────────────────┘    ││  └─────────────────┘
                       ││
          ┌────────────┘│
          │             │
    ┌─────▼──────────┐  │    ┌──────────────────┐
    │  trade_deals   │  │    │    products      │
    ├────────────────┤  │    ├──────────────────┤
    │ id (PK)        │  └───│id (PK)           │
    │ buyer_id (FK)  ├─────│trade_deal_id(FK)│
    │ seller_id (FK) │     │hs_code           │
    │ product_id(FK) │     │description       │
    │ quantity       │     │unit_price        │
    │ incoterms      │     │currency          │
    │ payment_term   │     │created_at        │
    │ risk_score     │     └──────────────────┘
    │ status         │
    │ created_at     │
    └────────────────┘
         │
         ├─────────┬─────────┬───────────────┐
         │         │         │               │
    ┌────▼──┐ ┌───▼────┐ ┌──▼────────┐ ┌───▼──────┐
    │documents│ │payments│ │compliance_│ │ai_logs   │
    ├────────┤ ├───────┤ │checks     │ ├──────────┤
    │id (PK) │ │id(PK) │ │id (PK)    │ │id (PK)   │
    │type    │ │amount │ │deal_id(FK)│ │prompt    │
    │s3_url  │ │status │ │type       │ │response  │
    │created_│ │term   │ │valid      │ │model     │
    └────────┘ └───────┘ └───────────┘ └──────────┘
```

## API Endpoints

### Authentication
```
POST   /api/auth/signup           # Create new user
POST   /api/auth/login            # User login
GET    /api/auth/profile          # Get user profile
POST   /api/auth/refresh          # Refresh JWT token
POST   /api/auth/logout           # Logout user
```

### Trade Deals
```
GET    /api/trade/deals           # List all deals (paginated)
POST   /api/trade/deals           # Create new deal
GET    /api/trade/deals/:id       # Get deal details
PUT    /api/trade/deals/:id       # Update deal
DELETE /api/trade/deals/:id       # Delete deal
GET    /api/trade/deals/:id/docs  # Get deal documents
```

### AI Services
```
POST   /api/ai/hs-classify        # Classify HS code
POST   /api/ai/risk-score         # Calculate risk score
POST   /api/ai/payment-recommend  # Recommend payment terms
POST   /api/ai/compliance-check   # Validate compliance
POST   /api/ai/document-generate  # Generate documents
POST   /api/ai/chat               # Chat with AI assistant
```

### Companies
```
GET    /api/companies/:id         # Get company details
PUT    /api/companies/:id         # Update company
POST   /api/companies/:id/verify  # Verify KYC
```

### Documents
```
GET    /api/documents/:id         # Download document
DELETE /api/documents/:id         # Delete document
POST   /api/documents/:dealId     # Create document
```

## Backend File Structure

```
backend/
├── src/
│   ├── server.js                 # Express app initialization
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection
│   │   ├── jwt.js               # JWT configuration
│   │   └── claude.js            # Claude API config
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   ├── trade.js             # Trade deal endpoints
│   │   ├── ai.js                # AI service endpoints
│   │   └── company.js           # Company endpoints
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── tradeController.js   # Trade logic
│   │   └── aiController.js      # AI logic
│   ├── services/
│   │   ├── authService.js       # JWT, password hashing
│   │   ├── tradeService.js      # Trade business logic
│   │   └── aiService.js         # AI API calls
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── validate.js          # Input validation
│   │   └── errorHandler.js      # Error handling
│   ├── ai/
│   │   ├── prompts.js           # All AI prompts
│   │   ├── hsClassifier.js      # HS code logic
│   │   ├── riskEngine.js        # Risk calculation
│   │   └── complianceEngine.js  # Compliance checks
│   ├── utils/
│   │   ├── logger.js            # Logging
│   │   ├── constants.js         # App constants
│   │   └── validators.js        # Validation rules
│   └── migrations/
│       └── init.sql             # Database setup
├── prisma/
│   └── schema.prisma            # Prisma ORM schema
├── .env.example
├── package.json
├── server.js
└── Dockerfile
```

## Frontend File Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── _app.js              # Next.js app wrapper
│   │   ├── index.js             # Home page
│   │   ├── login.js             # Login page
│   │   ├── signup.js            # Signup page
│   │   ├── dashboard.js         # Main dashboard
│   │   ├── deals/
│   │   │   ├── index.js         # Deals list
│   │   │   ├── create.js        # Create deal
│   │   │   └── [id].js          # Deal details
│   │   └── ai/
│   │       ├── assistant.js     # AI chat
│   │       └── tools.js         # AI tools
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Sidebar.js
│   │   ├── TradeForm.js
│   │   ├── AiChat.js
│   │   └── Dashboard.js
│   ├── services/
│   │   ├── api.js               # API client
│   │   ├── auth.js              # Auth service
│   │   └── ai.js                # AI service
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   └── dealsSlice.js
│   │   └── index.js             # Redux store config
│   ├── styles/
│   │   └── globals.css          # Global styles
│   └── utils/
│       ├── constants.js
│       └── helpers.js
├── public/
│   └── favicon.ico
├── .env.local.example
├── package.json
├── next.config.js
└── Dockerfile
```

## Implementation Steps

### 1. Database Setup
- Initialize PostgreSQL
- Run migrations
- Seed sample data

### 2. Backend Implementation
- Express server setup
- JWT authentication
- Prisma ORM configuration
- API endpoints
- AI integrations

### 3. Frontend Implementation
- Next.js setup
- Redux store
- Component development
- Pages implementation

### 4. AI Integration
- Claude API setup
- Prompt engineering
- Response validation
- Error handling

### 5. Testing & Deployment
- Unit tests
- Integration tests
- Docker build & test
- Documentation

## Security Considerations

- JWT token expiration: 7 days
- Password hashing: bcrypt (10 rounds)
- CORS: Configured for localhost:3000 only
- Input validation: All endpoints
- Rate limiting: 100 requests/minute per IP
- SQL injection prevention: Prisma ORM
- XSS protection: React automatic escaping
