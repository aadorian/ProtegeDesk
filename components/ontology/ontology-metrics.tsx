'use client'

import { useMemo } from 'react'
import { useOntology } from '@/lib/ontology/context'
import { calculateOntologyMetrics } from '@/lib/ontology/metrics'
import { CollapsibleCard } from './collapsible-card'

type MetricRowProps = {
  label: string
  value: number
}

function MetricRow({ label, value }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-mono text-sm font-medium">{value.toLocaleString()}</span>
    </div>
  )
}

export function OntologyMetrics() {
  const { ontology } = useOntology()

  const metrics = useMemo(() => calculateOntologyMetrics(ontology), [ontology])

  if (!ontology) {
    return null
  }

  return (
    <div className="space-y-3">
      <h3 className="px-1 text-sm font-semibold">Ontology Metrics</h3>

      <CollapsibleCard title="Axioms" storageKey="metrics-axioms" defaultOpen={true}>
        <div className="divide-border divide-y">
          <MetricRow label="Axiom count" value={metrics.axiomCount} />
          <MetricRow label="Logical axiom count" value={metrics.logicalAxiomCount} />
          <MetricRow label="Declaration axiom count" value={metrics.declarationAxiomCount} />
        </div>
      </CollapsibleCard>

      <CollapsibleCard title="Class Axioms" storageKey="metrics-class-axioms" defaultOpen={true}>
        <div className="divide-border divide-y">
          <MetricRow label="SubClassOf" value={metrics.subClassOfAxiomCount} />
          <MetricRow label="EquivalentClasses" value={metrics.equivalentClassesAxiomCount} />
          <MetricRow label="DisjointClasses" value={metrics.disjointClassesAxiomCount} />
        </div>
      </CollapsibleCard>

      <CollapsibleCard title="Entities" storageKey="metrics-entities" defaultOpen={true}>
        <div className="divide-border divide-y">
          <MetricRow label="Class count" value={metrics.classCount} />
          <MetricRow label="Object property count" value={metrics.objectPropertyCount} />
          <MetricRow label="Data property count" value={metrics.dataPropertyCount} />
          <MetricRow label="Annotation property count" value={metrics.annotationPropertyCount} />
          <MetricRow label="Individual count" value={metrics.individualCount} />
        </div>
      </CollapsibleCard>

      <CollapsibleCard title="Annotations" storageKey="metrics-annotations" defaultOpen={false}>
        <div className="divide-border divide-y">
          <MetricRow label="Annotation count" value={metrics.annotationCount} />
        </div>
      </CollapsibleCard>
    </div>
  )
}
