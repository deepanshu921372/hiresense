import connectDB from './mongodb';
import Cache from '@/models/Cache';
import RateLimit from '@/models/RateLimit';

export const CACHE_TTL = {
  MATCH_SCORE: 30 * 60,
  JOB_LIST: 5 * 60,
  USER_SESSION: 24 * 60 * 60,
  RESUME_PARSED: 60 * 60,
} as const;

export const RATE_LIMITS = {
  AI_SCORING: { limit: 50, windowMs: 60 * 1000 },
  AI_CHAT: { limit: 20, windowMs: 60 * 1000 },
  RESUME_PARSE: { limit: 10, windowMs: 60 * 60 * 1000 },
  GENERAL: { limit: 100, windowMs: 60 * 1000 },
} as const;

export function getMatchScoreCacheKey(userId: string, jobId: string): string {
  return `match:${userId}:${jobId}`;
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    await connectDB();
    const cached = await Cache.findOne({
      key,
      expiresAt: { $gt: new Date() },
    }).lean();
    return cached ? (cached.value as T) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

export async function setCache<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  try {
    await connectDB();
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    await Cache.findOneAndUpdate(
      { key },
      { key, value, expiresAt },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await connectDB();
    await Cache.deleteOne({ key });
  } catch (error) {
    console.error('Cache delete error:', error);
  }
}

export async function deleteCacheByPattern(pattern: string): Promise<void> {
  try {
    await connectDB();
    await Cache.deleteMany({ key: { $regex: `^${pattern}` } });
  } catch (error) {
    console.error('Cache delete pattern error:', error);
  }
}

export interface CachedMatchScore {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendation?: string;
}

export async function getCachedMatchScore(
  userId: string,
  jobId: string
): Promise<CachedMatchScore | null> {
  const key = getMatchScoreCacheKey(userId, jobId);
  return getCache<CachedMatchScore>(key);
}

export async function setCachedMatchScore(
  userId: string,
  jobId: string,
  data: CachedMatchScore
): Promise<void> {
  const key = getMatchScoreCacheKey(userId, jobId);
  await setCache(key, data, CACHE_TTL.MATCH_SCORE);
}

export async function getCachedMatchScores(
  userId: string,
  jobIds: string[]
): Promise<Map<string, CachedMatchScore>> {
  const result = new Map<string, CachedMatchScore>();
  if (jobIds.length === 0) return result;

  try {
    await connectDB();
    const keys = jobIds.map((jobId) => getMatchScoreCacheKey(userId, jobId));
    const cached = await Cache.find({
      key: { $in: keys },
      expiresAt: { $gt: new Date() },
    }).lean();

    cached.forEach((doc) => {
      const jobId = doc.key.split(':').pop();
      if (jobId) {
        result.set(jobId, doc.value as CachedMatchScore);
      }
    });
  } catch (error) {
    console.error('Cache mget error:', error);
  }

  return result;
}

export async function setCachedMatchScores(
  userId: string,
  scores: Array<{ jobId: string } & CachedMatchScore>
): Promise<void> {
  if (scores.length === 0) return;

  try {
    await connectDB();
    const expiresAt = new Date(Date.now() + CACHE_TTL.MATCH_SCORE * 1000);
    const operations = scores.map(({ jobId, ...data }) => ({
      updateOne: {
        filter: { key: getMatchScoreCacheKey(userId, jobId) },
        update: {
          $set: {
            key: getMatchScoreCacheKey(userId, jobId),
            value: data,
            expiresAt,
          },
        },
        upsert: true,
      },
    }));
    await Cache.bulkWrite(operations);
  } catch (error) {
    console.error('Cache bulk set error:', error);
  }
}

export async function invalidateUserMatchScores(userId: string): Promise<void> {
  await deleteCacheByPattern(`match:${userId}:`);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
}

export async function checkRateLimit(
  identifier: string,
  endpoint: keyof typeof RATE_LIMITS
): Promise<RateLimitResult> {
  try {
    await connectDB();
    const config = RATE_LIMITS[endpoint];
    const now = new Date();
    const windowStart = new Date(now.getTime() - config.windowMs);

    const record = await RateLimit.findOneAndUpdate(
      {
        identifier,
        endpoint,
        windowStart: { $gt: windowStart },
      },
      {
        $inc: { count: 1 },
        $setOnInsert: {
          identifier,
          endpoint,
          windowStart: now,
          expiresAt: new Date(now.getTime() + config.windowMs),
        },
      },
      { upsert: true, new: true }
    );

    const remaining = Math.max(0, config.limit - record.count);
    const success = record.count <= config.limit;

    return { success, limit: config.limit, remaining, resetAt: record.expiresAt };
  } catch (error) {
    console.error('Rate limit check error:', error);
    return {
      success: true,
      limit: RATE_LIMITS[endpoint].limit,
      remaining: RATE_LIMITS[endpoint].limit,
      resetAt: new Date(Date.now() + RATE_LIMITS[endpoint].windowMs),
    };
  }
}

export async function getRateLimitStatus(
  identifier: string,
  endpoint: keyof typeof RATE_LIMITS
): Promise<RateLimitResult> {
  try {
    await connectDB();
    const config = RATE_LIMITS[endpoint];
    const now = new Date();
    const windowStart = new Date(now.getTime() - config.windowMs);

    const record = await RateLimit.findOne({
      identifier,
      endpoint,
      windowStart: { $gt: windowStart },
    });

    if (!record) {
      return {
        success: true,
        limit: config.limit,
        remaining: config.limit,
        resetAt: new Date(now.getTime() + config.windowMs),
      };
    }

    const remaining = Math.max(0, config.limit - record.count);
    return { success: remaining > 0, limit: config.limit, remaining, resetAt: record.expiresAt };
  } catch (error) {
    console.error('Rate limit status error:', error);
    return {
      success: true,
      limit: RATE_LIMITS[endpoint].limit,
      remaining: RATE_LIMITS[endpoint].limit,
      resetAt: new Date(Date.now() + RATE_LIMITS[endpoint].windowMs),
    };
  }
}
