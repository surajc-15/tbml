# 🛡️ TBML Detection & AML Compliance Dashboard

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge)
![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge)
![Groq](https://img.shields.io/badge/Groq-AI-orange?style=for-the-badge)

### 🚨 Enterprise Trade-Based Money Laundering Detection Platform

AI-powered AML compliance dashboard for detecting, monitoring, escalating, and managing suspicious trade transactions across banking networks.

</div>

---

# ✨ Overview

The **TBML Detection & AML Compliance Dashboard** is an enterprise-grade anti-money laundering platform designed to identify suspicious cross-border trade activities, monitor fraud risks, generate STR reports, and streamline compliance workflows.

The platform enables:

- 🏦 Multi-bank fraud monitoring
- 🔍 Suspicious transaction analysis
- 🤖 AI-assisted risk intelligence
- 📄 STR report generation
- 📧 Automated compliance notifications
- 🛡️ Role-based access control
- 📊 Real-time fraud dashboards

---

# 🚀 Key Features

## 🔎 AML & Fraud Detection

- Real-time transaction monitoring
- Fraud verdict classification
- Suspicious transaction identification
- Dynamic risk scoring
- Commodity anomaly analysis
- Trade metadata inspection
- Cross-bank transaction tracking

---

## 🏦 Multi-Bank Architecture

Supports isolated bank-level visibility.

### Example Account Structure

```txt
Bank_A_5643
Bank_B_0022
Bank_C_9317
```

### Access Rules

#### ADMIN
- Access all escalated fraud transactions
- Access STR reports
- Trigger compliance workflows
- Monitor all banks

#### BANK_USER
- View only transactions related to their bank
- Generate STR reports
- Escalate suspicious activity

#### ANALYST
- Investigate fraud patterns
- Analyze transaction metadata
- Review AML indicators

---

# 🧠 AI-Powered Intelligence

Integrated with Groq + Llama 3.3 70B for:

- Transaction risk reasoning
- Fraud pattern interpretation
- Compliance summaries
- Trade anomaly explanations
- Suspicious activity insights

---

# 📬 Compliance Workflow Engine

The platform includes a complete compliance escalation pipeline.

## Workflow

```text
Transaction Generated
        ↓
AML Analysis Engine
        ↓
Stored in aml_audit_log
        ↓
Bank User Reviews Fraud
        ↓
Generate STR Report
        ↓
Stored in str_reports
        ↓
Admin Visibility Enabled
        ↓
Freeze / Document Actions
        ↓
Automated Notifications
```

---

# 📧 Automated Email Notifications

Integrated with Resend Email API.

### Supported Actions

- Freeze account requests
- Document verification requests
- Compliance escalation alerts
- STR creator notifications
- Cross-bank fraud alerts

---

# 🏗️ System Architecture

```text
┌───────────────────────────┐
│      Next.js Frontend     │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│        Prisma ORM         │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ PostgreSQL / Supabase DB  │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ AML Logs + STR Reports    │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ AI + Email Workflows      │
└───────────────────────────┘
```

---

# 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 |
| Language | TypeScript |
| Styling | TailwindCSS + ShadCN |
| Database | PostgreSQL / Supabase |
| ORM | Prisma |
| Authentication | Clerk |
| AI Engine | Groq + Llama 3.3 |
| Email Service | Resend |
| Runtime | Node.js |

---

# 🗄️ Database Models

## 👤 User
Stores:
- authentication info
- roles
- bank association
- profile data

---

## 📑 aml_audit_log
Stores:
- transaction records
- fraud verdicts
- AML metadata
- confidence scores
- trade information

---

## 🚨 STRReport
Stores:
- escalated fraud reports
- compliance actions
- reporting user
- review lifecycle

---

# 🔐 Role-Based Visibility Logic

## Bank User Access

A bank user can only access transactions where:

```ts
sender bank === current user's bank
OR
receiver bank === current user's bank
```

### Example

```txt
Current User Bank: Bank_A
```

Visible:

```txt
Bank_A_5643 → Bank_B_0092
Bank_C_1123 → Bank_A_0041
```

Hidden:

```txt
Bank_B_0081 → Bank_C_0007
```

---

# ⚡ Fraud Escalation Logic

## BANK_USER Dashboard
Shows:
- All fraud transactions related to user's bank

Filters:
- verdict = FRAUD
- sender OR receiver bank match

---

## ADMIN Dashboard
Shows:
- Only escalated fraud transactions

Filters:
- verdict = FRAUD
- STR report exists

---

# 🔑 Environment Variables

Create a `.env` file:

```env
# =========================
# Database
# =========================
DATABASE_URL=postgresql://...

# =========================
# AI / LLM
# =========================
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile

# =========================
# Email
# =========================
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=alerts@your-domain.com
REGULATOR_FROM_EMAIL=regulator@your-domain.com

DEFAULT_ORIGINATING_BANK_EMAIL=bank-ops@your-domain.com
DEFAULT_RECEIVER_BANK_EMAIL=receiver-bank@your-domain.com

# =========================
# Clerk Authentication
# =========================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd tbml-dashboard
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Push Prisma Schema

```bash
npx prisma db push
```

OR

```bash
npx prisma migrate dev
```

---

## 4️⃣ Seed Database

```bash
npx prisma db seed
```

---

## 5️⃣ Start Development Server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

# 🧪 Prisma Studio

Launch Prisma Studio:

```bash
npx prisma studio
```

Useful for:

- viewing AML logs
- managing STR reports
- debugging workflows
- validating fraud records

---


# ☁️ Supabase Support

The project fully supports Supabase PostgreSQL.

Update:

```env
DATABASE_URL=
```

with your Supabase connection string.

Then run:

```bash
npx prisma db push
```

---

# 📂 Project Structure

```text
src/
├── app/
├── components/
├── lib/
├── prisma/
├── actions/
├── hooks/
├── types/
└── api/
```

---

# 🛡️ Security Features

- Role-based access control
- Bank-scoped transaction isolation
- Secure Clerk authentication
- Environment-based secret management
- STR escalation separation
- Webhook verification
- Fraud escalation workflow isolation

---

# 📈 Future Enhancements

- Graph Neural Networks (GNN)
- Real-time transaction streaming
- Live fraud alerts
- Multi-bank consortium network
- Graph-based transaction intelligence
- Regulatory export automation
- Advanced AML analytics
- Behavioral anomaly detection

---

# 📸 Dashboard Modules

✅ Fraud Transactions

✅ Suspicious Transactions

✅ STR Reports

✅ Compliance Actions

✅ Insights Dashboard

✅ Simulation Engine

✅ Role-Based Dashboards

---

# 🌍 Production Readiness

Designed with enterprise architecture principles:

- modular backend structure
- scalable Prisma schema
- reusable compliance workflows
- centralized role management
- clean API separation
- production-grade authentication
- scalable email notification pipeline

---

# 👨‍💻 Author

## Suraj C

### Trade-Based Money Laundering Detection Platform

Built for enterprise AML compliance simulation, fraud intelligence, and banking workflow automation.

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star.

</div>

