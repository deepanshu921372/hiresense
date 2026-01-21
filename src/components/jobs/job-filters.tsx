'use client';

import { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Briefcase,
  DollarSign,
  GraduationCap,
  Target,
  Home,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { JOB_TYPES, EXPERIENCE_LEVELS, MATCH_SCORE_OPTIONS, WORK_MODES, DATE_POSTED_OPTIONS } from '@/utils/constants';

export interface JobFilters {
  search: string;
  type: string;
  experienceLevel: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  skills: string[];
  workMode: string;
  matchScore: string;
  datePosted: string;
}

interface JobFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  onReset: () => void;
  totalJobs: number;
}

const popularSkills = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'AWS',
  'Docker',
  'Kubernetes',
  'SQL',
  'GraphQL',
  'Machine Learning',
];

export function JobFilters({
  filters,
  onFiltersChange,
  onReset,
  totalJobs,
}: JobFiltersProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeFiltersCount = [
    filters.type,
    filters.experienceLevel,
    filters.location,
    filters.minSalary > 0,
    filters.maxSalary < 500000,
    filters.skills.length > 0,
    filters.workMode && filters.workMode !== 'all',
    filters.matchScore && filters.matchScore !== 'all',
    filters.datePosted && filters.datePosted !== 'any',
  ].filter(Boolean).length;

  const updateFilter = <K extends keyof JobFilters>(
    key: K,
    value: JobFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleSkill = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter((s) => s !== skill)
      : [...filters.skills, skill];
    updateFilter('skills', newSkills);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Job Type */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Briefcase className="h-4 w-4" />
          Job Type
        </Label>
        <Select
          value={filters.type}
          onValueChange={(value) => updateFilter('type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {JOB_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Experience Level */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <GraduationCap className="h-4 w-4" />
          Experience Level
        </Label>
        <Select
          value={filters.experienceLevel}
          onValueChange={(value) => updateFilter('experienceLevel', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            {EXPERIENCE_LEVELS.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Match Score */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Target className="h-4 w-4" />
          Match Score
        </Label>
        <Select
          value={filters.matchScore || 'all'}
          onValueChange={(value) => updateFilter('matchScore', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All matches" />
          </SelectTrigger>
          <SelectContent>
            {MATCH_SCORE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Posted */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Calendar className="h-4 w-4" />
          Date Posted
        </Label>
        <Select
          value={filters.datePosted || 'any'}
          onValueChange={(value) => updateFilter('datePosted', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any time" />
          </SelectTrigger>
          <SelectContent>
            {DATE_POSTED_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Work Mode */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Home className="h-4 w-4" />
          Work Mode
        </Label>
        <Select
          value={filters.workMode || 'all'}
          onValueChange={(value) => updateFilter('workMode', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All work modes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All work modes</SelectItem>
            {WORK_MODES.map((mode) => (
              <SelectItem key={mode.value} value={mode.value}>
                {mode.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4" />
          Location
        </Label>
        <Input
          placeholder="City, state, or country"
          value={filters.location}
          onChange={(e) => updateFilter('location', e.target.value)}
        />
      </div>

      <Separator />

      {/* Salary Range */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <DollarSign className="h-4 w-4" />
          Salary Range
        </Label>
        <div className="space-y-4">
          <Slider
            min={0}
            max={500000}
            step={10000}
            value={[filters.minSalary, filters.maxSalary]}
            onValueChange={([min, max]) => {
              updateFilter('minSalary', min);
              updateFilter('maxSalary', max);
            }}
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${(filters.minSalary / 1000).toFixed(0)}k</span>
            <span>
              {filters.maxSalary >= 500000
                ? '$500k+'
                : `$${(filters.maxSalary / 1000).toFixed(0)}k`}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Skills */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Skills</Label>
        <div className="flex flex-wrap gap-2">
          {popularSkills.map((skill) => (
            <Badge
              key={skill}
              variant={filters.skills.includes(skill) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleSkill(skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      {activeFiltersCount > 0 && (
        <>
          <Separator />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onReset();
              setMobileFiltersOpen(false);
            }}
          >
            <X className="mr-2 h-4 w-4" />
            Clear all filters
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs, companies, or keywords..."
            className="pl-10 h-11"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

        {/* Mobile Filter Button */}
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-11 w-11 lg:hidden">
              <SlidersHorizontal className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Results count & Active filters */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{totalJobs}</span> jobs
          found
        </p>

        {/* Active filter badges */}
        {activeFiltersCount > 0 && (
          <div className="hidden sm:flex items-center gap-2">
            {filters.type && filters.type !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {JOB_TYPES.find((t) => t.value === filters.type)?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilter('type', '')}
                />
              </Badge>
            )}
            {filters.experienceLevel && filters.experienceLevel !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {EXPERIENCE_LEVELS.find((l) => l.value === filters.experienceLevel)?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilter('experienceLevel', '')}
                />
              </Badge>
            )}
            {filters.matchScore && filters.matchScore !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {MATCH_SCORE_OPTIONS.find((o) => o.value === filters.matchScore)?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilter('matchScore', 'all')}
                />
              </Badge>
            )}
            {filters.workMode && filters.workMode !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {WORK_MODES.find((m) => m.value === filters.workMode)?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilter('workMode', 'all')}
                />
              </Badge>
            )}
            {filters.datePosted && filters.datePosted !== 'any' && (
              <Badge variant="secondary" className="gap-1">
                {DATE_POSTED_OPTIONS.find((d) => d.value === filters.datePosted)?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilter('datePosted', 'any')}
                />
              </Badge>
            )}
            {filters.skills.length > 0 && (
              <Badge variant="secondary" className="gap-1">
                {filters.skills.length} skills
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilter('skills', [])}
                />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={onReset}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-7 gap-3">
          <Select
            value={filters.type || 'all'}
            onValueChange={(value) =>
              updateFilter('type', value === 'all' ? '' : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {JOB_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.experienceLevel || 'all'}
            onValueChange={(value) =>
              updateFilter('experienceLevel', value === 'all' ? '' : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              {EXPERIENCE_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.workMode || 'all'}
            onValueChange={(value) => updateFilter('workMode', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Work Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All work modes</SelectItem>
              {WORK_MODES.map((mode) => (
                <SelectItem key={mode.value} value={mode.value}>
                  {mode.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.matchScore || 'all'}
            onValueChange={(value) => updateFilter('matchScore', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Match Score" />
            </SelectTrigger>
            <SelectContent>
              {MATCH_SCORE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.datePosted || 'any'}
            onValueChange={(value) => updateFilter('datePosted', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Date Posted" />
            </SelectTrigger>
            <SelectContent>
              {DATE_POSTED_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Location"
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
