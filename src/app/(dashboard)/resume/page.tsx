'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  FileText,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  Sparkles,
  Briefcase,
  GraduationCap,
  Code,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { getIdToken } from '@/lib/firebase';
import { formatDate } from '@/utils/helpers';

interface ParsedData {
  skills: string[];
  experience: string[];
  education: string[];
  summary: string;
}

interface ResumeData {
  fileUrl: string;
  fileName: string;
  uploadedAt: string;
  parsedData?: ParsedData;
}

export default function ResumePage() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // Fetch existing resume on mount
  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const token = await getIdToken();
      if (!token) return;

      const response = await fetch('/api/resume', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResume(data.resume);
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const token = await getIdToken();
      if (!token) {
        toast.error('Please sign in to upload your resume');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const data = await response.json();
        setResume(data.resume);
        toast.success('Resume uploaded and analyzed successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume. Please try again.');
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
        '.docx',
      ],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    disabled: uploading,
  });

  const handleDelete = async () => {
    if (!resume) return;

    setDeleting(true);
    try {
      const token = await getIdToken();
      if (!token) return;

      const response = await fetch('/api/resume', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setResume(null);
        toast.success('Resume deleted successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete resume');
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Resume</h1>
        <p className="text-muted-foreground mt-1">
          Upload your resume to get AI-powered job matching and recommendations
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Resume
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploading ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">
                          {uploadProgress < 50
                            ? 'Uploading your resume...'
                            : uploadProgress < 90
                            ? 'Analyzing with AI...'
                            : 'Almost done...'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          This may take a moment
                        </p>
                      </div>
                    </div>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              ) : resume ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{resume.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        Uploaded on {formatDate(resume.uploadedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={resume.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          View
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="text-destructive hover:text-destructive"
                      >
                        {deleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Resume analyzed and ready for job matching</span>
                  </div>

                  <Separator />

                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/50"
                  >
                    <input {...getInputProps()} />
                    <p className="text-sm text-muted-foreground">
                      Drop a new file here or click to replace your current resume
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-4">
                    <div
                      className={`h-16 w-16 rounded-full flex items-center justify-center transition-colors ${
                        isDragActive ? 'bg-primary/10' : 'bg-muted'
                      }`}
                    >
                      <Upload
                        className={`h-8 w-8 ${
                          isDragActive ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium">
                        {isDragActive
                          ? 'Drop your resume here'
                          : 'Drag & drop your resume'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        or click to browse (PDF, DOC, DOCX - max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Parsed Data */}
          {resume?.parsedData && (
            <>
              {/* Skills */}
              {resume.parsedData.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {resume.parsedData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Experience */}
              {resume.parsedData.experience.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {resume.parsedData.experience.map((exp, index) => (
                        <li key={index} className="flex gap-3">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-sm">{exp}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {resume.parsedData.education.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {resume.parsedData.education.map((edu, index) => (
                        <li key={index} className="flex gap-3">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-sm">{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Summary */}
          {resume?.parsedData?.summary && (
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {resume.parsedData.summary}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Tips for Better Matching
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Use a clean, well-formatted PDF resume</span>
              </div>
              <div className="flex gap-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Include relevant keywords and skills</span>
              </div>
              <div className="flex gap-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Highlight quantifiable achievements</span>
              </div>
              <div className="flex gap-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Keep your resume updated regularly</span>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          {resume?.parsedData && (
            <Card>
              <CardHeader>
                <CardTitle>Resume Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Skills</span>
                  <span className="font-medium">
                    {resume.parsedData.skills.length}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Experience entries
                  </span>
                  <span className="font-medium">
                    {resume.parsedData.experience.length}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Education entries
                  </span>
                  <span className="font-medium">
                    {resume.parsedData.education.length}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
