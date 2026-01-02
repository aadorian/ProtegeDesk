# Software Requirements Specification (SRS)
## Modern TypeScript-Based Ontology Editor

**Document Version:** 1.0  
**Date:** December 29, 2025  
**IEEE Standard 830-1998 Compliant**

---

## Table of Contents

1. [Introduction](#1-introduction)
   - 1.1 [Purpose](#11-purpose)
   - 1.2 [Scope](#12-scope)
   - 1.3 [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
   - 1.4 [References](#14-references)
   - 1.5 [Overview](#15-overview)
2. [Overall Description](#2-overall-description)
   - 2.1 [Product Perspective](#21-product-perspective)
   - 2.2 [Product Functions](#22-product-functions)
   - 2.3 [User Characteristics](#23-user-characteristics)
   - 2.4 [Constraints](#24-constraints)
   - 2.5 [Assumptions and Dependencies](#25-assumptions-and-dependencies)
3. [Specific Requirements](#3-specific-requirements)
   - 3.1 [Functional Requirements](#31-functional-requirements)
   - 3.2 [Non-Functional Requirements](#32-non-functional-requirements)
   - 3.3 [External Interface Requirements](#33-external-interface-requirements)
   - 3.4 [Performance Requirements](#34-performance-requirements)
   - 3.5 [Design Constraints](#35-design-constraints)
4. [System Features](#4-system-features)
5. [Appendices](#5-appendices)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a comprehensive description of the requirements for a modern, TypeScript-based ontology editor system. The system aims to replicate and enhance the functionality of Protege, a widely-used ontology development tool, using contemporary web technologies and user interface paradigms.

This document is intended for:
- Development team members responsible for implementing the system
- Project managers overseeing development
- Quality assurance teams conducting testing
- Stakeholders evaluating system capabilities
- Maintenance teams responsible for future updates

### 1.2 Scope

**Product Name:** Modern Ontology Editor (MOE)

**Product Description:** A web-based ontology engineering platform that enables users to create, edit, visualize, and reason over OWL (Web Ontology Language) ontologies using a modern TypeScript stack.

**Key Capabilities:**
- Advanced axiom editing using Manchester Syntax with intelligent code completion
- Hierarchical visualization of ontology structures with automatic layout
- Client-side and server-side reasoning capabilities
- AI-assisted ontology development using Large Language Models
- Import/export of ontology files in multiple formats (Turtle, RDF/XML, OWL/XML)
- Collaborative ontology development features

**Benefits:**
- Modern, responsive user interface accessible through web browsers
- Reduced learning curve through intelligent autocomplete and AI assistance
- Improved performance through incremental loading and optimized rendering
- Enhanced collaboration through cloud-based architecture
- Cross-platform compatibility without installation requirements

**Out of Scope:**
- Version control system integration (planned for future release)
- Multi-user real-time collaboration (planned for future release)
- Mobile application development (web-responsive only)

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| **API** | Application Programming Interface |
| **AI** | Artificial Intelligence |
| **CSS** | Cascading Style Sheets |
| **ELK** | Eclipse Layout Kernel - a graph layout algorithm library |
| **IRI** | Internationalized Resource Identifier |
| **JSON** | JavaScript Object Notation |
| **LLM** | Large Language Model |
| **LSP** | Language Server Protocol |
| **Monaco** | The code editor that powers VS Code |
| **N3** | Notation3 - a format for RDF data |
| **NLP** | Natural Language Processing |
| **OWL** | Web Ontology Language |
| **RDF** | Resource Description Framework |
| **SRS** | Software Requirements Specification |
| **Tree-sitter** | An incremental parsing system for programming tools |
| **TS** | TypeScript |
| **TTL** | Turtle - Terse RDF Triple Language |
| **UI/UX** | User Interface / User Experience |
| **WASM** | WebAssembly |
| **Zustand** | A state management library for React |

**Domain-Specific Terms:**
- **Axiom**: A statement or assertion in an ontology
- **Class**: A concept or category in an ontology
- **Individual**: An instance of a class
- **Manchester Syntax**: A human-readable syntax for OWL expressions
- **Object Property**: A relationship between two individuals
- **Ontology**: A formal representation of knowledge as a set of concepts and relationships
- **Reasoner**: A software component that infers logical consequences from ontology axioms
- **SubClassOf**: A hierarchical relationship indicating inheritance

### 1.4 References

1. IEEE Std 830-1998, IEEE Recommended Practice for Software Requirements Specifications
2. W3C OWL 2 Web Ontology Language Specification: https://www.w3.org/TR/owl2-overview/
3. Manchester OWL Syntax: https://www.w3.org/TR/owl2-manchester-syntax/
4. Tree-sitter OWL2 Manchester Syntax Grammar: https://github.com/tree-sitter/tree-sitter-owl2-manchester-syntax
5. React Flow (XyFlow) Documentation: https://reactflow.dev/
6. Monaco Editor Documentation: https://microsoft.github.io/monaco-editor/
7. ELK.js Documentation: https://github.com/kieler/elkjs
8. Vercel AI SDK Documentation: https://sdk.vercel.ai/docs
9. N3.js Library Documentation: https://github.com/rdfjs/N3.js

### 1.5 Overview

This SRS document is organized into five main sections:

**Section 2** provides an overall description of the system, including its context, main functions, user characteristics, constraints, and dependencies.

**Section 3** details the specific functional and non-functional requirements that the system must satisfy.

**Section 4** describes the major system features and their associated requirements.

**Section 5** contains appendices with supplementary information.

---

## 2. Overall Description

### 2.1 Product Perspective

The Modern Ontology Editor (MOE) is a standalone web-based application that serves as a next-generation replacement for the desktop-based Protege ontology editor. The system operates within the following context:

**System Interfaces:**
- Web Browser: Primary interface for user interaction (Chrome, Firefox, Safari, Edge)
- File System: Local file access for importing/exporting ontology files
- Backend Services: Optional server-side reasoning and AI processing

**User Interfaces:**
- Web-based graphical user interface
- Code editor interface for Manchester Syntax
- Visual graph interface for ontology exploration
- Command palette for AI-assisted operations

**Hardware Interfaces:**
- Standard desktop/laptop computers with modern browsers
- Minimum 8GB RAM recommended for large ontologies
- Graphics acceleration recommended for smooth visualization

**Software Interfaces:**
- Browser File System Access API for local file operations
- WebAssembly for client-side reasoning
- REST API for server-side reasoning services
- LLM APIs (OpenAI, Anthropic) for AI assistance

**Communication Interfaces:**
- HTTPS for secure communication with backend services
- WebSocket (future) for real-time collaboration
- JSON-RPC for reasoning service communication

**Memory Constraints:**
- Browser memory limitations (typically 2-4GB per tab)
- Ontology size limited by available client memory

**Operations:**
- Concurrent editing of multiple ontologies
- Background reasoning operations
- Asynchronous AI processing

### 2.2 Product Functions

The system provides the following major functions:

1. **Ontology Creation and Editing**
   - Create new ontologies from scratch or templates
   - Import existing ontologies in various formats
   - Edit classes, properties, and individuals
   - Define complex axioms using Manchester Syntax

2. **Advanced Code Editing**
   - Syntax highlighting for Manchester Syntax
   - Intelligent autocomplete based on ontology context
   - Real-time syntax validation
   - Error detection and suggestion

3. **Visual Ontology Exploration**
   - Hierarchical graph visualization of classes and relationships
   - Interactive node manipulation and exploration
   - Automatic graph layout with customizable algorithms
   - Incremental loading for large ontologies

4. **Reasoning and Inference**
   - Client-side reasoning using WASM-based engines
   - Server-side reasoning for complex operations
   - Consistency checking
   - Classification and inference

5. **AI-Assisted Development**
   - Natural language ontology generation
   - Schema suggestion based on domain description
   - Automated class hierarchy creation
   - Property recommendation

6. **Import/Export Capabilities**
   - Support for Turtle (.ttl) format
   - Support for RDF/XML format
   - Support for OWL/XML format
   - Support for N-Triples format

7. **User Interface Management**
   - Customizable workspace layout
   - Theme customization (light/dark modes)
   - Keyboard shortcuts and command palette
   - Entity-specific visual coding

### 2.3 User Characteristics

**Primary User Type: Ontology Engineers**
- **Education Level:** Graduate degree in computer science, information science, or related field
- **Technical Expertise:** High - familiar with semantic web technologies, logic, and knowledge representation
- **Domain Knowledge:** Varies - experts in specific domains (healthcare, finance, etc.)
- **Usage Frequency:** Daily - professional use for ontology development

**Secondary User Type: Researchers**
- **Education Level:** Graduate students or researchers
- **Technical Expertise:** Medium - basic understanding of ontologies and semantic web
- **Domain Knowledge:** High in specific research areas
- **Usage Frequency:** Regular - for research projects and publications

**Tertiary User Type: Knowledge Engineers**
- **Education Level:** Undergraduate to graduate level
- **Technical Expertise:** Medium - learning ontology development
- **Domain Knowledge:** Developing
- **Usage Frequency:** Learning phase - transitioning to regular use

**User Needs:**
- Intuitive interface with minimal learning curve
- Fast performance with large ontologies
- Reliable reasoning capabilities
- Clear visualization of complex relationships
- AI assistance for common tasks

### 2.4 Constraints

**Regulatory Constraints:**
- Must comply with data privacy regulations (GDPR, CCPA) when handling user ontologies
- Must adhere to W3C standards for OWL and RDF

**Hardware Limitations:**
- Performance dependent on client machine capabilities
- Browser memory limits restrict maximum ontology size
- Rendering performance varies by graphics hardware

**Technology Constraints:**
- Must run in modern web browsers (last 2 versions)
- Dependent on browser support for File System Access API
- WebAssembly required for client-side reasoning

**Security Constraints:**
- Cannot access server resources without proper authentication
- Must sanitize user input to prevent injection attacks
- Must secure API keys for LLM services

**Interface Constraints:**
- Must maintain compatibility with standard OWL formats
- Must provide backward compatibility with Protege-generated ontologies

**Development Constraints:**
- Must use TypeScript for type safety
- Must follow React best practices
- Must maintain modular architecture for future extensions

**Schedule Constraints:**
- MVP delivery within 6 months
- Phased feature rollout for complex capabilities

### 2.5 Assumptions and Dependencies

**Assumptions:**
1. Users have access to modern web browsers with JavaScript enabled
2. Users have basic familiarity with ontology concepts
3. Internet connectivity is available for AI features and server-side reasoning
4. Users accept browser-based storage for ontology files
5. AI services (OpenAI, Anthropic) maintain API availability

**Dependencies:**

**External Libraries:**
- React 18+ for UI framework
- TypeScript 5+ for development
- Monaco Editor for code editing
- React Flow (XyFlow) for graph visualization
- ELK.js for graph layout algorithms
- N3.js for ontology parsing and serialization
- Zustand for state management
- Immer for immutable state updates
- Tailwind CSS for styling
- Lucide Icons for iconography
- Vercel AI SDK for LLM integration

**External Services:**
- OpenAI API or Anthropic Claude API for AI assistance
- Optional: Backend reasoning service (Spring Boot or FastAPI)
- Optional: Cloud storage service for ontology persistence

**Browser APIs:**
- File System Access API (Chrome 86+, Edge 86+)
- WebAssembly support
- Local Storage API
- IndexedDB for large ontology caching

**Standards Compliance:**
- W3C OWL 2 specification
- W3C RDF 1.1 specification
- Manchester OWL Syntax specification

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 Ontology Management

**FR-OM-001: Create New Ontology**
- **Description:** The system shall allow users to create a new, empty ontology
- **Priority:** High
- **Inputs:** Ontology name, base IRI, optional metadata
- **Processing:** Initialize ontology structure in application state
- **Outputs:** Empty ontology ready for editing
- **Dependencies:** None

**FR-OM-002: Import Ontology File**
- **Description:** The system shall allow users to import ontology files from local storage
- **Priority:** High
- **Inputs:** File path, format specification (auto-detect or manual)
- **Processing:** Parse file using N3.js, validate structure, load into application state
- **Outputs:** Loaded ontology displayed in editor
- **Dependencies:** N3.js library, File System Access API
- **Supported Formats:** Turtle (.ttl), RDF/XML (.rdf, .owl), N-Triples (.nt)

**FR-OM-003: Export Ontology File**
- **Description:** The system shall allow users to export ontologies to local storage
- **Priority:** High
- **Inputs:** Target format, file location
- **Processing:** Serialize ontology using N3.js, write to file system
- **Outputs:** File saved to user-specified location
- **Dependencies:** N3.js library, File System Access API

**FR-OM-004: Save Ontology State**
- **Description:** The system shall automatically save ontology editing state
- **Priority:** Medium
- **Inputs:** Current ontology state
- **Processing:** Serialize to browser's IndexedDB
- **Outputs:** Persisted state recoverable on browser restart
- **Dependencies:** IndexedDB API

**FR-OM-005: Manage Multiple Ontologies**
- **Description:** The system shall allow users to work with multiple ontologies simultaneously
- **Priority:** Medium
- **Inputs:** Multiple ontology files
- **Processing:** Maintain separate state for each ontology
- **Outputs:** Tab-based interface for switching between ontologies
- **Dependencies:** Zustand state management

#### 3.1.2 Axiom Editor

**FR-AE-001: Manchester Syntax Editing**
- **Description:** The system shall provide a code editor supporting Manchester Syntax
- **Priority:** High
- **Inputs:** User text input
- **Processing:** Real-time syntax parsing and validation
- **Outputs:** Formatted, highlighted code
- **Dependencies:** Monaco Editor, Tree-sitter grammar

**FR-AE-002: Syntax Highlighting**
- **Description:** The system shall highlight Manchester Syntax keywords and structures
- **Priority:** High
- **Inputs:** Ontology axiom text
- **Processing:** Apply Tree-sitter grammar for token identification
- **Outputs:** Color-coded syntax display
- **Keywords:** some, only, and, or, not, min, max, exactly, value, SubClassOf, EquivalentTo, DisjointWith

**FR-AE-003: Intelligent Autocomplete**
- **Description:** The system shall provide context-aware autocomplete suggestions
- **Priority:** High
- **Inputs:** Cursor position, partial text, ontology context
- **Processing:** 
  - Extract available classes, properties, and individuals from ontology
  - Filter based on partial input
  - Rank by relevance and usage frequency
- **Outputs:** Dropdown suggestion list
- **Dependencies:** Monaco Editor completion provider
- **Trigger:** User input or Ctrl+Space

**FR-AE-004: Real-time Validation**
- **Description:** The system shall validate axioms in real-time
- **Priority:** High
- **Inputs:** Axiom text
- **Processing:** Parse with Tree-sitter, check for syntax errors
- **Outputs:** Inline error markers and messages
- **Dependencies:** Tree-sitter parser

**FR-AE-005: Quick Fixes and Suggestions**
- **Description:** The system shall offer quick fixes for common errors
- **Priority:** Medium
- **Inputs:** Error location and type
- **Processing:** Analyze error context and suggest corrections
- **Outputs:** Code action suggestions
- **Examples:** Missing closing parenthesis, undefined entity reference

**FR-AE-006: Entity Navigation**
- **Description:** The system shall allow users to navigate to entity definitions
- **Priority:** Medium
- **Inputs:** Ctrl+Click or F12 on entity reference
- **Processing:** Locate entity definition in ontology
- **Outputs:** Navigate to entity definition or properties panel
- **Dependencies:** Monaco Editor navigation API

#### 3.1.3 Visualization System

**FR-VS-001: Hierarchical Graph Rendering**
- **Description:** The system shall render ontology class hierarchies as interactive graphs
- **Priority:** High
- **Inputs:** Ontology class structure
- **Processing:** 
  - Convert classes to nodes
  - Convert subClassOf relationships to edges
  - Apply automatic layout algorithm
- **Outputs:** Interactive graph visualization
- **Dependencies:** React Flow, ELK.js

**FR-VS-002: Automatic Layout**
- **Description:** The system shall automatically arrange nodes for optimal readability
- **Priority:** High
- **Inputs:** Graph structure (nodes and edges)
- **Processing:** Apply ELK layered layout algorithm
- **Outputs:** Positioned nodes with minimal edge crossings
- **Configuration:** 
  - Layout direction: TOP_DOWN (default), LEFT_RIGHT, BOTTOM_UP
  - Node spacing: configurable (default 80px)
  - Layer spacing: configurable

**FR-VS-003: Incremental Loading**
- **Description:** The system shall load large ontologies incrementally
- **Priority:** High
- **Inputs:** Ontology structure, viewport boundaries
- **Processing:** 
  - Load root nodes immediately
  - Load child nodes on expansion or viewport entry
  - Unload off-screen nodes when memory threshold reached
- **Outputs:** Smooth navigation of large ontologies (1000+ classes)
- **Performance Target:** < 100ms for viewport updates

**FR-VS-004: Node Interaction**
- **Description:** The system shall support interactive node operations
- **Priority:** High
- **Operations:**
  - Click: Select node and display properties
  - Double-click: Expand/collapse children
  - Drag: Move node and connected subgraph
  - Right-click: Context menu (edit, delete, add child)
- **Outputs:** Updated graph state and UI

**FR-VS-005: Edge Visualization**
- **Description:** The system shall display different edge types distinctly
- **Priority:** Medium
- **Edge Types:**
  - subClassOf: Solid arrow
  - ObjectProperty: Labeled dashed arrow
  - DataProperty: Labeled dotted arrow
  - equivalentClass: Double-headed arrow
- **Outputs:** Color-coded, labeled edges

**FR-VS-006: Search and Filter**
- **Description:** The system shall allow users to search and filter the graph
- **Priority:** Medium
- **Inputs:** Search query, filter criteria
- **Processing:** 
  - Text search across class names and IRIs
  - Filter by namespace, property, or annotation
  - Highlight matching nodes
- **Outputs:** Filtered/highlighted graph view

**FR-VS-007: Zoom and Pan**
- **Description:** The system shall support smooth zoom and pan operations
- **Priority:** Medium
- **Inputs:** Mouse wheel (zoom), mouse drag (pan), pinch gesture (zoom on touch)
- **Processing:** Update viewport transformation
- **Outputs:** Smooth animation to new viewport position
- **Range:** 10% to 400% zoom level

**FR-VS-008: Entity Color Coding**
- **Description:** The system shall use consistent colors for entity types
- **Priority:** Low
- **Color Scheme:**
  - Classes: Orange (#FF8C00)
  - Object Properties: Blue (#0066CC)
  - Data Properties: Green (#00AA00)
  - Individuals: Purple (#9933CC)
- **Outputs:** Visually distinct entity types

**FR-VS-009: Export Visualization**
- **Description:** The system shall allow users to export graph visualizations
- **Priority:** Low
- **Formats:** PNG, SVG, PDF
- **Inputs:** Current viewport or entire graph
- **Processing:** Render to selected format
- **Outputs:** Downloaded image file

#### 3.1.4 Reasoning Engine

**FR-RE-001: Client-Side Reasoning**
- **Description:** The system shall perform reasoning operations in the browser
- **Priority:** High
- **Inputs:** Ontology axioms
- **Processing:** Use EYE-JS WASM reasoner
- **Outputs:** Inferred axioms, consistency report
- **Operations:** Classification, consistency checking, instance realization
- **Dependencies:** EYE-JS library

**FR-RE-002: Server-Side Reasoning**
- **Description:** The system shall support external reasoning services for complex operations
- **Priority:** Medium
- **Inputs:** Serialized ontology (Turtle or OWL/XML)
- **Processing:** 
  - Send ontology to reasoning service endpoint
  - Wait for response with inferred axioms
  - Merge results back into ontology state
- **Outputs:** Inferred axioms, consistency report
- **Supported Reasoners:** HermiT, Pellet, ELK, Fact++
- **Communication:** REST API with JSON/Turtle payload

**FR-RE-003: Consistency Checking**
- **Description:** The system shall check ontology consistency
- **Priority:** High
- **Inputs:** Complete ontology
- **Processing:** 
  - Run reasoner over all axioms
  - Detect contradictions and unsatisfiable classes
- **Outputs:** Consistency status, list of problems
- **Trigger:** Manual or automatic (on save)

**FR-RE-004: Class Classification**
- **Description:** The system shall compute the class hierarchy
- **Priority:** High
- **Inputs:** Class axioms
- **Processing:** Infer subClassOf relationships
- **Outputs:** Complete class hierarchy including inferred relationships
- **Visualization:** Dashed lines for inferred relationships

**FR-RE-005: Instance Realization**
- **Description:** The system shall infer types of individuals
- **Priority:** Medium
- **Inputs:** Individual assertions and class definitions
- **Processing:** Determine all classes that individuals belong to
- **Outputs:** Complete individual types including inferred ones

**FR-RE-006: Explanation Generation**
- **Description:** The system shall explain reasoning results
- **Priority:** Medium
- **Inputs:** Inferred axiom
- **Processing:** Trace inference chain back to asserted axioms
- **Outputs:** Human-readable explanation of inference
- **Format:** Dependency tree or step-by-step derivation

**FR-RE-007: Reasoning Configuration**
- **Description:** The system shall allow users to configure reasoning parameters
- **Priority:** Low
- **Parameters:** Reasoner selection, timeout limits, inference types
- **Outputs:** Configuration saved to user preferences

#### 3.1.5 AI Co-Pilot

**FR-AI-001: Command Palette Interface**
- **Description:** The system shall provide a command palette for AI interactions
- **Priority:** High
- **Inputs:** Keyboard shortcut (⌘/Ctrl+K)
- **Processing:** Display command input interface
- **Outputs:** Overlay command palette
- **Dependencies:** Shadcn Command component

**FR-AI-002: Natural Language Ontology Generation**
- **Description:** The system shall generate ontology structures from natural language descriptions
- **Priority:** High
- **Inputs:** Domain description (e.g., "Create an ontology for a smart home")
- **Processing:**
  - Send prompt to LLM API (OpenAI GPT-4 or Claude)
  - Parse LLM response for class hierarchy and properties
  - Validate generated structure
- **Outputs:** Generated classes, properties, and relationships inserted into ontology
- **Example Prompts:**
  - "Add a Device hierarchy with sensors and actuators"
  - "Create properties linking rooms to devices"

**FR-AI-003: Class Hierarchy Suggestion**
- **Description:** The system shall suggest class hierarchies for specific domains
- **Priority:** High
- **Inputs:** Domain name or description
- **Processing:** 
  - Query LLM for typical class structure
  - Present suggestions with confidence scores
- **Outputs:** List of suggested classes with parent-child relationships
- **User Action:** Accept all, select individual classes, or reject

**FR-AI-004: Property Recommendation**
- **Description:** The system shall recommend properties for selected classes
- **Priority:** Medium
- **Inputs:** Selected class
- **Processing:**
  - Analyze class name and existing properties
  - Query LLM for appropriate object and data properties
- **Outputs:** Suggested properties with domain and range
- **Example:** For "Person" class, suggest "hasAge", "hasName", "worksFor"

**FR-AI-005: Axiom Generation**
- **Description:** The system shall generate complex axioms from natural language
- **Priority:** Medium
- **Inputs:** Natural language constraint description
- **Processing:** Convert to Manchester Syntax axiom
- **Outputs:** Validated axiom ready for insertion
- **Example:** "A vegetarian pizza has no meat toppings" → "VegetarianPizza SubClassOf Pizza and (hasTopping only (not MeatTopping))"

**FR-AI-006: Ontology Review and Suggestions**
- **Description:** The system shall analyze ontologies and suggest improvements
- **Priority:** Low
- **Inputs:** Complete ontology
- **Processing:** 
  - Identify potential issues (missing properties, inconsistent naming)
  - Suggest design pattern improvements
- **Outputs:** List of recommendations with explanations

**FR-AI-007: API Key Management**
- **Description:** The system shall securely manage LLM API keys
- **Priority:** High
- **Storage:** Browser local storage (encrypted)
- **Configuration:** User settings panel for API key entry
- **Security:** Never expose keys in logs or error messages

#### 3.1.6 Class Tree Sidebar

**FR-CT-001: Hierarchical Class Display**
- **Description:** The system shall display classes in a collapsible tree structure
- **Priority:** High
- **Inputs:** Ontology class hierarchy
- **Processing:** Render tree with expand/collapse controls
- **Outputs:** Navigable class tree
- **Features:** 
  - Root node: owl:Thing
  - Indentation indicates hierarchy level
  - Icons indicate expandable nodes

**FR-CT-002: Class Selection**
- **Description:** The system shall allow users to select classes from the tree
- **Priority:** High
- **Inputs:** Click on class name
- **Processing:** Update application state with selected class
- **Outputs:** 
  - Highlight selected class
  - Display class details in properties panel
  - Center class in graph view

**FR-CT-003: Quick Class Creation**
- **Description:** The system shall allow users to quickly add classes
- **Priority:** Medium
- **Inputs:** Right-click menu or keyboard shortcut
- **Processing:** Display inline editor for new class name
- **Outputs:** New class added as child of selected class

**FR-CT-004: Class Search**
- **Description:** The system shall provide search functionality in the class tree
- **Priority:** Medium
- **Inputs:** Search query
- **Processing:** Filter tree to matching classes, expand parent nodes
- **Outputs:** Filtered tree view with matches highlighted

**FR-CT-005: Class Drag and Drop**
- **Description:** The system shall allow users to reorganize classes via drag and drop
- **Priority:** Low
- **Inputs:** Drag class to new parent
- **Processing:** Update subClassOf relationships
- **Outputs:** Reorganized tree and updated axioms

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance Requirements

**NFR-PERF-001: Editor Responsiveness**
- **Requirement:** The axiom editor shall provide real-time feedback with < 50ms latency
- **Measurement:** Time from keystroke to syntax highlighting update
- **Priority:** High

**NFR-PERF-002: Graph Rendering Performance**
- **Requirement:** The visualization system shall render graphs with up to 1,000 nodes at ≥30 FPS
- **Measurement:** Frames per second during pan and zoom operations
- **Priority:** High

**NFR-PERF-003: Incremental Loading Time**
- **Requirement:** The system shall load additional graph nodes in < 100ms
- **Measurement:** Time from expand action to node appearance
- **Priority:** High

**NFR-PERF-004: Reasoning Response Time**
- **Requirement:** Client-side consistency checking shall complete in < 5 seconds for ontologies with 500 classes
- **Measurement:** Time from reasoning start to result display
- **Priority:** Medium
- **Fallback:** Offer server-side reasoning for larger ontologies

**NFR-PERF-005: File Import Speed**
- **Requirement:** The system shall import ontology files at a rate of ≥ 1,000 axioms per second
- **Measurement:** Total axioms / import time
- **Priority:** Medium

**NFR-PERF-006: AI Response Time**
- **Requirement:** AI-generated suggestions shall return in < 10 seconds
- **Measurement:** Time from request submission to result display
- **Priority:** Medium
- **Dependencies:** LLM API response time

**NFR-PERF-007: Memory Efficiency**
- **Requirement:** The system shall operate within 2GB browser memory for ontologies up to 10,000 axioms
- **Measurement:** Peak memory usage during editing session
- **Priority:** Medium

#### 3.2.2 Reliability Requirements

**NFR-REL-001: Availability**
- **Requirement:** The client application shall maintain 99.9% availability
- **Measurement:** Uptime excluding browser crashes
- **Priority:** High

**NFR-REL-002: Data Integrity**
- **Requirement:** The system shall prevent data loss during editing sessions
- **Mechanism:** Auto-save every 30 seconds, crash recovery
- **Priority:** Critical

**NFR-REL-003: Error Recovery**
- **Requirement:** The system shall recover gracefully from parsing errors
- **Behavior:** Display error message, preserve valid data, allow correction
- **Priority:** High

**NFR-REL-004: State Consistency**
- **Requirement:** The system shall maintain consistent state across all views
- **Mechanism:** Centralized state management with Zustand
- **Priority:** High

#### 3.2.3 Usability Requirements

**NFR-USE-001: Learning Curve**
- **Requirement:** New users with basic ontology knowledge shall create a simple ontology within 30 minutes
- **Measurement:** User study timing
- **Priority:** High
- **Support:** Provide interactive tutorials and examples

**NFR-USE-002: Accessibility**
- **Requirement:** The system shall comply with WCAG 2.1 Level AA standards
- **Features:** Keyboard navigation, screen reader support, color contrast
- **Priority:** Medium

**NFR-USE-003: Responsive Design**
- **Requirement:** The interface shall adapt to screen sizes from 1280x720 to 3840x2160
- **Behavior:** Resize panels, adjust font sizes, maintain usability
- **Priority:** High

**NFR-USE-004: Error Messages**
- **Requirement:** Error messages shall be clear, specific, and actionable
- **Format:** "[Location]: [Problem] - [Suggested Action]"
- **Priority:** Medium

**NFR-USE-005: Keyboard Shortcuts**
- **Requirement:** The system shall provide keyboard shortcuts for common operations
- **Coverage:** ≥ 80% of frequent actions accessible via keyboard
- **Priority:** Medium

#### 3.2.4 Security Requirements

**NFR-SEC-001: Input Validation**
- **Requirement:** The system shall validate and sanitize all user inputs
- **Mechanism:** Whitelist validation for IRIs, escape special characters
- **Priority:** High
- **Protection Against:** XSS, injection attacks

**NFR-SEC-002: API Key Protection**
- **Requirement:** LLM API keys shall be stored encrypted in browser storage
- **Mechanism:** Browser Crypto API for encryption
- **Priority:** High

**NFR-SEC-003: Secure Communication**
- **Requirement:** All external API calls shall use HTTPS/TLS 1.3+
- **Scope:** LLM APIs, reasoning services
- **Priority:** High

**NFR-SEC-004: Content Security Policy**
- **Requirement:** The application shall implement strict CSP headers
- **Policy:** No inline scripts, whitelist external domains
- **Priority:** Medium

**NFR-SEC-005: Authentication (Future)**
- **Requirement:** Server-side components shall require authentication
- **Mechanism:** JWT tokens, OAuth 2.0
- **Priority:** Low (planned for cloud version)

#### 3.2.5 Maintainability Requirements

**NFR-MAIN-001: Code Quality**
- **Requirement:** All TypeScript code shall have type coverage ≥ 95%
- **Measurement:** TypeScript compiler strictness checks
- **Priority:** High

**NFR-MAIN-002: Modularity**
- **Requirement:** The system shall be organized into independent, reusable modules
- **Architecture:** Feature-based folder structure, clear interfaces
- **Priority:** High

**NFR-MAIN-003: Documentation**
- **Requirement:** All public APIs and components shall have JSDoc documentation
- **Coverage:** 100% of exported functions and components
- **Priority:** Medium

**NFR-MAIN-004: Testing**
- **Requirement:** The system shall have ≥ 80% code coverage with automated tests
- **Types:** Unit tests, integration tests, E2E tests
- **Priority:** High

**NFR-MAIN-005: Dependency Management**
- **Requirement:** External dependencies shall be kept up-to-date and minimal
- **Policy:** Review and update quarterly, audit for vulnerabilities
- **Priority:** Medium

#### 3.2.6 Portability Requirements

**NFR-PORT-001: Browser Compatibility**
- **Requirement:** The system shall support the last 2 versions of major browsers
- **Browsers:** Chrome, Firefox, Safari, Edge
- **Testing:** Automated cross-browser testing
- **Priority:** High

**NFR-PORT-002: Operating System Independence**
- **Requirement:** The system shall function identically across operating systems
- **OS:** Windows, macOS, Linux
- **Priority:** High

**NFR-PORT-003: Format Interoperability**
- **Requirement:** The system shall import/export standard OWL formats without data loss
- **Validation:** Round-trip testing with reference ontologies
- **Priority:** High

### 3.3 External Interface Requirements

#### 3.3.1 User Interface Requirements

**UIR-001: Main Window Layout**
- **Description:** The main window shall consist of:
  - Top: Menu bar and toolbar
  - Left: Class tree sidebar (collapsible, 250-400px)
  - Center: Graph view or axiom editor (resizable)
  - Right: Properties panel (collapsible, 300-500px)
  - Bottom: Status bar
- **Responsiveness:** Panels shall resize proportionally
- **Persistence:** Layout preferences saved to local storage

**UIR-002: Theme Support**
- **Description:** The system shall provide light and dark themes
- **Switching:** Theme toggle in settings, respects OS preference
- **Coverage:** All UI components themed consistently

**UIR-003: Command Palette**
- **Description:** A searchable command palette accessible via ⌘/Ctrl+K
- **Features:** 
  - Fuzzy search across all commands
  - Recent commands history
  - AI co-pilot integration
- **Position:** Centered overlay

**UIR-004: Context Menus**
- **Description:** Right-click shall display context-appropriate menus
- **Locations:** Graph nodes, tree items, editor
- **Contents:** Relevant actions based on selected entity type

**UIR-005: Modal Dialogs**
- **Description:** Modal dialogs for confirming destructive actions
- **Style:** Centered, semi-transparent backdrop, escape to close
- **Accessibility:** Trap focus within modal

#### 3.3.2 Hardware Interface Requirements

**HIR-001: Display Requirements**
- **Minimum Resolution:** 1280x720
- **Recommended Resolution:** 1920x1080 or higher
- **Color Depth:** 24-bit (16.7 million colors)

**HIR-002: Input Devices**
- **Keyboard:** Standard 101-key or equivalent
- **Mouse/Trackpad:** Two-button with scroll wheel
- **Touch Support:** Optional for touch-enabled displays

**HIR-003: Graphics Acceleration**
- **Requirement:** Hardware acceleration for WebGL rendering
- **Fallback:** Software rendering for non-accelerated systems
- **Performance Impact:** Graph rendering may be slower without acceleration

#### 3.3.3 Software Interface Requirements

**SIR-001: Browser Requirements**
- **Minimum Versions:**
  - Chrome/Edge: 86+
  - Firefox: 82+
  - Safari: 14+
- **Required Features:** ES2020, WebAssembly, File System Access API

**SIR-002: Monaco Editor Integration**
- **Version:** 0.45.0 or later
- **Configuration:** Custom language definition for OWL Manchester Syntax
- **API Usage:** Language services, completion providers, diagnostics

**SIR-003: React Flow Integration**
- **Version:** @xyflow/react 12.0.0 or later
- **Configuration:** Custom node types, edge types, layout plugin
- **API Usage:** Node positioning, event handling, viewport controls

**SIR-004: ELK.js Integration**
- **Version:** 0.9.0 or later
- **Algorithm:** Layered layout algorithm
- **Configuration:** Direction, spacing, port constraints

**SIR-005: N3.js Integration**
- **Version:** 1.17.0 or later
- **Usage:** Parsing and serialization of Turtle, N-Triples, RDF/XML
- **API:** Parser, Writer, Store interfaces

**SIR-006: LLM API Integration**
- **Providers:** OpenAI GPT-4, Anthropic Claude
- **SDK:** Vercel AI SDK 3.0 or later
- **Protocol:** HTTPS REST API
- **Authentication:** Bearer token (API key)
- **Rate Limiting:** Respect provider limits (e.g., 10 requests/minute)

**SIR-007: Reasoning Service API (Optional)**
- **Protocol:** REST over HTTPS
- **Request Format:** JSON with base64-encoded Turtle
- **Response Format:** JSON with inferred axioms array
- **Endpoints:**
  - POST /reason/consistency
  - POST /reason/classify
  - POST /reason/realize

#### 3.3.4 Communication Interface Requirements

**CIR-001: HTTP/HTTPS Protocol**
- **Usage:** All external service communication
- **Version:** HTTP/2 or HTTP/3
- **Security:** TLS 1.3 minimum

**CIR-002: File System Communication**
- **API:** File System Access API
- **Permissions:** User-granted per-file access
- **Operations:** Read, write, watch for changes

**CIR-003: IndexedDB Communication**
- **Usage:** Local ontology caching and state persistence
- **Database Name:** "ontology-editor-db"
- **Stores:** "ontologies", "preferences", "history"

### 3.4 Performance Requirements

*(See Section 3.2.1 for detailed performance requirements)*

**Summary:**
- Editor latency: < 50ms
- Graph rendering: ≥30 FPS for 1,000 nodes
- Incremental loading: < 100ms
- Reasoning: < 5s for 500 classes
- File import: ≥1,000 axioms/second
- AI response: < 10 seconds
- Memory usage: ≤ 2GB for 10,000 axioms

### 3.5 Design Constraints

**DC-001: Technology Stack**
- **Frontend Framework:** React 18+
- **Language:** TypeScript 5+
- **Build Tool:** Next.js 14+ or Vite
- **State Management:** Zustand with Immer
- **Styling:** Tailwind CSS
- **Justification:** Modern, type-safe, performant, maintainable

**DC-002: Standards Compliance**
- **OWL Specification:** W3C OWL 2
- **RDF Specification:** W3C RDF 1.1
- **Manchester Syntax:** W3C OWL 2 Manchester Syntax
- **Justification:** Interoperability with existing tools and ontologies

**DC-003: Architecture Pattern**
- **Pattern:** Component-based architecture with unidirectional data flow
- **State Management:** Centralized store with immutable updates
- **Justification:** Predictable state management, easier testing

**DC-004: Browser-Based Deployment**
- **Constraint:** Application must run entirely in web browser
- **Implication:** Limited to browser capabilities and APIs
- **Justification:** Cross-platform compatibility, no installation required

**DC-005: Open Source Dependencies**
- **Constraint:** Prefer MIT or Apache 2.0 licensed libraries
- **Justification:** Licensing compatibility, community support

---

## 4. System Features

### 4.1 Feature: Advanced Axiom Editor with Manchester Syntax

**Priority:** High  
**Dependencies:** Monaco Editor, Tree-sitter

#### 4.1.1 Description

The axiom editor provides a sophisticated code editing experience specifically tailored for OWL Manchester Syntax. It combines syntax highlighting, intelligent autocomplete, and real-time validation to enable efficient ontology development. The editor functions as the primary interface for defining complex class expressions, property assertions, and other OWL constructs.

#### 4.1.2 Functional Requirements

- **FR-AE-001 to FR-AE-006** (detailed in Section 3.1.2)

#### 4.1.3 Implementation Details

**Component Structure:**
```
components/
  AxiomEditor/
    AxiomEditor.tsx          # Main editor component
    ManchesterSyntaxLanguage.ts  # Language definition
    CompletionProvider.ts    # Autocomplete logic
    DiagnosticsProvider.ts   # Error checking
    ThemeDefinition.ts       # Syntax highlighting colors
```

**Key Technologies:**
- Monaco Editor for core editing functionality
- Tree-sitter grammar for syntax parsing
- Custom completion provider for ontology-aware suggestions

**Configuration:**
```typescript
{
  language: 'owl-ms',
  theme: 'owl-ms-dark',
  options: {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    folding: true,
    bracketMatching: 'always',
    autoClosingBrackets: 'always',
    suggestOnTriggerCharacters: true
  }
}
```

#### 4.1.4 User Scenarios

**Scenario 1: Defining a Complex Class**
1. User opens axiom editor for "Pizza" class
2. User types "Pizza SubClassOf"
3. System suggests "Food", "EdibleEntity" from ontology
4. User selects "Food" and continues with "and (hasTopping some"
5. System suggests "Topping", "CheeseTopping", "MeatTopping"
6. User completes: "Pizza SubClassOf Food and (hasTopping some CheeseTopping)"
7. System validates syntax in real-time
8. User saves axiom

**Scenario 2: Correcting a Syntax Error**
1. User types "Pizza SubClassOf and (hasTopping some Cheese)"
2. System detects missing operand before "and"
3. Red squiggle appears under "and"
4. User hovers to see error message
5. System suggests "Add left operand"
6. User adds "Food" before "and"
7. Error clears automatically

### 4.2 Feature: Hierarchical Ontology Visualization

**Priority:** High  
**Dependencies:** React Flow, ELK.js

#### 4.2.1 Description

The visualization system renders ontology structures as interactive, hierarchical graphs. It employs automatic layout algorithms to arrange thousands of classes and relationships clearly. The system supports incremental loading for performance, allowing users to navigate large ontologies smoothly. Users can interact with nodes to explore relationships, edit entities, and understand ontology structure visually.

#### 4.2.2 Functional Requirements

- **FR-VS-001 to FR-VS-009** (detailed in Section 3.1.3)

#### 4.2.3 Implementation Details

**Component Structure:**
```
components/
  OntologyGraph/
    OntologyGraph.tsx        # Main graph component
    CustomNode.tsx           # Node rendering
    CustomEdge.tsx           # Edge rendering
    LayoutEngine.ts          # ELK integration
    IncrementalLoader.ts     # Viewport-based loading
    GraphControls.tsx        # Zoom, pan, fit controls
```

**Node Types:**
- ClassNode: Displays class name, icon, subclass count
- PropertyNode: Displays property name, domain, range
- IndividualNode: Displays individual name, types

**Edge Types:**
- SubClassOfEdge: Solid arrow, hierarchical
- ObjectPropertyEdge: Dashed arrow with label
- DataPropertyEdge: Dotted arrow with label
- EquivalentClassEdge: Double-headed arrow

**Layout Configuration:**
```typescript
{
  'elk.algorithm': 'layered',
  'elk.direction': 'DOWN',
  'elk.spacing.nodeNode': '80',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP'
}
```

#### 4.2.4 User Scenarios

**Scenario 1: Exploring a Large Ontology**
1. User imports ontology with 2,000 classes
2. System loads root nodes (owl:Thing and direct children)
3. User double-clicks "Animal" node
4. System loads and displays Animal subclasses
5. User pans to "Mammal" subhierarchy
6. System loads Mammal children as they enter viewport
7. User zooms out to see overall structure
8. System adjusts label sizes for readability

**Scenario 2: Finding a Specific Class**
1. User opens search (Ctrl+F)
2. User types "cardiac"
3. System highlights "CardiacMuscle" node
4. System expands parent hierarchy to show node
5. User clicks highlighted node
6. Properties panel displays class details

### 4.3 Feature: AI-Assisted Ontology Development

**Priority:** High  
**Dependencies:** Vercel AI SDK, OpenAI/Anthropic API

#### 4.3.1 Description

The AI co-pilot leverages Large Language Models to assist users in ontology development tasks. Users can generate ontology structures from natural language descriptions, receive property recommendations, and get suggestions for axiom formulation. The system presents AI-generated content for user review and approval, maintaining human oversight in the ontology development process.

#### 4.3.2 Functional Requirements

- **FR-AI-001 to FR-AI-007** (detailed in Section 3.1.5)

#### 4.3.3 Implementation Details

**Component Structure:**
```
components/
  AIAssistant/
    CommandPalette.tsx       # ⌘+K interface
    PromptTemplates.ts       # Prompt engineering
    ResponseParser.ts        # LLM output parsing
    SuggestionReview.tsx     # User approval UI
    APIKeyManager.tsx        # Secure key storage
```

**Prompt Templates:**

*Generate Class Hierarchy:*
```
You are an ontology engineering assistant. Generate a class hierarchy for {domain}.

Requirements:
- Provide 5-15 classes
- Include parent-child relationships
- Use clear, concise class names
- Follow OWL naming conventions (PascalCase)

Format your response as JSON:
{
  "classes": [
    {"name": "ClassName", "parent": "ParentClass", "description": "..."}
  ]
}
```

*Recommend Properties:*
```
Given the class "{className}" in a {domain} ontology, suggest appropriate:
1. Object properties (relationships to other entities)
2. Data properties (attributes with literal values)

For each property provide:
- Name (camelCase)
- Type (ObjectProperty or DataProperty)
- Domain and Range
- Description

Format as JSON array.
```

#### 4.3.4 User Scenarios

**Scenario 1: Generating a Smart Home Ontology**
1. User presses ⌘+K to open command palette
2. User types "Generate smart home ontology"
3. System sends prompt to LLM API
4. AI generates: Device, Sensor, Actuator, Room, Zone classes
5. System displays preview with class hierarchy diagram
6. User reviews suggestions
7. User clicks "Accept All"
8. System inserts classes and relationships into ontology
9. User refines generated structure as needed

**Scenario 2: Adding Properties to a Class**
1. User selects "Sensor" class in tree
2. User right-clicks and selects "AI: Suggest Properties"
3. System prompts AI for Sensor properties
4. AI suggests: hasLocation (ObjectProperty), hasValue (DataProperty), isActive (DataProperty)
5. System displays suggestions with domain/range
6. User selects hasLocation and hasValue
7. System adds properties to ontology

### 4.4 Feature: Integrated Reasoning Engine

**Priority:** High  
**Dependencies:** EYE-JS (WASM), Optional backend service

#### 4.4.1 Description

The reasoning engine performs logical inference over ontology axioms to derive new knowledge, check consistency, and classify entities. It offers both client-side reasoning via WebAssembly for immediate feedback and server-side reasoning for computationally intensive operations. The reasoner integrates with the visualization and editor to highlight inferred relationships and detect logical errors.

#### 4.4.2 Functional Requirements

- **FR-RE-001 to FR-RE-007** (detailed in Section 3.1.4)

#### 4.4.3 Implementation Details

**Component Structure:**
```
services/
  reasoning/
    ReasonerService.ts       # Facade for reasoning operations
    ClientReasoner.ts        # EYE-JS WASM wrapper
    ServerReasoner.ts        # External service client
    ResultsProcessor.ts      # Inference results handling
    ExplanationGenerator.ts  # Inference explanations
```

**Reasoning Pipeline:**
1. Serialize ontology to Turtle format
2. Send to reasoner (client or server)
3. Receive inferred axioms
4. Parse and validate results
5. Merge with asserted axioms
6. Update visualization (dashed lines for inferred edges)
7. Generate explanations on demand

**Client-Side Configuration:**
```typescript
{
  reasoner: 'eye-js',
  maxDuration: 5000, // 5 seconds
  inferenceTypes: ['subClassOf', 'type', 'equivalentClass'],
  onProgress: (percent) => updateProgressBar(percent)
}
```

**Server-Side API Contract:**
```json
Request:
POST /api/reason
{
  "operation": "classify",
  "format": "turtle",
  "ontology": "base64-encoded-ontology",
  "options": { "timeout": 30 }
}

Response:
{
  "status": "success",
  "inferences": [
    {
      "type": "subClassOf",
      "subject": "VegetarianPizza",
      "object": "Pizza",
      "confidence": 1.0
    }
  ],
  "duration": 1250,
  "consistent": true
}
```

#### 4.4.4 User Scenarios

**Scenario 1: Checking Ontology Consistency**
1. User completes ontology edits
2. User clicks "Check Consistency" button
3. System serializes ontology
4. System invokes client-side reasoner (EYE-JS)
5. Reasoner detects contradiction (e.g., VegetarianPizza disjoint with Pizza, but VegetarianPizza subClassOf Pizza)
6. System displays error: "Inconsistency detected: VegetarianPizza"
7. User clicks "Explain"
8. System shows axiom chain leading to contradiction
9. User corrects axiom

**Scenario 2: Discovering Inferred Relationships**
1. User defines:
   - "Mammal SubClassOf Animal"
   - "Dog SubClassOf Mammal"
2. User runs classification
3. Reasoner infers: "Dog SubClassOf Animal"
4. System adds dashed line from Dog to Animal in graph
5. User hovers over dashed line
6. Tooltip shows: "Inferred via Mammal"

---

## 5. Appendices

### Appendix A: Glossary

**Axiom:** A logical statement in an ontology that is assumed to be true. Examples include class definitions, property assertions, and constraints.

**Class:** A set or category of individuals that share common characteristics. In OWL, classes are first-class citizens and can be organized into hierarchies.

**Classification:** The reasoning process of computing the complete class hierarchy by inferring subClassOf relationships.

**Consistency:** An ontology is consistent if it does not contain logical contradictions. An inconsistent ontology implies false conclusions.

**Datatype Property:** A property that relates individuals to literal values (e.g., hasAge, hasName).

**ELK (Eclipse Layout Kernel):** A graph layout library that provides algorithms for arranging nodes and edges in readable hierarchical structures.

**Individual:** A specific instance of a class. For example, "Fido" might be an individual of the "Dog" class.

**Inference:** The process of deriving new facts from existing axioms using logical rules.

**IRI (Internationalized Resource Identifier):** A unique identifier for ontology entities that extends URIs to support international characters.

**LSP (Language Server Protocol):** A protocol for providing language features like autocomplete and error checking in code editors.

**Manchester Syntax:** A human-readable syntax for writing OWL expressions, designed to be more intuitive than RDF/XML.

**Monaco Editor:** The code editor that powers Visual Studio Code, available as a standalone library.

**N3.js:** A JavaScript library for parsing and writing RDF data in various formats.

**Object Property:** A property that relates two individuals (e.g., hasParent, locatedIn).

**Ontology:** A formal, explicit specification of a shared conceptualization, represented as classes, properties, individuals, and axioms.

**OWL (Web Ontology Language):** A W3C standard for representing rich and complex knowledge about things and their relationships.

**React Flow (XyFlow):** A React library for building node-based interfaces like flowcharts, diagrams, and graphs.

**Reasoner:** A software system that performs logical inference over ontology axioms.

**RDF (Resource Description Framework):** A standard model for data interchange on the web, based on triples (subject-predicate-object).

**Serialization:** The process of converting an in-memory ontology representation to a file format like Turtle or RDF/XML.

**SubClassOf:** A relationship indicating that one class is a specialization of another (e.g., Dog SubClassOf Mammal).

**Tree-sitter:** An incremental parsing system that generates concrete syntax trees for efficient syntax highlighting and code analysis.

**Turtle:** A human-readable RDF serialization format (Terse RDF Triple Language).

**WebAssembly (WASM):** A binary instruction format for a stack-based virtual machine, enabling near-native performance in web browsers.

**Zustand:** A small, fast state management library for React applications.

### Appendix B: Technology Stack Summary

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

### Appendix C: Manchester Syntax Quick Reference

**Class Expressions:**
```
ClassName                    # Atomic class
Thing, Nothing              # Top and bottom classes
C and D                     # Intersection
C or D                      # Union
not C                       # Complement
```

**Property Restrictions:**
```
P some C                    # Existential (∃P.C)
P only C                    # Universal (∀P.C)
P value Individual          # Value restriction
P Self                      # Self restriction
P min n C                   # Minimum cardinality
P max n C                   # Maximum cardinality
P exactly n C               # Exact cardinality
```

**Axiom Patterns:**
```
Class: C
  SubClassOf: D
  EquivalentTo: E
  DisjointWith: F
  
ObjectProperty: P
  Domain: C
  Range: D
  SubPropertyOf: Q
  Characteristics: Functional, Transitive
  
Individual: i
  Types: C, D
  Facts: P value j, Q value "literal"
```

### Appendix D: Sample Use Cases

**Use Case 1: Building a Medical Ontology**

**Actor:** Medical Informatics Researcher

**Goal:** Create an ontology representing cardiovascular diseases and treatments

**Steps:**
1. User creates new ontology "Cardio-Ontology"
2. User uses AI assistant to generate disease hierarchy
3. AI creates: CardiovascularDisease, HeartDisease, VascularDisease, ArterialDisease
4. User defines properties: hasCause, hasTreatment, affectsSiteInBodyStructure
5. User adds individuals: Aspirin, HeartAttack, Coronary Artery
6. User defines axioms: "HeartAttack SubClassOf CardiovascularDisease and (affectsSiteInBodyStructure some CoronaryArtery)"
7. User runs reasoner to classify diseases
8. User exports ontology to Turtle format for publication

**Use Case 2: Extending an Existing Ontology**

**Actor:** Graduate Student

**Goal:** Add new classes to the Pizza ontology

**Steps:**
1. User imports pizza.owl file
2. System displays class hierarchy with Pizza, Topping, Base
3. User selects "Pizza" in tree
4. User right-clicks and selects "Add Subclass"
5. User names new class "DessertPizza"
6. User opens axiom editor for DessertPizza
7. User defines: "DessertPizza SubClassOf Pizza and (hasTopping only SweetTopping)"
8. User creates SweetTopping as subclass of Topping
9. User runs consistency check
10. Reasoner confirms ontology is consistent
11. User saves modified ontology

**Use Case 3: Debugging an Inconsistent Ontology**

**Actor:** Ontology Engineer

**Goal:** Identify and fix logical errors

**Steps:**
1. User imports ontology with 500 classes
2. User runs consistency check
3. Reasoner reports: "Inconsistency: VegetarianPizza is unsatisfiable"
4. User clicks "Explain"
5. System shows inference chain:
   - VegetarianPizza SubClassOf Pizza
   - VegetarianPizza SubClassOf (hasTopping only VegetarianTopping)
   - VegetarianPizza SubClassOf (hasTopping some Topping)
   - MeatTopping SubClassOf Topping
   - MeatTopping DisjointWith VegetarianTopping
6. User identifies error: Mozzarella incorrectly classified as MeatTopping
7. User navigates to Mozzarella class
8. User changes: "Mozzarella SubClassOf CheeseTopping" (instead of MeatTopping)
9. User re-runs consistency check
10. Reasoner confirms ontology is now consistent

### Appendix E: Future Enhancements (Out of Scope for v1.0)

**Collaborative Editing:**
- Real-time multi-user editing
- Conflict resolution for concurrent edits
- User presence indicators
- Comment threads on entities

**Version Control:**
- Git-like version history for ontologies
- Branch and merge support
- Diff visualization for ontology changes
- Rollback to previous versions

**Advanced Visualization:**
- 3D graph visualization
- Force-directed layout option
- Heatmap overlay for entity usage
- Animation of reasoning steps

**Import/Export:**
- Support for SPARQL endpoints
- Import from databases and APIs
- Export to visualizations (Graphviz, Mermaid)
- Integration with ontology repositories (BioPortal, OntoHub)

**Enhanced AI Features:**
- Ontology alignment and merging
- Automated refactoring suggestions
- Pattern mining from large ontologies
- Natural language querying over ontology

**Mobile Support:**
- Native mobile applications (iOS, Android)
- Touch-optimized interfaces
- Offline editing capabilities

**Enterprise Features:**
- User authentication and authorization
- Team workspaces
- Audit logs
- API for programmatic access

### Appendix F: Acceptance Criteria

**For MVP (Minimum Viable Product) Release:**

1. ✓ User can create a new ontology with at least 50 classes
2. ✓ User can import and export Turtle format without data loss
3. ✓ Axiom editor provides autocomplete with < 100ms latency
4. ✓ Graph visualization renders 1,000 classes at ≥ 30 FPS
5. ✓ Client-side reasoner completes consistency check in < 5 seconds for 500 classes
6. ✓ AI assistant generates valid class hierarchy from natural language
7. ✓ System recovers from crash with unsaved edits intact
8. ✓ All functional requirements marked "High Priority" are implemented
9. ✓ Code coverage ≥ 80% with passing tests
10. ✓ Documentation complete for all public APIs

**For Full Release (v1.0):**

1. All MVP criteria met
2. All functional requirements implemented
3. Non-functional requirements validated through testing
4. User acceptance testing completed with ≥ 90% satisfaction
5. Performance benchmarks met on reference hardware
6. Security audit passed
7. Browser compatibility verified
8. Accessibility audit passed (WCAG 2.1 Level AA)
9. User documentation complete
10. Deployment pipeline operational

### Appendix G: Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Browser API unavailability | Low | High | Provide fallback mechanisms, clear error messages |
| LLM API rate limiting | Medium | Medium | Implement request queuing, user API key support |
| Performance issues with large ontologies | Medium | High | Incremental loading, server-side reasoning fallback |
| Tree-sitter grammar limitations | Low | Medium | Maintain custom grammar, contribute upstream |
| WebAssembly reasoner incompleteness | Medium | Medium | Hybrid client/server approach |
| Dependency vulnerabilities | Medium | Medium | Automated dependency scanning, regular updates |
| Browser memory limitations | High | High | Aggressive memory management, ontology chunking |
| User learning curve | Medium | Medium | Interactive tutorials, comprehensive documentation |

### Appendix H: References and Resources

**Standards:**
- W3C OWL 2 Web Ontology Language: https://www.w3.org/TR/owl2-overview/
- W3C RDF 1.1: https://www.w3.org/TR/rdf11-concepts/
- Manchester OWL Syntax: https://www.w3.org/TR/owl2-manchester-syntax/

**Research Papers:**
- Adorjan, A. (2023). Towards a Researcher-in-the-loop Driven Curation Approach for Quantitative and Qualitative Research Methods
- Johnson, R. B., & Onwuegbuzie, A. J. (2004). Mixed Methods Research: A Research Paradigm Whose Time Has Come
- Creswell, J. W., & Plano Clark, V. L. (2017). Designing and Conducting Mixed Methods Research

**External Tools Referenced:**
- Protege Desktop: https://protege.stanford.edu/
- Elicit: https://elicit.com/
- Research Rabbit: https://app.researchrabbit.ai/
- Paperpal: https://paperpal.com/
- Scite AI: https://scite.ai/
- Consensus App: https://consensus.app/

**Technical Documentation:**
- React: https://react.dev/
- TypeScript: https://www.typescriptlang.org/
- Monaco Editor: https://microsoft.github.io/monaco-editor/
- React Flow: https://reactflow.dev/
- ELK.js: https://eclipse.dev/elk/
- N3.js: https://github.com/rdfjs/N3.js
- Zustand: https://github.com/pmndrs/zustand

---

**Document Approval:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | [Name] | __________ | ________ |
| Lead Developer | [Name] | __________ | ________ |
| QA Manager | [Name] | __________ | ________ |
| Project Manager | [Name] | __________ | ________ |

---

**Revision History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-29 | [Author] | Initial release |

---

*End of Software Requirements Specification*
