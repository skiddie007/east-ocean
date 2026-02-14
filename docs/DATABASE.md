# East Ocean - Database Schema

## Prisma Schema (schema.prisma)

Place this file in `backend/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User Management
model User {
  id                 String     @id @default(cuid())
  email              String     @unique @db.VarChar(255)
  passwordHash       String     @db.Text
  firstName          String     @db.VarChar(100)
  lastName           String     @db.VarChar(100)
  role               Role       @default(EXPORTER)
  isActive           Boolean    @default(true)
  lastLogin          DateTime?
  company            Company?
  sellerDeals        TradeDeal[]  @relation("seller")
  buyerDeals         TradeDeal[]  @relation("buyer")
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt
}

enum Role {
  ADMIN
  EXPORTER
  IMPORTER
  MANUFACTURER
  BANK
  LOGISTICS
}

// Company Profile
model Company {
  id                 String     @id @default(cuid())
  userId             String     @unique
  user               User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  name               String     @db.VarChar(255)
  iecNumber          String?    @unique @db.VarChar(50)
  gstNumber          String?    @unique @db.VarChar(50)
  panNumber          String?    @unique @db.VarChar(50)
  country            String     @default("IN") @db.VarChar(2)
  address            String     @db.Text
  city               String     @db.VarChar(100)
  state              String     @db.VarChar(100)
  zipCode            String     @db.VarChar(20)
  contactPhone       String     @db.VarChar(20)
  website            String?
  industryType       String     @db.VarChar(100)
  kycVerified        Boolean    @default(false)
  kycVerificationDate DateTime?
  riskRating         String     @default("MEDIUM") // LOW, MEDIUM, HIGH
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt
}

// Trade Deals
model TradeDeal {
  id                 String     @id @default(cuid())
  sellerId           String
  seller             User       @relation("seller", fields: [sellerId], references: [id])
  buyerId            String
  buyer              User       @relation("buyer", fields: [buyerId], references: [id])
  referenceNumber    String     @unique @db.VarChar(50)
  products           Product[]
  quantity           Int
  currency           String     @default("USD") @db.VarChar(3)
  totalValue         Decimal    @db.Decimal(15, 2)
  incoterms          String     @db.VarChar(50) // FOB, CIF, EXW, etc.
  paymentTerm        PaymentTerm @default(ADVANCE)
  hsCode             String?    @db.VarChar(20)
  status             DealStatus @default(PENDING)
  riskScore          Int        @default(50) // 0-100
  riskAssessment     String?    @db.Text
  complianceChecks   ComplianceCheck[]
  payments           Payment[]
  documents          Document[]
  notes              String?    @db.Text
  deadline           DateTime?
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt
}

enum DealStatus {
  PENDING
  NEGOTIATION
  APPROVED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  DISPUTED
}

enum PaymentTerm {
  ADVANCE
  LC // Letter of Credit
  ESCROW
  COD // Cash on Delivery
  CAD // Cash Against Documents
  OPEN_ACCOUNT
}

// Products in Trade Deal
model Product {
  id                 String     @id @default(cuid())
  tradeDealId        String
  tradeDeal          TradeDeal  @relation(fields: [tradeDealId], references: [id], onDelete: Cascade)
  description        String     @db.Text
  hsCode             String     @db.VarChar(20)
  quantity           Int
  unit               String     @db.VarChar(20) // kg, box, etc.
  unitPrice          Decimal    @db.Decimal(12, 2)
  totalPrice         Decimal    @db.Decimal(15, 2)
  currency           String     @default("USD") @db.VarChar(3)
  skuCode            String?    @db.VarChar(50)
  classification     String?    @db.VarChar(100)
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt
}

// Documents
model Document {
  id                 String     @id @default(cuid())
  tradeDealId        String
  tradeDeal          TradeDeal  @relation(fields: [tradeDealId], references: [id], onDelete: Cascade)
  type               DocumentType
  fileName           String     @db.VarChar(255)
  s3Url              String     @db.Text
  fileSize           Int
  mimeType           String     @db.VarChar(50)
  generatedBy        String     @default("SYSTEM")
  isCompliant        Boolean    @default(true)
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt
}

enum DocumentType {
  INVOICE
  PACKING_LIST
  BILL_OF_LADING
  CERTIFICATE_OF_ORIGIN
  EXPORT_LICENSE
  IMPORT_LICENSE
  BANK_GUARANTEE
  LC_APPLICATION
  CUSTOM_DECLARATION
  INSURANCE_CERTIFICATE
  OTHER
}

// Payment Records
model Payment {
  id                 String     @id @default(cuid())
  tradeDealId        String
  tradeDeal          TradeDeal  @relation(fields: [tradeDealId], references: [id], onDelete: Cascade)
  amount             Decimal    @db.Decimal(15, 2)
  currency           String     @default("USD") @db.VarChar(3)
  term               PaymentTerm
  status             PaymentStatus @default(PENDING)
  paymentMethod      String     @db.VarChar(50) // BANK_TRANSFER, WIRE, CRYPTO, etc.
  transactionId      String?    @db.VarChar(100)
  dueDate            DateTime?
  paidDate           DateTime?
  notes              String?    @db.Text
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  CANCELLED
  REFUNDED
}

// Compliance Checks
model ComplianceCheck {
  id                 String     @id @default(cuid())
  tradeDealId        String
  tradeDeal          TradeDeal  @relation(fields: [tradeDealId], references: [id], onDelete: Cascade)
  checkType          String     @db.VarChar(100) // GST, IEC, FTP_ELIGIBILITY, etc.
  result             Boolean
  details            String?    @db.Text
  warnings           String?    @db.Text
  approvedBy         String?    @db.VarChar(100)
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt
}

// AI Logs
model AILog {
  id                 String     @id @default(cuid())
  tradeDealId        String?
  service            String     @db.VarChar(50) // HS_CLASSIFIER, RISK_ENGINE, etc.
  prompt             String     @db.Text
  response           String     @db.Text
  model              String     @db.VarChar(50) // claude-3-opus, etc.
  tokensUsed         Int?
  cost               Decimal?   @db.Decimal(8, 4)
  statusCode         Int        @default(200)
  errorMessage       String?    @db.Text
  createdAt          DateTime   @default(now())
}
```

