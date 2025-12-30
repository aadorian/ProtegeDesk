# Technology Stack

ProtegeDesk is built with modern, proven technologies optimized for performance, maintainability, and developer experience.

## Overview

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | React | 18+ | UI component library |
| **Language** | TypeScript | 5+ | Type-safe development |
| **Build Tool** | Next.js / Vite | 14+ / 5+ | Build and dev server |
| **State Management** | Zustand | 4+ | Application state |
| **Immutability** | Immer | 10+ | Immutable updates |
| **Styling** | Tailwind CSS | 3+ | Utility-first CSS |
| **Icons** | Lucide React | Latest | Icon library |
| **Code Editor** | Monaco Editor | 0.45+ | Axiom editing |
| **Graph Visualization** | React Flow | 12+ | Ontology graphs |
| **Graph Layout** | ELK.js | 0.9+ | Auto-layout |
| **RDF Parsing** | N3.js | 1.17+ | Ontology I/O |
| **Reasoning (Client)** | EYE-JS | Latest | WASM reasoner |
| **AI Integration** | Vercel AI SDK | 3+ | LLM interactions |
| **UI Components** | Shadcn/ui | Latest | Accessible components |

## Frontend Stack

### React 18+

**Purpose**: UI framework for building component-based interfaces

**Why React?**
- Component-based architecture promotes reusability
- Virtual DOM for efficient updates
- Large ecosystem and community support
- Excellent developer tools
- Concurrent features for better UX

**Key Features Used:**
- Hooks (useState, useEffect, useCallback, useMemo)
- Context API for theme and settings
- Suspense for code splitting
- Error boundaries for fault tolerance

### TypeScript 5+

**Purpose**: Type-safe JavaScript development

**Why TypeScript?**
- Catches errors at compile time
- Excellent IDE support with autocomplete
- Self-documenting code with type annotations
- Easier refactoring
- Better collaboration in teams

**Configuration:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "esModuleInterop": true,
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx"
  }
}
```

### Next.js 14+ (or Vite 5+)

**Purpose**: React framework with routing, building, and optimization

**Why Next.js?**
- App Router for modern routing
- Built-in optimization (code splitting, image optimization)
- Server components for improved performance
- TypeScript support out of the box
- Excellent developer experience

**Alternative: Vite**
- Faster development builds with ESBuild
- Simpler configuration
- Great for client-only applications

## State Management

### Zustand 4+

**Purpose**: Lightweight state management

**Why Zustand?**
- Minimal boilerplate compared to Redux
- No providers needed
- TypeScript-first API
- Easy to learn and use
- Good performance with selective subscriptions

**Example:**
```typescript
import create from 'zustand'

interface OntologyStore {
  classes: Class[]
  selectedClass: Class | null
  addClass: (cls: Class) => void
  selectClass: (id: string) => void
}

export const useOntologyStore = create<OntologyStore>((set) => ({
  classes: [],
  selectedClass: null,
  addClass: (cls) => set((state) => ({
    classes: [...state.classes, cls]
  })),
  selectClass: (id) => set((state) => ({
    selectedClass: state.classes.find(c => c.id === id)
  })),
}))
```

### Immer 10+

**Purpose**: Immutable state updates with mutable syntax

**Why Immer?**
- Write simpler update logic
- Immutability guaranteed
- Integrates seamlessly with Zustand
- Better performance than manual spread operations

**Example:**
```typescript
import { produce } from 'immer'

set(produce((state) => {
  state.classes[0].name = "NewName" // Looks mutable, but creates new state
}))
```

## UI and Styling

### Tailwind CSS 3+

**Purpose**: Utility-first CSS framework

**Why Tailwind?**
- Rapid prototyping with utility classes
- Consistent design system
- Smaller CSS bundle (PurgeCSS removes unused styles)
- No naming conventions needed
- Easy responsive design

**Example:**
```tsx
<div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800">
  <h1 className="text-2xl font-bold">Ontology Editor</h1>
