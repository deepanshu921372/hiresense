import { NextRequest, NextResponse } from 'next/server';
import { searchJobs, type SearchJobsParams } from '@/lib/jsearch';

// GET /api/jobs - Get jobs from JSearch API
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const workMode = searchParams.get('workMode');
    const baseQuery = searchParams.get('search') || searchParams.get('query') || 'software developer';

    // Append work mode to query for better search results
    let query = baseQuery;
    if (workMode === 'remote') {
      query = `${baseQuery} remote`;
    } else if (workMode === 'hybrid') {
      query = `${baseQuery} hybrid`;
    } else if (workMode === 'onsite') {
      query = `${baseQuery} on-site`;
    }

    const params: SearchJobsParams = {
      query,
      location: searchParams.get('location') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      numPages: 1,
      remoteOnly: workMode === 'remote',
      employmentType: searchParams.get('type') || undefined,
      datePosted: searchParams.get('datePosted') || 'month',
    };

    const { jobs, total } = await searchJobs(params);

    const pageNum = params.page || 1;
    const limitNum = 10;

    return NextResponse.json({
      jobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      source: 'jsearch',
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs', jobs: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } },
      { status: 500 }
    );
  }
}
