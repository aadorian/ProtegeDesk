"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useOntology } from "@/lib/ontology/context"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PropertyList() {
  const { ontology, selectedProperty, selectProperty } = useOntology()
  const [searchQuery, setSearchQuery] = useState("")

  const properties = Array.from(ontology?.properties.values() || [])

  const objectProperties = properties.filter((p) => p.type === "ObjectProperty")
  const dataProperties = properties.filter((p) => p.type === "DataProperty")
  const annotationProperties = properties.filter((p) => p.type === "AnnotationProperty")

  const filterProperties = (props: typeof properties) => {
    if (!searchQuery) return props
    return props.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.label?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  const PropertyItem = ({ property }: { property: (typeof properties)[0] }) => {
    const isSelected = selectedProperty?.id === property.id
    return (
      <div
        onClick={() => selectProperty(property.id)}
        className={cn(
          "flex items-center justify-between p-2 rounded cursor-pointer hover:bg-accent text-sm group",
          isSelected && "bg-primary/20 text-primary",
        )}
      >
        <div className="flex-1 min-w-0">
          <div className="font-mono text-xs truncate">{property.label || property.name}</div>
          <div className="text-xs text-muted-foreground truncate">{property.id}</div>
        </div>
        <Badge variant="outline" className="text-xs ml-2">
          {property.type === "ObjectProperty" ? "Obj" : property.type === "DataProperty" ? "Data" : "Ann"}
        </Badge>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <h3 className="text-sm font-semibold">Properties</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="px-3 py-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 h-8 text-xs"
          />
        </div>
      </div>

      <Tabs defaultValue="object" className="flex-1 flex flex-col">
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

        <TabsContent value="object" className="flex-1 overflow-y-auto px-2 mt-2">
          {filterProperties(objectProperties).map((property) => (
            <PropertyItem key={property.id} property={property} />
          ))}
        </TabsContent>

        <TabsContent value="data" className="flex-1 overflow-y-auto px-2 mt-2">
          {filterProperties(dataProperties).map((property) => (
            <PropertyItem key={property.id} property={property} />
          ))}
        </TabsContent>

        <TabsContent value="annotation" className="flex-1 overflow-y-auto px-2 mt-2">
          {filterProperties(annotationProperties).map((property) => (
            <PropertyItem key={property.id} property={property} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
