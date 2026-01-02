import type { Ontology, OntologyClass, OntologyProperty, Individual } from './types'

/**
 * Serialize an in-memory Ontology model to JSON-LD.
 * The output follows common OWL/JSON-LD patterns:
 * - Ontology metadata at the root
 * - All entities flattened into @graph
 * - Relationships expressed as @id references
 */
export function serializeToJSONLD(ontology: Ontology): string {
  /**
   * JSON-LD requires a @context block to map short prefixes (owl:, rdf:, etc.)
   * to their full IRIs. This allows compact terms while remaining standards-compliant.
   */
  const context = {
    '@context': {
      owl: 'http://www.w3.org/2002/07/owl#',
      rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
      xsd: 'http://www.w3.org/2001/XMLSchema#',
    },
  }

  /**
   * The ontology is serialized as a single JSON-LD document.
   * Maps are flattened into arrays because JSON does not support Map types.
   */
  const jsonld = {
    ...context,
    '@id': ontology.id,
    '@type': 'owl:Ontology',
    'owl:versionInfo': ontology.version,

    /**
     * owl:imports is always represented as an array of @id references
     * to keep the structure consistent even when only one import exists.
     */
    'owl:imports': ontology.imports.map(imp => ({ '@id': imp })),

    '@graph': [
      // Convert Map to array using Array.from()
      ...Array.from(ontology.classes.values()).map(cls => ({
        '@id': cls.id,
        '@type': 'owl:Class',

        // Prefer human-friendly labels; fall back to internal name if missing
        'rdfs:label': cls.label || cls.name,

        // Optional description; omitted by JSON.stringify when undefined
        'rdfs:comment': cls.description,

        /**
         * Relationships are always emitted as arrays of @id objects.
         * This avoids ambiguity between singular and plural values.
         */
        'rdfs:subClassOf': cls.superClasses.map(sc => ({ '@id': sc })),
        'owl:disjointWith': cls.disjointWith.map(dw => ({ '@id': dw })),
      })),

      // Properties
      ...Array.from(ontology.properties.values()).map(prop => ({
        '@id': prop.id,
        '@type': `owl:${prop.type}`,
        'rdfs:label': prop.label || prop.name,
        'rdfs:comment': prop.description,
        'rdfs:domain': prop.domain.map(d => ({ '@id': d })),
        'rdfs:range': prop.range.map(r => ({ '@id': r })),
        'rdfs:subPropertyOf': prop.superProperties.map(sp => ({ '@id': sp })),
      })),

      // Individuals
      ...Array.from(ontology.individuals.values()).map(ind => ({
        '@id': ind.id,

        /**
         * Individuals may have multiple rdf:types,
         * so @type is always emitted as an array.
         */
        '@type': ind.types.map(t => ({ '@id': t })),
        'rdfs:label': ind.label || ind.name,
      })),
    ],
  }

  // Pretty-print JSON for readability and easier debugging
  return JSON.stringify(jsonld, null, 2)
}

/**
 * Serialize an ontology to Turtle.
 * This is a lightweight, human-readable implementation and does not aim
 * to cover the full Turtle specification.
 */
export function serializeToTurtle(ontology: Ontology): string {
  let turtle = `@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<${ontology.id}> a owl:Ontology`

  // Version info is optional and only emitted when present
  if (ontology.version) {
    turtle += ` ;\n  owl:versionInfo "${ontology.version}"`
  }

  turtle += ' .\n\n'

  // Classes
  Array.from(ontology.classes.values()).forEach(cls => {
    turtle += `<${cls.id}> a owl:Class`
    if (cls.label) {
      turtle += ` ;\n  rdfs:label "${cls.label}"`
    }
    if (cls.description) {
      turtle += ` ;\n  rdfs:comment "${cls.description}"`
    }

    // Multiple superclass relationships are emitted as repeated predicates
    cls.superClasses.forEach(sc => {
      turtle += ` ;\n  rdfs:subClassOf <${sc}>`
    })
    turtle += ' .\n\n'
  })

  // Properties
  Array.from(ontology.properties.values()).forEach(prop => {
    turtle += `<${prop.id}> a owl:${prop.type}`
    if (prop.label) {
      turtle += ` ;\n  rdfs:label "${prop.label}"`
    }
    if (prop.description) {
      turtle += ` ;\n  rdfs:comment "${prop.description}"`
    }
    prop.domain.forEach(d => {
      turtle += ` ;\n  rdfs:domain <${d}>`
    })
    prop.range.forEach(r => {
      turtle += ` ;\n  rdfs:range <${r}>`
    })
    turtle += ' .\n\n'
  })

  // Individuals
  Array.from(ontology.individuals.values()).forEach(ind => {
    turtle += `<${ind.id}> a ${ind.types.map(t => `<${t}>`).join(', ')}`
    if (ind.label) {
      turtle += ` ;\n  rdfs:label "${ind.label}"`
    }
    turtle += ' .\n\n'
  })

  return turtle
}

