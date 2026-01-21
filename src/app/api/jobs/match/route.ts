import { NextRequest } from 'next/server';
import { withAuth, apiResponse, apiError, type ApiContext } from '@/lib/api-utils';
import User from '@/models/User';
import { calculateJobMatch, type ParsedResume } from '@/lib/openrouter';
import { getCachedMatchScore, setCachedMatchScore, checkRateLimit } from '@/lib/cache';

interface MatchRequestBody {
  job: {
    _id?: string;
    title: string;
    description?: string;
    skills: string[];
  };
}

export const POST = withAuth(async (req: NextRequest, { user }: ApiContext) => {
  try {
    const rateLimitResult = await checkRateLimit(user.uid, 'AI_SCORING');
    if (!rateLimitResult.success) {
      return apiError(
        `Rate limit exceeded. Try again after ${rateLimitResult.resetAt.toISOString()}`,
        429
      );
    }

    const body: MatchRequestBody = await req.json();
    const { job } = body;

    if (!job || !job.title) {
      return apiError('Job data with title is required', 400);
    }

    const dbUser = await User.findOne({ firebaseUid: user.uid });
    if (!dbUser) {
      return apiError('User not found', 404);
    }

    const parsedData = dbUser.resume?.parsedData;
    if (!parsedData || !parsedData.skills || parsedData.skills.length === 0) {
      return apiResponse({
        score: 50,
        matchedSkills: [],
        missingSkills: job.skills || [],
        recommendation: 'Upload your resume to get personalized match scores.',
        hasResume: false,
      });
    }

    const jobId = job._id || job.title.replace(/\s+/g, '-').toLowerCase();
    const cached = await getCachedMatchScore(String(dbUser._id), jobId);
    if (cached) {
      return apiResponse({ ...cached, hasResume: true, cached: true });
    }

    const resumeData: ParsedResume = {
      skills: parsedData.skills || [],
      experience: parsedData.experience || [],
      education: parsedData.education || [],
      summary: parsedData.summary || '',
    };

    const jobData = {
      title: job.title,
      description: job.description || '',
      requirements: job.skills || [],
      skills: job.skills || [],
    };

    const matchResult = await calculateJobMatch(resumeData, jobData);

    await setCachedMatchScore(String(dbUser._id), jobId, {
      score: matchResult.score,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      recommendation: matchResult.recommendation,
    });

    return apiResponse({
      score: matchResult.score,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      recommendation: matchResult.recommendation,
      hasResume: true,
    });
  } catch (error) {
    console.error('Error calculating match score:', error);
    return apiResponse({
      score: 60,
      matchedSkills: [],
      missingSkills: [],
      recommendation: 'Match calculation temporarily unavailable.',
      hasResume: false,
      error: true,
    });
  }
});
