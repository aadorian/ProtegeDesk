# Detailed Use Cases and User Stories
## Modern TypeScript-Based Ontology Editor

**Document Version:** 1.0  
**Date:** December 29, 2025  
**Status:** Final

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Actors and Roles](#2-actors-and-roles)
3. [Detailed Use Cases](#3-detailed-use-cases)
4. [User Stories](#4-user-stories)
5. [User Journey Maps](#5-user-journey-maps)
6. [Acceptance Criteria](#6-acceptance-criteria)

---

## 1. Introduction

### 1.1 Purpose

This document provides detailed use cases and user stories for the Modern Ontology Editor (MOE). It describes how different types of users interact with the system to accomplish their goals, along with the specific requirements from the user's perspective.

### 1.2 Document Conventions

**Use Case Format:**
- **Use Case ID**: Unique identifier (UC-XXX)
- **Use Case Name**: Descriptive title
- **Actor(s)**: Primary and secondary actors
- **Preconditions**: System state before use case begins
- **Postconditions**: System state after successful completion
- **Main Flow**: Step-by-step normal execution path
- **Alternative Flows**: Valid variations from main flow
- **Exception Flows**: Error conditions and handling
- **Business Rules**: Constraints and validations
- **Non-functional Requirements**: Performance, usability requirements

**User Story Format:**
```
As a [role]
I want [feature/capability]
So that [benefit/value]

Acceptance Criteria:
- Given [context]
- When [action]
- Then [outcome]
```

### 1.3 Scope

This document covers:
- 25+ detailed use cases across all major system features
- 60+ user stories organized by epic
- User journey maps for key workflows
- Acceptance criteria for each user story
- Story point estimates and prioritization

---

## 2. Actors and Roles

### 2.1 Primary Actors

**Ontology Engineer (OE)**
- **Description**: Professional developer of ontologies with advanced knowledge of OWL, logic, and knowledge representation
- **Goals**: Create complex, well-structured ontologies; ensure logical consistency; optimize ontology performance
- **Technical Proficiency**: Expert
- **Frequency of Use**: Daily
- **Representative Persona**: Dr. Sarah Chen, Senior Ontology Engineer at a healthcare organization, 8 years experience

**Researcher (R)**
- **Description**: Academic or industry researcher using ontologies for their research projects
- **Goals**: Model domain knowledge; support research publications; enable data integration
- **Technical Proficiency**: Intermediate
- **Frequency of Use**: Regular (2-3 times per week)
- **Representative Persona**: Prof. James Miller, Computer Science researcher studying semantic web, needs ontologies for papers

**Graduate Student (GS)**
- **Description**: Master's or PhD student learning ontology engineering
- **Goals**: Complete assignments; understand ontology concepts; build thesis-related ontologies
- **Technical Proficiency**: Novice to Intermediate
- **Frequency of Use**: Learning phase (daily) then project-based
- **Representative Persona**: Maria Rodriguez, PhD candidate in bioinformatics, first exposure to ontologies

**Knowledge Engineer (KE)**
- **Description**: Professional capturing domain knowledge in structured formats
- **Goals**: Translate expert knowledge into formal ontologies; maintain knowledge bases
- **Technical Proficiency**: Intermediate
- **Frequency of Use**: Daily
- **Representative Persona**: David Thompson, Knowledge Engineer at a manufacturing company, works with domain experts

### 2.2 Secondary Actors

**Domain Expert (DE)**
- **Description**: Subject matter expert providing knowledge for ontology development
- **Goals**: Ensure accurate domain representation; validate ontology content
- **Technical Proficiency**: Low (ontology tools)
- **Interaction**: Indirect (through Knowledge Engineer)

**System Administrator (SA)**
- **Description**: Manages backend services and infrastructure
- **Goals**: Ensure system availability; monitor performance; manage API keys
- **Technical Proficiency**: Expert (systems)
- **Frequency of Use**: As needed for maintenance

**AI Service (AI)**
- **Description**: External LLM services (OpenAI, Anthropic)
- **Goals**: Provide intelligent suggestions and generation
- **Type**: External system actor

**Reasoning Service (RS)**
- **Description**: External or internal reasoning engines
- **Goals**: Perform logical inference and consistency checking
- **Type**: System actor

---

## 3. Detailed Use Cases

### 3.1 Ontology Creation and Management

---

#### UC-001: Create New Ontology from Scratch

**Priority**: High  
**Complexity**: Low  
**Actor(s)**: Ontology Engineer, Researcher, Graduate Student

**Preconditions**:
- User has launched the application
- No ontology is currently loaded

**Postconditions**:
- New empty ontology is created and active
- Ontology has unique IRI and metadata
- User can begin adding classes and properties
- Ontology is saved to browser state

**Main Flow**:
1. User clicks "New Ontology" button in toolbar
2. System displays "Create New Ontology" dialog
3. User enters:
   - Ontology name: "SmartHomeOntology"
   - Base IRI: "http://example.org/smarthome#"
   - Version: "1.0.0"
   - Description: "Ontology for smart home devices and automation"
   - Author: "John Doe"
4. User clicks "Create"
5. System validates inputs (checks IRI format, required fields)
6. System initializes ontology structure with:
   - Default imports (owl:Thing, rdfs:Resource)
   - Metadata annotations
   - Empty class, property, and individual sets
7. System displays empty ontology in editor:
   - Class tree shows only owl:Thing
   - Graph view shows empty canvas
   - Properties panel shows ontology metadata
8. System saves initial state to IndexedDB
9. System displays success notification: "SmartHomeOntology created"

**Alternative Flows**:

**AF-001A: Use Template**
- At step 2, user selects "Use Template" option
- System displays template gallery (Basic, Pizza, FOAF, Dublin Core)
- User selects "Basic IoT Template"
- System pre-populates with common IoT classes (Device, Sensor, Actuator)
- Continue to step 5

**AF-001B: Import Settings from File**
- At step 3, user clicks "Import Metadata"
- System opens file picker
- User selects metadata.json file
- System populates fields from file
- Continue to step 4

**AF-001C: Skip Optional Fields**
- At step 3, user fills only required fields (name, IRI)
- User clicks "Create"
- System creates ontology with minimal metadata
- User can add metadata later via properties panel

**Exception Flows**:

**EF-001A: Invalid IRI Format**
- At step 5, system detects invalid IRI (missing protocol, invalid characters)
- System displays error: "Invalid IRI format. Expected: http(s)://domain/path#"
- System highlights IRI field in red
- System provides correction suggestions
- User corrects IRI
- Return to step 4

**EF-001B: Duplicate Name**
- At step 5, system detects ontology with same name exists in browser storage
- System displays warning: "An ontology with this name already exists"
- System offers options:
  - "Rename" (return to step 3)
  - "Replace" (delete existing, continue)
  - "Open Existing" (load existing ontology)
- User selects option

**EF-001C: Network Unavailable (for AI suggestions)**
- At step 2, system attempts to load AI-suggested metadata
- Network request fails
- System displays offline indicator
- System continues with manual entry (no AI assistance)
- User completes creation manually

**Business Rules**:
- BR-001: IRI must be valid URI format (RFC 3986)
- BR-002: Ontology name must be unique within user's workspace
- BR-003: Base IRI should end with # or / for proper fragment handling
- BR-004: Version string must follow semantic versioning (major.minor.patch)

**Non-functional Requirements**:
- Dialog must appear within 100ms of button click
- Validation must complete within 50ms
- Ontology initialization must complete within 200ms
- All user inputs must be sanitized to prevent XSS

---

#### UC-002: Import Existing Ontology

**Priority**: High  
**Complexity**: Medium  
**Actor(s)**: All Users

**Preconditions**:
- User has ontology file in supported format (TTL, RDF/XML, OWL/XML)
- Browser supports File System Access API

**Postconditions**:
- Ontology is loaded and parsed
- All classes, properties, and individuals are available
- Ontology is displayed in all views (tree, graph, editor)
- Original file format is preserved for export

**Main Flow**:
1. User clicks "Import" button in toolbar
2. System displays import dialog with options:
   - "From File" (default)
   - "From URL"
   - "From Text"
3. User selects "From File"
4. System opens native file picker
5. User navigates to and selects "pizza.owl" file
6. System reads file contents (350KB, 1,200 axioms)
7. System displays parsing progress indicator
8. System detects format as OWL/XML
9. System parses file using N3.js parser:
   - Extracts metadata (IRI, version, imports)
   - Parses classes (145 classes)
   - Parses properties (58 object properties, 12 data properties)
   - Parses individuals (8 individuals)
   - Parses axioms (class axioms, property axioms, assertions)
10. System validates ontology structure:
    - Checks for circular imports
    - Validates IRI references
    - Checks for malformed axioms
11. System loads ontology into application state:
    - Populates class tree with hierarchy
    - Prepares graph visualization data
    - Indexes entities for search
12. System displays ontology:
    - Class tree shows "Pizza" at root with children
    - Graph view shows top-level classes
    - Status bar shows: "Loaded pizza.owl (145 classes, 70 properties)"
13. System saves to IndexedDB cache
14. System adds to recent files list

**Alternative Flows**:

**AF-002A: Import from URL**
- At step 3, user selects "From URL"
- System displays URL input field
- User enters "http://www.co-ode.org/ontologies/pizza/pizza.owl"
- System fetches file via CORS-enabled proxy
- System validates response (checks content-type, size)
- Continue to step 7

**AF-002B: Import from Text**
- At step 3, user selects "From Text"
- System displays large text area
- User pastes Turtle-formatted ontology
- System displays format selector (auto-detect enabled)
- User clicks "Import"
- Continue to step 8

**AF-002C: Large File (>5MB)**
- At step 7, system detects file size exceeds 5MB
- System displays warning: "Large ontology detected (12MB). This may take several minutes."
- System offers options:
  - "Continue" (show progress bar with cancel option)
  - "Load Subset" (show class filter dialog)
  - "Cancel"
- User selects "Continue"
- System parses in chunks with progress updates
- Continue to step 9

**AF-002D: Auto-detect Format**
- At step 8, system attempts format detection
- System examines file extension and content
- If TTL: looks for "@prefix" or triple patterns
- If RDF/XML: looks for XML declaration and rdf:RDF
- If OWL/XML: looks for owl:Ontology element
- System displays detected format with override option
- User confirms or changes format
- Continue to step 9

**Exception Flows**:

**EF-002A: Parse Error**
- At step 9, parser encounters syntax error at line 342
- System displays error dialog:
  - "Parse error at line 342: Unexpected token ')'"
  - Shows 5 lines of context around error
  - Offers "View Full Log" button
- System offers options:
  - "Try Alternative Parser" (use different parsing mode)
  - "Skip Errors" (load valid portions)
  - "Cancel"
- If "Skip Errors": System loads 95% of axioms, displays warning
- User reviews what was skipped in error log

**EF-002B: Unsupported Format**
- At step 8, system detects unsupported format (e.g., N-Quads)
- System displays error: "Unsupported format. Supported: Turtle, RDF/XML, OWL/XML, N-Triples"
- System offers "Convert with External Tool" (opens documentation)
- User must convert file and retry

**EF-002C: Missing Dependencies**
- At step 10, system detects imported ontology not available
- System displays warning: "Missing import: http://www.w3.org/2004/02/skos/core"
- System offers options:
  - "Download Automatically" (if URL accessible)
  - "Provide Manually" (file picker for import)
  - "Ignore" (continue without import)
- User selects option
- System resolves dependency

**EF-002D: Memory Limit Exceeded**
- At step 11, browser memory exceeds 2GB threshold
- System displays error: "Ontology too large for available memory"
- System offers options:
  - "Load in Server Mode" (requires backend setup)
  - "Select Classes to Load" (filter dialog)
  - "Close Other Tabs" (free memory)
- User must take corrective action

**EF-002E: Corrupted File**
- At step 7, system detects file corruption (checksum mismatch, unexpected EOF)
- System displays error: "File appears corrupted or incomplete"
- System attempts recovery:
  - Checks for backup segments
  - Attempts partial parse
- If recovery fails: User must provide valid file

**Business Rules**:
- BR-005: Maximum file size for client-side parsing: 50MB
- BR-006: Parser timeout: 60 seconds (then offer server-side parsing)
- BR-007: Minimum required ontology elements: valid IRI and at least one class
- BR-008: Imports are resolved recursively up to 5 levels deep

**Non-functional Requirements**:
- File picker must open within 200ms
- Parsing rate must exceed 1,000 axioms/second
- Progress indicator must update at least every 500ms
- Memory usage must not exceed 2GB for files under 10MB
- Error messages must include line numbers and context

**Success Metrics**:
- 95% of standard ontology files parse successfully
- Users can import their ontology within 30 seconds
- Less than 5% of imports require error correction

---

#### UC-003: Export Ontology to File

**Priority**: High  
**Complexity**: Low  
**Actor(s)**: All Users

**Preconditions**:
- Ontology is loaded and contains at least one entity
- User has file system write permissions

**Postconditions**:
- Ontology is serialized to selected format
- File is saved to user-specified location
- Original ontology in editor remains unchanged
- Export settings are saved for future exports

**Main Flow**:
1. User clicks "Export" button in toolbar (or Ctrl+E)
2. System displays "Export Ontology" dialog showing:
   - Current ontology name: "SmartHomeOntology"
   - Format selector (dropdown): Turtle (default), RDF/XML, OWL/XML, N-Triples, JSON-LD
   - Options panel (collapsible)
   - Preview button
   - Export button
3. User selects "Turtle" format
4. User expands options panel and configures:
   - Include inferred axioms: No
   - Pretty print: Yes
   - Comment style: Line comments
   - Base IRI: Use ontology IRI
5. User clicks "Preview" (optional)
6. System generates preview (first 100 lines):
```turtle
@prefix : <http://example.org/smarthome#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

:SmartHomeOntology rdf:type owl:Ontology ;
    owl:versionInfo "1.0.0" ;
    rdfs:comment "Ontology for smart home devices" .

:Device rdf:type owl:Class ;
    rdfs:subClassOf owl:Thing .
```
7. User reviews preview, clicks "Export"
8. System opens native file save dialog
9. User selects location: ~/Documents/ontologies/
10. User enters filename: "smarthome_v1.ttl"
11. System serializes ontology:
    - Converts internal representation to Turtle
    - Applies formatting rules (indentation, alignment)
    - Adds header comments with metadata
    - Validates output syntax
12. System writes file (45KB)
13. System displays success notification: "Exported to smarthome_v1.ttl"
14. System adds to recent exports list

**Alternative Flows**:

**AF-003A: Quick Export (Same Format)**
- At step 1, user presses Ctrl+Shift+E (quick export shortcut)
- System skips dialog, uses last export settings
- System opens save dialog immediately
- Continue to step 9

**AF-003B: Export to Clipboard**
- At step 2, user clicks "Copy to Clipboard" instead of "Export"
- System serializes ontology to selected format
- System copies result to clipboard
- System displays notification: "Ontology copied to clipboard"
- User can paste into email, document, etc.

**AF-003C: Export Subset**
- At step 4, user enables "Export Selected Only"
- System shows entity selector (checkboxes for classes, properties)
- User selects specific classes to export (e.g., only "Device" hierarchy)
- System filters ontology to selected entities and dependencies
- Continue to step 7

**AF-003D: Include Inferred Axioms**
- At step 4, user enables "Include inferred axioms"
- System checks if reasoning has been performed
- If yes: System includes inferred subClassOf, equivalentClass, etc.
- If no: System offers "Run Reasoner First" button
- System marks inferred axioms with comments
- Continue to step 7

**AF-003E: Batch Export (Multiple Formats)**
- At step 2, user enables "Batch export"
- User selects multiple formats: [Turtle, RDF/XML, OWL/XML]
- System shows format-specific options for each
- User clicks "Export All"
- System opens directory picker (not file picker)
- System generates and saves all files with appropriate extensions
- System displays summary: "Exported 3 files to ~/Documents/ontologies/"

**Exception Flows**:

**EF-003A: Serialization Error**
- At step 11, serializer encounters invalid construct
- System displays error: "Cannot serialize axiom: Pizza and (hasTopping some (not Topping))"
- System offers options:
  - "Skip Invalid Axioms" (export valid portions)
  - "Show Problem" (navigate to problematic axiom in editor)
  - "Cancel Export"
- User selects option

**EF-003B: File Write Failure**
- At step 12, file write operation fails (disk full, permission denied)
- System displays error with system message
- System offers options:
  - "Retry"
  - "Choose Different Location"
  - "Save to Browser Storage" (temporary)
- User takes corrective action

**EF-003C: Large Export Warning**
- At step 11, system detects export will exceed 100MB
- System displays warning: "Large export (250MB). This may take several minutes and affect browser performance."
- System recommends: "Consider exporting subset or using server-side export"
- System offers options:
  - "Continue Anyway"
  - "Export Subset"
  - "Cancel"
- User decides

**EF-003D: Unsupported Constructs**
- At step 11, system detects OWL constructs not supported in target format
- Example: JSON-LD export with complex property chains
- System displays warning: "Some advanced OWL features may not be fully represented in JSON-LD"
- System lists affected axioms
- User chooses different format or accepts limitation

**Business Rules**:
- BR-009: Default export format is Turtle (most human-readable)
- BR-010: Inferred axioms must be clearly marked if included
- BR-011: Exported files must round-trip (import back) without loss
- BR-012: File extension must match format (.ttl, .rdf, .owl, .nt, .jsonld)

**Non-functional Requirements**:
- Serialization must process ≥ 5,000 axioms/second
- Preview generation must complete within 500ms
- File save dialog must open within 200ms
- Export progress must be visible for operations > 2 seconds

---

### 3.2 Axiom Editing and Class Management

---

#### UC-004: Define Complex Class Axiom with Manchester Syntax

**Priority**: High  
**Complexity**: High  
**Actor(s)**: Ontology Engineer, Researcher

**Preconditions**:
- Ontology is loaded
- Class "VegetarianPizza" exists
- Properties "hasTopping", "hasBase" are defined
- Classes "Pizza", "VegetarianTopping", "MeatTopping" exist

**Postconditions**:
- Complex class axiom is defined and validated
- Axiom is added to ontology
- Reasoner can classify using new axiom
- Axiom is visible in graph view

**Main Flow**:
1. User selects "VegetarianPizza" class in tree
2. User clicks "Edit Axioms" button in properties panel
3. System opens axiom editor with existing axioms:
```
VegetarianPizza SubClassOf Pizza
```
4. User clicks "Add Axiom" button
5. System adds empty axiom template:
```
VegetarianPizza SubClassOf 
```
6. User positions cursor after "SubClassOf"
7. User types "P" (begins typing "Pizza")
8. System displays autocomplete dropdown after 200ms:
   - Pizza (Class)
   - PizzaBase (Class)
   - PizzaTopping (Class)
   - hasPrice (DataProperty)
9. User selects "Pizza" with Enter key or click
10. System inserts "Pizza" and positions cursor after it
11. User types " and ("
12. System auto-completes closing parenthesis: " and ()"
13. User types "hasTopping"
14. System autocompletes with suggestions:
    - hasTopping (ObjectProperty) ⭐ [most relevant]
    - hasToppingCount (DataProperty)
15. User selects "hasTopping"
16. User types " only "
17. System highlights "only" keyword in blue
18. User types "("
19. System auto-completes: "()"
20. User types "not MeatTopping"
21. System autocompletes "MeatTopping" class
22. System highlights syntax:
    - Keywords: blue (SubClassOf, and, only, not)
    - Classes: orange (VegetarianPizza, Pizza, MeatTopping)
    - Properties: green (hasTopping)
23. User has completed axiom:
```
VegetarianPizza SubClassOf Pizza and (hasTopping only (not MeatTopping))
```
24. System validates syntax in real-time:
    - Parses with Tree-sitter
    - Checks entity references exist
    - Validates logical structure
25. System shows green checkmark (valid axiom)
26. User clicks "Save" or presses Ctrl+S
27. System adds axiom to ontology
28. System updates class tree (no visual change needed)
29. System updates graph view (adds edge properties if visible)
30. System marks ontology as modified (unsaved changes indicator)
31. System auto-saves to IndexedDB

**Alternative Flows**:

**AF-004A: Use Axiom Templates**
- At step 4, user clicks "Templates" dropdown instead of typing
- System displays common patterns:
  - "Necessary Condition: C SubClassOf D"
  - "Sufficient Condition: C EquivalentTo D"
  - "Restriction: P some C"
  - "Cardinality: P exactly n C"
  - "Disjointness: C DisjointWith D"
- User selects "Restriction: P some C"
- System inserts template with placeholders:
  `VegetarianPizza SubClassOf hasTopping some <Class>`
- User replaces <Class> with specific value
- Continue to step 21

**AF-004B: Copy Existing Axiom**
- At step 5, user right-clicks existing axiom
- User selects "Duplicate and Modify"
- System copies axiom and opens for editing
- User modifies copied axiom
- Continue to step 26

**AF-004C: Multi-line Axiom Formatting**
- After step 20, user presses Enter for readability
- System intelligently indents:
```
VegetarianPizza SubClassOf 
    Pizza and 
    (hasTopping only (not MeatTopping))
```
- Syntax highlighting maintains across lines
- Continue to step 24

**AF-004D: Keyboard Navigation Only**
- User navigates entirely with keyboard:
  - Tab: Move to next field
  - Ctrl+Space: Trigger autocomplete
  - Arrows: Navigate suggestions
  - Enter: Accept suggestion
  - Escape: Close autocomplete
- User completes axiom without mouse
- Continue to step 26

**Exception Flows**:

**EF-004A: Syntax Error**
- At step 21, user types invalid syntax: "hasTopping only not MeatTopping" (missing parentheses)
- System detects error immediately
- Red squiggle appears under "not"
- System displays error tooltip: "Expected '(' after 'only'"
- System suggests fix: "Add parentheses: only (not MeatTopping)"
- User can:
  - Click "Quick Fix" (system inserts parentheses)
  - Manually correct
- Error clears when corrected

**EF-004B: Undefined Entity Reference**
- At step 21, user types "MozzarellaTopping"
- System searches ontology, class not found
- Yellow warning underline appears
- System displays warning: "Class 'MozzarellaTopping' is not defined"
- System offers options:
  - "Create Class" (quick class creation dialog)
  - "Did you mean: MeatTopping?" (suggestions)
  - "Ignore" (continue anyway, treated as external reference)
- User selects "Create Class"
- System creates MozzarellaTopping as subclass of Topping
- Warning clears

**EF-004C: Circular Reference**
- User attempts to create: "Pizza SubClassOf VegetarianPizza"
- Combined with existing "VegetarianPizza SubClassOf Pizza"
- System runs live validation
- System detects circularity: Pizza ⊑ VegetarianPizza ⊑ Pizza
- Red error indicator appears
- System displays: "Circular class hierarchy detected"
- System highlights both problematic axioms
- User must resolve by removing one axiom

**EF-004D: Contradictory Axiom**
- User defines: "VegetarianPizza SubClassOf (hasTopping some MeatTopping)"
- This contradicts existing axiom (hasTopping only (not MeatTopping))
- System detects logical contradiction
- Orange warning appears (not blocking, but concerning)
- System displays: "Potential contradiction with line 3"
- User can:
  - "Run Consistency Check" (full reasoning)
  - "Explain" (show conflicting axioms)
  - "Continue Anyway" (for debugging scenarios)
- User investigates and corrects

**EF-004E: Performance Degradation**
- User is editing very long axiom (500+ characters)
- Autocomplete query takes > 200ms
- System displays "Loading..." indicator
- If > 1 second: System displays "Large ontology may cause delays"
- System suggests: "Consider indexing optimization in settings"
- User can continue working, autocomplete arrives when ready

**Business Rules**:
- BR-013: All entity references must exist in ontology or imports
- BR-014: Axioms must be syntactically valid OWL Manchester Syntax
- BR-015: Circular hierarchies are prohibited
- BR-016: Auto-save occurs 5 seconds after last keystroke

**Non-functional Requirements**:
- Autocomplete must appear within 200ms of trigger
- Syntax highlighting must update within 50ms
- Live validation must complete within 500ms
- Editor must handle axioms up to 1,000 characters smoothly

**Success Metrics**:
- 90% of users successfully define complex axioms within 5 minutes
- Autocomplete acceptance rate > 70%
- Syntax error resolution time < 30 seconds

---

#### UC-005: Add New Class with Properties

**Priority**: High  
**Complexity**: Low  
**Actor(s)**: All Users

**Preconditions**:
- Ontology is loaded
- User has selected parent class in tree

**Postconditions**:
- New class is created with unique IRI
- Class is added to hierarchy under parent
- Class appears in all views (tree, graph, search index)
- Default annotations are added

**Main Flow**:
1. User selects "Device" class in class tree
2. User right-clicks to open context menu
3. User selects "Add Subclass"
4. System displays inline editor in tree below "Device"
5. User types class name: "TemperatureSensor"
6. System validates name:
   - Checks for valid identifier (no spaces, special characters)
   - Checks for naming convention (PascalCase recommended)
   - Checks for duplicates in ontology
7. User presses Enter
8. System creates class:
   - Generates IRI: <http://example.org/smarthome#TemperatureSensor>
   - Creates subClassOf axiom: TemperatureSensor SubClassOf Device
   - Adds default annotations:
     * rdfs:label "Temperature Sensor"
     * rdfs:comment "A sensor that measures temperature"
     * dc:created "2025-12-29T10:30:00Z"
9. System updates UI:
   - Inserts "TemperatureSensor" in tree under "Device"
   - Adds node to graph view
   - Adds to search index
10. System selects new class (highlights in tree)
11. System displays properties panel for editing
12. User adds data property:
    - Clicks "Add Property" button
    - Selects "Data Property"
    - System displays property dialog
13. User enters property details:
    - Name: "hasTemperatureValue"
    - Domain: TemperatureSensor
    - Range: xsd:decimal
    - Functional: Yes
14. User clicks "Create"
15. System creates property and associates with class
16. System updates axioms:
```
TemperatureSensor SubClassOf Device
TemperatureSensor SubClassOf (hasTemperatureValue exactly 1 xsd:decimal)
```
17. System displays updated properties panel
18. System marks ontology as modified

**Alternative Flows**:

**AF-005A: Quick Create with Keyboard**
- At step 2, user presses "Insert" key (keyboard shortcut)
- System enters inline edit mode immediately
- Continue to step 5

**AF-005B: Batch Class Creation**
- At step 3, user selects "Add Multiple Subclasses"
- System displays dialog with multi-line text area
- User enters multiple class names (one per line):
```
TemperatureSensor
HumiditySensor
MotionSensor
LightSensor
```
- System creates all classes simultaneously
- System displays summary: "Created 4 classes under Device"
- User reviews created classes in tree

**AF-005C: AI-Assisted Property Suggestion**
- At step 11, user clicks "AI Suggest Properties"
- System sends request to LLM:
  "Suggest data and object properties for a TemperatureSensor class in a smart home ontology"
- AI responds with suggestions:
  * hasTemperatureValue (DataProperty, Range: xsd:decimal)
  * hasUnit (DataProperty, Range: xsd:string)
  * locatedIn (ObjectProperty, Range: Room)
  * isActive (DataProperty, Range: xsd:boolean)
- System displays suggestions with checkboxes
- User selects desired properties
- System creates selected properties
- Continue to step 18

**AF-005D: Clone Existing Class**
- At step 3, user selects "Clone Class"
- System displays class selector
- User selects "HumiditySensor" to clone
- System copies:
  - All axioms (with class name replaced)
  - All annotations
  - All property associations
- User modifies cloned class as needed
- Continue to step 18

**Exception Flows**:

**EF-005A: Invalid Class Name**
- At step 6, user enters "Temperature Sensor" (with space)
- System displays error: "Invalid class name. No spaces allowed."
- System suggests: "TemperatureSensor" or "Temperature_Sensor"
- User corrects name or accepts suggestion
- Return to step 5

**EF-005B: Duplicate Class Name**
- At step 6, system detects "TemperatureSensor" already exists
- System displays error: "Class 'TemperatureSensor' already exists"
- System offers options:
  - "Open Existing" (navigate to existing class)
  - "Rename" (append number: TemperatureSensor2)
  - "Replace" (delete existing, create new)
- User selects option

**EF-005C: Property Creation Failure**
- At step 15, system encounters error creating property
- Error: "Property 'hasTemperatureValue' already exists with different domain"
- System displays conflict details:
  - Existing domain: Sensor
  - New domain: TemperatureSensor
- System suggests: "Use existing property or rename new one"
- User resolves conflict

**EF-005D: Naming Convention Warning**
- At step 6, user enters "temperatureSensor" (camelCase instead of PascalCase)
- System displays warning (not error): "Convention: Class names should use PascalCase"
- System suggests: "TemperatureSensor"
- User can:
  - Accept suggestion (system renames)
  - Ignore (continue with camelCase)
  - Configure conventions in settings

**Business Rules**:
- BR-017: Class names must be valid OWL identifiers
- BR-018: Each class must have unique IRI within ontology
- BR-019: Default annotations are added unless user disables in settings
- BR-020: Class IRI is generated from base IRI + class name

**Non-functional Requirements**:
- Inline editor must appear within 100ms
- Class creation must complete within 200ms
- Tree UI must update within 100ms
- AI property suggestions must return within 5 seconds

---

### 3.3 Visualization and Navigation

---

#### UC-006: Explore Large Ontology with Incremental Loading

**Priority**: High  
**Complexity**: Medium  
**Actor(s)**: All Users

**Preconditions**:
- Large ontology is loaded (2,000+ classes)
- Graph view is active
- Incremental loading is enabled

**Postconditions**:
- User has navigated complex hierarchy smoothly
- Only visible portion of ontology is rendered
- Memory usage remains stable
- User understands overall ontology structure

**Main Flow**:
1. User imports large biomedical ontology (SNOMED CT subset, 3,500 classes)
2. System displays loading indicator: "Parsing ontology..."
3. System parses and indexes ontology (takes 15 seconds)
4. System loads initial view:
   - Root nodes: owl:Thing and immediate children (12 classes)
   - Graph displays only these nodes
   - Status bar: "Showing 12 of 3,500 classes"
5. User sees top-level categories:
   - ClinicalFinding
   - Procedure
   - BodyStructure
   - Substance
   - ...
6. User double-clicks "ClinicalFinding" node
7. System expands node:
   - Queries ontology for direct subclasses of ClinicalFinding (85 classes)
   - Adds nodes to graph
   - Applies ELK layout to new subgraph
   - Animates expansion (300ms transition)
8. System updates status: "Showing 97 of 3,500 classes"
9. User pans down to "CardiovascularFinding" area
10. System detects nodes entering viewport
11. System checks if children are loaded (not yet)
12. System displays "..." badge on CardiovascularFinding node
13. User double-clicks "CardiovascularFinding"
14. System loads 45 subclasses
15. System detects viewport getting crowded (>200 nodes)
16. System unloads nodes that have been off-screen > 30 seconds:
    - Keeps parent nodes (breadcrumb trail)
    - Unloads distant siblings
    - Frees ~50 nodes from memory
17. User uses search: Ctrl+F → "myocardial infarction"
18. System searches full index (not just loaded nodes)
19. System finds "MyocardialInfarction" class
20. System loads path to class:
    - Loads parents: HeartDisease → CardiovascularFinding → ClinicalFinding
    - Loads MyocardialInfarction
    - Loads siblings of MyocardialInfarction (same parent)
21. System highlights and centers MyocardialInfarction node
22. System displays path in breadcrumb: Thing > ClinicalFinding > CardiovascularFinding > HeartDisease > MyocardialInfarction
23. User explores details in properties panel
24. User zooms out to see overall structure
25. System adjusts node rendering:
    - Hides labels for nodes < 20px
    - Displays only icons for very small nodes
    - Shows simplified edges
26. User navigates smoothly through 3,500 class hierarchy

**Alternative Flows**:

**AF-006A: Load All (Override Incremental)**
- At step 4, user clicks "Load All Classes" button
- System displays warning: "Loading 3,500 classes may affect performance"
- System shows estimated memory: ~800MB
- User confirms
- System loads entire ontology into graph
- System applies layout (takes 45 seconds)
- User can now see complete structure at once
- Trade-off: Slower performance, but complete view

**AF-006B: Expand All Descendants**
- At step 6, user right-clicks "ClinicalFinding"
- User selects "Expand All Descendants" (recursive expand)
- System displays confirmation: "This will load 1,245 classes. Continue?"
- User confirms
- System loads recursively with progress bar
- System displays full subtree
- Continue to step 26

**AF-006C: Collapse Branch**
- After expanding multiple levels, user wants to simplify view
- User right-clicks "CardiovascularFinding"
- User selects "Collapse"
- System collapses all descendants
- System unloads collapsed nodes from memory
- System re-centers view
- User sees simplified hierarchy

**AF-006D: Viewport-Based Auto-Loading**
- At step 9, user pans rapidly through graph
- System detects nodes with "..." entering viewport
- System automatically loads their children without double-click
- System displays subtle loading indicator on expanding nodes
- User experiences seamless exploration

**Exception Flows**:

**EF-006A: Memory Warning**
- At step 10, system detects memory usage approaching 1.5GB
- System displays warning: "Memory usage high (1.5GB). Consider:"
  - "Collapse distant branches"
  - "Enable aggressive unloading"
  - "Reduce visible classes"
- System automatically enables aggressive unloading
- System unloads nodes off-screen > 15 seconds (instead of 30)
- System continues functioning

**EF-006B: Layout Timeout**
- At step 7, ELK layout algorithm exceeds 5 second timeout
- System displays: "Layout taking longer than expected"
- System offers options:
  - "Continue Waiting"
  - "Use Simple Layout" (fall back to tree layout)
  - "Load Fewer Nodes"
- User selects "Use Simple Layout"
- System applies faster algorithm
- Quality may be lower but functional

**EF-006C: Search No Results**
- At step 18, user searches for "pneumonia"
- System searches index, no matches found
- System displays: "No results for 'pneumonia'"
- System offers:
  - "Search in labels" (not just class names)
  - "Search in comments"
  - "Try fuzzy search: pnemonia, pneumona"
- User enables fuzzy search
- System finds close matches

**EF-006D: Corrupted Index**
- At step 18, system detects search index corruption
- System displays: "Search index corrupted. Rebuilding..."
- System rebuilds index in background (5 seconds)
- System allows continued browsing
- When complete: "Search index rebuilt. Try again."
- User repeats search successfully

**Business Rules**:
- BR-021: Incremental loading enabled for ontologies > 1,000 classes
- BR-022: Nodes off-screen > 30 seconds are eligible for unloading
- BR-023: Parent nodes and siblings of current focus always remain loaded
- BR-024: Maximum rendered nodes: 500 (configurable)

**Non-functional Requirements**:
- Node expansion must complete within 500ms
- Layout recalculation for 100 nodes must complete within 1 second
- Unloading must not cause visible flicker or jank
- Memory usage must remain stable over extended browsing sessions
- Search must return results within 200ms

---

#### UC-007: Visualize Inferred Relationships

**Priority**: Medium  
**Complexity**: Medium  
**Actor(s)**: Ontology Engineer, Researcher

**Preconditions**:
- Ontology is loaded with axioms suitable for inference
- Reasoner is available (client or server)
- Graph view is active

**Postconditions**:
- Inferred relationships are visible in graph
- User can distinguish asserted from inferred edges
- User can trace inference explanations
- Inferred axioms can be materialized if desired

**Main Flow**:
1. User has Pizza ontology loaded (145 classes, 250 axioms)
2. User defines classes:
```
Mammal SubClassOf Animal
Dog SubClassOf Mammal
Cat SubClassOf Mammal
```
3. Graph shows solid edges:
   - Mammal → Animal (solid arrow)
   - Dog → Mammal (solid arrow)
   - Cat → Mammal (solid arrow)
4. User clicks "Run Reasoner" button
5. System displays reasoner configuration dialog:
   - Reasoner: EYE-JS (client-side)
   - Inference types: [✓] SubClassOf, [✓] EquivalentClass, [ ] Type, [ ] PropertyChain
   - Include in graph: [✓] Yes
   - Style inferred edges: [✓] Dashed lines
6. User clicks "Start Reasoning"
7. System displays progress: "Reasoning... (1 of 3 stages)"
8. System performs reasoning:
   - Stage 1: Consistency check (200ms) ✓
   - Stage 2: Classification (500ms) ✓
   - Stage 3: Property realization (300ms) ✓
9. System receives inferred axioms:
```
Dog SubClassOf Animal [inferred]
Cat SubClassOf Animal [inferred]
```
10. System updates graph:
    - Adds dashed edges:
      * Dog → Animal (dashed, blue)
      * Cat → Animal (dashed, blue)
    - Solid edges remain:
      * Mammal → Animal (solid, black)
      * Dog → Mammal (solid, black)
      * Cat → Mammal (solid, black)
11. System displays legend:
    - Solid edge: Asserted axiom
    - Dashed edge: Inferred axiom
12. System updates status bar: "Reasoning complete. 2 axioms inferred."
13. User hovers over "Dog → Animal" dashed edge
14. System displays tooltip:
    - "Inferred: Dog SubClassOf Animal"
    - "Click for explanation"
15. User clicks edge
16. System opens explanation panel:
```
Inference Chain:
1. Dog SubClassOf Mammal [asserted]
2. Mammal SubClassOf Animal [asserted]
3. ∴ Dog SubClassOf Animal [inferred by transitivity]

OWL Axiom: SubPropertyOf(SubClassOf, SubClassOf)
```
17. User reviews explanation
18. User clicks "Materialize Inferred Axioms" (optional)
19. System displays confirmation: "This will convert 2 inferred axioms to asserted axioms"
20. User confirms
21. System converts dashed edges to solid edges
22. System adds axioms to ontology (now asserted, not inferred)

**Alternative Flows**:

**AF-007A: Server-Side Reasoning**
- At step 4, ontology is too large for client-side reasoning (2,000+ classes)
- System recommends: "Use server-side reasoning for better performance"
- User selects "HermiT Reasoner (Server)"
- At step 7, system sends ontology to server via API
- System displays: "Reasoning on server... this may take several minutes"
- System allows user to continue editing while waiting
- When complete: System merges inferred axioms
- Continue to step 10

**AF-007B: Incremental Reasoning**
- User has made small change to ontology (added one axiom)
- At step 4, system detects previous reasoning results exist
- System offers "Incremental Reasoning" option
- System only re-reasons over affected classes
- Reasoning completes in 100ms instead of 1 second
- Continue to step 10

**AF-007C: Compare Before/After**
- After step 10, user clicks "Compare View" button
- System splits screen:
  - Left: Graph before reasoning
  - Right: Graph after reasoning
- New inferred edges highlighted in yellow
- User can identify exactly what was inferred
- User closes comparison when done

**AF-007D: Export Inferred Ontology**
- After step 12, user wants to share complete ontology
- User selects File > Export > "Include Inferred Axioms"
- System includes both asserted and inferred axioms in export
- Inferred axioms marked with annotation:
```turtle
:Dog rdfs:subClassOf :Animal .
# Inferred by HermiT reasoner on 2025-12-29
```
- Recipient can understand which axioms are inferred

**Exception Flows**:

**EF-007A: Inconsistency Detected**
- At step 8, reasoner detects inconsistency
- Reasoning halts in Stage 1
- System displays error: "Ontology is inconsistent"
- System highlights problematic classes in red:
  - VegetarianPizza (unsatisfiable)
- System offers "Explain Inconsistency"
- User clicks explain
- System shows conflicting axioms:
```
1. VegetarianPizza SubClassOf Pizza
2. VegetarianPizza SubClassOf (hasTopping only VegetarianTopping)
3. VegetarianPizza hasTopping MeatTopping [asserted individual fact]
4. MeatTopping DisjointWith VegetarianTopping
→ Contradiction!
```
- User must fix inconsistency before reasoning can complete

**EF-007B: Reasoning Timeout**
- At step 8, reasoning exceeds 30 second timeout
- System displays: "Reasoning is taking longer than expected"
- System offers:
  - "Continue Waiting" (extend timeout)
  - "Cancel and Use Faster Reasoner" (ELK instead of HermiT)
  - "Cancel and Simplify Ontology"
- User selects "Use Faster Reasoner"
- System switches to ELK (less complete but faster)
- Reasoning completes in 5 seconds
- System displays: "ELK reasoner used (may not compute all inferences)"

**EF-007C: Out of Memory**
- At step 8, browser memory exceeds limit
- System displays: "Insufficient memory for reasoning"
- System offers:
  - "Server-Side Reasoning"
  - "Reduce Ontology Size"
  - "Close Other Applications"
- User selects "Server-Side Reasoning"
- System offloads to server
- Continue with AF-007A

**EF-007D: Network Failure (Server Reasoning)**
- During AF-007A, network connection drops
- System displays: "Connection to reasoning server lost"
- System offers:
  - "Retry"
  - "Switch to Client-Side"
  - "Save and Resume Later"
- User retries connection
- System resumes successfully

**Business Rules**:
- BR-025: Inferred axioms must be visually distinguishable from asserted axioms
- BR-026: User must be able to access reasoning explanations
- BR-027: Materialization converts inferred to asserted (one-way operation)
- BR-028: Reasoning results cached for 5 minutes (avoid re-computation)

**Non-functional Requirements**:
- Client-side reasoning for 500 classes must complete within 5 seconds
- Graph updates with inferred edges must complete within 1 second
- Explanation generation must complete within 500ms
- No UI freeze during reasoning (use Web Workers)

---

### 3.4 AI-Assisted Development

---

#### UC-008: Generate Ontology Structure with AI

**Priority**: High  
**Complexity**: Medium  
**Actor(s)**: All Users

**Preconditions**:
- Empty or minimal ontology is loaded
- User has configured LLM API key
- Internet connection available

**Postconditions**:
- AI-generated class hierarchy is created
- User has reviewed and approved classes
- Properties are defined and linked to classes
- Ontology is ready for refinement

**Main Flow**:
1. User creates new ontology: "UniversityOntology"
2. User presses ⌘/Ctrl+K (command palette)
3. System displays command palette overlay
4. User types "generate" in search
5. System filters commands:
   - "Generate Ontology Structure" ⭐
   - "Generate Class Hierarchy"
   - "Generate Properties"
6. User selects "Generate Ontology Structure"
7. System displays AI generation dialog:
   - Title: "Describe your ontology"
   - Large text area
   - Model selector: GPT-4 (default), Claude, GPT-3.5
   - Options: [✓] Include properties, [✓] Add descriptions, [ ] Generate individuals
   - Generate button
8. User enters description:
```
Create an ontology for a university system. Include concepts for:
- Academic staff (professors, lecturers, researchers)
- Students (undergraduate, graduate, PhD)
- Courses and programs
- Departments and faculties
- Buildings and facilities
```
9. User clicks "Generate"
10. System displays "Generating..." with animated spinner
11. System sends request to OpenAI API:
```json
{
  "model": "gpt-4",
  "messages": [{
    "role": "system",
    "content": "You are an ontology engineering assistant..."
  }, {
    "role": "user",
    "content": "Create an ontology for a university system..."
  }],
  "temperature": 0.7
}
```
12. API responds after 4 seconds with structured JSON:
```json
{
  "classes": [
    {"name": "Person", "parent": "owl:Thing", "description": "Any person in university"},
    {"name": "AcademicStaff", "parent": "Person", "description": "Faculty members"},
    {"name": "Professor", "parent": "AcademicStaff"},
    {"name": "Lecturer", "parent": "AcademicStaff"},
    {"name": "Student", "parent": "Person"},
    {"name": "UndergraduateStudent", "parent": "Student"},
    {"name": "GraduateStudent", "parent": "Student"},
    {"name": "Course", "parent": "owl:Thing"},
    {"name": "Department", "parent": "owl:Thing"},
    {"name": "Building", "parent": "owl:Thing"}
  ],
  "objectProperties": [
    {"name": "teachesIn", "domain": "AcademicStaff", "range": "Course"},
    {"name": "enrolledIn", "domain": "Student", "range": "Course"},
    {"name": "worksFor", "domain": "Person", "range": "Department"},
    {"name": "locatedIn", "domain": "Department", "range": "Building"}
  ],
  "dataProperties": [
    {"name": "hasEmployeeID", "domain": "AcademicStaff", "range": "xsd:string"},
    {"name": "hasStudentID", "domain": "Student", "range": "xsd:string"},
    {"name": "hasGPA", "domain": "Student", "range": "xsd:decimal"},
    {"name": "hasCourseCode", "domain": "Course", "range": "xsd:string"}
  ]
}
```
13. System parses JSON response
14. System displays preview dialog:
    - Left panel: Tree view of class hierarchy
    - Right panel: List of properties
    - Checkboxes for each item
    - "Accept All" / "Accept Selected" / "Regenerate" buttons
15. System renders preview:
```
☑ Person
  ☑ AcademicStaff
    ☑ Professor
    ☑ Lecturer
  ☑ Student
    ☑ UndergraduateStudent
    ☑ GraduateStudent
☑ Course
☑ Department
☑ Building

Object Properties:
☑ teachesIn (AcademicStaff → Course)
☑ enrolledIn (Student → Course)
☑ worksFor (Person → Department)
☑ locatedIn (Department → Building)

Data Properties:
☑ hasEmployeeID (AcademicStaff → xsd:string)
☑ hasStudentID (Student → xsd:string)
☑ hasGPA (Student → xsd:decimal)
☑ hasCourseCode (Course → xsd:string)
```
16. User reviews suggestions
17. User unchecks "Lecturer" (wants to rename it later)
18. User clicks "Accept Selected"
19. System creates ontology elements:
    - Creates 9 classes (Lecturer excluded)
    - Creates 4 object properties
    - Creates 4 data properties
    - Adds descriptions as rdfs:comment
    - Generates IRIs using base IRI
20. System updates all views:
    - Class tree populates with hierarchy
    - Graph view displays visual structure
    - Properties panel shows created entities
21. System displays success notification:
    "Created 9 classes and 8 properties. Total time: 6 seconds"
22. System marks ontology as modified
23. User can now refine AI-generated structure

**Alternative Flows**:

**AF-008A: Regenerate with Different Instructions**
- At step 16, user is not satisfied with results
- User clicks "Regenerate"
- System returns to step 7 with original prompt pre-filled
- User modifies prompt:
  "Also include concepts for research projects and publications"
- System sends new request
- AI generates additional classes:
  * ResearchProject
  * Publication
  * Grant
- User reviews and accepts

**AF-008B: Iterative Generation**
- After step 23, user wants to expand existing structure
- User selects "Course" class in tree
- User presses ⌘+K and types "expand class"
- System prompts: "How should Course be expanded?"
- User: "Add different types of courses: Lecture, Lab, Seminar, Workshop"
- AI generates subclasses under Course
- User accepts
- Ontology now has richer Course hierarchy

**AF-008C: Generate from Example**
- At step 7, user clicks "Use Example" button
- System displays example ontologies:
  * E-commerce
  * Healthcare
  * Education (University) ⭐
  * IoT Smart Home
- User selects "Education"
- System loads example prompt and generates
- Continue to step 12

**AF-008D: Multiple Iterations**
- At step 16, user accepts Person branch but rejects Course structure
- User deselects Course and related properties
- User clicks "Accept Selected" (creates Person hierarchy only)
- User then opens command palette again
- User generates specifically for Course structure
- System adds to existing ontology
- Final result: Combination of manual + multiple AI generations

**Exception Flows**:

**EF-008A: API Key Not Configured**
- At step 11, system checks for API key
- No API key found
- System displays error: "OpenAI API key not configured"
- System offers "Configure in Settings"
- User clicks, navigates to settings
- User enters API key
- User returns and retries generation
- Continue to step 11

**EF-008B: API Request Failed**
- At step 11, API request fails (rate limit, network error)
- System displays error: "Request failed: Rate limit exceeded"
- System offers:
  - "Retry in 60 seconds"
  - "Switch to Different Model" (Claude instead of GPT-4)
  - "Enter Response Manually" (paste JSON if user has generated elsewhere)
- User waits and retries
- Request succeeds

**EF-008C: Invalid JSON Response**
- At step 13, AI returns malformed JSON or unexpected format
- System attempts to parse, fails
- System displays error: "AI returned invalid response"
- System shows raw response for debugging
- System offers:
  - "Regenerate"
  - "Report Issue"
  - "Manual Entry"
- User regenerates
- New response is valid

**EF-008D: Naming Conflicts**
- At step 19, system detects "Person" class already exists (user created manually earlier)
- System displays conflict warning: "Class 'Person' already exists"
- System offers options:
  - "Skip" (don't create, link children to existing Person)
  - "Merge" (keep existing, add AI-suggested properties)
  - "Rename" (create as Person2 or PersonAI)
- User selects "Merge"
- System merges structures successfully

**EF-008E: API Cost Warning**
- At step 9, system estimates API cost
- System displays: "Estimated cost: $0.15 (based on prompt length and model)"
- If user has made 10+ requests today:
  System warns: "You've made 10 AI requests today. Total cost: ~$1.50"
- User can proceed or cancel
- User proceeds

**EF-008F: Content Policy Violation**
- At step 12, AI refuses to generate due to content policy
- Example: User asked for "weapons ontology"
- System displays: "AI declined to generate this content"
- System shows AI's explanation
- User must modify prompt to acceptable domain

**Business Rules**:
- BR-029: AI-generated content must be reviewed by user before insertion
- BR-030: All AI interactions logged for debugging and cost tracking
- BR-031: Maximum prompt length: 4,000 characters
- BR-032: Generated IRIs must be valid and unique

**Non-functional Requirements**:
- AI response must be received within 15 seconds
- UI must remain responsive during generation (async operation)
- Generated structure must be syntactically valid OWL
- System must handle API failures gracefully

**Success Metrics**:
- 80% of AI-generated structures accepted without major modifications
- Average time to create basic ontology: < 2 minutes (vs. 30+ minutes manually)
- User satisfaction with AI suggestions: > 4/5 rating

---

#### UC-009: Get AI-Powered Property Recommendations

**Priority**: Medium  
**Complexity**: Low  
**Actor(s)**: All Users

**Preconditions**:
- Ontology is loaded
- At least one class exists
- LLM API is configured

**Postconditions**:
- User has received property suggestions for class
- User has selected and created desired properties
- Properties are properly linked with domain and range

**Main Flow**:
1. User is working on University ontology
2. User has created "Professor" class:
```
Professor SubClassOf AcademicStaff
```
3. User selects "Professor" in class tree
4. Properties panel displays class details (currently empty properties)
5. User clicks "AI Suggest Properties" button
6. System displays AI suggestion dialog:
   - "Suggesting properties for: Professor"
   - Model: GPT-4
   - Context: [✓] Use parent class properties, [✓] Use ontology domain
7. User clicks "Generate"
8. System builds context-aware prompt:
```
Given an ontology for a university system, suggest appropriate properties for the class "Professor".

Context:
- Professor is a subclass of AcademicStaff
- Other classes in ontology: Student, Course, Department, Building
- Domain: Education / University Management
- Existing properties in ontology: teachesIn, worksFor

Provide:
1. Object Properties (relationships with other classes)
2. Data Properties (attributes with literal values)

For each property:
- Name (camelCase)
- Type (ObjectProperty or DataProperty)
- Domain: Professor or broader class
- Range: Class name or datatype
- Description
- Whether it should be functional, transitive, etc.

Format as JSON array.
```
9. System sends to LLM API
10. API responds after 3 seconds with suggestions:
```json
{
  "objectProperties": [
    {
      "name": "teaches",
      "type": "ObjectProperty",
      "domain": "Professor",
      "range": "Course",
      "description": "Links a professor to courses they teach",
      "functional": false,
      "existingProperty": "teachesIn",
      "note": "Consider reusing 'teachesIn' property from AcademicStaff"
    },
    {
      "name": "supervises",
      "type": "ObjectProperty",
      "domain": "Professor",
      "range": "GraduateStudent",
      "description": "Links a professor to graduate students they supervise",
      "functional": false
    },
    {
      "name": "memberOfCommittee",
      "type": "ObjectProperty",
      "domain": "AcademicStaff",
      "range": "Committee",
      "description": "Membership in academic committees",
      "functional": false,
      "note": "Defined at AcademicStaff level to be shared with other staff types"
    }
  ],
  "dataProperties": [
    {
      "name": "hasResearchInterest",
      "type": "DataProperty",
      "domain": "Professor",
      "range": "xsd:string",
      "description": "Research areas of interest",
      "functional": false
    },
    {
      "name": "hasOfficeNumber",
      "type": "DataProperty",
      "domain": "AcademicStaff",
      "range": "xsd:string",
      "description": "Office location identifier",
      "functional": true
    },
    {
      "name": "tenured",
      "type": "DataProperty",
      "domain": "Professor",
      "range": "xsd:boolean",
      "description": "Whether the professor has tenure",
      "functional": true
    },
    {
      "name": "publicationCount",
      "type": "DataProperty",
      "domain": "Professor",
      "range": "xsd:integer",
      "description": "Total number of publications",
      "functional": true
    }
  ]
}
```
11. System displays suggestions in organized UI:

**Object Properties:**
```
□ Use existing: teachesIn (AcademicStaff → Course) ⚠️ Already exists
  Note: Consider reusing instead of creating new 'teaches' property

☑ supervises (Professor → GraduateStudent) [NEW]
  "Links a professor to graduate students they supervise"

☑ memberOfCommittee (AcademicStaff → Committee) [NEW] ⚠️ Committee class doesn't exist
  "Membership in academic committees"
  Action: [Create Committee class]
```

**Data Properties:**
```
☑ hasResearchInterest (Professor → xsd:string) [NEW]
  "Research areas of interest"

☑ hasOfficeNumber (AcademicStaff → xsd:string) [NEW]
  "Office location identifier"
  Characteristics: Functional

☑ tenured (Professor → xsd:boolean) [NEW]
  "Whether the professor has tenure"
  Characteristics: Functional

□ publicationCount (Professor → xsd:integer) [NEW]
  "Total number of publications"
  User unchecks this - will track publications as separate entities
```

12. User reviews suggestions
13. User sees warning about "Committee" class missing
14. User clicks "Create Committee class"
15. System creates Committee as new top-level class
16. User reviews property that references existing "teachesIn"
17. User decides to reuse existing property (unchecks "teaches" suggestion)
18. User unchecks "publicationCount" (different approach)
19. User clicks "Create Selected Properties" (5 selected)
20. System creates properties:
    - supervises (Professor → GraduateStudent)
    - memberOfCommittee (AcademicStaff → Committee)
    - hasResearchInterest (Professor → xsd:string)
    - hasOfficeNumber (AcademicStaff → xsd:string, functional)
    - tenured (Professor → xsd:boolean, functional)
21. System updates ontology with property axioms:
```
ObjectProperty: supervises
  Domain: Professor
  Range: GraduateStudent

DataProperty: tenured
  Domain: Professor
  Range: xsd:boolean
  Characteristics: Functional
```
22. System updates Professor class with property restrictions (optional):
```
Professor SubClassOf AcademicStaff
Professor SubClassOf (supervises only GraduateStudent)
Professor SubClassOf (tenured exactly 1 xsd:boolean)
```
23. System displays success: "Created 5 properties for Professor"
24. Properties panel now shows all properties associated with Professor
25. User can use new properties to define individuals or additional axioms

**Alternative Flows**:

**AF-009A: Modify AI Suggestion**
- At step 12, user likes "supervises" but wants different name
- User clicks edit icon next to "supervises"
- System displays property editor
- User changes name to "advisesStudent"
- User changes description to be more specific
- System updates suggestion
- Continue to step 19

**AF-009B: Request More Suggestions**
- At step 12, user wants additional suggestions
- User clicks "Generate More"
- System sends follow-up prompt: "Suggest 5 more properties for Professor, different from: supervises, hasResearchInterest..."
- AI generates additional suggestions:
  * collaboratesWith (Professor → Professor)
  * grantPI (Professor → Grant)
  * teachingLoad (Professor → xsd:integer)
- User reviews new suggestions
- Continue to step 18

**AF-009C: Apply to Similar Classes**
- At step 24, user has Professor properties defined
- User wants same properties for "Associate Professor" class
- User selects "AssociateProfessor" class
- User clicks "Copy Properties From" → selects "Professor"
- System copies all property associations
- User can then modify specific to AssociateProfessor

**AF-009D: Batch Property Generation**
- At step 1, user wants properties for multiple classes
- User multi-selects: Professor, Lecturer, Researcher
- User clicks "AI Suggest Properties"
- System generates properties for all selected classes
- System identifies shared properties (defined at parent class)
- System identifies class-specific properties
- User reviews all suggestions together
- Continue to step 19

**Exception Flows**:

**EF-009A: API Timeout**
- At step 9, API request takes > 15 seconds
- System displays: "Request taking longer than expected"
- System offers:
  - "Keep Waiting"
  - "Cancel and Retry"
  - "Use Cached Similar Suggestions" (if available)
- User keeps waiting
- Request completes after 20 seconds

**EF-009B: Poor Quality Suggestions**
- At step 11, AI suggests irrelevant properties
- Example: "hasWheels" for Professor class (clearly wrong)
- User unchecks all suggestions
- User clicks "Report Quality Issue"
- System sends feedback to improve future prompts
- User clicks "Regenerate with More Context"
- User adds more details about ontology purpose
- AI generates better suggestions

**EF-009C: Range Class Missing**
- At step 13, suggested property has range "Committee"
- Committee class doesn't exist in ontology
- System detects this and displays warning
- System offers options:
  - "Create Missing Class" (creates Committee)
  - "Change Range" (user can specify different class)
  - "Skip This Property"
- User creates missing class
- Continue to step 19

**EF-009D: Property Name Conflict**
- At step 20, system tries to create "supervises" property
- Property "supervises" already exists with different domain/range
- Existing: supervises (Person → Person)
- New: supervises (Professor → GraduateStudent)
- System displays conflict dialog:
  - "Property 'supervises' exists with different signature"
  - Options: "Reuse Existing", "Rename New (supervises2)", "Replace Existing"
- User selects "Reuse Existing"
- System uses existing property

**Business Rules**:
- BR-033: Suggested properties must be relevant to class domain
- BR-034: Property names must follow camelCase convention
- BR-035: Functional properties should be clearly marked
- BR-036: Suggested ranges must be valid classes or datatypes

**Non-functional Requirements**:
- AI response time: < 10 seconds
- Suggestions must be syntactically valid OWL
- UI must clearly distinguish existing vs. new properties
- System must detect and warn about missing range classes

**Success Metrics**:
- 70% of suggested properties are accepted by users
- Time to add properties reduced by 60% vs. manual entry
- Less than 10% of suggestions require modification

---

### 3.5 Reasoning and Validation

---

#### UC-010: Detect and Debug Inconsistent Ontology

**Priority**: High  
**Complexity**: High  
**Actor(s)**: Ontology Engineer, Researcher

**Preconditions**:
- Ontology is loaded with axioms
- Reasoner is available
- Ontology contains at least one inconsistency

**Postconditions**:
- Inconsistencies are identified and explained
- User understands the source of conflicts
- User has fixed the inconsistencies
- Ontology passes consistency check

**Main Flow**:
1. User has been developing Pizza ontology
2. User has defined various pizza classes and properties
3. User defines "MargheritaPizza":
```
MargheritaPizza SubClassOf VegetarianPizza
MargheritaPizza SubClassOf (hasTopping some MozzarellaTopping)
MargheritaPizza SubClassOf (hasTopping some TomatoTopping)
```
4. User defines "VegetarianPizza":
```
VegetarianPizza SubClassOf Pizza
VegetarianPizza SubClassOf (hasTopping only VegetarianTopping)
```
5. User defines toppings:
```
MozzarellaTopping SubClassOf CheeseTopping
CheeseTopping SubClassOf VegetarianTopping

TomatoTopping SubClassOf VegetableTopping
VegetableTopping SubClassOf VegetarianTopping
```
6. User accidentally defines:
```
MozzarellaTopping SubClassOf MeatTopping  # ERROR! Also defined as CheeseTopping
MeatTopping DisjointWith VegetarianTopping
```
7. User is unaware of the error
8. User clicks "Check Consistency" button (or Ctrl+Shift+C)
9. System displays reasoning progress dialog:
   - "Checking consistency..."
   - Progress bar (indeterminate)
   - "Running HermiT reasoner..."
10. System invokes reasoner (client-side, 2 seconds)
11. Reasoner detects inconsistency
12. System receives reasoning results:
```json
{
  "consistent": false,
  "unsatisfiable_classes": [
    "MargheritaPizza",
    "VegetarianPizza",
    "MozzarellaTopping"
  ],
  "explanations": [...]
}
```
13. System displays error summary dialog:
```
❌ Ontology is INCONSISTENT

Unsatisfiable Classes (3):
  • MargheritaPizza
  • VegetarianPizza
  • MozzarellaTopping

This means these classes cannot have any members - they contain logical contradictions.

[View Detailed Explanation] [Highlight in Graph] [Cancel]
```
14. User clicks "View Detailed Explanation"
15. System opens explanation panel (side panel or modal)
16. System displays explanation for "MargheritaPizza":
```
Why MargheritaPizza is Unsatisfiable:

Conflict Chain:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. MargheritaPizza ⊑ VegetarianPizza  [asserted]
   ├─ Source: Line 45 in ontology
   └─ File: pizza.owl

2. VegetarianPizza ⊑ (hasTopping only VegetarianTopping)  [asserted]
   ├─ This means: "All toppings must be vegetarian"
   └─ Source: Line 38

3. MargheritaPizza ⊑ (hasTopping some MozzarellaTopping)  [asserted]
   ├─ This means: "Must have at least one mozzarella topping"
   └─ Source: Line 46

4. MozzarellaTopping ⊑ CheeseTopping  [asserted]
   └─ Source: Line 67

5. MozzarellaTopping ⊑ MeatTopping  [asserted] ⚠️ PROBLEMATIC
   └─ Source: Line 72

6. MeatTopping ⊑ ¬VegetarianTopping  [from DisjointWith]
   ├─ This means: "Meat toppings cannot be vegetarian"
   └─ Source: Line 58

CONTRADICTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• MargheritaPizza must have Mozzarella topping (step 3)
• Mozzarella is defined as Meat topping (step 5) ❌
• But MargheritaPizza only allows Vegetarian toppings (step 2)
• Meat toppings cannot be Vegetarian (step 6)
→ Impossible to satisfy all constraints!

Suggested Fix:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Remove axiom at line 72:
  "MozzarellaTopping SubClassOf MeatTopping"

Mozzarella should only be CheeseTopping, not MeatTopping.

[Go to Line 72] [Remove Axiom] [Show in Graph]
```

17. User reviews explanation carefully
18. User clicks "Go to Line 72"
19. System navigates to axiom editor
20. System highlights problematic axiom:
```
MozzarellaTopping SubClassOf MeatTopping  ← HIGHLIGHTED IN RED
```
21. Cursor positioned at this line
22. Side panel shows:
   - "This axiom causes inconsistency"
   - "Conflicts with: Line 67 (MozzarellaTopping SubClassOf CheeseTopping)"
23. User realizes mistake (copy-paste error from defining PepperoniTopping)
24. User deletes the problematic axiom
25. System removes red highlight
26. System displays: "Axiom removed. Run consistency check again to verify."
27. User clicks "Check Consistency" again
28. System runs reasoner (1 second)
29. Reasoner result:
```json
{
  "consistent": true,
  "unsatisfiable_classes": [],
  "warnings": []
}
```
30. System displays success dialog:
```
✅ Ontology is CONSISTENT

No logical contradictions found.
All classes can potentially have instances.

Classification successful:
  • 45 classes
  • 12 inferred subClassOf relationships
  • No unsatisfiable classes

[View Inferred Axioms] [Close]
```
31. System updates graph view:
    - Removes red highlights from previously unsatisfiable classes
    - Displays green checkmark icon on consistency indicator
32. User continues working with confidence

**Alternative Flows**:

**AF-010A: Multiple Inconsistencies**
- At step 13, system detects 10 unsatisfiable classes
- System displays list with priorities:
  * High Priority: Base classes (affect many subclasses)
  * Medium: Mid-level classes
  * Low: Leaf classes
- System recommends: "Fix high priority issues first"
- User fixes base class inconsistency
- Ripple effect: 6 other inconsistencies resolve automatically
- User checks consistency again
- 4 inconsistencies remain, user fixes those

**AF-010B: Guided Repair Wizard**
- At step 14, user clicks "Repair Wizard" instead of manual fix
- System launches step-by-step wizard:
  1. "Inconsistency 1 of 3: MargheritaPizza"
  2. Shows conflict explanation
  3. Presents repair options:
     □ Remove "MozzarellaTopping SubClassOf MeatTopping"
     □ Remove "MeatTopping DisjointWith VegetarianTopping"
     □ Remove "MargheritaPizza SubClassOf VegetarianPizza"
  4. System recommends option 1 (based on likeliest error)
  5. User selects option
  6. System applies fix
  7. System moves to next inconsistency
  8. User completes wizard
  9. System runs final consistency check

**AF-010C: Compare with Previous Version**
- User knows ontology was consistent before recent edits
- At step 14, user clicks "Compare with Last Consistent Version"
- System loads last auto-saved consistent state (30 minutes ago)
- System displays diff:
  * Green: Axioms present in consistent version
  * Red: Axioms in current (inconsistent) version
- User identifies new axioms added since last consistent state
- These are likely culprits
- User reviews and removes problematic recent additions

**AF-010D: Export Inconsistency Report**
- At step 16, user wants to share issues with team
- User clicks "Export Report"
- System generates detailed report:
  * PDF format
  * Summary of all inconsistencies
  * Visual diagrams of conflict chains
  * Recommended fixes
  * Timestamps and axiom sources
- User emails report to colleagues for review

**Exception Flows**:

**EF-010A: Reasoner Crash**
- At step 10, reasoner encounters unexpected error and crashes
- System displays: "Reasoner encountered an error"
- Error details: "OutOfMemoryError: Java heap space"
- System offers:
  - "Retry with Increased Memory"
  - "Use Different Reasoner" (switch to ELK)
  - "Simplify Ontology" (temporarily remove complex axioms)
- User switches to ELK reasoner
- ELK completes successfully

**EF-010B: Cannot Explain Inconsistency**
- At step 15, system attempts to generate explanation
- Reasoner provides minimal information (just "unsatisfiable")
- System displays: "Unable to generate detailed explanation"
- System offers:
  - "Try Server-Side Reasoner" (more powerful)
  - "View Related Axioms" (list all axioms involving class)
  - "Search Community Forums" (link to OWL help)
- User views related axioms and manually analyzes

**EF-010C: Too Many Inconsistencies**
- At step 13, reasoner finds 150 unsatisfiable classes
- System displays: "Large number of inconsistencies (150)"
- System suggests: "Ontology may have fundamental design issue"
- System offers:
  - "Show Only Root Causes" (group related issues)
  - "Analyze Pattern" (AI detects common error pattern)
  - "Restore Backup" (revert to earlier version)
- User selects "Analyze Pattern"
- AI detects: "Most issues stem from incorrect disjointness axioms"
- User reviews and fixes disjointness issues

**EF-010D: Reasoning Timeout**
- At step 10, reasoning exceeds 2 minute timeout
- System displays: "Consistency check taking too long"
- System offers:
  - "Continue Waiting" (extend timeout to 10 minutes)
  - "Switch to Faster Reasoner" (less complete but faster)
  - "Check Subset" (select specific classes to check)
- User switches to faster reasoner
- Check completes in 30 seconds

**Business Rules**:
- BR-037: Consistency check must complete or timeout within 2 minutes
- BR-038: Explanations must trace back to asserted axioms
- BR-039: Unsatisfiable classes must be clearly highlighted in UI
- BR-040: System must suggest specific fixes, not just identify problems

**Non-functional Requirements**:
- Consistency check for 500 classes: < 5 seconds
- Explanation generation: < 1 second per class
- UI must remain responsive during reasoning (use Web Worker)
- Explanation must be understandable by users with basic OWL knowledge

**Success Metrics**:
- 90% of inconsistencies resolved within 10 minutes
- 80% of users understand explanations without additional help
- Repair wizard success rate: 85% (fixes applied successfully)

---

## 4. User Stories

### 4.1 Epic: Ontology Creation and Management

**Epic Description**: As a user, I need to create, import, export, and manage ontologies so that I can work with knowledge models in my domain.

---

**US-001: Quick Ontology Creation**

```
As an Ontology Engineer
I want to create a new ontology with just a name and base IRI
So that I can start building my knowledge model quickly

Acceptance Criteria:
- Given I am on the main screen
- When I click "New Ontology" and enter name and IRI
- Then a new empty ontology is created within 2 seconds
- And I can immediately start adding classes

Story Points: 3
Priority: High
Dependencies: None
```

---

**US-002: Import Standard Formats**

```
As a Researcher
I want to import ontologies in Turtle, RDF/XML, and OWL/XML formats
So that I can work with ontologies created in other tools

Acceptance Criteria:
- Given I have an ontology file
- When I click Import and select the file
- Then the ontology is parsed and loaded correctly
- And all classes, properties, and axioms are preserved
- And I can view the ontology in tree and graph views

Story Points: 5
Priority: High
Dependencies: N3.js library integration
```

---

**US-003: Export with Format Selection**

```
As an Ontology Engineer
I want to export my ontology in multiple formats
So that I can share it with users of different tools

Acceptance Criteria:
- Given I have an ontology open
- When I select Export and choose a format (Turtle/RDF/OWL)
- Then the ontology is correctly serialized
- And I can re-import the exported file without data loss
- And the file follows format standards

Story Points: 3
Priority: High
Dependencies: US-002
```

---

**US-004: Auto-Save and Recovery**

```
As a Graduate Student
I want my changes to be automatically saved
So that I don't lose work if my browser crashes

Acceptance Criteria:
- Given I am editing an ontology
- When I make changes (add class, define axiom, etc.)
- Then changes are auto-saved to IndexedDB within 5 seconds
- And if browser crashes, my work is recovered on restart
- And I see a "saved" indicator in the UI

Story Points: 3
Priority: Medium
Dependencies: IndexedDB integration
```

---

**US-005: Manage Multiple Ontologies**

```
As an Ontology Engineer
I want to work with multiple ontologies simultaneously
So that I can develop modular ontologies and manage imports

Acceptance Criteria:
- Given I have one ontology open
- When I open another ontology
- Then both are available in separate tabs
- And I can switch between them quickly
- And each maintains separate state

Story Points: 5
Priority: Medium
Dependencies: US-001
```

---

### 4.2 Epic: Advanced Axiom Editing

**Epic Description**: As a user, I need powerful editing capabilities for defining complex OWL axioms so that I can create sophisticated ontologies.

---

**US-006: Manchester Syntax Editor**

```
As an Ontology Engineer
I want a code editor with Manchester Syntax support
So that I can efficiently write complex class expressions

Acceptance Criteria:
- Given I select a class
- When I open the axiom editor
- Then I see a Monaco-based editor with syntax highlighting
- And keywords (SubClassOf, some, only) are highlighted
- And the editor supports standard keyboard shortcuts

Story Points: 8
Priority: High
Dependencies: Monaco Editor integration
```

---

**US-007: Intelligent Autocomplete**

```
As a Researcher
I want autocomplete suggestions based on my ontology
So that I can write axioms faster with fewer errors

Acceptance Criteria:
- Given I am typing an axiom
- When I trigger autocomplete (Ctrl+Space or after typing)
- Then relevant classes and properties are suggested
- And suggestions appear within 200ms
- And I can navigate with arrow keys and select with Enter

Story Points: 5
Priority: High
Dependencies: US-006
```

---

**US-008: Real-Time Syntax Validation**

```
As an Ontology Engineer
I want immediate feedback on syntax errors
So that I can fix mistakes as I type

Acceptance Criteria:
- Given I am editing an axiom
- When I type invalid syntax
- Then errors are highlighted with red squiggles within 100ms
- And I see helpful error messages on hover
- And the axiom cannot be saved while invalid

Story Points: 5
Priority: High
Dependencies: US-006, Tree-sitter grammar
```

---

**US-009: Quick Axiom Templates**

```
As a Graduate Student
I want pre-defined axiom templates
So that I can learn OWL syntax and work faster

Acceptance Criteria:
- Given I want to add a new axiom
- When I click "Templates"
- Then I see common patterns (restrictions, cardinality, etc.)
- And selecting a template inserts it with placeholders
- And I can tab through placeholders to fill them

Story Points: 3
Priority: Medium
Dependencies: US-006
```

---

**US-010: Multi-Line Formatting**

```
As an Ontology Engineer
I want to format complex axioms across multiple lines
So that I can improve readability

Acceptance Criteria:
- Given I have a long axiom
- When I press Enter within the axiom
- Then the editor auto-indents intelligently
- And syntax highlighting works across lines
- And the formatted axiom is still valid

Story Points: 3
Priority: Low
Dependencies: US-006
```

---

### 4.3 Epic: Visualization and Navigation

**Epic Description**: As a user, I need powerful visualization tools to understand and navigate complex ontology structures.

---

**US-011: Hierarchical Graph View**

```
As a Researcher
I want to see my ontology as an interactive graph
So that I can understand relationships visually

Acceptance Criteria:
- Given I have an ontology open
- When I switch to graph view
- Then I see classes as nodes and relationships as edges
- And I can pan and zoom smoothly
- And I can click nodes to select them

Story Points: 8
Priority: High
Dependencies: React Flow integration
```

---

**US-012: Automatic Layout**

```
As an Ontology Engineer
I want the graph to be automatically laid out
So that I don't have to manually position hundreds of nodes

Acceptance Criteria:
- Given I have a class hierarchy
- When I view it in graph mode
- Then nodes are automatically positioned using ELK algorithm
- And the layout minimizes edge crossings
- And I can re-layout at any time

Story Points: 5
Priority: High
Dependencies: US-011, ELK.js integration
```

---

**US-013: Incremental Loading for Large Ontologies**

```
As an Ontology Engineer
I want large ontologies to load incrementally
So that I can work with thousands of classes without performance issues

Acceptance Criteria:
- Given I import an ontology with 2,000+ classes
- When I view it in graph mode
- Then only visible nodes are rendered initially
- And children load when I expand nodes or scroll
- And performance remains smooth (30+ FPS)

Story Points: 8
Priority: High
Dependencies: US-011, US-012
```

---

**US-014: Search and Filter**

```
As a Researcher
I want to search for classes in the graph
So that I can quickly find specific concepts in large ontologies

Acceptance Criteria:
- Given I have an ontology with many classes
- When I press Ctrl+F and search for a term
- Then matching classes are highlighted
- And the graph pans to show the first result
- And I can navigate between results

Story Points: 5
Priority: Medium
Dependencies: US-011
```

---

**US-015: Node Context Menu**

```
As an Ontology Engineer
I want right-click menus on nodes
So that I can quickly perform actions without switching views

Acceptance Criteria:
- Given I right-click on a node
- When the context menu appears
- Then I see relevant actions (Edit, Delete, Add Child, etc.)
- And actions execute immediately
- And the graph updates reflect changes

Story Points: 3
Priority: Medium
Dependencies: US-011
```

---

### 4.4 Epic: AI-Assisted Development

**Epic Description**: As a user, I need AI assistance to speed up ontology development and leverage domain knowledge.

---

**US-016: Generate Ontology from Description**

```
As a Graduate Student
I want to generate an ontology structure from a text description
So that I can quickly scaffold my domain model

Acceptance Criteria:
- Given I open the AI assistant (⌘+K)
- When I describe my domain in natural language
- Then the AI generates relevant classes and properties
- And I can review suggestions before accepting
- And accepted elements are added to my ontology

Story Points: 13
Priority: High
Dependencies: LLM API integration, Vercel AI SDK
```

---

**US-017: Property Recommendations**

```
As a Researcher
I want AI to suggest appropriate properties for my classes
So that I can model relationships without deep OWL expertise

Acceptance Criteria:
- Given I have a class selected
- When I click "AI Suggest Properties"
- Then the AI recommends object and data properties
- And suggestions include domain, range, and descriptions
- And I can select which properties to create

Story Points: 8
Priority: High
Dependencies: US-016
```

---

**US-018: Axiom Generation from Natural Language**

```
As a Knowledge Engineer
I want to describe constraints in natural language
So that I can define complex axioms without knowing Manchester Syntax

Acceptance Criteria:
- Given I describe a constraint ("Every vegetarian pizza has no meat toppings")
- When I submit to AI
- Then the AI generates valid Manchester Syntax
- And I can review and edit before accepting
- And the generated axiom is syntactically correct

Story Points: 8
Priority: Medium
Dependencies: US-016, US-006
```

---

**US-019: Ontology Review and Suggestions**

```
As an Ontology Engineer
I want AI to review my ontology for improvements
So that I can identify design issues and inconsistencies

Acceptance Criteria:
- Given I have a complete ontology
- When I request AI review
- Then AI analyzes structure, naming, and patterns
- And AI provides actionable suggestions
- And I can apply suggestions selectively

Story Points: 13
Priority: Low
Dependencies: US-016
```

---

**US-020: API Key Management**

```
As a Researcher
I want to securely configure my AI API key
So that I can use AI features with my own account

Acceptance Criteria:
- Given I navigate to Settings
- When I enter my OpenAI/Anthropic API key
- Then the key is stored encrypted in browser storage
- And the key is never exposed in logs or errors
- And I can update or remove the key anytime

Story Points: 3
Priority: High
Dependencies: Browser Crypto API
```

---

### 4.5 Epic: Reasoning and Validation

**Epic Description**: As a user, I need reasoning capabilities to validate my ontology and discover implicit knowledge.

---

**US-021: Client-Side Consistency Check**

```
As an Ontology Engineer
I want to check ontology consistency in my browser
So that I can get immediate feedback without server dependency

Acceptance Criteria:
- Given I have an ontology with axioms
- When I click "Check Consistency"
- Then the reasoner runs in my browser (WASM)
- And results appear within 5 seconds for 500 classes
- And I see clear indication of consistent/inconsistent status

Story Points: 13
Priority: High
Dependencies: EYE-JS or OWL API WASM
```

---

**US-022: Visualize Inferred Relationships**

```
As a Researcher
I want to see inferred axioms in the graph
So that I can understand implicit knowledge in my ontology

Acceptance Criteria:
- Given I run the reasoner
- When inferred axioms are computed
- Then inferred edges appear as dashed lines in graph
- And I can distinguish them from asserted edges
- And I can hover to see inference explanation

Story Points: 8
Priority: High
Dependencies: US-021, US-011
```

---

**US-023: Inconsistency Explanation**

```
As a Graduate Student
I want detailed explanations when my ontology is inconsistent
So that I can understand and fix logical errors

Acceptance Criteria:
- Given my ontology has an inconsistency
- When I run consistency check
- Then I see which classes are unsatisfiable
- And I see the chain of axioms causing the contradiction
- And the explanation highlights the problematic axiom
- And I can navigate directly to fix it

Story Points: 13
Priority: High
Dependencies: US-021
```

---

**US-024: Server-Side Reasoning Option**

```
As an Ontology Engineer
I want to use powerful server-side reasoners
So that I can reason over large, complex ontologies

Acceptance Criteria:
- Given I have a large ontology (2,000+ classes)
- When I select server-side reasoning
- Then my ontology is sent to reasoning service
- And I receive results with inferred axioms
- And the process handles large ontologies that exceed browser limits

Story Points: 8
Priority: Medium
Dependencies: US-021, Backend API
```

---

**US-025: Classification and Hierarchy Computation**

```
As an Ontology Engineer
I want to automatically compute the complete class hierarchy
So that I can discover implied subclass relationships

Acceptance Criteria:
- Given I have defined classes with complex axioms
- When I run classification
- Then the reasoner infers all subClassOf relationships
- And the class tree updates to show inferred hierarchy
- And I can see which relationships are inferred vs. asserted

Story Points: 8
Priority: Medium
Dependencies: US-021, US-022
```

---

### 4.6 Epic: User Experience and Productivity

**Epic Description**: As a user, I need an intuitive, efficient interface that helps me be productive.

---

**US-026: Command Palette**

```
As an Ontology Engineer
I want a searchable command palette
So that I can quickly access any feature without remembering menus

Acceptance Criteria:
- Given I press ⌘/Ctrl+K
- When the command palette opens
- Then I can search for any command
- And I see recent commands at the top
- And I can execute commands directly from the palette

Story Points: 5
Priority: Medium
Dependencies: Shadcn Command component
```

---

**US-027: Keyboard Shortcuts**

```
As an Ontology Engineer
I want comprehensive keyboard shortcuts
So that I can work efficiently without using the mouse

Acceptance Criteria:
- Given I am working in the editor
- When I use shortcuts (Ctrl+S, Ctrl+N, Ctrl+F, etc.)
- Then the corresponding actions execute immediately
- And I can view all shortcuts via ⌘+? or Ctrl+?
- And shortcuts work consistently across all views

Story Points: 5
Priority: Medium
Dependencies: None
```

---

**US-028: Customizable Layout**

```
As a Researcher
I want to customize the panel layout
So that I can optimize my workspace for my workflow

Acceptance Criteria:
- Given I am in the main interface
- When I drag panel dividers
- Then panels resize smoothly
- And I can collapse/expand panels
- And my layout preferences are saved

Story Points: 5
Priority: Low
Dependencies: None
```

---

**US-029: Dark/Light Theme**

```
As a user
I want to choose between dark and light themes
So that I can work comfortably in different lighting conditions

Acceptance Criteria:
- Given I am using the application
- When I toggle theme in settings
- Then all UI components switch to the selected theme
- And my preference is saved
- And the theme respects system preference by default

Story Points: 3
Priority: Low
Dependencies: Tailwind CSS theming
```

---

**US-030: Undo/Redo**

```
As an Ontology Engineer
I want unlimited undo/redo
So that I can experiment freely and revert mistakes

Acceptance Criteria:
- Given I make changes to the ontology
- When I press Ctrl+Z (undo)
- Then the last change is reverted
- And Ctrl+Y (redo) restores the change
- And I can undo/redo through multiple operations

Story Points: 8
Priority: High
Dependencies: Immer for state management
```

---

## 5. User Journey Maps

### 5.1 Journey: First-Time User Creates Simple Ontology

**Persona**: Maria Rodriguez, PhD Student in Bioinformatics

**Goal**: Create a basic ontology for her thesis on protein interactions

**Current Knowledge**: 
- Has read about ontologies in papers
- No hands-on experience with Protege or other tools
- Understands her domain (biology) well

**Journey Stages**:

#### Stage 1: Discovery and Onboarding (5 minutes)
- **Actions**: Opens application URL, sees landing page
- **Thoughts**: "Is this the right tool? How do I start?"
- **Emotions**: Curious, slightly apprehensive
- **Pain Points**: Needs to understand if tool is appropriate
- **Opportunities**: 
  * Quick start tutorial
  * Example ontologies to explore
  * Clear "New Ontology" call-to-action

#### Stage 2: Creating First Ontology (10 minutes)
- **Actions**: 
  * Clicks "New Ontology"
  * Enters name "ProteinOntology"
  * Sees empty interface
  * Reads tooltips on panels
- **Thoughts**: "Where do I start? What's a class tree?"
- **Emotions**: Slightly overwhelmed, eager to learn
- **Pain Points**: Too many panels, unclear what each does
- **Opportunities**:
  * Guided tour highlighting key areas
  * Suggested first steps
  * "AI: Generate starting structure" button

#### Stage 3: Adding First Classes (15 minutes)
- **Actions**:
  * Right-clicks in class tree
  * Adds "Protein" class
  * Adds "Enzyme" as subclass
  * Sees classes appear in graph view
- **Thoughts**: "Oh! It's showing a diagram. That's helpful."
- **Emotions**: Satisfied, gaining confidence
- **Pain Points**: Unsure about naming conventions
- **Opportunities**:
  * Naming suggestions/validation
  * Visual feedback (checkmarks for good names)
  * Tips about OWL conventions

#### Stage 4: Defining Properties (20 minutes)
- **Actions**:
  * Clicks "Add Property"
  * Confused by Object vs Data property
  * Reads documentation
  * Creates "interactsWith" object property
  * Creates "hasMolecularWeight" data property
- **Thoughts**: "This is more complex than I thought"
- **Emotions**: Challenged but determined
- **Pain Points**: Terminology unfamiliar, lots to learn
- **Opportunities**:
  * Inline help/explanations
  * AI suggestions: "For Protein class, common properties are..."
  * Examples from similar ontologies

#### Stage 5: Using AI Assistant (10 minutes)
- **Actions**:
  * Discovers ⌘+K command palette (from tooltip)
  * Types "help me add properties"
  * AI suggests relevant properties
  * Accepts 3 suggestions
  * Sees properties added instantly
- **Thoughts**: "Wow, this is much easier!"
- **Emotions**: Excited, empowered
- **Pain Points**: Didn't discover AI feature earlier
- **Opportunities**:
  * Promote AI features more prominently
  * Auto-suggest AI help after user struggles

#### Stage 6: Validating and Saving (5 minutes)
- **Actions**:
  * Clicks "Check Consistency"
  * Sees green checkmark (consistent)
  * Exports to Turtle format
  * Saves file to thesis folder
- **Thoughts**: "I did it! I have a real ontology!"
- **Emotions**: Proud, accomplished
- **Pain Points**: None
- **Opportunities**:
  * Celebration moment (animation, encouraging message)
  * Suggest next steps (add more classes, try reasoning)

**Journey Insights**:
- **Total Time**: 65 minutes (acceptable for first-time user)
- **Key Success Factors**: 
  * Clear visual feedback
  * AI assistance discovery
  * Simple core workflow
- **Critical Improvements Needed**:
  * Better onboarding/tutorial
  * Earlier introduction to AI features
  * More inline help for terminology

---

### 5.2 Journey: Expert User Debugs Complex Ontology

**Persona**: Dr. Sarah Chen, Senior Ontology Engineer

**Goal**: Debug inconsistencies in a large medical ontology

**Current Knowledge**:
- 8 years experience with Protege
- Expert in OWL and description logics
- Familiar with HermiT, Pellet reasoners

**Journey Stages**:

#### Stage 1: Import and Assessment (3 minutes)
- **Actions**:
  * Drags .owl file into application
  * File imports (1,200 classes)
  * Opens graph view
  * Scans overall structure
- **Thoughts**: "Let's see what's broken"
- **Emotions**: Focused, professional
- **Pain Points**: None (smooth import)
- **Opportunities**: N/A - expert user, knows what to do

#### Stage 2: Initial Consistency Check (2 minutes)
- **Actions**:
  * Presses Ctrl+Shift+C (shortcut)
  * Reasoner runs (4 seconds)
  * Sees "15 unsatisfiable classes"
  * Reviews list
- **Thoughts**: "More than expected. Need to prioritize."
- **Emotions**: Analytical, slightly concerned
- **Pain Points**: Many issues to resolve
- **Opportunities**:
  * Group related issues
  * Prioritize by impact
  * Suggest root cause

#### Stage 3: Investigating First Issue (8 minutes)
- **Actions**:
  * Clicks on "CardiacArrest" (unsatisfiable)
  * Reviews explanation panel
  * Sees conflict chain
  * Identifies problematic disjointness axiom
  * Uses "Find all uses" to check impact
- **Thoughts**: "Ah, someone made Disease and Symptom disjoint, but CardiacArrest is both"
- **Emotions**: Problem-solving mode
- **Pain Points**: Complex explanation, need to trace through many axioms
- **Opportunities**:
  * Visual conflict diagram
  * Highlight root cause more clearly
  * Suggest which axiom to remove

#### Stage 4: Systematic Fixing (30 minutes)
- **Actions**:
  * Uses repair wizard for simple fixes
  * Manually edits complex conflicts
  * Re-runs consistency after each fix
  * Uses incremental reasoning (faster)
  * Sees unsatisfiable count decrease: 15→10→6→3→0
- **Thoughts**: "Making good progress"
- **Emotions**: Satisfied as issues resolve
- **Pain Points**: Some explanations incomplete
- **Opportunities**:
  * Better inference explanation
  * Track which fixes resolve multiple issues

#### Stage 5: Verification and Documentation (10 minutes)
- **Actions**:
  * Runs full classification
  * Reviews inferred hierarchy
  * Exports report of changes made
  * Commits to version control (external)
  * Exports corrected ontology
- **Thoughts**: "Clean ontology, ready for production"
- **Emotions**: Accomplished, relieved
- **Pain Points**: Manual version tracking
- **Opportunities**:
  * Built-in version control
  * Change summary generation
  * Automated documentation

**Journey Insights**:
- **Total Time**: 53 minutes (efficient for 15 issues)
- **Key Success Factors**:
  * Powerful reasoning explanation
  * Keyboard shortcuts
  * Incremental reasoning
- **Expert User Needs**:
  * Advanced features easily accessible
  * No hand-holding, direct control
  * Detailed, technical information
- **Improvements for Experts**:
  * Batch operations
  * Scriptable actions
  * Advanced query capabilities

---

## 6. Acceptance Criteria

### 6.1 Definition of Done

For a user story to be considered "done", it must meet ALL of the following criteria:

#### Functionality
- ✓ All acceptance criteria in the user story are met
- ✓ Feature works as described in all supported browsers
- ✓ No critical or high-priority bugs

#### Code Quality
- ✓ Code follows TypeScript best practices
- ✓ Type coverage ≥ 95%
- ✓ No linting errors or warnings
- ✓ Code reviewed and approved by at least one other developer

#### Testing
- ✓ Unit tests written with ≥ 80% coverage for new code
- ✓ Integration tests cover main user flows
- ✓ Manual testing completed and documented
- ✓ Accessibility tested (keyboard navigation, screen reader)

#### Documentation
- ✓ JSDoc comments for all public functions/components
- ✓ User-facing changes documented in user guide
- ✓ API changes documented if applicable

#### Performance
- ✓ Meets performance requirements specified in SRS
- ✓ No memory leaks detected
- ✓ Tested with realistic data volumes

#### Design
- ✓ UI matches design specifications
- ✓ Responsive behavior verified
- ✓ Consistent with overall design system

### 6.2 Story Point Estimates

**Story Point Scale**: Fibonacci sequence (1, 2, 3, 5, 8, 13, 21)

**Reference Stories**:
- **1 Point**: Add tooltip to existing button (1-2 hours)
- **2 Points**: Create simple modal dialog (half day)
- **3 Points**: Implement basic file export (1 day)
- **5 Points**: Build autocomplete functionality (2-3 days)
- **8 Points**: Develop graph visualization component (1 week)
- **13 Points**: Implement full reasoning engine integration (2 weeks)
- **21 Points**: Build complete AI assistant system (3-4 weeks)

**Factors Affecting Estimates**:
- Technical complexity
- Unknowns and research required
- Dependencies on external libraries
- Testing complexity
- Documentation requirements

### 6.3 Priority Definitions

**High Priority** (Must Have for MVP):
- Core functionality required for basic ontology editing
- Features that make the tool usable
- Critical performance requirements
- Example: Import/export, basic editing, class creation

**Medium Priority** (Should Have):
- Important features that enhance usability
- Advanced but commonly-used capabilities
- Nice-to-have improvements
- Example: AI assistance, advanced visualization, reasoning

**Low Priority** (Could Have):
- Nice-to-have enhancements
- Features for advanced users only
- Cosmetic improvements
- Example: Themes, advanced layout customization, batch operations

**Out of Scope** (Won't Have in v1.0):
- Features for future releases
- Requires significant additional infrastructure
- Example: Real-time collaboration, mobile apps, version control integration

---

## Appendix A: Traceability Matrix

This matrix maps user stories to functional requirements and use cases:

| User Story | Related Use Cases | Related FRs | Priority |
|------------|-------------------|-------------|----------|
| US-001 | UC-001 | FR-OM-001 | High |
| US-002 | UC-002 | FR-OM-002 | High |
| US-003 | UC-003 | FR-OM-003 | High |
| US-004 | - | FR-OM-004 | Medium |
| US-005 | - | FR-OM-005 | Medium |
| US-006 | UC-004 | FR-AE-001 | High |
| US-007 | UC-004 | FR-AE-003 | High |
| US-008 | UC-004 | FR-AE-004 | High |
| US-009 | UC-004 | FR-AE-005 | Medium |
| US-010 | - | FR-AE-006 | Low |
| US-011 | UC-006 | FR-VS-001 | High |
| US-012 | UC-006 | FR-VS-002 | High |
| US-013 | UC-006 | FR-VS-003 | High |
| US-014 | - | FR-VS-006 | Medium |
| US-015 | - | FR-VS-004 | Medium |
| US-016 | UC-008 | FR-AI-001, FR-AI-002 | High |
| US-017 | UC-009 | FR-AI-004 | High |
| US-018 | - | FR-AI-005 | Medium |
| US-019 | - | FR-AI-006 | Low |
| US-020 | - | FR-AI-007 | High |
| US-021 | UC-010 | FR-RE-001, FR-RE-003 | High |
| US-022 | UC-007 | FR-RE-004 | High |
| US-023 | UC-010 | FR-RE-006 | High |
| US-024 | - | FR-RE-002 | Medium |
| US-025 | UC-007 | FR-RE-004 | Medium |

---

## Appendix B: Glossary

See main SRS document Section 1.3 for comprehensive glossary.

---

**Document Approval**:

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | [Name] | __________ | ________ |
| UX Lead | [Name] | __________ | ________ |
| Development Lead | [Name] | __________ | ________ |
| QA Lead | [Name] | __________ | ________ |

---

*End of Use Cases and User Stories Document*
