"use client";

import { useOntology } from "@/lib/ontology/context";
import { ClassDetails } from "./class-details";
import { PropertyDetails } from "./property-details";
import { IndividualDetails } from "./individual-details";

export function DetailsPanel() {
  const { selectedClass, selectedProperty, selectedIndividual } = useOntology();

  if (selectedProperty) {
    return <PropertyDetails />;
  }

  if (selectedClass) {
    return <ClassDetails />;
  }

  if (selectedIndividual) {
    return <IndividualDetails />;
  }

  return (
    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
      Select an entity to view details
    </div>
  );
}
