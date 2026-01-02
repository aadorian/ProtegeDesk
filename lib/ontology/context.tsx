'use client'

import type React from 'react'
import { createContext, useContext, useState, useCallback } from 'react'
import type { Ontology, OntologyClass, OntologyProperty, Individual } from './types'

/**
 * Centralized context shape for managing ontology state and selections.
 *
 * This context intentionally stores both:
 * 1. The full ontology graph (Maps of classes, properties, individuals)
 * 2. The currently selected entity (by value, not just ID)
 *
 * Keeping selected entities denormalized avoids repeated Map lookups
 * in consuming components and simplifies UI rendering logic.
 */
type OntologyContextType = {
  ontology: Ontology | null
  selectedClass: OntologyClass | null
  selectedProperty: OntologyProperty | null
  selectedIndividual: Individual | null
  setOntology: (ontology: Ontology) => void
  selectClass: (classId: string | null) => void
  selectProperty: (propertyId: string | null) => void
  selectIndividual: (individualId: string | null) => void
  addClass: (owlClass: OntologyClass) => void
  addProperty: (property: OntologyProperty) => void
  addIndividual: (individual: Individual) => void
  updateClass: (classId: string, updates: Partial<OntologyClass>) => void
  updateProperty: (propertyId: string, updates: Partial<OntologyProperty>) => void
  deleteClass: (classId: string) => void
  deleteProperty: (propertyId: string) => void
}

/**
 * Context is initialized as `undefined` so we can explicitly detect
 * misuse of the `useOntology` hook outside the provider.
 *
 * This is safer than providing a default no-op implementation,
 * which could mask configuration errors.
 */
const OntologyContext = createContext<OntologyContextType | undefined>(undefined)

export function OntologyProvider({ children }: { children: React.ReactNode }) {
  /**
   * The full ontology object is stored as a single state value.
   * Internally, it contains Maps for fast lookup and mutation.
   */
  const [ontology, setOntology] = useState<Ontology | null>(null)

  /**
   * Selected entities are stored independently from the ontology.
   *
   * This avoids coupling UI selection state to ontology mutations
   * (e.g. re-selecting after edits or imports).
   */
  const [selectedClass, setSelectedClass] = useState<OntologyClass | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<OntologyProperty | null>(null)
  const [selectedIndividual, setSelectedIndividual] = useState<Individual | null>(null)

  /**
   * Selection helpers resolve an ID into the corresponding entity.
   *
   * If the ontology is not yet loaded, or the ID is null/invalid,
   * the selection is explicitly cleared to avoid stale UI state.
   */
  const selectClass = useCallback(
    (classId: string | null) => {
      if (!ontology || !classId) {
        setSelectedClass(null)
        return
      }
      const owlClass = ontology.classes.get(classId)
      setSelectedClass(owlClass || null)
    },
    [ontology]
  )

  const selectProperty = useCallback(
    (propertyId: string | null) => {
      if (!ontology || !propertyId) {
        setSelectedProperty(null)
        return
      }
      const property = ontology.properties.get(propertyId)
      setSelectedProperty(property || null)
    },
    [ontology]
  )

  const selectIndividual = useCallback(
    (individualId: string | null) => {
      if (!ontology || !individualId) {
        setSelectedIndividual(null)
        return
      }
      const individual = ontology.individuals.get(individualId)
      setSelectedIndividual(individual || null)
    },
    [ontology]
  )

  /**
   * Mutators follow an immutable update pattern:
   * - Clone the existing Map
   * - Apply the mutation
   * - Return a new ontology object
   *
   * This is required for React state change detection,
   * since Map mutations alone are not referentially transparent.
   */
  const addClass = useCallback((owlClass: OntologyClass) => {
    setOntology(prev => {
      if (!prev) {
        return prev
      }
      const classes = new Map(prev.classes)
      classes.set(owlClass.id, owlClass)
      return { ...prev, classes }
    })
  }, [])

  const addProperty = useCallback((property: OntologyProperty) => {
    setOntology(prev => {
      if (!prev) {
        return prev
      }
      const properties = new Map(prev.properties)
      properties.set(property.id, property)
      return { ...prev, properties }
    })
  }, [])

  const addIndividual = useCallback((individual: Individual) => {
    setOntology(prev => {
      if (!prev) {
        return prev
      }
      const individuals = new Map(prev.individuals)
      individuals.set(individual.id, individual)
      return { ...prev, individuals }
    })
  }, [])

  /**
   * Update operations merge partial updates onto existing entities.
   *
   * If the target entity does not exist, the update is ignored
   * rather than throwing, allowing callers to be optimistic.
   */
  const updateClass = useCallback((classId: string, updates: Partial<OntologyClass>) => {
    setOntology(prev => {
      if (!prev) {
        return prev
      }
      const classes = new Map(prev.classes)
      const existing = classes.get(classId)
      if (existing) {
        classes.set(classId, { ...existing, ...updates })
      }
      return { ...prev, classes }
    })
  }, [])

  const updateProperty = useCallback((propertyId: string, updates: Partial<OntologyProperty>) => {
    setOntology(prev => {
      if (!prev) {
        return prev
      }
      const properties = new Map(prev.properties)
      const existing = properties.get(propertyId)
      if (existing) {
        properties.set(propertyId, { ...existing, ...updates })
      }
      return { ...prev, properties }
    })
  }, [])

  /**
   * Delete operations remove entities by ID.
   *
   * Note: selection state is not automatically cleared here;
   * consumers are expected to re-select or reset as needed
   * based on their UI flow.
   */
  const deleteClass = useCallback((classId: string) => {
    setOntology(prev => {
      if (!prev) {
        return prev
      }
      const classes = new Map(prev.classes)
      classes.delete(classId)
      return { ...prev, classes }
    })
  }, [])

  const deleteProperty = useCallback((propertyId: string) => {
    setOntology(prev => {
      if (!prev) {
        return prev
      }
      const properties = new Map(prev.properties)
      properties.delete(propertyId)
      return { ...prev, properties }
    })
  }, [])

  return (
    <OntologyContext.Provider
      value={{
        ontology,
        selectedClass,
        selectedProperty,
        selectedIndividual,
        setOntology,
        selectClass,
        selectProperty,
        selectIndividual,
        addClass,
        addProperty,
        addIndividual,
        updateClass,
        updateProperty,
        deleteClass,
        deleteProperty,
      }}
    >
      {children}
    </OntologyContext.Provider>
  )
}

/**
 * Consumer hook with a guard to ensure correct usage.
 *
 * Throwing here provides a fast, clear failure mode during development
 * instead of silently returning undefined behavior.
 */
export function useOntology() {
  const context = useContext(OntologyContext)
  if (context === undefined) {
    throw new Error('useOntology must be used within an OntologyProvider')
  }
  return context
}
