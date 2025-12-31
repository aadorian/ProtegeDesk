"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClassTree } from "./class-tree"
import { PropertyList } from "./property-list"

export function TabsNavigation() {
  return (
    <Tabs defaultValue="classes" className="flex flex-col h-full">
      <TabsList className="mx-3 mt-2">
        <TabsTrigger value="classes" className="text-xs">
          Classes
        </TabsTrigger>
        <TabsTrigger value="properties" className="text-xs">
          Properties
        </TabsTrigger>
        <TabsTrigger value="individuals" className="text-xs">
          Individuals
        </TabsTrigger>
      </TabsList>

      <TabsContent value="classes" className="flex-1 overflow-hidden mt-0">
        <ClassTree />
      </TabsContent>

      <TabsContent value="properties" className="flex-1 overflow-hidden mt-0">
        <PropertyList />
      </TabsContent>

      <TabsContent value="individuals" className="flex-1 overflow-hidden mt-0">
        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
          Individuals view coming soon...
        </div>
      </TabsContent>
    </Tabs>
  )
}
