# HireSense

AI-powered job tracking platform with smart resume matching and intelligent application management.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## Live Demo

🔗 **[https://hiresense.vercel.app](https://hiresense.vercel.app)**

---

## Features

- **Job Feed** - Browse jobs from JSearch API with advanced filters
- **AI Match Scoring** - Every job scored 0-100% against your resume
- **Resume Parsing** - Upload PDF, AI extracts skills and experience
- **Smart Application Tracking** - Detects when you return from applying
- **AI Chat Assistant** - Natural language job search
- **Dashboard** - Track applications with status updates

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                CLIENT                                   │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐             │
│  │ Jobs Page │  │ Dashboard │  │  Resume   │  │  AI Chat  │             │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘             │
│        └──────────────┴──────────────┴──────────────┘                   │
│                              │                                          │
│                     React + TanStack Query                              │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS API ROUTES                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │ /api/jobs  │  │/api/resume │  │ /api/match │  │ /api/chat  │         │
│  │            │  │            │  │            │  │            │         │
│  │ • Search   │  │ • Upload   │  │ • Score    │  │ • AI Chat  │         │
│  │ • Filters  │  │ • Parse    │  │ • Batch    │  │ • Search   │         │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘         │
└────────┼───────────────┼───────────────┼───────────────┼────────────────┘
         │               │               │               │
         ▼               ▼               ▼               ▼
┌──────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ JSearch API  │ │ Cloudinary  │ │ OpenRouter  │ │ OpenRouter  │
│  (RapidAPI)  │ │  (Storage)  │ │  (Gemini)   │ │  (Gemini)   │
│              │ │             │ │             │ │             │
│ Job Listings │ │Resume Files │ │Match Scores │ │ Chat/Parse  │
└──────────────┘ └─────────────┘ └──────┬──────┘ └─────────────┘
                        │               │
                        ▼               ▼
                ┌─────────────────────────────────────┐
                │              MONGODB                │
                │  ┌───────┐ ┌───────┐ ┌───────┐      │
                │  │ Users │ │ Apps  │ │ Cache │      │
                │  └───────┘ └───────┘ └───────┘      │
                │  ┌───────┐ ┌───────────┐            │
                │  │ Jobs  │ │ RateLimit │            │
                │  └───────┘ └───────────┘            │
                └─────────────────────────────────────┘
```

### Data Flow - Job Matching

```
User loads jobs page
        │
        ▼
┌───────────────┐     ┌───────────────┐
│  Fetch jobs   │────▶│  JSearch API  │
└───────┬───────┘     └───────────────┘
        │
        ▼
┌───────────────┐
│  Check cache  │──── Hit ────▶ Return cached scores
└───────┬───────┘
        │ Miss
        ▼
┌───────────────┐     ┌───────────────┐
│  Get resume   │────▶│   MongoDB     │
└───────┬───────┘     └───────────────┘
        │
        ▼
┌───────────────┐     ┌───────────────┐
│  AI scoring   │────▶│  OpenRouter   │
└───────┬───────┘     └───────────────┘
        │
        ▼
┌───────────────┐
│ Cache results │────▶ MongoDB (30 min TTL)
└───────┬───────┘
        │
        ▼
  Return scores
```

### Database Schema

```
User                          Application
├── _id                       ├── _id
├── firebaseUid (unique)      ├── userId (ref)
├── email                     ├── job
├── displayName               │   ├── externalId
├── resume                    │   ├── title
│   ├── fileUrl               │   ├── company
│   ├── fileName              │   └── applyLink
│   └── parsedData            ├── status (enum)
│       ├── skills[]          ├── matchScore
│       ├── experience[]      └── appliedAt
│       └── education[]
└── timestamps                Cache
                              ├── key (unique)
RateLimit                     ├── value (Mixed)
├── identifier                └── expiresAt (TTL)
├── endpoint
├── count
└── expiresAt (TTL)
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 15, React 19 | UI Framework |
| Styling | Tailwind CSS, shadcn/ui | Components |
| State | TanStack Query, Zustand | Data & State |
| Backend | Next.js API Routes | REST API |
| Database | MongoDB + Mongoose | Persistence |
| Auth | Firebase Auth | Google OAuth |
| Storage | Cloudinary | Resume Files |
| AI | OpenRouter (Gemini 2.0) | Matching & Chat |
| Jobs | JSearch (RapidAPI) | Job Listings |

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Firebase project
- Cloudinary account
- OpenRouter API key
- RapidAPI key

### Installation

```bash
# Clone
git clone https://github.com/yourusername/hiresense.git
cd hiresense

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local with your credentials

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# OpenRouter
OPENROUTER_API_KEY=sk-or-v1-...

# RapidAPI
RAPIDAPI_KEY=
```

---

## AI Matching Logic

### Score Calculation

```
Score = (Skills × 0.5) + (Experience × 0.3) + (Fit × 0.2)

Skills (50%):
• Direct matches (React ↔ React)
• Related skills (React → JavaScript)
• Framework equivalents (Next.js ≈ React)

Experience (30%):
• Years alignment
• Industry relevance
• Role progression

Fit (20%):
• Title relevance
• Keyword overlap
• Education match
```

### AI Prompt

```javascript
const prompt = `
Analyze resume-job match. Return JSON:

RESUME:
Skills: ${resume.skills.join(', ')}
Experience: ${resume.experience.join('; ')}

JOB:
Title: ${job.title}
Requirements: ${job.requirements.join(', ')}

Return: {
  "score": 0-100,
  "matchedSkills": [],
  "missingSkills": [],
  "recommendation": "..."
}`;
```

### Efficiency

| Optimization | Impact |
|--------------|--------|
| 30-min cache | ~80% fewer AI calls |
| Batch processing | 20 jobs in parallel |
| Cache-first | Instant repeat views |
| Auto-invalidation | Fresh scores on resume update |

### Score Display

| Score | Badge | Color |
|-------|-------|-------|
| 70-100% | Strong Match | Green |
| 40-69% | Good Match | Yellow |
| 0-39% | Low Match | Gray |

---

## Smart Popup Flow

### The Challenge

Detect if user actually applied after clicking "Apply" (opens external site).

### Solution

Use browser Visibility API to detect tab return.

```
User clicks "Apply"
        │
        ▼
┌───────────────────┐
│ Save pending job  │──▶ localStorage
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Open external tab │──▶ window.open()
└───────────────────┘
        │
        │ User returns
        ▼
┌───────────────────┐
│ visibilitychange  │──▶ Check: was hidden? has pending? not expired?
└───────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│        CONFIRMATION POPUP           │
│                                     │
│  "Did you apply to [Job] at [Co]?" │
│                                     │
│  [Yes, Applied] [No, Browsing]     │
│        [Applied Earlier]            │
└─────────────────────────────────────┘
        │
        ├── Yes ────▶ Save application
        ├── No ─────▶ Clear pending
        └── Earlier ▶ Save with note
```

### Edge Cases

| Case | Solution |
|------|----------|
| User doesn't return | 30-min expiry |
| Multiple clicks | One pending job only |
| Browser refresh | Persists in localStorage |
| No apply link | Show details modal |
| Network failure | Retry with backoff |

### Why This Approach?

| Alternative | Problem |
|-------------|---------|
| Browser extension | Users won't install |
| URL tracking | Doesn't work externally |
| Time-based guess | Inaccurate |
| Manual only | Poor UX |

Visibility API: No permissions, works everywhere, non-intrusive.

---

## Scalability

### Current Optimizations

```
HANDLING 100 JOBS × 10,000 USERS

1. CACHING
   └── MongoDB with 30-min TTL
   └── Bulk read/write
   └── ~80% hit rate

2. RATE LIMITING
   └── AI Scoring: 50/min
   └── AI Chat: 20/min
   └── Resume Parse: 10/hour

3. INDEXES
   └── User: firebaseUid
   └── Application: userId + externalId
   └── Cache: key, expiresAt (TTL)

4. PARALLEL
   └── 20 jobs scored concurrently
   └── Individual error handling
```

### Scaling Path

| Users | Solution |
|-------|----------|
| 1K | Current setup |
| 10K | Connection pooling |
| 100K | Add Redis, job queues |
| 1M | Microservices, sharding |

---

## Tradeoffs

### Decisions Made

| Choice | Tradeoff | Why |
|--------|----------|-----|
| MongoDB for cache | Slower than Redis | One database, simpler ops |
| Next.js API routes | Not as fast as Fastify | Unified codebase |
| Client-side filters | More data sent | Instant filtering |

### Limitations

- JSearch API has daily limits
- First load without cache: 2-3s
- Only PDF/DOCX resumes
- Requires internet

### Future Improvements

- [ ] Redis caching layer
- [ ] Background job queues
- [ ] WebSocket real-time updates
- [ ] Email notifications
- [ ] Mobile app
- [ ] Browser extension
- [ ] Unit & E2E tests

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/
│   ├── (dashboard)/
│   │   ├── jobs/
│   │   ├── dashboard/
│   │   └── resume/
│   └── api/
│       ├── jobs/
│       ├── applications/
│       ├── resume/
│       └── chat/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── jobs/
│   ├── chat/
│   └── popup/
├── lib/
│   ├── firebase.ts
│   ├── mongodb.ts
│   ├── openrouter.ts
│   ├── jsearch.ts
│   ├── cloudinary.ts
│   └── cache.ts
├── models/
├── hooks/
├── types/
└── utils/
```

---

## License

MIT
