import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'HireSense - AI-Powered Job Search & Application Tracking',
    template: '%s | HireSense',
  },
  description:
    'Track your job applications, get AI-powered job matching, and land your dream job faster with HireSense.',
  keywords: [
    'job tracker',
    'job search',
    'application tracking',
    'AI job matching',
    'career',
    'resume',
    'HireSense',
  ],
  authors: [{ name: 'HireSense' }],
  creator: 'HireSense',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  icons: {
    icon: '/fav.png',
    shortcut: '/fav.png',
    apple: '/fav.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'HireSense - AI-Powered Job Search & Application Tracking',
    description:
      'Track your job applications, get AI-powered job matching, and land your dream job faster.',
    siteName: 'HireSense',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HireSense - AI-Powered Job Search',
    description: 'Track applications & get AI-powered job matching.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
