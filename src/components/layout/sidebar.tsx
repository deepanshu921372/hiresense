'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Briefcase,
  LayoutDashboard,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface SidebarProps {
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const navItems = [
  {
    href: '/jobs',
    label: 'Jobs',
    icon: Briefcase,
    description: 'Browse & search jobs',
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Track applications',
  },
  {
    href: '/resume',
    label: 'Resume',
    icon: FileText,
    description: 'Upload & manage resume',
  },
];

function SidebarContent({
  collapsed,
  setCollapsed,
  onItemClick,
  showLogo = true,
}: {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onItemClick?: () => void;
  showLogo?: boolean;
}) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full flex-col relative">
        {/* Logo Section */}
        {showLogo && (
          <div className={cn(
            "flex items-center border-b border-border h-16 px-4",
            collapsed ? "justify-center" : "justify-between"
          )}>
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/fav.png"
                alt="HireSense"
                width={36}
                height={36}
                className="flex-shrink-0"
              />
              {!collapsed && (
                <span className="font-bold text-lg bg-gradient-to-r from-[#7B68EE] via-[#4169E1] to-[#20B2AA] bg-clip-text text-transparent">
                  HireSense
                </span>
              )}
            </Link>
          </div>
        )}

        {/* Collapse Toggle Button - Circular at edge */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "absolute top-[1.5rem] -right-3 z-50 hidden lg:flex",
            "h-6 w-6 items-center cursor-pointer justify-center rounded-full",
            "bg-background border border-border shadow-sm",
            "text-muted-foreground hover:text-foreground hover:bg-accent",
            "transition-all duration-200"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return collapsed ? (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    onClick={onItemClick}
                    className={cn(
                      'flex items-center justify-center h-11 w-11 mx-auto rounded-lg transition-all',
                      'hover:bg-accent hover:text-accent-foreground',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-2">
                  <span className="font-medium">{item.label}</span>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </TooltipProvider>
  );
}

export function Sidebar({ className, open, onOpenChange, collapsed: controlledCollapsed, onCollapsedChange }: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  // Use controlled or internal state
  const collapsed = controlledCollapsed ?? internalCollapsed;
  const setCollapsed = onCollapsedChange ?? setInternalCollapsed;

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/fav.png"
                alt="HireSense"
                width={32}
                height={32}
                className="flex-shrink-0"
              />
              <span className="font-bold bg-gradient-to-r from-[#7B68EE] via-[#4169E1] to-[#20B2AA] bg-clip-text text-transparent">
                HireSense
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange?.(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SidebarContent
            collapsed={false}
            setCollapsed={() => {}}
            onItemClick={() => onOpenChange?.(false)}
            showLogo={false}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - Full Height */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen border-r border-border bg-card transition-all duration-300 hidden lg:block',
          collapsed ? 'w-[70px]' : 'w-64',
          className
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          showLogo={true}
        />
      </aside>
    </>
  );
}
