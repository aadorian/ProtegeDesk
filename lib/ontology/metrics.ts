import type { Ontology } from './types'

export type OntologyMetrics = {
  // Entity counts
  classCount: number
  objectPropertyCount: number
  dataPropertyCount: number
  annotationPropertyCount: number
  individualCount: number

  // Axiom counts
  axiomCount: number
  logicalAxiomCount: number
  declarationAxiomCount: number

  // Class axiom counts
  subClassOfAxiomCount: number
  equivalentClassesAxiomCount: number
  disjointClassesAxiomCount: number

  // Annotation count
  annotationCount: number
}

/**
 * Calculates detailed metrics for an ontology, similar to Stanford Protégé's Ontology Metrics view.
 */
export function calculateOntologyMetrics(ontology: Ontology | null): OntologyMetrics {
  if (!ontology) {
    return {
      classCount: 0,
      objectPropertyCount: 0,
      dataPropertyCount: 0,
      annotationPropertyCount: 0,
      individualCount: 0,
      axiomCount: 0,
      logicalAxiomCount: 0,
      declarationAxiomCount: 0,
      subClassOfAxiomCount: 0,
      equivalentClassesAxiomCount: 0,
      disjointClassesAxiomCount: 0,
      annotationCount: 0,
    }
  }

  const classes = Array.from(ontology.classes.values())
  const properties = Array.from(ontology.properties.values())
  const individuals = Array.from(ontology.individuals.values())

  // Entity counts
  const classCount = classes.length
  const objectPropertyCount = properties.filter(p => p.type === 'ObjectProperty').length
  const dataPropertyCount = properties.filter(p => p.type === 'DataProperty').length
  const annotationPropertyCount = properties.filter(p => p.type === 'AnnotationProperty').length
  const individualCount = individuals.length

  // Declaration axioms (one per entity)
  const declarationAxiomCount = classCount + properties.length + individualCount

  // Class axioms
  let subClassOfAxiomCount = 0
  let equivalentClassesAxiomCount = 0
  let disjointClassesAxiomCount = 0

  for (const cls of classes) {
    subClassOfAxiomCount += cls.superClasses.length
    equivalentClassesAxiomCount += cls.equivalentTo.length
    disjointClassesAxiomCount += cls.disjointWith.length
  }

  // Property axioms (domain, range, subproperty, characteristics)
  let propertyAxiomCount = 0
  for (const prop of properties) {
    propertyAxiomCount += prop.domain.length
    propertyAxiomCount += prop.range.length
    propertyAxiomCount += prop.superProperties.length
    propertyAxiomCount += prop.characteristics.length
    if (prop.inverse) {
      propertyAxiomCount += 1
    }
  }

  // Individual axioms (type assertions, property assertions, sameAs, differentFrom)
  let individualAxiomCount = 0
  for (const ind of individuals) {
    individualAxiomCount += ind.types.length
    individualAxiomCount += ind.propertyAssertions.length
    individualAxiomCount += ind.sameAs.length
    individualAxiomCount += ind.differentFrom.length
  }

  // Logical axioms = class axioms + property axioms + individual axioms (excluding declarations)
  const logicalAxiomCount =
    subClassOfAxiomCount +
    equivalentClassesAxiomCount +
    disjointClassesAxiomCount +
    propertyAxiomCount +
    individualAxiomCount

  // Total axiom count = logical axioms + declaration axioms
  const axiomCount = logicalAxiomCount + declarationAxiomCount

  // Annotation count
  let annotationCount = ontology.annotations.length
  for (const cls of classes) {
    annotationCount += cls.annotations.length
  }
  for (const prop of properties) {
    annotationCount += prop.annotations.length
  }
  for (const ind of individuals) {
    annotationCount += ind.annotations.length
  }

  return {
    classCount,
    objectPropertyCount,
    dataPropertyCount,
    annotationPropertyCount,
    individualCount,
    axiomCount,
    logicalAxiomCount,
    declarationAxiomCount,
    subClassOfAxiomCount,
    equivalentClassesAxiomCount,
    disjointClassesAxiomCount,
    annotationCount,
  }
}
