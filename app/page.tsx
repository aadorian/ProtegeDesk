"use client"
import debug from "debug"
import { useEffect, useState } from "react"
import { OntologyHeader } from "@/components/ontology/header"
import { TabsNavigation } from "@/components/ontology/tabs-navigation"
import { DetailsPanel } from "@/components/ontology/details-panel"
import { GraphView } from "@/components/ontology/graph-view"
import { OntologyStats } from "@/components/ontology/ontology-stats"
import { useOntology } from "@/lib/ontology/context"
import { createSampleOntology } from "@/lib/ontology/sample-data"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const log = debug("protegedesk:homepage")


export default function HomePage() {
  const { setOntology } = useOntology()
  const [viewMode, setViewMode] = useState<"details" | "graph">("details")

  useEffect(() => {
    // Load sample ontology on mount
      log("Loading sample ontology")
    setOntology(createSampleOntology())
      log("Sample ontology loaded")
  }, [setOntology])

  return (
    <div className="flex h-screen flex-col">
      <OntologyHeader />
      <main className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-border bg-card">
          <TabsNavigation />
        </aside>
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="border-b border-border">
            <Tabs value={viewMode} onValueChange={(v) => {
              log("View mode changed to", v)
              setViewMode(v as any)
            }} className="w-full">
              <TabsList className="mx-4 mt-2">
                <TabsTrigger value="details" className="text-xs">
                  Details View
                </TabsTrigger>
                <TabsTrigger value="graph" className="text-xs">
                  Graph View
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex-1 overflow-hidden">{viewMode === "details" ? <DetailsPanel /> : <GraphView />}</div>
        </div>
        <aside className="w-80 border-l border-border bg-card p-4 overflow-y-auto">
          <OntologyStats />
        </aside>
      </main>
    </div>
  )
}
