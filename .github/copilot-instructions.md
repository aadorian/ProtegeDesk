# GitHub Copilot Instructions for ProtegeDesk

## Project Overview

**ProtegeDesk** is a modern, web-based ontology editor built with Next.js 16, React 19, and TypeScript 5. It provides a browser-based alternative to Protégé Desktop with features for editing OWL 2 ontologies, reasoning, and visual graph exploration.

**Key Technologies**: React 19, Next.js 16, TypeScript 5, Zustand (via React Context), Tailwind CSS 4, Jest, React Flow, Monaco Editor, ELK.js for graph layout

---

## Architecture Overview

### Core Application Structure

```
app/                 # Next.js app directory (server/client boundary)
├── page.tsx         # Main ontology editor page
├── layout.tsx       # Root layout with providers
└── globals.css      # Global styling

components/
├── ui/              # Shadcn/ui base components (Card, Button, Dialog, etc.)
├── ontology/        # Domain components
│   ├── header.tsx              # Top toolbar (import/export, new entity, reasoner)
│   ├── tabs-navigation.tsx      # Left sidebar tabs (Classes, Properties, Individuals)
│   ├── class-tree.tsx           # Hierarchical class browser
│   ├── details-panel.tsx        # Right panel showing selected entity details
│   ├── graph-view.tsx           # React Flow visualization
│   ├── import-export-dialog.tsx # Format handling (Turtle, JSON-LD, OWL/XML)
│   ├── reasoner-dialog.tsx      # Consistency checking UI
│   └── ...                      # Property, Individual, and other entity editors

lib/
├── utils.ts                      # Utility functions (class name merging, etc.)
├── ontology/
│   ├── types.ts                 # Core domain types (Ontology, OntologyClass, etc.)
│   ├── context.tsx              # React Context + useOntology() hook
│   ├── reasoner.ts              # Consistency checking & inference algorithms
│   ├── serializers.tsx          # Format conversion (Turtle, JSON-LD, OWL/XML)
│   └── sample-data.ts           # Mock ontology for development
└── __tests__/                   # Comprehensive unit tests (130+ tests)

hooks/
├── use-toast.ts                 # Toast notification state management
└── __tests__/

public/              # Static assets
styles/              # Global CSS
```

### Data Flow Architecture

1. **State Root**: `useOntology()` context hook provides centralized ontology state
2. **Component Access**: Any component can `useOntology()` to read/dispatch CRUD actions
3. **Immutability Pattern**: All state updates create new Map instances (no mutations)
4. **Selection State**: Currently selected class/property/individual stored separately from ontology
5. **UI Sync**: Components automatically re-render when selections or ontology changes

**Key Pattern Example**:

```typescript
// In any component:
const { ontology, selectedClass, addClass } = useOntology()
```

### Critical Data Structures

The `Ontology` type in [lib/ontology/types.ts](lib/ontology/types.ts) defines:

- `classes: Map<string, OntologyClass>` - Class hierarchy with IRI keys
- `properties: Map<string, OntologyProperty>` - Object/Data properties
- `individuals: Map<string, Individual>` - Instances and named entities

Each entity has: `id`, `iri`, `label`, `comment`, relationships to other entities.

---

## Developer Workflows

### Build & Dev Commands

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build           # Production build
npm start               # Run production server
npm test                # Run Jest tests
npm run test:watch      # Watch mode for tests
npm run test:coverage   # Generate coverage report
npm run lint            # Run ESLint
npm run lint:fix        # Auto-fix linting issues
npm run type-check      # TypeScript type checking
npm run validate        # Full validation: types + lint + format + tests
```

### Key Development Patterns

**Run validation before committing:**

```bash
npm run validate  # This is the pre-commit workflow
```

**Working with ontology logic:**

1. Test files live in `__tests__/` alongside implementation ([lib/ontology/**tests**/](lib/ontology/__tests__/))
2. Reasoning tests: [lib/ontology/**tests**/reasoner.test.ts](lib/ontology/__tests__/reasoner.test.ts) (31 tests)
3. State management tests: [lib/ontology/**tests**/context.test.tsx](lib/ontology/__tests__/context.test.tsx) (23 tests)
4. Serializer tests: [lib/ontology/**tests**/serializers.test.ts](lib/ontology/__tests__/serializers.test.ts) (43 tests)

---

## TypeScript & Code Style

### Type Safety Requirements

- **No `any` types** - Use specific types or `unknown` with proper guards
- **Type imports**: Use `import type { ... }` for types only
- **Interfaces before implementation** - Define shape first, then implement
- **Strict mode enabled** in tsconfig.json

**Component Props Example**:

```typescript
interface ClassNodeProps {
  id: string
  label: string
  onSelect: (id: string) => void
}

