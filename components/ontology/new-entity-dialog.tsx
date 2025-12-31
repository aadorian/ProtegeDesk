"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useOntology } from "@/lib/ontology/context"
import { useToast } from "@/hooks/use-toast"

export function NewEntityDialog() {
  const { addClass, addProperty } = useOntology()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [entityType, setEntityType] = useState<"class" | "property">("class")
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [label, setLabel] = useState("")
  const [description, setDescription] = useState("")
  const [propertyType, setPropertyType] = useState<"ObjectProperty" | "DataProperty">("ObjectProperty")

  const handleCreate = () => {
    if (!id || !name) {
      toast({
        title: "Validation error",
        description: "ID and Name are required",
        variant: "destructive",
      })
      return
    }

    if (entityType === "class") {
      addClass({
        id,
        name,
        label,
        description,
        superClasses: ["owl:Thing"],
        annotations: [],
        properties: [],
        disjointWith: [],
        equivalentTo: [],
      })
      toast({
        title: "Class created",
        description: `Created class: ${name}`,
      })
    } else {
      addProperty({
        id,
        name,
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
        title: "Property created",
        description: `Created property: ${name}`,
      })
    }

    // Reset form
    setId("")
    setName("")
    setLabel("")
    setDescription("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Entity
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Entity</DialogTitle>
          <DialogDescription>Add a new class or property to your ontology</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Entity Type</Label>
            <Select value={entityType} onValueChange={(v) => setEntityType(v as any)}>
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
              onChange={(e) => setId(e.target.value)}
              className="font-mono text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entity-name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="entity-name"
              placeholder="e.g., Person, hasName"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entity-label">Label</Label>
            <Input
              id="entity-label"
              placeholder="Human-readable label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          {entityType === "property" && (
            <div className="space-y-2">
              <Label>Property Type</Label>
              <Select value={propertyType} onValueChange={(v) => setPropertyType(v as any)}>
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
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={handleCreate} className="w-full">
            Create {entityType === "class" ? "Class" : "Property"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
