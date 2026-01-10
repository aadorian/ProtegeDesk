'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ClassTree } from './class-tree'
import { PropertyList } from './property-list'
import { IndividualList } from './individual-list'

export function TabsNavigation() {
  return (
    <Tabs defaultValue="classes" className="flex h-full flex-col">
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

      <TabsContent value="classes" className="mt-0 flex-1 overflow-hidden">
        <ClassTree />
      </TabsContent>

      <TabsContent value="properties" className="mt-0 flex-1 overflow-hidden">
        <PropertyList />
      </TabsContent>

      <TabsContent value="individuals" className="mt-0 flex-1 overflow-hidden">
        <IndividualList />
      </TabsContent>
    </Tabs>
  )
}
