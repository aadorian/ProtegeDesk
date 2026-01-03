# OntologySearch Usage Guide

## Overview

The `OntologySearch` class provides a comprehensive, type-safe search solution for ProtegeDesk's ontology entities (classes, properties, and individuals).

## Features

- **Fast searching** with O(1) lookups using ontology Maps
- **Relevance scoring** with configurable weights for different fields
- **Fuzzy matching** using Levenshtein distance for typo tolerance
- **Field-specific filtering** to search only specific entity attributes
- **Class name resolution** - automatically searches resolved class names/labels in property domain/range and individual types
- **Caching** for improved performance on repeated queries
- **Type safety** with full TypeScript support
- **Comprehensive testing** with 48 unit tests

## Basic Usage

### 1. Create a Search Instance

```typescript
import { OntologySearch } from '@/lib/ontology/search';
import { useOntology } from '@/lib/ontology/context';

// In a React component
const { ontology } = useOntology();
const search = new OntologySearch(ontology);
```

### 2. Search Across All Entity Types

```typescript
// Simple search
const results = search.search('Person');

// Results are sorted by relevance score
results.forEach(result => {
  console.log(result.entity.name);       // Entity name
  console.log(result.score);              // Relevance score
  console.log(result.matchedFields);      // Fields that matched
});
```

### 3. Search Specific Entity Types

```typescript
// Search only classes
const classes = search.searchClasses('Person');

// Search only properties
const properties = search.searchProperties('hasAge');

// Search only individuals
const individuals = search.searchIndividuals('John');
```

## Advanced Options

### Filter by Entity Type

```typescript
const results = search.search('Person', {
  entityTypes: ['class', 'individual'], // Exclude properties
});
```

### Limit Results

```typescript
const results = search.search('Person', {
  maxResults: 10,        // Return top 10 matches
  minScore: 5,           // Only return results with score >= 5
});
```

### Search Specific Fields

```typescript
const results = search.searchClasses('education', {
  fields: ['description', 'annotations'], // Only search these fields
});
```

### Case Sensitivity

```typescript
// Case-insensitive (default)
const insensitive = search.search('person');

// Case-sensitive
const sensitive = search.search('Person', {
  caseSensitive: true,
});
```

### Fuzzy Matching

```typescript
// Enable fuzzy matching for typo tolerance
const results = search.search('Stuent', {  // Typo: "Student"
  fuzzyMatch: true,
});
// Will match "Student" with lower score
```

### Class Name Resolution (Smart Search)

The search automatically resolves and searches class names/labels in relational fields:

```typescript
// When searching properties, searches BOTH the class ID AND the resolved class name/label
const props = search.searchProperties('Teacher', {
  fields: ['domain'],  // Finds properties where domain class is "Teacher"
});
// This will find properties like "teaches" even if domain is stored as ID

// When searching individuals, searches BOTH the type ID AND the resolved class name/label
const individuals = search.searchIndividuals('Student', {
  fields: ['types'],  // Finds individuals of type "Student"
});
// Works with both class IDs and human-readable labels

// Example: If "Teacher" class has label "Educator", both queries work:
search.searchProperties('Teacher');   // Matches by class name
search.searchProperties('Educator');  // Also matches by class label!
```

## Integration Examples

### Example 1: Update PropertyList Component

```typescript
// components/ontology/property-list.tsx
'use client';

import { useState, useMemo } from 'react';
import { useOntology } from '@/lib/ontology/context';
import { OntologySearch } from '@/lib/ontology/search';
import { Input } from '@/components/ui/input';

export function PropertyList() {
  const { ontology, selectedProperty, setSelectedProperty } = useOntology();
  const [searchQuery, setSearchQuery] = useState('');

  // Create search instance with cache
  const search = useMemo(() => new OntologySearch(ontology), [ontology]);

  // Get filtered properties using search class
  const filteredProperties = useMemo(() => {
    if (!searchQuery) {
      return Array.from(ontology.properties.values());
    }

    const results = search.searchProperties(searchQuery, {
      maxResults: 100, // Limit for performance
    });

    return results.map(r => r.entity);
  }, [searchQuery, ontology.properties, search]);

  return (
    <div className="flex flex-col h-full">
      <Input
        type="text"
        placeholder="Search properties..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      {/* Rest of component */}
    </div>
  );
}
```

### Example 2: Update IndividualList Component

```typescript
// components/ontology/individual-list.tsx
'use client';

import { useState, useMemo } from 'react';
import { useOntology } from '@/lib/ontology/context';
import { OntologySearch } from '@/lib/ontology/search';

export function IndividualList() {
  const { ontology } = useOntology();
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<'none' | 'type'>('type');

  const search = useMemo(() => new OntologySearch(ontology), [ontology]);

  const filteredIndividuals = useMemo(() => {
    if (!searchQuery) {
      return Array.from(ontology.individuals.values());
    }

    const results = search.searchIndividuals(searchQuery, {
      maxResults: 100,
      fields: ['name', 'label', 'types'], // Search name, label, and types
    });

    return results.map(r => r.entity);
  }, [searchQuery, ontology.individuals, search]);

  // Group by type if needed
  const groupedIndividuals = useMemo(() => {
    if (groupBy === 'none') return { All: filteredIndividuals };

    const groups: Record<string, typeof filteredIndividuals> = {};
    filteredIndividuals.forEach(individual => {
      const type = individual.types[0] || 'Untyped';
      if (!groups[type]) groups[type] = [];
      groups[type].push(individual);
    });
    return groups;
  }, [filteredIndividuals, groupBy]);

  // Rest of component...
}
```

### Example 3: Global Search Component

