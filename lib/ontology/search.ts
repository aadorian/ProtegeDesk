import type {
  Ontology,
  OntologyClass,
  OntologyProperty,
  Individual,
} from './types';

/**
 * Search result with relevance scoring
 */
export interface SearchResult<T> {
  entity: T;
  score: number;
  matchedFields: string[];
  highlights?: Map<string, string>;
}

/**
 * Search options for customizing search behavior
 */
export interface SearchOptions {
  entityTypes?: Array<'class' | 'property' | 'individual'>;
  fields?: string[];
  caseSensitive?: boolean;
  fuzzyMatch?: boolean;
  maxResults?: number;
  minScore?: number;
}

/**
 * Union type for all searchable entities
 */
export type SearchableEntity = OntologyClass | OntologyProperty | Individual;

/**
 * Unified search class for ontology entities
 *
 * Provides fast, scored search across classes, properties, and individuals
 * with support for filtering, fuzzy matching, and result ranking.
 */
export class OntologySearch {
  private ontology: Ontology;
  private cache: Map<string, SearchResult<SearchableEntity>[]>;
  private cacheEnabled: boolean;

  constructor(ontology: Ontology, enableCache = true) {
    this.ontology = ontology;
    this.cache = new Map();
    this.cacheEnabled = enableCache;
  }

