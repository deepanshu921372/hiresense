import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/firebase-admin';
import connectDB from '@/lib/mongodb';
import { User } from '@/models';
import { uploadResume, deleteResume } from '@/lib/cloudinary';
import { parseResume } from '@/lib/openrouter';
import { invalidateUserMatchScores, checkRateLimit } from '@/lib/cache';

// POST /api/resume - Upload and parse resume
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    const authUser = await getUserFromToken(token);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check rate limit for resume parsing (expensive operation)
    const rateLimitResult = await checkRateLimit(authUser.uid, 'RESUME_PARSE');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. You can upload ${rateLimitResult.limit} resumes per hour. Try again after ${rateLimitResult.resetAt.toISOString()}`,
        },
        { status: 429 }
      );
    }

    // Connect to database
    await connectDB();

    // Get form data
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF or Word document.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await uploadResume(buffer, file.name);

    // Extract text from PDF for parsing
    let resumeText = '';
    if (file.type === 'application/pdf') {
      try {
        // Use pdf-parse for text extraction
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(buffer);
        resumeText = pdfData.text;
      } catch (pdfError) {
        console.error('Error parsing PDF:', pdfError);
        // Continue without parsed text
      }
    }

    // Parse resume with AI if we have text
    let parsedData = {
      skills: [] as string[],
      experience: [] as string[],
      education: [] as string[],
      summary: '',
    };

    if (resumeText) {
      try {
        parsedData = await parseResume(resumeText);
      } catch (aiError) {
        console.error('Error parsing resume with AI:', aiError);
        // Continue without parsed data
      }
    }

    // Update user with resume data
    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: authUser.uid },
      {
        $set: {
          resume: {
            fileUrl: uploadResult.secure_url,
            fileName: file.name,
            uploadedAt: new Date(),
            parsedData,
          },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      // Clean up uploaded file if user update fails
      await deleteResume(uploadResult.public_id);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Invalidate all cached match scores for this user since resume changed
    await invalidateUserMatchScores(String(updatedUser._id));

    return NextResponse.json({
      message: 'Resume uploaded successfully',
      resume: {
        fileUrl: uploadResult.secure_url,
        fileName: file.name,
        uploadedAt: new Date(),
        parsedData,
      },
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json(
      { error: 'Failed to upload resume' },
      { status: 500 }
    );
  }
}

// DELETE /api/resume - Delete resume
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    const authUser = await getUserFromToken(token);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Get user
    const user = await User.findOne({ firebaseUid: authUser.uid });
    if (!user || !user.resume?.fileUrl) {
      return NextResponse.json(
        { error: 'No resume found' },
        { status: 404 }
      );
    }

    // Extract public ID from URL
    const urlParts = user.resume.fileUrl.split('/');
    const publicId = urlParts.slice(-2).join('/').replace(/\.[^/.]+$/, '');

    // Delete from Cloudinary
    await deleteResume(publicId);

    // Update user
    await User.findOneAndUpdate(
      { firebaseUid: authUser.uid },
      { $unset: { resume: 1 } }
    );

    return NextResponse.json({
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}

// GET /api/resume - Get user's resume data
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    const authUser = await getUserFromToken(token);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Get user
    const user = await User.findOne({ firebaseUid: authUser.uid });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      resume: user.resume || null,
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}
