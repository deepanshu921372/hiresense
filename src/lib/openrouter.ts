const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function chat(
  messages: ChatMessage[],
  model = 'google/gemini-2.0-flash-001'
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'JobTracker AI',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const data: OpenRouterResponse = await response.json();
  return data.choices[0]?.message?.content || '';
}

export interface ParsedResume {
  skills: string[];
  experience: string[];
  education: string[];
  summary: string;
}

export async function parseResume(resumeText: string): Promise<ParsedResume> {
  const systemPrompt = `You are a professional resume parser. Extract structured information from resumes accurately.
Always respond with valid JSON only, no additional text.`;

  const userPrompt = `Parse the following resume and extract the information in this exact JSON format:
{
  "skills": ["skill1", "skill2", ...],
  "experience": ["Job Title at Company (Duration) - Brief description", ...],
  "education": ["Degree at Institution (Year)", ...],
  "summary": "A brief 2-3 sentence professional summary"
}

Resume:
${resumeText}

Important:
- Extract all technical and soft skills mentioned
- List work experience in reverse chronological order
- Include all education details
- Create a concise professional summary based on the resume content
- Return ONLY valid JSON, no markdown or additional text`;

  const response = await chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  try {
    // Try to parse the response as JSON
    const cleanedResponse = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    return JSON.parse(cleanedResponse) as ParsedResume;
  } catch {
    // If parsing fails, return empty structure
    console.error('Failed to parse resume response:', response);
    return {
      skills: [],
      experience: [],
      education: [],
      summary: '',
    };
  }
}

export interface JobMatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: string;
}

export async function calculateJobMatch(
  resumeData: ParsedResume,
  jobData: {
    title: string;
    description: string;
    requirements: string[];
    skills: string[];
  }
): Promise<JobMatchResult> {
  const systemPrompt = `You are a job matching expert. Analyze resume data against job requirements and calculate match scores.
Always respond with valid JSON only, no additional text.`;

  const userPrompt = `Analyze how well this candidate matches the job posting.

Resume Data:
Skills: ${resumeData.skills.join(', ')}
Experience: ${resumeData.experience.join(' | ')}
Education: ${resumeData.education.join(' | ')}
Summary: ${resumeData.summary}

Job Posting:
Title: ${jobData.title}
Description: ${jobData.description}
Requirements: ${jobData.requirements.join(', ')}
Required Skills: ${jobData.skills.join(', ')}

Respond with this exact JSON format:
{
  "score": 75,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "recommendation": "Brief recommendation for the candidate"
}

Important:
- Score should be 0-100 based on how well the candidate matches
- List skills from the job that the candidate has
- List important skills the candidate is missing
- Provide actionable recommendation
- Return ONLY valid JSON`;

  const response = await chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  try {
    const cleanedResponse = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    return JSON.parse(cleanedResponse) as JobMatchResult;
  } catch {
    console.error('Failed to parse job match response:', response);
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: [],
      recommendation: 'Unable to calculate match at this time.',
    };
  }
}

export async function generateChatResponse(
  messages: ChatMessage[],
  context?: {
    resumeData?: ParsedResume;
    jobTitle?: string;
    jobDescription?: string;
  }
): Promise<string> {
  const systemPrompt = `You are a helpful job search assistant. You help users with:
- Resume improvements and tips
- Job search strategies
- Interview preparation
- Career advice
- Understanding job requirements

${
  context?.resumeData
    ? `User's Resume Skills: ${context.resumeData.skills.join(', ')}
User's Experience: ${context.resumeData.experience.join(' | ')}
User's Summary: ${context.resumeData.summary}`
    : ''
}

${
  context?.jobTitle
    ? `Current Job Being Discussed:
Title: ${context.jobTitle}
Description: ${context.jobDescription || 'Not provided'}`
    : ''
}

Be helpful, concise, and professional. Focus on actionable advice.`;

  const allMessages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];

  return chat(allMessages);
}
