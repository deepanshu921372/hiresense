export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  resume: ResumeData | null;
  preferences: UserPreferences;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
}

export interface UserPreferences {
  desiredRoles: string[];
  desiredLocations: string[];
  workMode: WorkMode[];
  jobTypes: JobType[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface ResumeData {
  fileUrl: string;
  fileName: string;
  fileType: 'pdf' | 'txt';
  uploadedAt: Date;
  cloudinaryPublicId: string;
  extractedText: string;
  parsedData: ParsedResume;
}

export interface ParsedResume {
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  summary: string;
  totalYearsExperience: number;
}

export interface WorkExperience {
  title: string;
  company: string;
  duration: string;
  description: string;
  startDate?: string;
  endDate?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  field?: string;
}

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type WorkMode = 'remote' | 'hybrid' | 'onsite';
export type DatePosted = '24h' | 'week' | 'month' | 'any';

export interface Job {
  id: string;
  externalId: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  description: string;
  jobType: JobType;
  workMode: WorkMode;
  salary?: string;
  url: string;
  postedAt: Date;
  skills: string[];
  matchScore?: number;
  matchReasons?: string[];
  matchBreakdown?: MatchBreakdown;
}

export interface MatchBreakdown {
  skillMatch: number;
  experienceMatch: number;
  roleMatch: number;
  preferenceMatch: number;
}

export interface JobFilters {
  query?: string;
  skills?: string[];
  jobType?: JobType[];
  workMode?: WorkMode[];
  location?: string;
  datePosted?: DatePosted;
  minMatchScore?: number;
  page?: number;
  limit?: number;
  sortBy?: 'matchScore' | 'date' | 'company';
  sortOrder?: 'asc' | 'desc';
}

export interface JobsResponse {
  jobs: Job[];
  pagination: Pagination;
  bestMatches: Job[];
}

export type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn';

export interface Application {
  id: string;
  userId: string;
  job: {
    externalId: string;
    title: string;
    company: string;
    location: string;
    description: string;
    jobType: string;
    workMode: string;
    salary?: string;
    url: string;
    postedAt: Date;
  };
  matchScore: number;
  matchReasons: string[];
  status: ApplicationStatus;
  statusHistory: StatusHistoryEntry[];
  appliedAt: Date;
  appliedVia: 'direct' | 'earlier';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StatusHistoryEntry {
  status: ApplicationStatus;
  timestamp: Date;
  notes?: string;
}

export interface PendingApplication {
  id: string;
  userId: string;
  job: {
    externalId: string;
    title: string;
    company: string;
    url: string;
    location?: string;
  };
  clickedAt: Date;
  expiresAt: Date;
}

export interface ApplicationFilters {
  status?: ApplicationStatus | 'all';
  dateRange?: 'week' | 'month' | 'quarter' | 'year' | 'all';
  company?: string;
  search?: string;
  sortBy?: 'date' | 'company' | 'status' | 'matchScore';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ApplicationStats {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  thisWeek: number;
  responseRate: number;
  avgTimeToResponse?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: ChatMessageMetadata;
}

export interface ChatMessageMetadata {
  type: 'job_search' | 'recommendation' | 'help' | 'chat';
  filters?: JobFilters;
  jobs?: Job[];
}

export interface ChatRequest {
  message: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  context?: {
    currentPage: string;
    currentFilters: JobFilters;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  fields?: Record<string, string>;
}

export interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUserInfo | null;
  loading: boolean;
  error: Error | null;
}

export interface FirebaseUserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}