/**
 * Serialize an ontology to OWL/XML (RDF/XML).
 * This implementation focuses on interoperability rather than full OWL coverage.
 */
export function serializeToOWLXML(ontology: Ontology): string {
  let xml = `<?xml version="1.0"?>
<rdf:RDF xmlns="http://example.org/ontology#"
     xmlBase="http://example.org/ontology"
     xmlns:owl="http://www.w3.org/2002/07/owl#"
     xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
     xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
     xmlns:xsd="http://www.w3.org/2001/XMLSchema#">
    <owl:Ontology rdf:about="${ontology.id}">
        ${ontology.version ? `<owl:versionInfo>${ontology.version}</owl:versionInfo>` : ''}
    </owl:Ontology>\n`

  // Classes
  Array.from(ontology.classes.values()).forEach(cls => {
    xml += `    <owl:Class rdf:about="${cls.id}">\n`
    if (cls.label) {
      xml += `        <rdfs:label>${cls.label}</rdfs:label>\n`
    }
    if (cls.description) {
      xml += `        <rdfs:comment>${cls.description}</rdfs:comment>\n`
    }
    cls.superClasses.forEach(sc => {
      xml += `        <rdfs:subClassOf rdf:resource="${sc}"/>\n`
    })
    xml += `    </owl:Class>\n`
  })

  // Properties
  Array.from(ontology.properties.values()).forEach(prop => {
    xml += `    <owl:${prop.type} rdf:about="${prop.id}">\n`
    if (prop.label) {
      xml += `        <rdfs:label>${prop.label}</rdfs:label>\n`
    }
    if (prop.description) {
      xml += `        <rdfs:comment>${prop.description}</rdfs:comment>\n`
    }
    prop.domain.forEach(d => {
      xml += `        <rdfs:domain rdf:resource="${d}"/>\n`
    })
    prop.range.forEach(r => {
      xml += `        <rdfs:range rdf:resource="${r}"/>\n`
    })
    xml += `    </owl:${prop.type}>\n`
  })

  // Individuals
  Array.from(ontology.individuals.values()).forEach(ind => {
    /**
     * Each rdf:type is emitted as a separate NamedIndividual block
     * to avoid ambiguity in RDF/XML parsers.
     */
    ind.types.forEach(type => {
      xml += `    <owl:NamedIndividual rdf:about="${ind.id}">\n`
      xml += `        <rdf:type rdf:resource="${type}"/>\n`
      if (ind.label) {
        xml += `        <rdfs:label>${ind.label}</rdfs:label>\n`
      }
      xml += `    </owl:NamedIndividual>\n`
    })
  })

  xml += `</rdf:RDF>`
  return xml
}

/**
 * Parse OWL/XML (RDF/XML) into the internal Ontology model.
 * Parsing is intentionally defensive to handle variations in namespace usage.
 */
