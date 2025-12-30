# ProtegeDesk Wiki Pages

This directory contains the wiki pages for ProtegeDesk. These markdown files are designed to be published to the GitHub Wiki.

## Publishing to GitHub Wiki

To publish these pages to the GitHub Wiki:

### Method 1: Clone and Push to Wiki Repository

```bash
# Clone the wiki repository
git clone https://github.com/aadorian/ProtegeDesk.wiki.git

# Copy wiki files
cp wiki/*.md ProtegeDesk.wiki/

# Navigate to wiki directory
cd ProtegeDesk.wiki

# Add and commit
git add .
git commit -m "Add comprehensive wiki documentation from SRS"

# Push to wiki
git push origin master
```

### Method 2: Manual Upload via GitHub UI

1. Go to https://github.com/aadorian/ProtegeDesk/wiki
2. Click "New Page" for each wiki page
3. Copy and paste the content from the corresponding `.md` file
4. Save each page

## Wiki Structure

The wiki is organized as follows:

### Main Pages

- **Home.md** - Wiki home page with navigation
- **Introduction.md** - Overview and key capabilities
- **Quick-Start-Guide.md** - Getting started tutorial
- **Installation.md** - Setup and configuration

### Feature Documentation

- **Axiom-Editor.md** - Manchester Syntax editor guide
- **Graph-Visualization.md** - Visual ontology exploration
- **AI-Co-Pilot.md** - AI-assisted development
- **Reasoning-Engine.md** - Reasoning capabilities

### User Guides

- **Creating-Ontologies.md** - Building ontologies from scratch
- **Import-Export.md** - Working with ontology files
- **Managing-Classes.md** - Class hierarchy management
- **Working-with-Axioms.md** - Defining complex expressions
- **Keyboard-Shortcuts.md** - Productivity shortcuts

### Developer Documentation

- **Architecture.md** - System design
- **Technology-Stack.md** - Libraries and frameworks
- **API-Reference.md** - Public APIs
- **Contributing.md** - Contribution guidelines
- **Development-Setup.md** - Dev environment setup

### Reference

- **Manchester-Syntax-Reference.md** - Complete syntax guide
- **OWL2-Concepts.md** - Ontology fundamentals
- **Glossary.md** - Terms and definitions
- **FAQ.md** - Frequently asked questions
- **Troubleshooting.md** - Common issues

## Content Source

All wiki content is derived from:
- **SRS.md** - Software Requirements Specification
- **README.md** - Project README
- **ROADMAP.md** - Development roadmap
- **QuickStart.md** - Quick start guide

## Updating the Wiki

When updating wiki pages:

1. Edit the corresponding `.md` file in this directory
2. Test the markdown rendering locally
3. Follow the publishing steps above to update the GitHub Wiki
4. Ensure all internal links are working
5. Update the revision date in the file

## Wiki Naming Conventions

- Use **Title-Case-With-Hyphens** for file names (matches GitHub Wiki URLs)
- Files are named `Page-Title.md` which becomes `/wiki/Page-Title` on GitHub
- Internal links use the format `[Link Text](Page-Title)`
- No `.md` extension in wiki links

## Page Templates

Each page should follow this structure:

```markdown
# Page Title

Brief introduction paragraph.

## Section 1

Content...

## Section 2

Content...

---

**Related Pages:**
- [Related Page 1](Related-Page-1)
- [Related Page 2](Related-Page-2)
```

## Maintenance

- Review wiki quarterly for outdated information
- Update version numbers and compatibility info
- Keep screenshots and examples current
- Ensure links are not broken
- Add new pages for new features

## Questions?

If you have questions about the wiki documentation:
- Open an issue at https://github.com/aadorian/ProtegeDesk/issues
- Tag with `documentation` label
- Suggest improvements via pull request
