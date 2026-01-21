import { calculateOntologyMetrics } from '../metrics'
import type { Ontology, OntologyClass, OntologyProperty, Individual } from '../types'

describe('calculateOntologyMetrics', () => {
  it('should return all zeros for null ontology', () => {
    const metrics = calculateOntologyMetrics(null)

    expect(metrics).toEqual({
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
    })
  })

  it('should return all zeros for empty ontology', () => {
    const emptyOntology: Ontology = {
      id: 'empty',
      name: 'Empty Ontology',
      imports: [],
      classes: new Map(),
      properties: new Map(),
      individuals: new Map(),
      annotations: [],
    }

    const metrics = calculateOntologyMetrics(emptyOntology)

    expect(metrics.classCount).toBe(0)
    expect(metrics.objectPropertyCount).toBe(0)
    expect(metrics.dataPropertyCount).toBe(0)
    expect(metrics.annotationPropertyCount).toBe(0)
    expect(metrics.individualCount).toBe(0)
    expect(metrics.axiomCount).toBe(0)
    expect(metrics.logicalAxiomCount).toBe(0)
    expect(metrics.declarationAxiomCount).toBe(0)
  })

  describe('entity counts', () => {
    it('should count classes correctly', () => {
      const ontology = createOntologyWithClasses(3)
      const metrics = calculateOntologyMetrics(ontology)
      expect(metrics.classCount).toBe(3)
    })

    it('should count object properties correctly', () => {
      const ontology = createOntologyWithProperties([
        { type: 'ObjectProperty' },
        { type: 'ObjectProperty' },
        { type: 'DataProperty' },
      ])
      const metrics = calculateOntologyMetrics(ontology)
      expect(metrics.objectPropertyCount).toBe(2)
    })

    it('should count data properties correctly', () => {
      const ontology = createOntologyWithProperties([
        { type: 'DataProperty' },
        { type: 'DataProperty' },
        { type: 'ObjectProperty' },
      ])
      const metrics = calculateOntologyMetrics(ontology)
      expect(metrics.dataPropertyCount).toBe(2)
    })

    it('should count annotation properties correctly', () => {
      const ontology = createOntologyWithProperties([
        { type: 'AnnotationProperty' },
        { type: 'AnnotationProperty' },
        { type: 'DataProperty' },
      ])
      const metrics = calculateOntologyMetrics(ontology)
      expect(metrics.annotationPropertyCount).toBe(2)
    })

    it('should count individuals correctly', () => {
      const ontology = createOntologyWithIndividuals(5)
      const metrics = calculateOntologyMetrics(ontology)
      expect(metrics.individualCount).toBe(5)
    })
  })

  describe('declaration axiom count', () => {
    it('should count declaration axioms as sum of all entities', () => {
      const ontology: Ontology = {
        id: 'test',
        name: 'Test',
        imports: [],
        classes: new Map([
          ['Class1', createClass('Class1')],
          ['Class2', createClass('Class2')],
        ]),
        properties: new Map([
          ['prop1', createProperty('prop1', 'ObjectProperty')],
          ['prop2', createProperty('prop2', 'DataProperty')],
          ['prop3', createProperty('prop3', 'AnnotationProperty')],
        ]),
        individuals: new Map([['ind1', createIndividual('ind1')]]),
        annotations: [],
      }

      const metrics = calculateOntologyMetrics(ontology)
      // 2 classes + 3 properties + 1 individual = 6 declaration axioms
      expect(metrics.declarationAxiomCount).toBe(6)
    })
  })

  describe('class axiom counts', () => {
    it('should count SubClassOf axioms', () => {
      const ontology: Ontology = {
        id: 'test',
        name: 'Test',
        imports: [],
        classes: new Map([
          ['Class1', createClass('Class1', { superClasses: ['Parent1', 'Parent2'] })],
          ['Class2', createClass('Class2', { superClasses: ['Parent1'] })],
          ['Class3', createClass('Class3', { superClasses: [] })],
        ]),
        properties: new Map(),
        individuals: new Map(),
        annotations: [],
      }

      const metrics = calculateOntologyMetrics(ontology)
      // Class1: 2 + Class2: 1 + Class3: 0 = 3
      expect(metrics.subClassOfAxiomCount).toBe(3)
    })

    it('should count EquivalentClasses axioms', () => {
      const ontology: Ontology = {
        id: 'test',
        name: 'Test',
        imports: [],
        classes: new Map([
          ['Class1', createClass('Class1', { equivalentTo: ['EquivA', 'EquivB'] })],
          ['Class2', createClass('Class2', { equivalentTo: ['EquivC'] })],
        ]),
        properties: new Map(),
        individuals: new Map(),
        annotations: [],
      }

      const metrics = calculateOntologyMetrics(ontology)
      // Class1: 2 + Class2: 1 = 3
      expect(metrics.equivalentClassesAxiomCount).toBe(3)
    })

    it('should count DisjointClasses axioms', () => {
      const ontology: Ontology = {
        id: 'test',
        name: 'Test',
        imports: [],
        classes: new Map([
          ['Class1', createClass('Class1', { disjointWith: ['DisjA'] })],
          ['Class2', createClass('Class2', { disjointWith: ['DisjB', 'DisjC', 'DisjD'] })],
        ]),
        properties: new Map(),
        individuals: new Map(),
        annotations: [],
      }

      const metrics = calculateOntologyMetrics(ontology)
      // Class1: 1 + Class2: 3 = 4
      expect(metrics.disjointClassesAxiomCount).toBe(4)
    })
  })

  describe('logical axiom count', () => {
    it('should include class axioms in logical axiom count', () => {
      const ontology: Ontology = {
        id: 'test',
        name: 'Test',
        imports: [],
        classes: new Map([
          [
            'Class1',
            createClass('Class1', {
              superClasses: ['Parent'],
              equivalentTo: ['Equiv'],
              disjointWith: ['Disj'],
            }),
          ],
        ]),
        properties: new Map(),
        individuals: new Map(),
        annotations: [],
      }

      const metrics = calculateOntologyMetrics(ontology)
      // 1 subClassOf + 1 equivalent + 1 disjoint = 3
      expect(metrics.logicalAxiomCount).toBe(3)
    })

    it('should include property axioms in logical axiom count', () => {
      const ontology: Ontology = {
        id: 'test',
        name: 'Test',
        imports: [],
        classes: new Map(),
        properties: new Map([
          [
            'prop1',
            createProperty('prop1', 'ObjectProperty', {
              domain: ['Class1', 'Class2'],
              range: ['Class3'],
              superProperties: ['parentProp'],
              characteristics: ['Transitive', 'Symmetric'],
              inverse: 'inverseProp',
            }),
          ],
        ]),
        individuals: new Map(),
        annotations: [],
      }

      const metrics = calculateOntologyMetrics(ontology)
      // domain: 2 + range: 1 + superProperties: 1 + characteristics: 2 + inverse: 1 = 7
      expect(metrics.logicalAxiomCount).toBe(7)
    })

    it('should include individual axioms in logical axiom count', () => {
      const ontology: Ontology = {
        id: 'test',
        name: 'Test',
        imports: [],
        classes: new Map(),
        properties: new Map(),
        individuals: new Map([
          [
            'ind1',
            createIndividual('ind1', {
              types: ['Type1', 'Type2'],
              propertyAssertions: [
                { property: 'hasName', value: 'John' },
                { property: 'hasAge', value: 30 },
              ],
              sameAs: ['ind2'],
              differentFrom: ['ind3', 'ind4'],
            }),
          ],
        ]),
        annotations: [],
      }

      const metrics = calculateOntologyMetrics(ontology)
      // types: 2 + propertyAssertions: 2 + sameAs: 1 + differentFrom: 2 = 7
      expect(metrics.logicalAxiomCount).toBe(7)
    })
  })

  describe('total axiom count', () => {
    it('should be sum of logical axioms and declaration axioms', () => {
      const ontology: Ontology = {
        id: 'test',
        name: 'Test',
        imports: [],
        classes: new Map([['Class1', createClass('Class1', { superClasses: ['Parent'] })]]),
        properties: new Map([
          ['prop1', createProperty('prop1', 'ObjectProperty', { domain: ['Class1'] })],
        ]),
        individuals: new Map([['ind1', createIndividual('ind1', { types: ['Class1'] })]]),
        annotations: [],
      }

      const metrics = calculateOntologyMetrics(ontology)

      // Declaration axioms: 1 class + 1 property + 1 individual = 3
      expect(metrics.declarationAxiomCount).toBe(3)

      // Logical axioms: 1 subClassOf + 1 domain + 1 type = 3
      expect(metrics.logicalAxiomCount).toBe(3)

      // Total: 3 + 3 = 6
      expect(metrics.axiomCount).toBe(6)
    })
  })

  describe('annotation count', () => {
    it('should count ontology-level annotations', () => {
      const ontology: Ontology = {
        id: 'test',
        name: 'Test',
        imports: [],
        classes: new Map(),
        properties: new Map(),
        individuals: new Map(),
        annotations: [
          { property: 'rdfs:comment', value: 'Test ontology' },
          { property: 'rdfs:label', value: 'Test' },
        ],
      }

      const metrics = calculateOntologyMetrics(ontology)
      expect(metrics.annotationCount).toBe(2)
    })

    it('should count class annotations', () => {
      const ontology: Ontology = {
        id: 'test',
        name: 'Test',
        imports: [],
        classes: new Map([
          [
            'Class1',
            createClass('Class1', {
              annotations: [
                { property: 'rdfs:comment', value: 'A class' },
                { property: 'rdfs:label', value: 'Class 1' },
              ],
            }),
          ],
        ]),
        properties: new Map(),
        individuals: new Map(),
        annotations: [],
      }

      const metrics = calculateOntologyMetrics(ontology)
      expect(metrics.annotationCount).toBe(2)
    })

    it('should count property annotations', () => {
      const ontology: Ontology = {
        id: 'test',
        name: 'Test',
        imports: [],
        classes: new Map(),
        properties: new Map([
          [
            'prop1',
            createProperty('prop1', 'ObjectProperty', {
              annotations: [{ property: 'rdfs:comment', value: 'A property' }],
            }),
          ],
        ]),
        individuals: new Map(),
        annotations: [],
      }

      const metrics = calculateOntologyMetrics(ontology)
      expect(metrics.annotationCount).toBe(1)
    })

    it('should count individual annotations', () => {
      const ontology: Ontology = {
        id: 'test',
        name: 'Test',
        imports: [],
        classes: new Map(),
        properties: new Map(),
        individuals: new Map([
          [
            'ind1',
            createIndividual('ind1', {
              annotations: [
                { property: 'rdfs:comment', value: 'An individual' },
                { property: 'rdfs:seeAlso', value: 'http://example.org' },
              ],
            }),
          ],
        ]),
        annotations: [],
      }

      const metrics = calculateOntologyMetrics(ontology)
      expect(metrics.annotationCount).toBe(2)
    })

    it('should count all annotations from all sources', () => {
      const ontology: Ontology = {
        id: 'test',
        name: 'Test',
        imports: [],
        classes: new Map([
          ['Class1', createClass('Class1', { annotations: [{ property: 'a', value: '1' }] })],
        ]),
        properties: new Map([
          [
            'prop1',
            createProperty('prop1', 'ObjectProperty', {
              annotations: [
                { property: 'b', value: '2' },
                { property: 'c', value: '3' },
              ],
            }),
          ],
        ]),
        individuals: new Map([
          ['ind1', createIndividual('ind1', { annotations: [{ property: 'd', value: '4' }] })],
        ]),
        annotations: [
          { property: 'e', value: '5' },
          { property: 'f', value: '6' },
        ],
      }

      const metrics = calculateOntologyMetrics(ontology)
      // ontology: 2 + class: 1 + property: 2 + individual: 1 = 6
      expect(metrics.annotationCount).toBe(6)
    })
  })

  describe('complex ontology', () => {
    it('should calculate all metrics correctly for a complex ontology', () => {
      const ontology = createComplexOntology()
      const metrics = calculateOntologyMetrics(ontology)

      // Entity counts
      expect(metrics.classCount).toBe(4)
      expect(metrics.objectPropertyCount).toBe(2)
      expect(metrics.dataPropertyCount).toBe(1)
      expect(metrics.annotationPropertyCount).toBe(0)
      expect(metrics.individualCount).toBe(2)

      // Declaration axioms: 4 classes + 3 properties + 2 individuals = 9
      expect(metrics.declarationAxiomCount).toBe(9)

      // Class axioms:
      // Person: 1 superClass
      // Student: 1 superClass
      // Teacher: 1 superClass, 1 disjoint
      // Course: 0
      expect(metrics.subClassOfAxiomCount).toBe(3)
      expect(metrics.equivalentClassesAxiomCount).toBe(0)
      expect(metrics.disjointClassesAxiomCount).toBe(1)

      // Verify total axiom count is sum of logical + declaration
      expect(metrics.axiomCount).toBe(metrics.logicalAxiomCount + metrics.declarationAxiomCount)
    })
  })
})

