'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Plus, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useOntology } from '@/lib/ontology/context'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IndividualItemProps } from '@/lib/ontology/types'

const IndividualItem = React.memo(function IndividualItem({
  individual,
  isSelected,
  onSelect,
}: IndividualItemProps) {
  return (
    <div
      onClick={() => onSelect(individual.id)}
      className={cn(
        'hover:bg-accent group flex cursor-pointer items-center gap-2 rounded p-2 text-sm',
        isSelected && 'bg-primary/20 text-primary'
      )}
    >
      <User className="h-4 w-4 flex-shrink-0" />

      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{individual.label || individual.name}</div>

        {individual.types.length > 0 && (
          <div className="text-muted-foreground flex flex-wrap gap-1 text-xs">
            {individual.types.slice(0, 2).map((type, idx) => (
              <span key={idx} className="truncate">
                {type}
                {idx < Math.min(individual.types.length, 2) - 1 && ','}
              </span>
            ))}
            {individual.types.length > 2 && (
              <span className="text-muted-foreground">+{individual.types.length - 2}</span>
            )}
          </div>
        )}
      </div>

      {individual.propertyAssertions.length > 0 && (
        <Badge variant="secondary" className="ml-auto text-xs">
          {individual.propertyAssertions.length}
        </Badge>
      )}
    </div>
  )
})

IndividualItem.displayName = 'IndividualItem'

export function IndividualList() {
  const { ontology, selectedIndividual, selectIndividual, selectClass, selectProperty } =
    useOntology()
  const [searchQuery, setSearchQuery] = useState('')

  const individuals = Array.from(ontology?.individuals.values() || [])

  const handleSelectIndividual = useCallback(
    (id: string) => {
      selectClass(null)
      selectProperty(null)
      selectIndividual(id)
    },
    [selectClass, selectProperty, selectIndividual]
  )

// Debug logging when individuals change
useEffect(() => {
  // console.log removed for production cleanup (issue #120)
}, [individuals])

  const filteredIndividuals = useMemo(() => {
    if (!searchQuery) {
      return individuals
    }
    return individuals.filter(
      ind =>
        ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.types.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [individuals, searchQuery])

  // Group individuals by their primary type (first type)
  const groupedIndividuals = filteredIndividuals.reduce(
    (acc, ind) => {
      const primaryType = ind.types[0] || 'Untyped'
      if (!acc[primaryType]) {
        acc[primaryType] = []
      }
      acc[primaryType].push(ind)
      return acc
    },
    {} as Record<string, typeof individuals>
  )

  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex items-center justify-between border-b px-3 py-2">
        <h3 className="text-sm font-semibold">Individuals ({individuals.length})</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="border-border border-b px-3 py-2">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2 h-3 w-3 -translate-y-1/2" />
          <Input
            placeholder="Search individuals..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-8 pl-7 text-xs"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-4 py-2">
          {Object.keys(groupedIndividuals).length === 0 ? (
            <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
              No individuals found
            </div>
          ) : (
            Object.entries(groupedIndividuals).map(([type, inds]) => (
              <div key={type}>
                <div className="text-muted-foreground mb-2 px-2 text-xs font-semibold">
                  {type} ({inds.length})
                </div>
                <div className="space-y-1">
                  {inds.map(individual => (
                    <IndividualItem
                      key={individual.id}
                      individual={individual}
                      isSelected={selectedIndividual?.id === individual.id}
                      onSelect={handleSelectIndividual}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
