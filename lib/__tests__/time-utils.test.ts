import { formatRelativeTime, formatAbsoluteTime } from '../utils'

describe('Time Formatting Utilities', () => {
  describe('formatRelativeTime', () => {
    it('should return "just now" for very recent dates', () => {
      const now = new Date()
      const recent = new Date(now.getTime() - 5000) // 5 seconds ago
      expect(formatRelativeTime(recent)).toBe('just now')
    })

    it('should return seconds for times less than a minute ago', () => {
      const now = new Date()
      const thirtySecondsAgo = new Date(now.getTime() - 30000)
      expect(formatRelativeTime(thirtySecondsAgo)).toBe('30 seconds ago')
    })

    it('should return "1 minute ago" for exactly one minute', () => {
      const now = new Date()
      const oneMinuteAgo = new Date(now.getTime() - 60000)
      expect(formatRelativeTime(oneMinuteAgo)).toBe('1 minute ago')
    })

    it('should return minutes for times less than an hour ago', () => {
      const now = new Date()
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60000)
      expect(formatRelativeTime(thirtyMinutesAgo)).toBe('30 minutes ago')
    })

    it('should return "1 hour ago" for exactly one hour', () => {
      const now = new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60000)
      expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago')
    })

    it('should return hours for times less than a day ago', () => {
      const now = new Date()
      const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60000)
      expect(formatRelativeTime(fiveHoursAgo)).toBe('5 hours ago')
    })

    it('should return "1 day ago" for exactly one day', () => {
      const now = new Date()
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60000)
      expect(formatRelativeTime(oneDayAgo)).toBe('1 day ago')
    })

    it('should return days for times more than a day ago', () => {
      const now = new Date()
      const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60000)
      expect(formatRelativeTime(fiveDaysAgo)).toBe('5 days ago')
    })
  })

  describe('formatAbsoluteTime', () => {
    it('should format date with full details', () => {
      const testDate = new Date('2024-01-15T14:30:45')
      const formatted = formatAbsoluteTime(testDate)

      // Check that it contains expected components
      expect(formatted).toContain('2024')
      expect(formatted).toContain('January')
      expect(formatted).toContain('15')
    })

    it('should include time components', () => {
      const testDate = new Date('2024-06-20T09:15:30')
      const formatted = formatAbsoluteTime(testDate)

      // Should contain hour and minute
      expect(formatted).toMatch(/\d{1,2}:\d{2}:\d{2}/)
    })
  })
})