</div>
```

### Shadcn/ui

**Purpose**: Accessible, customizable UI components

**Why Shadcn/ui?**
- Built on Radix UI primitives (accessibility)
- Styled with Tailwind
- Copy components directly into project (no dependency)
- Fully customizable
- Follows best practices

**Components Used:**
- Command (command palette)
- Dialog (modals)
- DropdownMenu (context menus)
- Tabs (multi-ontology tabs)
- Tooltip (help text)

### Lucide React

**Purpose**: Icon library

**Why Lucide?**
- Clean, consistent icon design
- Tree-shakeable (only import what you use)
- Customizable size and color
- Wide selection of icons
- Active development

## Code Editor

### Monaco Editor 0.45+

**Purpose**: Code editor for Manchester Syntax

**Why Monaco?**
- Powers VS Code (proven quality)
- Excellent TypeScript support
- Extensible with language providers
- Syntax highlighting via Monarch
- IntelliSense and diagnostics support

**Features Used:**
- Custom language definition
- Completion provider
- Diagnostics provider
- Hover provider
- Command palette

**Configuration:**
```typescript
monaco.languages.register({ id: 'owl-manchester' })
monaco.languages.setMonarchTokensProvider('owl-manchester', {
  keywords: ['SubClassOf', 'EquivalentTo', 'and', 'or', 'not', 'some', 'only'],
  // ... tokenizer rules
})
```

### Tree-sitter (Parser)

**Purpose**: Incremental parsing for syntax analysis

**Why Tree-sitter?**
- Fast, incremental parsing
- Error-tolerant (handles incomplete code)
- Used by many modern editors
- Syntax tree for advanced features

## Graph Visualization

### React Flow (@xyflow/react) 12+

**Purpose**: Interactive node-based graphs

**Why React Flow?**
- Built for React (not a wrapper)
- High performance (1000+ nodes)
- Customizable nodes and edges
- Built-in zoom, pan, minimap
- TypeScript support

**Features Used:**
- Custom node components
- Custom edge components
- Background and controls
- Viewport management
- Selection and interaction

**Example:**
```typescript
import { ReactFlow, Node, Edge } from '@xyflow/react'

const nodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Pizza' } },
  { id: '2', position: { x: 100, y: 100 }, data: { label: 'Food' } },
]

const edges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', label: 'SubClassOf' },
]

<ReactFlow nodes={nodes} edges={edges} />
```

### ELK.js 0.9+

**Purpose**: Automatic graph layout

**Why ELK.js?**
- Industry-standard layout algorithms
- Hierarchical layouts perfect for ontologies
- WebAssembly for performance
- Highly configurable

**Layout Algorithm:**
- **Layered**: Classes organized in hierarchical layers
- **Force-directed**: Alternative layout based on graph forces
- **Stress**: Optimizes node distances

**Configuration:**
```typescript
{
  'elk.algorithm': 'layered',
  'elk.direction': 'DOWN',
  'elk.spacing.nodeNode': '80',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100'
}
```

## Ontology Processing

### N3.js 1.17+

**Purpose**: RDF parsing and serialization

**Why N3.js?**
- Supports multiple RDF formats
- Streaming API for large files
- In-memory store for querying
- Active development
- Good TypeScript types

**Formats Supported:**
- Turtle (.ttl)
- N-Triples (.nt)
- N-Quads (.nq)
- RDF/XML (.rdf, .owl)
- TriG (.trig)

**Example:**
```typescript
import { Parser, Writer, Store } from 'n3'

// Parse Turtle
const parser = new Parser({ format: 'text/turtle' })
parser.parse(turtleString, (error, quad, prefixes) => {
  if (quad) store.addQuad(quad)
})

