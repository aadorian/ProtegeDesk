import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { OntologyProvider, useOntology } from '../context'
import type { Ontology, OntologyClass, OntologyProperty, Individual } from '../types'

describe('OntologyContext', () => {
  const createMockOntology = (): Ontology => ({
    id: 'test-ontology',
    name: 'Test Ontology',
    version: '1.0',
    imports: [],
    classes: new Map(),
    properties: new Map(),
    individuals: new Map(),
    annotations: [],
  })

  const createMockClass = (id: string, name: string): OntologyClass => ({
    id,
    name,
    superClasses: [],
    annotations: [],
    properties: [],
    disjointWith: [],
    equivalentTo: [],
  })

  const createMockProperty = (id: string, name: string): OntologyProperty => ({
    id,
    name,
    type: 'ObjectProperty',
    domain: [],
    range: [],
    superProperties: [],
    characteristics: [],
    annotations: [],
  })

  const createMockIndividual = (id: string, name: string): Individual => ({
    id,
    name,
    types: [],
    propertyAssertions: [],
    annotations: [],
    sameAs: [],
    differentFrom: [],
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <OntologyProvider>{children}</OntologyProvider>
  )

  describe('initialization', () => {
    it('should initialize with null ontology', () => {
      const { result } = renderHook(() => useOntology(), { wrapper })

      expect(result.current.ontology).toBeNull()
      expect(result.current.selectedClass).toBeNull()
      expect(result.current.selectedProperty).toBeNull()
      expect(result.current.selectedIndividual).toBeNull()
    })

    it('should throw error when used outside provider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        renderHook(() => useOntology())
      }).toThrow('useOntology must be used within an OntologyProvider')

      consoleError.mockRestore()
    })
  })

  describe('setOntology', () => {
    it('should set the ontology', () => {
      const { result } = renderHook(() => useOntology(), { wrapper })
      const ontology = createMockOntology()

      act(() => {
        result.current.setOntology(ontology)
      })

      expect(result.current.ontology).toEqual(ontology)
    })
  })

  describe('selectClass', () => {
    it('should select a class by id', () => {
      const { result } = renderHook(() => useOntology(), { wrapper })
      const ontology = createMockOntology()
      const testClass = createMockClass('test-class', 'TestClass')
      ontology.classes.set('test-class', testClass)

      act(() => {
        result.current.setOntology(ontology)
      })

      act(() => {
        result.current.selectClass('test-class')
      })

      expect(result.current.selectedClass).toEqual(testClass)
    })

    it('should set selectedClass to null when id is null', () => {
      const { result } = renderHook(() => useOntology(), { wrapper })
      const ontology = createMockOntology()

      act(() => {
        result.current.setOntology(ontology)
      })

      act(() => {
        result.current.selectClass(null)
      })

      expect(result.current.selectedClass).toBeNull()
    })

    it('should set selectedClass to null when class not found', () => {
      const { result } = renderHook(() => useOntology(), { wrapper })
      const ontology = createMockOntology()

      act(() => {
        result.current.setOntology(ontology)
      })

      act(() => {
        result.current.selectClass('non-existent')
      })

      expect(result.current.selectedClass).toBeNull()
    })
  })

  describe('selectProperty', () => {
    it('should select a property by id', () => {
      const { result } = renderHook(() => useOntology(), { wrapper })
      const ontology = createMockOntology()
      const testProperty = createMockProperty('test-prop', 'testProperty')
      ontology.properties.set('test-prop', testProperty)

      act(() => {
        result.current.setOntology(ontology)
      })

      act(() => {
        result.current.selectProperty('test-prop')
      })

      expect(result.current.selectedProperty).toEqual(testProperty)
    })

    it('should set selectedProperty to null when id is null', () => {
      const { result } = renderHook(() => useOntology(), { wrapper })
      const ontology = createMockOntology()

      act(() => {
        result.current.setOntology(ontology)
      })

      act(() => {
        result.current.selectProperty(null)
      })

      expect(result.current.selectedProperty).toBeNull()
    })
  })

  describe('selectIndividual', () => {
    it('should select an individual by id', () => {
      const { result } = renderHook(() => useOntology(), { wrapper })
      const ontology = createMockOntology()
      const testIndividual = createMockIndividual('test-ind', 'TestIndividual')
      ontology.individuals.set('test-ind', testIndividual)

      act(() => {
        result.current.setOntology(ontology)
      })

      act(() => {
        result.current.selectIndividual('test-ind')
      })

      expect(result.current.selectedIndividual).toEqual(testIndividual)
    })
  })

  describe('addClass', () => {
    it('should add a new class to the ontology', () => {
      const { result } = renderHook(() => useOntology(), { wrapper })
      const ontology = createMockOntology()
      const newClass = createMockClass('new-class', 'NewClass')

      act(() => {
        result.current.setOntology(ontology)
      })

      act(() => {
        result.current.addClass(newClass)
      })

      expect(result.current.ontology?.classes.get('new-class')).toEqual(newClass)
    })

    it('should not modify state when ontology is null', () => {
      const { result } = renderHook(() => useOntology(), { wrapper })
      const newClass = createMockClass('new-class', 'NewClass')

      act(() => {
        result.current.addClass(newClass)
      })

      expect(result.current.ontology).toBeNull()
    })
  })

  describe('addProperty', () => {
    it('should add a new property to the ontology', () => {
      const { result } = renderHook(() => useOntology(), { wrapper })
      const ontology = createMockOntology()
      const newProperty = createMockProperty('new-prop', 'newProperty')

      act(() => {
        result.current.setOntology(ontology)
      })

      act(() => {
        result.current.addProperty(newProperty)
      })

      expect(result.current.ontology?.properties.get('new-prop')).toEqual(newProperty)
    })
  })

  describe('addIndividual', () => {
    it('should add a new individual to the ontology', () => {
      const { result } = renderHook(() => useOntology(), { wrapper })
      const ontology = createMockOntology()
      const newIndividual = createMockIndividual('new-ind', 'NewIndividual')

      act(() => {
        result.current.setOntology(ontology)
      })

      act(() => {
        result.current.addIndividual(newIndividual)
      })

      expect(result.current.ontology?.individuals.get('new-ind')).toEqual(newIndividual)
    })
  })

  describe('updateClass', () => {
    it('should update an existing class', () => {
      const { result } = renderHook(() => useOntology(), { wrapper })
      const ontology = createMockOntology()
      const testClass = createMockClass('test-class', 'TestClass')
      ontology.classes.set('test-class', testClass)

      act(() => {
        result.current.setOntology(ontology)
      })

      act(() => {
        result.current.updateClass('test-class', { description: 'Updated description' })
      })

      expect(result.current.ontology?.classes.get('test-class')?.description).toBe(
        'Updated description'
      )
    })

    it('should not modify state when class does not exist', () => {
      const { result } = renderHook(() => useOntology(), { wrapper })
      const ontology = createMockOntology()

      act(() => {
        result.current.setOntology(ontology)
      })

      const classesBefore = result.current.ontology?.classes.size

      act(() => {
        result.current.updateClass('non-existent', { description: 'Test' })
      })

      expect(result.current.ontology?.classes.size).toBe(classesBefore)
    })
  })

  describe('updateProperty', () => {
    it('should update an existing property', () => {
      const { result } = renderHook(() => useOntology(), { wrapper })
      const ontology = createMockOntology()
      const testProperty = createMockProperty('test-prop', 'testProperty')
      ontology.properties.set('test-prop', testProperty)

      act(() => {
        result.current.setOntology(ontology)
      })

      act(() => {
        result.current.updateProperty('test-prop', { description: 'Updated property' })
      })

      expect(result.current.ontology?.properties.get('test-prop')?.description).toBe(
        'Updated property'
      )
    })
  })

  describe('deleteClass', () => {
    it('should delete a class from the ontology', () => {
      const { result } = renderHook(() => useOntology(), { wrapper })
      const ontology = createMockOntology()
      const testClass = createMockClass('test-class', 'TestClass')
      ontology.classes.set('test-class', testClass)

      act(() => {
        result.current.setOntology(ontology)
      })

      act(() => {
        result.current.deleteClass('test-class')
      })

      expect(result.current.ontology?.classes.has('test-class')).toBe(false)
    })
  })

  describe('deleteProperty', () => {
    it('should delete a property from the ontology', () => {
      const { result } = renderHook(() => useOntology(), { wrapper })
      const ontology = createMockOntology()
      const testProperty = createMockProperty('test-prop', 'testProperty')
      ontology.properties.set('test-prop', testProperty)

      act(() => {
        result.current.setOntology(ontology)
      })

      act(() => {
        result.current.deleteProperty('test-prop')
      })

      expect(result.current.ontology?.properties.has('test-prop')).toBe(false)
    })
  })

  describe('state immutability', () => {
    it('should create new Map instances when modifying classes', () => {
      const { result } = renderHook(() => useOntology(), { wrapper })
      const ontology = createMockOntology()
      const testClass = createMockClass('test-class', 'TestClass')
      ontology.classes.set('test-class', testClass)

      act(() => {
        result.current.setOntology(ontology)
      })

      const classesMapBefore = result.current.ontology?.classes

      act(() => {
        result.current.addClass(createMockClass('new-class', 'NewClass'))
      })

      const classesMapAfter = result.current.ontology?.classes

      expect(classesMapBefore).not.toBe(classesMapAfter)
    })
  })
})
