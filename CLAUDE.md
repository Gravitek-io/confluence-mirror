# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Confluence Mirror** is a TypeScript monorepo that renders Confluence content in React applications. The project provides framework-agnostic core logic and Next.js-specific React components for displaying Confluence pages with full ADF (Atlas Document Format) support.

### Key Features

- Complete ADF (Atlas Document Format) rendering support
- Confluence REST API client with TypeScript types
- Automatic table of contents generation
- Media processing and optimization
- Responsive Tailwind CSS styling
- Server-side rendering with Next.js

## Monorepo Architecture

This is a workspace-based monorepo with the following structure:

### Packages

- **packages/core** (`confluence-mirror-core`): Framework-agnostic core logic
  - Confluence API client (`ConfluenceClient`)
  - ADF processors (media, TOC, text extraction)
  - TypeScript types and interfaces
- **packages/next** (`confluence-mirror-next`): Next.js React components
  - ADF renderer components with Tailwind styling
  - Optimized media and TOC components
  - TOC context provider and hooks
- **demo/**: Interactive demo application showcasing the library

### Key Dependencies

- Core package: Pure TypeScript with no dependencies
- Next package: React 19, Next.js 15, Tailwind CSS v4
- Demo: Next.js app using the library packages

## Development Commands

```bash
# Install all dependencies (root + workspaces)
npm install

# Development
npm run dev                 # Start demo app in development
npm run build              # Build all packages and demo
npm run build:core         # Build core package only
npm run build:next         # Build next package only
npm run build:demo         # Build demo app only
npm run lint               # Lint all workspaces

# Package-specific commands
cd packages/core && npm run dev    # Watch build core package
cd packages/next && npm run dev    # Watch build next package
cd demo && npm run dev             # Start demo in development
```

## Core Architecture

### Confluence API Integration

- **Authentication**: Basic auth using email + API key
- **API Version**: Confluence REST API v1 (standard endpoints)
- **Supported Formats**: ADF (Atlas Document Format) and Storage format
- **URL Extraction**: Supports multiple Confluence URL patterns

### ADF Processing Pipeline

1. **Raw ADF**: Fetched from Confluence API
2. **Media Processing**: Extract and process media references (`processADFWithMedia`)
3. **TOC Processing**: Generate table of contents from headings (`processADFWithTOC`)
4. **Rendering**: Convert ADF nodes to React components (`renderADF`)

### Component Architecture

- **AdfRenderer**: Core rendering engine that converts ADF nodes to React
- **OptimizedADFRenderer**: Wrapper with media and TOC preprocessing
- **TocProvider/TocContext**: React context for table of contents state
- **OptimizedMedia**: Component for handling Confluence media assets
- **ConfluencePage**: High-level server component for complete page rendering

## Supported ADF Elements

The renderer supports comprehensive ADF elements including:

- **Text**: Bold, italic, code, strikethrough, underline, links
- **Structure**: Headings, paragraphs, lists (bullet/ordered), blockquotes
- **Layout**: Multi-column layouts with responsive behavior
- **Content**: Tables, panels (info/warning/error/success/note), code blocks
- **Interactive**: Task lists with checkboxes, status badges
- **Rich**: Media (images/attachments), inline cards, mentions, dates, emojis
- **Extensions**: Confluence macros and bodied extensions

## Working with the Codebase

### Adding New ADF Support

1. Add type definitions in `packages/core/src/types/index.ts`
2. Implement rendering logic in `packages/next/src/components/AdfRenderer.tsx`
3. Add processing logic if needed in `packages/core/src/processors/`

### Package Development Workflow

1. Make changes to core package first (types, API logic)
2. Build core package: `npm run build:core`
3. Make changes to next package (components, rendering)
4. Test in demo app: `npm run dev` from root

### File Organization

- **Types**: All TypeScript interfaces in `packages/core/src/types/`
- **API Logic**: Confluence client in `packages/core/src/client/`
- **Processors**: Pure functions for ADF transformation in `packages/core/src/processors/`
- **Components**: React components in `packages/next/src/components/`
- **Exports**: Main package exports in `packages/*/src/index.ts`
