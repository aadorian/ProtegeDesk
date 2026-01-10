'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { useOntology } from '@/lib/ontology/context'
import { OntologySearch, getEntityType, getDisplayName } from '@/lib/ontology/search'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function GlobalSearch() {
  const { ontology, selectClass, selectProperty, selectIndividual } = useOntology()
  const [searchQuery, setSearchQuery] = useState('')
  const [manuallyOpen, setManuallyOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Create search instance with cache
  const search = useMemo(() => {
    if (!ontology) {
      return null
    }
    return new OntologySearch(ontology)
  }, [ontology])

  // Get search results
  const results = useMemo(() => {
    if (!search || !searchQuery.trim()) {
      return []
    }

    return search.search(searchQuery, {
      maxResults: 20,
      fuzzyMatch: true, // Enable typo tolerance
    })
  }, [searchQuery, search])

  // Derive isOpen from results and search query
  const isOpen = (manuallyOpen || results.length > 0) && searchQuery.trim().length > 0

  // Clamp selectedIndex to valid range
  const validSelectedIndex = Math.min(selectedIndex, Math.max(0, results.length - 1))

  // Handle entity selection
  const handleSelect = (index: number) => {
    const result = results[index]
    if (!result) {
      return
    }

    const type = getEntityType(result.entity)

    // Clear other selections based on entity type to ensure only one entity is selected
    // This ensures the DetailsPanel shows the correct entity
    if (type === 'class') {
      selectProperty(null)
      selectIndividual(null)
      selectClass(result.entity.id)
    } else if (type === 'property') {
      selectClass(null)
      selectIndividual(null)
      selectProperty(result.entity.id)
    } else {
      selectClass(null)
      selectProperty(null)
      selectIndividual(result.entity.id)
    }

    // Clear search and close dropdown
    setSearchQuery('')
    setManuallyOpen(false)
    setSelectedIndex(0)
    inputRef.current?.blur()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'ArrowDown' && searchQuery) {
        setManuallyOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % results.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
        break
      case 'Enter':
        e.preventDefault()
        handleSelect(selectedIndex)
        break
      case 'Escape':
        e.preventDefault()
        setManuallyOpen(false)
        setSearchQuery('')
        inputRef.current?.blur()
        break
    }
  }

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && isOpen && results.length > 0) {
      const selectedElement = resultsRef.current.children[validSelectedIndex] as HTMLElement
      selectedElement?.scrollIntoView({ block: 'nearest' })
    }
  }, [validSelectedIndex, isOpen, results.length])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-global-search]')) {
        setManuallyOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!ontology) {
    return null
  }

  return (
    <div className="relative w-full max-w-md" data-global-search>
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search classes, properties, individuals..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0 && searchQuery.trim().length > 0) {
              setManuallyOpen(true)
            }
          }}
          className="pr-9 pl-9"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('')
              setManuallyOpen(false)
              inputRef.current?.focus()
            }}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div
          ref={resultsRef}
          className="bg-popover border-border absolute top-full z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-md border shadow-lg"
        >
          {results.map((result, idx) => {
            const type = getEntityType(result.entity)
            const isSelected = idx === validSelectedIndex

            return (
              <button
                key={`${type}-${result.entity.id}-${idx}`}
                onClick={() => handleSelect(idx)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isSelected && 'bg-accent text-accent-foreground'
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{getDisplayName(result.entity)}</div>
                  <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-sm">
                    <span className="text-xs">
                      {result.entity.id !== result.entity.name && (
                        <span className="font-mono">{result.entity.id}</span>
                      )}
                    </span>
                    {result.matchedFields.length > 0 && (
                      <span className="text-xs opacity-60">
                        · {result.matchedFields.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-3 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs font-normal',
                      type === 'class' && 'border-blue-500/20 bg-blue-500/10 text-blue-600',
                      type === 'property' && 'border-green-500/20 bg-green-500/10 text-green-600',
                      type === 'individual' &&
                        'border-purple-500/20 bg-purple-500/10 text-purple-600'
                    )}
                  >
                    {type}
                  </Badge>
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {Math.round(result.score)}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {searchQuery && !isOpen && results.length === 0 && (
        <div className="bg-popover border-border absolute top-full z-50 mt-2 w-full rounded-md border p-4 shadow-lg">
          <p className="text-muted-foreground text-center text-sm">
            No results found for &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  )
}
