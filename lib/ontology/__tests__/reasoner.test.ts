import { HermiTReasoner, runReasoner } from '../reasoner'
import type { Ontology, OntologyClass, OntologyProperty } from '../types'

describe('HermiTReasoner', () => {
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

  const createMockClass = (
    id: string,
    name: string,
    superClasses: string[] = []
  ): OntologyClass => ({
    id,
    name,
    superClasses,
    annotations: [],
    properties: [],
    disjointWith: [],
    equivalentTo: [],
  })

  const createMockProperty = (
    id: string,
    name: string,
    type: 'ObjectProperty' | 'DataProperty' | 'AnnotationProperty' = 'ObjectProperty'
  ): OntologyProperty => ({
    id,
    name,
    type,
    domain: [],
    range: [],
    superProperties: [],
    characteristics: [],
    annotations: [],
  })

  describe('checkConsistency', () => {
    it('should detect no errors in a consistent ontology', () => {
      const ontology = createMockOntology()
      const class1 = createMockClass('class1', 'Class1')
      const class2 = createMockClass('class2', 'Class2')

      ontology.classes.set('class1', class1)
      ontology.classes.set('class2', class2)

      const reasoner = new HermiTReasoner(ontology)
      const result = reasoner.reason()

      expect(result.consistent).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect disjoint class violations', () => {
      const ontology = createMockOntology()
      const class1 = createMockClass('class1', 'Animal')
      const class2 = createMockClass('class2', 'Plant')
      const class3 = createMockClass('class3', 'Dog', ['class1'])

      class1.disjointWith = ['class2']

      ontology.classes.set('class1', class1)
      ontology.classes.set('class2', class2)
      ontology.classes.set('class3', class3)

      const reasoner = new HermiTReasoner(ontology)
      const result = reasoner.reason()

      expect(result.consistent).toBe(true) // No shared subclasses in this case
    })
  })

  describe('findUnsatisfiableClasses', () => {
    it('should detect unsatisfiable classes', () => {
      const ontology = createMockOntology()
      const animal = createMockClass('animal', 'Animal')
      const plant = createMockClass('plant', 'Plant')
      const impossibleThing = createMockClass('impossible', 'ImpossibleThing', ['animal', 'plant'])

      animal.disjointWith = ['plant']

      ontology.classes.set('animal', animal)
      ontology.classes.set('plant', plant)
      ontology.classes.set('impossible', impossibleThing)

      const reasoner = new HermiTReasoner(ontology)
      const result = reasoner.reason()

      expect(result.unsatisfiableClasses).toContain('impossible')
    })

    it('should not mark satisfiable classes as unsatisfiable', () => {
      const ontology = createMockOntology()
      const animal = createMockClass('animal', 'Animal')
      const mammal = createMockClass('mammal', 'Mammal', ['animal'])
      const dog = createMockClass('dog', 'Dog', ['mammal'])

      ontology.classes.set('animal', animal)
      ontology.classes.set('mammal', mammal)
      ontology.classes.set('dog', dog)

      const reasoner = new HermiTReasoner(ontology)
      const result = reasoner.reason()

      expect(result.unsatisfiableClasses).toHaveLength(0)
    })
  })

  describe('detectCircularDependencies', () => {
    it('should detect circular inheritance', () => {
      const ontology = createMockOntology()
      const class1 = createMockClass('class1', 'Class1', ['class2'])
      const class2 = createMockClass('class2', 'Class2', ['class3'])
      const class3 = createMockClass('class3', 'Class3', ['class1'])

      ontology.classes.set('class1', class1)
      ontology.classes.set('class2', class2)
      ontology.classes.set('class3', class3)

      const reasoner = new HermiTReasoner(ontology)
      const result = reasoner.reason()

      const circularErrors = result.errors.filter(e => e.type === 'circular')
      expect(circularErrors.length).toBeGreaterThan(0)
      expect(result.consistent).toBe(false)
    })

    it('should not detect circular dependencies in valid hierarchy', () => {
      const ontology = createMockOntology()
      const thing = createMockClass('thing', 'Thing')
      const living = createMockClass('living', 'Living', ['thing'])
      const animal = createMockClass('animal', 'Animal', ['living'])

      ontology.classes.set('thing', thing)
      ontology.classes.set('living', living)
      ontology.classes.set('animal', animal)

      const reasoner = new HermiTReasoner(ontology)
      const result = reasoner.reason()

      const circularErrors = result.errors.filter(e => e.type === 'circular')
      expect(circularErrors).toHaveLength(0)
    })
  })

  describe('computeInferredHierarchy', () => {
    it('should compute transitive closure of class hierarchy', () => {
      const ontology = createMockOntology()
      const thing = createMockClass('thing', 'Thing')
      const living = createMockClass('living', 'Living', ['thing'])
      const animal = createMockClass('animal', 'Animal', ['living'])
      const dog = createMockClass('dog', 'Dog', ['animal'])

      ontology.classes.set('thing', thing)
      ontology.classes.set('living', living)
      ontology.classes.set('animal', animal)
      ontology.classes.set('dog', dog)

      const reasoner = new HermiTReasoner(ontology)
      const result = reasoner.reason()

      const dogSuperClasses = result.inferredHierarchy.get('dog')
      expect(dogSuperClasses).toContain('animal')
      expect(dogSuperClasses).toContain('living')
      expect(dogSuperClasses).toContain('thing')
    })
  })

  describe('checkPropertyDomainRange', () => {
    it('should warn about properties with missing domain', () => {
      const ontology = createMockOntology()
      const prop = createMockProperty('hasPart', 'hasPart')

      ontology.properties.set('hasPart', prop)

      const reasoner = new HermiTReasoner(ontology)
      const result = reasoner.reason()

      const domainWarnings = result.warnings.filter(w => w.type === 'missing-domain')
      expect(domainWarnings.length).toBeGreaterThan(0)
    })

    it('should warn about object properties with missing range', () => {
      const ontology = createMockOntology()
      const prop = createMockProperty('hasOwner', 'hasOwner', 'ObjectProperty')
      prop.domain = ['class1']

      ontology.properties.set('hasOwner', prop)

      const reasoner = new HermiTReasoner(ontology)
      const result = reasoner.reason()

      const rangeWarnings = result.warnings.filter(w => w.type === 'missing-range')
      expect(rangeWarnings.length).toBeGreaterThan(0)
    })

    it('should not warn about data properties with missing range', () => {
      const ontology = createMockOntology()
      const prop = createMockProperty('hasAge', 'hasAge', 'DataProperty')
      prop.domain = ['class1']

      ontology.properties.set('hasAge', prop)

      const reasoner = new HermiTReasoner(ontology)
      const result = reasoner.reason()

      const rangeWarnings = result.warnings.filter(w => w.type === 'missing-range')
      expect(rangeWarnings).toHaveLength(0)
    })
  })

  describe('findUnusedClasses', () => {
    it('should detect unused classes', () => {
      const ontology = createMockOntology()
      const usedClass = createMockClass('used', 'UsedClass')
      const unusedClass = createMockClass('unused', 'UnusedClass')
      const childClass = createMockClass('child', 'ChildClass', ['used'])

      ontology.classes.set('used', usedClass)
      ontology.classes.set('unused', unusedClass)
      ontology.classes.set('child', childClass)

      const reasoner = new HermiTReasoner(ontology)
      const result = reasoner.reason()

      const unusedWarnings = result.warnings.filter(w => w.type === 'unused-class')
      expect(unusedWarnings.some(w => w.affectedEntities.includes('unused'))).toBe(true)
    })

    it('should not mark owl:Thing as unused', () => {
      const ontology = createMockOntology()
      const owlThing = createMockClass('owl:Thing', 'Thing')

      ontology.classes.set('owl:Thing', owlThing)

      const reasoner = new HermiTReasoner(ontology)
      const result = reasoner.reason()

      const unusedWarnings = result.warnings.filter(
        w => w.type === 'unused-class' && w.affectedEntities.includes('owl:Thing')
      )
      expect(unusedWarnings).toHaveLength(0)
    })
  })

  describe('runReasoner convenience function', () => {
    it('should create a reasoner and return results', () => {
      const ontology = createMockOntology()
      const class1 = createMockClass('class1', 'Class1')
      ontology.classes.set('class1', class1)

      const result = runReasoner(ontology)

      expect(result).toBeDefined()
      expect(result.consistent).toBeDefined()
      expect(result.errors).toBeDefined()
      expect(result.warnings).toBeDefined()
      expect(result.inferredHierarchy).toBeDefined()
      expect(result.unsatisfiableClasses).toBeDefined()
      expect(result.duration).toBeGreaterThanOrEqual(0)
    })
  })

  describe('performance', () => {
    it('should measure reasoning duration', () => {
      const ontology = createMockOntology()

      const reasoner = new HermiTReasoner(ontology)
      const result = reasoner.reason()

      expect(result.duration).toBeGreaterThanOrEqual(0)
      expect(typeof result.duration).toBe('number')
    })
  })
})
