# Axiom Editor

The Axiom Editor is ProtegeDesk's powerful code editing interface for defining ontology axioms using Manchester Syntax. Built on Monaco Editor (the same editor that powers VS Code), it provides syntax highlighting, intelligent autocomplete, and real-time validation.

## Overview

The Axiom Editor allows you to:

- Write Manchester Syntax axioms with syntax highlighting
- Get intelligent autocomplete suggestions based on your ontology
- Receive real-time validation with inline error messages
- Navigate to entity definitions with Ctrl+Click
- Apply quick fixes for common errors
- Experience sub-50ms latency for responsive editing

## Manchester Syntax Basics

Manchester Syntax is a human-readable syntax for OWL expressions. Here are the fundamentals:

### Class Expressions

```owl
ClassName                    # Atomic class
Thing, Nothing              # Top and bottom classes
C and D                     # Intersection
C or D                      # Union
not C                       # Complement
```

### Property Restrictions

```owl
P some C                    # Existential (∃P.C)
P only C                    # Universal (∀P.C)
P value Individual          # Value restriction
P Self                      # Self restriction
P min n C                   # Minimum cardinality
P max n C                   # Maximum cardinality
P exactly n C               # Exact cardinality
```

### Class Axioms

```owl
Class: Pizza
  SubClassOf: Food
  EquivalentTo: Dish and (hasBase some PizzaBase)
  DisjointWith: Pasta
```

### Property Axioms

```owl
ObjectProperty: hasTopping
  Domain: Pizza
  Range: Topping
  SubPropertyOf: hasIngredient
  Characteristics: Functional, Transitive
```

### Individual Assertions

```owl
Individual: Margherita
  Types: Pizza, VegetarianDish
  Facts: hasTopping Mozzarella, hasBase ThinCrust
```

See [Manchester Syntax Reference](Manchester-Syntax-Reference) for complete details.

## Features

### 1. Syntax Highlighting

The editor highlights different syntax elements with distinct colors:

- **Keywords**: `SubClassOf`, `and`, `or`, `not`, `some`, `only`, `min`, `max`
- **Class names**: Orange
- **Properties**: Blue
- **Data types**: Green
- **Strings and values**: Purple
- **Comments**: Gray

### 2. Intelligent Autocomplete

Press `Ctrl+Space` (or start typing) to trigger autocomplete. The editor suggests:

- **Classes** from your ontology
- **Properties** (object and data properties)
- **Individuals**
- **Keywords** appropriate for the current context
- **Datatypes** for data property ranges

**Example:**

```
1. Type: "Pizza SubClassOf"
2. Press Ctrl+Space
3. Editor suggests: Food, EdibleThing, Thing
4. Select "Food"
5. Type "and (hasTopping some"
6. Editor suggests: Topping, CheeseTopping, MeatTopping
```

Autocomplete is **context-aware**:
- After `SubClassOf:`, suggests only classes
- After `hasTopping some`, suggests classes in the property range
- After `hasAge value`, suggests numeric literals or data values

### 3. Real-Time Validation

The editor validates your axioms as you type:

**Syntax Errors** are marked with red squiggles:
- Missing parentheses
- Undefined entities
- Invalid keyword usage
- Type mismatches

**Warnings** are marked with yellow squiggles:
- Potentially circular definitions
- Unusual patterns
- Style recommendations

**Example Error:**

```owl
Pizza SubClassOf and (hasTopping some Cheese)
                 ^^^
Error: Expected class expression before 'and'
```

### 4. Quick Fixes

Hover over errors to see quick fix suggestions:

- **Add missing operand** - Inserts placeholder for missing expression
- **Import undefined entity** - Imports entity from another ontology
- **Fix typo** - Suggests correct spelling of entity names
- **Add missing parenthesis** - Closes unclosed parentheses

Apply a quick fix by clicking it or pressing `Ctrl+.`

### 5. Entity Navigation

Navigate to entity definitions:

- **Ctrl+Click** on any entity name to jump to its definition
- **F12** (Go to Definition) - Opens the entity in the properties panel
- **Shift+F12** (Find References) - Shows all uses of the entity
- **Alt+Left/Right** - Navigate backward/forward in history

### 6. Code Actions

Right-click in the editor for context menus:

- **Format Document** - Auto-format Manchester Syntax
- **Add to Ontology** - Insert axiom into ontology
- **Comment/Uncomment** - Toggle line comments
- **Find References** - Search for entity usage
- **Rename Symbol** - Refactor entity names

