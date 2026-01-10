'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useOntology } from '@/lib/ontology/context'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useCopyToClipboard } from '@/hooks/copy-to-clipboard'
import { OntologyProperty } from '@/lib/ontology/types'

interface PropertyDetailsProps {
  isModalView?: boolean
  property?: OntologyProperty
}

export function PropertyDetails({ isModalView, property }: PropertyDetailsProps) {
  const { selectedProperty, ontology, updateProperty } = useOntology()
  const { toast } = useToast()
  const { copy, copied } = useCopyToClipboard('')

  const availableProperties = ontology
    ? Array.from(ontology.properties.values()).filter(
        (p) => p.type === 'ObjectProperty' && p.id !== selectedProperty?.id
      )
    : []

  const liveProperty = selectedProperty
    ? (ontology?.properties.get(selectedProperty.id) ?? selectedProperty)
    : null

  const characteristics = [
    { id: 'Functional', label: 'Functional' },
    { id: 'InverseFunctional', label: 'Inverse Functional' },
    { id: 'Transitive', label: 'Transitive' },
    { id: 'Symmetric', label: 'Symmetric' },
    { id: 'Asymmetric', label: 'Asymmetric' },
    { id: 'Reflexive', label: 'Reflexive' },
    { id: 'Irreflexive', label: 'Irreflexive' },
  ]

  if (isModalView) {
    return (
      property && (
        <ScrollArea className="h-full p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Property Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <b>Name:</b> {property.name}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={async () => {
                    const success = await copy(property?.id)
                    toast({
                      title: success ? 'Copied' : 'Copy failed',
                      description: success ? 'Property IRI copied.' : undefined,
                      variant: success ? undefined : 'destructive',
                    })
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>

              <div>
                <b>Domain:</b> {property.domain.length > 0 ? property.domain.join(', ') : '-'}
              </div>

              <div>
                <b>Range:</b> {property.range.length > 0 ? property.range.join(', ') : '-'}
              </div>
              <div>
                <b>Characteristics:</b>{' '}
                {characteristics
                  .filter(c => property.characteristics.includes(c.id as any))
                  .map(c => c.label)
                  .join(', ') || '-'}
              </div>
            </CardContent>
          </Card>
        </ScrollArea>
      )
    )
  }

  if (!selectedProperty) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        Select a property to view details
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Property Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="property-id" className="text-xs">
                ID
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="property-id"
                  value={selectedProperty.id}
                  readOnly
                  className="flex-1 font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={async () => {
                    const success = await copy(selectedProperty.id)

                    if (success) {
                      toast({
                        title: 'Copied',
                        description: 'The entity IRI has been copied.',
                      })
                    } else {
                      toast({
                        title: 'Copy failed',
                        variant: 'destructive',
                      })
                    }
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="property-name" className="text-xs">
                Name
              </Label>
              <Input
                id="property-name"
                value={selectedProperty.name}
                readOnly
                className="text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="property-label" className="text-xs">
                Label
              </Label>
              <Input
                id="property-label"
                value={selectedProperty.label || ''}
                readOnly
                className="text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="property-type" className="text-xs">
                Type
              </Label>
              <Select value={selectedProperty.type} disabled>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ObjectProperty" className="text-xs">
                    Object Property
                  </SelectItem>
                  <SelectItem value="DataProperty" className="text-xs">
                    Data Property
                  </SelectItem>
                  <SelectItem value="AnnotationProperty" className="text-xs">
                    Annotation Property
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="property-description" className="text-xs">
                Description
              </Label>
              <Textarea
                id="property-description"
                value={selectedProperty.description || ''}
                readOnly
                rows={3}
                className="text-xs"
              />
            </div>
            {selectedProperty.type === 'ObjectProperty' && liveProperty && (
              <div className="space-y-2">
                <Label htmlFor="inverse-property" className="text-xs">
                  Inverse Of
                </Label>
                <Select
                  value={liveProperty.inverse || 'none'}
                  onValueChange={(value) => {
                    updateProperty(liveProperty.id, {
                      inverse: value === 'none' ? undefined : value,
                    })
                  }}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select inverse property..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-xs">
                      None
                    </SelectItem>
                    {availableProperties.map((prop) => (
                      <SelectItem key={prop.id} value={prop.id} className="text-xs">
                        {prop.label || prop.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Domain and Range</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Domain</Label>
              <div className="flex flex-wrap gap-2">
                {selectedProperty.domain.length > 0 ? (
                  selectedProperty.domain.map(domain => (
                    <Badge key={domain} variant="secondary" className="font-mono text-xs">
                      {domain}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-xs">None</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Range</Label>
              <div className="flex flex-wrap gap-2">
                {selectedProperty.range.length > 0 ? (
                  selectedProperty.range.map(range => (
                    <Badge key={range} variant="secondary" className="font-mono text-xs">
                      {range}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-xs">None</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedProperty.type === 'ObjectProperty' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Characteristics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {characteristics.map(characteristic => (
                  <div key={characteristic.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={characteristic.id}
                      checked={selectedProperty.characteristics.includes(characteristic.id as any)}
                    />
                    <Label
                      htmlFor={characteristic.id}
                      className="cursor-pointer text-xs font-normal"
                    >
                      {characteristic.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hierarchy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Super Properties</Label>
              <div className="flex flex-wrap gap-2">
                {selectedProperty.superProperties.length > 0 ? (
                  selectedProperty.superProperties.map(superProp => (
                    <Badge key={superProp} variant="secondary" className="font-mono text-xs">
                      {superProp}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-xs">None</span>
                )}
              </div>
            </div>
            {liveProperty?.inverse && (
              <div className="space-y-2">
                <Label className="text-xs">Inverse Of</Label>
                <Badge variant="outline" className="font-mono text-xs">
                  {liveProperty.inverse}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Annotations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedProperty.annotations.length > 0 ? (
                selectedProperty.annotations.map((annotation, index) => (
                  <div key={index} className="flex gap-2 text-xs">
                    <span className="text-primary font-mono">{annotation.property}:</span>
                    <span className="text-muted-foreground">{annotation.value}</span>
                  </div>
                ))
              ) : (
                <span className="text-muted-foreground text-xs">No annotations</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
