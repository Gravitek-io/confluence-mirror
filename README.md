# Confluence Mirror

Render Confluence content in React applications.

> **Disclaimer:** This is an unofficial library, not affiliated with Atlassian.

## 🏗 Monorepo Structure

This repository contains:

- **packages/core** - `@gravitek/confluence-mirror-core`: Pure logic for Confluence API & ADF processing
- **packages/next** - `@gravitek/confluence-mirror-next`: Next.js React components with Tailwind styling
- **demo/** - Interactive demo application showcasing the library

## 🚀 Quick Start

```bash
# Install a package in your Next.js app
npm install @gravitek/confluence-mirror-next

# Use in your React component
import { ConfluencePage } from '@gravitek/confluence-mirror-next';

<ConfluencePage
  pageId="your-page-id"
  config={{
    baseUrl: "https://your-domain.atlassian.net",
    email: "your-email@domain.com",
    apiKey: "your-api-key"
  }}
/>
```

## 📦 Packages

### @gravitek/confluence-mirror-core

Framework-agnostic core logic for Confluence integration:

- ✅ Confluence REST API client
- ✅ ADF (Atlas Document Format) processing
- ✅ Media URL rewriting
- ✅ Table of contents extraction
- ✅ TypeScript types

### @gravitek/confluence-mirror-next

Next.js specific React components:

- ✅ Server Components support
- ✅ Tailwind CSS styling (customizable)
- ✅ Optimized rendering
- ✅ Automatic TOC generation

## 🎨 Demo

Run the interactive demo locally:

```bash
git clone https://github.com/Gravitek-io/confluence-mirror
cd confluence-mirror
npm install
npm run dev
```

Visit http://localhost:3000 to see the demo in action.

## 📖 Documentation

- [Core Package Documentation](./packages/core/README.md)
- [Next.js Package Documentation](./packages/next/README.md)
- [Demo App Setup](./demo/README.md)

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines and submit pull requests.

## 📄 License

Apache-2.0 © Gravitek