// Helper functions to create test data

function createClass(id: string, options: Partial<OntologyClass> = {}): OntologyClass {
  return {
    id,
    name: id,
    superClasses: [],
    properties: [],
    disjointWith: [],
    equivalentTo: [],
    annotations: [],
    ...options,
  }
}

function createProperty(
  id: string,
  type: 'ObjectProperty' | 'DataProperty' | 'AnnotationProperty',
  options: Partial<OntologyProperty> = {}
): OntologyProperty {
  return {
    id,
    name: id,
    type,
    domain: [],
    range: [],
    superProperties: [],
    characteristics: [],
    annotations: [],
    ...options,
  }
}

function createIndividual(id: string, options: Partial<Individual> = {}): Individual {
  return {
    id,
    name: id,
    types: [],
    propertyAssertions: [],
    annotations: [],
    sameAs: [],
    differentFrom: [],
    ...options,
  }
}

function createOntologyWithClasses(count: number): Ontology {
  const classes = new Map<string, OntologyClass>()
  for (let i = 0; i < count; i++) {
    const id = `Class${i}`
    classes.set(id, createClass(id))
  }
  return {
    id: 'test',
    name: 'Test',
    imports: [],
    classes,
    properties: new Map(),
    individuals: new Map(),
    annotations: [],
  }
}

