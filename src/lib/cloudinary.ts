import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  public_id: string;
  secure_url: string;
  original_filename: string;
  format: string;
  bytes: number;
  created_at: string;
}

export async function uploadResume(
  file: Buffer,
  fileName: string
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'job-tracker/resumes',
        public_id: `${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}`,
        allowed_formats: ['pdf', 'doc', 'docx'],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            original_filename: result.original_filename,
            format: result.format,
            bytes: result.bytes,
            created_at: result.created_at,
          });
        } else {
          reject(new Error('Upload failed'));
        }
      }
    );

    uploadStream.end(file);
  });
}

export async function deleteResume(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw',
    });
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting resume:', error);
    return false;
  }
}

export default cloudinary;
