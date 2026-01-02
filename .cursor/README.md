# .cursor Directory

This directory contains Cursor AI configuration files for the ProtegeDesk project.

## Files

- **`.cursorrules`** (at project root): Main rules file that Cursor AI reads for code generation and suggestions. This is the primary configuration file.

## What is .cursorrules?

The `.cursorrules` file (located at the project root, not in this directory) contains guidelines and rules that help Cursor AI understand:

- Project architecture and patterns
- Coding standards and conventions
- Technology stack and dependencies
- Testing requirements
- Performance considerations
- Security best practices

## Usage

Cursor AI automatically reads the `.cursorrules` file when you use features like:
- Code completion and suggestions
- Chat with AI
- Code generation
- Refactoring suggestions

## Customization

You can modify `.cursorrules` to add project-specific rules or update guidelines as the project evolves. The file uses markdown format with clear sections for different aspects of development.

## Notes

- The `.cursorrules` file is at the project root (not in `.cursor/`) because that's where Cursor looks for it
- This `.cursor/` directory is for organization and documentation purposes
- See `CURSOR_GUIDELINES.md` for more detailed development guidelines

