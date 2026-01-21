'use client';

import { type ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';
import { QueryProvider } from './query-provider';
import { Toaster } from '@/components/ui/sonner';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            className: 'border-border',
          }}
        />
      </QueryProvider>
    </ThemeProvider>
  );
}
