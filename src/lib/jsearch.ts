const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'jsearch.p.rapidapi.com';

interface JSearchJob {
  job_id: string;
  employer_name: string;
  employer_logo: string | null;
  employer_website: string | null;
  job_title: string;
  job_description: string;
  job_employment_type: string;
  job_apply_link: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_posted_at_datetime_utc: string;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_currency: string | null;
  job_is_remote: boolean;
  job_required_experience: {
    no_experience_required: boolean;
    required_experience_in_months: number | null;
    experience_mentioned: boolean;
  };
  job_required_skills: string[] | null;
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
}

interface JSearchResponse {
  status: string;
  request_id: string;
  data: JSearchJob[];
}

export interface TransformedJob {
  _id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  skills: string[];
  postedAt: string;
  description?: string;
  applyLink?: string;
}

function mapEmploymentType(type: string): TransformedJob['type'] {
  const typeMap: Record<string, TransformedJob['type']> = {
    'FULLTIME': 'full-time',
    'FULL_TIME': 'full-time',
    'PARTTIME': 'part-time',
    'PART_TIME': 'part-time',
    'CONTRACT': 'contract',
    'CONTRACTOR': 'contract',
    'INTERN': 'internship',
    'INTERNSHIP': 'internship',
  };
  return typeMap[type?.toUpperCase()] || 'full-time';
}

function mapExperienceLevel(experience: JSearchJob['job_required_experience']): TransformedJob['experienceLevel'] {
  if (!experience || experience.no_experience_required) return 'entry';
  const months = experience.required_experience_in_months || 0;
  if (months < 24) return 'entry';
  if (months < 60) return 'mid';
  if (months < 96) return 'senior';
  return 'lead';
}

function transformJob(job: JSearchJob): TransformedJob {
  const location = job.job_is_remote
    ? 'Remote'
    : [job.job_city, job.job_state, job.job_country].filter(Boolean).join(', ') || 'Location not specified';

  return {
    _id: job.job_id,
    title: job.job_title,
    company: job.employer_name,
    companyLogo: job.employer_logo || undefined,
    location,
    type: job.job_is_remote ? 'remote' : mapEmploymentType(job.job_employment_type),
    salary: job.job_min_salary && job.job_max_salary ? {
      min: job.job_min_salary,
      max: job.job_max_salary,
      currency: job.job_salary_currency || 'USD',
    } : undefined,
    experienceLevel: mapExperienceLevel(job.job_required_experience),
    skills: job.job_required_skills || extractSkillsFromDescription(job.job_description),
    postedAt: job.job_posted_at_datetime_utc || new Date().toISOString(),
    description: job.job_description,
    applyLink: job.job_apply_link,
  };
}

function extractSkillsFromDescription(description: string): string[] {
  const commonSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby',
    'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
    'Git', 'CI/CD', 'Agile', 'Scrum',
    'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch',
    'REST', 'GraphQL', 'Microservices', 'API',
  ];

  const found: string[] = [];
  const lowerDesc = description?.toLowerCase() || '';

  for (const skill of commonSkills) {
    if (lowerDesc.includes(skill.toLowerCase())) {
      found.push(skill);
    }
    if (found.length >= 6) break;
  }

  return found.length > 0 ? found : ['Software Development'];
}

export interface SearchJobsParams {
  query?: string;
  location?: string;
  page?: number;
  numPages?: number;
  remoteOnly?: boolean;
  employmentType?: string;
  datePosted?: string;
}

export async function searchJobs(params: SearchJobsParams = {}): Promise<{ jobs: TransformedJob[]; total: number }> {
  if (!RAPIDAPI_KEY) {
    console.warn('RAPIDAPI_KEY not configured, returning empty results');
    return { jobs: [], total: 0 };
  }

  const {
    query = 'software developer',
    location = 'United States',
    page = 1,
    numPages = 1,
    remoteOnly = false,
    employmentType,
    datePosted = 'month',
  } = params;

  const searchParams = new URLSearchParams({
    query: remoteOnly ? `${query} remote` : query,
    page: String(page),
    num_pages: String(numPages),
    date_posted: datePosted,
  });

  if (employmentType) {
    searchParams.set('employment_types', employmentType.toUpperCase());
  }

  if (location && !remoteOnly) {
    searchParams.set('query', `${query} in ${location}`);
  }

  try {
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/search?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('JSearch API error:', response.status, error);
      throw new Error(`JSearch API error: ${response.status}`);
    }

    const data: JSearchResponse = await response.json();

    if (data.status !== 'OK' || !data.data) {
      console.warn('JSearch returned no data');
      return { jobs: [], total: 0 };
    }

    const jobs = data.data.map(transformJob);
    return { jobs, total: jobs.length * numPages * 10 };
  } catch (error) {
    console.error('Error fetching jobs from JSearch:', error);
    throw error;
  }
}

export async function getJobDetails(jobId: string): Promise<TransformedJob | null> {
  if (!RAPIDAPI_KEY) {
    console.warn('RAPIDAPI_KEY not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/job-details?job_id=${encodeURIComponent(jobId)}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`JSearch API error: ${response.status}`);
    }

    const data: JSearchResponse = await response.json();

    if (data.status !== 'OK' || !data.data?.[0]) {
      return null;
    }

    return transformJob(data.data[0]);
  } catch (error) {
    console.error('Error fetching job details:', error);
    return null;
  }
}
