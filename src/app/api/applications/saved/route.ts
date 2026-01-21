import { NextRequest } from 'next/server';
import { withAuth, apiResponse, apiError, type ApiContext } from '@/lib/api-utils';
import Application from '@/models/Application';
import User from '@/models/User';

// GET /api/applications/saved - Get IDs of saved jobs for the current user
export const GET = withAuth(async (_req: NextRequest, { user }: ApiContext) => {
  try {
    // Get user from database
    const dbUser = await User.findOne({ firebaseUid: user.uid });
    if (!dbUser) {
      return apiError('User not found', 404);
    }

    // Get all saved job external IDs
    const applications = await Application.find(
      { userId: dbUser._id },
      { 'job.externalId': 1, status: 1 }
    ).lean();

    const savedJobIds = applications.map(app => app.job.externalId);
    const savedJobsMap = applications.reduce((acc, app) => {
      acc[app.job.externalId] = {
        applicationId: app._id.toString(),
        status: app.status,
      };
      return acc;
    }, {} as Record<string, { applicationId: string; status: string }>);

    return apiResponse({
      savedJobIds,
      savedJobsMap,
    });
  } catch (error) {
    console.error('Error fetching saved job IDs:', error);
    return apiError('Failed to fetch saved jobs', 500);
  }
});
