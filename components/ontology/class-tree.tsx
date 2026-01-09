'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, ChevronUp, ChevronDown, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOntology } from '@/lib/ontology/context'
import { cn } from '@/lib/utils'
import type { OntologyClass } from '@/lib/ontology/types'
import debug from 'debug'

const logger = debug('app:class-tree')

// Tree indentation constants
const TREE_INDENT_PX = 16
const TREE_ICON_SPACING_PX = 8

type ClassTreeNodeProps = {
  classId: string
  owlClass: OntologyClass
  level: number
  // Nuevas props:
  expandedIds: Set<string>
  onToggle: (id: string) => void
}

function ClassTreeNode({ classId, owlClass, level, expandedIds, onToggle }: ClassTreeNodeProps) {
  const { ontology, selectedClass, selectClass, selectProperty, selectIndividual } = useOntology()
  const isExpanded = expandedIds.has(classId)

  // Find subclasses
  const subclasses = Array.from(ontology?.classes.values() || []).filter(ontologyClass =>
    ontologyClass.superClasses.includes(classId)
  )

  logger('Rendering class node', {
    classId,
    label: owlClass.label || owlClass.name,
    level,
    hasChildren: subclasses.length > 0,
    isExpanded,
  })

  const hasChildren = subclasses.length > 0
  const isSelected = selectedClass?.id === classId

  return (
    <div>
      <div
        className={cn(
          'group hover:bg-accent flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-sm',
          isSelected && 'bg-primary/20 text-primary'
        )}
        style={{ paddingLeft: `${level * TREE_INDENT_PX + TREE_ICON_SPACING_PX}px` }}
        onClick={() => {
          logger('Class selected', {
            classId,
            className: owlClass.label || owlClass.name,
          })
          // Clear other selections to ensure only the class is selected
          selectProperty(null)
          selectIndividual(null)
          selectClass(classId)
        }}
      >
        {hasChildren ? (
          <button
            onClick={e => {
              e.stopPropagation()
              // AHORA: Llamamos a la función del padre en lugar de set local
              onToggle(classId)
            }}
            className="flex h-4 w-4 items-center justify-center"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <span className="flex-1 font-mono text-xs">{owlClass.label || owlClass.name}</span>
        <div className="hidden items-center gap-1 group-hover:flex">
          <Button variant="ghost" size="icon" className="h-5 w-5">
            <Plus className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-5 w-5">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {subclasses.map(subclass => (
            <ClassTreeNode
              key={subclass.id}
              classId={subclass.id}
              owlClass={subclass}
              level={level + 1}
              expandedIds={expandedIds}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function ClassTree() {
  const { ontology } = useOntology()

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true)

      const saved = sessionStorage.getItem('ontology-tree-expanded')
      if (saved) {
        try {
          setExpandedIds(new Set(JSON.parse(saved)))
        } catch (e) {
          console.error('Failed to parse expanded state', e)
        }
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isMounted) {
      sessionStorage.setItem('ontology-tree-expanded', JSON.stringify(Array.from(expandedIds)))
    }
  }, [expandedIds, isMounted])

  //Handlers
  const handleToggle = (id: string) => {
    const newSet = new Set(expandedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setExpandedIds(newSet)
  }

  const handleExpandAll = () => {
    if (!ontology) {
      return
    }
    const allIds = Array.from(ontology.classes.keys())
    setExpandedIds(new Set(allIds))
  }

  const handleCollapseAll = () => {
    setExpandedIds(new Set())
  }

  const hasExpandedNodes = expandedIds.size > 0

  // Find root classes (those with no superclasses or only owl:Thing)
  const rootClasses = Array.from(ontology?.classes.values() || []).filter(
    ontologyClass =>
      ontologyClass.superClasses.length === 0 ||
      (ontologyClass.superClasses.length === 1 && ontologyClass.superClasses[0] === 'owl:Thing')
  )

  logger('Rendering with class tree', {
    totalClasses: ontology?.classes.size || 0,
    rootClassCount: rootClasses.length,
    rootClasses: rootClasses.map(rootClass => rootClass.label || rootClass.name),
  })

  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex items-center justify-between border-b px-3 py-2">
        <h3 className="text-sm font-semibold">Classes</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`text-muted-foreground hover:text-foreground h-6 w-auto gap-1 px-2 text-[10px]`}
            onClick={hasExpandedNodes ? handleCollapseAll : handleExpandAll}
            title={hasExpandedNodes ? 'Collapse All' : 'Expand All'}
          >
            {hasExpandedNodes ? (
              <>
                <ChevronUp className="h-3 w-3" />
                <span>Collapse</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" />
                <span>Expand</span>
              </>
            )}
          </Button>

          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {rootClasses.map(rootClass => (
          <ClassTreeNode
            key={rootClass.id}
            classId={rootClass.id}
            owlClass={rootClass}
            level={0}
            expandedIds={expandedIds}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  )
}
