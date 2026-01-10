'use client'

import React, { useState, useCallback } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useOntology } from '@/lib/ontology/context'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PropertyItemProps } from '@/lib/ontology/types'

const PropertyItem = React.memo(function PropertyItem({
  property,
  isSelected,
  onSelect,
}: PropertyItemProps) {
  return (
    <div
      onClick={() => {
        onSelect(property.id)
      }}
      className={cn(
        'hover:bg-accent group flex cursor-pointer items-center justify-between rounded p-2 text-sm',
        isSelected && 'bg-primary/20 text-primary'
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="truncate font-mono text-xs">{property.label || property.name}</div>
        <div className="text-muted-foreground truncate text-xs">{property.id}</div>
      </div>
      <Badge variant="outline" className="ml-2 text-xs">
        {property.type === 'ObjectProperty'
          ? 'Obj'
          : property.type === 'DataProperty'
            ? 'Data'
            : 'Ann'}
      </Badge>
    </div>
  )
})

PropertyItem.displayName = 'PropertyItem'

export function PropertyList() {
  const { ontology, selectedProperty, selectProperty, selectClass, selectIndividual } =
    useOntology()
  const [searchQuery, setSearchQuery] = useState('')

  const properties = Array.from(ontology?.properties.values() || [])

  const objectProperties = properties.filter(p => p.type === 'ObjectProperty')
  const dataProperties = properties.filter(p => p.type === 'DataProperty')
  const annotationProperties = properties.filter(p => p.type === 'AnnotationProperty')

  const handleSelectProperty = useCallback(
    (id: string) => {
      selectClass(null)
      selectIndividual(null)
      selectProperty(id)
    },
    [selectClass, selectIndividual, selectProperty]
  )

  const filterProperties = (props: typeof properties) => {
    if (!searchQuery) {
      return props
    }
    return props.filter(
      p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.label?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex items-center justify-between border-b px-3 py-2">
        <h3 className="text-sm font-semibold">Properties</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="border-border border-b px-3 py-2">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2 h-3 w-3 -translate-y-1/2" />
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-8 pl-7 text-xs"
          />
        </div>
      </div>

      <Tabs defaultValue="object" className="flex flex-1 flex-col">
        <TabsList className="mx-3 mt-2">
          <TabsTrigger value="object" className="text-xs">
            Object ({objectProperties.length})
          </TabsTrigger>
          <TabsTrigger value="data" className="text-xs">
            Data ({dataProperties.length})
          </TabsTrigger>
          <TabsTrigger value="annotation" className="text-xs">
            Annotation ({annotationProperties.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="object" className="mt-2 flex-1 overflow-y-auto px-2">
          {filterProperties(objectProperties).map(property => (
            <PropertyItem
              key={property.id}
              property={property}
              isSelected={selectedProperty?.id === property.id}
              onSelect={handleSelectProperty}
            />
          ))}
        </TabsContent>

        <TabsContent value="data" className="mt-2 flex-1 overflow-y-auto px-2">
          {filterProperties(dataProperties).map(property => (
            <PropertyItem
              key={property.id}
              property={property}
              isSelected={selectedProperty?.id === property.id}
              onSelect={handleSelectProperty}
            />
          ))}
        </TabsContent>

        <TabsContent value="annotation" className="mt-2 flex-1 overflow-y-auto px-2">
          {filterProperties(annotationProperties).map(property => (
            <PropertyItem
              key={property.id}
              property={property}
              isSelected={selectedProperty?.id === property.id}
              onSelect={handleSelectProperty}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
