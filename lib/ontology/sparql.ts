import type { Ontology, OntologyClass, OntologyProperty, Individual } from './types'
import { serializeToTurtle } from './serializers'

/**
 * SPARQL Query Result types
 */
export type SPARQLBinding = {
  [variable: string]: string | number | boolean
}

export type SPARQLResult = {
  head: {
    vars: string[]
  }
  results: {
    bindings: SPARQLBinding[]
  }
}

/**
 * Simple in-memory triple store for SPARQL queries
 */
type Triple = {
  subject: string
  predicate: string
  object: string | number | boolean
  objectType?: 'uri' | 'literal'
}

/**
 * Convert ontology to triples for querying
 */
function ontologyToTriples(ontology: Ontology): Triple[] {
  const triples: Triple[] = []

  // Ontology metadata
  triples.push({
    subject: ontology.id,
    predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
    object: 'http://www.w3.org/2002/07/owl#Ontology',
    objectType: 'uri',
  })

  if (ontology.version) {
    triples.push({
      subject: ontology.id,
      predicate: 'http://www.w3.org/2002/07/owl#versionInfo',
      object: ontology.version,
      objectType: 'literal',
    })
  }

  // Classes
  ontology.classes.forEach(cls => {
    triples.push({
      subject: cls.id,
      predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
      object: 'http://www.w3.org/2002/07/owl#Class',
      objectType: 'uri',
    })

    if (cls.label) {
      triples.push({
        subject: cls.id,
        predicate: 'http://www.w3.org/2000/01/rdf-schema#label',
        object: cls.label,
        objectType: 'literal',
      })
    }

    if (cls.description) {
      triples.push({
        subject: cls.id,
        predicate: 'http://www.w3.org/2000/01/rdf-schema#comment',
        object: cls.description,
        objectType: 'literal',
      })
    }

    cls.superClasses.forEach(sc => {
      triples.push({
        subject: cls.id,
        predicate: 'http://www.w3.org/2000/01/rdf-schema#subClassOf',
        object: sc,
        objectType: 'uri',
      })
    })

    cls.disjointWith.forEach(dw => {
      triples.push({
        subject: cls.id,
        predicate: 'http://www.w3.org/2002/07/owl#disjointWith',
        object: dw,
        objectType: 'uri',
      })
    })

    cls.equivalentTo.forEach(eq => {
      triples.push({
        subject: cls.id,
        predicate: 'http://www.w3.org/2002/07/owl#equivalentClass',
        object: eq,
        objectType: 'uri',
      })
    })
  })

  // Properties
  ontology.properties.forEach(prop => {
    triples.push({
      subject: prop.id,
      predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
      object: `http://www.w3.org/2002/07/owl#${prop.type}`,
      objectType: 'uri',
    })

    if (prop.label) {
      triples.push({
        subject: prop.id,
        predicate: 'http://www.w3.org/2000/01/rdf-schema#label',
        object: prop.label,
        objectType: 'literal',
      })
    }

    if (prop.description) {
      triples.push({
        subject: prop.id,
        predicate: 'http://www.w3.org/2000/01/rdf-schema#comment',
        object: prop.description,
        objectType: 'literal',
      })
    }

    prop.domain.forEach(d => {
      triples.push({
        subject: prop.id,
        predicate: 'http://www.w3.org/2000/01/rdf-schema#domain',
        object: d,
        objectType: 'uri',
      })
    })

    prop.range.forEach(r => {
      triples.push({
        subject: prop.id,
        predicate: 'http://www.w3.org/2000/01/rdf-schema#range',
        object: r,
        objectType: 'uri',
      })
    })

    prop.superProperties.forEach(sp => {
      triples.push({
        subject: prop.id,
        predicate: 'http://www.w3.org/2000/01/rdf-schema#subPropertyOf',
        object: sp,
        objectType: 'uri',
      })
    })
  })

  // Individuals
  ontology.individuals.forEach(ind => {
    triples.push({
      subject: ind.id,
      predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
      object: 'http://www.w3.org/2002/07/owl#NamedIndividual',
      objectType: 'uri',
    })

    ind.types.forEach(type => {
      triples.push({
        subject: ind.id,
        predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
        object: type,
        objectType: 'uri',
      })
    })

    if (ind.label) {
      triples.push({
        subject: ind.id,
        predicate: 'http://www.w3.org/2000/01/rdf-schema#label',
        object: ind.label,
        objectType: 'literal',
      })
    }

    ind.propertyAssertions.forEach(assertion => {
      triples.push({
        subject: ind.id,
        predicate: assertion.property,
        object: assertion.value,
        objectType: typeof assertion.value === 'string' ? 'uri' : 'literal',
      })
    })

    ind.sameAs.forEach(same => {
      triples.push({
        subject: ind.id,
        predicate: 'http://www.w3.org/2002/07/owl#sameAs',
        object: same,
        objectType: 'uri',
      })
    })

    ind.differentFrom.forEach(diff => {
      triples.push({
        subject: ind.id,
        predicate: 'http://www.w3.org/2002/07/owl#differentFrom',
        object: diff,
        objectType: 'uri',
      })
    })
  })

  return triples
}

