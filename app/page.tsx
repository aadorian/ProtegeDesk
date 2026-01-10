'use client'
import debug from 'debug'
import { useEffect, useState } from 'react'
import { OntologyHeader } from '@/components/ontology/header'
import { TabsNavigation } from '@/components/ontology/tabs-navigation'
import { DetailsPanel } from '@/components/ontology/details-panel'
import { GraphView } from '@/components/ontology/graph-view'
import { OntologyStats } from '@/components/ontology/ontology-stats'
import { SPARQLQuery } from '@/components/ontology/sparql-query'
import { useOntology } from '@/lib/ontology/context'
import { createSampleOntology } from '@/lib/ontology/sample-data'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const log = debug('protegedesk:homepage')

export default function HomePage() {
  const { setOntology } = useOntology()
  const [viewMode, setViewMode] = useState<'details' | 'graph' | 'sparql'>('details')

  useEffect(() => {
    // Load sample ontology on mount
    log('Loading sample ontology')
    setOntology(createSampleOntology())
    log('Sample ontology loaded')
  }, [setOntology])

  return (
    <div className="flex h-screen flex-col">
      <OntologyHeader />
      <main className="flex flex-1 overflow-hidden">
        <aside className="border-border bg-card w-64 border-r">
          <TabsNavigation />
        </aside>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="border-border border-b">
            <Tabs
              value={viewMode}
              onValueChange={v => {
                log('View mode changed to', v)
                setViewMode(v as any)
              }}
              className="w-full"
            >
              <TabsList className="mx-4 mt-2">
                <TabsTrigger value="details" className="text-xs">
                  Details View
                </TabsTrigger>
                <TabsTrigger value="graph" className="text-xs">
                  Graph View
                </TabsTrigger>
                <TabsTrigger value="sparql" className="text-xs">
                  SPARQL Query
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex-1 overflow-hidden">
            {viewMode === 'details' ? (
              <DetailsPanel />
            ) : viewMode === 'graph' ? (
              <GraphView />
            ) : (
              <SPARQLQuery />
            )}
          </div>
        </div>
        <aside className="border-border bg-card w-80 overflow-y-auto border-l p-4">
          <OntologyStats />
        </aside>
      </main>
    </div>
  )
}
