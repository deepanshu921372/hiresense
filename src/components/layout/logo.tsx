'use client';

import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ collapsed = false, className, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { icon: 28, text: 'text-base' },
    md: { icon: 36, text: 'text-lg' },
    lg: { icon: 48, text: 'text-2xl' },
  };

  const currentSize = sizes[size];

  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 transition-all duration-200 ${className}`}
    >
      {/* Logo Icon */}
      <Image
        src="/fav.png"
        alt="HireSense"
        width={currentSize.icon}
        height={currentSize.icon}
        className="flex-shrink-0"
        priority
      />

      {/* Logo Text */}
      {!collapsed && (
        <span
          className={`font-bold tracking-tight bg-gradient-to-r from-[#7B68EE] via-[#4169E1] to-[#20B2AA] bg-clip-text text-transparent ${currentSize.text}`}
        >
          HireSense
        </span>
      )}
    </Link>
  );
}