/**
 * Normalize an IRI by removing angle brackets and handling prefixes
 */
function normalizeIRI(iri: string): string {
  // Remove angle brackets
  let normalized = iri.replace(/^<|>$/g, '').trim()

  // Expand common prefixes
  const prefixes: Record<string, string> = {
    'rdf:': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'rdfs:': 'http://www.w3.org/2000/01/rdf-schema#',
    'owl:': 'http://www.w3.org/2002/07/owl#',
    'xsd:': 'http://www.w3.org/2001/XMLSchema#',
  }

  for (const [prefix, uri] of Object.entries(prefixes)) {
    if (normalized.startsWith(prefix)) {
      normalized = normalized.replace(prefix, uri)
      break
    }
  }

  return normalized
}

/**
 * Simple SPARQL pattern matcher
 * Supports basic triple patterns with variables
 */
function matchPattern(
  pattern: { subject: string; predicate: string; object: string },
  triples: Triple[]
): SPARQLBinding[] {
  const results: SPARQLBinding[] = []

  // Normalize pattern IRIs
  const normalizedPattern = {
    subject: pattern.subject.startsWith('?') ? pattern.subject : normalizeIRI(pattern.subject),
    predicate: pattern.predicate.startsWith('?') ? pattern.predicate : normalizeIRI(pattern.predicate),
    object: pattern.object.startsWith('?') ? pattern.object : normalizeIRI(pattern.object),
  }

  for (const triple of triples) {
    const binding: SPARQLBinding = {}
    let matches = true

    // Normalize triple values
    const normalizedTriple = {
      subject: normalizeIRI(triple.subject),
      predicate: normalizeIRI(triple.predicate),
      object: typeof triple.object === 'string' ? normalizeIRI(triple.object) : triple.object,
    }

    // Match subject
    if (normalizedPattern.subject.startsWith('?')) {
      binding[normalizedPattern.subject.substring(1)] = triple.subject
    } else if (normalizedPattern.subject !== normalizedTriple.subject) {
      matches = false
    }

    // Match predicate
    if (normalizedPattern.predicate.startsWith('?')) {
      binding[normalizedPattern.predicate.substring(1)] = triple.predicate
    } else if (normalizedPattern.predicate !== normalizedTriple.predicate) {
      matches = false
    }

    // Match object
    if (normalizedPattern.object.startsWith('?')) {
      binding[normalizedPattern.object.substring(1)] = triple.object
    } else if (normalizedPattern.object !== String(normalizedTriple.object)) {
      matches = false
    }

    if (matches) {
      results.push(binding)
    }
  }

  return results
}

/**
 * Check if two IRIs match, accounting for prefix expansion
 */
function isIRIMatch(pattern: string, value: string): boolean {
  // Handle common prefixes
  const prefixes: Record<string, string> = {
    'rdf:': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'rdfs:': 'http://www.w3.org/2000/01/rdf-schema#',
    'owl:': 'http://www.w3.org/2002/07/owl#',
    'xsd:': 'http://www.w3.org/2001/XMLSchema#',
  }

  let expandedPattern = pattern
  for (const [prefix, uri] of Object.entries(prefixes)) {
    if (pattern.startsWith(prefix)) {
      expandedPattern = pattern.replace(prefix, uri)
      break
    }
  }

  // Remove angle brackets if present
  expandedPattern = expandedPattern.replace(/^<|>$/g, '')
  const expandedValue = value.replace(/^<|>$/g, '')

  return expandedPattern === expandedValue
}

/**
 * Parse a simple SPARQL SELECT query
 * This is a minimal parser that supports basic SELECT queries
 */
