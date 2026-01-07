import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date as relative time (e.g., "2 minutes ago", "just now")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 10) {
    return 'just now'
  }
  if (diffSec < 60) {
    return `${diffSec} seconds ago`
  }
  if (diffMin === 1) {
    return '1 minute ago'
  }
  if (diffMin < 60) {
    return `${diffMin} minutes ago`
  }
  if (diffHour === 1) {
    return '1 hour ago'
  }
  if (diffHour < 24) {
    return `${diffHour} hours ago`
  }
  if (diffDay === 1) {
    return '1 day ago'
  }
  return `${diffDay} days ago`
}

/**
 * Formats a date as absolute time for tooltips
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
