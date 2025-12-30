# Good First Issues for ProtegeDesk

This file contains 50 curated "good first issue" tasks for new contributors.

## Documentation (10 issues)

### 1. Add JSDoc comments to utility functions
**Difficulty**: Easy
**Skills**: JavaScript/TypeScript
**Description**: Add comprehensive JSDoc documentation to all utility functions in `src/utils/`. Each function should have a description, parameter types, return type, and examples.

### 2. Create keyboard shortcuts cheat sheet
**Difficulty**: Easy
**Skills**: Markdown, Documentation
**Description**: Create a visual keyboard shortcuts reference guide for the wiki. Include shortcuts for editor, graph, and general navigation.

### 3. Add code examples to Manchester Syntax wiki page
**Difficulty**: Easy
**Skills**: OWL, Documentation
**Description**: Expand the Manchester Syntax reference with more real-world examples for each construct (class expressions, property restrictions, etc.).

### 4. Write troubleshooting guide for common setup issues
**Difficulty**: Easy
**Skills**: Documentation
**Description**: Document common installation and setup problems (Node version issues, dependency conflicts, etc.) with solutions.

### 5. Create visual architecture diagram
**Difficulty**: Medium
**Skills**: Documentation, System Design
**Description**: Create a system architecture diagram showing component relationships, data flow, and external dependencies.

### 6. Document environment variable configuration
**Difficulty**: Easy
**Skills**: Documentation
**Description**: Create comprehensive documentation for all environment variables with descriptions, default values, and examples.

### 7. Add inline code comments for complex algorithms
**Difficulty**: Medium
**Skills**: Code Reading
**Description**: Add explanatory comments to complex graph layout and reasoning algorithms to help future contributors understand the logic.

### 8. Create FAQ page for common user questions
**Difficulty**: Easy
**Skills**: Documentation
**Description**: Compile frequently asked questions from issues and discussions into a comprehensive FAQ wiki page.

### 9. Write migration guide from Protégé
**Difficulty**: Medium
**Skills**: OWL, Documentation
**Description**: Create a guide for users migrating from Protégé Desktop, covering feature comparison and workflow differences.

### 10. Document API endpoints for reasoning service
**Difficulty**: Medium
**Skills**: API Documentation
**Description**: Create OpenAPI/Swagger documentation for the reasoning service REST API.

## UI/UX Improvements (10 issues)

### 11. Add loading spinners for async operations
**Difficulty**: Easy
**Skills**: React, CSS
**Description**: Add loading indicators when importing files, running reasoner, or calling AI services.

### 12. Improve error message formatting
**Difficulty**: Easy
**Skills**: React, UX
**Description**: Make error messages more user-friendly with clear descriptions, suggested actions, and better visual formatting.

### 13. Add tooltips to toolbar buttons
**Difficulty**: Easy
**Skills**: React, Shadcn/ui
**Description**: Add descriptive tooltips to all toolbar buttons showing the button's function and keyboard shortcut.

### 14. Create empty state for new ontologies
**Difficulty**: Easy
**Skills**: React, UI Design
**Description**: Design and implement a helpful empty state when users create a new ontology, with getting started tips.

### 15. Add confirmation dialog for destructive actions
**Difficulty**: Easy
**Skills**: React, Shadcn/ui
**Description**: Add confirmation modals before deleting classes, clearing ontology, or other destructive actions.

### 16. Implement breadcrumb navigation
**Difficulty**: Medium
**Skills**: React, UI
**Description**: Add breadcrumb navigation showing current location in the class hierarchy.

### 17. Add success notifications
**Difficulty**: Easy
**Skills**: React, Toast/Notifications
**Description**: Show success messages when operations complete (file saved, reasoning finished, etc.).

### 18. Improve color contrast for dark mode
**Difficulty**: Easy
**Skills**: CSS, Accessibility
**Description**: Audit and improve color contrast ratios in dark mode to meet WCAG AA standards.

### 19. Add file format icons in file dialogs
**Difficulty**: Easy
**Skills**: React, Icons
**Description**: Show appropriate icons (.ttl, .owl, .rdf) next to file format options in import/export dialogs.

### 20. Create welcome screen for first-time users
**Difficulty**: Medium
**Skills**: React, UX
**Description**: Design an onboarding screen with quick tour and sample ontology options for new users.

## Testing (10 issues)

### 21. Write unit tests for IRI validation
**Difficulty**: Easy
**Skills**: Testing, TypeScript
**Description**: Add comprehensive unit tests for IRI validation utility functions.

### 22. Add component tests for ClassNode
**Difficulty**: Easy
**Skills**: React Testing Library
**Description**: Write component tests for the ClassNode component covering all user interactions.

### 23. Create test fixtures for ontology examples
**Difficulty**: Easy
**Skills**: OWL, Testing
**Description**: Create sample ontology files (Pizza, Animals, etc.) for use in tests.

### 24. Add snapshot tests for UI components
**Difficulty**: Easy
**Skills**: Jest, React
**Description**: Add snapshot tests for key UI components to catch unintended visual changes.

### 25. Write integration test for file import
**Difficulty**: Medium
**Skills**: Testing, Integration
**Description**: Create integration test that imports a Turtle file and verifies all entities are loaded correctly.

