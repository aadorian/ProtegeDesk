'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollapsibleCardProps {
  title: string
  storageKey: string
  children: React.ReactNode
  defaultOpen?: boolean
  count?: number
}

export function CollapsibleCard({
  title,
  storageKey,
  children,
  defaultOpen = true,
  count,
}: CollapsibleCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true)
      const saved = localStorage.getItem(`details-section-${storageKey}`)
      if (saved) {
        setIsOpen(JSON.parse(saved))
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [storageKey])

  const toggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    if (isMounted) {
      localStorage.setItem(`details-section-${storageKey}`, JSON.stringify(newState))
    }
  }

  return (
    <Card>
      <CardHeader
        className="hover:bg-muted/50 cursor-pointer py-1 transition-colors select-none"
        onClick={toggle}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            {title}
            {count !== undefined && count > 0 && (
              <span className="text-muted-foreground text-xs font-normal">({count})</span>
            )}
          </CardTitle>
          <ChevronDown
            className={cn(
              'text-muted-foreground h-4 w-4 transition-transform duration-200',
              !isOpen && '-rotate-90'
            )}
          />
        </div>
      </CardHeader>

      <div
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <CardContent className="pt-0">{children}</CardContent>
        </div>
      </div>
    </Card>
  )
}
