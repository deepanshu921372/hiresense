'use client';

import {
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn, formatSalary, formatRelativeTime } from '@/utils/helpers';

export interface JobCardProps {
  id: string;
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
  matchScore?: number;
  isSaved?: boolean;
  isSaving?: boolean;
  onSave?: (id: string) => void;
  onApply?: (id: string) => void;
  onClick?: (id: string) => void;
}

const typeColors: Record<string, string> = {
  'full-time': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  'part-time': 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  contract: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  internship: 'bg-green-500/10 text-green-600 dark:text-green-400',
  remote: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

const experienceLevelLabels: Record<string, string> = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior',
  lead: 'Lead',
};

export function JobCard({
  id,
  title,
  company,
  companyLogo,
  location,
  type,
  salary,
  experienceLevel,
  skills,
  postedAt,
  matchScore,
  isSaved,
  isSaving,
  onSave,
  onApply,
  onClick,
}: JobCardProps) {
  const getMatchScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
    if (score >= 40) return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
    return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
  };

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/30 cursor-pointer',
        matchScore && matchScore >= 70 && 'border-green-500/20'
      )}
      onClick={() => onClick?.(id)}
    >
      {/* Match Score Badge */}
      {matchScore !== undefined && (
        <div className="absolute top-4 right-4">
          <Badge
            variant="outline"
            className={cn(
              'font-semibold',
              getMatchScoreColor(matchScore)
            )}
          >
            {matchScore}% Match
          </Badge>
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={company}
                className="h-14 w-14 rounded-xl object-cover border"
              />
            ) : (
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            )}
          </div>

          {/* Job Details */}
          <div className="flex-1 min-w-0">
            {/* Title & Company */}
            <div className="mb-2">
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">{company}</p>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {location}
              </span>
              {salary && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  {formatSalary(salary.min, salary.max, salary.currency)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatRelativeTime(postedAt)}
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                variant="secondary"
                className={cn('capitalize', typeColors[type])}
              >
                {type.replace('-', ' ')}
              </Badge>
              <Badge variant="secondary">
                {experienceLevelLabels[experienceLevel]}
              </Badge>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {skills.slice(0, 5).map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="text-xs font-normal"
                  >
                    {skill}
                  </Badge>
                ))}
                {skills.length > 5 && (
                  <Badge variant="outline" className="text-xs font-normal">
                    +{skills.length - 5} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onApply?.(id);
            }}
          >
            Apply Now
            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant={isSaved ? 'secondary' : 'outline'}
            disabled={isSaving}
            onClick={(e) => {
              e.stopPropagation();
              onSave?.(id);
            }}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : isSaved ? (
              <>
                <BookmarkCheck className="mr-1.5 h-3.5 w-3.5" />
                Saved
              </>
            ) : (
              <>
                <Bookmark className="mr-1.5 h-3.5 w-3.5" />
                Save
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
