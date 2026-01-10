'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, X, ChevronRight, Trash2 } from 'lucide-react'
import { useOntology } from '@/lib/ontology/context'
import { useToast } from '@/hooks/use-toast'
import type { OntologyProperty } from '@/lib/ontology/types'
import { MIN_PROPERTY_CHAIN_LENGTH } from '@/lib/constants'

interface PropertyChainEditorProps {
  property: OntologyProperty
}

export function PropertyChainEditor({ property }: PropertyChainEditorProps) {
  const { ontology, updateProperty } = useOntology()
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [newChain, setNewChain] = useState<string[]>([])

  const objectProperties = ontology
    ? Array.from(ontology.properties.values()).filter(p => p.type === 'ObjectProperty')
    : []

  const chains = property.propertyChains ?? []

  const addPropertyToChain = (propertyId: string) => {
    if (propertyId && !newChain.includes(propertyId)) {
      setNewChain([...newChain, propertyId])
    }
  }

  const removePropertyFromChain = (index: number) => {
    setNewChain(newChain.filter((_, i) => i !== index))
  }

  const saveChain = () => {
    if (newChain.length < MIN_PROPERTY_CHAIN_LENGTH) {
      toast({
        title: 'Invalid chain',
        description: 'A property chain must have at least 2 properties.',
        variant: 'destructive',
      })
      return
    }

    const updatedChains = [...chains, newChain]
    updateProperty(property.id, { propertyChains: updatedChains })
    setNewChain([])
    setIsAdding(false)
    toast({
      title: 'Chain added',
      description: 'Property chain has been added successfully.',
    })
  }

  const removeChain = (index: number) => {
    const updatedChains = chains.filter((_, i) => i !== index)
    updateProperty(property.id, { propertyChains: updatedChains })
    toast({
      title: 'Chain removed',
      description: 'Property chain has been removed.',
    })
  }

  const cancelAdding = () => {
    setNewChain([])
    setIsAdding(false)
  }

  const getPropertyLabel = (propertyId: string): string => {
    const prop = ontology?.properties.get(propertyId)
    return prop?.label || prop?.name || propertyId
  }

  const formatChainExpression = (chain: string[]): string => {
    return chain.map(getPropertyLabel).join(' o ')
  }

  return (
    <div className="space-y-3">
      {chains.length > 0 ? (
        <div className="space-y-2">
          {chains.map((chain, index) => (
            <div
              key={index}
              className="bg-muted/50 flex items-center justify-between rounded-md p-2"
            >
              <div className="flex flex-wrap items-center gap-1">
                {chain.map((propId, propIndex) => (
                  <span key={propId} className="flex items-center">
                    <Badge variant="secondary" className="font-mono text-xs">
                      {getPropertyLabel(propId)}
                    </Badge>
                    {propIndex < chain.length - 1 && (
                      <span className="text-muted-foreground mx-1 text-xs">o</span>
                    )}
                  </span>
                ))}
                <ChevronRight className="text-muted-foreground mx-1 h-3 w-3" />
                <Badge variant="outline" className="font-mono text-xs">
                  {property.label || property.name}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => removeChain(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        !isAdding && (
          <span className="text-muted-foreground text-xs">No property chains defined</span>
        )
      )}

      {isAdding ? (
        <div className="border-border space-y-3 rounded-md border p-3">
          <div className="text-xs font-medium">New Property Chain</div>

          {newChain.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              {newChain.map((propId, index) => (
                <span key={propId} className="flex items-center">
                  <Badge variant="secondary" className="flex items-center gap-1 font-mono text-xs">
                    {getPropertyLabel(propId)}
                    <button
                      onClick={() => removePropertyFromChain(index)}
                      className="hover:text-destructive ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                  {index < newChain.length - 1 && (
                    <span className="text-muted-foreground mx-1 text-xs">o</span>
                  )}
                </span>
              ))}
              <ChevronRight className="text-muted-foreground mx-1 h-3 w-3" />
              <Badge variant="outline" className="font-mono text-xs">
                {property.label || property.name}
              </Badge>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Select onValueChange={addPropertyToChain}>
              <SelectTrigger className="flex-1 text-xs">
                <SelectValue placeholder="Add property to chain..." />
              </SelectTrigger>
              <SelectContent>
                {objectProperties.map(prop => (
                  <SelectItem key={prop.id} value={prop.id} className="text-xs">
                    {prop.label || prop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {newChain.length > 0 && (
            <div className="text-muted-foreground text-xs">
              Preview: {formatChainExpression(newChain)} → {property.label || property.name}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={saveChain}
              disabled={newChain.length < MIN_PROPERTY_CHAIN_LENGTH}
            >
              Save Chain
            </Button>
            <Button size="sm" variant="outline" onClick={cancelAdding}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" size="sm" className="w-full" onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-3 w-3" />
          Add Property Chain
        </Button>
      )}
    </div>
  )
}