export function parseOWLXML(content: string): Ontology {
  /**
   * DOMParser provides a simple, browser-compatible XML parser.
   * Invalid XML may result in partial or empty documents.
   */
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(content, 'text/xml')

  const classes = new Map<string, OntologyClass>()
  const properties = new Map<string, OntologyProperty>()
  const individuals = new Map<string, Individual>()

  // Parse ontology metadata
  const ontologyNode = xmlDoc.querySelector('Ontology')
  const ontologyId =
    ontologyNode?.getAttribute('rdf:about') ||
    ontologyNode?.getAttribute('about') ||
    'http://example.org/ontology'
  const versionInfo = ontologyNode?.querySelector('versionInfo')?.textContent || undefined

  // Parse classes
  const classNodes = xmlDoc.querySelectorAll('Class')
  classNodes.forEach(node => {
    const id = node.getAttribute('rdf:about') || node.getAttribute('about') || ''
    if (!id) {
      return
    }

    /**
     * Labels fall back to the local fragment of the IRI
     * to guarantee a usable display name.
     */
    const label =
      node.querySelector('label')?.textContent || id.split('#').pop() || id.split('/').pop() || id
    const description = node.querySelector('comment')?.textContent || undefined
    const superClassNodes = node.querySelectorAll('subClassOf')
    const superClasses = Array.from(superClassNodes)
      .map(n => n.getAttribute('rdf:resource') || n.getAttribute('resource') || '')
      .filter(Boolean)

    classes.set(id, {
      id,
      name: label,
      label,
      description,
      superClasses,
      annotations: [],
      properties: [],
      disjointWith: [],
      equivalentTo: [],
    })
  })

  // Parse properties
  const propertyTypes = ['ObjectProperty', 'DatatypeProperty', 'AnnotationProperty']
  propertyTypes.forEach(propType => {
    const propNodes = xmlDoc.querySelectorAll(propType)
    propNodes.forEach(node => {
      const id = node.getAttribute('rdf:about') || node.getAttribute('about') || ''
      if (!id) {
        return
      }

      const label =
        node.querySelector('label')?.textContent || id.split('#').pop() || id.split('/').pop() || id
      const description = node.querySelector('comment')?.textContent || undefined
      const domainNodes = node.querySelectorAll('domain')
      const rangeNodes = node.querySelectorAll('range')

      properties.set(id, {
        id,
        name: label,
        label,
        description,

        /**
         * DatatypeProperty is normalized to DataProperty internally.
         */
        type:
          propType === 'DatatypeProperty'
            ? 'DataProperty'
            : (propType as 'ObjectProperty' | 'AnnotationProperty'),
        domain: Array.from(domainNodes)
          .map(n => n.getAttribute('rdf:resource') || n.getAttribute('resource') || '')
          .filter(Boolean),
        range: Array.from(rangeNodes)
          .map(n => n.getAttribute('rdf:resource') || n.getAttribute('resource') || '')
          .filter(Boolean),
        superProperties: [],
        characteristics: [],
        annotations: [],
      })
    })
  })

  // Parse individuals
  const individualNodes = xmlDoc.querySelectorAll('NamedIndividual')
  individualNodes.forEach(node => {
    const id = node.getAttribute('rdf:about') || node.getAttribute('about') || ''
    if (!id) {
      return
    }

    const label =
      node.querySelector('label')?.textContent || id.split('#').pop() || id.split('/').pop() || id
    const typeNodes = node.querySelectorAll('type')
    const types = Array.from(typeNodes)
      .map(n => n.getAttribute('rdf:resource') || n.getAttribute('resource') || '')
      .filter(Boolean)

    individuals.set(id, {
      id,
      name: label,
      label,
      types,
      propertyAssertions: [],
      annotations: [],
      sameAs: [],
      differentFrom: [],
    })
  })

  return {
    id: ontologyId,
    name: ontologyId.split('#').pop() || ontologyId.split('/').pop() || 'Imported Ontology',
    version: versionInfo,
    imports: [],
    classes,
    properties,
    individuals,
    annotations: [],
  }
}

/**
 * RDF/XML is treated as equivalent to OWL/XML for parsing purposes.
 */
export function parseRDFXML(content: string): Ontology {
  return parseOWLXML(content)
}

/**
 * Parse Turtle using a minimal, line-oriented approach.
 * This supports only basic class and property declarations.
 */
