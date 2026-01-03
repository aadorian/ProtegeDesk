import type { Ontology, OntologyClass, OntologyProperty, Individual } from './types'
/**
 * JSON-LD values can appear as strings, objects with @id,
 * or arrays of those forms.
 */
type JSONLDValue =
  | string
  | { '@id'?: string }
  | Array<string | { '@id'?: string }>

/**
 * Escape special XML characters to ensure valid XML output.
 * Required by W3C RDF/XML specification for text content and attribute values.
 */
function escapeXML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

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
    'owl:imports': ontology.imports.map((imp): { '@id': string } => ({ '@id': imp })),


    '@graph': [
      // Convert Map to array using Array.from()
      ...Array.from(ontology.classes.values()).map((cls): {
        '@id': string
        '@type': string
        'rdfs:label': string
        'rdfs:comment'?: string
        'rdfs:subClassOf': { '@id': string }[]
        'owl:disjointWith': { '@id': string }[]
} => ({

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
  Array.from(ontology.classes.values()).forEach((cls): void => {
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
  // Extract base URI from ontology ID for proper IRI resolution
  const baseURI =
    ontology.id.endsWith('#') || ontology.id.endsWith('/')
      ? ontology.id
      : ontology.id.includes('#')
        ? ontology.id.substring(0, ontology.id.lastIndexOf('#') + 1)
        : ontology.id + '#'

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns="http://example.org/ontology#"
     xml:base="${baseURI}"
     xmlns:owl="http://www.w3.org/2002/07/owl#"
     xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
     xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
     xmlns:xsd="http://www.w3.org/2001/XMLSchema#">
    <owl:Ontology rdf:about="${ontology.id}">`

  // Add version info if present
  if (ontology.version) {
    xml += `
        <owl:versionInfo>${escapeXML(ontology.version)}</owl:versionInfo>`
  }

  // Add owl:imports declarations as per W3C OWL specification
  if (ontology.imports && ontology.imports.length > 0) {
    ontology.imports.forEach(imp => {
      xml += `
        <owl:imports rdf:resource="${escapeXML(imp)}"/>`
    })
  }

  xml += `
    </owl:Ontology>\n`

  // Classes - using rdf:about for subject identification per RDF/XML spec
  Array.from(ontology.classes.values()).forEach(cls => {
    xml += `    <owl:Class rdf:about="${escapeXML(cls.id)}">\n`
    if (cls.label) {
      xml += `        <rdfs:label>${escapeXML(cls.label)}</rdfs:label>\n`
    }
    if (cls.description) {
      xml += `        <rdfs:comment>${escapeXML(cls.description)}</rdfs:comment>\n`
    }
    // Use rdf:resource for object references per RDF/XML spec
    cls.superClasses.forEach(sc => {
      xml += `        <rdfs:subClassOf rdf:resource="${escapeXML(sc)}"/>\n`
    })
    cls.disjointWith.forEach(dw => {
      xml += `        <owl:disjointWith rdf:resource="${escapeXML(dw)}"/>\n`
    })
    cls.equivalentTo.forEach(eq => {
      xml += `        <owl:equivalentClass rdf:resource="${escapeXML(eq)}"/>\n`
    })
    xml += `    </owl:Class>\n`
  })

  // Properties - ensure proper rdf:about and rdf:resource usage
  Array.from(ontology.properties.values()).forEach(prop => {
    xml += `    <owl:${prop.type} rdf:about="${escapeXML(prop.id)}">\n`
    if (prop.label) {
      xml += `        <rdfs:label>${escapeXML(prop.label)}</rdfs:label>\n`
    }
    if (prop.description) {
      xml += `        <rdfs:comment>${escapeXML(prop.description)}</rdfs:comment>\n`
    }
    prop.domain.forEach(d => {
      xml += `        <rdfs:domain rdf:resource="${escapeXML(d)}"/>\n`
    })
    prop.range.forEach(r => {
      xml += `        <rdfs:range rdf:resource="${escapeXML(r)}"/>\n`
    })
    prop.superProperties.forEach(sp => {
      xml += `        <rdfs:subPropertyOf rdf:resource="${escapeXML(sp)}"/>\n`
    })
    xml += `    </owl:${prop.type}>\n`
  })

  // Individuals - consolidate multiple types into single NamedIndividual element
  Array.from(ontology.individuals.values()).forEach(ind => {
    if (ind.types.length === 0) {
      // No explicit type, just use owl:NamedIndividual
      xml += `    <owl:NamedIndividual rdf:about="${escapeXML(ind.id)}">\n`
      if (ind.label) {
        xml += `        <rdfs:label>${escapeXML(ind.label)}</rdfs:label>\n`
      }
      xml += `    </owl:NamedIndividual>\n`
    } else {
      // Use first type as element name, add others as rdf:type properties
      xml += `    <owl:NamedIndividual rdf:about="${escapeXML(ind.id)}">\n`
      ind.types.forEach(type => {
        xml += `        <rdf:type rdf:resource="${escapeXML(type)}"/>\n`
      })
      if (ind.label) {
        xml += `        <rdfs:label>${escapeXML(ind.label)}</rdfs:label>\n`
      }
      xml += `    </owl:NamedIndividual>\n`
    }
  })

  xml += `</rdf:RDF>`
  return xml
}

/**
 * Helper function to get attribute value with or without namespace prefix.
 * Required by W3C RDF/XML spec which allows both forms.
 */
function getAttributeNS(
  element: Element | null,
  localName: string,
  namespace?: string
): string | null {
  if (!element) {
    return null
  }

  // Try with namespace prefix first
  const withPrefix =
    element.getAttribute(`rdf:${localName}`) || element.getAttribute(`owl:${localName}`)
  if (withPrefix) {
    return withPrefix
  }

  // Try without prefix
  const withoutPrefix = element.getAttribute(localName)
  if (withoutPrefix) {
    return withoutPrefix
  }

  // Try with getAttributeNS if namespace provided
  if (namespace) {
    const nsValue = element.getAttributeNS(namespace, localName)
    if (nsValue) {
      return nsValue
    }
  }

  return null
}

/**
 * Resolve a potentially relative IRI against a base URI.
 * Per W3C RDF/XML spec, IRIs starting with # are relative to xml:base.
 */
function resolveIRI(iri: string, xmlBase: string): string {
  if (!iri) {
    return iri
  }

  // Already absolute
  if (iri.startsWith('http://') || iri.startsWith('https://')) {
    return iri
  }

  // Relative IRI starting with #
  if (iri.startsWith('#')) {
    // Remove trailing # from base if present
    const base = xmlBase.endsWith('#') ? xmlBase.slice(0, -1) : xmlBase
    return base + iri
  }

  // Other relative forms - just prepend base
  return xmlBase + iri
}

/**
 * Parse OWL/XML (RDF/XML) into the internal Ontology model.
 * Parsing is intentionally defensive to handle variations in namespace usage.
 * Complies with W3C RDF Syntax Grammar: https://www.w3.org/TR/rdf-syntax-grammar/
 */
export function parseOWLXML(content: string): Ontology {
  /**
   * DOMParser provides a simple, browser-compatible XML parser.
   * Invalid XML may result in partial or empty documents.
   */
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(content, 'text/xml')

  // Check for parse errors
  const parseError = xmlDoc.querySelector('parsererror')
  if (parseError) {
    throw new Error(`Invalid XML: ${parseError.textContent}`)
  }

  const classes = new Map<string, OntologyClass>()
  const properties = new Map<string, OntologyProperty>()
  const individuals = new Map<string, Individual>()

  // Parse ontology metadata from rdf:RDF root or owl:Ontology element
  const rdfRoot = xmlDoc.querySelector('RDF, rdf\\:RDF')
  const ontologyNode = xmlDoc.querySelector('Ontology, owl\\:Ontology')

  // Extract xml:base from rdf:RDF root element per RDF/XML spec
  const xmlBase =
    rdfRoot?.getAttribute('xml:base') ||
    rdfRoot?.getAttributeNS('http://www.w3.org/XML/1998/namespace', 'base') ||
    ''

  const ontologyId =
    getAttributeNS(ontologyNode, 'about', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#') ||
    xmlBase ||
    'http://example.org/ontology'



  // Parse classes


  const versionInfo =
    ontologyNode?.querySelector('versionInfo, owl\\:versionInfo')?.textContent || undefined


  // Parse owl:imports declarations per W3C OWL specification
  const importNodes = ontologyNode?.querySelectorAll('imports, owl\\:imports') || []
  const imports = Array.from(importNodes)
    .map(node =>
      getAttributeNS(node as Element, 'resource', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
    )
    .filter((imp): imp is string => imp !== null)

  // Parse classes with improved namespace handling
  const classNodes = xmlDoc.querySelectorAll('Class, owl\\:Class')
  classNodes.forEach(node => {
    const id = getAttributeNS(node, 'about', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
    if (!id) {
      return
    }

    /**
     * Labels fall back to the local fragment of the IRI
     * to guarantee a usable display name.
     */
    const label =
      node.querySelector('label, rdfs\\:label')?.textContent ||
      id.split('#').pop() ||
      id.split('/').pop() ||
      id
    const description = node.querySelector('comment, rdfs\\:comment')?.textContent || undefined

    const superClassNodes = node.querySelectorAll('subClassOf, rdfs\\:subClassOf')
    const superClasses = Array.from(superClassNodes)
      .map(n =>
        getAttributeNS(n as Element, 'resource', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
      )
      .filter((sc): sc is string => sc !== null)

    const disjointNodes = node.querySelectorAll('disjointWith, owl\\:disjointWith')
    const disjointWith = Array.from(disjointNodes)
      .map(n =>
        getAttributeNS(n as Element, 'resource', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
      )
      .filter((dw): dw is string => dw !== null)

    const equivalentNodes = node.querySelectorAll('equivalentClass, owl\\:equivalentClass')
    const equivalentTo = Array.from(equivalentNodes)
      .map(n =>
        getAttributeNS(n as Element, 'resource', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
      )
      .filter((eq): eq is string => eq !== null)

    classes.set(id, {
      id,
      name: label,
      label,
      description,
      superClasses,
      annotations: [],
      properties: [],
      disjointWith,
      equivalentTo,
    })
  })

  // Parse properties with improved namespace handling
  const propertyTypes = [
    { name: 'ObjectProperty', internal: 'ObjectProperty' },
    { name: 'DatatypeProperty', internal: 'DataProperty' },
    { name: 'AnnotationProperty', internal: 'AnnotationProperty' },
  ]

  propertyTypes.forEach(({ name: propType, internal: internalType }) => {
    const propNodes = xmlDoc.querySelectorAll(`${propType}, owl\\:${propType}`)
    propNodes.forEach(node => {
      const id = getAttributeNS(node, 'about', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
      if (!id) {
        return
      }

      const label =
        node.querySelector('label, rdfs\\:label')?.textContent ||
        id.split('#').pop() ||
        id.split('/').pop() ||
        id
      const description = node.querySelector('comment, rdfs\\:comment')?.textContent || undefined

      const domainNodes = node.querySelectorAll('domain, rdfs\\:domain')
      const rangeNodes = node.querySelectorAll('range, rdfs\\:range')
      const superPropNodes = node.querySelectorAll('subPropertyOf, rdfs\\:subPropertyOf')

      properties.set(id, {
        id,
        name: label,
        label,
        description,
        type: internalType as 'ObjectProperty' | 'DataProperty' | 'AnnotationProperty',
        domain: Array.from(domainNodes)
          .map(n =>
            getAttributeNS(n as Element, 'resource', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
          )
          .filter((d): d is string => d !== null),
        range: Array.from(rangeNodes)
          .map(n =>
            getAttributeNS(n as Element, 'resource', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
          )
          .filter((r): r is string => r !== null),
        superProperties: Array.from(superPropNodes)
          .map(n =>
            getAttributeNS(n as Element, 'resource', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
          )
          .filter((sp): sp is string => sp !== null),
        characteristics: [],
        annotations: [],
      })
    })
  })

  // Parse individuals with improved namespace handling
  // Individuals can be represented in multiple ways in RDF/XML:
  // 1. <owl:NamedIndividual rdf:about="...">
  // 2. <ClassName rdf:about="..."> where ClassName is a class IRI
  // 3. Elements with rdf:type pointing to a class
  const individualNodes = xmlDoc.querySelectorAll('NamedIndividual, owl\\:NamedIndividual')
  individualNodes.forEach(node => {
    const rawId = getAttributeNS(node, 'about', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
    if (!rawId) {
      return
    }

    // Resolve relative IRIs against xml:base
    const id = resolveIRI(rawId, xmlBase)

    const label =
      node.querySelector('label, rdfs\\:label')?.textContent ||
      id.split('#').pop() ||
      id.split('/').pop() ||
      id

    const typeNodes = node.querySelectorAll('type, rdf\\:type')
    const types = Array.from(typeNodes)
      .map(n => {
        const rawType = getAttributeNS(
          n as Element,
          'resource',
          'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
        )
        return rawType ? resolveIRI(rawType, xmlBase) : null
      })
      .filter((t): t is string => t !== null)

    const sameAsNodes = node.querySelectorAll('sameAs, owl\\:sameAs')
    const sameAs = Array.from(sameAsNodes)
      .map(n => {
        const rawSameAs = getAttributeNS(
          n as Element,
          'resource',
          'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
        )
        return rawSameAs ? resolveIRI(rawSameAs, xmlBase) : null
      })
      .filter((sa): sa is string => sa !== null)

    const differentFromNodes = node.querySelectorAll('differentFrom, owl\\:differentFrom')
    const differentFrom = Array.from(differentFromNodes)
      .map(n => {
        const rawDiff = getAttributeNS(
          n as Element,
          'resource',
          'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
        )
        return rawDiff ? resolveIRI(rawDiff, xmlBase) : null
      })
      .filter((df): df is string => df !== null)

    individuals.set(id, {
      id,
      name: label,
      label,
      types,
      propertyAssertions: [],
      annotations: [],
      sameAs,
      differentFrom,
    })
  })

  // Also parse individuals that are represented as typed elements
  // This handles cases where individuals are declared as <ClassName rdf:about="...">
  const allElements = xmlDoc.querySelectorAll('[rdf\\:about], [about]')
  allElements.forEach(node => {
    const rawId = getAttributeNS(node, 'about', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
    if (!rawId) {
      return
    }

    // Resolve relative IRIs against xml:base
    const id = resolveIRI(rawId, xmlBase)

    // Skip if already processed
    if (individuals.has(id) || classes.has(id) || properties.has(id)) {
      return
    }

    // Check if this element has rdf:type or is a typed node
    const tagName = node.tagName
    const typeNodes = node.querySelectorAll('type, rdf\\:type')
    const types = Array.from(typeNodes)
      .map(n => {
        const rawType = getAttributeNS(
          n as Element,
          'resource',
          'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
        )
        return rawType ? resolveIRI(rawType, xmlBase) : null
      })
      .filter((t): t is string => t !== null)

    // If element has types or is not a known ontology construct, treat as individual
    const isOntologyConstruct =
      tagName.includes('Ontology') ||
      tagName.includes('Class') ||
      tagName.includes('Property') ||
      tagName === 'RDF' ||
      tagName === 'rdf:RDF'

    if (types.length > 0 || (!isOntologyConstruct && id)) {
      const label =
        node.querySelector('label, rdfs\\:label')?.textContent ||
        id.split('#').pop() ||
        id.split('/').pop() ||
        id

      const sameAsNodes = node.querySelectorAll('sameAs, owl\\:sameAs')
      const sameAs = Array.from(sameAsNodes)
        .map(n => {
          const rawSameAs = getAttributeNS(
            n as Element,
            'resource',
            'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
          )
          return rawSameAs ? resolveIRI(rawSameAs, xmlBase) : null
        })
        .filter((sa): sa is string => sa !== null)

      const differentFromNodes = node.querySelectorAll('differentFrom, owl\\:differentFrom')
      const differentFrom = Array.from(differentFromNodes)
        .map(n => {
          const rawDiff = getAttributeNS(
            n as Element,
            'resource',
            'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
          )
          return rawDiff ? resolveIRI(rawDiff, xmlBase) : null
        })
        .filter((df): df is string => df !== null)

      individuals.set(id, {
        id,
        name: label,
        label,
        types,
        propertyAssertions: [],
        annotations: [],
        sameAs,
        differentFrom,
      })
    }
  })

  return {
    id: ontologyId,
    name: ontologyId.split('#').pop() || ontologyId.split('/').pop() || 'Imported Ontology',
    version: versionInfo,
    imports, // Include parsed owl:imports per W3C OWL specification
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


  lines.forEach((line): void => {
  

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
  const data: unknown = JSON.parse(content)

  const classes = new Map<string, OntologyClass>()
  const properties = new Map<string, OntologyProperty>()
  const individuals = new Map<string, Individual>()

  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid JSON-LD content')
  }

  const root = data as Record<string, unknown>
  const graph = Array.isArray(root['@graph']) ? root['@graph'] : [root]

  graph.forEach((item: unknown): void => {
    if (typeof item !== 'object' || item === null) return

    const record = item as Record<string, JSONLDValue>
    const id = record['@id']
    const type = record['@type']

    if (typeof id !== 'string') return

    /* ---------- Classes ---------- */
    if (type === 'owl:Class' || (typeof type === 'string' && type.includes('Class'))) {
      const label =
        record['rdfs:label'] ??
        id.split('#').pop() ??
        id.split('/').pop() ??
        id

      const superClasses: string[] = Array.isArray(record['rdfs:subClassOf'])
        ? record['rdfs:subClassOf']
            .map(v => (typeof v === 'string' ? v : v?.['@id']))
            .filter((v): v is string => Boolean(v))
        : record['rdfs:subClassOf']
          ? [
              typeof record['rdfs:subClassOf'] === 'string'
                ? record['rdfs:subClassOf']
                : record['rdfs:subClassOf']['@id'],
            ].filter((v): v is string => Boolean(v))
          : []

      classes.set(id, {
        id,
        name: label,
        label,
        description: record['rdfs:comment'] as string | undefined,
        superClasses,
        disjointWith: [],
        equivalentTo: [],
        annotations: [],
        properties: [],
      })
      return
    }

    /* ---------- Properties ---------- */
    if (typeof type === 'string' && type.includes('Property')) {
      const propType: 'ObjectProperty' | 'DataProperty' | 'AnnotationProperty' =
        type.includes('Object')
          ? 'ObjectProperty'
          : type.includes('Data')
            ? 'DataProperty'
            : 'AnnotationProperty'

      const label =
        record['rdfs:label'] ??
        id.split('#').pop() ??
        id.split('/').pop() ??
        id

      const extractIds = (value?: JSONLDValue): string[] =>
        Array.isArray(value)
          ? value
              .map(v => (typeof v === 'string' ? v : v?.['@id']))
              .filter((v): v is string => Boolean(v))
          : value
            ? [typeof value === 'string' ? value : value['@id']].filter(
                (v): v is string => Boolean(v)
              )
            : []

      properties.set(id, {
        id,
        name: label,
        label,
        description: record['rdfs:comment'] as string | undefined,
        type: propType,
        domain: extractIds(record['rdfs:domain']),
        range: extractIds(record['rdfs:range']),
        superProperties: [],
        characteristics: [],
        annotations: [],
      })
    }
  })

  const imports: string[] = Array.isArray(root['owl:imports'])
    ? root['owl:imports']
        .map(v => (typeof v === 'string' ? v : v?.['@id']))
        .filter((v): v is string => Boolean(v))
    : root['owl:imports']
      ? [
          typeof root['owl:imports'] === 'string'
            ? root['owl:imports']
            : (root['owl:imports'] as { '@id'?: string })['@id'],
        ].filter((v): v is string => Boolean(v))
      : []

  return {
    id: (root['@id'] as string) || 'http://example.org/imported-ontology',
    name: (root['rdfs:label'] as string) || 'Imported Ontology',
    version: root['owl:versionInfo'] as string | undefined,
    imports,
    classes,
    properties,
    individuals,
    annotations: [],
  }
}



/**
 * Validate that an ontology conforms to W3C RDF/OWL standards.
 * Returns an array of validation errors, empty if valid.
 */
export function validateOntology(ontology: Ontology): string[] {
  const errors: string[] = []

  // Validate ontology IRI format
  if (!ontology.id || !ontology.id.startsWith('http')) {
    errors.push('Ontology IRI must be a valid HTTP(S) URI')
  }

  // Validate class IRIs
  ontology.classes.forEach((cls, id) => {
    if (!id.startsWith('http')) {
      errors.push(`Class ${cls.name} has invalid IRI: ${id}`)
    }
    // Check that superclasses exist or are valid IRIs
    cls.superClasses.forEach(sc => {
      if (!sc.startsWith('http') && !sc.startsWith('owl:') && !sc.startsWith('rdfs:')) {
        errors.push(`Class ${cls.name} references invalid superclass: ${sc}`)
      }
    })
  })

  // Validate property IRIs
  ontology.properties.forEach((prop, id) => {
    if (!id.startsWith('http')) {
      errors.push(`Property ${prop.name} has invalid IRI: ${id}`)
    }
    // Validate domain and range
    prop.domain.forEach(d => {
      if (
        !d.startsWith('http') &&
        !d.startsWith('owl:') &&
        !d.startsWith('rdfs:') &&
        !d.startsWith('xsd:')
      ) {
        errors.push(`Property ${prop.name} has invalid domain: ${d}`)
      }
    })
    prop.range.forEach(r => {
      if (
        !r.startsWith('http') &&
        !r.startsWith('owl:') &&
        !r.startsWith('rdfs:') &&
        !r.startsWith('xsd:')
      ) {
        errors.push(`Property ${prop.name} has invalid range: ${r}`)
      }
    })
  })

  // Validate individual IRIs
  ontology.individuals.forEach((ind, id) => {
    if (!id.startsWith('http')) {
      errors.push(`Individual ${ind.name} has invalid IRI: ${id}`)
    }
    // Check that types exist or are valid IRIs
    ind.types.forEach(t => {
      if (!t.startsWith('http') && !t.startsWith('owl:') && !t.startsWith('rdfs:')) {
        errors.push(`Individual ${ind.name} references invalid type: ${t}`)
      }
    })
  })

  // Validate imports are valid IRIs
  ontology.imports.forEach(imp => {
    if (!imp.startsWith('http')) {
      errors.push(`Invalid import IRI: ${imp}`)
    }
  })

  return errors
}

export const parseFromJSONLD = parseJSONLD
export const parseFromOWLXML = parseOWLXML
export const parseFromTurtle = parseTurtle
