'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PendingApplication {
  jobId: string;
  title: string;
  company: string;
  companyLogo?: string;
  applicationId?: string;
}

interface ApplyConfirmationPopupProps {
  isOpen: boolean;
  pendingJob: PendingApplication | null;
  onConfirm: (applied: 'yes' | 'no' | 'earlier') => Promise<void>;
  onClose: () => void;
}

export function ApplyConfirmationPopup({
  isOpen,
  pendingJob,
  onConfirm,
  onClose,
}: ApplyConfirmationPopupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | 'earlier' | null>(null);

  const handleConfirm = async (option: 'yes' | 'no' | 'earlier') => {
    setSelectedOption(option);
    setIsSubmitting(true);
    try {
      await onConfirm(option);
    } finally {
      setIsSubmitting(false);
      setSelectedOption(null);
    }
  };

  if (!pendingJob) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Application Status
          </DialogTitle>
          <DialogDescription>
            We noticed you were checking out a job opportunity.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Job Card */}
          <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
              {pendingJob.companyLogo ? (
                <img
                  src={pendingJob.companyLogo}
                  alt={pendingJob.company}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <Briefcase className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{pendingJob.title}</h4>
              <p className="text-sm text-muted-foreground truncate">
                {pendingJob.company}
              </p>
            </div>
          </div>

          <p className="mt-4 text-center text-sm font-medium">
            Did you apply to this job?
          </p>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={() => handleConfirm('yes')}
            disabled={isSubmitting}
            className="w-full gap-2"
          >
            {isSubmitting && selectedOption === 'yes' ? (
              <Clock className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Yes, I Applied
          </Button>
          <Button
            variant="outline"
            onClick={() => handleConfirm('no')}
            disabled={isSubmitting}
            className="w-full gap-2"
          >
            {isSubmitting && selectedOption === 'no' ? (
              <Clock className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            No, Just Browsing
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleConfirm('earlier')}
            disabled={isSubmitting}
            className="w-full gap-2 text-muted-foreground"
          >
            {isSubmitting && selectedOption === 'earlier' ? (
              <Clock className="h-4 w-4 animate-spin" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
            Applied Earlier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