  /**
   * Search across all entity types
   */
  search(
    query: string,
    options: SearchOptions = {}
  ): SearchResult<SearchableEntity>[] {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const cacheKey = this.getCacheKey(query, options);
    if (this.cacheEnabled && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const normalizedQuery = options.caseSensitive
      ? query.trim()
      : query.trim().toLowerCase();

    const results: SearchResult<SearchableEntity>[] = [];
    const entityTypes = options.entityTypes || ['class', 'property', 'individual'];

    if (entityTypes.includes('class')) {
      results.push(...this.searchClasses(normalizedQuery, options));
    }

    if (entityTypes.includes('property')) {
      results.push(...this.searchProperties(normalizedQuery, options));
    }

    if (entityTypes.includes('individual')) {
      results.push(...this.searchIndividuals(normalizedQuery, options));
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    // Apply max results limit
    const limitedResults = options.maxResults
      ? results.slice(0, options.maxResults)
      : results;

    if (this.cacheEnabled) {
      this.cache.set(cacheKey, limitedResults);
    }

    return limitedResults;
  }

  /**
   * Search only classes
   */
  searchClasses(
    query: string,
    options: SearchOptions = {}
  ): SearchResult<OntologyClass>[] {
    const results: SearchResult<OntologyClass>[] = [];
    const normalizedQuery = options.caseSensitive
      ? query.trim()
      : query.trim().toLowerCase();

    for (const [, ontologyClass] of this.ontology.classes) {
      const result = this.scoreClass(ontologyClass, normalizedQuery, options);
      if (result && result.score >= (options.minScore || 0)) {
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Search only properties
   */
  searchProperties(
    query: string,
    options: SearchOptions = {}
  ): SearchResult<OntologyProperty>[] {
    const results: SearchResult<OntologyProperty>[] = [];
    const normalizedQuery = options.caseSensitive
      ? query.trim()
      : query.trim().toLowerCase();

    for (const [, property] of this.ontology.properties) {
      const result = this.scoreProperty(property, normalizedQuery, options);
      if (result && result.score >= (options.minScore || 0)) {
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Search only individuals
   */
  searchIndividuals(
    query: string,
    options: SearchOptions = {}
  ): SearchResult<Individual>[] {
    const results: SearchResult<Individual>[] = [];
    const normalizedQuery = options.caseSensitive
      ? query.trim()
      : query.trim().toLowerCase();

    for (const [, individual] of this.ontology.individuals) {
      const result = this.scoreIndividual(individual, normalizedQuery, options);
      if (result && result.score >= (options.minScore || 0)) {
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Score a class against the search query
   */
  private scoreClass(
    entity: OntologyClass,
    query: string,
    options: SearchOptions
  ): SearchResult<OntologyClass> | null {
    let score = 0;
    const matchedFields: string[] = [];

    const searchableFields = options.fields || [
      'name',
      'label',
      'description',
    ];

    // Name match (highest priority)
    if (searchableFields.includes('name')) {
      const nameScore = this.scoreField(entity.name, query, options, 10);
      if (nameScore > 0) {
        score += nameScore;
        matchedFields.push('name');
      }
    }

    // Label match (high priority)
    if (searchableFields.includes('label') && entity.label) {
      const labelScore = this.scoreField(entity.label, query, options, 8);
      if (labelScore > 0) {
        score += labelScore;
        matchedFields.push('label');
      }
    }

    // Description match (medium priority)
    if (searchableFields.includes('description') && entity.description) {
      const descScore = this.scoreField(entity.description, query, options, 3);
      if (descScore > 0) {
        score += descScore;
        matchedFields.push('description');
      }
    }

    // Annotation matches (low priority)
    if (searchableFields.includes('annotations') && entity.annotations) {
      for (const annotation of entity.annotations) {
        if (annotation.value) {
          const annScore = this.scoreField(
            annotation.value,
            query,
            options,
            1
          );
          if (annScore > 0) {
            score += annScore;
            matchedFields.push('annotations');
            break; // Only count once
          }
        }
      }
    }

    return score > 0 ? { entity, score, matchedFields } : null;
  }

  /**
   * Score a property against the search query
   */
  private scoreProperty(
    entity: OntologyProperty,
    query: string,
    options: SearchOptions
  ): SearchResult<OntologyProperty> | null {
    let score = 0;
    const matchedFields: string[] = [];

    const searchableFields = options.fields || [
      'name',
      'label',
      'description',
      'type',
    ];

    // Name match (highest priority)
    if (searchableFields.includes('name')) {
      const nameScore = this.scoreField(entity.name, query, options, 10);
      if (nameScore > 0) {
        score += nameScore;
        matchedFields.push('name');
      }
    }

    // Label match (high priority)
    if (searchableFields.includes('label') && entity.label) {
      const labelScore = this.scoreField(entity.label, query, options, 8);
      if (labelScore > 0) {
        score += labelScore;
        matchedFields.push('label');
      }
    }

    // Type match (medium-high priority)
    if (searchableFields.includes('type')) {
      const typeScore = this.scoreField(entity.type, query, options, 6);
      if (typeScore > 0) {
        score += typeScore;
        matchedFields.push('type');
      }
    }

    // Description match (medium priority)
    if (searchableFields.includes('description') && entity.description) {
      const descScore = this.scoreField(entity.description, query, options, 3);
      if (descScore > 0) {
        score += descScore;
        matchedFields.push('description');
      }
    }

    // Domain/Range matches (low priority)
    // Search both the class ID and resolved class name/label
    if (searchableFields.includes('domain')) {
      for (const domain of entity.domain || []) {
        // Search the domain ID directly
        const domainScore = this.scoreField(domain, query, options, 2);
        if (domainScore > 0) {
          score += domainScore;
          matchedFields.push('domain');
          break;
        }

        // Also search the resolved class name/label
        const domainClass = this.ontology.classes.get(domain);
        if (domainClass) {
          const classNameScore = this.scoreField(domainClass.name, query, options, 2);
          const classLabelScore = domainClass.label
            ? this.scoreField(domainClass.label, query, options, 2)
            : 0;

          if (classNameScore > 0 || classLabelScore > 0) {
            score += Math.max(classNameScore, classLabelScore);
            matchedFields.push('domain');
            break;
          }
        }
      }
    }

    if (searchableFields.includes('range')) {
      for (const range of entity.range || []) {
        // Search the range ID directly
        const rangeScore = this.scoreField(range, query, options, 2);
        if (rangeScore > 0) {
          score += rangeScore;
          matchedFields.push('range');
          break;
        }

        // Also search the resolved class name/label
        const rangeClass = this.ontology.classes.get(range);
        if (rangeClass) {
          const classNameScore = this.scoreField(rangeClass.name, query, options, 2);
          const classLabelScore = rangeClass.label
            ? this.scoreField(rangeClass.label, query, options, 2)
            : 0;

          if (classNameScore > 0 || classLabelScore > 0) {
            score += Math.max(classNameScore, classLabelScore);
            matchedFields.push('range');
            break;
          }
        }
      }
    }

    return score > 0 ? { entity, score, matchedFields } : null;
  }

  /**
   * Score an individual against the search query
   */
  private scoreIndividual(
    entity: Individual,
    query: string,
    options: SearchOptions
  ): SearchResult<Individual> | null {
    let score = 0;
    const matchedFields: string[] = [];

    const searchableFields = options.fields || ['name', 'label', 'types'];

    // Name match (highest priority)
    if (searchableFields.includes('name')) {
      const nameScore = this.scoreField(entity.name, query, options, 10);
      if (nameScore > 0) {
        score += nameScore;
        matchedFields.push('name');
      }
    }

    // Label match (high priority)
    if (searchableFields.includes('label') && entity.label) {
      const labelScore = this.scoreField(entity.label, query, options, 8);
      if (labelScore > 0) {
        score += labelScore;
        matchedFields.push('label');
      }
    }

    // Type matches (medium priority)
    // Search both the class ID and resolved class name/label
    if (searchableFields.includes('types')) {
      for (const type of entity.types || []) {
        // Search the type ID directly
        const typeScore = this.scoreField(type, query, options, 5);
        if (typeScore > 0) {
          score += typeScore;
          matchedFields.push('types');
          break;
        }

        // Also search the resolved class name/label
        const typeClass = this.ontology.classes.get(type);
        if (typeClass) {
          const classNameScore = this.scoreField(typeClass.name, query, options, 5);
          const classLabelScore = typeClass.label
            ? this.scoreField(typeClass.label, query, options, 5)
            : 0;

          if (classNameScore > 0 || classLabelScore > 0) {
            score += Math.max(classNameScore, classLabelScore);
            matchedFields.push('types');
            break;
          }
        }
      }
    }

    return score > 0 ? { entity, score, matchedFields } : null;
  }

  /**
   * Score a single field against the query
   */
  private scoreField(
    fieldValue: string,
    query: string,
    options: SearchOptions,
    baseWeight: number
  ): number {
    const normalizedField = options.caseSensitive
      ? fieldValue
      : fieldValue.toLowerCase();
    const normalizedQuery = query;

    // Exact match (highest score)
    if (normalizedField === normalizedQuery) {
      return baseWeight * 10;
    }

    // Starts with (high score)
    if (normalizedField.startsWith(normalizedQuery)) {
      return baseWeight * 5;
    }

    // Contains (medium score)
    if (normalizedField.includes(normalizedQuery)) {
      return baseWeight * 2;
    }

    // Fuzzy match (if enabled)
    if (options.fuzzyMatch) {
      const fuzzyScore = this.fuzzyScore(normalizedField, normalizedQuery);
      if (fuzzyScore > 0.7) {
        return baseWeight * fuzzyScore;
      }
    }

    return 0;
  }

  /**
   * Calculate fuzzy match score using Levenshtein distance
   */
  private fuzzyScore(str1: string, str2: string): number {
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : 1 - distance / maxLength;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Generate cache key from query and options
   */
  private getCacheKey(query: string, options: SearchOptions): string {
    return JSON.stringify({ query, options });
  }

  /**
   * Clear the search cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Update the ontology reference (useful when ontology changes)
   */
  updateOntology(ontology: Ontology): void {
    this.ontology = ontology;
    this.clearCache();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; enabled: boolean } {
    return {
      size: this.cache.size,
      enabled: this.cacheEnabled,
    };
  }
}

/**
 * Helper function to determine entity type
 */
export function getEntityType(
  entity: SearchableEntity
): 'class' | 'property' | 'individual' {
  if ('superClasses' in entity) return 'class';
  if ('type' in entity && 'domain' in entity) return 'property';
  return 'individual';
}

/**
 * Helper function to get display name for any entity
 */
export function getDisplayName(entity: SearchableEntity): string {
  return entity.label || entity.name;
}
