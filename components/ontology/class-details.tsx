"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useOntology } from "@/lib/ontology/context"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ClassDetails() {
  const { selectedClass, ontology } = useOntology()

  if (!selectedClass) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Select a class to view details
      </div>
    )
  }

  const subclasses = Array.from(ontology?.classes.values() || []).filter((c) =>
    c.superClasses.includes(selectedClass.id),
  )

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Class Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="class-id" className="text-xs">
                ID
              </Label>
              <Input id="class-id" value={selectedClass.id} readOnly className="font-mono text-xs" />
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
              <Input id="class-label" value={selectedClass.label || ""} readOnly className="text-xs" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-description" className="text-xs">
                Description
              </Label>
              <Textarea
                id="class-description"
                value={selectedClass.description || ""}
                readOnly
                rows={3}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hierarchy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Superclasses</Label>
              <div className="flex flex-wrap gap-2">
                {selectedClass.superClasses.length > 0 ? (
                  selectedClass.superClasses.map((superClass) => (
                    <Badge key={superClass} variant="secondary" className="text-xs font-mono">
                      {superClass}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">None</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Subclasses ({subclasses.length})</Label>
              <div className="flex flex-wrap gap-2">
                {subclasses.length > 0 ? (
                  subclasses.map((subClass) => (
                    <Badge key={subClass.id} variant="outline" className="text-xs font-mono">
                      {subClass.name}
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
            <CardTitle className="text-base">Relationships</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Disjoint With</Label>
              <div className="flex flex-wrap gap-2">
                {selectedClass.disjointWith.length > 0 ? (
                  selectedClass.disjointWith.map((disjoint) => (
                    <Badge key={disjoint} variant="destructive" className="text-xs font-mono">
                      {disjoint}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">None</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Properties ({selectedClass.properties.length})</Label>
              <div className="flex flex-wrap gap-2">
                {selectedClass.properties.length > 0 ? (
                  selectedClass.properties.map((prop) => (
                    <Badge key={prop} className="text-xs font-mono">
                      {prop}
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
              {selectedClass.annotations.length > 0 ? (
                selectedClass.annotations.map((annotation, index) => (
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
