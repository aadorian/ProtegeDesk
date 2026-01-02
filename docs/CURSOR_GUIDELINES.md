# Cursor Development Guidelines for ProtegeDesk

**Version:** 1.0  
**Last Updated:** 2025-12-29  
**Purpose:** Professional guidelines for using Cursor AI to develop the ProtegeDesk ontology editor

---

## Table of Contents

1. [Overview](#overview)
2. [Cursor-Specific Best Practices](#cursor-specific-best-practices)
3. [Project Architecture Patterns](#project-architecture-patterns)
4. [Code Generation Guidelines](#code-generation-guidelines)
5. [TypeScript & React Standards](#typescript--react-standards)
6. [Testing & Quality Assurance](#testing--quality-assurance)
7. [Performance Optimization](#performance-optimization)
8. [Security Guidelines](#security-guidelines)
9. [AI-Assisted Development Workflows](#ai-assisted-development-workflows)
10. [Common Patterns & Examples](#common-patterns--examples)

---

## Overview

### What is Cursor?

Cursor is an AI-powered code editor that enhances development productivity through intelligent code completion, generation, and refactoring. This document provides guidelines for using Cursor effectively when developing ProtegeDesk.

### Project Context

**ProtegeDesk** is a modern, web-based ontology editor built with:
- **Frontend:** React 18+, TypeScript 5+, Next.js 14+
- **State Management:** Zustand with Immer
- **Code Editor:** Monaco Editor (VS Code engine)
- **Visualization:** React Flow (XyFlow) with ELK.js
- **Ontology Processing:** N3.js for RDF/OWL
- **AI Integration:** Vercel AI SDK
- **Styling:** Tailwind CSS, Shadcn/ui

### Key Principles

1. **Type Safety First:** Always use TypeScript with strict mode
2. **Component-Based:** Follow React best practices
3. **Performance-Conscious:** Optimize for large ontologies (1000+ classes)
4. **Standards Compliant:** Adhere to W3C OWL 2 and RDF 1.1 specifications
5. **Accessibility:** Target WCAG 2.1 Level AA compliance

---

## Cursor-Specific Best Practices

### 1. Effective Prompting

#### ✅ Good Prompts

**Be Specific and Context-Aware:**
```
Create a React component for displaying ontology class nodes in the graph visualization. 
The component should:
- Accept props: id (string), label (string), parentId (string | null), subClassCount (number)
- Use React Flow's Node type from @xyflow/react
- Display class name with orange background (#FF8C00)
- Show expand/collapse icon if subClassCount > 0
- Handle click events to select the class
- Use Tailwind CSS for styling
- Follow the existing ClassNode pattern in components/Graph/
```

**Include Architecture Context:**
```
Add a new Zustand store for managing reasoning results. The store should:
- Store inferred axioms as an array
- Track reasoning status: 'idle' | 'running' | 'completed' | 'error'
- Include actions: startReasoning(), setResults(), setError()
- Use Immer for immutable updates
- Follow the pattern in stores/ontologyStore.ts
```

**Reference Existing Code:**
```
Refactor the AxiomEditor component to extract the completion provider logic into a separate hook.
Follow the same pattern used in hooks/useMonacoEditor.ts and maintain the same API.
```

#### ❌ Poor Prompts

- "Add a button" (too vague)
- "Fix the bug" (no context)
- "Make it better" (subjective)
- "Create a component" (missing requirements)

### 2. Using Cursor Chat Effectively

#### When to Use Chat

- **Architecture Decisions:** "Should I use a custom hook or a Zustand store for managing editor state?"
- **Code Review:** "Review this component for performance issues and suggest optimizations"
- **Debugging:** "Why is the graph layout algorithm hanging on this ontology structure?"
- **Learning:** "Explain how N3.js parsing works and how to handle large files"

#### Chat Best Practices

1. **Provide Context:** Always include relevant code snippets or file paths
2. **Ask Follow-ups:** Clarify understanding before implementing
3. **Request Explanations:** Ask "why" to understand the reasoning
4. **Iterate:** Refine prompts based on initial responses

### 3. Code Generation Workflow

#### Step-by-Step Process

1. **Plan First:** Use Chat to discuss approach before generating code
2. **Generate Incrementally:** Start with interfaces/types, then implementation
3. **Review Generated Code:** Always review and understand before accepting
4. **Test Immediately:** Write tests alongside implementation
5. **Refactor if Needed:** Use Cursor to refactor based on patterns

#### Example Workflow

```
1. Chat: "I need to add property recommendations to the AI assistant. 
   What's the best way to structure this feature?"

2. Generate: "Create the TypeScript interface for property recommendations"

3. Generate: "Create the API service function to call the LLM"

4. Generate: "Create the React component to display recommendations"

5. Test: "Generate unit tests for the property recommendation service"

6. Review: "Review this implementation for security concerns with API keys"
```

### 4. File Organization with Cursor

#### Recommended Structure

When asking Cursor to create new files, specify the exact path:

```
Create src/services/ai/propertyRecommender.ts with a function that:
- Takes a class IRI as input
- Calls the OpenAI API using Vercel AI SDK
- Returns an array of suggested properties
- Handles errors gracefully
```

#### File Naming Conventions

- **Components:** `PascalCase.tsx` (e.g., `ClassNode.tsx`)
- **Hooks:** `camelCase.ts` with `use` prefix (e.g., `useOntologyStore.ts`)
- **Services:** `camelCase.ts` (e.g., `ontologyParser.ts`)
- **Types:** `PascalCase.ts` (e.g., `OntologyTypes.ts`)
- **Utils:** `camelCase.ts` (e.g., `iriUtils.ts`)

---

## Project Architecture Patterns

### 1. Component Structure

#### Standard Component Template

```typescript
// components/FeatureName/FeatureName.tsx
import React, { useCallback, useMemo } from 'react';
import { useFeatureStore } from '@/stores/featureStore';
import type { FeatureProps } from './types';

/**
 * FeatureName component description
 * 
 * @param props - Component props
 * @returns JSX element
 */
export const FeatureName: React.FC<FeatureProps> = ({
  id,
  label,
  onAction,
  ...rest
}) => {
  const { state, actions } = useFeatureStore();
  
  const handleClick = useCallback(() => {
    onAction?.(id);
  }, [id, onAction]);

  const computedValue = useMemo(() => {
    // Expensive computation
    return computeValue(state);
  }, [state]);

  return (
    <div className="feature-container" {...rest}>
      {/* Component JSX */}
    </div>
  );
};

FeatureName.displayName = 'FeatureName';
```

#### When to Use Cursor for Components

- **New Features:** "Create a ClassTree component following the pattern in components/Graph/"
- **Refactoring:** "Extract the search logic from ClassTree into a custom hook"
- **Optimization:** "Memoize this component to prevent unnecessary re-renders"

### 2. State Management with Zustand

#### Store Pattern

```typescript
// stores/ontologyStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Ontology, Class } from '@/types/ontology';

interface OntologyState {
  // State
  ontology: Ontology | null;
  selectedClass: Class | null;
  isLoading: boolean;
  
  // Actions
  setOntology: (ontology: Ontology) => void;
  selectClass: (classId: string) => void;
  addClass: (cls: Class) => void;
  updateClass: (id: string, updates: Partial<Class>) => void;
}

export const useOntologyStore = create<OntologyState>()(
  immer((set) => ({
    ontology: null,
    selectedClass: null,
    isLoading: false,
    
    setOntology: (ontology) => set((state) => {
      state.ontology = ontology;
      state.selectedClass = null;
    }),
    
    selectClass: (classId) => set((state) => {
      if (state.ontology) {
        state.selectedClass = state.ontology.classes.find(c => c.id === classId) || null;
      }
    }),
    
    addClass: (cls) => set((state) => {
      if (state.ontology) {
        state.ontology.classes.push(cls);
      }
    }),
    
    updateClass: (id, updates) => set((state) => {
      if (state.ontology) {
        const cls = state.ontology.classes.find(c => c.id === id);
        if (cls) {
          Object.assign(cls, updates);
        }
      }
    }),
  }))
);
```

#### Cursor Prompts for Stores

```
Create a Zustand store for managing reasoning state. Include:
- Status: 'idle' | 'running' | 'completed' | 'error'
- Results: array of inferred axioms
- Error: Error | null
- Actions: startReasoning(), setResults(), setError(), reset()
- Use Immer middleware for immutable updates
- Follow the pattern in stores/ontologyStore.ts
```

### 3. Service Layer Pattern

#### Service Structure

```typescript
// services/ontology/parser.ts
import { Parser, Store } from 'n3';
import type { Ontology } from '@/types/ontology';

export class OntologyParser {
  private parser: Parser;
  private store: Store;

  constructor() {
    this.parser = new Parser({ format: 'text/turtle' });
    this.store = new Store();
  }

  async parse(content: string): Promise<Ontology> {
    return new Promise((resolve, reject) => {
      this.parser.parse(content, (error, quad, prefixes) => {
        if (error) {
          reject(error);
          return;
        }
        
        if (quad) {
          this.store.addQuad(quad);
        } else {
          // Parsing complete
          const ontology = this.convertStoreToOntology(this.store, prefixes);
          resolve(ontology);
        }
      });
    });
  }

  private convertStoreToOntology(store: Store, prefixes: Record<string, string>): Ontology {
    // Conversion logic
  }
}
```

#### Cursor Prompts for Services

```
Create a reasoning service that:
- Wraps EYE-JS WebAssembly reasoner
- Provides async methods: checkConsistency(), classify(), realize()
- Handles timeouts (5 seconds for client-side)
- Returns structured results with inferred axioms
- Follows error handling patterns from services/ontology/parser.ts
```

### 4. Custom Hooks Pattern

```typescript
// hooks/useMonacoEditor.ts
import { useEffect, useRef } from 'react';
import * as Monaco from 'monaco-editor';
import { useOntologyStore } from '@/stores/ontologyStore';

export const useMonacoEditor = (containerRef: React.RefObject<HTMLDivElement>) => {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const { ontology } = useOntologyStore();

  useEffect(() => {
    if (!containerRef.current) return;

    const editor = Monaco.editor.create(containerRef.current, {
      language: 'owl-manchester',
      theme: 'owl-ms-dark',
      minimap: { enabled: false },
      fontSize: 14,
    });

    editorRef.current = editor;

    return () => {
      editor.dispose();
    };
  }, [containerRef]);

  // Register completion provider
  useEffect(() => {
    if (!editorRef.current || !ontology) return;

    Monaco.languages.registerCompletionItemProvider('owl-manchester', {
      provideCompletionItems: (model, position) => {
        // Completion logic using ontology context
      },
    });
  }, [editorRef.current, ontology]);

  return editorRef;
};
```

---

## Code Generation Guidelines

### 1. TypeScript First

#### Always Specify Types

**✅ Good:**
```
Create a function parseManchesterSyntax that:
- Takes a string parameter (axiom: string)
- Returns a Promise<AxiomParseResult>
- AxiomParseResult interface: { valid: boolean; ast: ASTNode | null; errors: ParseError[] }
- Uses tree-sitter for parsing
- Handles syntax errors gracefully
```

**❌ Bad:**
```
Create a function to parse Manchester syntax
```

### 2. Follow Existing Patterns

#### Reference Similar Code

```
Create a new graph layout algorithm component similar to components/Graph/LayoutEngine.tsx.
The new component should:
- Support force-directed layout (in addition to hierarchical)
- Use the same ELK.js integration pattern
- Maintain the same API (calculateLayout(nodes, edges) => Promise<PositionedNode[]>)
- Follow the same error handling approach
```

### 3. Include Error Handling

#### Always Request Error Handling

```
Create an API service function to call the reasoning endpoint. Include:
- Proper error handling for network failures
- Timeout handling (30 seconds)
- Retry logic (max 2 retries)
- Type-safe error types
- Logging for debugging
```

### 4. Performance Considerations

#### Request Optimizations

```
Optimize the ClassTree component for large ontologies (1000+ classes):
- Implement virtual scrolling using react-window
- Lazy load child nodes on expand
- Memoize expensive computations
- Use React.memo for list items
- Debounce search input
```

### 5. Accessibility Requirements

#### Include A11y in Prompts

```
Create a search input component with:
- Proper ARIA labels and roles
- Keyboard navigation support (Enter to search, Escape to clear)
- Screen reader announcements for results
- Focus management
- Follow WCAG 2.1 Level AA standards
```

---

## TypeScript & React Standards

### 1. Type Definitions

#### Always Define Types First

```typescript
// types/ontology.ts
export interface Ontology {
  iri: string;
  versionInfo?: string;
  classes: Class[];
  objectProperties: ObjectProperty[];
  dataProperties: DataProperty[];
  individuals: Individual[];
  axioms: Axiom[];
}

export interface Class {
  id: string;
  iri: string;
  label: string;
  comment?: string;
  parentIds: string[];
  subClassCount: number;
  annotations: Record<string, string>;
}

export type ObjectProperty = Property & {
  domain?: string[];
  range?: string[];
  characteristics?: PropertyCharacteristic[];
};

export type DataProperty = Property & {
  domain?: string[];
  range: string; // Datatype IRI
};
```

#### Cursor Prompt for Types

```
Create comprehensive TypeScript types for the ontology domain:
- Ontology (root type with IRI, version, and collections)
- Class (with hierarchy support)
- ObjectProperty and DataProperty (with domain/range)
- Individual (with types and facts)
- Axiom (with different axiom types)
- Include JSDoc comments for all types
- Follow the pattern in types/ontology.ts
```

### 2. React Component Patterns

#### Functional Components with Hooks

```typescript
// Always use functional components
export const ClassNode: React.FC<ClassNodeProps> = ({ id, label, onSelect }) => {
  // Hooks at the top
  const [isExpanded, setIsExpanded] = useState(false);
  const { classes } = useOntologyStore();
  
  // Memoized values
  const children = useMemo(() => {
    return classes.filter(c => c.parentId === id);
  }, [classes, id]);
  
  // Callbacks
  const handleClick = useCallback(() => {
    onSelect(id);
  }, [id, onSelect]);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return (
    // JSX
  );
};
```

### 3. Props Interfaces

#### Always Define Props

```typescript
interface ClassNodeProps {
  id: string;
  label: string;
  parentId: string | null;
  subClassCount: number;
  isSelected?: boolean;
  onSelect: (id: string) => void;
  onExpand?: (id: string) => void;
  className?: string;
}

export const ClassNode: React.FC<ClassNodeProps> = (props) => {
  // Implementation
};
```

---

## Testing & Quality Assurance

### 1. Test Generation with Cursor

#### Unit Test Prompts

```
Generate comprehensive unit tests for the OntologyParser class:
- Test successful parsing of Turtle format
- Test error handling for invalid syntax
- Test parsing of large files (1000+ triples)
- Test prefix handling
- Use Vitest and follow patterns in __tests__/services/
```

#### Component Test Prompts

```
Create React Testing Library tests for ClassNode component:
- Test rendering with required props
- Test click handler invocation
- Test expand/collapse functionality
- Test selection state styling
- Test accessibility (keyboard navigation, ARIA)
- Follow patterns in __tests__/components/Graph/
```

### 2. Test Coverage Requirements

- **Unit Tests:** ≥ 80% coverage for utilities and services
- **Component Tests:** All user interactions and edge cases
- **Integration Tests:** Critical workflows (import, export, reasoning)
- **E2E Tests:** Complete user journeys (create ontology, edit, export)

### 3. Test Patterns

```typescript
// __tests__/services/ontologyParser.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { OntologyParser } from '@/services/ontology/parser';

describe('OntologyParser', () => {
  let parser: OntologyParser;

  beforeEach(() => {
    parser = new OntologyParser();
  });

  it('should parse valid Turtle syntax', async () => {
    const turtle = `
      @prefix ex: <http://example.org#> .
      ex:Person a owl:Class .
    `;
    
    const ontology = await parser.parse(turtle);
    expect(ontology.classes).toHaveLength(1);
    expect(ontology.classes[0].label).toBe('Person');
  });

  it('should throw error for invalid syntax', async () => {
    const invalid = 'invalid turtle syntax {';
    await expect(parser.parse(invalid)).rejects.toThrow();
  });
});
```

---

## Performance Optimization

### 1. Memoization Patterns

#### Request Memoization

```
Optimize the ClassTree component:
- Memoize the filtered class list using useMemo
- Memoize the tree structure calculation
- Use React.memo for ClassNode items
- Implement virtual scrolling for 100+ items
- Debounce search input (300ms)
```

### 2. Code Splitting

#### Lazy Loading

```typescript
// Use dynamic imports for heavy components
const AxiomEditor = lazy(() => import('@/components/Editor/AxiomEditor'));
const OntologyGraph = lazy(() => import('@/components/Graph/OntologyGraph'));

// In component
<Suspense fallback={<LoadingSpinner />}>
  <AxiomEditor />
</Suspense>
```

#### Cursor Prompt

```
Refactor the main layout to lazy load heavy components:
- AxiomEditor (Monaco Editor is large)
- OntologyGraph (React Flow is large)
- ReasoningPanel (EYE-JS WASM is large)
- Use React.lazy and Suspense
- Provide appropriate loading states
```

### 3. Virtualization

#### Large Lists

```
Implement virtual scrolling for the ClassTree component:
- Use react-window for virtualization
- Support dynamic item heights
- Maintain scroll position on updates
- Handle expand/collapse with virtual scrolling
- Follow patterns in components/Graph/VirtualizedTree.tsx
```

### 4. Web Workers

#### Offload Heavy Computation

```
Move the ELK.js layout calculation to a Web Worker:
- Create worker file: workers/layoutWorker.ts
- Post message with nodes and edges
- Return calculated positions
- Handle errors and timeouts
- Maintain type safety with TypeScript
```

---

## Security Guidelines

### 1. API Key Management

#### Secure Storage

```typescript
// services/ai/apiKeyManager.ts
export class APIKeyManager {
  private static readonly STORAGE_KEY = 'encrypted_api_keys';
  
  static async storeKey(provider: 'openai' | 'anthropic', key: string): Promise<void> {
    // Encrypt using Web Crypto API
    const encrypted = await this.encrypt(key);
    const keys = this.getStoredKeys();
    keys[provider] = encrypted;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(keys));
  }
  
  static async getKey(provider: 'openai' | 'anthropic'): Promise<string | null> {
    const keys = this.getStoredKeys();
    const encrypted = keys[provider];
    if (!encrypted) return null;
    return this.decrypt(encrypted);
  }
  
  private static async encrypt(data: string): Promise<string> {
    // Use Web Crypto API for encryption
  }
}
```

#### Cursor Prompt

```
Create a secure API key manager service:
- Encrypt keys using Web Crypto API before storage
- Store in localStorage (encrypted)
- Never log or expose keys in error messages
- Provide methods: storeKey(), getKey(), deleteKey()
- Handle encryption errors gracefully
- Follow security best practices
```

### 2. Input Sanitization

#### Validate All Inputs

```typescript
// utils/validation.ts
export const validateIRI = (iri: string): boolean => {
  try {
    new URL(iri);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeManchesterSyntax = (input: string): string => {
  // Remove potentially dangerous characters
  // Validate against grammar
  return input.replace(/[<>{}]/g, '');
};
```

### 3. XSS Prevention

#### Sanitize User Content

```
When rendering user-provided ontology labels and comments:
- Use React's built-in XSS protection (automatic escaping)
- For rich text, use DOMPurify for sanitization
- Never use dangerouslySetInnerHTML without sanitization
- Validate all IRI inputs
- Escape special characters in search queries
```

---

## AI-Assisted Development Workflows

### 1. Feature Development Workflow

#### Complete Feature Implementation

```
1. Planning Phase (Chat):
   "I want to add property recommendations to the AI assistant. 
   What's the best architecture? Should it be a separate service or 
   part of the existing AI service?"

2. Type Definitions:
   "Create TypeScript types for property recommendations:
   - PropertyRecommendation interface
   - RecommendationRequest/Response types
   - Include confidence scores and explanations"

3. Service Implementation:
   "Create a PropertyRecommenderService that:
   - Uses Vercel AI SDK to call OpenAI/Anthropic
   - Takes a class IRI and domain context
   - Returns structured recommendations
   - Handles errors and rate limiting"

4. UI Component:
   "Create a PropertyRecommendationPanel component:
   - Displays recommendations in a list
   - Shows confidence scores
   - Allows accepting/rejecting recommendations
   - Integrates with the properties panel"

5. Integration:
   "Integrate the property recommender into the existing AI assistant:
   - Add to command palette
   - Connect to class selection
   - Update the properties panel"

6. Testing:
   "Generate comprehensive tests for the property recommender:
   - Unit tests for the service
   - Component tests for the UI
   - Integration tests for the workflow"
```

### 2. Refactoring Workflow

#### Systematic Refactoring

```
1. Identify Target:
   "Analyze the AxiomEditor component and identify refactoring opportunities:
   - Extract completion provider logic
   - Separate validation logic
   - Improve error handling"

2. Plan Refactoring:
   "Plan the refactoring to extract completion provider:
   - Create useMonacoCompletion hook
   - Maintain same API
   - Preserve all existing functionality
   - Improve testability"

3. Execute:
   "Refactor AxiomEditor to use the new useMonacoCompletion hook:
   - Extract completion logic
   - Update component to use hook
   - Ensure no functionality is lost"

4. Verify:
   "Review the refactored code:
   - Check for any regressions
   - Verify tests still pass
   - Ensure performance is maintained"
```

### 3. Debugging Workflow

#### Systematic Debugging

```
1. Reproduce:
   "I'm experiencing an issue where the graph layout hangs on large ontologies.
   The ontology has 2000+ classes. Can you help debug this?"

2. Investigate:
   "Add logging to the ELK.js layout calculation:
   - Log node count before layout
   - Log timing information
   - Log any errors or warnings
   - Help identify the bottleneck"

3. Fix:
   "The layout is timing out. Implement incremental layout:
   - Process nodes in batches
   - Update UI progressively
   - Add cancellation support
   - Show progress indicator"

4. Test:
   "Create a test case that reproduces the layout timeout:
   - Generate a large ontology (2000+ classes)
   - Test incremental layout
   - Verify performance improvement"
```

---

## Common Patterns & Examples

### 1. Monaco Editor Integration

```typescript
// components/Editor/AxiomEditor.tsx
import { useEffect, useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { useOntologyStore } from '@/stores/ontologyStore';

export const AxiomEditor: React.FC = () => {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const { selectedClass, ontology } = useOntologyStore();

  const handleEditorDidMount = (editor: Monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    
    // Register completion provider
    monaco.languages.registerCompletionItemProvider('owl-manchester', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        // Get suggestions from ontology
        const suggestions = getOntologySuggestions(ontology, word.word);

        return {
          suggestions: suggestions.map(s => ({
            label: s.label,
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: s.insertText,
            range,
            documentation: s.description,
          })),
        };
      },
    });
  };

  return (
    <Editor
      height="100%"
      language="owl-manchester"
      theme="owl-ms-dark"
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        folding: true,
      }}
    />
  );
};
```

### 2. React Flow Graph

```typescript
// components/Graph/OntologyGraph.tsx
import { useCallback, useMemo } from 'react';
import { ReactFlow, Node, Edge, useNodesState, useEdgesState } from '@xyflow/react';
import { useOntologyStore } from '@/stores/ontologyStore';
import { ClassNode } from './ClassNode';
import { useLayoutEngine } from './useLayoutEngine';

const nodeTypes = {
  class: ClassNode,
};

export const OntologyGraph: React.FC = () => {
  const { ontology, selectClass } = useOntologyStore();
  const { calculateLayout } = useLayoutEngine();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Convert ontology to graph nodes/edges
  const graphData = useMemo(() => {
    if (!ontology) return { nodes: [], edges: [] };
    
    const nodes: Node[] = ontology.classes.map(cls => ({
      id: cls.id,
      type: 'class',
      data: { label: cls.label, class: cls },
      position: { x: 0, y: 0 }, // Will be calculated by layout
    }));

    const edges: Edge[] = ontology.classes.flatMap(cls =>
      cls.parentIds.map(parentId => ({
        id: `${cls.id}-${parentId}`,
        source: parentId,
        target: cls.id,
        type: 'smoothstep',
        animated: false,
      }))
    );

    return { nodes, edges };
  }, [ontology]);

  // Apply layout
  useEffect(() => {
    if (graphData.nodes.length > 0) {
      calculateLayout(graphData.nodes, graphData.edges).then((positionedNodes) => {
        setNodes(positionedNodes);
        setEdges(graphData.edges);
      });
    }
  }, [graphData, calculateLayout, setNodes, setEdges]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    selectClass(node.id);
  }, [selectClass]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      fitView
    />
  );
};
```

### 3. Zustand Store with Immer

```typescript
// stores/reasoningStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { InferredAxiom } from '@/types/ontology';

interface ReasoningState {
  status: 'idle' | 'running' | 'completed' | 'error';
  results: InferredAxiom[];
  error: Error | null;
  progress: number;
  
  startReasoning: () => void;
  setResults: (results: InferredAxiom[]) => void;
  setError: (error: Error) => void;
  setProgress: (progress: number) => void;
  reset: () => void;
}

export const useReasoningStore = create<ReasoningState>()(
  immer((set) => ({
    status: 'idle',
    results: [],
    error: null,
    progress: 0,

    startReasoning: () => set((state) => {
      state.status = 'running';
      state.results = [];
      state.error = null;
      state.progress = 0;
    }),

    setResults: (results) => set((state) => {
      state.status = 'completed';
      state.results = results;
      state.progress = 100;
    }),

    setError: (error) => set((state) => {
      state.status = 'error';
      state.error = error;
    }),

    setProgress: (progress) => set((state) => {
      state.progress = progress;
    }),

    reset: () => set((state) => {
      state.status = 'idle';
      state.results = [];
      state.error = null;
      state.progress = 0;
    }),
  }))
);
```

### 4. AI Service Integration

```typescript
// services/ai/ontologyGenerator.ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { APIKeyManager } from './apiKeyManager';
import type { Ontology } from '@/types/ontology';

export class OntologyGenerator {
  async generateFromDescription(description: string): Promise<Ontology> {
    const apiKey = await APIKeyManager.getKey('openai');
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `Generate an OWL ontology structure from this description: ${description}

Requirements:
- Provide 5-15 classes with clear hierarchy
- Include object and data properties
- Use PascalCase for classes, camelCase for properties
- Return as JSON matching this structure:
{
  "classes": [{"name": "ClassName", "parent": "ParentClass", "description": "..."}],
  "properties": [{"name": "propertyName", "type": "ObjectProperty|DataProperty", "domain": "...", "range": "..."}]
}`;

    const { text } = await generateText({
      model: openai('gpt-4'),
      prompt,
      maxTokens: 2000,
    });

    return this.parseGeneratedOntology(text);
  }

  private parseGeneratedOntology(text: string): Ontology {
    // Parse LLM response and convert to Ontology type
    // Handle errors and validation
  }
}
```

---

## Quick Reference

### Cursor Shortcuts

- **Cmd/Ctrl + K**: Open command palette
- **Cmd/Ctrl + L**: Open chat
- **Cmd/Ctrl + I**: Inline edit
- **Tab**: Accept suggestion
- **Esc**: Dismiss suggestion

### Common Cursor Prompts

#### Component Creation
```
Create a [ComponentName] component that [does X]. 
Follow the pattern in [similar component] and use [specific library/pattern].
```

#### Refactoring
```
Refactor [target] to [goal]. 
Maintain the same API and ensure all tests pass.
```

#### Testing
```
Generate [test type] tests for [target]. 
Cover [specific scenarios] and follow patterns in [test file].
```

#### Debugging
```
Debug [issue]. Add logging to identify [problem area] 
and suggest a fix.
```

### File Structure Reminders

```
src/
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── ui/               # Shadcn components
│   ├── Editor/           # Axiom editor
│   ├── Graph/            # Graph visualization
│   └── AI/               # AI assistant UI
├── lib/                   # Library code
│   ├── ontology/         # Ontology domain logic
│   └── utils/            # Utilities
├── services/              # External services
│   ├── ai/               # AI integration
│   ├── parser/           # Parsing services
│   └── reasoning/        # Reasoning services
├── hooks/                 # Custom hooks
├── stores/                # Zustand stores
├── types/                 # TypeScript types
└── utils/                 # Utility functions
```

---

## Best Practices Summary

1. ✅ **Always specify types** - Never use `any`
2. ✅ **Follow existing patterns** - Reference similar code
3. ✅ **Include error handling** - Request in prompts
4. ✅ **Write tests** - Generate alongside code
5. ✅ **Optimize performance** - Consider large ontologies
6. ✅ **Maintain security** - Protect API keys, sanitize input
7. ✅ **Document code** - Use JSDoc comments
8. ✅ **Iterate incrementally** - Build in small steps
9. ✅ **Review generated code** - Understand before accepting
10. ✅ **Refactor when needed** - Use Cursor for improvements

---

## Getting Help

### Resources

- **Project Documentation:** See `/wiki/` directory
- **TypeScript Docs:** https://www.typescriptlang.org/docs/
- **React Docs:** https://react.dev/
- **Cursor Docs:** https://cursor.sh/docs

### Questions?

- Use Cursor Chat for technical questions
- Check existing code for patterns
- Review similar implementations
- Ask in GitHub Discussions

---

**Remember:** Cursor is a powerful tool, but you are the architect. Always review, understand, and test generated code before committing.

---

*Last Updated: 2025-12-29*  
*Version: 1.0*

