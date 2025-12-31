// Core ontology types for the Protege-like system

export type OntologyClass = {
  id: string
  name: string
  label?: string
  description?: string
  superClasses: string[]
  annotations: Annotation[]
  properties: string[]
  disjointWith: string[]
  equivalentTo: string[]
}

export type OntologyProperty = {
  id: string
  name: string
  label?: string
  description?: string
  type: "ObjectProperty" | "DataProperty" | "AnnotationProperty"
  domain: string[]
  range: string[]
  superProperties: string[]
  characteristics: PropertyCharacteristic[]
  inverse?: string
  annotations: Annotation[]
}

export type PropertyCharacteristic =
  | "Functional"
  | "InverseFunctional"
  | "Transitive"
  | "Symmetric"
  | "Asymmetric"
  | "Reflexive"
  | "Irreflexive"

export type Individual = {
  id: string
  name: string
  label?: string
  types: string[]
  propertyAssertions: PropertyAssertion[]
  annotations: Annotation[]
  sameAs: string[]
  differentFrom: string[]
}

export type PropertyAssertion = {
  property: string
  value: string | number | boolean
  datatype?: string
}

export type Annotation = {
  property: string
  value: string
  language?: string
}

export type Ontology = {
  id: string
  name: string
  version?: string
  imports: string[]
  classes: Map<string, OntologyClass>
  properties: Map<string, OntologyProperty>
  individuals: Map<string, Individual>
  annotations: Annotation[]
}

export type OntologyStats = {
  classCount: number
  propertyCount: number
  individualCount: number
  axiomCount: number
}
