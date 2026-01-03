import {
  OntologySearch,
  getEntityType,
  getDisplayName,
  type SearchOptions,
} from '../search';
import type {
  Ontology,
  OntologyClass,
  OntologyProperty,
  Individual,
} from '../types';

describe('OntologySearch', () => {
  let ontology: Ontology;
  let search: OntologySearch;

  beforeEach(() => {
    // Create mock ontology with test data
    ontology = {
      id: 'test-ontology',
      name: 'Test Ontology',
      imports: [],
      classes: new Map<string, OntologyClass>([
        [
          'Person',
          {
            id: 'Person',
            name: 'Person',
            label: 'Human Person',
            description: 'A human being',
            superClasses: ['Thing'],
            properties: [],
            disjointWith: [],
            equivalentTo: [],
            annotations: [],
          },
        ],
        [
          'Student',
          {
            id: 'Student',
            name: 'Student',
            label: 'Student',
            description: 'A person who studies',
            superClasses: ['Person'],
            properties: [],
            disjointWith: [],
            equivalentTo: [],
            annotations: [
              { property: 'rdfs:comment', value: 'Educational person' },
            ],
          },
        ],
        [
          'Teacher',
          {
            id: 'Teacher',
            name: 'Teacher',
            label: 'Educator',
            description: 'A person who teaches',
            superClasses: ['Person'],
            properties: [],
            disjointWith: [],
            equivalentTo: [],
            annotations: [],
          },
        ],
      ]),
      properties: new Map<string, OntologyProperty>([
        [
          'hasAge',
          {
            id: 'hasAge',
            name: 'hasAge',
            label: 'Has Age',
            description: 'Age of a person',
            type: 'DataProperty',
            domain: ['Person'],
            range: ['xsd:integer'],
            superProperties: [],
            characteristics: [],
            annotations: [],
          },
        ],
        [
          'teaches',
          {
            id: 'teaches',
            name: 'teaches',
            label: 'Teaches Course',
            description: 'Course taught by teacher',
            type: 'ObjectProperty',
            domain: ['Teacher'],
            range: ['Course'],
            superProperties: [],
            characteristics: [],
            annotations: [],
          },
        ],
      ]),
      individuals: new Map<string, Individual>([
        [
          'john',
          {
            id: 'john',
            name: 'john',
            label: 'John Doe',
            types: ['Person', 'Student'],
            propertyAssertions: [],
            annotations: [],
            sameAs: [],
            differentFrom: [],
          },
        ],
        [
          'jane',
          {
            id: 'jane',
            name: 'jane',
            label: 'Jane Smith',
            types: ['Person', 'Teacher'],
            propertyAssertions: [],
            annotations: [],
            sameAs: [],
            differentFrom: [],
          },
        ],
      ]),
      annotations: [],
    };

    search = new OntologySearch(ontology);
  });

  describe('search()', () => {
    it('should return empty array for empty query', () => {
      expect(search.search('')).toEqual([]);
      expect(search.search('   ')).toEqual([]);
    });

    it('should search across all entity types', () => {
      const results = search.search('person');
      expect(results.length).toBeGreaterThan(0);

      const entityTypes = results.map((r) => getEntityType(r.entity));
      expect(entityTypes).toContain('class');
      expect(entityTypes).toContain('individual');
    });

    it('should return results sorted by score descending', () => {
      const results = search.search('person');
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
      }
    });

    it('should respect maxResults option', () => {
      const results = search.search('person', { maxResults: 2 });
      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('should respect entityTypes filter', () => {
      const classResults = search.search('person', {
        entityTypes: ['class'],
      });
      expect(classResults.every((r) => getEntityType(r.entity) === 'class')).toBe(true);

      const individualResults = search.search('person', {
        entityTypes: ['individual'],
      });
      expect(
        individualResults.every((r) => getEntityType(r.entity) === 'individual')
      ).toBe(true);
    });

    it('should respect minScore option', () => {
      const results = search.search('person', { minScore: 50 });
      expect(results.every((r) => r.score >= 50)).toBe(true);
    });

    it('should use cache for repeated queries', () => {
      const results1 = search.search('person');
      const results2 = search.search('person');
      expect(results1).toEqual(results2);

      const stats = search.getCacheStats();
      expect(stats.size).toBeGreaterThan(0);
      expect(stats.enabled).toBe(true);
    });

    it('should handle case sensitivity', () => {
      const caseInsensitive = search.search('PERSON');
      expect(caseInsensitive.length).toBeGreaterThan(0);

      const caseSensitive = search.search('PERSON', { caseSensitive: true });
      expect(caseSensitive.length).toBe(0);
    });
  });

  describe('searchClasses()', () => {
    it('should find classes by name', () => {
      const results = search.searchClasses('Student');
      expect(results.length).toBe(1);
      expect(results[0].entity.name).toBe('Student');
    });

    it('should find classes by label', () => {
      const results = search.searchClasses('Educator');
      expect(results.length).toBe(1);
      expect(results[0].entity.id).toBe('Teacher');
    });

    it('should find classes by description', () => {
      const results = search.searchClasses('human being');
      expect(results.length).toBe(1);
      expect(results[0].entity.id).toBe('Person');
    });

    it('should search in annotations', () => {
      const results = search.searchClasses('Educational', {
        fields: ['annotations'],
      });
      expect(results.length).toBe(1);
      expect(results[0].entity.id).toBe('Student');
    });

    it('should score exact matches higher than partial matches', () => {
      const exactMatch = search.searchClasses('Student');
      const partialMatch = search.searchClasses('stud');

      if (exactMatch.length > 0 && partialMatch.length > 0) {
        expect(exactMatch[0].score).toBeGreaterThan(partialMatch[0].score);
      }
    });

    it('should include matched fields in results', () => {
      const results = search.searchClasses('person');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].matchedFields.length).toBeGreaterThan(0);
    });
  });

  describe('searchProperties()', () => {
    it('should find properties by name', () => {
      const results = search.searchProperties('hasAge');
      expect(results.length).toBe(1);
      expect(results[0].entity.name).toBe('hasAge');
    });

    it('should find properties by label', () => {
      const results = search.searchProperties('Has Age');
      expect(results.length).toBe(1);
      expect(results[0].entity.id).toBe('hasAge');
    });

    it('should find properties by type', () => {
      const results = search.searchProperties('DataProperty');
      expect(results.length).toBe(1);
      expect(results[0].entity.id).toBe('hasAge');
    });

    it('should search in domain and range', () => {
      const domainResults = search.searchProperties('Teacher', {
        fields: ['domain'],
      });
      expect(domainResults.some((r) => r.entity.id === 'teaches')).toBe(true);

      const rangeResults = search.searchProperties('Course', {
        fields: ['range'],
      });
      expect(rangeResults.some((r) => r.entity.id === 'teaches')).toBe(true);
    });

    it('should resolve and search class names in domain', () => {
      // Search by resolved class name "Teacher" (not just the ID)
      const results = search.searchProperties('Teacher', {
        fields: ['domain'],
      });
      expect(results.some((r) => r.entity.id === 'teaches')).toBe(true);

      // Also search by class label if it exists
      const eduResults = search.searchProperties('Educator', {
        fields: ['domain'],
      });
      expect(eduResults.some((r) => r.entity.id === 'teaches')).toBe(true);
    });

    it('should resolve and search class names in range', () => {
      // Add a property with a class that has a different label
      ontology.classes.set('Course', {
        id: 'Course',
        name: 'Course',
        label: 'Educational Course',
        description: 'A course of study',
        superClasses: ['Thing'],
        properties: [],
        disjointWith: [],
        equivalentTo: [],
        annotations: [],
      });

      const newSearch = new OntologySearch(ontology);

      // Search by class name
      const nameResults = newSearch.searchProperties('Course', {
        fields: ['range'],
      });
      expect(nameResults.some((r) => r.entity.id === 'teaches')).toBe(true);

      // Search by class label
      const labelResults = newSearch.searchProperties('Educational', {
        fields: ['range'],
      });
      expect(labelResults.some((r) => r.entity.id === 'teaches')).toBe(true);
    });

    it('should filter by specific fields', () => {
      const nameOnly = search.searchProperties('teaches', {
        fields: ['name'],
      });
      expect(nameOnly.length).toBe(1);

      const labelOnly = search.searchProperties('xyz123nonexistent', {
        fields: ['label'],
      });
      expect(labelOnly.length).toBe(0);

      // Label "Teaches Course" contains "teaches", so searching label field should find it
      const labelMatch = search.searchProperties('teaches', {
        fields: ['label'],
      });
      expect(labelMatch.length).toBe(1);
    });
  });

  describe('searchIndividuals()', () => {
    it('should find individuals by name', () => {
      const results = search.searchIndividuals('john');
      expect(results.length).toBe(1);
      expect(results[0].entity.name).toBe('john');
    });

    it('should find individuals by label', () => {
      const results = search.searchIndividuals('John Doe');
      expect(results.length).toBe(1);
      expect(results[0].entity.id).toBe('john');
    });

    it('should find individuals by type', () => {
      const results = search.searchIndividuals('Student');
      expect(results.length).toBe(1);
      expect(results[0].entity.id).toBe('john');
    });

    it('should match multiple types', () => {
      const personResults = search.searchIndividuals('Person', {
        fields: ['types'],
      });
      expect(personResults.length).toBe(2);
    });

    it('should resolve and search class names in types', () => {
      // Search by resolved class name
      const studentResults = search.searchIndividuals('Student', {
        fields: ['types'],
      });
      expect(studentResults.some((r) => r.entity.id === 'john')).toBe(true);

      // Search by class label ("Educator" is the label for "Teacher" class)
      const educatorResults = search.searchIndividuals('Educator', {
        fields: ['types'],
      });
      expect(educatorResults.some((r) => r.entity.id === 'jane')).toBe(true);
    });

    it('should search both type ID and resolved class label', () => {
      // Search by the label "Human Person" (label of Person class)
      const humanResults = search.searchIndividuals('Human', {
        fields: ['types'],
      });
      expect(humanResults.length).toBe(2); // Both john and jane are type Person
    });
  });

  describe('scoring algorithm', () => {
    it('should score exact matches highest', () => {
      const results = search.searchClasses('Student');
      const exactMatch = results.find((r) => r.entity.name === 'Student');
      expect(exactMatch).toBeDefined();
      if (exactMatch) {
        const otherMatches = results.filter((r) => r.entity.name !== 'Student');
        otherMatches.forEach((other) => {
          expect(exactMatch.score).toBeGreaterThan(other.score);
        });
      }
    });

    it('should score starts-with matches higher than contains', () => {
      // Add a class that contains "person" but doesn't start with it
      ontology.classes.set('SalesPerson', {
        id: 'SalesPerson',
        name: 'SalesPerson',
        label: 'Sales Person',
        superClasses: ['Person'],
        properties: [],
        disjointWith: [],
        equivalentTo: [],
        annotations: [],
      });

      const newSearch = new OntologySearch(ontology);
      const results = newSearch.searchClasses('person');

      const startsWithMatch = results.find((r) => r.entity.name === 'Person');
      const containsMatch = results.find((r) => r.entity.name === 'SalesPerson');

      expect(startsWithMatch).toBeDefined();
      expect(containsMatch).toBeDefined();
      if (startsWithMatch && containsMatch) {
        expect(startsWithMatch.score).toBeGreaterThan(containsMatch.score);
      }
    });

    it('should score name matches higher than description matches', () => {
      const results = search.searchClasses('student');
      const nameMatch = results.find((r) => r.entity.name === 'Student');
      expect(nameMatch).toBeDefined();

      // Student has the word in name, others might have it in description
      const otherMatches = results.filter((r) => {
        return (
          r.entity.name !== 'Student' &&
          r.matchedFields.includes('description') &&
          !r.matchedFields.includes('name')
        );
      });

      otherMatches.forEach((other) => {
        if (nameMatch) {
          expect(nameMatch.score).toBeGreaterThan(other.score);
        }
      });
    });
  });

  describe('fuzzy matching', () => {
    it('should find fuzzy matches when enabled', () => {
      const results = search.searchClasses('Studnt', { fuzzyMatch: true });
      expect(results.some((r) => r.entity.name === 'Student')).toBe(true);
    });

    it('should not find fuzzy matches when disabled', () => {
      const results = search.searchClasses('Studnt', { fuzzyMatch: false });
      expect(results.length).toBe(0);
    });

    it('should score closer fuzzy matches higher', () => {
      const close = search.searchClasses('Stuent', { fuzzyMatch: true });
      const far = search.searchClasses('Stxxxx', { fuzzyMatch: true });

      const closeMatch = close.find((r) => r.entity.name === 'Student');
      const farMatch = far.find((r) => r.entity.name === 'Student');

      if (closeMatch && farMatch) {
        expect(closeMatch.score).toBeGreaterThan(farMatch.score);
      }
    });
  });

  describe('cache management', () => {
    it('should cache results', () => {
      search.search('person');
      const stats = search.getCacheStats();
      expect(stats.size).toBe(1);
    });

    it('should use different cache keys for different options', () => {
      search.search('person', { entityTypes: ['class'] });
      search.search('person', { entityTypes: ['individual'] });
      const stats = search.getCacheStats();
      expect(stats.size).toBe(2);
    });

    it('should clear cache', () => {
      search.search('person');
      expect(search.getCacheStats().size).toBe(1);
      search.clearCache();
      expect(search.getCacheStats().size).toBe(0);
    });

    it('should clear cache when ontology is updated', () => {
      search.search('person');
      expect(search.getCacheStats().size).toBe(1);
      search.updateOntology(ontology);
      expect(search.getCacheStats().size).toBe(0);
    });

    it('should work with cache disabled', () => {
      const uncachedSearch = new OntologySearch(ontology, false);
      const results = uncachedSearch.search('person');
      expect(results.length).toBeGreaterThan(0);
      expect(uncachedSearch.getCacheStats().size).toBe(0);
      expect(uncachedSearch.getCacheStats().enabled).toBe(false);
    });
  });

  describe('helper functions', () => {
    describe('getEntityType()', () => {
      it('should identify class entities', () => {
        const person = ontology.classes.get('Person')!;
        expect(getEntityType(person)).toBe('class');
      });

      it('should identify property entities', () => {
        const hasAge = ontology.properties.get('hasAge')!;
        expect(getEntityType(hasAge)).toBe('property');
      });

      it('should identify individual entities', () => {
        const john = ontology.individuals.get('john')!;
        expect(getEntityType(john)).toBe('individual');
      });
    });

    describe('getDisplayName()', () => {
      it('should prefer label over name', () => {
        const person = ontology.classes.get('Person')!;
        expect(getDisplayName(person)).toBe('Human Person');
      });

      it('should fallback to name when label is undefined', () => {
        const classWithoutLabel: OntologyClass = {
          id: 'Thing',
          name: 'Thing',
          superClasses: [],
          properties: [],
          disjointWith: [],
          equivalentTo: [],
          annotations: [],
        };
        expect(getDisplayName(classWithoutLabel)).toBe('Thing');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty ontology', () => {
      const emptyOntology: Ontology = {
        id: 'empty',
        name: 'Empty',
        imports: [],
        classes: new Map(),
        properties: new Map(),
        individuals: new Map(),
        annotations: [],
      };
      const emptySearch = new OntologySearch(emptyOntology);
      expect(emptySearch.search('anything')).toEqual([]);
    });

    it('should handle special characters in query', () => {
      const results = search.search('Person@#$%');
      expect(results).toEqual([]);
    });

    it('should handle very long queries', () => {
      const longQuery = 'a'.repeat(1000);
      const results = search.search(longQuery);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle entities with undefined optional fields', () => {
      const minimalClass: OntologyClass = {
        id: 'Minimal',
        name: 'Minimal',
        superClasses: [],
        properties: [],
        disjointWith: [],
        equivalentTo: [],
        annotations: [],
      };
      ontology.classes.set('Minimal', minimalClass);
      const newSearch = new OntologySearch(ontology);
      const results = newSearch.searchClasses('Minimal');
      expect(results.length).toBe(1);
    });

    it('should handle empty arrays in entity fields', () => {
      const results = search.searchProperties('hasAge');
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
