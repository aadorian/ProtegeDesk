# Contributing to ProtegeDesk

Thank you for your interest in contributing to ProtegeDesk! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Welcome](#welcome)
- [File Map](#file-map)
- [Your First PR](#your-first-pr)
- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Good First Issues](#good-first-issues)
- [Issue Guidelines](#issue-guidelines)

---

## Welcome

ProtegeDesk is a next-generation, web-based ontology engineering platform built with Next.js, React, TypeScript, and Tailwind CSS. Whether you are fixing a typo, adding a test, or building a new feature, we are glad to have you.

If you have never contributed to an open-source project before, start with the **[Your First PR](#your-first-pr)** section below. It walks you through every step, from forking the repo to opening a pull request.

---

## File Map

Understanding where things live makes contributing much easier. Below is a map of the key directories and files in this repository.

### Top-level layout

```
ProtegeDesk/
├── app/                     # Next.js App Router pages and layout
│   ├── layout.tsx           # Root layout (providers, theme, fonts)
│   ├── page.tsx             # Home page (entry point)
│   └── globals.css          # Global CSS / Tailwind base styles
├── components/              # React components
│   ├── ontology/            # Domain-specific UI for the ontology editor
│   └── ui/                  # Shadcn/ui primitive components (Button, Dialog, etc.)
├── lib/                     # Non-UI logic and domain code
│   ├── ontology/            # Core ontology engine (reasoner, serializers, search, etc.)
│   ├── constants.ts         # Shared constants (no magic numbers elsewhere)
│   ├── graph-utils.ts       # Graph layout helpers
│   └── utils.ts             # General-purpose utilities (cn helper, etc.)
├── hooks/                   # Shared custom React hooks
│   ├── copy-to-clipboard.ts
│   └── use-toast.ts
├── __tests__/               # Integration / fixture tests (e.g. sample OWL files)
├── docs/                    # Project documentation
│   ├── SRS.md               # Software Requirements Specification
│   ├── ROADMAP.md           # Feature roadmap
│   ├── TESTING.md           # Testing strategy details
│   ├── ENVIRONMENT.md       # Environment configuration
│   └── SECURITY.md          # Security policy
├── wiki/                    # GitHub wiki source files
├── styles/                  # Additional global CSS
├── public/                  # Static assets (icons, sample ontologies, logos)
├── jest.config.ts           # Jest configuration
├── eslint.config.mjs        # ESLint flat config
├── .prettierrc              # Prettier formatting rules
├── tsconfig.json            # TypeScript configuration
├── next.config.mjs          # Next.js configuration
└── package.json             # Dependencies and scripts
```

### Key directories in detail

| Directory | What goes here | Example files |
|---|---|---|
| `app/` | Next.js App Router entry points and layouts. Keep this thin — logic lives in `lib/` and `components/`. | `layout.tsx`, `page.tsx` |
| `components/ontology/` | All ontology-editor-specific UI components. Each file is one concern (class tree, graph view, property details, etc.). | `class-tree.tsx`, `graph-view.tsx`, `reasoner-dialog.tsx` |
| `components/ui/` | Auto-generated Shadcn/ui primitives. **Do not edit these by hand** — re-generate with the Shadcn CLI if you need changes. | `button.tsx`, `dialog.tsx`, `tabs.tsx` |
| `lib/ontology/` | Core domain logic with no UI dependencies: reasoner, serializers, search, SPARQL, validation, sample-data generation. | `reasoner.ts`, `serializers.tsx`, `search.ts` |
| `lib/ontology/__tests__/` | Unit tests for the ontology engine. | `reasoner.test.ts`, `serializers.test.ts` |
| `components/ontology/__tests__/` | Component tests for ontology UI. | `header.test.tsx`, `new-entity-dialog.test.tsx` |
| `hooks/` | Reusable React hooks shared across components. | `copy-to-clipboard.ts`, `use-toast.ts` |
| `__tests__/` | Test fixtures (e.g. `.owl` sample files). | `pizza.owl`, `pizza-with-individuals.owl` |
| `public/` | Static assets served as-is. | `sample-ontology.owl`, icons |
| `docs/` | Long-form documentation. | `SRS.md`, `ROADMAP.md`, `TESTING.md` |

---

## Your First PR

This section is a step-by-step walkthrough for making your first pull request to ProtegeDesk. No prior experience with the codebase is assumed.

### 1. Fork the repository

1. Go to [https://github.com/aadorian/ProtegeDesk](https://github.com/aadorian/ProtegeDesk)
2. Click the **Fork** button in the top-right corner
3. Create the fork under your own GitHub account

### 2. Clone your fork locally

```bash
git clone https://github.com/YOUR_USERNAME/ProtegeDesk.git
cd ProtegeDesk

# Add the upstream remote so you can keep your fork in sync
git remote add upstream https://github.com/aadorian/ProtegeDesk.git
```

### 3. Install dependencies

```bash
npm ci
```

> Use `npm ci` (not `npm install`) for a clean, reproducible install from the lockfile.

### 4. Create a branch

Use the branch prefixes described in [Commit Messages](#commit-messages) below:

```bash
git checkout -b docs/your-topic          # for documentation changes
git checkout -b fix/short-description     # for bug fixes
git checkout -b feature/short-description # for new features
```

### 5. Make your changes

- Edit the relevant files (see the [File Map](#file-map) above if you are unsure where to look).
- Follow the [Code Style](#code-style) guidelines.
- Add or update tests if your change affects logic or UI behavior.

### 6. Run the checks

Before committing, always run the full validation suite:

```bash
npm run validate
```

This single command runs **all** of the following:

| Check | What it does |
|---|---|
| `npm run type-check` | TypeScript strict type checking (`tsc --noEmit`) |
| `npm run lint` | ESLint with React, hooks, a11y, and import rules |
| `npm run format:check` | Prettier formatting verification |
| `npm test` | Jest unit and component tests |

If any check fails, fix the issue before proceeding. Common fixes:

```bash
npm run lint:fix    # auto-fix most ESLint issues
npm run format      # auto-format code with Prettier
```

### 7. Commit your changes

We use [Conventional Commits](https://www.conventionalcommits.org/). See [Commit Messages](#commit-messages) for the full convention. Example:

```bash
git add .
git commit -m "docs: add first-PR walkthrough to CONTRIBUTING.md"
```

### 8. Push and open a Pull Request

```bash
git push origin docs/your-topic
```

1. Go to your fork on GitHub — you will see a **"Compare & pull request"** prompt.
2. Click it, fill in the PR template, and link the related issue (e.g. `Closes #221`).
3. Wait for CI checks to pass and a maintainer to review.

### 9. Keep your fork up to date

While waiting for review, or before starting new work:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for everyone, regardless of:

- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, education, socio-economic status
- Nationality, personal appearance, race, religion
- Sexual identity and orientation

### Our Standards

**Positive behaviors**:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards others

**Unacceptable behaviors**:

- Harassment, trolling, or derogatory comments
- Publishing others' private information
- Spam or excessive self-promotion
- Other conduct inappropriate in a professional setting

### Enforcement

Violations can be reported to [conduct@example.com]. All complaints will be reviewed and investigated.

---

## Development Setup

### Prerequisites

- **Node.js** 18+ and npm 9+
- **Git** for version control
- **Code Editor** (VS Code recommended)
- **Modern Browser** for testing

### Quick start

```bash
git clone https://github.com/YOUR_USERNAME/ProtegeDesk.git
cd ProtegeDesk
npm ci
npm run dev          # http://localhost:3000
```

### Verify everything works

```bash
npm run validate
```

---

## Code Style

### TypeScript

- **Always use TypeScript** — no plain `.js` or `.jsx` files.
- **Strict mode** is enabled in `tsconfig.json`; respect it.
- **Avoid `any`** — use `unknown` if the type is genuinely unknown.
- **Use `interface`** for object shapes, `type` for unions and primitives.
- **No `I` prefix** on interfaces (e.g. `OntologyClass`, not `IOntologyClass`).

### React

- **Functional components with hooks** only — no class components.
- **Define a props type** above every component.
- **Destructure props** in the function parameter.
- **Use `React.memo`** for expensive render components.
- **Put reusable logic** in `hooks/` or `lib/`.

### Naming

| Kind | Convention | Example |
|---|---|---|
| Component files | `PascalCase.tsx` | `class-tree.tsx` (kebab is also used in this repo) |
| Utility / hook files | `camelCase.ts` | `graph-utils.ts`, `use-toast.ts` |
| Components | `PascalCase` | `ClassTreeNode` |
| Functions | `camelCase` | `selectClass` |
| Constants | `UPPER_SNAKE_CASE` | `TREE_INDENT_PX` |
| Types / Interfaces | `PascalCase` | `OntologyContextType` |

### Formatting

We use **ESLint 9** (flat config) and **Prettier**. Key rules from `.prettierrc`:

- **No semicolons** (`"semi": false`)
- **Single quotes** for JS/TS strings
- **2-space** indentation
- **Trailing commas** (ES5)
- **Max line width**: 100 characters
- **Arrow parens**: avoid (`x => x`, not `(x) => x`)

Run the formatters:

```bash
npm run format      # auto-format
npm run lint:fix    # auto-fix lint issues
npm run validate    # run all checks
```

### Constants

All numeric or string constants must live in `lib/constants.ts`. ESLint will warn on "magic numbers" found outside that file.

---

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Code restructuring without behavior change |
| `test` | Adding or updating tests |
| `chore` | Build, tooling, or maintenance |

### Examples

```bash
feat(editor): add autocomplete for object properties

- Implement completion provider
- Add fuzzy matching
- Include documentation on hover

Closes #123
```

```bash
fix(graph): prevent infinite loop in layout algorithm

The ELK layout would hang on circular dependencies.
Added cycle detection before layout.

Fixes #456
```

### Branch prefixes

Use the same type as a prefix for your branch name:

- `feature/short-description`
- `fix/short-description`
- `docs/short-description`
- `refactor/short-description`
- `test/short-description`

---

## Testing Guidelines

We use **Jest** with **React Testing Library** and **ts-jest**. All new features and bug fixes must include tests.

### Running tests

```bash
npm test              # run all tests
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
npm run test:ci       # CI-optimized run
```

### Where to put tests

| Code under test | Test location |
|---|---|
| `lib/ontology/*.ts` | `lib/ontology/__tests__/*.test.ts` |
| `components/ontology/*.tsx` | `components/ontology/__tests__/*.test.tsx` |
| `lib/utils.ts`, `hooks/*` | `lib/__tests__/*.test.ts` |
| Fixtures (`.owl` files) | `__tests__/` |

### Writing a test

```typescript
// lib/ontology/__tests__/my-module.test.ts
import { myFunction } from '../my-module'

describe('myFunction', () => {
  it('should handle normal input', () => {
    expect(myFunction('input')).toBe('expected')
  })
})
```

---

## Pull Request Process

### Before submitting

1. **Run `npm run validate`** — all checks must pass.
2. **Add or update tests** for any changed logic or UI.
3. **Update documentation** if your change affects user-facing behavior.

### Submitting a PR

1. Push your branch to your fork.
2. Open a Pull Request against the `main` branch of `aadorian/ProtegeDesk`.
3. Fill out the PR template completely.
4. Link the related issue using `Closes #<number>` or `Fixes #<number>`.
5. Request review from a maintainer if appropriate.

### Review process

1. **Automated CI checks** must pass.
2. **At least one maintainer** reviews and approves.
3. Address any requested changes.
4. Maintainer merges the PR.

### After merge

1. Delete your branch (GitHub will prompt you).
2. Sync your fork:

```bash
git checkout main
git pull upstream main
git push origin main
```

---

## Good First Issues

Looking for a place to start? These open issues are great for first-time contributors:

| Issue | Title |
|---|---|
| [#221](https://github.com/aadorian/ProtegeDesk/issues/221) | Add CONTRIBUTING first-PR walkthrough with file map |
| [#220](https://github.com/aadorian/ProtegeDesk/issues/220) | Add aria-live region for reasoner and import status messages |
| [#219](https://github.com/aadorian/ProtegeDesk/issues/219) | Add component tests for CollapsibleCard |
| [#218](https://github.com/aadorian/ProtegeDesk/issues/218) | Add component tests for ReasonerDialog |
| [#212](https://github.com/aadorian/ProtegeDesk/issues/212) | Add component tests for ImportExportDialog |

You can also browse the full list with the [`good-first-issue`](https://github.com/aadorian/ProtegeDesk/issues?q=is%3Aissue+state%3Aopen+label%3Agood-first-issue) and [`help-wanted`](https://github.com/aadorian/ProtegeDesk/issues?q=is%3Aissue+state%3Aopen+label%3Ahelp-wanted) labels.

---

## Issue Guidelines

### Before creating an issue

1. **Search existing issues** to avoid duplicates.
2. **Check the documentation** in `docs/` and the wiki — the answer may already exist.
3. **Verify you are on the latest version** of the `main` branch.

### Bug reports

Use the [bug report template](https://github.com/aadorian/ProtegeDesk/issues/new?template=bug_report.md). Include:

- Clear description of the bug
- Steps to reproduce
- Expected behavior vs. actual behavior
- Screenshots (if applicable)
- Browser and OS
- Console errors

### Feature requests

Use the [feature request template](https://github.com/aadorian/ProtegeDesk/issues/new?template=feature_request.md). Include:

- Clear description of the feature
- Use case / motivation
- Proposed solution
- Alternatives considered

---

Thank you for contributing to ProtegeDesk!
