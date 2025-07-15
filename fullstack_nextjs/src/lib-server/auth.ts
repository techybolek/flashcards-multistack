import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

/**
 * Extracts the userId from a Next.js API request using cookies or Authorization header.
 * Returns undefined if not found or invalid.
 */
export async function extractUserIdFromRequest(req: NextRequest): Promise<string | undefined> {
  // Try to get token from cookies
  const cookieStore = await cookies();
  let token = cookieStore.get('token')?.value;

  // Fallback to Authorization header
  if (!token) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  // Decode token and extract userId
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      return decoded.userId;
    } catch {
      return undefined;
    }
  }
  return undefined;
} 