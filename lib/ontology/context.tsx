"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { Ontology, OntologyClass, OntologyProperty, Individual } from "./types"

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

const OntologyContext = createContext<OntologyContextType | undefined>(undefined)

export function OntologyProvider({ children }: { children: React.ReactNode }) {
  const [ontology, setOntology] = useState<Ontology | null>(null)
  const [selectedClass, setSelectedClass] = useState<OntologyClass | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<OntologyProperty | null>(null)
  const [selectedIndividual, setSelectedIndividual] = useState<Individual | null>(null)

  const selectClass = useCallback(
    (classId: string | null) => {
      if (!ontology || !classId) {
        setSelectedClass(null)
        return
      }
      const owlClass = ontology.classes.get(classId)
      setSelectedClass(owlClass || null)
    },
    [ontology],
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
    [ontology],
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
    [ontology],
  )

  const addClass = useCallback((owlClass: OntologyClass) => {
    setOntology((prev) => {
      if (!prev) return prev
      const classes = new Map(prev.classes)
      classes.set(owlClass.id, owlClass)
      return { ...prev, classes }
    })
  }, [])

  const addProperty = useCallback((property: OntologyProperty) => {
    setOntology((prev) => {
      if (!prev) return prev
      const properties = new Map(prev.properties)
      properties.set(property.id, property)
      return { ...prev, properties }
    })
  }, [])

  const addIndividual = useCallback((individual: Individual) => {
    setOntology((prev) => {
      if (!prev) return prev
      const individuals = new Map(prev.individuals)
      individuals.set(individual.id, individual)
      return { ...prev, individuals }
    })
  }, [])

  const updateClass = useCallback((classId: string, updates: Partial<OntologyClass>) => {
    setOntology((prev) => {
      if (!prev) return prev
      const classes = new Map(prev.classes)
      const existing = classes.get(classId)
      if (existing) {
        classes.set(classId, { ...existing, ...updates })
      }
      return { ...prev, classes }
    })
  }, [])

  const updateProperty = useCallback((propertyId: string, updates: Partial<OntologyProperty>) => {
    setOntology((prev) => {
      if (!prev) return prev
      const properties = new Map(prev.properties)
      const existing = properties.get(propertyId)
      if (existing) {
        properties.set(propertyId, { ...existing, ...updates })
      }
      return { ...prev, properties }
    })
  }, [])

  const deleteClass = useCallback((classId: string) => {
    setOntology((prev) => {
      if (!prev) return prev
      const classes = new Map(prev.classes)
      classes.delete(classId)
      return { ...prev, classes }
    })
  }, [])

  const deleteProperty = useCallback((propertyId: string) => {
    setOntology((prev) => {
      if (!prev) return prev
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

export function useOntology() {
  const context = useContext(OntologyContext)
  if (context === undefined) {
    throw new Error("useOntology must be used within an OntologyProvider")
  }
  return context
}