```typescript
// components/ontology/global-search.tsx
'use client';

import { useState, useMemo } from 'react';
import { useOntology } from '@/lib/ontology/context';
import { OntologySearch, getEntityType, getDisplayName } from '@/lib/ontology/search';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function GlobalSearch() {
  const { ontology, setSelectedClass, setSelectedProperty, setSelectedIndividual } = useOntology();
  const [searchQuery, setSearchQuery] = useState('');

  const search = useMemo(() => new OntologySearch(ontology), [ontology]);

  const results = useMemo(() => {
    if (!searchQuery) return [];

    return search.search(searchQuery, {
      maxResults: 20,
      fuzzyMatch: true, // Enable typo tolerance
    });
  }, [searchQuery, search]);

  const handleSelect = (result: typeof results[0]) => {
    const type = getEntityType(result.entity);

    if (type === 'class') {
      setSelectedClass(result.entity.id);
    } else if (type === 'property') {
      setSelectedProperty(result.entity.id);
    } else {
      setSelectedIndividual(result.entity.id);
    }
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search classes, properties, individuals..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border rounded-md shadow-lg max-h-96 overflow-y-auto z-50">
          {results.map((result, idx) => {
            const type = getEntityType(result.entity);
            return (
              <button
                key={`${type}-${result.entity.id}-${idx}`}
                onClick={() => handleSelect(result)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{getDisplayName(result.entity)}</div>
                  <div className="text-sm text-gray-500">
                    Matched: {result.matchedFields.join(', ')}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{type}</Badge>
                  <span className="text-xs text-gray-400">
                    {Math.round(result.score)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

### Example 4: Using with React Hook

```typescript
// hooks/use-ontology-search.ts
import { useMemo } from 'react';
import { useOntology } from '@/lib/ontology/context';
import { OntologySearch, type SearchOptions } from '@/lib/ontology/search';

export function useOntologySearch() {
  const { ontology } = useOntology();

  const search = useMemo(() => {
    return new OntologySearch(ontology, true); // Enable cache
  }, [ontology]);

  return search;
}

// Usage in components
import { useOntologySearch } from '@/hooks/use-ontology-search';

function MyComponent() {
  const search = useOntologySearch();
  const results = search.search('Person');
  // ...
}
```

## Cache Management

```typescript
// Create search with cache enabled (default)
const search = new OntologySearch(ontology, true);

// Check cache statistics
const stats = search.getCacheStats();
console.log(stats.size);      // Number of cached queries
console.log(stats.enabled);   // Whether cache is enabled

// Clear cache when needed
search.clearCache();

// Update ontology reference (automatically clears cache)
search.updateOntology(newOntology);

// Disable cache for real-time searches
const uncachedSearch = new OntologySearch(ontology, false);
```

## Scoring Algorithm

The search class uses a weighted scoring system:

1. **Exact match**: Highest score (base weight × 10)
2. **Starts with**: High score (base weight × 5)
3. **Contains**: Medium score (base weight × 2)
4. **Fuzzy match**: Variable score based on similarity (base weight × similarity)

Base weights by field:
- **Name**: 10 (highest priority)
- **Label**: 8
- **Type**: 6
- **Description**: 3
- **Domain/Range**: 2
- **Annotations**: 1 (lowest priority)

Example:
```typescript
// "Student" class with label "Student"
search.searchClasses('Student');
// Name exact match: 10 × 10 = 100 points

search.searchClasses('Stud');
// Name starts-with: 10 × 5 = 50 points

search.searchClasses('dent');
// Name contains: 10 × 2 = 20 points
```

## Performance Tips

1. **Use caching**: Keep cache enabled for repeated searches
2. **Limit results**: Use `maxResults` to improve performance
3. **Filter entity types**: Only search needed entity types
4. **Specific fields**: Restrict search to relevant fields
5. **Memoize search instance**: Create search instance in useMemo

```typescript
// Good: Memoized search instance
const search = useMemo(() => new OntologySearch(ontology), [ontology]);

// Bad: Creates new instance on every render
const search = new OntologySearch(ontology);
```

## TypeScript Types

```typescript
import type {
  SearchResult,
  SearchOptions,
  SearchableEntity,
} from '@/lib/ontology/search';

// SearchResult<T>
interface SearchResult<T> {
  entity: T;                  // The matched entity
  score: number;              // Relevance score
  matchedFields: string[];    // Fields that matched the query
  highlights?: Map<string, string>; // Optional highlighted text
}

// SearchOptions
interface SearchOptions {
  entityTypes?: Array<'class' | 'property' | 'individual'>;
  fields?: string[];
  caseSensitive?: boolean;
  fuzzyMatch?: boolean;
  maxResults?: number;
  minScore?: number;
}

// SearchableEntity (union type)
type SearchableEntity = OntologyClass | OntologyProperty | Individual;
```

## Testing

Run the comprehensive test suite:

```bash
npm test -- search.test.ts
```

The test suite includes:
- 48 unit tests
- Coverage of all search methods
- Class name resolution tests
- Edge case handling
- Scoring algorithm validation
- Fuzzy matching tests
- Cache management tests
- Helper function tests

## Migration Guide

### Before (Manual Filtering)

```typescript
const filteredProperties = Array.from(ontology.properties.values()).filter(
  (property) =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.label?.toLowerCase().includes(searchQuery.toLowerCase())
);
```

### After (Using OntologySearch)

```typescript
const search = useMemo(() => new OntologySearch(ontology), [ontology]);
const results = search.searchProperties(searchQuery);
const filteredProperties = results.map(r => r.entity);
```

Benefits:
- Relevance scoring
- Better performance with caching
- More search options (fuzzy, fields, limits)
- Type-safe
- Tested
