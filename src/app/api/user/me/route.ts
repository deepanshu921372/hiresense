import { NextRequest } from 'next/server';
import { withAuth, apiResponse, apiError, type ApiContext } from '@/lib/api-utils';
import { User } from '@/models';

// GET /api/user/me - Get current authenticated user
export const GET = withAuth(async (_req: NextRequest, { user }: ApiContext) => {
  try {
    const dbUser = await User.findOne({ firebaseUid: user.uid });

    if (!dbUser) {
      return apiError('User not found', 404);
    }

    return apiResponse({ user: dbUser });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return apiError('Failed to fetch user', 500);
  }
});
