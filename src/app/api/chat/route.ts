import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/openrouter';
import { getUserFromToken } from '@/lib/firebase-admin';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Application from '@/models/Application';
import { searchJobs, type TransformedJob } from '@/lib/jsearch';
import { checkRateLimit } from '@/lib/cache';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface JobSearchIntent {
  isJobSearch: boolean;
  query?: string;
  skills?: string[];
  location?: string;
  remoteOnly?: boolean;
  employmentType?: string;
  isBestMatchesQuery?: boolean;
}

function parseSearchIntent(aiResponse: string): JobSearchIntent {
  try {
    const jsonMatch = aiResponse.match(/\{[\s\S]*?"isJobSearch"[\s\S]*?\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Parsing failed, return default
  }
  return { isJobSearch: false };
}

function formatJobsForChat(jobs: TransformedJob[], limit = 5): string {
  if (jobs.length === 0) {
    return "I couldn't find any jobs matching your criteria. Try broadening your search or using different keywords.";
  }

  const jobsList = jobs.slice(0, limit).map((job, index) => {
    const salary = job.salary
      ? `$${(job.salary.min / 1000).toFixed(0)}k - $${(job.salary.max / 1000).toFixed(0)}k`
      : 'Salary not specified';
    const skills = job.skills.slice(0, 4).join(', ');

    return `${index + 1}. **${job.title}** at ${job.company}
   📍 ${job.location} | 💼 ${job.type}
   💰 ${salary}
   🔧 Skills: ${skills || 'Not specified'}`;
  }).join('\n\n');

  const moreText = jobs.length > limit
    ? `\n\n...and ${jobs.length - limit} more jobs found. Visit the Jobs page to see all results and apply!`
    : '';

  return `Here are the jobs I found:\n\n${jobsList}${moreText}`;
}

function formatBestMatchesForChat(
  applications: Array<{
    job: { title: string; company: string; location: string };
    matchScore: number;
    status: string;
  }>,
  limit = 6
): string {
  if (applications.length === 0) {
    return "You don't have any saved jobs yet. Save some jobs from the Jobs page to see your best matches based on your resume!";
  }

  const jobsList = applications.slice(0, limit).map((app, index) => {
    const scoreEmoji = app.matchScore >= 70 ? '🟢' : app.matchScore >= 40 ? '🟡' : '⚪';
    return `${index + 1}. **${app.job.title}** at ${app.job.company}
   📍 ${app.job.location}
   ${scoreEmoji} Match Score: ${app.matchScore}% | Status: ${app.status}`;
  }).join('\n\n');

  return `Here are your best matching jobs:\n\n${jobsList}\n\nThese scores are based on how well your resume matches each job's requirements.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [] } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Check rate limit (use IP or user ID)
    const authHeader = req.headers.get('authorization');
    let identifier = req.headers.get('x-forwarded-for') || 'anonymous';

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      const firebaseUser = await getUserFromToken(token);
      if (firebaseUser) {
        identifier = firebaseUser.uid;
      }
    }

    const rateLimitResult = await checkRateLimit(identifier, 'AI_CHAT');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          resetAt: rateLimitResult.resetAt.toISOString(),
          response: "You've sent too many messages. Please wait a moment before trying again.",
        },
        { status: 429 }
      );
    }

    let userContext = '';
    let dbUser = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      const firebaseUser = await getUserFromToken(token);

      if (firebaseUser) {
        await connectDB();
        dbUser = await User.findOne({ firebaseUid: firebaseUser.uid });

        if (dbUser) {
          const applications = await Application.find({ userId: dbUser._id })
            .sort({ matchScore: -1 })
            .limit(20)
            .lean();

          const stats = {
            total: applications.length,
            saved: applications.filter(a => a.status === 'saved').length,
            applied: applications.filter(a => a.status === 'applied').length,
            interviewing: applications.filter(a => a.status === 'interviewing').length,
            offered: applications.filter(a => a.status === 'offered').length,
          };

          userContext = `
User Context:
- Name: ${dbUser.displayName}
- Total saved/applied jobs: ${stats.total}
- Saved: ${stats.saved}, Applied: ${stats.applied}, Interviewing: ${stats.interviewing}, Offers: ${stats.offered}
${dbUser.resume?.parsedData ? `- Resume Skills: ${dbUser.resume.parsedData.skills?.slice(0, 10).join(', ') || 'Not parsed'}` : '- Resume: Not uploaded'}
`;
        }
      }
    }

    const intentPrompt = `You are analyzing a user's message to determine if they want to search for jobs.

User message: "${message}"

Analyze the message and respond with ONLY a JSON object (no other text) in this exact format:
{
  "isJobSearch": true/false,
  "query": "search query if applicable",
  "skills": ["skill1", "skill2"] if mentioned,
  "location": "location if mentioned",
  "remoteOnly": true/false,
  "employmentType": "full-time" | "part-time" | "contract" | "internship" | null,
  "isBestMatchesQuery": true/false
}

Set isJobSearch=true if the user wants to find, show, search, or look for jobs.
Set isBestMatchesQuery=true if the user asks about their best matches or top recommendations.

Respond with ONLY the JSON object:`;

    const intentResponse = await chat([
      { role: 'system', content: 'You are a JSON-only response bot. Output only valid JSON, no other text.' },
      { role: 'user', content: intentPrompt },
    ]);

    const intent = parseSearchIntent(intentResponse);

    if (intent.isBestMatchesQuery) {
      if (!dbUser) {
        return NextResponse.json({
          response: "Please sign in to see your best job matches! Once logged in, I can show you jobs that best match your skills and experience based on your resume.",
        });
      }

      await connectDB();
      const applications = await Application.find({ userId: dbUser._id })
        .sort({ matchScore: -1 })
        .limit(10)
        .lean();

      if (applications.length === 0) {
        return NextResponse.json({
          response: "You haven't saved any jobs yet! Browse the Jobs page and save some jobs you're interested in. I'll then be able to show you which ones best match your profile.",
        });
      }

      const formattedJobs = formatBestMatchesForChat(
        applications.map(app => ({
          job: app.job as { title: string; company: string; location: string },
          matchScore: app.matchScore,
          status: app.status,
        }))
      );

      return NextResponse.json({ response: formattedJobs });
    }

    if (intent.isJobSearch) {
      try {
        let searchQuery = intent.query || '';
        if (intent.skills && intent.skills.length > 0) {
          searchQuery = `${searchQuery} ${intent.skills.join(' ')}`.trim();
        }
        if (!searchQuery) {
          searchQuery = 'software developer';
        }

        const { jobs } = await searchJobs({
          query: searchQuery,
          location: intent.location,
          remoteOnly: intent.remoteOnly || false,
          employmentType: intent.employmentType || undefined,
          page: 1,
          numPages: 1,
        });

        const formattedJobs = formatJobsForChat(jobs);
        const response = `${formattedJobs}\n\n💡 **Tip:** To save or apply to these jobs, head to the Jobs page where you can see full details and track your applications!`;

        return NextResponse.json({ response });
      } catch (error) {
        console.error('Job search error:', error);
        return NextResponse.json({
          response: "I had trouble searching for jobs right now. Please try using the Jobs page directly, or try again in a moment.",
        });
      }
    }

    const systemPrompt = `You are HireSense AI, a helpful job search assistant.

Platform features:
- Jobs page: Browse jobs, save favorites, apply with one click
- Dashboard: Track all your applications and their status
- Resume: Upload PDF to get AI-powered match scores
- Match scores: Green (>70%) = Great match, Yellow (40-70%) = Good match, Gray (<40%) = Low match

${userContext}

Be concise and helpful. Keep responses under 150 words unless explaining something complex.`;

    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6).map((m: ChatMessage) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await chat(messages);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { response: "I'm having trouble processing your request right now. Please try again.", error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
