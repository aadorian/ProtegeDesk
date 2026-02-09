# Frequently Asked Questions (FAQ)

## General Questions

### 1\. What is Modern Ontology Editor (ProtegeDesk)?

## 

It is a next-generation, web-based platform for ontology engineering. It combines traditional tools like Manchester Syntax editing with modern features like AI-powered assistance and hierarchical visualization.

### 2\. Is this project open source?

## 

Yes, the project is licensed under the **MIT License**.

### 3\. How can I contribute to the project?

## 

We welcome contributions! Please refer to our [CONTRIBUTING.md](https://www.google.com/search?q=./CONTRIBUTING.md) for guidelines on code standards, pull requests, and our development workflow.

### 4\. Where can I report a bug?

## 

You can report bugs using our [Bug Report Template](https://www.google.com/search?q=./.github/ISSUE_TEMPLATE/bug_report.md) in the GitHub Issues tab. Please include steps to reproduce the behavior and your environment details.

### 5\. How do I suggest a new feature?

## 

Use the [Feature Request Template](https://www.google.com/search?q=./.github/ISSUE_TEMPLATE/feature_request.md) to describe the problem you're solving and your proposed solution.

* * *

## Technical & Development

### 6\. What is the tech stack used?

## 

The project is built with **TypeScript (5.0+)**, **React (18+)**, and uses **Shadcn/ui** for components.

### 7\. What version of Node.js is required?

## 

While not explicitly pinned in the summary, the project uses modern TypeScript/Vite patterns; generally, **Node.js 18+** or **20+ (LTS)** is recommended for the development environment.

### 8\. How do I start the local development server?

## 

Run the following commands in your terminal:

```Bash
    npm install
    npm run dev
```   

### 9\. How do I run a production build?

## 

To verify the build and type-checking, use:

```Bash
    npm run build
```    

### 10\. Which VS Code extensions are recommended?

## 

The project recommends:

*   ESLint
    
*   Prettier
    
*   Tailwind CSS IntelliSense
    
*   Code Spell Checker
    
*   GitLens
    

### 11\. How do I enable debug logging?

## 

You can enable debug logging by setting the debug key in your browser's local storage:

```JavaScript
    localStorage.setItem('debug', 'moe:*')
```    

* * *

## Features & Usage

### 12\. What ontology formats are supported?

## 

The editor supports **Turtle, RDF/XML, OWL/XML, and N-Triples**. It uses the **N3.js** library for RDF parsing.

### 13\. What is "Manchester Syntax"?

## 

It is a user-friendly syntax for writing OWL ontologies. Our Advanced Axiom Editor uses **Monaco Editor** (the engine behind VS Code) to provide a high-quality editing experience for this syntax.

### 14\. How does the AI assistance work?

## 

The AI helps with:

*   Generating ontologies from natural language.
    
*   Recommending smart properties based on class context.
    
*   Generating axioms from plain English constraints.
    

### 15\. Does reasoning happen on a server?

## 

No. The project utilizes **Client-Side Reasoning** via **WebAssembly** for instant feedback and inconsistency detection without needing a backend round-trip.

### 16\. How is the ontology visualized?

## 

We use **React Flow** for hierarchical visualization, allowing for automatic layouts and incremental loading of large ontologies.

* * *

## Troubleshooting

### 17\. Why does my Windows clone fail?

## 

Some older versions of git on Windows or specific file systems may struggle with illegal characters in filenames (Issue #174). Ensure you are using a modern Git client and cloning into a standard NTFS partition.

### 18\. Why am I seeing `console.log` errors in production?

## 

Recent cleanup efforts (Issue #174) have focused on removing `console.log` statements from production components. If you find leaked logs, please report them as a bug.

### 19\. How do I fix "Manchester Syntax" errors?

## 

The editor provides **Real-time Validation**. Check the red squiggles in the Axiom Editor for syntax error explanations, similar to how errors appear in VS Code.

### 20\. My build is failing with TypeScript errors. What should I do?

## 

The project enforces strict TypeScript standards. Ensure you have run `npm install` to get the latest types and that your changes follow the interfaces defined in the `src/types/` directory.

* * *

## Additional Resources

## 

*   **Architecture Overview**: Found in [CONTRIBUTING.md](https://www.google.com/search?q=./CONTRIBUTING.md).
    
*   **Project Vision**: Detailed in the root [README.md](https://www.google.com/search?q=./README.md).
    
*   **Community**: Join our Discord/Slack (links available in the README).