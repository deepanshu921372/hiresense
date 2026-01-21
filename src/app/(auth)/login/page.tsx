'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/helpers';

const features = [
  'AI-powered job matching',
  'Smart application tracking',
  'Resume analysis & tips',
  'Interview preparation',
];

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { signInGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInGoogle();
      toast.success('Welcome to HireSense!');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center justify-between mb-12">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/fav.png"
                alt="HireSense"
                width={40}
                height={40}
                priority
              />
              <span className="text-xl font-bold bg-gradient-to-r from-[#7B68EE] via-[#4169E1] to-[#20B2AA] bg-clip-text text-transparent">
                HireSense
              </span>
            </Link>
            <ThemeToggle />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome to HireSense
            </h1>
            <p className="mt-3 text-muted-foreground">
              Your AI-powered job search companion
            </p>
          </div>

          {/* Sign In Card */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              {/* Google Sign In Button */}
              <Button
                variant="outline"
                className="w-full h-12 cursor-pointer text-base font-medium"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>

              {/* Terms */}
              <p className="mt-6 text-center text-xs text-muted-foreground">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-[#7B68EE] via-[#4169E1] to-[#20B2AA]">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative flex flex-col justify-center p-12 text-white">
          <div className="max-w-md">
            {/* Logo Icon */}
            <div className="mb-8">
              <Image
                src="/fav.png"
                alt="HireSense"
                width={80}
                height={80}
                className="drop-shadow-2xl"
              />
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Track your job applications with AI
            </h2>
            <p className="text-white/80 mb-8">
              Get personalized job matches, track application progress, and land
              your dream job faster with our intelligent job tracking platform.
            </p>

            {/* Feature List */}
            <ul className="space-y-4">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm text-white/70">Jobs Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm text-white/70">Match Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold">Free</div>
                <div className="text-sm text-white/70">To Start</div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}
