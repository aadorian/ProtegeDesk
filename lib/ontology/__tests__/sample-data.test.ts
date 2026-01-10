import { createSampleOntology } from '../sample-data'

describe('Sample Data Generator', () => {
  describe('createSampleOntology', () => {
    it('should create a valid ontology structure', () => {
      const ontology = createSampleOntology()

      expect(ontology).toBeDefined()
      expect(ontology.id).toBe('http://example.org/ontology')
      expect(ontology.name).toBe('Example Ontology')
      expect(ontology.version).toBe('1.0.0')
    })

    it('should have correct metadata', () => {
      const ontology = createSampleOntology()

      expect(ontology.annotations).toHaveLength(2)
      expect(ontology.annotations[0]).toEqual({
        property: 'rdfs:label',
        value: 'Example Ontology',
      })
      expect(ontology.annotations[1]).toEqual({
        property: 'rdfs:comment',
        value: 'A sample ontology for demonstration',
      })
    })

    it('should initialize with empty imports', () => {
      const ontology = createSampleOntology()

      expect(ontology.imports).toEqual([])
    })
  })

  describe('Classes', () => {
    it('should create all expected classes', () => {
      const ontology = createSampleOntology()

      expect(ontology.classes.size).toBe(4)
      expect(ontology.classes.has('owl:Thing')).toBe(true)
      expect(ontology.classes.has('Person')).toBe(true)
      expect(ontology.classes.has('Organization')).toBe(true)
      expect(ontology.classes.has('Employee')).toBe(true)
    })

    it('should create Thing as root class', () => {
      const ontology = createSampleOntology()
      const thing = ontology.classes.get('owl:Thing')

      expect(thing).toBeDefined()
      expect(thing?.name).toBe('Thing')
      expect(thing?.label).toBe('Thing')
      expect(thing?.description).toBe('The root class of all classes')
      expect(thing?.superClasses).toEqual([])
    })

    it('should create Person class correctly', () => {
      const ontology = createSampleOntology()
      const person = ontology.classes.get('Person')

      expect(person).toBeDefined()
      expect(person?.name).toBe('Person')
      expect(person?.label).toBe('Person')
      expect(person?.description).toBe('A human being')
      expect(person?.superClasses).toEqual(['owl:Thing'])
    })

    it('should set Person properties correctly', () => {
      const ontology = createSampleOntology()
      const person = ontology.classes.get('Person')

      expect(person?.properties).toEqual(['hasName', 'hasAge', 'hasEmail'])
    })

    it('should set Person disjoint with Organization', () => {
      const ontology = createSampleOntology()
      const person = ontology.classes.get('Person')

      expect(person?.disjointWith).toEqual(['Organization'])
    })

    it('should create Organization class correctly', () => {
      const ontology = createSampleOntology()
      const organization = ontology.classes.get('Organization')

      expect(organization).toBeDefined()
      expect(organization?.name).toBe('Organization')
      expect(organization?.description).toBe('An organized group')
      expect(organization?.superClasses).toEqual(['owl:Thing'])
    })

    it('should set Organization properties correctly', () => {
      const ontology = createSampleOntology()
      const organization = ontology.classes.get('Organization')

      expect(organization?.properties).toEqual(['hasName', 'foundedIn'])
    })

    it('should set Organization disjoint with Person', () => {
      const ontology = createSampleOntology()
      const organization = ontology.classes.get('Organization')

      expect(organization?.disjointWith).toEqual(['Person'])
    })

    it('should create Employee as subclass of Person', () => {
      const ontology = createSampleOntology()
      const employee = ontology.classes.get('Employee')

      expect(employee).toBeDefined()
      expect(employee?.name).toBe('Employee')
      expect(employee?.description).toBe('A person employed by an organization')
      expect(employee?.superClasses).toEqual(['Person'])
    })

    it('should set Employee properties correctly', () => {
      const ontology = createSampleOntology()
      const employee = ontology.classes.get('Employee')

      expect(employee?.properties).toEqual(['worksFor', 'hasJobTitle'])
    })

    it('should set Person annotation correctly', () => {
      const ontology = createSampleOntology()
      const person = ontology.classes.get('Person')

      expect(person?.annotations).toHaveLength(1)
      expect(person?.annotations[0]).toEqual({
        property: 'rdfs:comment',
        value: 'Represents a human person',
      })
    })

    it('should set Organization annotation correctly', () => {
      const ontology = createSampleOntology()
      const organization = ontology.classes.get('Organization')

      expect(organization?.annotations).toHaveLength(1)
      expect(organization?.annotations[0]).toEqual({
        property: 'rdfs:comment',
        value: 'Represents an organization',
      })
    })
  })

  describe('Properties', () => {
    it('should create all expected properties', () => {
      const ontology = createSampleOntology()

      expect(ontology.properties.size).toBe(3)
      expect(ontology.properties.has('hasName')).toBe(true)
      expect(ontology.properties.has('hasAge')).toBe(true)
      expect(ontology.properties.has('worksFor')).toBe(true)
    })

    it('should create hasName data property', () => {
      const ontology = createSampleOntology()
      const hasName = ontology.properties.get('hasName')

      expect(hasName).toBeDefined()
      expect(hasName?.name).toBe('hasName')
      expect(hasName?.label).toBe('has name')
      expect(hasName?.type).toBe('DataProperty')
    })

    it('should set hasName domain and range', () => {
      const ontology = createSampleOntology()
      const hasName = ontology.properties.get('hasName')

      expect(hasName?.domain).toEqual(['owl:Thing'])
      expect(hasName?.range).toEqual(['xsd:string'])
    })

    it('should set hasName as functional', () => {
      const ontology = createSampleOntology()
      const hasName = ontology.properties.get('hasName')

      expect(hasName?.characteristics).toEqual(['Functional'])
    })

    it('should set hasName annotation', () => {
      const ontology = createSampleOntology()
      const hasName = ontology.properties.get('hasName')

      expect(hasName?.annotations).toHaveLength(1)
      expect(hasName?.annotations[0]).toEqual({
        property: 'rdfs:comment',
        value: 'The name of an entity',
      })
    })

    it('should create hasAge data property', () => {
      const ontology = createSampleOntology()
      const hasAge = ontology.properties.get('hasAge')

      expect(hasAge).toBeDefined()
      expect(hasAge?.name).toBe('hasAge')
      expect(hasAge?.label).toBe('has age')
      expect(hasAge?.type).toBe('DataProperty')
    })

    it('should set hasAge domain and range', () => {
      const ontology = createSampleOntology()
      const hasAge = ontology.properties.get('hasAge')

      expect(hasAge?.domain).toEqual(['Person'])
      expect(hasAge?.range).toEqual(['xsd:integer'])
    })

    it('should set hasAge as functional', () => {
      const ontology = createSampleOntology()
      const hasAge = ontology.properties.get('hasAge')

      expect(hasAge?.characteristics).toEqual(['Functional'])
    })

    it('should create worksFor object property', () => {
      const ontology = createSampleOntology()
      const worksFor = ontology.properties.get('worksFor')

      expect(worksFor).toBeDefined()
      expect(worksFor?.name).toBe('worksFor')
      expect(worksFor?.label).toBe('works for')
      expect(worksFor?.type).toBe('ObjectProperty')
    })

    it('should set worksFor domain and range', () => {
      const ontology = createSampleOntology()
      const worksFor = ontology.properties.get('worksFor')

      expect(worksFor?.domain).toEqual(['Employee'])
      expect(worksFor?.range).toEqual(['Organization'])
    })

    it('should set worksFor annotation', () => {
      const ontology = createSampleOntology()
      const worksFor = ontology.properties.get('worksFor')

      expect(worksFor?.annotations).toHaveLength(1)
      expect(worksFor?.annotations[0]).toEqual({
        property: 'rdfs:comment',
        value: 'Relates an employee to their employer',
      })
    })

    it('should not set characteristics for worksFor', () => {
      const ontology = createSampleOntology()
      const worksFor = ontology.properties.get('worksFor')

      expect(worksFor?.characteristics).toEqual([])
    })
  })

  describe('Individuals', () => {
    it('should create all expected individuals', () => {
      const ontology = createSampleOntology()

      expect(ontology.individuals.size).toBe(4)
      expect(ontology.individuals.has('john_doe')).toBe(true)
      expect(ontology.individuals.has('jane_smith')).toBe(true)
      expect(ontology.individuals.has('acme_corp')).toBe(true)
      expect(ontology.individuals.has('alice_johnson')).toBe(true)
    })

    it('should create John Doe individual', () => {
      const ontology = createSampleOntology()
      const john = ontology.individuals.get('john_doe')

      expect(john).toBeDefined()
      expect(john?.name).toBe('john_doe')
      expect(john?.label).toBe('John Doe')
    })

    it('should set John Doe as Employee type', () => {
      const ontology = createSampleOntology()
      const john = ontology.individuals.get('john_doe')

      expect(john?.types).toEqual(['Employee'])
    })

    it('should set John Doe property assertions', () => {
      const ontology = createSampleOntology()
      const john = ontology.individuals.get('john_doe')

      expect(john?.propertyAssertions).toHaveLength(3)
      expect(john?.propertyAssertions).toContainEqual({
        property: 'hasName',
        value: 'John Doe',
        datatype: 'xsd:string',
      })
      expect(john?.propertyAssertions).toContainEqual({
        property: 'hasAge',
        value: 30,
        datatype: 'xsd:integer',
      })
      expect(john?.propertyAssertions).toContainEqual({
        property: 'worksFor',
        value: 'acme_corp',
      })
    })

    it('should initialize John Doe with sameAs and differentFrom', () => {
      const ontology = createSampleOntology()
      const john = ontology.individuals.get('john_doe')

      expect(john?.sameAs).toEqual([])
      expect(john?.differentFrom).toEqual(['jane_smith'])
    })

    it('should initialize John Doe with annotations', () => {
      const ontology = createSampleOntology()
      const john = ontology.individuals.get('john_doe')

      expect(john?.annotations).toEqual([
        { property: 'rdfs:comment', value: 'Software engineer at ACME Corp' },
      ])
    })
  })

  describe('Consistency', () => {
    it('should maintain consistency between multiple calls', () => {
      const ontology1 = createSampleOntology()
      const ontology2 = createSampleOntology()

      expect(ontology1.classes.size).toBe(ontology2.classes.size)
      expect(ontology1.properties.size).toBe(ontology2.properties.size)
      expect(ontology1.individuals.size).toBe(ontology2.individuals.size)
    })

    it('should create independent instances', () => {
      const ontology1 = createSampleOntology()
      const ontology2 = createSampleOntology()

      // Modify ontology1
      ontology1.classes.delete('Person')

      // ontology2 should be unaffected
      expect(ontology2.classes.has('Person')).toBe(true)
    })

    it('should have valid class hierarchy', () => {
      const ontology = createSampleOntology()

      // Thing is root
      const thing = ontology.classes.get('owl:Thing')
      expect(thing?.superClasses).toEqual([])

      // Person extends Thing
      const person = ontology.classes.get('Person')
      expect(person?.superClasses).toEqual(['owl:Thing'])

      // Employee extends Person
      const employee = ontology.classes.get('Employee')
      expect(employee?.superClasses).toEqual(['Person'])
    })

    it('should have valid disjoint relationships', () => {
      const ontology = createSampleOntology()

      const person = ontology.classes.get('Person')
      const organization = ontology.classes.get('Organization')

      expect(person?.disjointWith).toContain('Organization')
      expect(organization?.disjointWith).toContain('Person')
    })

    it('should have valid property domains and ranges', () => {
      const ontology = createSampleOntology()

      const hasAge = ontology.properties.get('hasAge')
      const worksFor = ontology.properties.get('worksFor')

      // hasAge domain should be Person
      expect(hasAge?.domain).toEqual(['Person'])

      // worksFor domain should be Employee, range should be Organization
      expect(worksFor?.domain).toEqual(['Employee'])
      expect(worksFor?.range).toEqual(['Organization'])
    })

    it('should have valid individual assertions', () => {
      const ontology = createSampleOntology()

      const john = ontology.individuals.get('john_doe')
      const hasNameAssertion = john?.propertyAssertions.find(a => a.property === 'hasName')
      const hasAgeAssertion = john?.propertyAssertions.find(a => a.property === 'hasAge')

      expect(hasNameAssertion).toBeDefined()
      expect(hasNameAssertion?.value).toBe('John Doe')

      expect(hasAgeAssertion).toBeDefined()
      expect(hasAgeAssertion?.value).toBe(30)
    })
  })

  describe('Data structure integrity', () => {
    it('should use Map for classes, properties, and individuals', () => {
      const ontology = createSampleOntology()

      expect(ontology.classes).toBeInstanceOf(Map)
      expect(ontology.properties).toBeInstanceOf(Map)
      expect(ontology.individuals).toBeInstanceOf(Map)
    })

    it('should allow Map operations on collections', () => {
      const ontology = createSampleOntology()

      // Test Map methods
      expect(ontology.classes.get('Person')).toBeDefined()
      expect(ontology.classes.has('Person')).toBe(true)
      expect(Array.from(ontology.classes.keys())).toContain('Person')
    })

    it('should have correct array structures for class relations', () => {
      const ontology = createSampleOntology()
      const person = ontology.classes.get('Person')

      expect(Array.isArray(person?.superClasses)).toBe(true)
      expect(Array.isArray(person?.properties)).toBe(true)
      expect(Array.isArray(person?.disjointWith)).toBe(true)
      expect(Array.isArray(person?.equivalentTo)).toBe(true)
      expect(Array.isArray(person?.annotations)).toBe(true)
    })
  })
})
