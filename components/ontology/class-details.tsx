'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useOntology } from '@/lib/ontology/context'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/components/ui/item'
import { Copy, ChevronRight, Home, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface ClassElementItemProps {
  id: string
  label: string
  description?: string
  isSelected?: boolean
  variant?: 'class' | 'restriction' | 'axiom'
  onClick?: () => void
  onDoubleClick?: () => void
}

const ClassElementItem: React.FC<ClassElementItemProps> = React.memo(
  ({ id, label, description, isSelected, variant = 'class', onClick, onDoubleClick }) => {
    const indicatorColor = useMemo(() => {
      switch (variant) {
        case 'restriction':
          return 'bg-amber-500'
        case 'axiom':
          return 'bg-purple-500'
        default:
          return 'bg-amber-400'
      }
    }, [variant])

    return (
      <Item
        variant="ghost"
        size="xs"
        selected={isSelected}
        className={cn(
          'cursor-pointer rounded-sm',
          isSelected
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-muted/80'
        )}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        role="option"
        aria-selected={isSelected}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick?.()
          }
        }}
      >
        <ItemMedia variant="indicator" className={indicatorColor} />
        <ItemContent>
          <ItemTitle
            className={cn(
              'font-mono text-sm',
              isSelected && 'text-primary-foreground'
            )}
          >
            {label}
          </ItemTitle>
          {description && (
            <ItemDescription
              className={cn(isSelected && 'text-primary-foreground/80')}
            >
              {description}
            </ItemDescription>
          )}
        </ItemContent>
      </Item>
    )
  }
)
ClassElementItem.displayName = 'ClassElementItem'

interface SectionHeaderProps {
  title: string
  onAdd?: () => void
  count?: number
}

