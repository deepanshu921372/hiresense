'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, Briefcase, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { JobCard, JobFilters, type JobFiltersType } from '@/components/jobs';
import { ApplyConfirmationPopup } from '@/components/popup';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { debounce } from '@/utils/helpers';
import { getIdToken } from '@/lib/firebase';

interface Job {
  _id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  skills: string[];
  postedAt: string;
  description?: string;
  applyLink?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SavedJobInfo {
  applicationId: string;
  status: string;
}

interface PendingApplication {
  jobId: string;
  title: string;
  company: string;
  companyLogo?: string;
  applicationId?: string;
  timestamp: number;
}

const defaultFilters: JobFiltersType = {
  search: '',
  type: '',
  experienceLevel: '',
  location: '',
  minSalary: 0,
  maxSalary: 500000,
  skills: [],
  workMode: 'all',
  matchScore: 'all',
  datePosted: 'month',
};

const PENDING_APPLY_KEY = 'hiresense_pending_apply';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFiltersType>(defaultFilters);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [savedJobsMap, setSavedJobsMap] = useState<Record<string, SavedJobInfo>>({});
  const [savingJobs, setSavingJobs] = useState<Set<string>>(new Set());
  const [jobScores, setJobScores] = useState<Record<string, number>>({});
  const [loadingScores, setLoadingScores] = useState(false);

  // Smart Popup Flow state
  const [showApplyPopup, setShowApplyPopup] = useState(false);
  const [pendingApplication, setPendingApplication] = useState<PendingApplication | null>(null);
  const wasHidden = useRef(false);

