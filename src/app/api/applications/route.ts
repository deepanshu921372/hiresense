import { NextRequest } from 'next/server';
import { withAuth, apiResponse, apiError, parseQueryParams, type ApiContext } from '@/lib/api-utils';
import Application from '@/models/Application';
import User from '@/models/User';

// GET /api/applications - Get user's applications
export const GET = withAuth(async (req: NextRequest, { user }: ApiContext) => {
  try {
    const params = parseQueryParams(req);
    const {
      status,
      page = '1',
      limit = '20',
      sortBy = 'updatedAt',
      sortOrder = 'desc',
    } = params;

    // Get user from database
    const dbUser = await User.findOne({ firebaseUid: user.uid });
    if (!dbUser) {
      return apiError('User not found', 404);
    }

    // Build query
    const query: Record<string, unknown> = { userId: dbUser._id };

    if (status) {
      query.status = status;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Sort
    const sortOptions: Record<string, 1 | -1> = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [applications, total] = await Promise.all([
      Application.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Application.countDocuments(query),
    ]);

    // Calculate stats
    const allApplications = await Application.find({ userId: dbUser._id }).lean();
    const stats = {
      total: allApplications.length,
      saved: allApplications.filter(a => a.status === 'saved').length,
      applied: allApplications.filter(a => a.status === 'applied').length,
      interviewing: allApplications.filter(a => a.status === 'interviewing').length,
      offered: allApplications.filter(a => a.status === 'offered').length,
      rejected: allApplications.filter(a => a.status === 'rejected').length,
    };

    return apiResponse({
      applications,
      stats,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return apiError('Failed to fetch applications', 500);
  }
});

// POST /api/applications - Create a new application (save a job)
export const POST = withAuth(async (req: NextRequest, { user }: ApiContext) => {
  try {
    const body = await req.json();
    const { job, matchScore = 0, notes } = body;

    if (!job || !job.externalId || !job.title || !job.company) {
      return apiError('Job data is required (externalId, title, company)', 400);
    }

    // Get user from database
    const dbUser = await User.findOne({ firebaseUid: user.uid });
    if (!dbUser) {
      return apiError('User not found', 404);
    }

    // Check if application already exists for this job
    const existingApplication = await Application.findOne({
      userId: dbUser._id,
      'job.externalId': job.externalId,
    });

    if (existingApplication) {
      return apiError('Job already saved', 409);
    }

    // Create application with embedded job data
    const application = await Application.create({
      userId: dbUser._id,
      job: {
        externalId: job.externalId,
        title: job.title,
        company: job.company,
        companyLogo: job.companyLogo,
        location: job.location || 'Not specified',
        type: job.type || 'full-time',
        salary: job.salary,
        experienceLevel: job.experienceLevel || 'entry',
        skills: job.skills || [],
        description: job.description,
        applyLink: job.applyLink,
        postedAt: job.postedAt || new Date().toISOString(),
      },
      status: 'saved',
      matchScore,
      notes,
      timeline: [
        {
          action: 'Job saved',
          date: new Date(),
        },
      ],
    });

    return apiResponse({ application }, 201);
  } catch (error) {
    console.error('Error creating application:', error);
    return apiError('Failed to save job', 500);
  }
});

// PUT /api/applications - Update application status
export const PUT = withAuth(async (req: NextRequest, { user }: ApiContext) => {
  try {
    const body = await req.json();
    const { applicationId, status, notes, offerDetails } = body;

    if (!applicationId) {
      return apiError('Application ID is required', 400);
    }

    // Get user from database
    const dbUser = await User.findOne({ firebaseUid: user.uid });
    if (!dbUser) {
      return apiError('User not found', 404);
    }

    // Find application
    const application = await Application.findOne({
      _id: applicationId,
      userId: dbUser._id,
    });

    if (!application) {
      return apiError('Application not found', 404);
    }

    // Update fields
    const updateData: Record<string, unknown> = {};

    if (status) {
      updateData.status = status;

      // Add timeline entry
      const timelineEntry = {
        action: `Status changed to ${status}`,
        date: new Date(),
      };
      application.timeline.push(timelineEntry);
      updateData.timeline = application.timeline;

      // Set appliedAt if status is changing to applied
      if (status === 'applied' && !application.appliedAt) {
        updateData.appliedAt = new Date();
      }
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (offerDetails) {
      updateData.offerDetails = offerDetails;
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      { $set: updateData },
      { new: true }
    );

    return apiResponse({ application: updatedApplication });
  } catch (error) {
    console.error('Error updating application:', error);
    return apiError('Failed to update application', 500);
  }
});

// DELETE /api/applications - Delete application (unsave job)
export const DELETE = withAuth(async (req: NextRequest, { user }: ApiContext) => {
  try {
    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get('id');
    const jobExternalId = searchParams.get('jobId');

    // Get user from database
    const dbUser = await User.findOne({ firebaseUid: user.uid });
    if (!dbUser) {
      return apiError('User not found', 404);
    }

    let result;

    if (applicationId) {
      // Delete by application ID
      result = await Application.findOneAndDelete({
        _id: applicationId,
        userId: dbUser._id,
      });
    } else if (jobExternalId) {
      // Delete by external job ID
      result = await Application.findOneAndDelete({
        userId: dbUser._id,
        'job.externalId': jobExternalId,
      });
    } else {
      return apiError('Application ID or Job ID is required', 400);
    }

    if (!result) {
      return apiError('Application not found', 404);
    }

    return apiResponse({ message: 'Job removed from saved', success: true });
  } catch (error) {
    console.error('Error deleting application:', error);
    return apiError('Failed to remove job', 500);
  }
});