// Write Turtle
const writer = new Writer({ format: 'text/turtle' })
writer.addQuads(store.getQuads(null, null, null, null))
writer.end((error, result) => console.log(result))
```

## Reasoning

### EYE-JS (WebAssembly)

**Purpose**: Client-side reasoning in the browser

**Why EYE-JS?**
- Runs in browser (no server needed)
- WebAssembly for near-native performance
- Supports OWL 2 reasoning
- N3 logic rules

**Limitations:**
- Limited to medium-sized ontologies
- Some OWL 2 features not supported
- Performance varies by ontology complexity

**Fallback**: Server-side reasoners (HermiT, Pellet, ELK) for complex operations

## AI Integration

### Vercel AI SDK 3+

**Purpose**: Integrate with LLM APIs

**Why Vercel AI SDK?**
- Unified API for multiple LLM providers
- Streaming responses
- Token usage tracking
- TypeScript-first
- Edge runtime support

**Providers Supported:**
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- Google (Gemini)
- Open-source models via Ollama

**Example:**
```typescript
import { generateText } from 'ai'

const { text } = await generateText({
  model: openai('gpt-4'),
  prompt: 'Generate a class hierarchy for smart homes',
})
```

## Browser APIs

### File System Access API

**Purpose**: Read/write local files

**Browser Support:**
- Chrome 86+
- Edge 86+
- Safari 15.2+ (partial)
- Firefox: Not yet supported

**Fallback**: File input and download for unsupported browsers

### IndexedDB

**Purpose**: Client-side database for ontology caching

**Why IndexedDB?**
- Large storage capacity (>50MB)
- Async API
- Transactions for data integrity
- Good browser support

### WebAssembly

**Purpose**: Run compiled code in browser

**Use Cases:**
- EYE-JS reasoner
- Tree-sitter parser
- ELK.js layout (optional)

## Development Tools

### ESLint

**Purpose**: JavaScript/TypeScript linting

**Configuration:**
- Airbnb style guide base
- React and React Hooks rules
- TypeScript-specific rules
- Custom rules for project conventions

### Prettier

**Purpose**: Code formatting

**Configuration:**
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### Husky

**Purpose**: Git hooks

**Hooks:**
- `pre-commit`: Run ESLint and Prettier
- `pre-push`: Run tests
- `commit-msg`: Validate commit message format

### Jest + React Testing Library

**Purpose**: Testing

**Test Types:**
- Unit tests for utilities and hooks
- Component tests for UI
- Integration tests for workflows
- E2E tests with Playwright

## Build and Deployment

### Next.js (Production Build)

```bash
npm run build   # Create production build
npm run start   # Start production server
```

### Vite (Production Build)

```bash
npm run build   # Create static build
npm run preview # Preview production build
```

### Deployment Targets

- **Vercel**: Optimized for Next.js
- **Netlify**: Static site hosting
- **GitHub Pages**: Free hosting for static sites
- **Docker**: Containerized deployment

## Performance Optimizations

1. **Code Splitting**: Lazy load routes and heavy components
2. **Tree Shaking**: Remove unused code
3. **Bundle Analysis**: Identify large dependencies
4. **Memoization**: React.memo, useMemo, useCallback
5. **Virtual Lists**: react-window for large lists
6. **Web Workers**: Offload heavy computations
7. **Service Workers**: Cache assets for offline use

## Security Considerations

1. **Content Security Policy**: Restrict script sources
2. **Input Sanitization**: Prevent XSS attacks
3. **API Key Encryption**: Secure LLM API keys
4. **HTTPS Only**: All external requests use HTTPS
5. **Dependency Audits**: Regular `npm audit` checks

## Version Requirements

**Minimum Versions:**
- Node.js: 18.0.0
- npm: 9.0.0
- TypeScript: 5.0.0
- React: 18.0.0

**Browser Requirements:**
- Chrome/Edge: 86+
- Firefox: 82+
- Safari: 14+

## Next Steps

- See [Architecture](Architecture) for system design
- See [Development Setup](Development-Setup) for local development
- See [API Reference](API-Reference) for component APIs
- See [Contributing](Contributing) for contribution guidelines

---

**Related Pages:**
- [Architecture](Architecture)
- [Development Setup](Development-Setup)
- [API Reference](API-Reference)
- [Contributing](Contributing)
