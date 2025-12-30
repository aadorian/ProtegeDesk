#!/bin/bash

# Script to create 50 good first issues for ProtegeDesk
# Run with: bash create-good-first-issues.sh

echo "Creating good first issues for ProtegeDesk..."

# Create labels if they don't exist
gh label create "good-first-issue" --color "7057ff" --description "Good for newcomers" 2>/dev/null || true
gh label create "help-wanted" --color "008672" --description "Extra attention is needed" 2>/dev/null || true
gh label create "enhancement" --color "a2eeef" --description "New feature or request" 2>/dev/null || true

# Documentation Issues (1-10)

gh issue create --title "Add JSDoc comments to utility functions" --label "good-first-issue,documentation,help-wanted" --body "## Description
Add comprehensive JSDoc documentation to all utility functions in \`src/utils/\`.

## Difficulty: Easy
## Skills: JavaScript/TypeScript, Documentation

## Tasks
- [ ] Audit all files in \`src/utils/\`
- [ ] Add JSDoc comments to each function
- [ ] Include @param, @returns, @example tags

## Acceptance Criteria
- All utility functions have complete JSDoc comments
- Examples provided for complex functions"

gh issue create --title "Create keyboard shortcuts cheat sheet" --label "good-first-issue,documentation,help-wanted" --body "## Description
Create a visual keyboard shortcuts reference guide for the wiki.

## Difficulty: Easy
## Skills: Markdown, Documentation

## Tasks
- [ ] Document all keyboard shortcuts
- [ ] Create visual cheat sheet
- [ ] Add to wiki

## Acceptance Criteria
- All shortcuts documented
- Organized by category (editor, graph, navigation)"

gh issue create --title "Add code examples to Manchester Syntax wiki page" --label "good-first-issue,documentation,help-wanted" --body "## Description
Expand the Manchester Syntax reference with more real-world examples.

## Difficulty: Easy
## Skills: OWL, Documentation

## Tasks
- [ ] Add examples for class expressions
- [ ] Add examples for property restrictions
- [ ] Add examples for axiom patterns

## Acceptance Criteria
- At least 20 practical examples
- Examples cover all major constructs"

gh issue create --title "Write troubleshooting guide for common setup issues" --label "good-first-issue,documentation,help-wanted" --body "## Description
Document common installation and setup problems with solutions.

## Difficulty: Easy
## Skills: Documentation

## Tasks
- [ ] List common setup issues
- [ ] Document solutions for each
- [ ] Add to troubleshooting wiki page

## Acceptance Criteria
- Covers Node version issues
- Covers dependency conflicts
- Covers environment setup"

gh issue create --title "Create visual architecture diagram" --label "good-first-issue,documentation,help-wanted" --body "## Description
Create a system architecture diagram showing components and data flow.

## Difficulty: Medium
## Skills: Documentation, System Design

## Tasks
- [ ] Identify major components
- [ ] Create diagram (draw.io, Mermaid, etc.)
- [ ] Add to architecture wiki page

## Acceptance Criteria
- Shows all major components
- Shows data flow
- Shows external dependencies"

gh issue create --title "Document environment variable configuration" --label "good-first-issue,documentation,help-wanted" --body "## Description
Create comprehensive documentation for all environment variables.

## Difficulty: Easy
## Skills: Documentation

## Tasks
- [ ] List all environment variables
- [ ] Document purpose and default values
- [ ] Add examples

## Acceptance Criteria
- All variables documented
- Examples provided
- Organized by category"

gh issue create --title "Add inline code comments for complex algorithms" --label "good-first-issue,documentation,help-wanted" --body "## Description
Add explanatory comments to complex graph layout and reasoning algorithms.

## Difficulty: Medium
## Skills: Code Reading

## Tasks
- [ ] Identify complex algorithms
- [ ] Add step-by-step comments
- [ ] Explain non-obvious logic

## Acceptance Criteria
- All complex algorithms have comments
- Comments explain 'why' not just 'what'"

gh issue create --title "Create FAQ page for common user questions" --label "good-first-issue,documentation,help-wanted" --body "## Description
Compile frequently asked questions into a comprehensive FAQ wiki page.

## Difficulty: Easy
## Skills: Documentation

## Tasks
- [ ] Review existing issues and discussions
- [ ] Compile common questions
- [ ] Write clear answers
- [ ] Add to wiki

## Acceptance Criteria
- At least 20 FAQs
- Organized by category
- Links to detailed docs where appropriate"

gh issue create --title "Write migration guide from Protégé" --label "good-first-issue,documentation,help-wanted" --body "## Description
Create a guide for users migrating from Protégé Desktop.

## Difficulty: Medium
## Skills: OWL, Documentation

## Tasks
- [ ] Compare features with Protégé
- [ ] Document workflow differences
- [ ] Provide migration tips

## Acceptance Criteria
- Feature comparison table
- Common workflows documented
- Import/export guidance"

gh issue create --title "Document API endpoints for reasoning service" --label "good-first-issue,documentation,help-wanted" --body "## Description
Create OpenAPI/Swagger documentation for the reasoning service REST API.

## Difficulty: Medium
## Skills: API Documentation

## Tasks
- [ ] List all API endpoints
- [ ] Document request/response formats
- [ ] Add examples
- [ ] Generate OpenAPI spec

## Acceptance Criteria
- All endpoints documented
- OpenAPI 3.0 spec created
- Interactive API docs available"

# UI/UX Issues (11-20)

gh issue create --title "Add loading spinners for async operations" --label "good-first-issue,ui,enhancement,help-wanted" --body "## Description
Add loading indicators for async operations (file import, reasoning, AI calls).

## Difficulty: Easy
## Skills: React, CSS

## Tasks
- [ ] Add spinner for file import
- [ ] Add spinner for reasoning
- [ ] Add spinner for AI operations

## Acceptance Criteria
- Spinners show during long operations
- User can still see what's happening
- Consistent design across app"

gh issue create --title "Improve error message formatting" --label "good-first-issue,ui,enhancement,help-wanted" --body "## Description
Make error messages more user-friendly with clear descriptions and suggested actions.

## Difficulty: Easy
## Skills: React, UX

## Tasks
- [ ] Audit all error messages
- [ ] Rewrite for clarity
- [ ] Add suggested actions
- [ ] Improve visual formatting

## Acceptance Criteria
- All errors have clear descriptions
- Suggested actions provided
- Visually distinct from other messages"

gh issue create --title "Add tooltips to toolbar buttons" --label "good-first-issue,ui,accessibility,help-wanted" --body "## Description
Add descriptive tooltips to all toolbar buttons with function and keyboard shortcut.

## Difficulty: Easy
## Skills: React, Shadcn/ui

## Tasks
- [ ] Identify all toolbar buttons
- [ ] Add Tooltip component to each
- [ ] Include keyboard shortcuts

## Acceptance Criteria
- All buttons have tooltips
- Tooltips show on hover
- Include keyboard shortcut if applicable"

gh issue create --title "Create empty state for new ontologies" --label "good-first-issue,ui,enhancement,help-wanted" --body "## Description
Design and implement a helpful empty state for new ontologies with getting started tips.

## Difficulty: Easy
## Skills: React, UI Design

## Tasks
- [ ] Design empty state
- [ ] Add getting started tips
- [ ] Add quick actions

## Acceptance Criteria
- Shows when ontology is empty
- Provides helpful guidance
- Includes quick actions (add class, import, etc.)"

gh issue create --title "Add confirmation dialog for destructive actions" --label "good-first-issue,ui,enhancement,help-wanted" --body "## Description
Add confirmation modals before destructive actions (delete class, clear ontology).

## Difficulty: Easy
## Skills: React, Shadcn/ui

## Tasks
- [ ] Identify destructive actions
- [ ] Add Dialog component for each
- [ ] Include warning message

## Acceptance Criteria
- Dialogs show for all destructive actions
- Clear warning message
- Cancel and confirm buttons"

gh issue create --title "Implement breadcrumb navigation" --label "good-first-issue,ui,enhancement,help-wanted" --body "## Description
Add breadcrumb navigation showing current location in class hierarchy.

## Difficulty: Medium
## Skills: React, UI

## Tasks
- [ ] Create Breadcrumb component
- [ ] Show class path from root
- [ ] Make breadcrumbs clickable

## Acceptance Criteria
- Shows full path from owl:Thing to current class
- Clickable to navigate to parent classes
- Updates when selection changes"

gh issue create --title "Add success notifications" --label "good-first-issue,ui,enhancement,help-wanted" --body "## Description
Show success messages when operations complete (file saved, reasoning finished).

## Difficulty: Easy
## Skills: React, Toast/Notifications

## Tasks
- [ ] Add toast library (if not present)
- [ ] Add success notification for file save
- [ ] Add success notification for reasoning
- [ ] Add success notification for other operations

## Acceptance Criteria
- Toasts show for successful operations
- Auto-dismiss after 3-5 seconds
- Positioned consistently"

gh issue create --title "Improve color contrast for dark mode" --label "good-first-issue,ui,accessibility,help-wanted" --body "## Description
Audit and improve color contrast ratios in dark mode to meet WCAG AA standards.

## Difficulty: Easy
## Skills: CSS, Accessibility

## Tasks
- [ ] Audit all colors in dark mode
- [ ] Test contrast ratios (use axe DevTools)
- [ ] Adjust colors to meet WCAG AA (4.5:1 for text)

## Acceptance Criteria
- All text meets 4.5:1 contrast ratio
- UI elements meet 3:1 contrast ratio
- No accessibility violations in axe"

gh issue create --title "Add file format icons in file dialogs" --label "good-first-issue,ui,enhancement,help-wanted" --body "## Description
Show appropriate icons next to file format options in import/export dialogs.

## Difficulty: Easy
## Skills: React, Icons

## Tasks
- [ ] Add icons for .ttl, .owl, .rdf, .nt
- [ ] Display in file dialogs
- [ ] Ensure consistent sizing

## Acceptance Criteria
- Icons show for each format
- Icons are recognizable
- Consistent with Lucide icon set"

gh issue create --title "Create welcome screen for first-time users" --label "good-first-issue,ui,enhancement,help-wanted" --body "## Description
Design an onboarding screen with quick tour and sample ontology options.

## Difficulty: Medium
## Skills: React, UX

## Tasks
- [ ] Design welcome screen
- [ ] Add sample ontology options (Pizza, Animals, etc.)
- [ ] Add quick tour highlights
- [ ] Add 'Don't show again' option

## Acceptance Criteria
- Shows on first visit
- Sample ontologies can be loaded
- Tour highlights key features
- Can be dismissed"

# Testing Issues (21-30)

gh issue create --title "Write unit tests for IRI validation" --label "good-first-issue,testing,help-wanted" --body "## Description
Add comprehensive unit tests for IRI validation utility functions.

## Difficulty: Easy
## Skills: Testing, TypeScript

## Tasks
- [ ] Test valid IRIs
- [ ] Test invalid IRIs
- [ ] Test edge cases
- [ ] Aim for 100% coverage

## Acceptance Criteria
- All validation functions tested
- Valid and invalid cases covered
- Edge cases handled"

gh issue create --title "Add component tests for ClassNode" --label "good-first-issue,testing,help-wanted" --body "## Description
Write component tests for ClassNode covering all user interactions.

## Difficulty: Easy
##Skills: React Testing Library

## Tasks
- [ ] Test rendering
- [ ] Test click events
- [ ] Test selection state
- [ ] Test keyboard interaction

## Acceptance Criteria
- All interactions tested
- Accessibility checked
- Tests pass consistently"

gh issue create --title "Create test fixtures for ontology examples" --label "good-first-issue,testing,help-wanted" --body "## Description
Create sample ontology files (Pizza, Animals, etc.) for use in tests.

## Difficulty: Easy
## Skills: OWL, Testing

## Tasks
- [ ] Create Pizza.ttl
- [ ] Create Animals.ttl
- [ ] Create SmartHome.ttl
- [ ] Add to test fixtures directory

## Acceptance Criteria
- At least 3 sample ontologies
- Each has 20+ classes
- Valid OWL syntax
- Used in tests"

gh issue create --title "Add snapshot tests for UI components" --label "good-first-issue,testing,help-wanted" --body "## Description
Add snapshot tests for key UI components to catch unintended visual changes.

## Difficulty: Easy
## Skills: Jest, React

## Tasks
- [ ] Add snapshot tests for main components
- [ ] Update snapshots when changes are intentional
- [ ] Document snapshot testing process

## Acceptance Criteria
- Key components have snapshot tests
- Snapshots committed to repo
- CI fails on snapshot mismatches"

gh issue create --title "Write integration test for file import" --label "good-first-issue,testing,help-wanted" --body "## Description
Create integration test that imports a Turtle file and verifies entities are loaded.

## Difficulty: Medium
## Skills: Testing, Integration

## Tasks
- [ ] Create test Turtle file
- [ ] Test import flow
- [ ] Verify classes loaded
- [ ] Verify properties loaded

## Acceptance Criteria
- Full import flow tested
- All entity types verified
- Error cases handled"

gh issue create --title "Add E2E test for ontology creation workflow" --label "good-first-issue,testing,help-wanted" --body "## Description
Write end-to-end test covering complete ontology creation flow.

## Difficulty: Medium
## Skills: Playwright, E2E Testing

## Tasks
- [ ] Test creating new ontology
- [ ] Test adding classes
- [ ] Test saving file
- [ ] Test loading file

## Acceptance Criteria
- Complete workflow tested
- Runs in CI
- Tests pass consistently"

gh issue create --title "Test autocomplete functionality" --label "good-first-issue,testing,help-wanted" --body "## Description
Add tests for Monaco Editor autocomplete provider with various scenarios.

## Difficulty: Medium
## Skills: Testing, Monaco Editor

## Tasks
- [ ] Test class name completion
- [ ] Test property completion
- [ ] Test keyword completion
- [ ] Test context-aware suggestions

## Acceptance Criteria
- All completion scenarios tested
- Context awareness verified
- Performance acceptable"

gh issue create --title "Add performance tests for large ontologies" --label "good-first-issue,testing,performance,help-wanted" --body "## Description
Create performance benchmarks for loading and rendering large ontologies.

## Difficulty: Medium
## Skills: Performance Testing

## Tasks
- [ ] Create large test ontology (1000+ classes)
- [ ] Benchmark load time
- [ ] Benchmark render time
- [ ] Set performance thresholds

## Acceptance Criteria
- Benchmarks run in CI
- Thresholds defined (e.g., <5s load for 1000 classes)
- Performance regressions detected"

gh issue create --title "Write tests for Manchester Syntax parser" --label "good-first-issue,testing,help-wanted" --body "## Description
Add comprehensive tests for Manchester Syntax parsing.

## Difficulty: Medium
## Skills: Testing, Parsing

## Tasks
- [ ] Test valid syntax
- [ ] Test invalid syntax
- [ ] Test error recovery
- [ ] Test all OWL constructs

## Acceptance Criteria
- All valid constructs parse correctly
- Invalid syntax detected
- Error messages are helpful"

gh issue create --title "Add accessibility tests with axe" --label "good-first-issue,testing,accessibility,help-wanted" --body "## Description
Integrate axe-core and add automated accessibility tests.

## Difficulty: Easy
## Skills: Accessibility Testing

## Tasks
- [ ] Install axe-core
- [ ] Add to component tests
- [ ] Fix violations
- [ ] Add to CI

## Acceptance Criteria
- axe tests run automatically
- No critical violations
- Results show in CI"

# Code Quality Issues (31-40)

gh issue create --title "Add TypeScript strict null checks" --label "good-first-issue,enhancement,help-wanted" --body "## Description
Enable strict null checking and fix resulting type errors.

## Difficulty: Medium
## Skills: TypeScript

## Tasks
- [ ] Enable strictNullChecks in tsconfig.json
- [ ] Fix type errors
- [ ] Add null checks where needed

## Acceptance Criteria
- strictNullChecks enabled
- No type errors
- Code handles null/undefined properly"

gh issue create --title "Extract magic numbers into constants" --label "good-first-issue,enhancement,help-wanted" --body "## Description
Find hardcoded numbers and extract them into named constants.

## Difficulty: Easy
## Skills: Refactoring

## Tasks
- [ ] Find magic numbers (timeouts, sizes, limits)
- [ ] Extract into constants file
- [ ] Use constants throughout code

## Acceptance Criteria
- No magic numbers in code
- Constants have descriptive names
- Organized by category"

gh issue create --title "Remove console.log statements" --label "good-first-issue,enhancement,help-wanted" --body "## Description
Remove or replace console.log with proper logging using debug library.

## Difficulty: Easy
## Skills: Code Quality

## Tasks
- [ ] Find all console.log statements
- [ ] Remove debug logs
- [ ] Replace with debug() where appropriate

## Acceptance Criteria
- No console.log in production code
- debug library used for logging
- No sensitive data logged"

gh issue create --title "Add error boundaries to component tree" --label "good-first-issue,enhancement,help-wanted" --body "## Description
Add React error boundaries around major sections.

## Difficulty: Medium
## Skills: React, Error Handling

## Tasks
- [ ] Create ErrorBoundary component
- [ ] Wrap major sections
- [ ] Add error reporting
- [ ] Add recovery UI

## Acceptance Criteria
- Errors don't crash entire app
- User-friendly error message shown
- Errors logged for debugging"

gh issue create --title "Implement proper error handling in API calls" --label "good-first-issue,enhancement,help-wanted" --body "## Description
Add try-catch blocks and error handling to external API calls.

## Difficulty: Medium
## Skills: Error Handling

## Tasks
- [ ] Audit all API calls
- [ ] Add try-catch blocks
- [ ] Handle network errors
- [ ] Show user-friendly messages

## Acceptance Criteria
- All API calls have error handling
- Network errors handled gracefully
- Users see helpful error messages"

gh issue create --title "Extract duplicate code into shared utilities" --label "good-first-issue,enhancement,help-wanted" --body "## Description
Identify and extract duplicate logic into shared utility functions.

## Difficulty: Medium
## Skills: Refactoring

## Tasks
- [ ] Find duplicate code patterns
- [ ] Extract into utility functions
- [ ] Update all usages
- [ ] Add tests

## Acceptance Criteria
- Duplicate code eliminated
- Utilities are well-tested
- Code is DRY"

gh issue create --title "Add PropTypes or runtime validation" --label "good-first-issue,enhancement,help-wanted" --body "## Description
Add runtime validation for component props using zod or similar.

## Difficulty: Easy
## Skills: TypeScript, Validation

## Tasks
- [ ] Choose validation library (zod recommended)
- [ ] Add schemas for props
- [ ] Validate in development mode

## Acceptance Criteria
- Props validated at runtime
- Clear error messages
- No production overhead"

gh issue create --title "Improve variable and function naming" --label "good-first-issue,enhancement,help-wanted" --body "## Description
Audit and improve unclear variable and function names.

## Difficulty: Easy
## Skills: Code Quality

## Tasks
- [ ] Find unclear names (x, data, temp, etc.)
- [ ] Rename to descriptive names
- [ ] Update references

## Acceptance Criteria
- Names are self-documenting
- Follow naming conventions
- No single-letter variables (except loop counters)"

gh issue create --title "Add missing return type annotations" --label "good-first-issue,enhancement,help-wanted" --body "## Description
Add explicit return type annotations to all functions missing them.

## Difficulty: Easy
## Skills: TypeScript

## Tasks
- [ ] Find functions without return types
- [ ] Add explicit return type annotations
- [ ] Verify correctness

## Acceptance Criteria
- All functions have return types
- Types are accurate
- No 'any' return types"

gh issue create --title "Implement memoization for expensive computations" --label "good-first-issue,performance,help-wanted" --body "## Description
Add useMemo and useCallback to prevent unnecessary recomputation.

## Difficulty: Medium
## Skills: React, Performance

## Tasks
- [ ] Identify expensive computations
- [ ] Add useMemo where appropriate
- [ ] Add useCallback for functions
- [ ] Measure performance improvement

## Acceptance Criteria
- Expensive computations memoized
- Re-renders reduced
- Performance improved"

# Feature Issues (41-50)

gh issue create --title "Add 'Copy IRI' button to entity cards" --label "good-first-issue,enhancement,help-wanted" --body "## Description
Add a button to copy the entity IRI to clipboard in properties panel.

## Difficulty: Easy
## Skills: React

## Tasks
- [ ] Add copy button to entity cards
- [ ] Implement clipboard API
- [ ] Show success notification

## Acceptance Criteria
- Button copies IRI to clipboard
- Works in all browsers
- Success feedback shown"

gh issue create --title "Implement undo/redo for single operation" --label "good-first-issue,enhancement,help-wanted" --body "## Description
Start implementing undo/redo by adding it for class creation.

## Difficulty: Medium
## Skills: State Management

## Tasks
- [ ] Add history to Zustand store
- [ ] Implement undo/redo for class creation
- [ ] Add keyboard shortcuts (Ctrl+Z, Ctrl+Y)

## Acceptance Criteria
- Undo reverses class creation
- Redo re-applies creation
- Keyboard shortcuts work"

gh issue create --title "Add export to JSON-LD format" --label "good-first-issue,enhancement,help-wanted" --body "## Description
Implement export functionality for JSON-LD format.

## Difficulty: Medium
## Skills: RDF, Serialization

## Tasks
- [ ] Add JSON-LD writer using N3.js
- [ ] Add to export format options
- [ ] Test with sample ontologies

## Acceptance Criteria
- JSON-LD export option available
- Output is valid JSON-LD
- Round-trip preserves data"

gh issue create --title "Create search functionality for class tree" --label "good-first-issue,enhancement,help-wanted" --body "## Description
Add search/filter input to class tree sidebar with highlighting.

## Difficulty: Medium
## Skills: React, Search

## Tasks
- [ ] Add search input to sidebar
- [ ] Filter tree based on query
- [ ] Highlight matches
- [ ] Expand to show matches

## Acceptance Criteria
- Search filters tree
- Matches highlighted
- Parent nodes expanded
- Clear button resets search"

gh issue create --title "Add zoom controls to graph view" --label "good-first-issue,enhancement,help-wanted" --body "## Description
Add zoom in/out/fit buttons to graph visualization toolbar.

## Difficulty: Easy
## Skills: React Flow

## Tasks
- [ ] Add zoom in button
- [ ] Add zoom out button
- [ ] Add fit to screen button
- [ ] Add zoom level indicator

## Acceptance Criteria
- Zoom buttons work correctly
- Fit centers and sizes graph
- Zoom level shown
- Keyboard shortcuts work (if applicable)"

gh issue create --title "Implement drag-and-drop file import" --label "good-first-issue,enhancement,help-wanted" --body "## Description
Allow users to drag and drop .ttl/.owl files to import them.

## Difficulty: Medium
## Skills: React, File API

## Tasks
- [ ] Add drop zone
- [ ] Handle file drop events
- [ ] Validate file type
- [ ] Import dropped file

## Acceptance Criteria
- Drop zone shows on drag over
- Only accepts ontology files
- File imports correctly
- Error handling for invalid files"

gh issue create --title "Add entity usage counter" --label "good-first-issue,enhancement,help-wanted" --body "## Description
Show how many times each class/property is referenced in the ontology.

## Difficulty: Medium
## Skills: Graph Algorithms

## Tasks
- [ ] Count references for each entity
- [ ] Display count in properties panel
- [ ] Display count in tree
- [ ] Add 'Find Usages' feature

## Acceptance Criteria
- Usage count shown for all entities
- Count is accurate
- Updates when ontology changes"

gh issue create --title "Create 'Recent Ontologies' list" --label "good-first-issue,enhancement,help-wanted" --body "## Description
Implement a list of recently opened ontologies in welcome screen.

## Difficulty: Medium
## Skills: LocalStorage, React

## Tasks
- [ ] Track recently opened files
- [ ] Store in localStorage
- [ ] Display in welcome screen
- [ ] Allow quick opening

## Acceptance Criteria
- Recent files shown (up to 10)
- Clicking opens file
- Invalid files removed from list
- List persists across sessions"

gh issue create --title "Add graph layout algorithm selector" --label "good-first-issue,enhancement,help-wanted" --body "## Description
Add UI to select different graph layout algorithms.

## Difficulty: Medium
## Skills: React, ELK.js

## Tasks
- [ ] Add layout selector dropdown
- [ ] Implement layered layout
- [ ] Implement force-directed layout
- [ ] Save layout preference

## Acceptance Criteria
- Multiple layouts available
- Switching relayouts graph
- Preference persists
- Smooth transition"

gh issue create --title "Implement basic SPARQL query interface" --label "good-first-issue,enhancement,help-wanted" --body "## Description
Create a simple interface to run SPARQL queries against loaded ontology.

## Difficulty: Hard
## Skills: SPARQL, React

## Tasks
- [ ] Add SPARQL query editor
- [ ] Integrate SPARQL engine (e.g., comunica)
- [ ] Display query results
- [ ] Add sample queries

## Acceptance Criteria
- Queries execute correctly
- Results displayed in table
- Syntax highlighting in editor
- Sample queries provided"

echo "Done! Created 50 good first issues."
