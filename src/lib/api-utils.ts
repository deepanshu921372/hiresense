import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from './firebase-admin';
import connectDB from './mongodb';

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
}

export interface ApiContext {
  user: AuthenticatedUser;
}

type ApiHandler = (
  req: NextRequest,
  context: ApiContext
) => Promise<NextResponse>;

export function withAuth(handler: ApiHandler) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const authHeader = req.headers.get('authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Unauthorized: Missing or invalid authorization header' },
          { status: 401 }
        );
      }

      const token = authHeader.split('Bearer ')[1];
      const user = await getUserFromToken(token);

      if (!user) {
        return NextResponse.json(
          { error: 'Unauthorized: Invalid token' },
          { status: 401 }
        );
      }

      // Connect to database
      await connectDB();

      return handler(req, { user });
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

export function apiResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function apiError(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function parseQueryParams(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  return Object.fromEntries(searchParams.entries());
}