  // Check for pending application on mount and visibility change
  useEffect(() => {
    const checkPendingApplication = () => {
      try {
        const stored = localStorage.getItem(PENDING_APPLY_KEY);
        if (stored) {
          const pending = JSON.parse(stored) as PendingApplication;
          // Only show if within last 30 minutes
          if (Date.now() - pending.timestamp < 30 * 60 * 1000) {
            setPendingApplication(pending);
            setShowApplyPopup(true);
          } else {
            localStorage.removeItem(PENDING_APPLY_KEY);
          }
        }
      } catch {
        localStorage.removeItem(PENDING_APPLY_KEY);
      }
    };

    // Check on mount
    checkPendingApplication();

    // Listen for visibility change (when user returns from another tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        wasHidden.current = true;
      } else if (document.visibilityState === 'visible' && wasHidden.current) {
        wasHidden.current = false;
        // Small delay to ensure user has returned
        setTimeout(checkPendingApplication, 500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Fetch saved job IDs on mount
  const fetchSavedJobs = useCallback(async () => {
    try {
      const token = await getIdToken();
      if (!token) return;

      const response = await fetch('/api/applications/saved', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSavedJobsMap(data.savedJobsMap || {});
      }
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  }, []);

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  const fetchJobs = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const params = new URLSearchParams();
        params.set('page', String(page));

        if (filters.search) params.set('search', filters.search);
        if (filters.type) params.set('type', filters.type);
        if (filters.location) params.set('location', filters.location);
        if (filters.workMode && filters.workMode !== 'all') {
          params.set('workMode', filters.workMode);
        }
        if (filters.datePosted) params.set('datePosted', filters.datePosted);

        const response = await fetch(`/api/jobs?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const data = await response.json();

        if (append) {
          setJobs((prev) => [...prev, ...data.jobs]);
        } else {
          setJobs(data.jobs || []);
        }
        setPagination(data.pagination || {
          page: 1,
          limit: 10,
          total: data.jobs?.length || 0,
          totalPages: 1,
        });
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again.');
        setJobs([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filters]
  );

  const debouncedFetch = useCallback(
    debounce(() => {
      fetchJobs(1);
    }, 300),
    [fetchJobs]
  );

  useEffect(() => {
    debouncedFetch();
  }, [filters, debouncedFetch]);

  // Fetch match scores for jobs
  const fetchMatchScores = useCallback(async (jobsToScore: Job[]) => {
    if (jobsToScore.length === 0) return;

    try {
      const token = await getIdToken();
      if (!token) return;

      setLoadingScores(true);

      const response = await fetch('/api/jobs/match/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobs: jobsToScore.map((job) => ({
            _id: job._id,
            title: job.title,
            description: job.description,
            skills: job.skills,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const scoresMap: Record<string, number> = {};
        data.scores?.forEach((item: { jobId: string; score: number }) => {
          scoresMap[item.jobId] = item.score;
        });
        setJobScores((prev) => ({ ...prev, ...scoresMap }));
      }
    } catch (error) {
      console.error('Error fetching match scores:', error);
    } finally {
      setLoadingScores(false);
    }
  }, []);

  // Fetch match scores when jobs are loaded
  useEffect(() => {
    if (jobs.length > 0 && !loading) {
      // Only fetch scores for jobs we don't have scores for yet
      const jobsNeedingScores = jobs.filter((job) => jobScores[job._id] === undefined);
      if (jobsNeedingScores.length > 0) {
        fetchMatchScores(jobsNeedingScores);
      }
    }
  }, [jobs, loading, fetchMatchScores, jobScores]);

  // Get best matches (top 8 jobs by score)
  const bestMatches = jobs
    .filter((job) => jobScores[job._id] !== undefined)
    .map((job) => ({ ...job, score: jobScores[job._id] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .filter((job) => job.score >= 50); // Only show jobs with decent match scores

  const saveJobToDb = async (job: Job): Promise<SavedJobInfo | null> => {
    const token = await getIdToken();
    if (!token) {
      toast.error('Please sign in to save jobs');
      return null;
    }

    // Calculate real AI match score
    let matchScore = 60; // Default fallback score
    try {
      const matchResponse = await fetch('/api/jobs/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          job: {
            title: job.title,
            description: job.description,
            skills: job.skills,
          },
        }),
      });

      if (matchResponse.ok) {
        const matchData = await matchResponse.json();
        matchScore = matchData.score || 60;
      }
    } catch (error) {
      console.error('Error calculating match score:', error);
      // Continue with default score on error
    }

    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        job: {
          externalId: job._id,
          title: job.title,
          company: job.company,
          companyLogo: job.companyLogo,
          location: job.location,
          type: job.type,
          salary: job.salary,
          experienceLevel: job.experienceLevel,
          skills: job.skills,
          description: job.description,
          applyLink: job.applyLink,
          postedAt: job.postedAt,
        },
        matchScore,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        applicationId: data.application._id,
        status: data.application.status,
      };
    }
    return null;
  };

  const handleSaveJob = async (jobId: string) => {
    const job = jobs.find((j) => j._id === jobId);
    if (!job) return;

    const isSaved = !!savedJobsMap[jobId];
    setSavingJobs((prev) => new Set(prev).add(jobId));

    try {
      const token = await getIdToken();
      if (!token) {
        toast.error('Please sign in to save jobs');
        return;
      }

      if (isSaved) {
        const response = await fetch(`/api/applications?jobId=${encodeURIComponent(jobId)}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setSavedJobsMap((prev) => {
            const newMap = { ...prev };
            delete newMap[jobId];
            return newMap;
          });
          toast.success('Job removed from saved');
        } else {
          const data = await response.json();
          toast.error(data.error || 'Failed to remove job');
        }
      } else {
        const savedInfo = await saveJobToDb(job);
        if (savedInfo) {
          setSavedJobsMap((prev) => ({
            ...prev,
            [jobId]: savedInfo,
          }));
          toast.success('Job saved!');
        }
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Something went wrong');
    } finally {
      setSavingJobs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  const handleApplyJob = async (jobId: string) => {
    const job = jobs.find((j) => j._id === jobId);
    if (!job) return;

    // First save the job if not saved
    let savedInfo = savedJobsMap[jobId];
    if (!savedInfo) {
      setSavingJobs((prev) => new Set(prev).add(jobId));
      try {
        const newSavedInfo = await saveJobToDb(job);
        if (newSavedInfo) {
          savedInfo = newSavedInfo;
          setSavedJobsMap((prev) => ({
            ...prev,
            [jobId]: newSavedInfo,
          }));
        }
      } finally {
        setSavingJobs((prev) => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      }
    }

    // Store pending application for popup flow
    const pendingApp: PendingApplication = {
      jobId: job._id,
      title: job.title,
      company: job.company,
      companyLogo: job.companyLogo,
      applicationId: savedInfo?.applicationId,
      timestamp: Date.now(),
    };
    localStorage.setItem(PENDING_APPLY_KEY, JSON.stringify(pendingApp));

    // Open apply link in new tab
    if (job.applyLink) {
      window.open(job.applyLink, '_blank');
    } else {
      toast.info(`No direct apply link available for ${job.title}`);
      // Clear pending since no link was opened
      localStorage.removeItem(PENDING_APPLY_KEY);
    }
  };

  const handleApplyConfirmation = async (response: 'yes' | 'no' | 'earlier') => {
    if (!pendingApplication) return;

    // Clear the pending application
    localStorage.removeItem(PENDING_APPLY_KEY);

    if (response === 'yes' || response === 'earlier') {
      // Update status to applied
      const applicationId = pendingApplication.applicationId || savedJobsMap[pendingApplication.jobId]?.applicationId;

      if (applicationId) {
        try {
          const token = await getIdToken();
          if (token) {
            const apiResponse = await fetch('/api/applications', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                applicationId,
                status: 'applied',
              }),
            });

            if (apiResponse.ok) {
              setSavedJobsMap((prev) => ({
                ...prev,
                [pendingApplication.jobId]: {
                  ...prev[pendingApplication.jobId],
                  status: 'applied',
                },
              }));
              toast.success(`Marked as applied to ${pendingApplication.title} at ${pendingApplication.company}`);
            }
          }
        } catch (error) {
          console.error('Error updating application status:', error);
        }
      }
    } else {
      toast.info('No worries! The job is still saved for later.');
    }

    setShowApplyPopup(false);
    setPendingApplication(null);
  };

  const handleJobClick = (jobId: string) => {
    const job = jobs.find((j) => j._id === jobId);
    if (job?.applyLink) {
      window.open(job.applyLink, '_blank');
    }
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages) {
      fetchJobs(pagination.page + 1, true);
    }
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
        <p className="text-muted-foreground mt-1">
          Discover jobs that match your skills and preferences
        </p>
      </div>

      {/* Filters */}
      <JobFilters
        filters={filters}
        onFiltersChange={setFilters}
        onReset={handleResetFilters}
        totalJobs={pagination.total || jobs.length}
      />

      {/* Job List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="h-14 w-14 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h3 className="font-semibold text-lg mb-2">Error loading jobs</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => fetchJobs(1)}>Try Again</Button>
          </CardContent>
        </Card>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search criteria
            </p>
            <Button variant="outline" onClick={handleResetFilters}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Best Matches Section */}
          {bestMatches.length > 0 && !filters.search && !filters.type && !filters.experienceLevel && (
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <h2 className="text-lg font-semibold">Best Matches for You</h2>
                {loadingScores && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              <p className="text-sm text-muted-foreground -mt-2">
                Jobs that best match your skills and experience
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {bestMatches.map((job) => (
                  <JobCard
                    key={`best-${job._id}`}
                    id={job._id}
                    title={job.title}
                    company={job.company}
                    companyLogo={job.companyLogo}
                    location={job.location}
                    type={job.type}
                    salary={job.salary}
                    experienceLevel={job.experienceLevel}
                    skills={job.skills}
                    postedAt={job.postedAt}
                    matchScore={job.score}
                    isSaved={!!savedJobsMap[job._id]}
                    isSaving={savingJobs.has(job._id)}
                    onSave={handleSaveJob}
                    onApply={handleApplyJob}
                    onClick={handleJobClick}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Jobs Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">All Jobs</h2>
            {jobs.map((job, index) => (
              <JobCard
                key={`${job._id}-${index}`}
                id={job._id}
                title={job.title}
                company={job.company}
                companyLogo={job.companyLogo}
                location={job.location}
                type={job.type}
                salary={job.salary}
                experienceLevel={job.experienceLevel}
                skills={job.skills}
                postedAt={job.postedAt}
                matchScore={jobScores[job._id]}
                isSaved={!!savedJobsMap[job._id]}
                isSaving={savingJobs.has(job._id)}
                onSave={handleSaveJob}
                onApply={handleApplyJob}
                onClick={handleJobClick}
              />
            ))}
          </div>

          {/* Load More */}
          {pagination.page < pagination.totalPages && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Jobs'
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Smart Apply Confirmation Popup */}
      <ApplyConfirmationPopup
        isOpen={showApplyPopup}
        pendingJob={pendingApplication}
        onConfirm={handleApplyConfirmation}
        onClose={() => {
          setShowApplyPopup(false);
          setPendingApplication(null);
          localStorage.removeItem(PENDING_APPLY_KEY);
        }}
      />
    </div>
  );
}
