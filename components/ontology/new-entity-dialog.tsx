'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Kbd } from '@/components/ui/kbd'
import { Plus } from 'lucide-react'
import { useOntology } from '@/lib/ontology/context'
import { isDuplicateEntityId, isValidIRI } from '@/lib/ontology/validation'
import { useToast } from '@/hooks/use-toast'

interface ValidationErrors {
  id?: string
  name?: string
}

interface IdValidationOptions {
  checkDuplicate?: boolean
}

export function NewEntityDialog({
  defaultEntityType = 'class',
  parentClassId,
  open,
  onOpenChange,
}: {
  defaultEntityType?: 'class' | 'property'
  parentClassId?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { ontology, addClass, addProperty } = useOntology()
  const { toast } = useToast()
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = open !== undefined
  const dialogOpen = isControlled ? open : internalOpen
  const setDialogOpen = isControlled ? onOpenChange! : setInternalOpen
  const [entityType, setEntityType] = useState<'class' | 'property'>('class')
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [label, setLabel] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [propertyType, setPropertyType] = useState<'ObjectProperty' | 'DataProperty'>(
    'ObjectProperty'
  )

  useEffect(() => {
    setEntityType(defaultEntityType)
  }, [defaultEntityType])

  useEffect(() => {
    if (parentClassId) {
      setEntityType('class')
    }
  }, [parentClassId])

  const validateId = (rawId: string, options?: IdValidationOptions): string | undefined => {
    const checkDuplicate = options?.checkDuplicate ?? true
    const normalizedId = rawId.trim()
    if (!normalizedId) {
      return 'ID is required'
    }
    if (!isValidIRI(normalizedId)) {
      return 'Invalid IRI format. Use a full IRI or a simple identifier.'
    }
    if (checkDuplicate && ontology && isDuplicateEntityId(normalizedId, ontology)) {
      return 'Entity already exists'
    }
    return undefined
  }

  const validateName = (rawName: string): string | undefined => {
    if (!rawName.trim()) {
      return 'Name is required'
    }
    return undefined
  }

  const handleCreate = () => {
    const normalizedId = id.trim()
    const normalizedName = name.trim()

    const nextErrors: ValidationErrors = {
      id: validateId(normalizedId, { checkDuplicate: false }),
      name: validateName(normalizedName),
    }

    setErrors(nextErrors)

    // Validate required fields
    if (nextErrors.id || nextErrors.name) {
      toast({
        title: 'Validation error',
        description: nextErrors.id ?? nextErrors.name ?? 'Please fix validation errors',
        variant: 'destructive',
      })
      return
    }

    // Check for duplicates
    if (!ontology) {
      toast({
        title: 'Error',
        description: 'Ontology not loaded',
        variant: 'destructive',
      })
      return
    }

    if (isDuplicateEntityId(normalizedId, ontology)) {
      setErrors(prev => ({ ...prev, id: 'Entity already exists' }))
      toast({
        title: 'Duplicate ID',
        description: `An entity with ID "${normalizedId}" already exists in the ontology`,
        variant: 'destructive',
      })
      return
    }

    if (entityType === 'class') {
      addClass({
        id: normalizedId,
        name: normalizedName,
        label,
        description,
        superClasses: parentClassId ? [parentClassId] : ['owl:Thing'],
        annotations: [],
        properties: [],
        disjointWith: [],
        equivalentTo: [],
      })
      toast({
        title: 'Class created',
        description: `Created class: ${normalizedName}`,
      })
    } else {
      addProperty({
        id: normalizedId,
        name: normalizedName,
        label,
        description,
        type: propertyType,
        domain: [],
        range: [],
        superProperties: [],
        characteristics: [],
        annotations: [],
      })
      toast({
        title: 'Property created',
        description: `Created property: ${normalizedName}`,
      })
    }

    // Reset form
    setId('')
    setName('')
    setLabel('')
    setDescription('')
    setErrors({})
    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Entity
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Add <Kbd>(Example + N)</Kbd> new class or property to your ontology
          </p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Entity</DialogTitle>
          <DialogDescription>Add a new class or property to your ontology</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Entity Type</Label>
            <Select
              value={entityType}
              onValueChange={v => setEntityType(v as 'class' | 'property')}
              disabled={!!parentClassId}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="class">Class</SelectItem>
                <SelectItem value="property">Property</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="entity-id">
              ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="entity-id"
              placeholder="e.g., Person, hasName"
              value={id}
              onChange={e => {
                const nextId = e.target.value
                setId(nextId)
                if (errors.id) {
                  setErrors(prev => ({ ...prev, id: validateId(nextId) }))
                }
              }}
              onBlur={() => {
                setErrors(prev => ({ ...prev, id: validateId(id) }))
              }}
              aria-invalid={!!errors.id}
              className="font-mono text-xs"
            />
            {errors.id && <p className="text-destructive text-sm">{errors.id}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="entity-name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="entity-name"
              placeholder="e.g., Person, hasName"
              value={name}
              onChange={e => {
                const nextName = e.target.value
                setName(nextName)
                if (errors.name) {
                  setErrors(prev => ({ ...prev, name: validateName(nextName) }))
                }
              }}
              onBlur={() => {
                setErrors(prev => ({ ...prev, name: validateName(name) }))
              }}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="entity-label">Label</Label>
            <Input
              id="entity-label"
              placeholder="Human-readable label"
              value={label}
              onChange={e => setLabel(e.target.value)}
            />
          </div>

          {entityType === 'property' && (
            <div className="space-y-2">
              <Label>Property Type</Label>
              <Select
                value={propertyType}
                onValueChange={v => setPropertyType(v as 'ObjectProperty' | 'DataProperty')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ObjectProperty">Object Property</SelectItem>
                  <SelectItem value="DataProperty">Data Property</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="entity-description">Description</Label>
            <Textarea
              id="entity-description"
              placeholder="Optional description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={handleCreate} className="w-full">
            Create {entityType === 'class' ? 'Class' : 'Property'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