const SectionHeader: React.FC<SectionHeaderProps> = React.memo(
  ({ title, onAdd, count }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-muted-foreground text-sm font-medium">
        {title}
        {count !== undefined && count > 0 && (
          <span className="ml-1 text-xs">({count})</span>
        )}
      </span>
      {onAdd && (
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground h-6 w-6"
          onClick={onAdd}
          aria-label={`Add ${title}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
)
SectionHeader.displayName = 'SectionHeader'

export function ClassDetails() {
  const { selectedClass, ontology, selectClass } = useOntology()
  const { toast } = useToast()
  const [selectedElement, setSelectedElement] = useState<string | null>(null)

  const handleElementClick = useCallback((elementId: string) => {
    setSelectedElement((prev) => (prev === elementId ? null : elementId))
  }, [])

  const handleElementDoubleClick = useCallback(
    (classId: string) => {
      if (ontology?.classes.has(classId)) {
        selectClass(classId)
      }
    },
    [ontology, selectClass]
  )

  const breadcrumbs = useMemo(() => {
    if (!selectedClass || !ontology) {
      return []
    }

    const path: { id: string; label: string }[] = []
    let currentId = selectedClass.id
    const visited = new Set<string>()

    while (currentId && currentId !== 'owl:Thing' && !visited.has(currentId)) {
      visited.add(currentId)
      const cls = ontology.classes.get(currentId)
      if (cls) {
        path.unshift({ id: cls.id, label: cls.label || cls.name })
        currentId = cls.superClasses[0]
      } else {
        break
      }
    }

    path.unshift({ id: 'owl:Thing', label: 'owl:Thing' })
    return path
  }, [selectedClass, ontology])

  const subclasses = useMemo(
    () =>
      Array.from(ontology?.classes.values() || []).filter((ontologyClass) =>
        ontologyClass.superClasses.includes(selectedClass?.id || '')
      ),
    [ontology, selectedClass?.id]
  )

  const instances = useMemo(
    () =>
      Array.from(ontology?.individuals.values() || []).filter((individual) =>
        individual.types.includes(selectedClass?.id || '')
      ),
    [ontology, selectedClass?.id]
  )

  if (!selectedClass) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        Select a class to view details
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        {/* Breadcrumbs */}
        <div className="text-muted-foreground bg-muted/30 border-border/50 flex flex-wrap items-center gap-1 rounded-md border p-2 text-xs">
          <Home className="mr-1 h-3 w-3" />
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.id} className="flex items-center">
              {index > 0 && <ChevronRight className="mx-0.5 h-3 w-3" />}
              <button
                onClick={() => crumb.id !== 'owl:Thing' && selectClass(crumb.id)}
                className={cn(
                  'hover:text-primary decoration-primary/30 underline-offset-2 transition-colors hover:underline',
                  crumb.id === selectedClass.id && 'text-foreground font-semibold',
                  crumb.id === 'owl:Thing' && 'cursor-default hover:no-underline'
                )}
              >
                {crumb.label}
              </button>
            </div>
          ))}
        </div>

        {/* Class Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Class Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="class-id" className="text-xs">
                ID
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="class-id"
                  value={selectedClass.id}
                  readOnly
                  className="flex-1 font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedClass.id)
                    toast({
                      title: 'Copied to clipboard',
                      description: 'The entity IRI has been copied.',
                    })
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-name" className="text-xs">
                Name
              </Label>
              <Input id="class-name" value={selectedClass.name} readOnly className="text-xs" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-label" className="text-xs">
                Label
              </Label>
              <Input
                id="class-label"
                value={selectedClass.label || ''}
                readOnly
                className="text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-description" className="text-xs">
                Description
              </Label>
              <Textarea
                id="class-description"
                value={selectedClass.description || ''}
                readOnly
                rows={3}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Class Axioms - Protégé Style */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Class Axioms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {/* Equivalent To */}
            <SectionHeader title="Equivalent To" onAdd={() => {}} />
            <ItemGroup role="listbox" aria-label="Equivalent classes">
              {selectedClass.equivalentTo.length > 0 ? (
                selectedClass.equivalentTo.map((equiv) => (
                  <ClassElementItem
                    key={`equiv-${equiv}`}
                    id={`equiv-${equiv}`}
                    label={equiv}
                    variant="restriction"
                    isSelected={selectedElement === `equiv-${equiv}`}
                    onClick={() => handleElementClick(`equiv-${equiv}`)}
                    onDoubleClick={() => handleElementDoubleClick(equiv)}
                  />
                ))
              ) : (
                <span className="text-muted-foreground py-1 text-xs italic">
                  No equivalent classes
                </span>
              )}
            </ItemGroup>

            {/* SubClass Of */}
            <SectionHeader
              title="SubClass Of"
              count={selectedClass.superClasses.length}
              onAdd={() => {}}
            />
            <ItemGroup role="listbox" aria-label="Superclasses">
              {selectedClass.superClasses.length > 0 ? (
                selectedClass.superClasses.map((superClass) => {
                  const isRestriction =
                    superClass.includes(' some ') || superClass.includes(' only ')
                  return (
                    <ClassElementItem
                      key={`super-${superClass}`}
                      id={`super-${superClass}`}
                      label={superClass}
                      variant={isRestriction ? 'restriction' : 'class'}
                      isSelected={selectedElement === `super-${superClass}`}
                      onClick={() => handleElementClick(`super-${superClass}`)}
                      onDoubleClick={() => handleElementDoubleClick(superClass)}
                    />
                  )
                })
              ) : (
                <span className="text-muted-foreground py-1 text-xs italic">
                  No superclasses
                </span>
              )}
            </ItemGroup>

            {/* General class axioms */}
            <SectionHeader title="General class axioms" onAdd={() => {}} />
            <span className="text-muted-foreground py-1 text-xs italic">
              No general class axioms
            </span>

            {/* SubClass Of (Anonymous Ancestor) */}
            <SectionHeader title="SubClass Of (Anonymous Ancestor)" />
            <span className="text-muted-foreground py-1 text-xs italic">
              No anonymous ancestors
            </span>
          </CardContent>
        </Card>

        {/* Instances */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Instances</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <SectionHeader title="Instances" count={instances.length} onAdd={() => {}} />
            <ItemGroup role="listbox" aria-label="Class instances">
              {instances.length > 0 ? (
                instances.map((instance) => (
                  <ClassElementItem
                    key={`inst-${instance.id}`}
                    id={`inst-${instance.id}`}
                    label={instance.label || instance.name}
                    variant="class"
                    isSelected={selectedElement === `inst-${instance.id}`}
                    onClick={() => handleElementClick(`inst-${instance.id}`)}
                  />
                ))
              ) : (
                <span className="text-muted-foreground py-1 text-xs italic">
                  No instances
                </span>
              )}
            </ItemGroup>
          </CardContent>
        </Card>

        {/* Target for Key */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Target for Key</CardTitle>
          </CardHeader>
          <CardContent>
            <SectionHeader title="Target for Key" onAdd={() => {}} />
            <span className="text-muted-foreground py-1 text-xs italic">
              No keys defined
            </span>
          </CardContent>
        </Card>

        {/* Disjoint With */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Relationships</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <SectionHeader
              title="Disjoint With"
              count={selectedClass.disjointWith.length}
              onAdd={() => {}}
            />
            <ItemGroup role="listbox" aria-label="Disjoint classes">
              {selectedClass.disjointWith.length > 0 ? (
                selectedClass.disjointWith.map((disjoint) => (
                  <ClassElementItem
                    key={`disj-${disjoint}`}
                    id={`disj-${disjoint}`}
                    label={disjoint}
                    variant="class"
                    isSelected={selectedElement === `disj-${disjoint}`}
                    onClick={() => handleElementClick(`disj-${disjoint}`)}
                    onDoubleClick={() => handleElementDoubleClick(disjoint)}
                  />
                ))
              ) : (
                <span className="text-muted-foreground py-1 text-xs italic">
                  No disjoint classes
                </span>
              )}
            </ItemGroup>

            {/* Properties */}
            <SectionHeader
              title="Properties"
              count={selectedClass.properties.length}
              onAdd={() => {}}
            />
            <ItemGroup role="listbox" aria-label="Class properties">
              {selectedClass.properties.length > 0 ? (
                selectedClass.properties.map((prop) => (
                  <ClassElementItem
                    key={`prop-${prop}`}
                    id={`prop-${prop}`}
                    label={prop}
                    variant="axiom"
                    isSelected={selectedElement === `prop-${prop}`}
                    onClick={() => handleElementClick(`prop-${prop}`)}
                  />
                ))
              ) : (
                <span className="text-muted-foreground py-1 text-xs italic">
                  No properties
                </span>
              )}
            </ItemGroup>
          </CardContent>
        </Card>

        {/* Annotations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Annotations</CardTitle>
          </CardHeader>
          <CardContent>
            <SectionHeader
              title="Annotations"
              count={selectedClass.annotations.length}
              onAdd={() => {}}
            />
            <ItemGroup>
              {selectedClass.annotations.length > 0 ? (
                selectedClass.annotations.map((annotation, index) => (
                  <Item
                    key={index}
                    variant="ghost"
                    size="xs"
                    className={cn(
                      'cursor-pointer rounded-sm',
                      selectedElement === `ann-${index}`
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted/80'
                    )}
                    onClick={() => handleElementClick(`ann-${index}`)}
                  >
                    <ItemMedia variant="indicator" className="bg-blue-500" />
                    <ItemContent>
                      <ItemTitle
                        className={cn(
                          'font-mono text-sm',
                          selectedElement === `ann-${index}` && 'text-primary-foreground'
                        )}
                      >
                        {annotation.property}
                      </ItemTitle>
                      <ItemDescription
                        className={cn(
                          selectedElement === `ann-${index}` && 'text-primary-foreground/80'
                        )}
                      >
                        {annotation.value}
                        {annotation.language && ` @${annotation.language}`}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                ))
              ) : (
                <span className="text-muted-foreground py-1 text-xs italic">
                  No annotations
                </span>
              )}
            </ItemGroup>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
