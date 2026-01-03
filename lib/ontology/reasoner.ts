import type { Ontology } from "./types"

export type ReasoningResult = {
  consistent: boolean
  errors: ReasoningError[]
  warnings: ReasoningWarning[]
  inferredHierarchy: Map<string, string[]>
  unsatisfiableClasses: string[]
  duration: number
}

export type ReasoningError = {
  type: "inconsistency" | "unsatisfiable" | "circular"
  message: string
  affectedEntities: string[]
}

export type ReasoningWarning = {
  type: "missing-domain" | "missing-range" | "unused-class" | "redundant"
  message: string
  affectedEntities: string[]
}

export class HermiTReasoner {
  private ontology: Ontology

  constructor(ontology: Ontology) {
    this.ontology = ontology
  }

  // Main reasoning entry point
  reason(): ReasoningResult {
    const startTime = performance.now()
    const errors: ReasoningError[] = []
    const warnings: ReasoningWarning[] = []
    const unsatisfiableClasses: string[] = []

    // Check ontology consistency
    const consistencyErrors = this.checkConsistency()
    errors.push(...consistencyErrors)

    // Check for unsatisfiable classes
    const unsatisfiable = this.findUnsatisfiableClasses()
    unsatisfiableClasses.push(...unsatisfiable)

    // Check for circular dependencies
    const circularErrors = this.detectCircularDependencies()
    errors.push(...circularErrors)

    // Compute inferred class hierarchy
    const inferredHierarchy = this.computeInferredHierarchy()

    // Generate warnings
    const propertyWarnings = this.checkPropertyDomainRange()
    warnings.push(...propertyWarnings)

    const unusedWarnings = this.findUnusedClasses()
    warnings.push(...unusedWarnings)

    const duration = performance.now() - startTime

    return {
      consistent: errors.length === 0,
      errors,
      warnings,
      inferredHierarchy,
      unsatisfiableClasses,
      duration,
    }
  }

  // Check for disjoint class violations
  private checkConsistency(): ReasoningError[] {
    const errors: ReasoningError[] = []

    for (const [classId, owlClass] of this.ontology.classes) {
      // Check if class has disjoint violations
      if (owlClass.disjointWith.length > 0) {
        for (const disjointId of owlClass.disjointWith) {
          const disjointClass = this.ontology.classes.get(disjointId)
          if (!disjointClass) continue

          // Check if classes share subclasses (violation)
          const sharedSubclasses = this.findSharedSubclasses(classId, disjointId)
          if (sharedSubclasses.length > 0) {
            errors.push({
              type: "inconsistency",
              message: `Classes ${owlClass.name} and ${disjointClass.name} are disjoint but share subclasses`,
              affectedEntities: [classId, disjointId, ...sharedSubclasses],
            })
          }
        }
      }
    }

    return errors
  }

  // Find classes that cannot have instances (unsatisfiable)
  private findUnsatisfiableClasses(): string[] {
    const unsatisfiable: string[] = []

    for (const [classId, owlClass] of this.ontology.classes) {
      // A class is unsatisfiable if it inherits from disjoint classes
      const superClasses = this.getAllSuperClasses(classId)

      for (let i = 0; i < superClasses.length; i++) {
        for (let j = i + 1; j < superClasses.length; j++) {
          const class1 = this.ontology.classes.get(superClasses[i])
          const class2 = this.ontology.classes.get(superClasses[j])

          if (class1?.disjointWith.includes(superClasses[j]) || class2?.disjointWith.includes(superClasses[i])) {
            unsatisfiable.push(classId)
            break
          }
        }
        if (unsatisfiable.includes(classId)) break
      }
    }

    return unsatisfiable
  }

