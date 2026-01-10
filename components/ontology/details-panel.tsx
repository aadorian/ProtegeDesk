'use client'

import { useOntology } from '@/lib/ontology/context'
import { ClassDetails } from './class-details'
import { PropertyDetails } from './property-details'
import { IndividualDetails } from './individual-details'

export function DetailsPanel() {
  const { selectedClass, selectedProperty, selectedIndividual } = useOntology()

  if (selectedIndividual) {
    return <IndividualDetails />
  }

  if (selectedProperty) {
    return <PropertyDetails />
  }

  if (selectedClass) {
    return <ClassDetails />
  }

  if (selectedIndividual) {
    return <IndividualDetails />
  }

  return (
    <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
      Select an entity to view details
    </div>
  )
}
