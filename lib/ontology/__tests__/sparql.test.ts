import { executeSPARQLQuery, SAMPLE_QUERIES } from '../sparql'
import { createSampleOntology } from '../sample-data'

describe('SPARQL Query Engine', () => {
  const ontology = createSampleOntology()

  describe('executeSPARQLQuery', () => {
    it('should execute a simple class query', () => {
      const query = `SELECT ?class ?label
WHERE {
  ?class rdf:type owl:Class .
  ?class rdfs:label ?label .
}`

      const result = executeSPARQLQuery(query, ontology)

      expect(result.head.vars).toEqual(['class', 'label'])
      expect(result.results.bindings.length).toBeGreaterThan(0)

      // Check that all results have the required variables
      result.results.bindings.forEach(binding => {
        expect(binding).toHaveProperty('class')
        expect(binding).toHaveProperty('label')
      })
    })

    it('should execute a query for all classes', () => {
      const query = `SELECT ?class
WHERE {
  ?class rdf:type owl:Class .
}`

      const result = executeSPARQLQuery(query, ontology)

      expect(result.head.vars).toEqual(['class'])
      expect(result.results.bindings.length).toBe(ontology.classes.size)
    })

    it('should execute a query for properties', () => {
      const query = `SELECT ?property ?type
WHERE {
  ?property rdf:type ?type .
}`

      const result = executeSPARQLQuery(query, ontology)

      expect(result.head.vars).toContain('property')
      expect(result.head.vars).toContain('type')
      expect(result.results.bindings.length).toBeGreaterThan(0)
    })

    it('should execute a query with subClassOf pattern', () => {
      const query = `SELECT ?class ?superClass
WHERE {
  ?class rdfs:subClassOf ?superClass .
}`

      const result = executeSPARQLQuery(query, ontology)

      expect(result.head.vars).toContain('class')
      expect(result.head.vars).toContain('superClass')

      // Verify that results contain valid subclass relationships
      result.results.bindings.forEach(binding => {
        expect(typeof binding.class).toBe('string')
        expect(typeof binding.superClass).toBe('string')
      })
    })

    it('should execute a query for individuals', () => {
      const query = `SELECT ?individual ?type
WHERE {
  ?individual rdf:type owl:NamedIndividual .
  ?individual rdf:type ?type .
}`

      const result = executeSPARQLQuery(query, ontology)

      expect(result.head.vars).toContain('individual')
      expect(result.head.vars).toContain('type')
    })

    it('should handle SELECT * queries', () => {
      const query = `SELECT *
WHERE {
  ?s rdf:type owl:Class .
}`

      const result = executeSPARQLQuery(query, ontology)

      expect(result.head.vars.length).toBeGreaterThan(0)
      expect(result.results.bindings.length).toBe(ontology.classes.size)
    })

    it('should throw error for invalid query format', () => {
      const invalidQuery = 'INVALID SPARQL'

      expect(() => executeSPARQLQuery(invalidQuery, ontology)).toThrow()
    })

    it('should return empty results for non-matching patterns', () => {
      const query = `SELECT ?x
WHERE {
  ?x rdf:type <http://nonexistent.com/Class> .
}`

      const result = executeSPARQLQuery(query, ontology)

      expect(result.results.bindings.length).toBe(0)
    })
  })

  describe('Sample Queries', () => {
    it('should have valid sample queries', () => {
      expect(SAMPLE_QUERIES.length).toBeGreaterThan(0)

      SAMPLE_QUERIES.forEach(sample => {
        expect(sample).toHaveProperty('name')
        expect(sample).toHaveProperty('description')
        expect(sample).toHaveProperty('query')
      })
    })

    it('should execute all sample queries without errors', () => {
      SAMPLE_QUERIES.forEach(sample => {
        expect(() => {
          const result = executeSPARQLQuery(sample.query, ontology)
          expect(result).toHaveProperty('head')
          expect(result).toHaveProperty('results')
        }).not.toThrow()
      })
    })

    it('should return results for "All Classes" sample query', () => {
      const allClassesQuery = SAMPLE_QUERIES.find(q => q.name === 'All Classes')
      expect(allClassesQuery).toBeDefined()

      if (allClassesQuery) {
        const result = executeSPARQLQuery(allClassesQuery.query, ontology)
        expect(result.results.bindings.length).toBeGreaterThan(0)
      }
    })

    it('should return results for "Class Hierarchy" sample query', () => {
      const hierarchyQuery = SAMPLE_QUERIES.find(q => q.name === 'Class Hierarchy')
      expect(hierarchyQuery).toBeDefined()

      if (hierarchyQuery) {
        const result = executeSPARQLQuery(hierarchyQuery.query, ontology)
        // Result length depends on class hierarchy in sample data
        expect(result.head.vars).toContain('class')
        expect(result.head.vars).toContain('superClass')
      }
    })
  })

  describe('IRI Matching', () => {
    it('should handle both prefixed and full IRIs in queries', () => {
      // Query with prefixes
      const query1 = `SELECT ?class
WHERE {
  ?class rdf:type owl:Class .
}`

      // Query with full IRIs
      const query2 = `SELECT ?class
WHERE {
  ?class <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2002/07/owl#Class> .
}`

      const result1 = executeSPARQLQuery(query1, ontology)
      const result2 = executeSPARQLQuery(query2, ontology)

      // Both queries should return results (they query classes)
      expect(result1.results.bindings.length).toBeGreaterThan(0)
      expect(result2.results.bindings.length).toBeGreaterThan(0)

      // Both should return at least the number of classes in the ontology
      expect(result1.results.bindings.length).toBeGreaterThanOrEqual(ontology.classes.size)
    })
  })
})
