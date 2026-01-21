import { NextRequest, NextResponse } from 'next/server';
import { withAuth, apiResponse, apiError, type ApiContext } from '@/lib/api-utils';
import { User } from '@/models';

// POST /api/user - Create a new user
export const POST = withAuth(async (req: NextRequest, { user }: ApiContext) => {
  try {
    const body = await req.json();
    const { firebaseUid, email, displayName, photoURL } = body;

    // Validate required fields
    if (!firebaseUid || !email || !displayName) {
      return apiError('Missing required fields: firebaseUid, email, displayName', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ firebaseUid });
    if (existingUser) {
      return apiResponse({ user: existingUser, message: 'User already exists' });
    }

    // Create new user
    const newUser = await User.create({
      firebaseUid,
      email,
      displayName,
      photoURL,
      preferences: {
        jobTypes: [],
        locations: [],
        salaryRange: { min: 0, max: 500000 },
        remoteOnly: false,
      },
    });

    return apiResponse({ user: newUser }, 201);
  } catch (error) {
    console.error('Error creating user:', error);
    return apiError('Failed to create user', 500);
  }
});

// GET /api/user - Get user by firebaseUid (from query param)
export const GET = withAuth(async (req: NextRequest, { user }: ApiContext) => {
  try {
    const dbUser = await User.findOne({ firebaseUid: user.uid });

    if (!dbUser) {
      return apiError('User not found', 404);
    }

    return apiResponse({ user: dbUser });
  } catch (error) {
    console.error('Error fetching user:', error);
    return apiError('Failed to fetch user', 500);
  }
});

// PUT /api/user - Update user
export const PUT = withAuth(async (req: NextRequest, { user }: ApiContext) => {
  try {
    const body = await req.json();
    const { displayName, photoURL, preferences } = body;

    const updateData: Record<string, unknown> = {};

    if (displayName) updateData.displayName = displayName;
    if (photoURL !== undefined) updateData.photoURL = photoURL;
    if (preferences) updateData.preferences = preferences;

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: user.uid },
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return apiError('User not found', 404);
    }

    return apiResponse({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return apiError('Failed to update user', 500);
  }
});
