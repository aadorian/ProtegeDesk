import { useState } from 'react'

export function useCopyToClipboard(text: string) {
  const [copied, setCopied] = useState(false)

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      return true
    } catch (err) {
      console.error('Copy failed:', err)
      return false
    }
  }

  return { copy, copied }
}
