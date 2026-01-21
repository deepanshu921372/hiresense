# AI-Powered Job Tracker - Product Requirements Document (PRD)

## Version 1.0 | January 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [Technical Stack](#3-technical-stack)
4. [System Architecture](#4-system-architecture)
5. [Database Schema](#5-database-schema)
6. [Feature Specifications](#6-feature-specifications)
7. [API Specifications](#7-api-specifications)
8. [UI/UX Specifications](#8-uiux-specifications)
9. [AI Integration](#9-ai-integration)
10. [Error Handling](#10-error-handling)
11. [Test Cases](#11-test-cases)
12. [Security Considerations](#12-security-considerations)
13. [Performance & Scalability](#13-performance--scalability)
14. [Deployment Guide](#14-deployment-guide)
15. [Environment Variables](#15-environment-variables)

---

## 1. Executive Summary

### 1.1 Product Vision
Build an intelligent job tracking platform that leverages AI to match job seekers with relevant opportunities based on their resume, track application progress, and provide smart assistance through a conversational interface.

### 1.2 Key Objectives
- Fetch and display jobs from external APIs with comprehensive filtering
- AI-powered resume matching with explainable scores
- Smart application tracking with intelligent popup flow
- Conversational AI assistant for job search and platform help
- Clean, responsive, professional UI

### 1.3 Success Metrics
- Users can find relevant jobs within 3 clicks
- Match scores accurately reflect resume-job alignment (>80% user agreement)
- Application tracking captures >90% of actual applications
- AI assistant successfully answers >85% of queries

---

## 2. Project Overview

### 2.1 Target Users
- **Primary**: Active job seekers looking for tech roles
- **Secondary**: Passive job seekers exploring opportunities
- **Tertiary**: Career changers evaluating market fit

### 2.2 User Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER JOURNEY FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐    ┌──────────────┐    ┌─────────────┐    ┌───────────────┐  │
│  │  Sign Up │───▶│Upload Resume │───▶│ Browse Jobs │───▶│ View Matches  │  │
│  │  /Login  │    │  (Required)  │    │ with Filters│    │ & Scores      │  │
│  └──────────┘    └──────────────┘    └─────────────┘    └───────────────┘  │
│                                              │                   │          │
│                                              ▼                   ▼          │
│                                      ┌─────────────┐    ┌───────────────┐  │
│                                      │ Click Apply │───▶│ External Site │  │
│                                      └─────────────┘    └───────────────┘  │
│                                              │                   │          │
│                                              ▼                   ▼          │
│                                      ┌─────────────────────────────────┐   │
│                                      │   Return to App - Smart Popup   │   │
│                                      │  "Did you apply to [Job]?"      │   │
│                                      └─────────────────────────────────┘   │
│                                              │                              │
│                          ┌───────────────────┼───────────────────┐         │
│                          ▼                   ▼                   ▼         │
│                   ┌────────────┐      ┌────────────┐      ┌────────────┐   │
│                   │Yes, Applied│      │Just Browsing│     │Applied Earlier│ │
│                   └────────────┘      └────────────┘      └────────────┘   │
│                          │                                       │         │
│                          ▼                                       ▼         │
│                   ┌─────────────────────────────────────────────────┐      │
│                   │         Application Dashboard                    │      │
│                   │  Track: Applied → Interview → Offer/Rejected    │      │
│                   └─────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Core Features Summary

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| Authentication | P0 | Medium | Firebase Auth with Google/Email |
| Resume Upload | P0 | Medium | PDF/TXT upload to Cloudinary with text extraction |
| Job Feed | P0 | High | External API integration with filters |
| AI Matching | P0 | High | Resume-job scoring with explanations |
| Smart Popup | P0 | High | Application tracking popup flow |
| Dashboard | P0 | Medium | Application status management |
| AI Sidebar | P1 | High | Conversational assistant |
| Notifications | P2 | Low | Email/push for status updates |

---

## 3. Technical Stack

### 3.1 Frontend
```
Framework:      Next.js 14 (App Router)
Language:       TypeScript
Styling:        Tailwind CSS + shadcn/ui
State:          Zustand (global) + React Query (server state)
Forms:          React Hook Form + Zod validation
```

### 3.2 Backend
```
Runtime:        Next.js API Routes (Edge compatible)
Database:       MongoDB Atlas
ODM:            Mongoose
Caching:        Upstash Redis
File Storage:   Cloudinary
Authentication: Firebase Auth
```

### 3.3 AI & External Services
```
AI Provider:    OpenRouter API (Claude/GPT-4 access)
Job API:        JSearch (RapidAPI) - Primary
                Adzuna API - Fallback
PDF Parsing:    pdf-parse (server-side)
```

### 3.4 DevOps
```
Hosting:        Vercel
CI/CD:          GitHub Actions
Monitoring:     Vercel Analytics
Error Tracking: Sentry (optional)
```

---

## 4. System Architecture

### 4.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              SYSTEM ARCHITECTURE                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────┐
                                    │   Client    │
                                    │  (Browser)  │
                                    └──────┬──────┘
                                           │
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                   NEXT.JS APPLICATION                                 │
│  ┌────────────────────────────────────────────────────────────────────────────────┐  │
│  │                              FRONTEND (React)                                   │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │  │
│  │  │  Auth Pages  │  │  Job Feed    │  │  Dashboard   │  │  AI Sidebar  │        │  │
│  │  │  - Login     │  │  - List      │  │  - Apps      │  │  - Chat      │        │  │
│  │  │  - Register  │  │  - Filters   │  │  - Timeline  │  │  - Commands  │        │  │
│  │  │  - Profile   │  │  - Cards     │  │  - Stats     │  │  - Help      │        │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘        │  │
│  │                                                                                 │  │
│  │  ┌─────────────────────────────────────────────────────────────────────────┐   │  │
│  │  │                        STATE MANAGEMENT                                  │   │  │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │   │  │
│  │  │  │   Zustand   │  │ React Query │  │  Firebase   │  │   Context   │     │   │  │
│  │  │  │  (UI State) │  │(Server Data)│  │(Auth State) │  │  (Theme)    │     │   │  │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘     │   │  │
│  │  └─────────────────────────────────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────────────────────────────────┘  │
│                                           │                                          │
│                                           ▼                                          │
│  ┌────────────────────────────────────────────────────────────────────────────────┐  │
│  │                            API ROUTES (Backend)                                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │  │
│  │  │ /api/auth/*  │  │ /api/jobs/*  │  │/api/resume/* │  │ /api/chat/*  │        │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                          │  │
│  │  │/api/apply/*  │  │/api/match/*  │  │ /api/user/* │                          │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                          │  │
│  └────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────┘
           │              │              │              │              │
           ▼              ▼              ▼              ▼              ▼
    ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
    │  Firebase  │ │  MongoDB   │ │ Cloudinary │ │  Upstash   │ │ OpenRouter │
    │    Auth    │ │   Atlas    │ │  (Files)   │ │   Redis    │ │    API     │
    └────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘
                                                                       │
                                                        ┌──────────────┴──────────────┐
                                                        ▼                             ▼
                                                 ┌────────────┐                ┌────────────┐
                                                 │  JSearch   │                │   Adzuna   │
                                                 │ (RapidAPI) │                │    API     │
                                                 └────────────┘                └────────────┘
```

### 4.2 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                               DATA FLOW DIAGRAM                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            JOB FETCHING & MATCHING FLOW                              │
│                                                                                      │
│  User Request          API Layer              External             Database          │
│      │                     │                     │                    │              │
│      │  GET /api/jobs     │                     │                    │              │
│      │────────────────────▶                     │                    │              │
│      │                     │  Check Cache       │                    │              │
│      │                     │─────────────────────────────────────────▶              │
│      │                     │                     │                    │              │
│      │                     │  Cache Miss?        │                    │              │
│      │                     │────────────────────▶│                    │              │
│      │                     │                     │                    │              │
│      │                     │  Fetch Jobs         │                    │              │
│      │                     │◀────────────────────│                    │              │
│      │                     │                     │                    │              │
│      │                     │  Get User Resume    │                    │              │
│      │                     │─────────────────────────────────────────▶│              │
│      │                     │◀─────────────────────────────────────────│              │
│      │                     │                     │                    │              │
│      │                     │  AI: Score Jobs     │                    │              │
│      │                     │────────────────────▶│ OpenRouter         │              │
│      │                     │◀────────────────────│                    │              │
│      │                     │                     │                    │              │
│      │                     │  Cache Results      │                    │              │
│      │                     │─────────────────────────────────────────▶│              │
│      │                     │                     │                    │              │
│      │  Jobs + Scores      │                     │                    │              │
│      │◀────────────────────│                     │                    │              │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION TRACKING FLOW                                  │
│                                                                                      │
│  ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐                │
│  │ Click  │───▶│ Store  │───▶│ Open   │───▶│ User   │───▶│ Show   │                │
│  │ Apply  │    │Pending │    │External│    │Returns │    │ Popup  │                │
│  │ Button │    │  Job   │    │  Tab   │    │  App   │    │        │                │
│  └────────┘    └────────┘    └────────┘    └────────┘    └────────┘                │
│                                                               │                      │
│                    ┌──────────────────────────────────────────┤                      │
│                    ▼                    ▼                     ▼                      │
│              ┌──────────┐        ┌──────────┐          ┌──────────┐                 │
│              │   Yes,   │        │   Just   │          │ Applied  │                 │
│              │ Applied  │        │ Browsing │          │ Earlier  │                 │
│              └────┬─────┘        └────┬─────┘          └────┬─────┘                 │
│                   │                   │                     │                        │
│                   ▼                   ▼                     ▼                        │
│              ┌──────────┐        ┌──────────┐          ┌──────────┐                 │
│              │  Save    │        │  Clear   │          │  Save    │                 │
│              │ Applied  │        │ Pending  │          │ Applied  │                 │
│              │ Status   │        │   Job    │          │(Earlier) │                 │
│              └──────────┘        └──────────┘          └──────────┘                 │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND COMPONENT TREE                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘

src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── register/
│   │   │   └── page.tsx          # Register page
│   │   └── layout.tsx            # Auth layout (no sidebar)
│   │
│   ├── (main)/                   # Main app route group
│   │   ├── jobs/
│   │   │   └── page.tsx          # Job feed page
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Applications dashboard
│   │   ├── profile/
│   │   │   └── page.tsx          # User profile & resume
│   │   └── layout.tsx            # Main layout (with sidebar)
│   │
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   ├── jobs/
│   │   │   ├── route.ts          # GET /api/jobs
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET /api/jobs/:id
│   │   ├── resume/
│   │   │   ├── route.ts          # POST /api/resume (upload)
│   │   │   └── extract/
│   │   │       └── route.ts      # POST /api/resume/extract
│   │   ├── applications/
│   │   │   ├── route.ts          # GET, POST /api/applications
│   │   │   └── [id]/
│   │   │       └── route.ts      # PATCH, DELETE
│   │   ├── match/
│   │   │   └── route.ts          # POST /api/match (AI scoring)
│   │   └── chat/
│   │       └── route.ts          # POST /api/chat (AI assistant)
│   │
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing/redirect
│   └── globals.css               # Global styles
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── slider.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── AuthGuard.tsx
│   │   └── ResumePrompt.tsx      # First-login resume upload modal
│   │
│   ├── jobs/
│   │   ├── JobCard.tsx           # Individual job card
│   │   ├── JobList.tsx           # Job listing grid/list
│   │   ├── JobFilters.tsx        # Filter sidebar
│   │   ├── JobSearch.tsx         # Search bar
│   │   ├── MatchBadge.tsx        # Score badge component
│   │   ├── BestMatches.tsx       # Top matches section
│   │   └── JobSkeleton.tsx       # Loading skeleton
│   │
│   ├── applications/
│   │   ├── ApplicationCard.tsx
│   │   ├── ApplicationList.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── StatusUpdateModal.tsx
│   │   ├── Timeline.tsx
│   │   └── ApplicationStats.tsx
│   │
│   ├── resume/
│   │   ├── ResumeUpload.tsx
│   │   ├── ResumePreview.tsx
│   │   ├── SkillsDisplay.tsx
│   │   └── ResumeAnalysis.tsx
│   │
│   ├── chat/
│   │   ├── AISidebar.tsx         # Main sidebar container
│   │   ├── ChatMessage.tsx       # Individual message
│   │   ├── ChatInput.tsx         # Input with suggestions
│   │   ├── SuggestedQueries.tsx  # Quick action chips
│   │   └── ChatHistory.tsx       # Message history
│   │
│   ├── popup/
│   │   ├── ApplicationPopup.tsx  # Smart tracking popup
│   │   └── PopupProvider.tsx     # Context for popup management
│   │
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── Footer.tsx
│       └── MobileNav.tsx
│
├── lib/
│   ├── firebase.ts               # Firebase config
│   ├── mongodb.ts                # MongoDB connection
│   ├── cloudinary.ts             # Cloudinary config
│   ├── redis.ts                  # Upstash Redis client
│   ├── openrouter.ts             # OpenRouter API client
│   ├── jobsApi.ts                # JSearch/Adzuna wrapper
│   └── utils.ts                  # Utility functions
│
├── hooks/
│   ├── useAuth.ts                # Authentication hook
│   ├── useJobs.ts                # Jobs fetching hook
│   ├── useApplications.ts        # Applications hook
│   ├── useResume.ts              # Resume management hook
│   ├── useChat.ts                # AI chat hook
│   ├── useFilters.ts             # Filter state hook
│   └── usePopup.ts               # Popup management hook
│
├── store/
│   ├── useAppStore.ts            # Main Zustand store
│   ├── useFilterStore.ts         # Filter state
│   └── useChatStore.ts           # Chat history state
│
├── types/
│   ├── job.ts                    # Job-related types
│   ├── application.ts            # Application types
│   ├── user.ts                   # User types
│   ├── resume.ts                 # Resume types
│   └── chat.ts                   # Chat types
│
└── utils/
    ├── constants.ts              # App constants
    ├── validators.ts             # Zod schemas
    └── helpers.ts                # Helper functions
```

---

## 5. Database Schema

### 5.1 MongoDB Collections

#### 5.1.1 Users Collection

```typescript
// Collection: users
interface User {
  _id: ObjectId;

  // Firebase Auth Reference
  firebaseUid: string;              // Firebase UID (indexed, unique)

  // Basic Info
  email: string;                    // User email (indexed, unique)
  displayName: string;              // Full name
  photoURL?: string;                // Profile picture URL

  // Resume Data
  resume: {
    fileUrl: string;                // Cloudinary URL
    fileName: string;               // Original filename
    fileType: 'pdf' | 'txt';        // File type
    uploadedAt: Date;               // Upload timestamp
    cloudinaryPublicId: string;     // For deletion/updates

    // Extracted Data
    extractedText: string;          // Raw text content
    parsedData: {
      skills: string[];             // Extracted skills
      experience: {
        title: string;
        company: string;
        duration: string;
        description: string;
      }[];
      education: {
        degree: string;
        institution: string;
        year: string;
      }[];
      summary: string;              // Professional summary
      totalYearsExperience: number; // Calculated
    };
  } | null;

  // Preferences
  preferences: {
    desiredRoles: string[];         // Preferred job titles
    desiredLocations: string[];     // Preferred locations
    workMode: ('remote' | 'hybrid' | 'onsite')[];
    jobTypes: ('full-time' | 'part-time' | 'contract' | 'internship')[];
    salaryRange?: {
      min: number;
      max: number;
      currency: string;
    };
  };

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  onboardingCompleted: boolean;     // Has uploaded resume
}

// Indexes
// - { firebaseUid: 1 } unique
// - { email: 1 } unique
// - { "resume.parsedData.skills": 1 }
```

#### 5.1.2 Applications Collection

```typescript
// Collection: applications
interface Application {
  _id: ObjectId;

  // References
  userId: ObjectId;                 // Reference to users collection

  // Job Details (denormalized for quick access)
  job: {
    externalId: string;             // External API job ID
    title: string;
    company: string;
    location: string;
    description: string;
    jobType: string;
    workMode: string;
    salary?: string;
    url: string;                    // Application URL
    postedAt: Date;
  };

  // Match Data
  matchScore: number;               // 0-100
  matchReasons: string[];           // Why it matched

  // Application Status
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn';

  // Status History (Timeline)
  statusHistory: {
    status: string;
    timestamp: Date;
    notes?: string;
  }[];

  // Application Details
  appliedAt: Date;
  appliedVia: 'direct' | 'earlier'; // How they confirmed application

  // Notes
  notes: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Indexes
// - { userId: 1, "job.externalId": 1 } unique (prevent duplicates)
// - { userId: 1, status: 1 }
// - { userId: 1, createdAt: -1 }
// - { userId: 1, matchScore: -1 }
```

#### 5.1.3 Chat History Collection

```typescript
// Collection: chatHistory
interface ChatHistory {
  _id: ObjectId;

  userId: ObjectId;

  messages: {
    id: string;                     // UUID for frontend
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;

    // For assistant messages with job results
    metadata?: {
      type: 'job_results' | 'help' | 'general';
      jobIds?: string[];            // Referenced job IDs
      filters?: object;             // Filters used
    };
  }[];

  // Session Info
  sessionStartedAt: Date;
  lastMessageAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

// Indexes
// - { userId: 1, sessionStartedAt: -1 }
// - { userId: 1, lastMessageAt: -1 }
```

#### 5.1.4 Pending Applications Collection (Temporary Storage)

```typescript
// Collection: pendingApplications
interface PendingApplication {
  _id: ObjectId;

  userId: ObjectId;

  job: {
    externalId: string;
    title: string;
    company: string;
    url: string;
  };

  // When user clicked "Apply"
  clickedAt: Date;

  // Auto-expire after 30 minutes if not confirmed
  expiresAt: Date;

  createdAt: Date;
}

// Indexes
// - { userId: 1, "job.externalId": 1 } unique
// - { expiresAt: 1 } TTL index (auto-delete)
```

### 5.2 Redis Cache Schema (Upstash)

```typescript
// Key Patterns and TTLs

// Job Search Results Cache
// Key: jobs:{query_hash}
// TTL: 15 minutes
// Value: JSON stringified job results
{
  jobs: Job[];
  total: number;
  cachedAt: number;
}

// User Resume Cache (for quick AI access)
// Key: resume:{userId}
// TTL: 1 hour
// Value: Extracted resume text + skills
{
  text: string;
  skills: string[];
  experience: string;
}

// Match Scores Cache
// Key: match:{userId}:{jobs_hash}
// TTL: 30 minutes
// Value: Job ID to score mapping
{
  [jobId: string]: {
    score: number;
    reasons: string[];
  }
}

// Rate Limiting
// Key: ratelimit:{userId}:{endpoint}
// TTL: 1 minute
// Value: Request count
number

// User Session Cache
// Key: session:{userId}
// TTL: 24 hours
// Value: User preferences + resume summary
{
  preferences: object;
  resumeSummary: string;
}
```

### 5.3 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           ENTITY RELATIONSHIP DIAGRAM                                │
└─────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────────┐
                                    │    FIREBASE      │
                                    │      AUTH        │
                                    │                  │
                                    │  firebaseUid ────┼──────┐
                                    └──────────────────┘      │
                                                              │
                                                              │ 1:1
                                                              ▼
┌─────────────────────┐           ┌──────────────────────────────────────┐
│      CLOUDINARY     │           │               USERS                   │
│                     │           │                                       │
│  ┌───────────────┐  │    1:1    │  _id (PK)                            │
│  │ Resume Files  │◄─┼───────────┼─ firebaseUid (FK, unique)            │
│  │               │  │           │  email                                │
│  │ publicId      │  │           │  displayName                          │
│  │ secureUrl     │  │           │  resume: {                            │
│  └───────────────┘  │           │    fileUrl ─────────────────────────┐ │
└─────────────────────┘           │    parsedData: {...}                │ │
                                  │  }                                   │ │
                                  │  preferences: {...}                  │ │
                                  └──────────────┬───────────────────────┘ │
                                                 │                         │
                                                 │ 1:N                     │
                                                 │                         │
                    ┌────────────────────────────┼────────────────────────┐│
                    │                            │                        ││
                    ▼                            ▼                        ▼│
     ┌──────────────────────────┐  ┌──────────────────────────┐  ┌──────────┐
     │      APPLICATIONS        │  │     PENDING_APPLICATIONS │  │CLOUDINARY│
     │                          │  │                          │  └──────────┘
     │  _id (PK)                │  │  _id (PK)                │
     │  userId (FK) ────────────┼──┼─ userId (FK)             │
     │  job: {                  │  │  job: {                  │
     │    externalId            │  │    externalId            │
     │    title                 │  │    title                 │
     │    company               │  │    company               │
     │    ...                   │  │    url                   │
     │  }                       │  │  }                       │
     │  matchScore              │  │  clickedAt               │
     │  matchReasons[]          │  │  expiresAt (TTL)         │
     │  status                  │  │                          │
     │  statusHistory[]         │  └──────────────────────────┘
     │  appliedAt               │
     │  notes                   │            ┌──────────────────────────┐
     └──────────────────────────┘            │      CHAT_HISTORY        │
                                             │                          │
                                             │  _id (PK)                │
                                             │  userId (FK) ────────────┤
                                             │  messages: [{            │
                                             │    role                  │
                                             │    content               │
                                             │    timestamp             │
                                             │    metadata              │
                                             │  }]                      │
                                             │  sessionStartedAt        │
                                             └──────────────────────────┘

                    ┌─────────────────────────────────────────────────────┐
                    │                  EXTERNAL APIS                       │
                    │                                                      │
                    │  ┌─────────────┐              ┌─────────────┐       │
                    │  │   JSEARCH   │              │   ADZUNA    │       │
                    │  │  (RapidAPI) │              │    API      │       │
                    │  │             │              │             │       │
                    │  │ Returns:    │              │ Returns:    │       │
                    │  │ - Jobs      │              │ - Jobs      │       │
                    │  │ - externalId│              │ - externalId│       │
                    │  └─────────────┘              └─────────────┘       │
                    │         │                            │              │
                    │         └────────────┬───────────────┘              │
                    │                      │                              │
                    │                      ▼                              │
                    │            ┌─────────────────┐                      │
                    │            │  UPSTASH REDIS  │                      │
                    │            │     CACHE       │                      │
                    │            │                 │                      │
                    │            │ - Job results   │                      │
                    │            │ - Match scores  │                      │
                    │            │ - Resume cache  │                      │
                    │            │ - Rate limits   │                      │
                    │            └─────────────────┘                      │
                    └─────────────────────────────────────────────────────┘
```

---

## 6. Feature Specifications

### 6.1 Authentication System (Firebase)

#### 6.1.1 Feature Overview

| Aspect | Specification |
|--------|---------------|
| Auth Provider | Firebase Authentication |
| Methods | Email/Password, Google OAuth |
| Session | Firebase ID Token (JWT) |
| Persistence | Browser local storage |

#### 6.1.2 User Flows

**Registration Flow:**
```
1. User clicks "Sign Up"
2. Choose: Email/Password OR Google
3. If Email:
   - Enter email, password, confirm password
   - Validate: email format, password strength (8+ chars, 1 number, 1 special)
   - Create Firebase user
   - Send email verification
4. If Google:
   - Redirect to Google OAuth
   - Return with credentials
5. Create MongoDB user document
6. Redirect to Resume Upload (onboarding)
```

**Login Flow:**
```
1. User clicks "Login"
2. Choose: Email/Password OR Google
3. Authenticate with Firebase
4. Fetch MongoDB user data
5. Check onboardingCompleted flag
6. If false → Redirect to Resume Upload
7. If true → Redirect to Job Feed
```

**Resume Prompt on First Login:**
```
┌──────────────────────────────────────────────────────────────────┐
│                    Welcome to JobTracker!                        │
│                                                                  │
│     To get personalized job matches, please upload your resume   │
│                                                                  │
│     ┌─────────────────────────────────────────────────────┐     │
│     │                                                     │     │
│     │          📄 Drop your resume here                   │     │
│     │              or click to browse                     │     │
│     │                                                     │     │
│     │          Supported: PDF, TXT (Max 5MB)             │     │
│     └─────────────────────────────────────────────────────┘     │
│                                                                  │
│     [Skip for now]                          [Upload & Continue]  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### 6.1.3 Technical Implementation

```typescript
// lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User } from '@/types/user';

interface AuthState {
  firebaseUser: FirebaseUser | null;
  dbUser: User | null;
  loading: boolean;
  error: Error | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    dbUser: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user data from MongoDB
          const token = await firebaseUser.getIdToken();
          const response = await fetch('/api/user/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const dbUser = await response.json();

          setState({
            firebaseUser,
            dbUser,
            loading: false,
            error: null,
          });
        } catch (error) {
          setState({
            firebaseUser,
            dbUser: null,
            loading: false,
            error: error as Error,
          });
        }
      } else {
        setState({
          firebaseUser: null,
          dbUser: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return state;
}
```

---

### 6.2 Resume Upload & Extraction

#### 6.2.1 Feature Overview

| Aspect | Specification |
|--------|---------------|
| Supported Formats | PDF, TXT |
| Max File Size | 5MB |
| Storage | Cloudinary |
| Extraction | pdf-parse (server-side) |
| AI Enhancement | OpenRouter for skill extraction |

#### 6.2.2 Upload Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           RESUME UPLOAD FLOW                                         │
└─────────────────────────────────────────────────────────────────────────────────────┘

  User                  Frontend               API                Cloudinary       MongoDB
    │                      │                    │                     │               │
    │  Select PDF/TXT      │                    │                     │               │
    │─────────────────────▶│                    │                     │               │
    │                      │                    │                     │               │
    │                      │  Validate file     │                     │               │
    │                      │  (type, size)      │                     │               │
    │                      │                    │                     │               │
    │                      │  POST /api/resume  │                     │               │
    │                      │───────────────────▶│                     │               │
    │                      │                    │                     │               │
    │                      │                    │  Upload file        │               │
    │                      │                    │────────────────────▶│               │
    │                      │                    │                     │               │
    │                      │                    │  Return URL +       │               │
    │                      │                    │  publicId           │               │
    │                      │                    │◀────────────────────│               │
    │                      │                    │                     │               │
    │                      │                    │  Extract text       │               │
    │                      │                    │  (pdf-parse)        │               │
    │                      │                    │                     │               │
    │                      │                    │  AI: Parse skills   │               │
    │                      │                    │  & experience       │               │
    │                      │                    │  (OpenRouter)       │               │
    │                      │                    │                     │               │
    │                      │                    │  Save to user doc   │               │
    │                      │                    │─────────────────────────────────────▶
    │                      │                    │                     │               │
    │                      │  Return parsed     │                     │               │
    │                      │  resume data       │                     │               │
    │                      │◀───────────────────│                     │               │
    │                      │                    │                     │               │
    │  Show extracted      │                    │                     │               │
    │  skills & summary    │                    │                     │               │
    │◀─────────────────────│                    │                     │               │
```

#### 6.2.3 Resume Parsing with AI

```typescript
// Prompt for AI Resume Parsing
const RESUME_PARSE_PROMPT = `
Analyze this resume and extract structured information.

Resume Text:
"""
{resumeText}
"""

Extract and return a JSON object with:
{
  "skills": ["skill1", "skill2", ...],  // Technical and soft skills
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start - End",
      "description": "Brief description"
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "School Name",
      "year": "Graduation Year"
    }
  ],
  "summary": "2-3 sentence professional summary",
  "totalYearsExperience": number
}

Return ONLY valid JSON, no markdown or explanation.
`;
```

#### 6.2.4 UI Components

**Resume Upload Component:**
```typescript
// components/resume/ResumeUpload.tsx
interface ResumeUploadProps {
  onUploadComplete: (data: ParsedResume) => void;
  existingResume?: {
    fileName: string;
    uploadedAt: Date;
  };
}

// Features:
// - Drag and drop zone
// - File type validation (PDF/TXT only)
// - File size validation (5MB max)
// - Progress indicator during upload
// - Preview of extracted data
// - Replace existing resume option
```

**Resume Preview Component:**
```typescript
// components/resume/ResumePreview.tsx
interface ResumePreviewProps {
  resume: {
    fileName: string;
    uploadedAt: Date;
    parsedData: {
      skills: string[];
      experience: Experience[];
      education: Education[];
      summary: string;
    };
  };
  onReplace: () => void;
}

// Display:
// - File info (name, upload date)
// - Extracted skills as tags
// - Experience timeline
// - Education list
// - "Replace Resume" button
```

---

### 6.3 Job Feed & Filtering

#### 6.3.1 Feature Overview

| Aspect | Specification |
|--------|---------------|
| Data Source | JSearch API (RapidAPI) primary, Adzuna fallback |
| Results per page | 20 jobs |
| Caching | 15 minutes in Redis |
| Default Sort | Match Score (descending) |

#### 6.3.2 Filter Specifications

| Filter | Type | Options | Default |
|--------|------|---------|---------|
| Search Query | Text input | Free text | Empty |
| Skills | Multi-select | React, Node.js, Python, Java, TypeScript, JavaScript, AWS, Docker, Kubernetes, SQL, MongoDB, Go, Rust, C++, C#, Ruby, PHP, Swift, Kotlin, etc. | None |
| Date Posted | Single select | Last 24 hours, Last week, Last month, Any time | Any time |
| Job Type | Multi-select | Full-time, Part-time, Contract, Internship | All |
| Work Mode | Multi-select | Remote, Hybrid, On-site | All |
| Location | Text input with autocomplete | City/Region | Empty |
| Match Score | Range slider | 0-100% OR presets: High (>70%), Medium (40-70%), All | All |

#### 6.3.3 Job Card Design

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                  JOB CARD DESIGN                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  ┌──────────┐   Software Engineer                    ┌────────────────┐   │
│  │  LOGO    │   Google                               │   85% Match    │   │
│  │          │   Mountain View, CA · Remote           │   ████████░░   │   │
│  └──────────┘                                        │   (Green)      │   │
│                                                      └────────────────┘   │
│  ─────────────────────────────────────────────────────────────────────    │
│                                                                            │
│  We are looking for a talented Software Engineer to join our team...       │
│  You will work on cutting-edge projects using modern technologies...       │
│  [Read more]                                                               │
│                                                                            │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                  │
│  │ React  │ │Node.js │ │  AWS   │ │TypeScript│ │ +3    │                  │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘                  │
│                                                                            │
│  📅 Posted 2 days ago    💼 Full-time    🏠 Remote                         │
│                                                                            │
│  Why it matches:                                                           │
│  • 5 matching skills: React, Node.js, AWS, TypeScript, MongoDB            │
│  • Experience level aligns (3-5 years required, you have 4)               │
│  • Remote preference matches                                              │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────    │
│                                                                            │
│  [💾 Save]                                               [Apply Now →]    │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

Match Badge Colors:
┌──────────────────────────────────────────────────────────────┐
│  🟢 Green (>70%)  │  🟡 Yellow (40-70%)  │  ⚪ Gray (<40%)   │
└──────────────────────────────────────────────────────────────┘
```

#### 6.3.4 Best Matches Section

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              BEST MATCHES SECTION                                    │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────┐
│  ⭐ Best Matches for You                                          [View All →]     │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────┐  │
│  │ 92% Match        │ │ 89% Match        │ │ 87% Match        │ │ 85% Match    │  │
│  │ ────────────     │ │ ────────────     │ │ ────────────     │ │ ──────────   │  │
│  │ Sr. Frontend Dev │ │ Full Stack Eng   │ │ React Developer  │ │ Node.js Dev  │  │
│  │ Meta             │ │ Stripe           │ │ Airbnb           │ │ Netflix      │  │
│  │ Remote           │ │ SF, CA · Hybrid  │ │ Remote           │ │ Los Gatos    │  │
│  │                  │ │                  │ │                  │ │              │  │
│  │ [Apply →]        │ │ [Apply →]        │ │ [Apply →]        │ │ [Apply →]    │  │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────┘  │
│                                                                                    │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────┐  │
│  │ 84% Match        │ │ 82% Match        │ │ 80% Match        │ │ 78% Match    │  │
│  │ ────────────     │ │ ────────────     │ │ ────────────     │ │ ──────────   │  │
│  │ UI Engineer      │ │ Software Eng II  │ │ Frontend Arch    │ │ Web Dev      │  │
│  │ Figma            │ │ Microsoft        │ │ Shopify          │ │ Spotify      │  │
│  │ SF, CA           │ │ Redmond · Remote │ │ Remote           │ │ Stockholm    │  │
│  │                  │ │                  │ │                  │ │              │  │
│  │ [Apply →]        │ │ [Apply →]        │ │ [Apply →]        │ │ [Apply →]    │  │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────┘  │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘

Displays 6-8 highest scoring jobs (>70% match)
```

#### 6.3.5 Page Layout

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  JobTracker    [Jobs]  [Dashboard]  [Profile]              🔔  [👤 John]           │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌───────────────────────────────────────────────────────────────────────────────┐ │
│  │  🔍 Search jobs by title, company, or keywords...                [Search]     │ │
│  └───────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│  ┌─────────────────┐  ┌───────────────────────────────────────────┐  ┌───────────┐ │
│  │                 │  │                                           │  │           │ │
│  │    FILTERS      │  │           BEST MATCHES SECTION            │  │    AI     │ │
│  │                 │  │           (6-8 top scoring jobs)          │  │  SIDEBAR  │ │
│  │  Skills:        │  │                                           │  │           │ │
│  │  [x] React      │  ├───────────────────────────────────────────┤  │  Chat     │ │
│  │  [x] Node.js    │  │                                           │  │  with     │ │
│  │  [ ] Python     │  │           JOB LISTINGS                    │  │  AI       │ │
│  │  [ ] Java       │  │                                           │  │  Assistant│ │
│  │  ...            │  │  ┌─────────────────────────────────────┐  │  │           │ │
│  │                 │  │  │         Job Card 1                  │  │  │  "Show me │ │
│  │  Date Posted:   │  │  └─────────────────────────────────────┘  │  │  remote   │ │
│  │  ○ Last 24h     │  │  ┌─────────────────────────────────────┐  │  │  React    │ │
│  │  ○ Last week    │  │  │         Job Card 2                  │  │  │  jobs"    │ │
│  │  ● Last month   │  │  └─────────────────────────────────────┘  │  │           │ │
│  │  ○ Any time     │  │  ┌─────────────────────────────────────┐  │  │           │ │
│  │                 │  │  │         Job Card 3                  │  │  │           │ │
│  │  Job Type:      │  │  └─────────────────────────────────────┘  │  │           │ │
│  │  [x] Full-time  │  │                                           │  │           │ │
│  │  [ ] Part-time  │  │  ...                                      │  │           │ │
│  │  [ ] Contract   │  │                                           │  │           │ │
│  │                 │  │  ─────────────────────────────────────    │  │           │ │
│  │  Work Mode:     │  │  [← Prev]  Page 1 of 10  [Next →]        │  │           │ │
│  │  [x] Remote     │  │                                           │  │           │ │
│  │  [x] Hybrid     │  │                                           │  │           │ │
│  │  [ ] On-site    │  │                                           │  │           │ │
│  │                 │  │                                           │  │           │ │
│  │  Location:      │  │                                           │  │           │ │
│  │  [San Francisco]│  │                                           │  │           │ │
│  │                 │  │                                           │  │           │ │
│  │  Match Score:   │  │                                           │  │           │ │
│  │  ○ High (>70%)  │  │                                           │  │           │ │
│  │  ○ Medium       │  │                                           │  │           │ │
│  │  ● All          │  │                                           │  │           │ │
│  │                 │  │                                           │  │           │ │
│  │  [Clear All]    │  │                                           │  │           │ │
│  │  [Apply Filters]│  │                                           │  │           │ │
│  └─────────────────┘  └───────────────────────────────────────────┘  └───────────┘ │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 6.4 AI-Powered Job Matching

#### 6.4.1 Feature Overview

| Aspect | Specification |
|--------|---------------|
| AI Provider | OpenRouter API |
| Model | claude-3-haiku (fast) for scoring, claude-3-sonnet for explanations |
| Scoring Range | 0-100% |
| Caching | 30 minutes per user-jobs combination |
| Batch Size | 10 jobs per AI call for efficiency |

#### 6.4.2 Matching Algorithm

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           AI MATCHING ALGORITHM                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

SCORING COMPONENTS (Total: 100 points)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│  1. SKILL MATCH (40 points max)                                                     │
│     ─────────────────────────────                                                   │
│     • Extract required skills from job description                                  │
│     • Compare with user's resume skills                                             │
│     • Formula: (matched_skills / required_skills) × 40                              │
│     • Bonus: +5 points if user has additional relevant skills                       │
│                                                                                     │
│     Example:                                                                        │
│     Job requires: [React, Node.js, TypeScript, AWS, PostgreSQL]                     │
│     User has: [React, Node.js, TypeScript, MongoDB, Python]                         │
│     Match: 3/5 = 60% × 40 = 24 points                                               │
│                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  2. EXPERIENCE ALIGNMENT (25 points max)                                            │
│     ───────────────────────────────────                                             │
│     • Compare required years vs user's total experience                             │
│     • Check for relevant role/title match                                           │
│     • Industry relevance bonus                                                      │
│                                                                                     │
│     Scoring:                                                                        │
│     • Exact match or over-qualified: 25 points                                      │
│     • Within 1 year: 20 points                                                      │
│     • Within 2 years: 15 points                                                     │
│     • 3+ years gap: 5-10 points                                                     │
│                                                                                     │
│     Example:                                                                        │
│     Job requires: 3-5 years                                                         │
│     User has: 4 years → 25 points                                                   │
│                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  3. ROLE/TITLE RELEVANCE (20 points max)                                            │
│     ─────────────────────────────────────                                           │
│     • Semantic similarity between job title and user's experience titles            │
│     • Career progression logic (e.g., Jr → Mid → Sr)                                │
│                                                                                     │
│     Scoring:                                                                        │
│     • Exact title match: 20 points                                                  │
│     • Similar role (e.g., "Frontend Dev" ↔ "UI Engineer"): 15 points               │
│     • Related role: 10 points                                                       │
│     • Different role: 5 points                                                      │
│                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  4. PREFERENCE MATCH (15 points max)                                                │
│     ────────────────────────────────                                                │
│     • Work mode preference (Remote/Hybrid/On-site): 5 points                        │
│     • Location preference: 5 points                                                 │
│     • Job type preference (Full-time, etc.): 5 points                               │
│                                                                                     │
│     Example:                                                                        │
│     User prefers: Remote, Full-time                                                 │
│     Job offers: Remote, Full-time → 10 points                                       │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

FINAL SCORE = Skills + Experience + Role + Preferences
            = 40 + 25 + 20 + 15 = 100 max

COLOR CODING:
┌──────────────────────────────────────────────────────────────────┐
│  🟢 GREEN   │  >70%   │  Strong match, highly recommended        │
│  🟡 YELLOW  │  40-70% │  Moderate match, worth considering       │
│  ⚪ GRAY    │  <40%   │  Low match, may lack key requirements    │
└──────────────────────────────────────────────────────────────────┘
```

#### 6.4.3 AI Prompt for Scoring

```typescript
const JOB_MATCHING_PROMPT = `
You are a job matching expert. Score how well this candidate matches the job.

CANDIDATE RESUME:
"""
{resumeText}
"""

EXTRACTED CANDIDATE SKILLS: {skills}
CANDIDATE YEARS OF EXPERIENCE: {yearsExperience}

JOB POSTING:
"""
Title: {jobTitle}
Company: {company}
Description: {jobDescription}
Required Skills: {requiredSkills}
Experience Required: {experienceRequired}
Job Type: {jobType}
Work Mode: {workMode}
Location: {location}
"""

Score this match on 4 criteria (be precise):

1. SKILL_MATCH (0-40): How many required skills does the candidate have?
2. EXPERIENCE_MATCH (0-25): Does experience level align?
3. ROLE_MATCH (0-20): How relevant is their background to this role?
4. PREFERENCE_MATCH (0-15): Does job type/location/work mode align?

Return ONLY this JSON:
{
  "totalScore": <number 0-100>,
  "breakdown": {
    "skillMatch": <number 0-40>,
    "experienceMatch": <number 0-25>,
    "roleMatch": <number 0-20>,
    "preferenceMatch": <number 0-15>
  },
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "reasons": [
    "Positive: <why they match>",
    "Positive: <another reason>",
    "Gap: <what's missing>"
  ]
}
`;
```

#### 6.4.4 Batch Processing Flow

```typescript
// Efficient batch processing for 100+ jobs
async function scoreJobsBatch(
  userId: string,
  jobs: Job[],
  resume: ParsedResume
): Promise<ScoredJob[]> {
  // 1. Check cache first
  const cacheKey = `match:${userId}:${hashJobs(jobs)}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // 2. Batch jobs into groups of 10
  const batches = chunk(jobs, 10);

  // 3. Process batches in parallel (max 3 concurrent)
  const results = await pMap(
    batches,
    async (batch) => {
      const prompt = buildBatchPrompt(resume, batch);
      const response = await openrouter.chat({
        model: 'anthropic/claude-3-haiku',
        messages: [{ role: 'user', content: prompt }],
      });
      return parseBatchResponse(response, batch);
    },
    { concurrency: 3 }
  );

  // 4. Flatten and sort by score
  const scoredJobs = results.flat().sort((a, b) => b.score - a.score);

  // 5. Cache results
  await redis.setex(cacheKey, 1800, JSON.stringify(scoredJobs)); // 30 min

  return scoredJobs;
}
```

#### 6.4.5 Match Explanation Component

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          MATCH EXPLANATION UI                                        │
└─────────────────────────────────────────────────────────────────────────────────────┘

Shown on hover/click of match badge or in expanded job card view:

┌────────────────────────────────────────────────────────────────────────────┐
│  Why You Match: 85%                                                        │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Skills Match                                            32/40 ████████░░  │
│  ├─ ✅ React, Node.js, TypeScript, AWS                                     │
│  └─ ❌ Missing: Kubernetes, Terraform                                      │
│                                                                            │
│  Experience                                              25/25 ██████████  │
│  └─ ✅ 4 years matches "3-5 years required"                                │
│                                                                            │
│  Role Relevance                                          18/20 █████████░  │
│  └─ ✅ "Software Engineer" aligns with your background                     │
│                                                                            │
│  Preferences                                             10/15 ███████░░░  │
│  ├─ ✅ Remote work matches your preference                                 │
│  └─ ⚠️ Location: NYC (you preferred SF)                                    │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                            │
│  💡 Tip: This role emphasizes AWS - consider highlighting your             │
│     cloud projects in your application.                                    │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### 6.5 Smart Application Tracking (Popup Flow)

#### 6.5.1 Feature Overview

This is a **critical thinking feature** that intelligently tracks job applications without requiring manual entry.

| Aspect | Specification |
|--------|---------------|
| Trigger | User returns to app after clicking "Apply" |
| Detection | Page visibility API + pending application check |
| Timeout | Popup shows if return within 30 minutes |
| Storage | Pending: Redis (TTL 30min), Confirmed: MongoDB |

#### 6.5.2 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                      SMART APPLICATION TRACKING FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────────────┘

                              USER CLICKS "APPLY" BUTTON
                                        │
                                        ▼
                    ┌─────────────────────────────────────┐
                    │   1. Store Pending Application      │
                    │   ─────────────────────────────     │
                    │   • Save to pendingApplications     │
                    │   • Include: jobId, title, company  │
                    │   • Set TTL: 30 minutes             │
                    │   • Store clickedAt timestamp       │
                    └─────────────────────────────────────┘
                                        │
                                        ▼
                    ┌─────────────────────────────────────┐
                    │   2. Open External Job Link         │
                    │   ─────────────────────────────     │
                    │   • window.open(jobUrl, '_blank')   │
                    │   • Focus moves to new tab          │
                    └─────────────────────────────────────┘
                                        │
                                        ▼
                    ┌─────────────────────────────────────┐
                    │   3. Register Visibility Listener   │
                    │   ─────────────────────────────     │
                    │   • document.visibilitychange       │
                    │   • Detect when user returns        │
                    └─────────────────────────────────────┘
                                        │
                         ┌──────────────┴──────────────┐
                         │                             │
                         ▼                             ▼
              ┌─────────────────────┐      ┌─────────────────────┐
              │  User Returns       │      │  User Doesn't       │
              │  (within 30 min)    │      │  Return / Timeout   │
              └──────────┬──────────┘      └──────────┬──────────┘
                         │                            │
                         ▼                            ▼
              ┌─────────────────────┐      ┌─────────────────────┐
              │  4. Check Pending   │      │  TTL Expires        │
              │     Applications    │      │  Auto-cleanup       │
              │  ─────────────────  │      │  No popup needed    │
              │  • Query MongoDB    │      └─────────────────────┘
              │  • Found pending?   │
              └──────────┬──────────┘
                         │
                    ┌────┴────┐
                    │ Found?  │
                    └────┬────┘
               Yes ──────┴────── No
                │                │
                ▼                ▼
     ┌─────────────────┐   ┌─────────────────┐
     │ 5. Show Popup   │   │ No Action       │
     │ ─────────────── │   │ (Normal browse) │
     │ "Did you apply  │   └─────────────────┘
     │  to [Job]?"     │
     └────────┬────────┘
              │
    ┌─────────┼─────────┬──────────────┐
    │         │         │              │
    ▼         ▼         ▼              ▼
┌───────┐ ┌───────┐ ┌─────────┐ ┌──────────┐
│  Yes, │ │  No,  │ │ Applied │ │ Dismiss  │
│Applied│ │Browse │ │ Earlier │ │ (X)      │
└───┬───┘ └───┬───┘ └────┬────┘ └────┬─────┘
    │         │          │           │
    ▼         ▼          ▼           ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Save   │ │ Clear  │ │ Save   │ │ Clear  │
│Applied │ │Pending │ │Applied │ │Pending │
│Status  │ │ Only   │ │(Earlier│ │ Only   │
│+ Time  │ │        │ │ flag)  │ │        │
└────────┘ └────────┘ └────────┘ └────────┘
    │                      │
    └──────────┬───────────┘
               ▼
    ┌─────────────────────┐
    │ 6. Redirect to      │
    │    Dashboard        │
    │    (Optional)       │
    └─────────────────────┘
```

#### 6.5.3 Popup UI Design

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          APPLICATION CONFIRMATION POPUP                              │
└─────────────────────────────────────────────────────────────────────────────────────┘

Overlay appears when user returns to the app:

┌────────────────────────────────────────────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░┌────────────────────────────────────────────────────────┐░░░░░░░  │
│  ░░░░░░░│                                                    [X] │░░░░░░░  │
│  ░░░░░░░│                                                        │░░░░░░░  │
│  ░░░░░░░│            📝 Track Your Application                   │░░░░░░░  │
│  ░░░░░░░│                                                        │░░░░░░░  │
│  ░░░░░░░│   ─────────────────────────────────────────────────    │░░░░░░░  │
│  ░░░░░░░│                                                        │░░░░░░░  │
│  ░░░░░░░│   Did you apply to:                                    │░░░░░░░  │
│  ░░░░░░░│                                                        │░░░░░░░  │
│  ░░░░░░░│   ┌────────────────────────────────────────────────┐   │░░░░░░░  │
│  ░░░░░░░│   │  🏢  Senior Software Engineer                  │   │░░░░░░░  │
│  ░░░░░░░│   │      at Google                                 │   │░░░░░░░  │
│  ░░░░░░░│   │      Mountain View, CA · Remote                │   │░░░░░░░  │
│  ░░░░░░░│   └────────────────────────────────────────────────┘   │░░░░░░░  │
│  ░░░░░░░│                                                        │░░░░░░░  │
│  ░░░░░░░│   ─────────────────────────────────────────────────    │░░░░░░░  │
│  ░░░░░░░│                                                        │░░░░░░░  │
│  ░░░░░░░│   ┌──────────────────────────────────────────────┐     │░░░░░░░  │
│  ░░░░░░░│   │  ✅  Yes, I Applied                          │     │░░░░░░░  │
│  ░░░░░░░│   └──────────────────────────────────────────────┘     │░░░░░░░  │
│  ░░░░░░░│                                                        │░░░░░░░  │
│  ░░░░░░░│   ┌──────────────────────────────────────────────┐     │░░░░░░░  │
│  ░░░░░░░│   │  👀  No, Just Browsing                       │     │░░░░░░░  │
│  ░░░░░░░│   └──────────────────────────────────────────────┘     │░░░░░░░  │
│  ░░░░░░░│                                                        │░░░░░░░  │
│  ░░░░░░░│   ┌──────────────────────────────────────────────┐     │░░░░░░░  │
│  ░░░░░░░│   │  ⏰  I Applied Earlier                       │     │░░░░░░░  │
│  ░░░░░░░│   └──────────────────────────────────────────────┘     │░░░░░░░  │
│  ░░░░░░░│                                                        │░░░░░░░  │
│  ░░░░░░░└────────────────────────────────────────────────────────┘░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└────────────────────────────────────────────────────────────────────────────┘
```

#### 6.5.4 Technical Implementation

```typescript
// hooks/useApplicationPopup.ts
import { useEffect, useState } from 'react';
import { useVisibilityChange } from './useVisibilityChange';

interface PendingApplication {
  jobId: string;
  title: string;
  company: string;
  location: string;
  clickedAt: Date;
}

export function useApplicationPopup() {
  const [pendingApp, setPendingApp] = useState<PendingApplication | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const isVisible = useVisibilityChange();

  // When user returns to the page
  useEffect(() => {
    if (isVisible) {
      checkPendingApplications();
    }
  }, [isVisible]);

  async function checkPendingApplications() {
    try {
      const response = await fetch('/api/applications/pending');
      const data = await response.json();

      if (data.pending) {
        setPendingApp(data.pending);
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Failed to check pending applications:', error);
    }
  }

  async function handleResponse(response: 'applied' | 'browsing' | 'earlier') {
    if (!pendingApp) return;

    try {
      await fetch('/api/applications/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: pendingApp.jobId,
          response,
        }),
      });

      setShowPopup(false);
      setPendingApp(null);

      // Optionally redirect to dashboard if applied
      if (response === 'applied' || response === 'earlier') {
        // Show success toast
        // router.push('/dashboard'); // Optional
      }
    } catch (error) {
      console.error('Failed to confirm application:', error);
    }
  }

  function handleDismiss() {
    // Clear pending without saving
    fetch('/api/applications/pending', { method: 'DELETE' });
    setShowPopup(false);
    setPendingApp(null);
  }

  return {
    showPopup,
    pendingApp,
    handleResponse,
    handleDismiss,
  };
}
```

```typescript
// components/popup/ApplicationPopup.tsx
'use client';

import { useApplicationPopup } from '@/hooks/useApplicationPopup';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Eye, Clock, X } from 'lucide-react';

export function ApplicationPopup() {
  const { showPopup, pendingApp, handleResponse, handleDismiss } =
    useApplicationPopup();

  if (!showPopup || !pendingApp) return null;

  return (
    <Dialog open={showPopup} onOpenChange={() => handleDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📝 Track Your Application
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Did you apply to:</p>

          {/* Job Card Summary */}
          <div className="rounded-lg border p-4 bg-muted/50">
            <h3 className="font-semibold">{pendingApp.title}</h3>
            <p className="text-sm text-muted-foreground">
              at {pendingApp.company}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingApp.location}
            </p>
          </div>

          {/* Response Options */}
          <div className="space-y-2">
            <Button
              variant="default"
              className="w-full justify-start"
              onClick={() => handleResponse('applied')}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Yes, I Applied
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleResponse('browsing')}
            >
              <Eye className="mr-2 h-4 w-4" />
              No, Just Browsing
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleResponse('earlier')}
            >
              <Clock className="mr-2 h-4 w-4" />
              I Applied Earlier
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

#### 6.5.5 Edge Cases Handled

| Edge Case | Solution |
|-----------|----------|
| User clicks Apply but doesn't leave page | Popup won't show (visibility didn't change) |
| User opens multiple job links | Queue popups, show one at a time |
| User closes browser before returning | TTL expires, pending application auto-deleted |
| User returns after 30+ minutes | No popup (TTL expired, natural behavior) |
| User already applied to this job | Check existing applications, skip popup |
| Network error during confirmation | Retry with exponential backoff, show error toast |
| User clicks X to dismiss | Clear pending, don't save application |
| User applies from different device | Each device session independent |
| Browser doesn't support visibility API | Fallback to focus/blur events |

#### 6.5.6 Application Status Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          APPLICATION STATUS LIFECYCLE                                │
└─────────────────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │  APPLIED │ ←── Initial status when user confirms
    └────┬─────┘
         │
         ├─────────────────────────────────────────┐
         │                                         │
         ▼                                         ▼
    ┌──────────┐                            ┌──────────┐
    │INTERVIEW │                            │ REJECTED │
    └────┬─────┘                            └──────────┘
         │
         ├─────────────────────────────────────────┐
         │                                         │
         ▼                                         ▼
    ┌──────────┐                            ┌──────────┐
    │  OFFER   │                            │ REJECTED │
    └────┬─────┘                            └──────────┘
         │
         ├─────────────────────────────────────────┐
         │                                         │
         ▼                                         ▼
    ┌──────────┐                            ┌──────────┐
    │ ACCEPTED │                            │ DECLINED │
    └──────────┘                            └──────────┘

    At any point, user can also mark as:
    ┌───────────┐
    │ WITHDRAWN │
    └───────────┘

Status Update UI:
┌────────────────────────────────────────────────────────────────────────────┐
│  Update Status for: Software Engineer at Google                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Current: Applied (Jan 15, 2026)                                           │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Select new status:                                              ▼  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Add notes (optional):                                              │   │
│  │                                                                     │   │
│  │  Got a call from recruiter, phone screen scheduled...              │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│                                         [Cancel]  [Update Status]          │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### 6.6 AI Sidebar Assistant

#### 6.6.1 Feature Overview

| Aspect | Specification |
|--------|---------------|
| Location | Right sidebar, collapsible |
| AI Model | claude-3-sonnet via OpenRouter |
| Capabilities | Job search, filtering, recommendations, platform help |
| Context | User's resume, current filters, conversation history |
| Response Time | Streaming responses for better UX |

#### 6.6.2 Supported Query Types

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          AI ASSISTANT CAPABILITIES                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘

TYPE 1: JOB SEARCH QUERIES
─────────────────────────────────────────────────────────────
• "Show me remote React jobs"
• "Find backend positions in San Francisco"
• "Give me UX jobs requiring Figma"
• "Search for internships at FAANG companies"
• "Find part-time data science roles"

AI Action: Parse intent → Apply filters → Return filtered jobs

TYPE 2: RECOMMENDATION QUERIES
─────────────────────────────────────────────────────────────
• "Which jobs have the highest match scores?"
• "What are my best matches today?"
• "Show jobs matching my Node.js experience"
• "Find jobs I'm most qualified for"
• "Recommend jobs based on my resume"

AI Action: Access match scores → Sort/filter → Explain recommendations

TYPE 3: ANALYSIS QUERIES
─────────────────────────────────────────────────────────────
• "Why did I match 85% with Google?"
• "What skills am I missing for this role?"
• "Compare my profile to this job"
• "How can I improve my match score?"

AI Action: Analyze resume vs job → Provide detailed breakdown

TYPE 4: PLATFORM HELP QUERIES
─────────────────────────────────────────────────────────────
• "Where do I see my applications?"
• "How do I upload my resume?"
• "How does matching work?"
• "How do I update my application status?"
• "What do the match colors mean?"

AI Action: Return help documentation with navigation hints

TYPE 5: CONVERSATIONAL FOLLOW-UPS
─────────────────────────────────────────────────────────────
• "Show me more like that"
• "Filter those by remote only"
• "What about entry-level positions?"
• "Apply the same search but in New York"

AI Action: Use conversation context → Modify previous query
```

#### 6.6.3 AI System Prompt

```typescript
const AI_ASSISTANT_SYSTEM_PROMPT = `
You are JobTracker AI, an intelligent assistant helping users find their perfect job match.

CONTEXT PROVIDED TO YOU:
- User's resume summary and skills
- Current page and filters applied
- Conversation history
- Available jobs data when relevant

YOUR CAPABILITIES:
1. SEARCH JOBS: Parse natural language queries into filter parameters
2. RECOMMEND: Suggest jobs based on match scores and user profile
3. EXPLAIN: Describe why jobs match or don't match the user
4. HELP: Answer questions about the platform

RESPONSE FORMAT:
For job searches, return structured JSON:
{
  "type": "job_search",
  "filters": {
    "query": "search term",
    "skills": ["skill1", "skill2"],
    "jobType": ["full-time"],
    "workMode": ["remote"],
    "location": "city",
    "datePosted": "last_week"
  },
  "explanation": "Natural language explanation of what you're searching for"
}

For recommendations:
{
  "type": "recommendation",
  "sortBy": "matchScore",
  "minScore": 70,
  "limit": 10,
  "explanation": "Here are your top matches based on..."
}

For help questions:
{
  "type": "help",
  "topic": "applications|resume|matching|filters",
  "response": "Detailed helpful response with navigation hints"
}

For general chat:
{
  "type": "chat",
  "response": "Conversational response"
}

IMPORTANT RULES:
- Always be helpful and encouraging
- When unsure, ask clarifying questions
- Reference specific job titles/companies when discussing matches
- Provide actionable advice for improving matches
- Keep responses concise but informative
`;
```

#### 6.6.4 UI Design

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              AI SIDEBAR DESIGN                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘

COLLAPSED STATE (Icon only):
┌───┐
│ 🤖│
│   │
│   │
└───┘

EXPANDED STATE:
┌──────────────────────────────────────────┐
│  🤖 AI Assistant              [─] [X]   │
├──────────────────────────────────────────┤
│                                          │
│  ┌──────────────────────────────────┐   │
│  │ 👋 Hi John! I can help you find  │   │
│  │ jobs, explain match scores, or   │   │
│  │ answer questions about the       │   │
│  │ platform. What would you like?   │   │
│  └──────────────────────────────────┘   │
│                                          │
│  Quick Actions:                          │
│  ┌────────────────────────────────────┐ │
│  │ 🔥 Show my best matches           │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │ 🏠 Find remote jobs               │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │ ❓ How does matching work?        │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ─────────────────────────────────────  │
│                                          │
│  Recent:                                 │
│  • "remote React jobs" (10 results)     │
│  • "Why 85% match with Google?"         │
│                                          │
│  ─────────────────────────────────────  │
│                                          │
│  ┌────────────────────────────────┬──┐  │
│  │ Ask anything...                │📤│  │
│  └────────────────────────────────┴──┘  │
│                                          │
└──────────────────────────────────────────┘

CONVERSATION IN PROGRESS:
┌──────────────────────────────────────────┐
│  🤖 AI Assistant              [─] [X]   │
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ 👤 Show me remote React jobs      │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ 🤖 Found 23 remote React jobs!    │ │
│  │                                    │ │
│  │ I've applied these filters:       │ │
│  │ • Skills: React                   │ │
│  │ • Work Mode: Remote               │ │
│  │                                    │ │
│  │ Your top matches:                 │ │
│  │                                    │ │
│  │ ┌────────────────────────────┐    │ │
│  │ │ 92% Senior React Dev       │    │ │
│  │ │     @ Stripe               │    │ │
│  │ │     [View] [Apply]         │    │ │
│  │ └────────────────────────────┘    │ │
│  │ ┌────────────────────────────┐    │ │
│  │ │ 88% Frontend Engineer      │    │ │
│  │ │     @ Vercel               │    │ │
│  │ │     [View] [Apply]         │    │ │
│  │ └────────────────────────────┘    │ │
│  │                                    │ │
│  │ [Show all 23 results]             │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────┬──┐  │
│  │ Filter by full-time only...   │📤│  │
│  └────────────────────────────────┴──┘  │
│                                          │
└──────────────────────────────────────────┘
```

#### 6.6.5 Technical Implementation

```typescript
// api/chat/route.ts
import { OpenRouter } from '@/lib/openrouter';
import { getUser } from '@/lib/auth';
import { getResumeSummary } from '@/lib/resume';
import { searchJobs } from '@/lib/jobs';

export async function POST(req: Request) {
  const { message, conversationHistory } = await req.json();
  const user = await getUser(req);

  // Build context
  const resumeSummary = await getResumeSummary(user.id);
  const currentFilters = req.headers.get('x-current-filters');

  const systemPrompt = AI_ASSISTANT_SYSTEM_PROMPT;
  const contextPrompt = `
USER CONTEXT:
- Name: ${user.displayName}
- Skills: ${resumeSummary.skills.join(', ')}
- Experience: ${resumeSummary.yearsExperience} years
- Current Page Filters: ${currentFilters || 'none'}
`;

  // Call OpenRouter with streaming
  const stream = await OpenRouter.chat.completions.create({
    model: 'anthropic/claude-3-sonnet',
    messages: [
      { role: 'system', content: systemPrompt + contextPrompt },
      ...conversationHistory,
      { role: 'user', content: message },
    ],
    stream: true,
  });

  // Return streaming response
  return new Response(stream.toReadableStream(), {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
```

```typescript
// hooks/useChat.ts
import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    type: 'job_search' | 'recommendation' | 'help' | 'chat';
    jobs?: Job[];
    filters?: FilterState;
  };
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Start streaming
    setIsStreaming(true);
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: content,
        conversationHistory: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    // Handle streaming response
    const reader = response.body?.getReader();
    let assistantContent = '';

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      assistantContent += chunk;

      // Update message with streamed content
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? { ...m, content: assistantContent }
            : m
        )
      );
    }

    setIsStreaming(false);

    // Parse response for actions
    try {
      const parsed = JSON.parse(assistantContent);
      if (parsed.type === 'job_search' && parsed.filters) {
        // Apply filters to main job feed
        applyFilters(parsed.filters);
      }
    } catch {
      // Regular chat message, no action needed
    }
  }, [messages]);

  return {
    messages,
    sendMessage,
    isStreaming,
    clearHistory: () => setMessages([]),
  };
}
```

---

### 6.7 Application Dashboard

#### 6.7.1 Feature Overview

| Aspect | Specification |
|--------|---------------|
| Purpose | Track and manage all job applications |
| Views | List view, Kanban board, Timeline |
| Filters | Status, Date range, Match score, Company |
| Statistics | Total, by status, response rate |

#### 6.7.2 Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION DASHBOARD                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────┐
│  JobTracker    [Jobs]  [Dashboard]  [Profile]              🔔  [👤 John]           │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  📊 My Applications                                         View: [List ▼] [Board]│
│                                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                           STATISTICS CARDS                                   │  │
│  │                                                                              │  │
│  │  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ │  │
│  │  │     Total      │ │    Applied     │ │   Interview    │ │     Offers     │ │  │
│  │  │      47        │ │      32        │ │       12       │ │       3        │ │  │
│  │  │                │ │    (68%)       │ │     (26%)      │ │     (6%)       │ │  │
│  │  │  ↑ 8 this week │ │                │ │  ↑ 2 scheduled │ │  🎉 New!       │ │  │
│  │  └────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘ │  │
│  │                                                                              │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────────────┐ │
│  │ Filters: [All Statuses ▼] [All Time ▼] [All Companies ▼]    🔍 Search...    │ │
│  └──────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                    │
│  LIST VIEW:                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────┐ │
│  │ Company        │ Role                  │ Status     │ Applied    │ Actions   │ │
│  ├──────────────────────────────────────────────────────────────────────────────┤ │
│  │ 🏢 Google      │ Senior Software Eng   │ 🟢 Offer   │ Jan 5      │ [···]     │ │
│  │ 🏢 Meta        │ Frontend Developer    │ 🟡 Interview│ Jan 8     │ [···]     │ │
│  │ 🏢 Stripe      │ Full Stack Engineer   │ 🟡 Interview│ Jan 10    │ [···]     │ │
│  │ 🏢 Airbnb      │ React Developer       │ 🔵 Applied │ Jan 12     │ [···]     │ │
│  │ 🏢 Netflix     │ Backend Engineer      │ 🔵 Applied │ Jan 14     │ [···]     │ │
│  │ 🏢 Uber        │ Software Engineer     │ 🔴 Rejected│ Jan 3      │ [···]     │ │
│  │ ...            │ ...                   │ ...        │ ...        │ ...       │ │
│  └──────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                    │
│  [← Prev]                     Page 1 of 5                              [Next →]   │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘

KANBAN BOARD VIEW:
┌────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                    │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐  │
│  │ 🔵 APPLIED (32) │ │ 🟡 INTERVIEW(12)│ │ 🟢 OFFER (3)    │ │ 🔴 REJECTED (8) │  │
│  ├─────────────────┤ ├─────────────────┤ ├─────────────────┤ ├─────────────────┤  │
│  │                 │ │                 │ │                 │ │                 │  │
│  │ ┌─────────────┐ │ │ ┌─────────────┐ │ │ ┌─────────────┐ │ │ ┌─────────────┐ │  │
│  │ │ Airbnb      │ │ │ │ Meta        │ │ │ │ Google      │ │ │ │ Uber        │ │  │
│  │ │ React Dev   │ │ │ │ Frontend    │ │ │ │ Sr. SWE     │ │ │ │ SWE         │ │  │
│  │ │ 85% match   │ │ │ │ Phone: 1/20 │ │ │ │ $180k/yr    │ │ │ │ Jan 3       │ │  │
│  │ │ Jan 12      │ │ │ │ 88% match   │ │ │ │ Respond by  │ │ │ │             │ │  │
│  │ └─────────────┘ │ │ └─────────────┘ │ │ │ Jan 25      │ │ │ └─────────────┘ │  │
│  │                 │ │                 │ │ └─────────────┘ │ │                 │  │
│  │ ┌─────────────┐ │ │ ┌─────────────┐ │ │                 │ │ ┌─────────────┐ │  │
│  │ │ Netflix     │ │ │ │ Stripe      │ │ │ ┌─────────────┐ │ │ │ Lyft        │ │  │
│  │ │ Backend     │ │ │ │ Full Stack  │ │ │ │ Vercel      │ │ │ │ Backend     │ │  │
│  │ │ 78% match   │ │ │ │ Onsite: 1/22│ │ │ │ Frontend    │ │ │ │ Dec 28      │ │  │
│  │ │ Jan 14      │ │ │ │ 92% match   │ │ │ │ $165k/yr    │ │ │ │             │ │  │
│  │ └─────────────┘ │ │ └─────────────┘ │ │ └─────────────┘ │ │ └─────────────┘ │  │
│  │                 │ │                 │ │                 │ │                 │  │
│  │ ┌─────────────┐ │ │ ┌─────────────┐ │ │ ┌─────────────┐ │ │ ...             │  │
│  │ │ Shopify     │ │ │ │ ...         │ │ │ │ Figma       │ │ │                 │  │
│  │ │ ...         │ │ │ └─────────────┘ │ │ │ ...         │ │ │                 │  │
│  │ └─────────────┘ │ │                 │ │ └─────────────┘ │ │                 │  │
│  │                 │ │                 │ │                 │ │                 │  │
│  │ + 29 more       │ │ + 9 more        │ │                 │ │ + 6 more        │  │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘  │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

#### 6.7.3 Application Detail View

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         APPLICATION DETAIL MODAL                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│                                                                        [X] │
│                                                                            │
│  ┌──────────┐   Senior Software Engineer                   ┌────────────┐ │
│  │  GOOGLE  │   Google                                     │  🟢 OFFER  │ │
│  │   LOGO   │   Mountain View, CA · Hybrid                 │  ▼ Update  │ │
│  └──────────┘                                              └────────────┘ │
│                                                                            │
│  ──────────────────────────────────────────────────────────────────────── │
│                                                                            │
│  📊 Match Score: 85%                                                       │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │ Skills: 32/40  Experience: 25/25  Role: 18/20  Prefs: 10/15       │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ──────────────────────────────────────────────────────────────────────── │
│                                                                            │
│  📅 Timeline                                                               │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                                                                    │   │
│  │  ●──────────●──────────●──────────●                                │   │
│  │  │          │          │          │                                │   │
│  │ Applied  Phone Screen  Onsite   Offer                              │   │
│  │ Jan 5    Jan 10        Jan 15   Jan 18                             │   │
│  │                                                                    │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ──────────────────────────────────────────────────────────────────────── │
│                                                                            │
│  📝 Notes                                                                  │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │ Jan 18: Received offer! $180k base + equity. Need to respond by   │   │
│  │ Jan 25. Negotiating for higher base.                              │   │
│  │                                                                    │   │
│  │ Jan 15: Onsite went well. Met with 5 interviewers. System design  │   │
│  │ question was challenging but I think I did okay.                  │   │
│  │                                                                    │   │
│  │ Jan 10: Phone screen with hiring manager. Discussed team projects │   │
│  │ and my React experience.                                          │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  [+ Add Note]                                                              │
│                                                                            │
│  ──────────────────────────────────────────────────────────────────────── │
│                                                                            │
│  [🔗 View Original Posting]        [🗑️ Remove Application]                │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

#### 6.7.4 Dashboard Components

```typescript
// Types for Dashboard
interface ApplicationStats {
  total: number;
  byStatus: {
    applied: number;
    interview: number;
    offer: number;
    rejected: number;
    withdrawn: number;
  };
  thisWeek: number;
  responseRate: number; // (interview + offer + rejected) / total
  avgTimeToResponse: number; // days
}

interface DashboardFilters {
  status: ApplicationStatus | 'all';
  dateRange: 'week' | 'month' | 'quarter' | 'year' | 'all';
  company: string;
  search: string;
  sortBy: 'date' | 'company' | 'status' | 'matchScore';
  sortOrder: 'asc' | 'desc';
}

---

## 7. API Specifications

### 7.1 API Overview

| Base URL | Authentication | Rate Limiting |
|----------|----------------|---------------|
| `/api/*` | Firebase ID Token (Bearer) | 100 req/min per user |

### 7.2 Authentication Endpoints

#### POST /api/auth/register
Create a new user account after Firebase registration.

**Request:**
```typescript
{
  firebaseUid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}
```

**Response (201):**
```typescript
{
  success: true;
  user: {
    id: string;
    email: string;
    displayName: string;
    onboardingCompleted: false;
  }
}
```

**Errors:**
| Code | Description |
|------|-------------|
| 400 | Invalid request body |
| 409 | User already exists |
| 500 | Database error |

---

#### GET /api/auth/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

**Response (200):**
```typescript
{
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  resume: ResumeData | null;
  preferences: UserPreferences;
  onboardingCompleted: boolean;
  createdAt: string;
}
```

**Errors:**
| Code | Description |
|------|-------------|
| 401 | Missing or invalid token |
| 404 | User not found |

---

### 7.3 Resume Endpoints

#### POST /api/resume/upload
Upload and parse a resume file.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request:**
```
file: File (PDF or TXT, max 5MB)
```

**Response (200):**
```typescript
{
  success: true;
  resume: {
    fileUrl: string;
    fileName: string;
    fileType: 'pdf' | 'txt';
    uploadedAt: string;
    parsedData: {
      skills: string[];
      experience: Experience[];
      education: Education[];
      summary: string;
      totalYearsExperience: number;
    }
  }
}
```

**Errors:**
| Code | Description |
|------|-------------|
| 400 | Invalid file type or size |
| 401 | Unauthorized |
| 413 | File too large (>5MB) |
| 422 | Failed to parse resume |
| 500 | Upload failed |

---

#### GET /api/resume
Get current user's resume data.

**Response (200):**
```typescript
{
  resume: ResumeData | null;
}
```

---

#### DELETE /api/resume
Delete current user's resume.

**Response (200):**
```typescript
{
  success: true;
  message: "Resume deleted successfully"
}
```

---

### 7.4 Jobs Endpoints

#### GET /api/jobs
Fetch jobs with filtering and AI matching scores.

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| query | string | Search query | - |
| skills | string[] | Filter by skills | - |
| jobType | string[] | full-time, part-time, contract, internship | all |
| workMode | string[] | remote, hybrid, onsite | all |
| location | string | City or region | - |
| datePosted | string | 24h, week, month, any | any |
| minMatchScore | number | Minimum match score (0-100) | 0 |
| page | number | Page number | 1 |
| limit | number | Results per page | 20 |
| sortBy | string | matchScore, date, company | matchScore |

**Response (200):**
```typescript
{
  jobs: Array<{
    id: string;
    externalId: string;
    title: string;
    company: string;
    companyLogo?: string;
    location: string;
    description: string;
    jobType: string;
    workMode: string;
    salary?: string;
    url: string;
    postedAt: string;
    skills: string[];
    matchScore: number;
    matchReasons: string[];
    matchBreakdown: {
      skillMatch: number;
      experienceMatch: number;
      roleMatch: number;
      preferenceMatch: number;
    }
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  bestMatches: Job[]; // Top 8 jobs with score > 70%
}
```

**Errors:**
| Code | Description |
|------|-------------|
| 400 | Invalid query parameters |
| 401 | Unauthorized |
| 429 | Rate limit exceeded |
| 502 | External API error |

---

#### GET /api/jobs/:id
Get single job details with full match analysis.

**Response (200):**
```typescript
{
  job: Job;
  matchAnalysis: {
    score: number;
    breakdown: MatchBreakdown;
    matchedSkills: string[];
    missingSkills: string[];
    reasons: string[];
    tips: string[];
  }
}
```

---

### 7.5 Applications Endpoints

#### GET /api/applications
Get user's job applications.

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| status | string | Filter by status | all |
| dateRange | string | week, month, quarter, year, all | all |
| company | string | Filter by company | - |
| search | string | Search in title/company | - |
| sortBy | string | date, company, status, matchScore | date |
| sortOrder | string | asc, desc | desc |
| page | number | Page number | 1 |
| limit | number | Results per page | 20 |

**Response (200):**
```typescript
{
  applications: Application[];
  stats: {
    total: number;
    byStatus: Record<string, number>;
    thisWeek: number;
    responseRate: number;
  };
  pagination: Pagination;
}
```

---

#### POST /api/applications
Create a new application (manual entry).

**Request:**
```typescript
{
  jobId: string;
  status?: 'applied' | 'interview' | 'offer';
  notes?: string;
  appliedAt?: string; // ISO date, defaults to now
}
```

**Response (201):**
```typescript
{
  success: true;
  application: Application;
}
```

**Errors:**
| Code | Description |
|------|-------------|
| 400 | Invalid request |
| 401 | Unauthorized |
| 409 | Application already exists |

---

#### PATCH /api/applications/:id
Update application status or notes.

**Request:**
```typescript
{
  status?: ApplicationStatus;
  notes?: string;
}
```

**Response (200):**
```typescript
{
  success: true;
  application: Application;
}
```

---

#### DELETE /api/applications/:id
Delete an application.

**Response (200):**
```typescript
{
  success: true;
  message: "Application deleted"
}
```

---

#### POST /api/applications/pending
Create a pending application (when user clicks Apply).

**Request:**
```typescript
{
  jobId: string;
  jobTitle: string;
  company: string;
  jobUrl: string;
}
```

**Response (201):**
```typescript
{
  success: true;
  pendingId: string;
  expiresAt: string; // 30 minutes from now
}
```

---

#### GET /api/applications/pending
Check for pending applications (on page visibility change).

**Response (200):**
```typescript
{
  pending: {
    id: string;
    jobId: string;
    title: string;
    company: string;
    location: string;
    clickedAt: string;
  } | null;
}
```

---

#### POST /api/applications/confirm
Confirm or dismiss a pending application.

**Request:**
```typescript
{
  pendingId: string;
  response: 'applied' | 'browsing' | 'earlier';
}
```

**Response (200):**
```typescript
{
  success: true;
  application?: Application; // Only if response was 'applied' or 'earlier'
}
```

---

### 7.6 AI Chat Endpoint

#### POST /api/chat
Send a message to the AI assistant.

**Request:**
```typescript
{
  message: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  context?: {
    currentPage: string;
    currentFilters: FilterState;
  }
}
```

**Response (200 - Streaming):**
```
Content-Type: text/event-stream

data: {"type": "chunk", "content": "Found "}
data: {"type": "chunk", "content": "23 remote "}
data: {"type": "chunk", "content": "React jobs!"}
data: {"type": "done", "metadata": {"type": "job_search", "filters": {...}}}
```

**Non-streaming Response:**
```typescript
{
  response: string;
  metadata: {
    type: 'job_search' | 'recommendation' | 'help' | 'chat';
    filters?: FilterState;
    jobs?: Job[];
  }
}
```

---

### 7.7 Match Scoring Endpoint

#### POST /api/match/score
Calculate match scores for a batch of jobs.

**Request:**
```typescript
{
  jobIds: string[];
  forceRefresh?: boolean; // Skip cache
}
```

**Response (200):**
```typescript
{
  scores: Record<string, {
    score: number;
    breakdown: MatchBreakdown;
    reasons: string[];
  }>;
  fromCache: boolean;
}
```

---

### 7.8 User Preferences Endpoint

#### PATCH /api/user/preferences
Update user preferences.

**Request:**
```typescript
{
  desiredRoles?: string[];
  desiredLocations?: string[];
  workMode?: ('remote' | 'hybrid' | 'onsite')[];
  jobTypes?: ('full-time' | 'part-time' | 'contract' | 'internship')[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  }
}
```

**Response (200):**
```typescript
{
  success: true;
  preferences: UserPreferences;
}
```

---

## 8. UI/UX Specifications

### 8.1 Design System

#### 8.1.1 Color Palette

```scss
// Primary Colors
$primary-50:  #EEF2FF;
$primary-100: #E0E7FF;
$primary-500: #6366F1;  // Main brand color
$primary-600: #4F46E5;
$primary-700: #4338CA;

// Semantic Colors
$success-50:  #ECFDF5;
$success-500: #10B981;  // Green - High match
$success-600: #059669;

$warning-50:  #FFFBEB;
$warning-500: #F59E0B;  // Yellow - Medium match
$warning-600: #D97706;

$neutral-50:  #F9FAFB;
$neutral-200: #E5E7EB;
$neutral-400: #9CA3AF;  // Gray - Low match
$neutral-600: #4B5563;
$neutral-900: #111827;

$error-50:    #FEF2F2;
$error-500:   #EF4444;  // Red - Rejected
$error-600:   #DC2626;

// Background
$bg-primary:   #FFFFFF;
$bg-secondary: #F9FAFB;
$bg-tertiary:  #F3F4F6;

// Dark Mode
$dark-bg-primary:   #111827;
$dark-bg-secondary: #1F2937;
$dark-bg-tertiary:  #374151;
```

#### 8.1.2 Typography

```scss
// Font Family
$font-primary: 'Inter', -apple-system, sans-serif;
$font-mono: 'JetBrains Mono', monospace;

// Font Sizes
$text-xs:   0.75rem;   // 12px
$text-sm:   0.875rem;  // 14px
$text-base: 1rem;      // 16px
$text-lg:   1.125rem;  // 18px
$text-xl:   1.25rem;   // 20px
$text-2xl:  1.5rem;    // 24px
$text-3xl:  1.875rem;  // 30px
$text-4xl:  2.25rem;   // 36px

// Font Weights
$font-normal:   400;
$font-medium:   500;
$font-semibold: 600;
$font-bold:     700;

// Line Heights
$leading-tight:  1.25;
$leading-normal: 1.5;
$leading-relaxed: 1.625;
```

#### 8.1.3 Spacing Scale

```scss
$space-0:  0;
$space-1:  0.25rem;  // 4px
$space-2:  0.5rem;   // 8px
$space-3:  0.75rem;  // 12px
$space-4:  1rem;     // 16px
$space-5:  1.25rem;  // 20px
$space-6:  1.5rem;   // 24px
$space-8:  2rem;     // 32px
$space-10: 2.5rem;   // 40px
$space-12: 3rem;     // 48px
$space-16: 4rem;     // 64px
```

#### 8.1.4 Component Shadows

```scss
$shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
$shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1);
$shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1);
$shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1);
```

### 8.2 Responsive Breakpoints

```scss
// Mobile First
$breakpoint-sm:  640px;   // Small tablets
$breakpoint-md:  768px;   // Tablets
$breakpoint-lg:  1024px;  // Laptops
$breakpoint-xl:  1280px;  // Desktops
$breakpoint-2xl: 1536px;  // Large screens
```

### 8.3 Key UI Components

#### 8.3.1 Match Badge Component

```typescript
// components/jobs/MatchBadge.tsx
interface MatchBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  onClick?: () => void;
}

// Visual Variants:
// score > 70: Green background, white text
// score 40-70: Yellow background, dark text
// score < 40: Gray background, dark text

// Example Usage:
<MatchBadge score={85} size="md" showProgress />
// Renders: [85% ████████░░] in green
```

#### 8.3.2 Job Card Skeleton

```typescript
// components/jobs/JobCardSkeleton.tsx
// Animated loading placeholder matching JobCard dimensions
// Shows: logo placeholder, title lines, badges, button

<JobCardSkeleton />
// Renders animated gray blocks in card layout
```

#### 8.3.3 Filter Chip Component

```typescript
// components/ui/FilterChip.tsx
interface FilterChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  count?: number;
}

// Example:
<FilterChip label="Remote" selected={true} count={45} />
// Renders: [✓ Remote (45)] with primary color when selected
```

### 8.4 Animation Specifications

```typescript
// Shared animation configs
const animations = {
  // Page transitions
  pageEnter: {
    opacity: [0, 1],
    y: [20, 0],
    duration: 300,
    easing: 'ease-out',
  },

  // Modal/Dialog
  modalEnter: {
    opacity: [0, 1],
    scale: [0.95, 1],
    duration: 200,
  },

  // Card hover
  cardHover: {
    y: -4,
    shadow: 'lg',
    duration: 150,
  },

  // Skeleton shimmer
  shimmer: {
    backgroundPosition: ['200% 0', '-200% 0'],
    duration: 1500,
    repeat: Infinity,
  },

  // Score counter
  scoreCount: {
    from: 0,
    to: score,
    duration: 800,
    easing: 'ease-out',
  },
};
```

### 8.5 Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| Color Contrast | WCAG AA (4.5:1 for text, 3:1 for UI) |
| Keyboard Navigation | All interactive elements focusable |
| Screen Reader | ARIA labels on all buttons/icons |
| Focus Indicators | Visible focus rings on all elements |
| Error Messages | Associated with inputs via aria-describedby |
| Loading States | aria-busy and aria-live regions |
| Skip Links | Skip to main content link |

---

## 9. AI Integration Details

### 9.1 OpenRouter Configuration

```typescript
// lib/openrouter.ts
import OpenAI from 'openai';

export const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL,
    'X-Title': 'JobTracker AI',
  },
});

// Model Selection Strategy
export const MODELS = {
  // Fast scoring - high volume, low cost
  SCORING: 'anthropic/claude-3-haiku',

  // Chat assistant - better quality
  CHAT: 'anthropic/claude-3-sonnet',

  // Resume parsing - one-time, needs accuracy
  PARSING: 'anthropic/claude-3-sonnet',

  // Fallback
  FALLBACK: 'openai/gpt-3.5-turbo',
};

// Rate Limiting
export const RATE_LIMITS = {
  SCORING_PER_MINUTE: 50,
  CHAT_PER_MINUTE: 20,
  PARSING_PER_HOUR: 10,
};
```

### 9.2 AI Service Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           AI SERVICE ARCHITECTURE                                    │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                           AI SERVICE LAYER                                   │   │
│  │                                                                              │   │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                    │   │
│  │  │  Resume       │  │  Job Match    │  │  Chat         │                    │   │
│  │  │  Parser       │  │  Scorer       │  │  Assistant    │                    │   │
│  │  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘                    │   │
│  │          │                  │                  │                            │   │
│  │          └──────────────────┴──────────────────┘                            │   │
│  │                             │                                                │   │
│  │                             ▼                                                │   │
│  │                    ┌───────────────────┐                                    │   │
│  │                    │   Prompt Builder  │                                    │   │
│  │                    │   ─────────────   │                                    │   │
│  │                    │   • System prompts│                                    │   │
│  │                    │   • Context inject│                                    │   │
│  │                    │   • Token limits  │                                    │   │
│  │                    └─────────┬─────────┘                                    │   │
│  │                              │                                              │   │
│  │                              ▼                                              │   │
│  │                    ┌───────────────────┐                                    │   │
│  │                    │   Rate Limiter    │                                    │   │
│  │                    │   ─────────────   │                                    │   │
│  │                    │   • Per-user      │                                    │   │
│  │                    │   • Per-endpoint  │                                    │   │
│  │                    │   • Global        │                                    │   │
│  │                    └─────────┬─────────┘                                    │   │
│  │                              │                                              │   │
│  └──────────────────────────────┼──────────────────────────────────────────────┘   │
│                                 │                                                   │
│                                 ▼                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                          OPENROUTER API                                      │   │
│  │                                                                              │   │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                    │   │
│  │  │ Claude Haiku  │  │ Claude Sonnet │  │ GPT-3.5 Turbo │                    │   │
│  │  │  (Scoring)    │  │ (Chat/Parse)  │  │  (Fallback)   │                    │   │
│  │  └───────────────┘  └───────────────┘  └───────────────┘                    │   │
│  │                                                                              │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 9.3 Prompt Templates

#### 9.3.1 Resume Parsing Prompt

```typescript
const RESUME_PARSE_PROMPT = `
You are an expert resume parser. Extract structured information from the following resume.

RESUME TEXT:
"""
{{resumeText}}
"""

INSTRUCTIONS:
1. Extract ALL technical skills mentioned (programming languages, frameworks, tools, platforms)
2. Parse work experience with accurate dates and descriptions
3. Extract education history
4. Calculate total years of professional experience
5. Write a 2-3 sentence professional summary

OUTPUT FORMAT (JSON only, no markdown):
{
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Jan 2020 - Present",
      "description": "Key responsibilities and achievements"
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "institution": "University Name",
      "year": "2019"
    }
  ],
  "summary": "Professional summary here",
  "totalYearsExperience": 4
}

Return ONLY the JSON object, no additional text.
`;
```

#### 9.3.2 Job Matching Prompt (Batch)

```typescript
const BATCH_MATCH_PROMPT = `
You are a job matching expert. Score how well this candidate matches each job.

CANDIDATE PROFILE:
- Skills: {{skills}}
- Years of Experience: {{yearsExperience}}
- Desired Roles: {{desiredRoles}}
- Preferred Work Mode: {{workMode}}
- Summary: {{summary}}

JOBS TO SCORE:
{{#each jobs}}
---
JOB {{index}}:
- ID: {{id}}
- Title: {{title}}
- Company: {{company}}
- Required Skills: {{requiredSkills}}
- Experience: {{experienceRequired}}
- Type: {{jobType}}
- Work Mode: {{workMode}}
- Location: {{location}}
- Description (excerpt): {{descriptionExcerpt}}
{{/each}}
---

SCORING CRITERIA:
1. SKILL_MATCH (0-40): Percentage of required skills the candidate has
2. EXPERIENCE_MATCH (0-25): How well experience level aligns
3. ROLE_MATCH (0-20): Relevance of candidate's background to the role
4. PREFERENCE_MATCH (0-15): Work mode, location, job type alignment

OUTPUT FORMAT (JSON array):
[
  {
    "jobId": "job_id",
    "totalScore": 85,
    "breakdown": {
      "skillMatch": 32,
      "experienceMatch": 25,
      "roleMatch": 18,
      "preferenceMatch": 10
    },
    "matchedSkills": ["React", "Node.js"],
    "missingSkills": ["Kubernetes"],
    "topReason": "Strong frontend skills match"
  }
]

Return ONLY the JSON array.
`;
```

#### 9.3.3 Chat Assistant Prompt

```typescript
const CHAT_ASSISTANT_PROMPT = `
You are JobTracker AI, an intelligent job search assistant.

CURRENT USER CONTEXT:
- Name: {{userName}}
- Skills: {{userSkills}}
- Experience: {{yearsExperience}} years
- Current Page: {{currentPage}}
- Applied Filters: {{currentFilters}}

AVAILABLE ACTIONS:
1. JOB_SEARCH: Search and filter jobs
2. RECOMMEND: Get personalized job recommendations
3. EXPLAIN: Explain match scores or job details
4. HELP: Answer platform questions

CONVERSATION HISTORY:
{{conversationHistory}}

USER MESSAGE: {{userMessage}}

RESPONSE FORMAT:
For job searches:
{"action": "JOB_SEARCH", "filters": {...}, "message": "explanation"}

For recommendations:
{"action": "RECOMMEND", "criteria": {...}, "message": "explanation"}

For explanations:
{"action": "EXPLAIN", "message": "detailed explanation"}

For help:
{"action": "HELP", "message": "helpful response"}

For general chat:
{"action": "CHAT", "message": "conversational response"}

Be concise, helpful, and encouraging. Reference specific jobs when relevant.
`;
```

### 9.4 Token Management

```typescript
// Token limits and cost optimization
const TOKEN_LIMITS = {
  // Input limits per request
  RESUME_PARSE_INPUT: 4000,    // ~1500 words
  BATCH_MATCH_INPUT: 8000,    // ~10 jobs
  CHAT_INPUT: 4000,           // Context + message

  // Output limits
  RESUME_PARSE_OUTPUT: 1500,
  BATCH_MATCH_OUTPUT: 2000,
  CHAT_OUTPUT: 1000,
};

// Truncation strategy
function truncateText(text: string, maxTokens: number): string {
  // Approximate 1 token = 4 characters
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return text;

  // Smart truncation - keep beginning and end
  const halfLength = Math.floor(maxChars / 2) - 50;
  return text.slice(0, halfLength) +
         '\n\n[...content truncated...]\n\n' +
         text.slice(-halfLength);
}
```

### 9.5 Error Handling & Fallbacks

```typescript
// AI service error handling
async function callAI(options: AICallOptions): Promise<AIResponse> {
  const { model, prompt, maxRetries = 3 } = options;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await openrouter.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: options.maxTokens,
        temperature: options.temperature ?? 0.3,
      });

      return parseAIResponse(response);

    } catch (error) {
      if (error.status === 429) {
        // Rate limited - wait and retry
        await sleep(Math.pow(2, attempt) * 1000);
        continue;
      }

      if (error.status >= 500 && attempt < maxRetries) {
        // Server error - retry with backoff
        await sleep(attempt * 1000);
        continue;
      }

      // Try fallback model
      if (model !== MODELS.FALLBACK) {
        return callAI({
          ...options,
          model: MODELS.FALLBACK,
          maxRetries: 1,
        });
      }

      throw new AIServiceError(
        'AI service unavailable',
        error.status,
        error.message
      );
    }
  }
}
```

---

## 10. Error Handling

### 10.1 Error Categories

```typescript
// types/errors.ts

// Base error class
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Specific error types
class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 'FORBIDDEN', 403);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
  }
}

class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
  }
}

class RateLimitError extends AppError {
  constructor(retryAfter: number) {
    super(`Rate limit exceeded. Retry after ${retryAfter}s`, 'RATE_LIMIT', 429);
  }
}

class ExternalAPIError extends AppError {
  constructor(service: string, message: string) {
    super(`${service} error: ${message}`, 'EXTERNAL_API_ERROR', 502);
  }
}

class AIServiceError extends AppError {
  constructor(message: string) {
    super(message, 'AI_SERVICE_ERROR', 503);
  }
}
```

### 10.2 Error Handling Middleware

```typescript
// middleware/errorHandler.ts
import { NextRequest, NextResponse } from 'next/server';

export function withErrorHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error('API Error:', {
        path: req.nextUrl.pathname,
        method: req.method,
        error: error.message,
        stack: error.stack,
      });

      if (error instanceof AppError) {
        return NextResponse.json(
          {
            error: {
              code: error.code,
              message: error.message,
              ...(error instanceof ValidationError && { fields: error.fields }),
            },
          },
          { status: error.statusCode }
        );
      }

      // Unexpected error
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred',
          },
        },
        { status: 500 }
      );
    }
  };
}
```

### 10.3 Frontend Error Handling

```typescript
// hooks/useErrorHandler.ts
import { useToast } from '@/components/ui/toast';

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback((error: unknown) => {
    console.error('Error:', error);

    if (error instanceof Response) {
      // API error
      error.json().then((data) => {
        toast({
          title: 'Error',
          description: data.error?.message || 'Something went wrong',
          variant: 'destructive',
        });
      });
      return;
    }

    if (error instanceof Error) {
      // Handle specific error types
      switch (error.name) {
        case 'NetworkError':
          toast({
            title: 'Connection Error',
            description: 'Please check your internet connection',
            variant: 'destructive',
          });
          break;

        case 'TimeoutError':
          toast({
            title: 'Request Timeout',
            description: 'The request took too long. Please try again.',
            variant: 'destructive',
          });
          break;

        default:
          toast({
            title: 'Error',
            description: error.message || 'Something went wrong',
            variant: 'destructive',
          });
      }
      return;
    }

    // Unknown error
    toast({
      title: 'Error',
      description: 'An unexpected error occurred',
      variant: 'destructive',
    });
  }, [toast]);

  return { handleError };
}
```

### 10.4 Error Scenarios & User Messages

| Scenario | Code | User Message | Action |
|----------|------|--------------|--------|
| Invalid login credentials | AUTH_ERROR | "Invalid email or password" | Show on form |
| Session expired | AUTH_ERROR | "Your session has expired. Please login again." | Redirect to login |
| Resume upload failed | UPLOAD_ERROR | "Failed to upload resume. Please try again." | Show retry button |
| Resume too large | VALIDATION_ERROR | "File size must be under 5MB" | Show on form |
| Invalid file type | VALIDATION_ERROR | "Only PDF and TXT files are supported" | Show on form |
| Job API unavailable | EXTERNAL_API_ERROR | "Unable to fetch jobs. Please try again later." | Show cached data + retry |
| AI service down | AI_SERVICE_ERROR | "Match scores temporarily unavailable" | Show jobs without scores |
| Rate limited | RATE_LIMIT | "Too many requests. Please wait a moment." | Disable button, show countdown |
| Network offline | NETWORK_ERROR | "You're offline. Some features may be unavailable." | Show banner |
| Application already exists | CONFLICT | "You've already tracked this application" | Navigate to existing |

### 10.5 Error Boundaries

```typescript
// components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">
            We encountered an unexpected error. Please try again.
          </p>
          <Button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

---

## 11. Test Cases

### 11.1 Authentication Tests

#### 11.1.1 Registration Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| AUTH-001 | Successful email registration | 1. Enter valid email/password 2. Click Register | User created, redirected to resume upload |
| AUTH-002 | Registration with existing email | 1. Enter existing email 2. Click Register | Error: "Email already registered" |
| AUTH-003 | Registration with weak password | 1. Enter password < 8 chars 2. Click Register | Error: "Password must be at least 8 characters" |
| AUTH-004 | Registration with invalid email | 1. Enter "notanemail" 2. Click Register | Error: "Please enter a valid email" |
| AUTH-005 | Google OAuth registration | 1. Click "Sign up with Google" 2. Complete OAuth | User created, redirected to resume upload |
| AUTH-006 | Password mismatch | 1. Enter different passwords in both fields | Error: "Passwords do not match" |

#### 11.1.2 Login Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| AUTH-010 | Successful login | 1. Enter valid credentials 2. Click Login | Logged in, redirected to jobs page |
| AUTH-011 | Login without resume | 1. Login as user without resume | Redirected to resume upload prompt |
| AUTH-012 | Invalid credentials | 1. Enter wrong password | Error: "Invalid email or password" |
| AUTH-013 | Non-existent user | 1. Enter unregistered email | Error: "Invalid email or password" |
| AUTH-014 | Google OAuth login | 1. Click "Login with Google" | Logged in successfully |
| AUTH-015 | Session persistence | 1. Login 2. Close browser 3. Reopen | Still logged in |
| AUTH-016 | Logout | 1. Click Logout | Logged out, redirected to login |

---

### 11.2 Resume Upload Tests

#### 11.2.1 Upload Functionality

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| RES-001 | Upload valid PDF | 1. Select PDF file < 5MB 2. Upload | Resume uploaded, skills extracted |
| RES-002 | Upload valid TXT | 1. Select TXT file 2. Upload | Resume uploaded, skills extracted |
| RES-003 | Upload oversized file | 1. Select 10MB PDF | Error: "File must be under 5MB" |
| RES-004 | Upload invalid format | 1. Select DOCX file | Error: "Only PDF and TXT files supported" |
| RES-005 | Upload empty file | 1. Select empty PDF | Error: "Could not extract text from resume" |
| RES-006 | Drag and drop upload | 1. Drag PDF to drop zone | File uploads successfully |
| RES-007 | Replace existing resume | 1. Upload new resume 2. Confirm replace | Old resume deleted, new one saved |
| RES-008 | Cancel upload | 1. Start upload 2. Click Cancel | Upload cancelled, no changes |

#### 11.2.2 Resume Parsing Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| RES-010 | Extract skills | 1. Upload resume with skills section | Skills correctly extracted and displayed |
| RES-011 | Extract experience | 1. Upload resume with work history | Experience entries parsed with dates |
| RES-012 | Extract education | 1. Upload resume with education | Education entries correctly parsed |
| RES-013 | Calculate years | 1. Upload resume with 5 years exp | totalYearsExperience = 5 |
| RES-014 | Handle non-standard format | 1. Upload unconventional resume | Best-effort extraction, no crash |
| RES-015 | Unicode characters | 1. Upload resume with special chars | Characters preserved correctly |

---

### 11.3 Job Feed Tests

#### 11.3.1 Job Display Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| JOB-001 | Load job feed | 1. Navigate to Jobs page | Jobs displayed with match scores |
| JOB-002 | Show best matches | 1. Load jobs page | Top 6-8 matches shown in carousel |
| JOB-003 | Display match badges | 1. View job cards | Green >70%, Yellow 40-70%, Gray <40% |
| JOB-004 | Expand job details | 1. Click job card | Full description and match breakdown shown |
| JOB-005 | Pagination | 1. Scroll to bottom 2. Click Next | Page 2 loads correctly |
| JOB-006 | Loading skeleton | 1. Load page with slow connection | Skeleton placeholders shown |
| JOB-007 | Empty state | 1. Search with no results | "No jobs found" message |

#### 11.3.2 Filter Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| JOB-010 | Search by keyword | 1. Enter "React" in search | Jobs containing "React" shown |
| JOB-011 | Filter by skills | 1. Select "React" + "Node.js" | Only jobs with both skills |
| JOB-012 | Filter by date | 1. Select "Last 24 hours" | Only recent jobs shown |
| JOB-013 | Filter by job type | 1. Select "Full-time" | Only full-time jobs shown |
| JOB-014 | Filter by work mode | 1. Select "Remote" | Only remote jobs shown |
| JOB-015 | Filter by location | 1. Enter "San Francisco" | Only SF jobs shown |
| JOB-016 | Filter by match score | 1. Select "High (>70%)" | Only high matches shown |
| JOB-017 | Combine filters | 1. Apply multiple filters | All filters applied correctly |
| JOB-018 | Clear all filters | 1. Click "Clear All" | All filters reset |
| JOB-019 | Filter persistence | 1. Apply filters 2. Navigate away 3. Return | Filters preserved |

---

### 11.4 AI Matching Tests

#### 11.4.1 Score Calculation Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| MAT-001 | Perfect skill match | 1. User has all required skills | skillMatch = 40/40 |
| MAT-002 | Partial skill match | 1. User has 3/5 required skills | skillMatch = 24/40 |
| MAT-003 | No skill match | 1. User has no required skills | skillMatch = 0/40 |
| MAT-004 | Experience exact match | 1. Job requires 3-5 yrs, user has 4 | experienceMatch = 25/25 |
| MAT-005 | Experience under-qualified | 1. Job requires 5+ yrs, user has 2 | experienceMatch = 5-10/25 |
| MAT-006 | Role relevance high | 1. Same job title | roleMatch = 20/20 |
| MAT-007 | Preference full match | 1. Remote + Full-time match | preferenceMatch = 15/15 |
| MAT-008 | Total score calculation | 1. View any job | Score = sum of all components |

#### 11.4.2 Matching Consistency Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| MAT-010 | Consistent scoring | 1. Refresh page multiple times | Same scores each time |
| MAT-011 | Score caching | 1. Load jobs 2. Check Redis | Scores cached for 30 min |
| MAT-012 | Cache invalidation | 1. Update resume 2. Refresh jobs | New scores calculated |
| MAT-013 | Batch scoring | 1. Load 100 jobs | All scored within 5 seconds |

---

### 11.5 Smart Popup Tests

#### 11.5.1 Popup Trigger Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| POP-001 | Popup on return | 1. Click Apply 2. Switch to external tab 3. Return | Popup shows with job details |
| POP-002 | No popup without click | 1. Switch tabs without clicking Apply | No popup shows |
| POP-003 | Popup timeout | 1. Click Apply 2. Return after 35 minutes | No popup (expired) |
| POP-004 | Multiple apply clicks | 1. Click Apply on job A 2. Click Apply on job B 3. Return | Popup for most recent job |
| POP-005 | Page refresh handling | 1. Click Apply 2. Refresh page 3. Return | Popup still shows |

#### 11.5.2 Popup Response Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| POP-010 | Confirm applied | 1. Click "Yes, I Applied" | Application saved, toast shown |
| POP-011 | Just browsing | 1. Click "No, Just Browsing" | Popup closes, no application saved |
| POP-012 | Applied earlier | 1. Click "I Applied Earlier" | Application saved with "earlier" flag |
| POP-013 | Dismiss popup | 1. Click X button | Popup closes, pending cleared |
| POP-014 | Click outside | 1. Click overlay background | Popup closes |
| POP-015 | Duplicate prevention | 1. Apply to same job twice | "Already applied" message |

---

### 11.6 Application Dashboard Tests

#### 11.6.1 Dashboard Display Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| DASH-001 | Load dashboard | 1. Navigate to Dashboard | Applications listed with stats |
| DASH-002 | Stats accuracy | 1. Count applications | Stats match actual counts |
| DASH-003 | List view | 1. Select list view | Table format displayed |
| DASH-004 | Kanban view | 1. Select board view | Columns by status shown |
| DASH-005 | Empty dashboard | 1. New user views dashboard | "No applications yet" state |

#### 11.6.2 Status Management Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| DASH-010 | Update to Interview | 1. Click status dropdown 2. Select Interview | Status updated, timeline entry added |
| DASH-011 | Update to Offer | 1. Update status to Offer | Status shows green, moved in kanban |
| DASH-012 | Update to Rejected | 1. Update status to Rejected | Status shows red |
| DASH-013 | Add note | 1. Click Add Note 2. Enter text 3. Save | Note saved to timeline |
| DASH-014 | Delete application | 1. Click Delete 2. Confirm | Application removed |
| DASH-015 | Undo delete | 1. Delete application 2. Click Undo (within 5s) | Application restored |

#### 11.6.3 Dashboard Filter Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| DASH-020 | Filter by status | 1. Select "Interview" filter | Only interviews shown |
| DASH-021 | Filter by date | 1. Select "This Week" | Only recent apps shown |
| DASH-022 | Search company | 1. Enter "Google" in search | Only Google apps shown |
| DASH-023 | Sort by date | 1. Click date column header | Sorted by date |
| DASH-024 | Sort by score | 1. Sort by match score | Highest scores first |

---

### 11.7 AI Sidebar Tests

#### 11.7.1 Chat Functionality Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| CHAT-001 | Send message | 1. Type message 2. Press Enter | Message sent, response received |
| CHAT-002 | Streaming response | 1. Send message | Response streams in real-time |
| CHAT-003 | Conversation context | 1. Send "Show React jobs" 2. Send "Remote only" | Filters updated correctly |
| CHAT-004 | Clear history | 1. Click Clear | Chat history cleared |
| CHAT-005 | Collapse sidebar | 1. Click collapse button | Sidebar minimizes to icon |

#### 11.7.2 Query Type Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| CHAT-010 | Job search query | 1. "Show me remote React jobs" | Filters applied, jobs displayed |
| CHAT-011 | Recommendation query | 1. "What are my best matches?" | Top matches listed with reasons |
| CHAT-012 | Help query | 1. "How do I update my resume?" | Platform instructions shown |
| CHAT-013 | Explanation query | 1. "Why did I match 85% with Google?" | Detailed breakdown shown |
| CHAT-014 | Invalid query | 1. "asdfjkl;" | Graceful "I didn't understand" response |

#### 11.7.3 Quick Actions Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| CHAT-020 | Best matches chip | 1. Click "Show my best matches" | Top matches displayed |
| CHAT-021 | Remote jobs chip | 1. Click "Find remote jobs" | Remote filter applied |
| CHAT-022 | Help chip | 1. Click "How does matching work?" | Explanation displayed |

---

### 11.8 Performance Tests

| Test ID | Description | Criteria | Expected Result |
|---------|-------------|----------|-----------------|
| PERF-001 | Page load time | Measure LCP | < 2.5 seconds |
| PERF-002 | Job feed load | Time to display 20 jobs | < 3 seconds |
| PERF-003 | Match scoring | Score 100 jobs | < 5 seconds |
| PERF-004 | Filter response | Apply filter | < 500ms |
| PERF-005 | Chat response | Time to first token | < 1 second |
| PERF-006 | Resume upload | 2MB PDF | < 10 seconds |
| PERF-007 | Concurrent users | 100 simultaneous | No degradation |
| PERF-008 | Memory usage | Monitor during session | < 200MB |

---

### 11.9 Mobile Responsiveness Tests

| Test ID | Description | Device | Expected Result |
|---------|-------------|--------|-----------------|
| MOB-001 | Login page | iPhone 13 | All elements visible, usable |
| MOB-002 | Job feed | iPad | Grid adjusts to 2 columns |
| MOB-003 | Job card | iPhone SE | Full card visible, scrollable |
| MOB-004 | Filters | Mobile | Slide-out drawer works |
| MOB-005 | Dashboard | Mobile | Table scrolls horizontally |
| MOB-006 | AI Sidebar | Mobile | Full-screen overlay mode |
| MOB-007 | Popup | Mobile | Fits screen, buttons accessible |
| MOB-008 | Touch targets | All mobile | Buttons >= 44px tap area |

---

### 11.10 Edge Case Tests

| Test ID | Description | Scenario | Expected Result |
|---------|-------------|----------|-----------------|
| EDGE-001 | Long job title | 200 character title | Truncated with ellipsis |
| EDGE-002 | Long company name | 100 character company | Truncated appropriately |
| EDGE-003 | HTML in description | Description with `<script>` | HTML escaped, no XSS |
| EDGE-004 | Unicode in search | Search "开发者" | No errors, results shown |
| EDGE-005 | Empty resume text | Resume has no extractable text | Error handled gracefully |
| EDGE-006 | API rate limit | Exceed 100 req/min | Proper error, retry after shown |
| EDGE-007 | Network disconnect | Lose connection mid-action | Error toast, recovery option |
| EDGE-008 | Browser back button | Navigate back | Proper state preserved |
| EDGE-009 | Multiple tabs | Same user, multiple tabs | Sync state correctly |
| EDGE-010 | Session timeout | Token expires during use | Prompt re-login, preserve work |

---

## 12. Security Considerations

### 12.1 Authentication Security

```typescript
// Firebase Authentication Best Practices

// 1. Token Verification (Server-side)
import { getAuth } from 'firebase-admin/auth';

async function verifyToken(req: Request): Promise<DecodedToken> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthenticationError('Missing authorization header');
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(token);

    // Check token expiration (optional extra validation)
    if (decodedToken.exp * 1000 < Date.now()) {
      throw new AuthenticationError('Token expired');
    }

    return decodedToken;
  } catch (error) {
    throw new AuthenticationError('Invalid token');
  }
}

// 2. Rate Limiting per User
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
});

async function checkRateLimit(userId: string, endpoint: string) {
  const { success, limit, remaining, reset } = await ratelimit.limit(
    `${userId}:${endpoint}`
  );

  if (!success) {
    throw new RateLimitError(Math.ceil((reset - Date.now()) / 1000));
  }
}
```

### 12.2 Data Security

| Security Measure | Implementation |
|------------------|----------------|
| Data Encryption | MongoDB Atlas encryption at rest + TLS in transit |
| Password Storage | Handled by Firebase (bcrypt + salting) |
| API Keys | Server-side only, never exposed to client |
| File Uploads | Cloudinary signed uploads, file type validation |
| Input Sanitization | Zod validation on all inputs |
| XSS Prevention | React's built-in escaping + CSP headers |
| CSRF Protection | SameSite cookies + CSRF tokens for mutations |
| SQL Injection | N/A (MongoDB) - NoSQL injection prevention via ODM |

### 12.3 Security Headers

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googleapis.com *.firebaseapp.com;
      style-src 'self' 'unsafe-inline' fonts.googleapis.com;
      img-src 'self' data: blob: *.cloudinary.com *.googleusercontent.com;
      font-src 'self' fonts.gstatic.com;
      connect-src 'self' *.googleapis.com *.firebaseio.com *.cloudfunctions.net *.openrouter.ai;
      frame-src 'self' *.firebaseapp.com;
    `.replace(/\n/g, '')
  }
];
```

### 12.4 Input Validation Schemas

```typescript
// utils/validators.ts
import { z } from 'zod';

// User Registration
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
  displayName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be under 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters'),
});

// Resume Upload
export const resumeUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File must be under 5MB')
    .refine(
      (file) => ['application/pdf', 'text/plain'].includes(file.type),
      'Only PDF and TXT files are supported'
    ),
});

// Job Search Filters
export const jobFiltersSchema = z.object({
  query: z.string().max(100).optional(),
  skills: z.array(z.string().max(50)).max(10).optional(),
  jobType: z.array(z.enum(['full-time', 'part-time', 'contract', 'internship'])).optional(),
  workMode: z.array(z.enum(['remote', 'hybrid', 'onsite'])).optional(),
  location: z.string().max(100).optional(),
  datePosted: z.enum(['24h', 'week', 'month', 'any']).optional(),
  minMatchScore: z.number().min(0).max(100).optional(),
  page: z.number().min(1).max(1000).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Application Update
export const applicationUpdateSchema = z.object({
  status: z.enum(['applied', 'interview', 'offer', 'rejected', 'withdrawn']).optional(),
  notes: z.string().max(5000).optional(),
});

// Chat Message
export const chatMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(5000),
      })
    )
    .max(50),
});
```

### 12.5 Sensitive Data Handling

```typescript
// Never log sensitive data
function sanitizeForLogging(data: any): any {
  const sensitiveFields = ['password', 'token', 'apiKey', 'authorization'];

  if (typeof data === 'object' && data !== null) {
    const sanitized = { ...data };
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }
    return sanitized;
  }

  return data;
}

// Secure cookie settings
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60, // 7 days
  path: '/',
};
```

---

## 13. Performance & Scalability

### 13.1 Performance Optimization Strategies

#### 13.1.1 Frontend Optimizations

```typescript
// 1. Code Splitting & Lazy Loading
import dynamic from 'next/dynamic';

// Lazy load heavy components
const AISidebar = dynamic(() => import('@/components/chat/AISidebar'), {
  loading: () => <SidebarSkeleton />,
  ssr: false,
});

const KanbanBoard = dynamic(() => import('@/components/dashboard/KanbanBoard'), {
  loading: () => <BoardSkeleton />,
});

// 2. Image Optimization
import Image from 'next/image';

<Image
  src={company.logo}
  alt={company.name}
  width={48}
  height={48}
  placeholder="blur"
  blurDataURL={company.logoBlurHash}
/>

// 3. Virtualized Lists for Large Data
import { useVirtualizer } from '@tanstack/react-virtual';

function JobList({ jobs }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: jobs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated job card height
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[800px] overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <JobCard
            key={virtualItem.key}
            job={jobs[virtualItem.index]}
            style={{
              transform: `translateY(${virtualItem.start}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// 4. Memoization
import { memo, useMemo, useCallback } from 'react';

const JobCard = memo(function JobCard({ job, onApply }) {
  const matchColor = useMemo(() => {
    if (job.matchScore > 70) return 'green';
    if (job.matchScore > 40) return 'yellow';
    return 'gray';
  }, [job.matchScore]);

  const handleApply = useCallback(() => {
    onApply(job.id);
  }, [job.id, onApply]);

  return (/* ... */);
});
```

#### 13.1.2 Backend Optimizations

```typescript
// 1. Database Indexing
// MongoDB indexes (defined in schema or migration)
db.users.createIndex({ firebaseUid: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ "resume.parsedData.skills": 1 });

db.applications.createIndex({ userId: 1, createdAt: -1 });
db.applications.createIndex({ userId: 1, status: 1 });
db.applications.createIndex({ userId: 1, "job.externalId": 1 }, { unique: true });

db.pendingApplications.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// 2. Query Optimization
async function getUserApplications(userId: string, filters: Filters) {
  const query: any = { userId: new ObjectId(userId) };

  if (filters.status && filters.status !== 'all') {
    query.status = filters.status;
  }

  if (filters.dateRange) {
    query.createdAt = { $gte: getDateRangeStart(filters.dateRange) };
  }

  // Use projection to fetch only needed fields
  const applications = await Application
    .find(query)
    .select('job.title job.company status matchScore createdAt')
    .sort({ [filters.sortBy]: filters.sortOrder === 'desc' ? -1 : 1 })
    .skip((filters.page - 1) * filters.limit)
    .limit(filters.limit)
    .lean(); // Return plain objects for better performance

  return applications;
}

// 3. Caching Strategy
const CACHE_CONFIG = {
  jobs: {
    ttl: 15 * 60, // 15 minutes
    staleWhileRevalidate: 5 * 60, // 5 minutes
  },
  matchScores: {
    ttl: 30 * 60, // 30 minutes
  },
  userSession: {
    ttl: 24 * 60 * 60, // 24 hours
  },
};

async function getCachedJobs(cacheKey: string, fetchFn: () => Promise<Job[]>) {
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    const data = JSON.parse(cached);
    // Return cached data and revalidate in background if stale
    if (Date.now() - data.cachedAt > CACHE_CONFIG.jobs.staleWhileRevalidate * 1000) {
      // Revalidate in background
      fetchFn().then((jobs) => {
        redis.setex(cacheKey, CACHE_CONFIG.jobs.ttl, JSON.stringify({
          jobs,
          cachedAt: Date.now(),
        }));
      });
    }
    return data.jobs;
  }

  // Cache miss - fetch and cache
  const jobs = await fetchFn();
  await redis.setex(cacheKey, CACHE_CONFIG.jobs.ttl, JSON.stringify({
    jobs,
    cachedAt: Date.now(),
  }));
  return jobs;
}
```

### 13.2 Scalability Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         SCALABILITY ARCHITECTURE                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

                                   ┌─────────────────┐
                                   │   Cloudflare    │
                                   │      CDN        │
                                   │   (Static +     │
                                   │    Caching)     │
                                   └────────┬────────┘
                                            │
                                            ▼
                              ┌─────────────────────────┐
                              │    Vercel Edge Network  │
                              │                         │
                              │  ┌─────────────────┐   │
                              │  │  Edge Functions │   │
                              │  │  (Auth, Rate    │   │
                              │  │   Limiting)     │   │
                              │  └────────┬────────┘   │
                              │           │            │
                              └───────────┼────────────┘
                                          │
                                          ▼
                    ┌─────────────────────────────────────────────┐
                    │              VERCEL SERVERLESS              │
                    │                                             │
                    │  ┌─────────────┐  ┌─────────────┐          │
                    │  │ API Routes  │  │  SSR Pages  │          │
                    │  │ (Auto-scale)│  │ (Auto-scale)│          │
                    │  └──────┬──────┘  └──────┬──────┘          │
                    │         │                │                  │
                    └─────────┼────────────────┼──────────────────┘
                              │                │
                    ┌─────────┴────────────────┴─────────┐
                    │                                     │
          ┌─────────▼─────────┐             ┌────────────▼────────────┐
          │   UPSTASH REDIS   │             │    MONGODB ATLAS        │
          │   (Serverless)    │             │    (Auto-scaling)       │
          │                   │             │                         │
          │  • Session cache  │             │  • M10+ cluster         │
          │  • Job cache      │             │  • Auto-sharding        │
          │  • Rate limiting  │             │  • Read replicas        │
          │  • Match scores   │             │  • Connection pooling   │
          └───────────────────┘             └─────────────────────────┘

HANDLING 10,000 USERS:
━━━━━━━━━━━━━━━━━━━━━━

1. CONCURRENT REQUESTS
   • Vercel: Auto-scales to handle spikes
   • MongoDB: M10 cluster supports 500+ connections
   • Redis: Upstash scales automatically

2. JOB FETCHING (100 jobs × 10,000 users)
   • Cache job results by query hash (15 min TTL)
   • Shared cache reduces external API calls by 95%
   • Batch AI scoring in groups of 10 jobs

3. AI SCORING
   • Queue-based processing for peak loads
   • Pre-compute scores for popular job searches
   • Cache scores per user-jobs combination

4. DATABASE OPTIMIZATION
   • Indexes on all queried fields
   • Connection pooling (100 max connections)
   • Read replicas for heavy read operations

ESTIMATED CAPACITY:
• 10,000 daily active users
• 500 concurrent users at peak
• 100 requests/second sustained
• 500 requests/second burst
```

### 13.3 Performance Metrics & Monitoring

```typescript
// Performance monitoring setup
// lib/monitoring.ts

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Core Web Vitals thresholds
const PERFORMANCE_THRESHOLDS = {
  LCP: 2500,  // Largest Contentful Paint (ms)
  FID: 100,   // First Input Delay (ms)
  CLS: 0.1,   // Cumulative Layout Shift
  TTFB: 800,  // Time to First Byte (ms)
  FCP: 1800,  // First Contentful Paint (ms)
};

// Custom metrics
export function trackMetric(name: string, value: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'performance_metric', {
      metric_name: name,
      metric_value: value,
    });
  }
}

// API response time tracking
export function withTiming<T>(
  handler: () => Promise<T>,
  metricName: string
): Promise<T> {
  const start = performance.now();
  return handler().finally(() => {
    const duration = performance.now() - start;
    trackMetric(metricName, duration);
  });
}
```

---

## 14. Deployment Guide

### 14.1 Prerequisites

```bash
# Required accounts
- Vercel account (hosting)
- MongoDB Atlas account (database)
- Firebase project (authentication)
- Cloudinary account (file storage)
- Upstash account (Redis cache)
- OpenRouter account (AI API)
- RapidAPI account (JSearch job API)

# Required tools
- Node.js 18+
- npm or pnpm
- Git
```

### 14.2 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/yourusername/job-tracker.git
cd job-tracker

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

### 14.3 Environment Setup

#### 14.3.1 MongoDB Atlas Setup

```
1. Create MongoDB Atlas account
2. Create new cluster (M0 free tier or M10+ for production)
3. Create database user with read/write access
4. Whitelist IP addresses (0.0.0.0/0 for Vercel)
5. Get connection string:
   mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/jobtracker
```

#### 14.3.2 Firebase Setup

```
1. Create Firebase project
2. Enable Authentication
3. Add sign-in providers: Email/Password, Google
4. Create web app and get config
5. Generate service account key for admin SDK
```

#### 14.3.3 Cloudinary Setup

```
1. Create Cloudinary account
2. Note cloud name, API key, API secret
3. Create upload preset (unsigned for client uploads)
4. Configure allowed formats: pdf, txt
5. Set max file size: 5MB
```

#### 14.3.4 Upstash Setup

```
1. Create Upstash account
2. Create new Redis database
3. Note REST URL and token
4. Enable Eviction policy: allkeys-lru
```

#### 14.3.5 OpenRouter Setup

```
1. Create OpenRouter account
2. Add credits ($5 minimum)
3. Generate API key
4. Note: Rate limits apply per model
```

#### 14.3.6 RapidAPI (JSearch) Setup

```
1. Create RapidAPI account
2. Subscribe to JSearch API (free tier available)
3. Note API key
4. Free tier: 200 requests/month
```

### 14.4 Vercel Deployment

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Link project
vercel link

# 4. Add environment variables
vercel env add MONGODB_URI production
vercel env add FIREBASE_ADMIN_KEY production
# ... add all variables

# 5. Deploy
vercel --prod

# Or use GitHub integration:
# 1. Push to GitHub
# 2. Import project in Vercel dashboard
# 3. Configure environment variables
# 4. Deploy automatically on push
```

### 14.5 Post-Deployment Checklist

```markdown
[ ] Verify all environment variables are set
[ ] Test authentication flow (register, login, logout)
[ ] Test resume upload
[ ] Test job fetching and filtering
[ ] Test AI matching scores
[ ] Test smart popup flow
[ ] Test dashboard functionality
[ ] Test AI chat
[ ] Verify mobile responsiveness
[ ] Check error tracking (if configured)
[ ] Set up monitoring alerts
[ ] Configure custom domain (optional)
```

---

## 15. Environment Variables

### 15.1 Complete Environment Variables List

```bash
# .env.example

# ============================================
# APPLICATION
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=JobTracker
NODE_ENV=development

# ============================================
# MONGODB
# ============================================
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/jobtracker?retryWrites=true&w=majority

# ============================================
# FIREBASE (Client-side)
# ============================================
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# ============================================
# FIREBASE ADMIN (Server-side)
# Base64 encoded service account JSON
# ============================================
FIREBASE_ADMIN_KEY=eyJ0eXBlIjoic2VydmljZV9hY2NvdW50Ii...

# ============================================
# CLOUDINARY
# ============================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=job-tracker-resumes

# ============================================
# UPSTASH REDIS
# ============================================
UPSTASH_REDIS_REST_URL=https://your-region.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ============================================
# OPENROUTER (AI)
# ============================================
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxx

# ============================================
# RAPIDAPI (JSearch)
# ============================================
RAPIDAPI_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RAPIDAPI_HOST=jsearch.p.rapidapi.com

# ============================================
# OPTIONAL: Adzuna (Fallback Job API)
# ============================================
ADZUNA_APP_ID=xxxxxxxx
ADZUNA_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ============================================
# OPTIONAL: Error Tracking
# ============================================
SENTRY_DSN=https://xxxx@sentry.io/xxxx
NEXT_PUBLIC_SENTRY_DSN=https://xxxx@sentry.io/xxxx

# ============================================
# OPTIONAL: Analytics
# ============================================
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 15.2 Environment Variable Validation

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Required
  MONGODB_URI: z.string().url(),
  FIREBASE_ADMIN_KEY: z.string().min(100),
  OPENROUTER_API_KEY: z.string().startsWith('sk-or-'),
  RAPIDAPI_KEY: z.string().min(20),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(20),
  CLOUDINARY_API_KEY: z.string().min(10),
  CLOUDINARY_API_SECRET: z.string().min(20),

  // Optional
  SENTRY_DSN: z.string().url().optional(),
  ADZUNA_APP_ID: z.string().optional(),
  ADZUNA_API_KEY: z.string().optional(),
});

export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(result.error.format());
    throw new Error('Invalid environment configuration');
  }

  return result.data;
}

// Call at startup
export const env = validateEnv();
```

---

## 16. Known Limitations & Future Improvements

### 16.1 Current Limitations

| Limitation | Description | Workaround |
|------------|-------------|------------|
| Job API Rate Limits | JSearch free tier: 200 req/month | Cache aggressively, upgrade for production |
| AI Cost | OpenRouter charges per token | Use Haiku for bulk scoring, cache results |
| File Size | 5MB max for resumes | Compress PDFs before upload |
| Real-time Updates | No WebSocket implementation | Polling every 30s for notifications |
| Offline Support | No service worker | Basic localStorage caching |

### 16.2 Future Improvements

```markdown
## Phase 2 Features (If More Time)

### High Priority
- [ ] Email notifications for application status changes
- [ ] Calendar integration for interview scheduling
- [ ] Browser extension for one-click application tracking
- [ ] Resume builder/editor
- [ ] Cover letter generator (AI)

### Medium Priority
- [ ] Company research integration (Glassdoor, LinkedIn)
- [ ] Salary insights and negotiation tips
- [ ] Interview preparation questions (AI-generated)
- [ ] Application templates
- [ ] Export applications to CSV/PDF

### Low Priority
- [ ] Social features (share jobs, referrals)
- [ ] Job alerts and saved searches
- [ ] Mobile app (React Native)
- [ ] Team features for recruiters
- [ ] Analytics dashboard with trends
```

### 16.3 Technical Debt Considerations

```markdown
1. **Testing Coverage**: Add comprehensive E2E tests with Playwright
2. **Error Monitoring**: Implement proper Sentry integration
3. **Logging**: Add structured logging with request tracing
4. **Documentation**: Generate API docs with Swagger/OpenAPI
5. **CI/CD**: Add GitHub Actions for testing and deployment
6. **Database Migrations**: Implement proper migration system
7. **Feature Flags**: Add feature flag system for gradual rollouts
```

---

## 17. Appendix

### 17.1 Glossary

| Term | Definition |
|------|------------|
| Match Score | AI-calculated percentage (0-100) indicating job-resume fit |
| Pending Application | Temporary record when user clicks Apply, before confirmation |
| Work Mode | Remote, Hybrid, or On-site work arrangement |
| Job Type | Full-time, Part-time, Contract, or Internship |
| TTL | Time To Live - duration before cached data expires |

### 17.2 References

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [OpenRouter API](https://openrouter.ai/docs)
- [JSearch API (RapidAPI)](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Document Version**: 1.0
**Last Updated**: January 2026
**Author**: AI-Generated PRD
**Status**: Ready for Development
```
```
