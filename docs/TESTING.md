# Testing Documentation

## Overview

This project uses **logic-focused unit testing** with Jest and TypeScript. Tests concentrate on business logic, algorithms, and data transformations rather than UI rendering.

## Quick Start

```bash
# Run all tests
npm test

# Watch mode (auto-runs on changes)
npm run test:watch

# With coverage
npm run test:coverage

# CI mode
npm run test:ci
```

## Test Results

```
✅ Test Suites: 6 passed, 6 total
✅ Tests:       130 passed, 130 total
✅ Time:        ~1.3 seconds
```

## What We Test

### ✅ Business Logic
- Ontology reasoning algorithms (31 tests)
- Consistency checking
- Inference rules
- Validation logic

### ✅ Data Transformations
- JSON-LD, Turtle, OWL/XML serialization (43 tests)
- Data structure conversions
- Parsing logic

### ✅ State Management
- Context operations (23 tests)
- CRUD operations
- State immutability
- Hook logic (26 tests)

### ✅ Data Generation & Validation
- Sample data creation (50 tests)
- Structure validation
- Consistency checks

## Test Structure

```
lib/
  __tests__/
    utils.test.ts
  ontology/
    __tests__/
      reasoner.test.ts        # Reasoning logic
      context.test.tsx        # State management
      serializers.test.ts     # Data transformations
      sample-data.test.ts     # Data generation
hooks/
  __tests__/
    use-toast.test.ts         # Hook logic
```

## Writing Tests

### Basic Template

```typescript
import { functionToTest } from '../module'

describe('Module Name', () => {
  describe('functionToTest', () => {
    it('should handle basic case', () => {
      const result = functionToTest(input)
      expect(result).toBe(expected)
    })

    it('should handle edge cases', () => {
      expect(functionToTest(null)).toBeNull()
      expect(functionToTest([])).toEqual([])
    })
  })
})
```

### Mock Data Helpers

```typescript
const createMockOntology = (): Ontology => ({
  id: 'test-id',
  name: 'Test',
  classes: new Map(),
  properties: new Map(),
  individuals: new Map(),
  // ...
})
```

## Coverage

| Module | Coverage | Focus |
|--------|----------|-------|
| reasoner.ts | 99.31% | Algorithms ⚙️ |
| context.tsx | 98.22% | State 📊 |
| serializers.tsx | 95%+ | Transformations 🔄 |
| sample-data.ts | 100% | Generation 🏗️ |
| use-toast.ts | 98.95% | Hooks 🪝 |
| utils.ts | 100% | Utilities 🛠️ |

## Best Practices

✅ Test **behavior**, not implementation
✅ Use **AAA pattern** (Arrange, Act, Assert)
✅ Write **descriptive test names**
✅ Test **edge cases** (null, empty, large data)
✅ Keep tests **fast** and **isolated**
✅ Use **mock data helpers**

## Common Patterns

### Testing Algorithms

```typescript
describe('HermiTReasoner', () => {
  it('should detect circular dependencies', () => {
    const ontology = createOntologyWithCircularRefs()
    const reasoner = new HermiTReasoner(ontology)
    const result = reasoner.reason()

    expect(result.errors).toContainEqual(
      expect.objectContaining({ type: 'circular' })
    )
  })
})
```

### Testing Serialization

```typescript
describe('serializeToJSONLD', () => {
  it('should serialize classes correctly', () => {
    const ontology = createOntologyWithClasses()
    const json = serializeToJSONLD(ontology)
    const parsed = JSON.parse(json)

    expect(parsed['@graph']).toHaveLength(2)
    expect(parsed['@graph'][0]['@type']).toBe('owl:Class')
  })
})
```

### Testing State Management

```typescript
describe('OntologyContext', () => {
  it('should add class to ontology', () => {
    const { result } = renderHook(() => useOntology(), { wrapper })

    act(() => {
      result.current.addClass(newClass)
    })

    expect(result.current.ontology?.classes.has(newClass.id)).toBe(true)
  })
})
```

## CI/CD Integration

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm run test:ci

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Troubleshooting

**Issue**: Tests timeout
**Solution**: Increase timeout or use fake timers

**Issue**: "Cannot find module '@/...'"
**Solution**: Check jest.config.ts moduleNameMapper

**Issue**: "Not wrapped in act(...)"
**Solution**: Wrap state updates in `act()`

---

For more examples, see existing test files in `__tests__/` directories.
