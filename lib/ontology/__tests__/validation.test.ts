import { isDuplicateEntityId, isValidIRI } from '../validation'
import type { Ontology } from '../types'

describe('ontology validation utilities', () => {
  describe('isValidIRI', () => {
    it('accepts simple identifiers', () => {
      expect(isValidIRI('Person')).toBe(true)
      expect(isValidIRI('Person_Class')).toBe(true)
      expect(isValidIRI('Person-Class')).toBe(true)
    })

    it('accepts full IRIs', () => {
      expect(isValidIRI('http://example.org/Person')).toBe(true)
      expect(isValidIRI('https://example.org/Person')).toBe(true)
    })

    it('rejects invalid values', () => {
      expect(isValidIRI('123Person')).toBe(false)
      expect(isValidIRI('Person Class')).toBe(false)
      expect(isValidIRI('Person@Class')).toBe(false)
    })
  })

  describe('isDuplicateEntityId', () => {
    const ontology: Ontology = {
      id: 'test',
      name: 'Test Ontology',
      version: '1.0.0',
      classes: new Map([
        [
          'Person',
          {
            id: 'Person',
            name: 'Person',
            label: 'Person',
            description: '',
            superClasses: [],
            properties: [],
            disjointWith: [],
            equivalentTo: [],
            annotations: [],
          },
        ],
      ]),
      properties: new Map([
        [
          'hasName',
          {
            id: 'hasName',
            name: 'hasName',
            label: 'has name',
            description: '',
            type: 'DataProperty',
            domain: [],
            range: [],
            superProperties: [],
            characteristics: [],
            annotations: [],
          },
        ],
      ]),
      individuals: new Map([
        [
          'john',
          {
            id: 'john',
            name: 'john',
            label: 'John',
            types: [],
            propertyAssertions: [],
            sameAs: [],
            differentFrom: [],
            annotations: [],
          },
        ],
      ]),
      imports: [],
      annotations: [],
    }

    it('returns true when id exists in any ontology map', () => {
      expect(isDuplicateEntityId('Person', ontology)).toBe(true)
      expect(isDuplicateEntityId('hasName', ontology)).toBe(true)
      expect(isDuplicateEntityId('john', ontology)).toBe(true)
    })

    it('returns false for unique id', () => {
      expect(isDuplicateEntityId('Animal', ontology)).toBe(false)
    })
  })
})
