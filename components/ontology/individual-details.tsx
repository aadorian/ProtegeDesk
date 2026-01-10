"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useOntology } from "@/lib/ontology/context"
import { ScrollArea } from "@/components/ui/scroll-area"

export function IndividualDetails() {
  const { selectedIndividual, ontology } = useOntology()

  if (!selectedIndividual) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Select an individual to view details
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Individual Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="individual-id" className="text-xs">
                ID
              </Label>
              <Input
                id="individual-id"
                value={selectedIndividual.id}
                readOnly
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="individual-name" className="text-xs">
                Name
              </Label>
              <Input
                id="individual-name"
                value={selectedIndividual.name}
                readOnly
                className="text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="individual-label" className="text-xs">
                Label
              </Label>
              <Input
                id="individual-label"
                value={selectedIndividual.label || ""}
                readOnly
                className="text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="individual-label" className="text-xs">
                Label
              </Label>
              <Input
                id="individual-label"
                value={selectedIndividual.label || ""}
                readOnly
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label className="text-xs">Instance Of</Label>
              <div className="flex flex-wrap gap-2">
                {selectedIndividual.types.length > 0 ? (
                  selectedIndividual.types.map((typeClass) => (
                    <Badge
                      key={typeClass}
                      variant="secondary"
                      className="text-xs font-mono"
                    >
                      {typeClass}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">None</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Annotations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedIndividual.annotations.length > 0 ? (
                selectedIndividual.annotations.map((annotation, index) => (
                  <div key={index} className="flex gap-2 text-xs">
                    <span className="font-mono text-primary">
                      {annotation.property}:
                    </span>
                    <span className="text-muted-foreground">
                      {annotation.value}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">
                  No annotations
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
