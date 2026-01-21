import { NextRequest } from 'next/server';
import { withAuth, apiResponse, apiError, type ApiContext } from '@/lib/api-utils';
import User from '@/models/User';
import { calculateJobMatch, type ParsedResume } from '@/lib/openrouter';
import {
  getCachedMatchScores,
  setCachedMatchScores,
  checkRateLimit,
  type CachedMatchScore,
} from '@/lib/cache';

interface JobForMatching {
  _id: string;
  title: string;
  description?: string;
  skills: string[];
}

interface MatchRequestBody {
  jobs: JobForMatching[];
}

interface JobMatchScore {
  jobId: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
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
    const { jobs } = body;

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return apiError('Jobs array is required', 400);
    }

    const jobsToProcess = jobs.slice(0, 20);

    const dbUser = await User.findOne({ firebaseUid: user.uid });
    if (!dbUser) {
      return apiError('User not found', 404);
    }

    const userId = String(dbUser._id);
    const parsedData = dbUser.resume?.parsedData;

    if (!parsedData || !parsedData.skills || parsedData.skills.length === 0) {
      const defaultScores: JobMatchScore[] = jobsToProcess.map((job) => ({
        jobId: job._id,
        score: 50,
        matchedSkills: [],
        missingSkills: job.skills || [],
      }));

      return apiResponse({
        scores: defaultScores,
        hasResume: false,
        message: 'Upload your resume to get personalized match scores.',
      });
    }

    const jobIds = jobsToProcess.map((j) => j._id);
    const cachedScores = await getCachedMatchScores(userId, jobIds);

    const uncachedJobs = jobsToProcess.filter((job) => !cachedScores.has(job._id));
    const cachedResults: JobMatchScore[] = [];

    cachedScores.forEach((cached, jobId) => {
      cachedResults.push({
        jobId,
        score: cached.score,
        matchedSkills: cached.matchedSkills,
        missingSkills: cached.missingSkills,
      });
    });

    if (uncachedJobs.length === 0) {
      return apiResponse({ scores: cachedResults, hasResume: true, cached: true });
    }

    const resumeData: ParsedResume = {
      skills: parsedData.skills || [],
      experience: parsedData.experience || [],
      education: parsedData.education || [],
      summary: parsedData.summary || '',
    };

    const matchPromises = uncachedJobs.map(async (job): Promise<JobMatchScore> => {
      try {
        const jobData = {
          title: job.title,
          description: job.description || '',
          requirements: job.skills || [],
          skills: job.skills || [],
        };

        const matchResult = await calculateJobMatch(resumeData, jobData);

        return {
          jobId: job._id,
          score: matchResult.score,
          matchedSkills: matchResult.matchedSkills,
          missingSkills: matchResult.missingSkills,
        };
      } catch (error) {
        console.error(`Error calculating match for job ${job._id}:`, error);
        return {
          jobId: job._id,
          score: 50,
          matchedSkills: [],
          missingSkills: job.skills || [],
        };
      }
    });

    const newScores = await Promise.all(matchPromises);

    const scoresToCache: Array<{ jobId: string } & CachedMatchScore> = newScores.map((s) => ({
      jobId: s.jobId,
      score: s.score,
      matchedSkills: s.matchedSkills,
      missingSkills: s.missingSkills,
    }));
    await setCachedMatchScores(userId, scoresToCache);

    const allScores = [...cachedResults, ...newScores];

    return apiResponse({
      scores: allScores,
      hasResume: true,
      cachedCount: cachedResults.length,
      computedCount: newScores.length,
    });
  } catch (error) {
    console.error('Error calculating batch match scores:', error);
    return apiError('Failed to calculate match scores', 500);
  }
});
