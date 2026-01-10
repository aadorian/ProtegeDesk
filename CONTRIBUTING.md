# Contributing to Modern Ontology Editor

Thank you for your interest in contributing to Modern Ontology Editor! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Community](#community)

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

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm 9+
- **Git** for version control
- **Code Editor** (VS Code recommended)
- **Modern Browser** for testing

### First-Time Contributors

Looking for a good first issue? Check out:

- [good-first-issue](https://github.com/aadorian/ProtegeDesk/issues?q=is%3Aissue%20state%3Aopen%20label%3Agood-first-issue) label
- [help-wanted](https://github.com/aadorian/ProtegeDesk/issues?q=is%3Aissue%20state%3Aopen%20label%3Ahelp-wanted) label

---

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork

git clone https://github.com/YOUR_USERNAME/modern-ontology-editor.git
cd modern-ontology-editor

# Add upstream remote
git remote add upstream https://github.com/original/modern-ontology-editor.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration
# For AI features, add your API keys:
# OPENAI_API_KEY=your_key_here
# ANTHROPIC_API_KEY=your_key_here
```

### 4. Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

### 5. Verify Setup

```bash
# Run all checks
npm run validate

# This runs:
# - TypeScript type checking
# - ESLint
# - Tests
```

---

## Development Workflow

### Branch Strategy

We use a simplified Git Flow:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring

### Creating a Feature Branch

```bash
# Update your fork
git checkout develop
git pull upstream develop

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, commit, push
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:

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

### Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge into your branch
git checkout develop
git merge upstream/develop

# Update your fork on GitHub
git push origin develop
```

---

## Coding Standards

### TypeScript

- **Always use TypeScript** - No plain JavaScript files
- **Strict mode enabled** - Follow tsconfig.json settings
- **Type everything** - Avoid `any`, use `unknown` if needed
- **Use interfaces** for object shapes
- **Use types** for unions and primitives

**Good**:

```typescript
interface OntologyClass {
  id: string
  label: string
  parent?: string
  annotations: Record<string, string>
}

function createClass(data: OntologyClass): void {
  // Implementation
}
```

**Bad**:

```typescript
function createClass(data: any) {
  // ❌ No any
  // Implementation
}
```

### React

- **Functional components** with hooks
- **Props interfaces** always defined
- **Destructure props** in parameter list
- **Use React.memo** for expensive components
- **Custom hooks** for reusable logic

**Good**:

```typescript
interface ClassNodeProps {
  id: string;
  label: string;
  onSelect: (id: string) => void;
}

const ClassNode: React.FC<ClassNodeProps> = ({
  id,
  label,
  onSelect
}) => {
  const handleClick = useCallback(() => {
    onSelect(id);
  }, [id, onSelect]);

  return (
    <div onClick={handleClick}>
      {label}
    </div>
  );
};

export default React.memo(ClassNode);
```

### File Organization

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   └── (routes)/          # Page routes
├── components/            # React components
│   ├── ui/               # Base UI components (Shadcn)
│   ├── Editor/           # Editor-specific components
│   ├── Graph/            # Graph visualization components
│   └── ...
├── lib/                   # Library code
│   ├── ontology/         # Ontology domain logic
│   └── utils/            # Utility functions
├── services/              # External service integrations
│   ├── ai/               # AI service
│   ├── parser/           # Parsing service
│   └── reasoning/        # Reasoning service
├── hooks/                 # Custom React hooks
├── stores/                # Zustand stores
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

### Naming Conventions

- **Files**: `PascalCase.tsx` for components, `camelCase.ts` for utilities
- **Components**: `PascalCase`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Interfaces**: `PascalCase` (no `I` prefix)
- **Types**: `PascalCase` (often with `Type` suffix)

### Code Style

We use **ESLint** and **Prettier**:

```bash
# Format code
npm run format

# Lint code
npm run lint

# Auto-fix issues
npm run lint:fix
```

**Key rules**:

- **2 spaces** for indentation
- **Single quotes** for strings
- **Semicolons** required
- **Trailing commas** in multiline
- **Max line length**: 100 characters
- **Constants in one file**: No magic numbers outside of lib/constants.ts

---

## Testing Guidelines

### Test Requirements

All new features and bug fixes must include tests:

- **Unit tests** for utilities and services
- **Component tests** for React components
- **Integration tests** for workflows
- **E2E tests** for critical user journeys

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test ClassNode.test.tsx

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### Writing Unit Tests

```typescript
// src/lib/ontology/OWLClass.test.ts
import { describe, it, expect } from 'vitest'
import { OWLClass } from './OWLClass'

describe('OWLClass', () => {
  it('should create a class with valid IRI', () => {
    const cls = new OWLClass('http://example.org#Person')
    expect(cls.iri).toBe('http://example.org#Person')
  })

  it('should extract label from IRI', () => {
    const cls = new OWLClass('http://example.org#Person')
    expect(cls.getLabel()).toBe('Person')
  })

  it('should throw error for invalid IRI', () => {
    expect(() => new OWLClass('invalid')).toThrow()
  })
})
```

### Writing Component Tests

```typescript
// src/components/ClassNode/ClassNode.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ClassNode from './ClassNode';

describe('ClassNode', () => {
  it('renders class label', () => {
    render(
      <ClassNode
        id="1"
        label="Person"
        onSelect={() => {}}
      />
    );
    expect(screen.getByText('Person')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const handleSelect = vi.fn();
    render(
      <ClassNode
        id="1"
        label="Person"
        onSelect={handleSelect}
      />
    );

    fireEvent.click(screen.getByText('Person'));
    expect(handleSelect).toHaveBeenCalledWith('1');
  });
});
```

### Writing E2E Tests

```typescript
// tests/e2e/ontology-creation.spec.ts
import { test, expect } from '@playwright/test'

test('user can create a new ontology', async ({ page }) => {
  await page.goto('http://localhost:3000')

  // Click New Ontology
  await page.click('text=New Ontology')

  // Fill in form
  await page.fill('input[name="name"]', 'TestOntology')
  await page.fill('input[name="iri"]', 'http://test.org/ontology#')

  // Submit
  await page.click('text=Create')

  // Verify ontology created
  await expect(page.locator('text=TestOntology')).toBeVisible()
})
```

---

## Pull Request Process

### Before Submitting

1. **Update your branch** with latest develop
2. **Run all tests** - `npm test`
3. **Run linting** - `npm run lint`
4. **Run type checking** - `npm run type-check`
5. **Update documentation** if needed
6. **Add tests** for new features

### Submitting PR

1. **Push your branch** to your fork
2. **Open Pull Request** on GitHub
3. **Fill out PR template** completely
4. **Link related issues** using keywords (Closes #123)
5. **Request review** from maintainers

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues

Closes #123

## Testing

- [ ] Added unit tests
- [ ] Added integration tests
- [ ] Manual testing completed

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally
```

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by at least one maintainer
3. **Changes requested** - address feedback
4. **Approval** - maintainer approves PR
5. **Merge** - maintainer merges to develop

### After Merge

1. **Delete your branch** (GitHub will prompt)
2. **Update your fork**:

```bash
git checkout develop
git pull upstream develop
git push origin develop
```

---

## Issue Guidelines

### Before Creating an Issue

1. **Search existing issues** - avoid duplicates
2. **Check documentation** - may already be answered
3. **Verify version** - ensure you're using latest

### Bug Reports

Use the [bug report template](https://github.com/yourusername/modern-ontology-editor/issues/new?template=bug_report.md)

**Include**:

- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser and OS
- Console errors

### Feature Requests

Use the [feature request template](https://github.com/yourusername/modern-ontology-editor/issues/new?template=feature_request.md)

**Include**:

- Clear description of feature
- Use case / motivation
- Proposed solution
- Alternatives considered
- Additional context

### Questions

For questions, use:

- [GitHub Discussions](https://github.com/yourusername/modern-ontology-editor/discussions)
- [Discord/Slack](link) for real-time chat
- Stack Overflow with tag `modern-ontology-editor`

---

## Community

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: Questions, ideas, show & tell
- **Discord/Slack**: Real-time chat with community
- **Twitter**: [@ontology_editor](https://twitter.com/ontology_editor)

### Getting Help

- **Documentation**: Start with [docs/](docs/)
- **FAQ**: Check [docs/faq.md](docs/faq.md)
- **Discussions**: Ask in GitHub Discussions
- **Chat**: Join Discord/Slack for quick questions

### Recognition

Contributors are recognized in:

- [CONTRIBUTORS.md](CONTRIBUTORS.md) file
- Release notes for significant contributions
- Annual contributor highlights

---

## Development Tips

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "streetsidesoftware.code-spell-checker",
    "eamodio.gitlens",
    "ms-playwright.playwright"
  ]
}
```

### Debugging

```typescript
// Enable debug logging
localStorage.setItem('debug', 'moe:*')

// In code
import debug from 'debug'
const log = debug('moe:component:ClassTree')
log('Rendering tree with %d nodes', nodeCount)
```

### Performance Profiling

```typescript
// React DevTools Profiler
import { Profiler } from 'react';

<Profiler id="ClassTree" onRender={logRenderTime}>
  <ClassTree />
</Profiler>
```

---

## Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Release Checklist

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release branch: `release/v1.0.0`
4. Final testing
5. Merge to `main`
6. Tag release: `git tag v1.0.0`
7. Push tags: `git push --tags`
8. GitHub Actions builds and deploys
9. Publish release notes
10. Merge back to `develop`

---

## Questions?

If you have questions about contributing, please:

1. Check this guide
2. Read the [documentation](docs/)
3. Ask in [GitHub Discussions](https://github.com/yourusername/modern-ontology-editor/discussions)
4. Join our [Discord/Slack](link)

---

**Thank you for contributing to Modern Ontology Editor! 🎉**
