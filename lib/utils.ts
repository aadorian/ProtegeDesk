import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility to build a className string from multiple Tailwind classes,
 * including conditional ones, and automatically resolve conflicts.
 *
 * @param inputs
 * Valid inputs: string, arrays, objects, or conditional expressions.
 *
 * @returns A merged class name string with conflicts resolved.
 *
 * @example
 * ```ts
 * const isError = true
 * cn('text-lg', 'text-lg', { 'text-red-800': isError })
 * // => "text-lg text-red-800"
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Utility to format a Date as a human-readable relative time string.
 *
 * Converts the provided date into phrases like "just now",
 * "2 minutes ago", "1 hour ago", or "3 days ago" depending on
 * the difference from the current time.
 *
 * @param date - The date to format relative to the current time.
 *
 * @returns A string describing the relative time difference.
 *
 * @example
 * ```ts
 * const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
 * formatRelativeTime(fiveMinutesAgo);
 * // => "5 minutes ago"
 *
 * const now = new Date();
 * formatRelativeTime(now);
 * // => "just now"
 * ```
 */
export function formatRelativeTime(date: Date): string {
  const MS_PER_SECOND = 1000
  const SECONDS_PER_MINUTE = 60
  const MINUTES_PER_HOUR = 60
  const HOURS_PER_DAY = 24
  const JUST_NOW_THRESHOLD = 10

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / MS_PER_SECOND)
  const diffMin = Math.floor(diffSec / SECONDS_PER_MINUTE)
  const diffHour = Math.floor(diffMin / MINUTES_PER_HOUR)
  const diffDay = Math.floor(diffHour / HOURS_PER_DAY)

  if (diffSec < JUST_NOW_THRESHOLD) {
    return 'just now'
  }
  if (diffSec < SECONDS_PER_MINUTE) {
    return `${diffSec} seconds ago`
  }
  if (diffMin === 1) {
    return '1 minute ago'
  }
  if (diffMin < MINUTES_PER_HOUR) {
    return `${diffMin} minutes ago`
  }
  if (diffHour === 1) {
    return '1 hour ago'
  }
  if (diffHour < HOURS_PER_DAY) {
    return `${diffHour} hours ago`
  }
  if (diffDay === 1) {
    return '1 day ago'
  }
  return `${diffDay} days ago`
}

/**
 * Utility to format a Date as a human-readable absolute timestamp.
 *
 * Converts the provided date into a string including the full
 * year, month, day, hour, minute, and second in the `en-US` locale.
 * This is useful for displaying exact timestamps in tooltips,
 * logs, or detailed date/time displays.
 *
 * @param date - The date to format.
 *
 * @returns A string representing the absolute date and time.
 *
 * @example
 * ```ts
 * const date = new Date('2026-01-08T14:30:00');
 * formatAbsoluteTime(date);
 * // => "January 8, 2026, 02:30:00 PM"
 * ```
 */
export function formatAbsoluteTime(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