function parseSPARQLQuery(query: string): {
  variables: string[]
  patterns: Array<{ subject: string; predicate: string; object: string; optional?: boolean }>
} | null {
  // Extract SELECT variables
  const selectMatch = query.match(/SELECT\s+(.*?)\s+WHERE/is)
  if (!selectMatch) {
    return null
  }

  const varsString = selectMatch[1].trim()
  const variables =
    varsString === '*'
      ? []
      : varsString
          .split(/\s+/)
          .filter(v => v.startsWith('?'))
          .map(v => v.substring(1))

  // Extract WHERE clause
  const whereMatch = query.match(/WHERE\s*\{(.*)\}/is)
  if (!whereMatch) {
    return null
  }

  let whereClause = whereMatch[1]

  // Handle OPTIONAL blocks by removing them for now (simplified handling)
  // This is a basic implementation - OPTIONAL should make patterns optional
  whereClause = whereClause.replace(/OPTIONAL\s*\{([^}]*)\}/gi, '$1')

  // Parse triple patterns (very basic)
  const patterns: Array<{ subject: string; predicate: string; object: string; optional?: boolean }> =
    []
  const lines = whereClause
    .split('.')
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.match(/^\s*$/))

  for (const line of lines) {
    // Skip empty lines or lines with just whitespace
    if (!line || line.match(/^\s*$/)) {
      continue
    }

    const parts = line
      .split(/\s+/)
      .filter(p => p.length > 0 && p !== '{' && p !== '}')
      .map(p => p.trim())

    if (parts.length >= 3) {
      patterns.push({
        subject: parts[0],
        predicate: parts[1],
        object: parts.slice(2).join(' ').replace(/\s*;\s*$/, '').trim(),
      })
    }
  }

  return { variables, patterns }
}

/**
 * Execute a SPARQL SELECT query against the ontology
 */
export function executeSPARQLQuery(query: string, ontology: Ontology): SPARQLResult {
  const triples = ontologyToTriples(ontology)
  const parsed = parseSPARQLQuery(query)

  if (!parsed) {
    throw new Error('Invalid SPARQL query format')
  }

  const { variables, patterns } = parsed

  // Execute each pattern and join results
  let results: SPARQLBinding[] = [{}]

  for (const pattern of patterns) {
    const patternResults = matchPattern(pattern, triples)

    if (results.length === 1 && Object.keys(results[0]).length === 0) {
      // First pattern
      results = patternResults
    } else {
      // Join with existing results
      const joined: SPARQLBinding[] = []

      for (const existing of results) {
        for (const newBinding of patternResults) {
          // Check if bindings are compatible
          let compatible = true
          const merged = { ...existing }

          for (const [key, value] of Object.entries(newBinding)) {
            if (key in existing && existing[key] !== value) {
              compatible = false
              break
            }
            merged[key] = value
          }

          if (compatible) {
            joined.push(merged)
          }
        }
      }

      results = joined
    }
  }

  // If SELECT *, include all variables
  const resultVars =
    variables.length > 0 ? variables : Array.from(new Set(results.flatMap(r => Object.keys(r))))

  return {
    head: {
      vars: resultVars,
    },
    results: {
      bindings: results.map(binding => {
        const filtered: SPARQLBinding = {}
        for (const v of resultVars) {
          if (v in binding) {
            filtered[v] = binding[v]
          }
        }
        return filtered
      }),
    },
  }
}

/**
 * Sample SPARQL queries for demonstration
 */
export const SAMPLE_QUERIES = [
  {
    name: 'All Classes',
    description: 'Select all classes in the ontology',
    query: `SELECT ?class ?label
WHERE {
  ?class rdf:type owl:Class .
  OPTIONAL { ?class rdfs:label ?label }
}`,
  },
  {
    name: 'All Properties',
    description: 'Select all properties (Object, Data, Annotation)',
    query: `SELECT ?property ?type ?label
WHERE {
  ?property rdf:type ?type .
  OPTIONAL { ?property rdfs:label ?label }
}`,
  },
  {
    name: 'Class Hierarchy',
    description: 'Find all classes and their superclasses',
    query: `SELECT ?class ?superClass
WHERE {
  ?class rdf:type owl:Class .
  ?class rdfs:subClassOf ?superClass .
}`,
  },
  {
    name: 'All Individuals',
    description: 'Select all named individuals and their types',
    query: `SELECT ?individual ?type ?label
WHERE {
  ?individual rdf:type owl:NamedIndividual .
  ?individual rdf:type ?type .
  OPTIONAL { ?individual rdfs:label ?label }
}`,
  },
  {
    name: 'Properties with Domain',
    description: 'Find all properties and their domain restrictions',
    query: `SELECT ?property ?domain
WHERE {
  ?property rdfs:domain ?domain .
}`,
  },
  {
    name: 'Properties with Range',
    description: 'Find all properties and their range restrictions',
    query: `SELECT ?property ?range
WHERE {
  ?property rdfs:range ?range .
}`,
  },
]