## Keyboard Shortcuts

| Action | Shortcut (Windows/Linux) | Shortcut (Mac) |
|--------|-------------------------|----------------|
| Autocomplete | `Ctrl+Space` | `Cmd+Space` |
| Go to Definition | `F12` | `F12` |
| Find References | `Shift+F12` | `Shift+F12` |
| Quick Fix | `Ctrl+.` | `Cmd+.` |
| Format Document | `Shift+Alt+F` | `Shift+Option+F` |
| Comment Line | `Ctrl+/` | `Cmd+/` |
| Multi-cursor | `Ctrl+Alt+Down/Up` | `Cmd+Option+Down/Up` |
| Find | `Ctrl+F` | `Cmd+F` |
| Replace | `Ctrl+H` | `Cmd+H` |

See [Keyboard Shortcuts](Keyboard-Shortcuts) for a complete list.

## Common Workflows

### Defining a New Class

1. Click on a class in the tree sidebar
2. Axiom editor opens for that class
3. Type: `SubClassOf: ParentClass`
4. Press Enter to add more axioms
5. Add restrictions: `SubClassOf: hasProperty some Value`
6. Click "Save" or press `Ctrl+S`

### Adding Property Restrictions

```owl
# Existential restriction (at least one)
Pizza SubClassOf hasTopping some CheeseTopping

# Universal restriction (only)
VegetarianPizza SubClassOf hasTopping only VegetarianTopping

# Cardinality restrictions
FourCheesePizza SubClassOf hasTopping exactly 4 CheeseTopping
```

### Defining Equivalent Classes

```owl
VegetarianPizza EquivalentTo
  Pizza and (hasTopping only VegetarianTopping)
```

### Creating Disjoint Classes

```owl
Class: MeatPizza
  DisjointWith: VegetarianPizza, VeganPizza
```

### Adding Property Characteristics

```owl
ObjectProperty: hasParent
  Characteristics: Functional, Transitive, Asymmetric

ObjectProperty: hasPart
  Characteristics: Reflexive, Transitive
```

## Advanced Features

### Multi-line Axioms

Format complex axioms across multiple lines for readability:

```owl
Class: ComplexPizza
  SubClassOf:
    Pizza
    and (hasBase some ThinCrust)
    and (hasTopping some MozzarellaCheese)
    and (hasTopping some TomatoSauce)
    and (hasTopping min 3 Topping)
```

### Comments

Add comments to document your ontology:

```owl
# This defines a vegetarian pizza
# It can only have vegetarian toppings
Class: VegetarianPizza
  SubClassOf: Pizza and (hasTopping only VegetarianTopping)
```

### Nested Expressions

Build complex nested class expressions:

```owl
(Pizza and (hasTopping some CheeseTopping))
  or (Pasta and (hasSauce some CheeseSauce))
```

## Performance Tips

The editor is optimized for responsiveness:

- **Latency**: < 50ms from keystroke to screen update
- **Large files**: Handles ontologies with 10,000+ axioms
- **Autocomplete**: Indexes all entities for instant suggestions
- **Validation**: Incremental parsing for real-time feedback

## Troubleshooting

### Autocomplete Not Working

1. Check that you've pressed `Ctrl+Space`
2. Ensure cursor is in a valid position for suggestions
3. Verify ontology has entities to suggest
4. Try reloading the ontology

### Syntax Errors Not Showing

1. Ensure real-time validation is enabled in settings
2. Check that the axiom is complete (not mid-typing)
3. Look for red squiggles under errors
4. Hover over squiggles to see error messages

### Slow Performance

1. Large ontologies (>10,000 axioms) may have slight delays
2. Close other browser tabs to free memory
3. Use server-side reasoning for complex ontologies
4. Consider splitting very large ontologies into modules

## Next Steps

- Learn more about [Manchester Syntax](Manchester-Syntax-Reference)
- Explore [Graph Visualization](Graph-Visualization) for visual ontology exploration
- Try [AI Co-Pilot](AI-Co-Pilot) for assisted ontology generation
- Understand [OWL2 Concepts](OWL2-Concepts) for ontology fundamentals

---

**Related Pages:**
- [Manchester Syntax Reference](Manchester-Syntax-Reference)
- [Working with Axioms](Working-with-Axioms)
- [Keyboard Shortcuts](Keyboard-Shortcuts)
- [FAQ](FAQ)
