export const APP_NAME = 'HireSense';
export const APP_DESCRIPTION = 'AI-powered job tracking with smart matching';

export const SKILLS_LIST = [
  'React', 'Next.js', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS',
  'Tailwind CSS', 'SCSS', 'Redux', 'Zustand',
  'Node.js', 'Express', 'Fastify', 'NestJS', 'Python', 'Django', 'Flask', 'FastAPI',
  'Java', 'Spring Boot', 'Go', 'Rust', 'Ruby', 'Rails', 'PHP', 'Laravel', 'C#', '.NET',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'Firebase',
  'Supabase', 'Prisma',
  'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD',
  'GitHub Actions', 'Jenkins',
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision',
  'OpenAI API',
  'Figma', 'Sketch', 'Adobe XD', 'UI/UX',
  'GraphQL', 'REST API', 'WebSockets', 'Microservices', 'System Design', 'Agile', 'Scrum', 'Git',
] as const;

export type Skill = (typeof SKILLS_LIST)[number];

export const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' },
] as const;

export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead / Principal' },
] as const;

export const WORK_MODES = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
] as const;

export const DATE_POSTED_OPTIONS = [
  { value: '24h', label: 'Last 24 hours' },
  { value: 'week', label: 'Last week' },
  { value: 'month', label: 'Last month' },
  { value: 'any', label: 'Any time' },
] as const;

export const MATCH_SCORE_THRESHOLDS = {
  HIGH: 70,
  MEDIUM: 40,
} as const;

export const MATCH_SCORE_OPTIONS = [
  { value: 'high', label: 'High (>70%)', minScore: 70 },
  { value: 'medium', label: 'Medium (40-70%)', minScore: 40, maxScore: 70 },
  { value: 'all', label: 'All', minScore: 0 },
] as const;

export const APPLICATION_STATUSES = [
  { value: 'applied', label: 'Applied', color: 'blue' },
  { value: 'interview', label: 'Interview', color: 'amber' },
  { value: 'offer', label: 'Offer', color: 'emerald' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'gray' },
] as const;

export const DATE_RANGE_OPTIONS = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' },
] as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const CACHE_TTL = {
  JOBS: 15 * 60,
  MATCH_SCORES: 30 * 60,
  USER_SESSION: 24 * 60 * 60,
  RESUME: 60 * 60,
} as const;

export const RATE_LIMITS = {
  GENERAL: 100,
  AI_SCORING: 50,
  AI_CHAT: 20,
  RESUME_PARSE: 10,
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024,
  ALLOWED_TYPES: ['application/pdf', 'text/plain'],
  ALLOWED_EXTENSIONS: ['.pdf', '.txt'],
} as const;

export const AI_MODELS = {
  SCORING: 'anthropic/claude-3-haiku',
  CHAT: 'anthropic/claude-3-sonnet',
  PARSING: 'anthropic/claude-3-sonnet',
  FALLBACK: 'openai/gpt-3.5-turbo',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  JOBS: '/jobs',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
} as const;

export const STORAGE_KEYS = {
  THEME: 'jobtracker-theme',
  FILTERS: 'jobtracker-filters',
  SIDEBAR_COLLAPSED: 'jobtracker-sidebar-collapsed',
} as const;

export const CHAT_QUICK_ACTIONS = [
  { label: 'Show my best matches', query: 'Show me my best job matches', icon: 'sparkles' },
  { label: 'Find remote jobs', query: 'Find remote jobs for me', icon: 'home' },
  { label: 'How does matching work?', query: 'How does the job matching system work?', icon: 'help-circle' },
] as const;
