import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { MATCH_SCORE_THRESHOLDS } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function isValidDate(date: unknown): boolean {
  if (!date) return false;
  const d = new Date(date as string | number | Date);
  return !isNaN(d.getTime());
}

export function formatRelativeDate(date: Date | string | null | undefined): string {
  if (!isValidDate(date)) return '-';
  const d = new Date(date!);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatDate(date: Date | string | null | undefined, formatStr = 'MMM d, yyyy'): string {
  if (!isValidDate(date)) return '-';
  return format(new Date(date!), formatStr);
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!isValidDate(date)) return '-';
  return format(new Date(date!), 'MMM d, yyyy h:mm a');
}

export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!isValidDate(date)) return '-';
  return formatDistanceToNow(new Date(date!), { addSuffix: true });
}

export function getMatchScoreColor(score: number): 'high' | 'medium' | 'low' {
  if (score >= MATCH_SCORE_THRESHOLDS.HIGH) return 'high';
  if (score >= MATCH_SCORE_THRESHOLDS.MEDIUM) return 'medium';
  return 'low';
}

export function getMatchScoreLabel(score: number): string {
  if (score >= MATCH_SCORE_THRESHOLDS.HIGH) return 'Strong Match';
  if (score >= MATCH_SCORE_THRESHOLDS.MEDIUM) return 'Good Match';
  return 'Low Match';
}

export function getMatchScoreClassName(score: number): string {
  return `match-${getMatchScoreColor(score)}`;
}

export function getStatusClassName(status: string): string {
  return `status-${status}`;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    applied: 'Applied',
    interview: 'Interview',
    offer: 'Offer',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn',
  };
  return labels[status] || status;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatSalary(min: number, max: number): string {
  const formatK = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`);
  if (min === max) return formatK(min);
  return `${formatK(min)} - ${formatK(max)}`;
}

export function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else {
      searchParams.set(key, String(value));
    }
  });
  return searchParams.toString();
}

export function parseQueryString(queryString: string): Record<string, string | string[]> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string | string[]> = {};
  params.forEach((value, key) => {
    if (result[key]) {
      if (Array.isArray(result[key])) {
        (result[key] as string[]).push(value);
      } else {
        result[key] = [result[key] as string, value];
      }
    } else {
      result[key] = value;
    }
  });
  return result;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function (...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('Failed to save to localStorage');
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateId(): string {
  return crypto.randomUUID();
}
