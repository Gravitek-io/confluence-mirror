# confluence-mirror-core

Core logic for Confluence page rendering - framework agnostic.

## Installation

```bash
npm install confluence-mirror-core
```

## Features

- ✅ **Confluence REST API Client** - Authenticate and fetch pages
- ✅ **ADF Processing** - Parse Atlas Document Format
- ✅ **Media Processing** - Extract and rewrite media URLs
- ✅ **TOC Extraction** - Generate table of contents from headings
- ✅ **TypeScript Support** - Full type definitions
- ✅ **Zero Dependencies** - Pure logic, no UI framework dependencies

## Quick Start

```typescript
import { 
  ConfluenceClient, 
  processADFWithMedia, 
  processADFWithTOC 
} from 'confluence-mirror-core';

// Initialize client
const client = new ConfluenceClient(
  "https://your-domain.atlassian.net",
  "your-email@domain.com", 
  "your-api-key"
);

// Fetch a page
const page = await client.getPage("page-id");

// Process ADF with media URLs
const processedContent = await processADFWithMedia(
  JSON.parse(page.body.atlas_doc_format.value),
  page.body.storage?.value || "",
  "page-id"
);

// Extract table of contents
const { enrichedDocument, tableOfContents } = processADFWithTOC(processedContent);
```

## API Reference

### ConfluenceClient

```typescript
class ConfluenceClient {
  constructor(baseUrl: string, email: string, apiKey: string)
  
  async getPage(pageId: string, includeChildren?: boolean): Promise<ConfluencePage>
  async getChildPages(pageId: string): Promise<ConfluenceChildPage[]>
  async getCurrentUser(): Promise<any>
  
  static extractPageIdFromUrl(url: string): string | null
}
```

### Processing Functions

```typescript
// Media processing
async function processADFWithMedia(
  adfDocument: ADFDocument,
  storageHtml: string,
  pageId: string
): Promise<ADFDocument>

// TOC processing  
function processADFWithTOC(adfDocument: ADFDocument): {
  enrichedDocument: ADFDocument;
  tableOfContents: TocItem[];
}

// Utility functions
function extractTextFromADFNodes(nodes: ADFNode[]): string
function generateSlug(text: string, existingSlugs?: Set<string>): string
```

### Types

```typescript
interface ConfluencePage {
  id: string;
  title: string;
  body: {
    atlas_doc_format?: { value: string };
    storage?: { value: string; representation: string };
  };
  version: { number: number };
  space: { key: string; name: string };
  _links: { webui: string };
  children?: { page?: { results: ConfluenceChildPage[]; size: number } };
}

interface ADFDocument {
  version: number;
  type: "doc";
  content: ADFNode[];
}

interface TocItem {
  id: string;
  title: string;
  level: number;
}
```

## Error Handling

```typescript
import { ConfluenceApiError } from 'confluence-mirror-core';

try {
  const page = await client.getPage("invalid-id");
} catch (error) {
  if (error instanceof ConfluenceApiError) {
    console.log(`API Error ${error.statusCode}: ${error.message}`);
  }
}
```

## Contributing

This package contains pure logic with no UI dependencies. When contributing:

1. Keep functions pure and testable
2. Maintain TypeScript strict mode compliance  
3. Add tests for new functionality
4. Update type definitions as needed

## License

Apache-2.0