  // Detect circular inheritance dependencies
  private detectCircularDependencies(): ReasoningError[] {
    const errors: ReasoningError[] = []
    const visited = new Set<string>()
    const recursionStack = new Set<string>()

    const dfs = (classId: string, path: string[]): boolean => {
      visited.add(classId)
      recursionStack.add(classId)

      const owlClass = this.ontology.classes.get(classId)
      if (!owlClass) return false

      for (const superClassId of owlClass.superClasses) {
        if (!visited.has(superClassId)) {
          if (dfs(superClassId, [...path, classId])) {
            return true
          }
        } else if (recursionStack.has(superClassId)) {
          // Found a cycle
          const cycle = [...path, classId, superClassId]
          errors.push({
            type: "circular",
            message: `Circular inheritance detected: ${cycle.map((id) => this.ontology.classes.get(id)?.name).join(" → ")}`,
            affectedEntities: cycle,
          })
          return true
        }
      }

      recursionStack.delete(classId)
      return false
    }

    for (const classId of this.ontology.classes.keys()) {
      if (!visited.has(classId)) {
        dfs(classId, [])
      }
    }

    return errors
  }

  // Compute inferred class hierarchy using transitive closure
  private computeInferredHierarchy(): Map<string, string[]> {
    const inferred = new Map<string, string[]>()

    for (const [classId] of this.ontology.classes) {
      const allSuperClasses = this.getAllSuperClasses(classId)
      inferred.set(classId, allSuperClasses)
    }

    return inferred
  }

  // Check for property domain/range consistency
  private checkPropertyDomainRange(): ReasoningWarning[] {
    const warnings: ReasoningWarning[] = []

    for (const [propId, property] of this.ontology.properties) {
      if (property.domain.length === 0) {
        warnings.push({
          type: "missing-domain",
          message: `Property ${property.name} has no domain specified`,
          affectedEntities: [propId],
        })
      }

      if (property.range.length === 0 && property.type === "ObjectProperty") {
        warnings.push({
          type: "missing-range",
          message: `Object property ${property.name} has no range specified`,
          affectedEntities: [propId],
        })
      }
    }

    return warnings
  }

  // Find classes that are defined but never used
  private findUnusedClasses(): ReasoningWarning[] {
    const warnings: ReasoningWarning[] = []
    const usedClasses = new Set<string>()

    // Mark classes used as super classes
    for (const owlClass of this.ontology.classes.values()) {
      owlClass.superClasses.forEach((id) => usedClasses.add(id))
      owlClass.disjointWith.forEach((id) => usedClasses.add(id))
      owlClass.equivalentTo.forEach((id) => usedClasses.add(id))
    }

    // Mark classes used in property domains/ranges
    for (const property of this.ontology.properties.values()) {
      property.domain.forEach((id) => usedClasses.add(id))
      property.range.forEach((id) => usedClasses.add(id))
    }

    // Mark classes used by individuals
    for (const individual of this.ontology.individuals.values()) {
      individual.types.forEach((id) => usedClasses.add(id))
    }

    // Find unused classes (excluding owl:Thing)
    for (const [classId, owlClass] of this.ontology.classes) {
      if (!usedClasses.has(classId) && classId !== "owl:Thing") {
        warnings.push({
          type: "unused-class",
          message: `Class ${owlClass.name} is defined but never used`,
          affectedEntities: [classId],
        })
      }
    }

    return warnings
  }

  // Helper: Get all superclasses (transitive closure)
  private getAllSuperClasses(classId: string): string[] {
    const result = new Set<string>()
    const visited = new Set<string>()

    const traverse = (id: string):void => {
      if (visited.has(id)) return
      visited.add(id)

      const owlClass = this.ontology.classes.get(id)
      if (!owlClass) return

      for (const superClassId of owlClass.superClasses) {
        result.add(superClassId)
        traverse(superClassId)
      }
    }

    traverse(classId)
    return Array.from(result)
  }

  // Helper: Find subclasses shared between two classes
  private findSharedSubclasses(classId1: string, classId2: string): string[] {
    const subclasses1 = this.getAllSubClasses(classId1)
    const subclasses2 = this.getAllSubClasses(classId2)

    return subclasses1.filter((id) => subclasses2.includes(id))
  }

  // Helper: Get all subclasses
  private getAllSubClasses(classId: string): string[] {
    const result: string[] = []

    for (const [id, owlClass] of this.ontology.classes) {
      if (owlClass.superClasses.includes(classId)) {
        result.push(id)
        result.push(...this.getAllSubClasses(id))
      }
    }

    return result
  }
}

// Convenience function to run reasoner
export function runReasoner(ontology: Ontology): ReasoningResult {
  const reasoner = new HermiTReasoner(ontology)
  return reasoner.reason()
}
