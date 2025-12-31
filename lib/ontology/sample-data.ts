import type { Ontology, OntologyClass, OntologyProperty, Individual } from "./types"

export function createSampleOntology(): Ontology {
  const classes = new Map<string, OntologyClass>()
  const properties = new Map<string, OntologyProperty>()
  const individuals = new Map<string, Individual>()

  // Top-level classes
  const thing: OntologyClass = {
    id: "owl:Thing",
    name: "Thing",
    label: "Thing",
    description: "The root class of all classes",
    superClasses: [],
    annotations: [],
    properties: [],
    disjointWith: [],
    equivalentTo: [],
  }

  const person: OntologyClass = {
    id: "Person",
    name: "Person",
    label: "Person",
    description: "A human being",
    superClasses: ["owl:Thing"],
    annotations: [{ property: "rdfs:comment", value: "Represents a human person" }],
    properties: ["hasName", "hasAge", "hasEmail"],
    disjointWith: ["Organization"],
    equivalentTo: [],
  }

  const organization: OntologyClass = {
    id: "Organization",
    name: "Organization",
    label: "Organization",
    description: "An organized group",
    superClasses: ["owl:Thing"],
    annotations: [{ property: "rdfs:comment", value: "Represents an organization" }],
    properties: ["hasName", "foundedIn"],
    disjointWith: ["Person"],
    equivalentTo: [],
  }

  const employee: OntologyClass = {
    id: "Employee",
    name: "Employee",
    label: "Employee",
    description: "A person employed by an organization",
    superClasses: ["Person"],
    annotations: [],
    properties: ["worksFor", "hasJobTitle"],
    disjointWith: [],
    equivalentTo: [],
  }

  classes.set(thing.id, thing)
  classes.set(person.id, person)
  classes.set(organization.id, organization)
  classes.set(employee.id, employee)

  // Properties
  const hasName: OntologyProperty = {
    id: "hasName",
    name: "hasName",
    label: "has name",
    type: "DataProperty",
    domain: ["owl:Thing"],
    range: ["xsd:string"],
    superProperties: [],
    characteristics: ["Functional"],
    annotations: [{ property: "rdfs:comment", value: "The name of an entity" }],
  }

  const hasAge: OntologyProperty = {
    id: "hasAge",
    name: "hasAge",
    label: "has age",
    type: "DataProperty",
    domain: ["Person"],
    range: ["xsd:integer"],
    superProperties: [],
    characteristics: ["Functional"],
    annotations: [],
  }

  const worksFor: OntologyProperty = {
    id: "worksFor",
    name: "worksFor",
    label: "works for",
    type: "ObjectProperty",
    domain: ["Employee"],
    range: ["Organization"],
    superProperties: [],
    characteristics: [],
    annotations: [{ property: "rdfs:comment", value: "Relates an employee to their employer" }],
  }

  properties.set(hasName.id, hasName)
  properties.set(hasAge.id, hasAge)
  properties.set(worksFor.id, worksFor)

  // Individuals
  const john: Individual = {
    id: "john_doe",
    name: "john_doe",
    label: "John Doe",
    types: ["Employee"],
    propertyAssertions: [
      { property: "hasName", value: "John Doe" },
      { property: "hasAge", value: 30 },
    ],
    annotations: [],
    sameAs: [],
    differentFrom: [],
  }

  individuals.set(john.id, john)

  return {
    id: "http://example.org/ontology",
    name: "Example Ontology",
    version: "1.0.0",
    imports: [],
    classes,
    properties,
    individuals,
    annotations: [
      { property: "rdfs:label", value: "Example Ontology" },
      { property: "rdfs:comment", value: "A sample ontology for demonstration" },
    ],
  }
}