### 26. Add E2E test for ontology creation workflow
**Difficulty**: Medium
**Skills**: Playwright, E2E Testing
**Description**: Write end-to-end test covering the complete flow of creating a new ontology and adding classes.

### 27. Test autocomplete functionality
**Difficulty**: Medium
**Skills**: Testing, Monaco Editor
**Description**: Add tests for Monaco Editor autocomplete provider with various scenarios.

### 28. Add performance tests for large ontologies
**Difficulty**: Medium
**Skills**: Performance Testing
**Description**: Create performance benchmarks for loading and rendering ontologies with 1000+ classes.

### 29. Write tests for Manchester Syntax parser
**Difficulty**: Medium
**Skills**: Testing, Parsing
**Description**: Add comprehensive tests for Manchester Syntax parsing covering all valid and invalid syntax.

### 30. Add accessibility tests with axe
**Difficulty**: Easy
**Skills**: Accessibility Testing
**Description**: Integrate axe-core and add automated accessibility tests for main components.

## Code Quality (10 issues)

### 31. Add TypeScript strict null checks
**Difficulty**: Medium
**Skills**: TypeScript
**Description**: Enable strict null checking and fix all resulting type errors throughout the codebase.

### 32. Extract magic numbers into constants
**Difficulty**: Easy
**Skills**: Refactoring
**Description**: Find hardcoded numbers (timeouts, sizes, limits) and extract them into named constants.

### 33. Remove console.log statements
**Difficulty**: Easy
**Skills**: Code Quality
**Description**: Remove or replace console.log statements with proper logging using debug library.

### 34. Add error boundaries to component tree
**Difficulty**: Medium
**Skills**: React, Error Handling
**Description**: Add React error boundaries around major sections to gracefully handle component errors.

### 35. Implement proper error handling in API calls
**Difficulty**: Medium
**Skills**: Error Handling
**Description**: Add try-catch blocks and error handling to all external API calls (LLM, reasoning service).

### 36. Extract duplicate code into shared utilities
**Difficulty**: Medium
**Skills**: Refactoring
**Description**: Identify and extract duplicate logic into shared utility functions.

### 37. Add PropTypes or runtime validation
**Difficulty**: Easy
**Skills**: TypeScript, Validation
**Description**: Add runtime validation for component props using zod or similar library.

### 38. Improve variable and function naming
**Difficulty**: Easy
**Skills**: Code Quality
**Description**: Audit and improve unclear variable and function names throughout the codebase.

### 39. Add missing return type annotations
**Difficulty**: Easy
**Skills**: TypeScript
**Description**: Add explicit return type annotations to all functions missing them.

### 40. Implement memoization for expensive computations
**Difficulty**: Medium
**Skills**: React, Performance
**Description**: Add useMemo and useCallback to prevent unnecessary recomputation of expensive operations.

## Features (10 issues)

### 41. Add "Copy IRI" button to entity cards
**Difficulty**: Easy
**Skills**: React
**Description**: Add a button to copy the entity IRI to clipboard in the properties panel.

### 42. Implement undo/redo for single operation
**Difficulty**: Medium
**Skills**: State Management
**Description**: Start implementing undo/redo by adding it for a single operation type (e.g., class creation).

### 43. Add export to JSON-LD format
**Difficulty**: Medium
**Skills**: RDF, Serialization
**Description**: Implement export functionality for JSON-LD format using N3.js.

### 44. Create search functionality for class tree
**Difficulty**: Medium
**Skills**: React, Search
**Description**: Add search/filter input to class tree sidebar with highlighting of matches.

### 45. Add zoom controls to graph view
**Difficulty**: Easy
**Skills**: React Flow
**Description**: Add zoom in/out/fit buttons to the graph visualization toolbar.

### 46. Implement drag-and-drop file import
**Difficulty**: Medium
**Skills**: React, File API
**Description**: Allow users to drag and drop .ttl/.owl files to import them.

### 47. Add entity usage counter
**Difficulty**: Medium
**Skills**: Graph Algorithms
**Description**: Show how many times each class/property is referenced in the ontology.

### 48. Create "Recent Ontologies" list
**Difficulty**: Medium
**Skills**: LocalStorage, React
**Description**: Implement a list of recently opened ontologies in the welcome screen.

### 49. Add graph layout algorithm selector
**Difficulty**: Medium
**Skills**: React, ELK.js
**Description**: Add UI to select different graph layout algorithms (layered, force-directed, etc.).

### 50. Implement basic SPARQL query interface
**Difficulty**: Hard
**Skills**: SPARQL, React
**Description**: Create a simple interface to run SPARQL queries against the loaded ontology.

## Issue Labels to Use

- `good-first-issue` - Perfect for newcomers
- `help-wanted` - Community help needed
- `documentation` - Documentation improvements
- `enhancement` - New features
- `bug` - Bug fixes (not included in this list)
- `testing` - Testing improvements
- `accessibility` - Accessibility improvements
- `performance` - Performance optimizations

## Getting Started

To work on any of these issues:

1. Comment on the issue saying you'd like to work on it
2. Wait for maintainer assignment
3. Fork the repository
4. Create a feature branch
5. Make your changes
6. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.
