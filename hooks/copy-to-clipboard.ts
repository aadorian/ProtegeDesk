import { useState } from 'react'

export function useCopyToClipboard(_text: string) {
  const [copied, setCopied] = useState(false)

  const COPY_FEEDBACK_DURATION_MS = 2000
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION_MS)
      return true
    } catch (err) {
      console.error('Copy failed:', err)
      return false
    }
  }

  return { copy, copied }
}