export function parseTurtle(content: string): Ontology {
  const classes = new Map<string, OntologyClass>()
  const properties = new Map<string, OntologyProperty>()
  const individuals = new Map<string, Individual>()

  /**
   * This parser is intentionally simplistic:
   * - No blank nodes
   * - No collections
   * - No multi-line triples
   */
  const lines = content.split('\n')
  let currentSubject: string | null = null
  let currentType: string | null = null

  lines.forEach(line => {
    line = line.trim()
    if (line.startsWith('@prefix') || line.startsWith('#') || !line) {
      return
    }

    // Extract subject
    const subjectMatch = line.match(/<([^>]+)>/)
    if (subjectMatch) {
      currentSubject = subjectMatch[1]
    }

    // Check for class
    if (line.includes('owl:Class')) {
      if (currentSubject) {
        classes.set(currentSubject, {
          id: currentSubject,
          name:
            currentSubject.split('#').pop() || currentSubject.split('/').pop() || currentSubject,
          superClasses: [],
          annotations: [],
          properties: [],
          disjointWith: [],
          equivalentTo: [],
        })
        currentType = 'class'
      }
    }

    // Check for properties
    if (line.includes('owl:ObjectProperty') || line.includes('owl:DatatypeProperty')) {
      if (currentSubject) {
        const type = line.includes('owl:ObjectProperty') ? 'ObjectProperty' : 'DataProperty'
        properties.set(currentSubject, {
          id: currentSubject,
          name:
            currentSubject.split('#').pop() || currentSubject.split('/').pop() || currentSubject,
          type: type as 'ObjectProperty' | 'DataProperty',
          domain: [],
          range: [],
          superProperties: [],
          characteristics: [],
          annotations: [],
        })
        currentType = 'property'
      }
    }

    // Extract labels
    if (line.includes('rdfs:label') && currentSubject) {
      const labelMatch = line.match(/"([^"]+)"/)
      if (labelMatch) {
        if (currentType === 'class' && classes.has(currentSubject)) {
          const cls = classes.get(currentSubject)!
          cls.label = labelMatch[1]
        } else if (currentType === 'property' && properties.has(currentSubject)) {
          const prop = properties.get(currentSubject)!
          prop.label = labelMatch[1]
        }
      }
    }
  })

  return {
    id: 'http://example.org/imported-ontology',
    name: 'Imported Ontology',
    imports: [],
    classes,
    properties,
    individuals,
    annotations: [],
  }
}

/**
 * Parse JSON-LD into the internal Ontology model.
 * Handles both single-object and @graph-based documents.
 */
export function parseJSONLD(content: string): Ontology {
  const data = JSON.parse(content)
  const classes = new Map<string, OntologyClass>()
  const properties = new Map<string, OntologyProperty>()
  const individuals = new Map<string, Individual>()

  const graph = data['@graph'] || [data]

  graph.forEach((item: any) => {
    const type = item['@type']
    const id = item['@id']

    if (!id) {
      return
    }

    if (type === 'owl:Class' || type?.includes?.('Class')) {
      classes.set(id, {
        id,
        name: item['rdfs:label'] || id.split('#').pop() || id.split('/').pop() || id,
        label: item['rdfs:label'],
        description: item['rdfs:comment'],
        superClasses: Array.isArray(item['rdfs:subClassOf'])
          ? item['rdfs:subClassOf'].map((sc: any) => sc['@id'] || sc)
          : item['rdfs:subClassOf']
            ? [item['rdfs:subClassOf']['@id'] || item['rdfs:subClassOf']]
            : [],
        annotations: [],
        properties: [],
        disjointWith: [],
        equivalentTo: [],
      })
    } else if (type?.includes?.('Property')) {
      const propType = type.includes('Object')
        ? 'ObjectProperty'
        : type.includes('Data')
          ? 'DataProperty'
          : 'AnnotationProperty'
      properties.set(id, {
        id,
        name: item['rdfs:label'] || id.split('#').pop() || id.split('/').pop() || id,
        label: item['rdfs:label'],
        description: item['rdfs:comment'],
        type: propType as 'ObjectProperty' | 'DataProperty' | 'AnnotationProperty',
        domain: Array.isArray(item['rdfs:domain'])
          ? item['rdfs:domain'].map((d: any) => d['@id'] || d)
          : item['rdfs:domain']
            ? [item['rdfs:domain']['@id'] || item['rdfs:domain']]
            : [],
        range: Array.isArray(item['rdfs:range'])
          ? item['rdfs:range'].map((r: any) => r['@id'] || r)
          : item['rdfs:range']
            ? [item['rdfs:range']['@id'] || item['rdfs:range']]
            : [],
        superProperties: [],
        characteristics: [],
        annotations: [],
      })
    }
  })

  return {
    id: data['@id'] || 'http://example.org/imported-ontology',
    name: data['rdfs:label'] || 'Imported Ontology',
    version: data['owl:versionInfo'],
    imports: [],
    classes,
    properties,
    individuals,
    annotations: [],
  }
}

export const parseFromJSONLD = parseJSONLD
export const parseFromOWLXML = parseOWLXML
export const parseFromTurtle = parseTurtle