## Database Initialization

### Step 1: Install Prisma

```bash
cd backend
npm install @prisma/client
npm install -D prisma
```

### Step 2: Initialize Prisma

```bash
npx prisma init
```

### Step 3: Update .env

Set `DATABASE_URL` in `.env`:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/east_ocean
```

### Step 4: Run Migrations

```bash
npx prisma migrate dev --name init
```

### Step 5: Generate Prisma Client

```bash
npx prisma generate
```

### Step 6: Seed Sample Data

Create `backend/prisma/seed.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create sample users
  const exporter = await prisma.user.upsert({
    where: { email: 'exporter@eastocean.com' },
    update: {},
    create: {
      email: 'exporter@eastocean.com',
      passwordHash: '$2b$10$ExampleHashedPassword',
      firstName: 'John',
      lastName: 'Sharma',
      role: 'EXPORTER',
      company: {
        create: {
          name: 'Global Exports Ltd',
          iecNumber: 'IEC123456789',
          gstNumber: 'GSTIN123456789',
          country: 'IN',
          address: 'Mumbai, India',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          contactPhone: '+91-9876543210',
          industryType: 'Textiles',
        },
      },
    },
  });

  const importer = await prisma.user.upsert({
    where: { email: 'importer@example.com' },
    update: {},
    create: {
      email: 'importer@example.com',
      passwordHash: '$2b$10$ExampleHashedPassword',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'IMPORTER',
      company: {
        create: {
          name: 'Global Imports Inc',
          gstNumber: 'GSTIN987654321',
          country: 'US',
          address: 'New York, USA',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          contactPhone: '+1-2125551234',
          industryType: 'Retail',
        },
      },
    },
  });

  console.log({ exporter, importer });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

Run seed:

```bash
npx prisma db seed
```

## Key Constraints & Relationships

- **Users ↔ Companies**: One-to-One (each user has one company profile)
- **Users ↔ TradeDeal**: One-to-Many (user can have many deals as seller/buyer)
- **TradeDeal ↔ Products**: One-to-Many
- **TradeDeal ↔ Documents**: One-to-Many
- **TradeDeal ↔ Payments**: One-to-Many
- **TradeDeal ↔ ComplianceCheck**: One-to-Many
- **OnDelete Cascade**: Products, Documents, Payments, ComplianceChecks are deleted when TradeDeal is deleted

## Indexes for Performance

Add to schema after model definitions:

```prisma
// Email searches
@@index([email])

// Company searches
@@unique([iecNumber])
@@unique([gstNumber])

// Deal searches
@@index([sellerId])
@@index([buyerId])
@@unique([referenceNumber])
```
