# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-01-02

### Added

- **Individuals Feature**: Complete implementation of ontology individuals (instances)
  - IndividualList component with search and grouping by type
  - IndividualDetails component showing individual properties, types, and relationships
  - Context methods: `updateIndividual` and `deleteIndividual`
  - Sample individuals: John Doe, Jane Smith, ACME Corporation, Alice Johnson
  - Integration with tabs navigation and details panel
- GitHub repository link button in application header
- Documentation links now redirect to GitHub Wiki

### Changed

- Updated README documentation links to point to GitHub Wiki
- Updated sample data with richer individual examples including property assertions and relationships

### Fixed

- ESLint errors across test and source files
- Test framework compatibility (replaced vitest with jest in header tests)
- Prettier formatting issues
- Updated tests to match new sample data structure

## [0.1.0] - 2025-12-XX

### Added

- Initial project setup with Next.js 16, React 19, TypeScript 5
- Core ontology editing capabilities (Classes, Properties)
- Advanced Axiom Editor with Monaco-powered Manchester Syntax editing
- Hierarchical Visualization with automatic layout
- Multiple Format Support (Turtle, RDF/XML, OWL/XML, N-Triples)
- Client-Side Reasoning (HermiT-inspired reasoner)
- Modern UI with dark/light themes
- Command Palette (⌘+K) for quick access
- Professional ESLint and Prettier configuration
- Comprehensive logic-focused unit testing infrastructure (130+ tests)
- 95%+ test coverage on core modules

### Infrastructure

- Jest testing framework with React Testing Library
- TypeScript strict mode configuration
- Tailwind CSS with Shadcn/ui components
- React Context API for state management

---

## Release Notes

### Semantic Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version (X.0.0): Incompatible API changes
- **MINOR** version (0.X.0): New functionality in a backward compatible manner
- **PATCH** version (0.0.X): Backward compatible bug fixes

### Pre-release Versions (0.x.x)

During initial development (versions 0.x.x), the API may change without incrementing the major version. Once we reach version 1.0.0, we will strictly follow semantic versioning.

[0.2.0]: https://github.com/aadorian/ProtegeDesk/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/aadorian/ProtegeDesk/releases/tag/v0.1.0
