'use client';

import { useState, useEffect } from 'react';
import {
  Briefcase,
  FileText,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatRelativeDate } from '@/utils/helpers';
import { getIdToken } from '@/lib/firebase';

interface EmbeddedJob {
  externalId: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  experienceLevel: string;
  skills: string[];
  postedAt: string;
}

interface Application {
  _id: string;
  job: EmbeddedJob;
  status: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn';
  matchScore: number;
  appliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  total: number;
  saved: number;
  applied: number;
  interviewing: number;
  offered: number;
  rejected: number;
  responseRate: number;
  avgMatchScore: number;
}

const emptyStats: DashboardStats = {
  total: 0,
  saved: 0,
  applied: 0,
  interviewing: 0,
  offered: 0,
  rejected: 0,
  responseRate: 0,
  avgMatchScore: 0,
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  saved: { label: 'Saved', color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400', icon: Briefcase },
  applied: { label: 'Applied', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', icon: FileText },
  interviewing: { label: 'Interview', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', icon: Calendar },
  offered: { label: 'Offer', color: 'bg-green-500/10 text-green-600 dark:text-green-400', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-600 dark:text-red-400', icon: XCircle },
  withdrawn: { label: 'Withdrawn', color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400', icon: XCircle },
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = await getIdToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/applications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const apps = data.applications || [];
        setApplications(apps);

        // Use stats from API or calculate from applications
        if (data.stats) {
          const responseRate = calculateResponseRate(data.stats);
          const avgMatchScore = calculateAvgMatchScore(apps);
          setStats({
            ...data.stats,
            responseRate,
            avgMatchScore,
          });
        } else {
          setStats(calculateStats(apps));
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateResponseRate = (stats: { applied: number; interviewing: number; offered: number; rejected: number }) => {
    const appliedCount = stats.applied + stats.interviewing + stats.offered + stats.rejected;
    const responseCount = stats.interviewing + stats.offered + stats.rejected;
    return appliedCount > 0 ? Math.round((responseCount / appliedCount) * 100) : 0;
  };

  const calculateAvgMatchScore = (apps: Application[]) => {
    if (apps.length === 0) return 0;
    return Math.round(apps.reduce((sum, a) => sum + (a.matchScore || 0), 0) / apps.length);
  };

  const calculateStats = (apps: Application[]): DashboardStats => {
    const total = apps.length;
    const saved = apps.filter((a) => a.status === 'saved').length;
    const applied = apps.filter((a) => a.status === 'applied').length;
    const interviewing = apps.filter((a) => a.status === 'interviewing').length;
    const offered = apps.filter((a) => a.status === 'offered').length;
    const rejected = apps.filter((a) => a.status === 'rejected').length;

    const appliedCount = applied + interviewing + offered + rejected;
    const responseCount = interviewing + offered + rejected;
    const responseRate = appliedCount > 0 ? Math.round((responseCount / appliedCount) * 100) : 0;

    const avgMatchScore = apps.length > 0
      ? Math.round(apps.reduce((sum, a) => sum + (a.matchScore || 0), 0) / apps.length)
      : 0;

    return {
      total,
      saved,
      applied,
      interviewing,
      offered,
      rejected,
      responseRate,
      avgMatchScore,
    };
  };

  const filteredApplications =
    activeTab === 'all'
      ? applications
      : applications.filter((a) => a.status === activeTab);

  const upcomingInterviews = applications.filter(
    (a) => a.status === 'interviewing'
  ).length;

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
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track your job applications and monitor your progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
            </div>
            {stats.total > 0 ? (
              <div className="flex items-center gap-1 mt-3 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium">{stats.applied}</span>
                <span className="text-muted-foreground">applied</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-3">
                Save jobs to get started
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold mt-1">{stats.responseRate}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
            <Progress value={stats.responseRate} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interviews</p>
                <p className="text-2xl font-bold mt-1">{stats.interviewing}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {upcomingInterviews > 0
                  ? `${upcomingInterviews} in progress`
                  : 'No active interviews'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Match Score</p>
                <p className="text-2xl font-bold mt-1">{stats.avgMatchScore}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            {stats.avgMatchScore >= 70 ? (
              <div className="flex items-center gap-1 mt-3 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium">Great!</span>
                <span className="text-muted-foreground">matches</span>
              </div>
            ) : stats.avgMatchScore > 0 ? (
              <div className="flex items-center gap-1 mt-3 text-sm">
                <ArrowDownRight className="h-4 w-4 text-yellow-500" />
                <span className="text-muted-foreground">Room to improve</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-3">No data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Application Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.total === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No applications yet</p>
              <p className="text-sm mt-1">Start by saving jobs you&apos;re interested in</p>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {Object.entries({
                saved: stats.saved,
                applied: stats.applied,
                interviewing: stats.interviewing,
                offered: stats.offered,
                rejected: stats.rejected,
              }).map(([status, count]) => {
                const config = statusConfig[status];
                const Icon = config.icon;
                const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;

                return (
                  <div key={status} className="flex-1 min-w-[120px]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', config.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{config.label}</p>
                        <p className="text-xs text-muted-foreground">{percentage}%</p>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                    <p className="text-2xl font-bold mt-2">{count}</p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Applications</CardTitle>
            {applications.length > 5 && (
              <Button variant="outline" size="sm">
                View All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="applied">Applied</TabsTrigger>
              <TabsTrigger value="interviewing">Interview</TabsTrigger>
              <TabsTrigger value="offered">Offers</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No applications in this category</p>
                  {activeTab === 'all' && (
                    <p className="text-sm mt-1">Go to Jobs page to browse and save jobs</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.slice(0, 10).map((app) => {
                    const config = statusConfig[app.status];
                    const Icon = config.icon;

                    return (
                      <div
                        key={app._id}
                        className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        {/* Company Logo */}
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                          {app.job.companyLogo ? (
                            <img
                              src={app.job.companyLogo}
                              alt={app.job.company}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <Briefcase className="h-5 w-5 text-primary" />
                          )}
                        </div>

                        {/* Job Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{app.job.title}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {app.job.company} • {app.job.location}
                          </p>
                        </div>

                        {/* Match Score */}
                        <div className="hidden sm:block">
                          <Badge
                            variant="outline"
                            className={cn(
                              'font-semibold',
                              app.matchScore >= 70
                                ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
                                : app.matchScore >= 40
                                ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
                                : 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
                            )}
                          >
                            {app.matchScore}% Match
                          </Badge>
                        </div>

                        {/* Status */}
                        <Badge className={cn(config.color, 'gap-1')}>
                          <Icon className="h-3 w-3" />
                          {config.label}
                        </Badge>

                        {/* Date */}
                        <span className="text-xs text-muted-foreground hidden md:block">
                          {formatRelativeDate(app.updatedAt)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
