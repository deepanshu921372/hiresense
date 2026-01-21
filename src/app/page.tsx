'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Target,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Zap,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo, ThemeToggle } from '@/components/layout';

const features = [
  {
    icon: Target,
    title: 'AI-Powered Matching',
    description:
      'Get personalized job recommendations based on your resume and skills with our intelligent matching algorithm.',
  },
  {
    icon: Sparkles,
    title: 'Smart Application Tracking',
    description:
      'Automatically track your applications with our intelligent popup that detects when you apply to jobs.',
  },
  {
    icon: BarChart3,
    title: 'Insights Dashboard',
    description:
      'Visualize your job search progress with detailed analytics and track application statuses.',
  },
  {
    icon: Zap,
    title: 'AI Chat Assistant',
    description:
      'Get instant help finding jobs, understanding matches, and navigating your career journey.',
  },
];

const stats = [
  { value: '10K+', label: 'Jobs Available' },
  { value: '95%', label: 'Match Accuracy' },
  { value: '50K+', label: 'Applications Tracked' },
  { value: '4.9/5', label: 'User Rating' },
];

const benefits = [
  'Resume parsing with AI skill extraction',
  'Real-time job matching scores',
  'Application status timeline',
  'Interview preparation tips',
  'Salary insights and comparisons',
  'Email notifications for new matches',
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-4 md:px-6">
          <Logo size="md" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild>
              <Link href="/login">
                Sign In with Google
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7B68EE]/5 via-background to-[#20B2AA]/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#4169E1]/10 via-transparent to-transparent" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="mx-auto max-w-7xl relative px-4 py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4169E1]/20 bg-[#4169E1]/5 px-4 py-1.5 text-sm text-[#4169E1]">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Job Matching</span>
            </div>

            {/* Heading */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Land Your Dream Job{' '}
              <span className="bg-gradient-to-r from-[#7B68EE] via-[#4169E1] to-[#20B2AA] bg-clip-text text-transparent">
                Faster
              </span>
            </h1>

            {/* Subheading */}
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Track applications, get AI-powered job matches based on your resume,
              and never miss an opportunity with smart notifications.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-[#7B68EE] via-[#4169E1] to-[#20B2AA] hover:opacity-90" asChild>
                <Link href="/login">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Preview */}
          <div className="mt-16 md:mt-24">
            <div className="relative mx-auto max-w-5xl">
              {/* Browser Frame */}
              <div className="rounded-xl border border-border bg-card shadow-2xl shadow-[#4169E1]/10 overflow-hidden">
                {/* Browser Header */}
                <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="mx-auto inline-flex items-center gap-2 rounded-md bg-background/80 px-3 py-1 text-xs text-muted-foreground">
                      <Shield className="h-3 w-3" />
                      hiresense.app
                    </div>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="relative aspect-[16/9] bg-gradient-to-br from-background to-muted/30 p-4 md:p-8">
                  {/* Mock Dashboard */}
                  <div className="grid h-full grid-cols-12 gap-4">
                    {/* Sidebar Mock */}
                    <div className="col-span-2 hidden rounded-lg bg-card/50 p-3 md:block">
                      <div className="space-y-2">
                        <Image
                          src="/fav.png"
                          alt="HireSense"
                          width={32}
                          height={32}
                          className="rounded-lg"
                        />
                        <div className="h-2 w-full rounded bg-muted" />
                        <div className="h-2 w-3/4 rounded bg-muted" />
                        <div className="h-2 w-1/2 rounded bg-muted" />
                      </div>
                    </div>

                    {/* Main Content Mock */}
                    <div className="col-span-12 space-y-4 md:col-span-10">
                      {/* Stats Cards */}
                      <div className="grid grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-card/80 p-3 shadow-sm"
                          >
                            <div className="mb-2 h-2 w-1/2 rounded bg-muted" />
                            <div className="h-4 w-3/4 rounded bg-[#4169E1]/20" />
                          </div>
                        ))}
                      </div>

                      {/* Job Cards Mock */}
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-card/80 p-4 shadow-sm"
                          >
                            <div className="flex items-start gap-3">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#7B68EE]/30 to-[#20B2AA]/30" />
                              <div className="flex-1 space-y-2">
                                <div className="h-3 w-3/4 rounded bg-muted" />
                                <div className="h-2 w-1/2 rounded bg-muted" />
                              </div>
                              <div className="rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                {85 + i * 2}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -left-4 top-1/4 hidden rounded-lg border border-border bg-card p-3 shadow-lg md:block">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium">New Match!</div>
                    <div className="text-[10px] text-muted-foreground">92% match score</div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 top-1/3 hidden rounded-lg border border-border bg-card p-3 shadow-lg md:block">
                <div className="flex items-center gap-2">
                  <Image
                    src="/fav.png"
                    alt="HireSense"
                    width={32}
                    height={32}
                  />
                  <div>
                    <div className="text-xs font-medium">Application Sent</div>
                    <div className="text-[10px] text-muted-foreground">Tracking started</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-foreground md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to land your next role
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed to streamline your job search and help
              you stand out from the competition.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-[#4169E1]/50 hover:shadow-lg hover:shadow-[#4169E1]/5"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#7B68EE]/10 to-[#20B2AA]/10 text-[#4169E1] transition-colors group-hover:from-[#7B68EE] group-hover:to-[#20B2AA] group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Focus on what matters -{' '}
                <span className="bg-gradient-to-r from-[#7B68EE] via-[#4169E1] to-[#20B2AA] bg-clip-text text-transparent">getting hired</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Stop wasting time on spreadsheets and manual tracking. Let our AI
                handle the organization while you focus on preparing for
                interviews.
              </p>

              <ul className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4169E1]/10">
                      <CheckCircle2 className="h-4 w-4 text-[#4169E1]" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Button size="lg" className="h-12 px-8 bg-gradient-to-r from-[#7B68EE] via-[#4169E1] to-[#20B2AA] hover:opacity-90" asChild>
                  <Link href="/login">
                    Start Tracking Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#7B68EE]/20 via-[#4169E1]/20 to-[#20B2AA]/20 p-8">
                <div className="h-full rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6">
                  {/* Mock resume preview */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-[#4169E1]/20" />
                      <div className="space-y-1">
                        <div className="h-3 w-24 rounded bg-muted" />
                        <div className="h-2 w-32 rounded bg-muted" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full rounded bg-muted" />
                      <div className="h-2 w-3/4 rounded bg-muted" />
                      <div className="h-2 w-5/6 rounded bg-muted" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'Node.js', 'TypeScript', 'AWS'].map((skill) => (
                        <div
                          key={skill}
                          className="rounded-full bg-[#4169E1]/10 px-2 py-1 text-[10px] text-[#4169E1]"
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-xl bg-[#7B68EE]/10" />
              <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-[#20B2AA]/10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7B68EE] via-[#4169E1] to-[#20B2AA] px-8 py-16 text-center text-white md:px-16 md:py-24">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
            </div>

            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ready to accelerate your job search?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
                Join thousands of job seekers who have already transformed their
                job search with HireSense.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 px-8 text-base"
                  asChild
                >
                  <Link href="/login">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} HireSense. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