function createOntologyWithProperties(
  propConfigs: Array<{ type: 'ObjectProperty' | 'DataProperty' | 'AnnotationProperty' }>
): Ontology {
  const properties = new Map<string, OntologyProperty>()
  propConfigs.forEach((config, i) => {
    const id = `prop${i}`
    properties.set(id, createProperty(id, config.type))
  })
  return {
    id: 'test',
    name: 'Test',
    imports: [],
    classes: new Map(),
    properties,
    individuals: new Map(),
    annotations: [],
  }
}

function createOntologyWithIndividuals(count: number): Ontology {
  const individuals = new Map<string, Individual>()
  for (let i = 0; i < count; i++) {
    const id = `ind${i}`
    individuals.set(id, createIndividual(id))
  }
  return {
    id: 'test',
    name: 'Test',
    imports: [],
    classes: new Map(),
    properties: new Map(),
    individuals,
    annotations: [],
  }
}

function createComplexOntology(): Ontology {
  return {
    id: 'http://example.org/university',
    name: 'University Ontology',
    imports: [],
    classes: new Map<string, OntologyClass>([
      ['Person', createClass('Person', { superClasses: ['Thing'] })],
      ['Student', createClass('Student', { superClasses: ['Person'] })],
      [
        'Teacher',
        createClass('Teacher', {
          superClasses: ['Person'],
          disjointWith: ['Student'],
        }),
      ],
      ['Course', createClass('Course')],
    ]),
    properties: new Map<string, OntologyProperty>([
      [
        'teaches',
        createProperty('teaches', 'ObjectProperty', {
          domain: ['Teacher'],
          range: ['Course'],
        }),
      ],
      [
        'enrolledIn',
        createProperty('enrolledIn', 'ObjectProperty', {
          domain: ['Student'],
          range: ['Course'],
        }),
      ],
      [
        'hasName',
        createProperty('hasName', 'DataProperty', {
          domain: ['Person'],
          range: ['xsd:string'],
        }),
      ],
    ]),
    individuals: new Map<string, Individual>([
      [
        'john',
        createIndividual('john', {
          types: ['Student'],
          propertyAssertions: [{ property: 'hasName', value: 'John Doe' }],
        }),
      ],
      [
        'jane',
        createIndividual('jane', {
          types: ['Teacher'],
          propertyAssertions: [{ property: 'hasName', value: 'Jane Smith' }],
        }),
      ],
    ]),
    annotations: [{ property: 'rdfs:comment', value: 'University domain ontology' }],
  }
}
