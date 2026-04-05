import type { Ontology } from './types'

const FULL_IRI_PATTERN = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^\s]+$/
const SIMPLE_IDENTIFIER_PATTERN = /^[a-zA-Z_][a-zA-Z0-9_-]*$/

export function isValidIRI(value: string): boolean {
  return FULL_IRI_PATTERN.test(value) || SIMPLE_IDENTIFIER_PATTERN.test(value)
}

export function isDuplicateEntityId(id: string, ontology: Ontology): boolean {
  return ontology.classes.has(id) || ontology.properties.has(id) || ontology.individuals.has(id)
}
