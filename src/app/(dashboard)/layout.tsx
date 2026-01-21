'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, Header } from '@/components/layout';
import { AIChat } from '@/components/chat';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { firebaseUser, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/login');
    }
  }, [loading, firebaseUser, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Full-height Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Main Content Area - to the right of sidebar */}
      <div className={cn(
        "min-h-screen transition-all duration-300",
        sidebarCollapsed ? "lg:pl-[70px]" : "lg:pl-64"
      )}>
        {/* Header */}
        <Header
          user={firebaseUser ? {
            displayName: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || undefined,
          } : null}
          onLogout={handleLogout}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Floating AI Chat Widget */}
      <AIChat />
    </div>
  );
}