export const ClassNode: React.FC<ClassNodeProps> = ({ id, label, onSelect }) => {
  // implementation
}
```

### React Component Conventions

- **Functional components only** - No class components
- **Props interfaces** - Always define `XyzProps` interface
- **Hook order**: useState → useEffect → useMemo → useCallback → custom hooks
- **Memoization**: Use `React.memo()` for list items; `useMemo` for expensive computations
- **Callbacks**: Wrap with `useCallback()` when passed as props (dependency tracking critical)

**Component Template**:

```typescript
'use client'

import { useCallback, useMemo, useState } from 'react';
import { useOntology } from '@/lib/ontology/context';
import type { OntologyClass } from '@/lib/ontology/types';

interface ClassDetailsProps {
  classId: string;
}

export const ClassDetails: React.FC<ClassDetailsProps> = ({ classId }) => {
  const { ontology, updateClass } = useOntology();
  const [isEditing, setIsEditing] = useState(false);

  const owlClass = useMemo(() =>
    ontology?.classes.get(classId),
    [ontology?.classes, classId]
  );

  const handleSave = useCallback((updates: Partial<OntologyClass>) => {
    updateClass(classId, updates);
  }, [classId, updateClass]);

  return <div>{/* JSX */}</div>;
};

ClassDetails.displayName = 'ClassDetails';
```

### File Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `ClassTree.tsx`)
- **Hooks**: `camelCase.ts` with `use` prefix (e.g., `use-toast.ts`)
- **Services/Utilities**: `camelCase.ts` (e.g., `reasoner.ts`)
- **Types**: `types.ts` or co-located with implementation

---

## Critical Patterns & Conventions

### State Management with React Context

**Access pattern** (used everywhere):

```typescript
const { ontology, selectedClass, addClass, selectClass } = useOntology()
```

**CRUD Pattern** (Map-based immutability):

```typescript
// Context performs: new Map(prev.classes) → mutation → return new state
const addClass = useCallback((owlClass: OntologyClass) => {
  setOntology(prev => {
    if (!prev) return prev
    const classes = new Map(prev.classes)
    classes.set(owlClass.id, owlClass)
    return { ...prev, classes }
  })
}, [])
```

### Ontology-Specific Conventions

- **IRI Format**: Full IRIs stored in `iri` field; components display `label` instead
- **Hierarchies**: Stored via `subClassOf` property array, not nested objects
- **Map Lookups**: Always check ontology exists: `ontology?.classes.get(id)`
- **Type Safety**: Import types from [lib/ontology/types.ts](lib/ontology/types.ts)

### Format Support (Serialization)

Supported formats in [lib/ontology/serializers.tsx](lib/ontology/serializers.tsx):

- **Turtle** (`.ttl`) - Human-readable RDF
- **JSON-LD** (`.jsonld`) - JSON format with linked data
- **OWL/XML** (`.owl`) - W3C XML format

Import serialization functions:

```typescript
import { serializeToTurtle, parseFromTurtle /* ... */ } from '@/lib/ontology/serializers'
```

### Reasoning & Consistency Checking

Located in [lib/ontology/reasoner.ts](lib/ontology/reasoner.ts):

- **Consistency Check**: Detects contradictions, circular dependencies
- **Inference**: Derives implicit class relationships
- **Validation**: Checks IRI uniqueness, class hierarchy validity

Usage pattern:

```typescript
import { HermiTReasoner } from '@/lib/ontology/reasoner'
const reasoner = new HermiTReasoner(ontology)
const result = reasoner.reason() // { isConsistent, inferences, errors }
```

---

## Testing Standards

### Coverage Target: 80%+ for Utilities/Services

**Test Structure**:

- Logic-focused unit tests (130 tests total)
- Mock data for reproducible tests
- AAA Pattern: Arrange → Act → Assert

**Key Test Files**:

- [lib/ontology/**tests**/reasoner.test.ts](lib/ontology/__tests__/reasoner.test.ts) - Algorithm testing
- [lib/ontology/**tests**/context.test.tsx](lib/ontology/__tests__/context.test.tsx) - State management
- [lib/ontology/**tests**/serializers.test.ts](lib/ontology/__tests__/serializers.test.ts) - Format conversion
- [hooks/**tests**/use-toast.test.ts](hooks/__tests__/use-toast.test.ts) - Hook logic

**Test Example**:

```typescript
describe('HermiTReasoner', () => {
  it('should detect circular dependencies', () => {
    const ontology = createMockOntologyWithCircularRefs()
    const reasoner = new HermiTReasoner(ontology)
    const result = reasoner.reason()

    expect(result.errors).toContainEqual(expect.objectContaining({ type: 'circular' }))
  })
})
```

---

## Integration Points & Dependencies

### External Libraries (Critical for Features)

| Library                        | Purpose               | Key Usage                                                                |
| ------------------------------ | --------------------- | ------------------------------------------------------------------------ |
| **React Flow** (@xyflow/react) | Graph visualization   | [components/ontology/graph-view.tsx](components/ontology/graph-view.tsx) |
| **ELK.js**                     | Auto-layout algorithm | Graph node positioning                                                   |
| **Monaco Editor**              | Code editor           | Axiom/Manchester syntax editing                                          |
| **N3.js**                      | RDF parsing           | Built into serializers (not directly imported)                           |
| **Tailwind CSS**               | Styling               | All components use utility classes                                       |
| **Radix UI**                   | Accessible primitives | Dialog, Select, Tabs base (wrapped by Shadcn)                            |

### Component Composition Example

[components/ontology/details-panel.tsx](components/ontology/details-panel.tsx) shows the pattern:

```typescript
// Reads selection state
const { selectedClass, selectedProperty, selectedIndividual } = useOntology();

