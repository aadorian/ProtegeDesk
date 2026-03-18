'use client'
import debug from 'debug'
import { useEffect, useState } from 'react'
import { OntologyHeader } from '@/components/ontology/header'
import { TabsNavigation } from '@/components/ontology/tabs-navigation'
import { DetailsPanel } from '@/components/ontology/details-panel'
import { GraphView } from '@/components/ontology/graph-view'
import { OntologyStats } from '@/components/ontology/ontology-stats'
import { useOntology } from '@/lib/ontology/context'
import { parseOWLXML } from '@/lib/ontology/serializers'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ErrorBoundary from '@/components/ErrorBoundary'

const log = debug('protegedesk:homepage')

export default function HomePage() {
  const { setOntology } = useOntology()
  const [ontologyViewMode, setOntologyViewMode] = useState<'details' | 'graph'>('details')

  useEffect(() => {
    // Load sample ontology on mount
    const loadSampleOntology = async () => {
      try {
        log('Loading sample ontology')
        const response = await fetch('/sample-ontology.owl')
        const owlContent = await response.text()
        const ontology = parseOWLXML(owlContent)
        setOntology(ontology)
        log('Sample ontology loaded successfully')
      } catch (error) {
        log('Failed to load sample ontology:', error)
      }
    }
    loadSampleOntology()
  }, [setOntology])

  return (
    <div className="flex h-screen flex-col">
      <OntologyHeader />
      <main className="flex flex-1 overflow-hidden">
        <aside className="border-border bg-card w-64 border-r">
          <ErrorBoundary>
            <TabsNavigation />
          </ErrorBoundary>
        </aside>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="border-border border-b">
            <Tabs
              value={ontologyViewMode}
              onValueChange={newOntologyViewMode => {
                const mode = newOntologyViewMode as 'details' | 'graph'
                log('Ontology view mode changed to %s', mode)
                setOntologyViewMode(mode)
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
              </TabsList>
            </Tabs>
          </div>
          <div className="flex-1 overflow-hidden">
            <ErrorBoundary>
              {ontologyViewMode === 'details' ? <DetailsPanel /> : <GraphView />}
            </ErrorBoundary>
          </div>
        </div>
        <aside className="border-border bg-card w-80 overflow-y-auto border-l p-4">
          <ErrorBoundary>
            <OntologyStats />
          </ErrorBoundary>
        </aside>
      </main>
    </div>
  )
}
