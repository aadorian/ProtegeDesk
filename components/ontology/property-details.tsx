"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useOntology } from "@/lib/ontology/context"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PropertyDetails() {
  const { selectedProperty } = useOntology()

  if (!selectedProperty) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Select a property to view details
      </div>
    )
  }

  const characteristics = [
    { id: "Functional", label: "Functional" },
    { id: "InverseFunctional", label: "Inverse Functional" },
    { id: "Transitive", label: "Transitive" },
    { id: "Symmetric", label: "Symmetric" },
    { id: "Asymmetric", label: "Asymmetric" },
    { id: "Reflexive", label: "Reflexive" },
    { id: "Irreflexive", label: "Irreflexive" },
  ]

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Property Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="property-id" className="text-xs">
                ID
              </Label>
              <Input id="property-id" value={selectedProperty.id} readOnly className="font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="property-name" className="text-xs">
                Name
              </Label>
              <Input id="property-name" value={selectedProperty.name} readOnly className="text-xs" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="property-label" className="text-xs">
                Label
              </Label>
              <Input id="property-label" value={selectedProperty.label || ""} readOnly className="text-xs" />
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
                value={selectedProperty.description || ""}
                readOnly
                rows={3}
                className="text-xs"
              />
            </div>
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
                  selectedProperty.domain.map((domain) => (
                    <Badge key={domain} variant="secondary" className="text-xs font-mono">
                      {domain}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">None</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Range</Label>
              <div className="flex flex-wrap gap-2">
                {selectedProperty.range.length > 0 ? (
                  selectedProperty.range.map((range) => (
                    <Badge key={range} variant="secondary" className="text-xs font-mono">
                      {range}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">None</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedProperty.type === "ObjectProperty" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Characteristics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {characteristics.map((characteristic) => (
                  <div key={characteristic.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={characteristic.id}
                      checked={selectedProperty.characteristics.includes(characteristic.id as any)}
                    />
                    <Label htmlFor={characteristic.id} className="text-xs font-normal cursor-pointer">
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
                  selectedProperty.superProperties.map((superProp) => (
                    <Badge key={superProp} variant="secondary" className="text-xs font-mono">
                      {superProp}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">None</span>
                )}
              </div>
            </div>
            {selectedProperty.inverse && (
              <div className="space-y-2">
                <Label className="text-xs">Inverse Of</Label>
                <Badge variant="outline" className="text-xs font-mono">
                  {selectedProperty.inverse}
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
                    <span className="font-mono text-primary">{annotation.property}:</span>
                    <span className="text-muted-foreground">{annotation.value}</span>
                  </div>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No annotations</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