// Renders conditional UI based on what's selected
if (selectedClass) return <ClassDetails />;
if (selectedProperty) return <PropertyDetails />;
// ...
```

---

## Project-Specific Workflows

### Adding a New Entity Type

1. **Define types** in [lib/ontology/types.ts](lib/ontology/types.ts)
2. **Add CRUD methods** to context in [lib/ontology/context.tsx](lib/ontology/context.tsx)
3. **Create detail component** in `components/ontology/xyz-details.tsx`
4. **Add to serializers** if format-specific handling needed
5. **Test the logic** in corresponding `__tests__/` file
6. **Integrate into UI** (header, details-panel, etc.)

### Fixing a Serialization Bug

Start here: [lib/ontology/serializers.tsx](lib/ontology/serializers.tsx) contains all format logic. Reference tests in [lib/ontology/**tests**/serializers.test.ts](lib/ontology/__tests__/serializers.test.ts) for expected behavior.

### Reasoning Issues

Check [lib/ontology/reasoner.ts](lib/ontology/reasoner.ts) and [lib/ontology/**tests**/reasoner.test.ts](lib/ontology/__tests__/reasoner.test.ts). The reasoner implements consistency checking and inference - review test cases to understand expected behavior.

---

## Common Pitfalls to Avoid

❌ **Mutating state directly** - Always create new Maps/objects
❌ **Forgetting `useCallback` deps** - Can break memoized consumers
❌ **Using `any` types** - Defeats TypeScript benefits
❌ **Not testing edge cases** - Test null, empty, large datasets
❌ **Console.logs in production** - Use proper error handling
❌ **Using `useOntology()` outside provider** - Will throw error (by design)

---

## Resources & References

- [CURSOR_GUIDELINES.md](docs/CURSOR_GUIDELINES.md) - Detailed prompt patterns for AI
- [TESTING.md](docs/TESTING.md) - Comprehensive testing strategy
- [SRS.md](docs/SRS.md) - Complete requirements specification
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [Technology Stack](wiki/Technology-Stack.md) - Detailed dependency docs

---

**Last Updated**: January 2, 2026
**Tech Stack**: Next.js 16 + React 19 + TypeScript 5 + Jest
**Test Coverage**: 130 tests, 80%+ for utilities/services
