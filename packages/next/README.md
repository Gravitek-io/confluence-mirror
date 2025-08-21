# confluence-mirror-next

Next.js React components for rendering Confluence pages with Tailwind CSS styling.

## Installation

```bash
npm install confluence-mirror-next
```

This will automatically install `confluence-mirror-core` as a dependency.

## Features

- ✅ **Server Components** - Optimized for Next.js App Router
- ✅ **Tailwind CSS Styling** - Beautiful default styles with customization
- ✅ **Automatic TOC** - Generated table of contents 
- ✅ **Media Support** - Images and videos with optimized loading
- ✅ **Type Safe** - Full TypeScript support
- ✅ **Customizable** - Override styles with className props

## Quick Start

```tsx
import { ConfluencePage } from 'confluence-mirror-next';

export default function MyPage() {
  return (
    <ConfluencePage 
      pageId="your-page-id"
      config={{
        baseUrl: "https://your-domain.atlassian.net",
        email: "your-email@domain.com",
        apiKey: "your-api-key"
      }}
    />
  );
}
```

## Components

### ConfluencePage

Main component for rendering a complete Confluence page.

```tsx
interface ConfluencePageProps {
  pageId: string;
  config: {
    baseUrl: string;
    email: string; 
    apiKey: string;
  };
  className?: string;
}

<ConfluencePage 
  pageId="123456789"
  config={confluenceConfig}
  className="custom-page-styles"
/>
```

### OptimizedADFRenderer

Render ADF content with pre-processed data.

```tsx
import { OptimizedADFRenderer } from 'confluence-mirror-next';

<OptimizedADFRenderer
  document={adfDocument}
  pageId="123456789" 
  tableOfContents={tocItems}
/>
```

### OptimizedTOC

Render table of contents with hierarchical styling.

```tsx
import { OptimizedTOC } from 'confluence-mirror-next';

<OptimizedTOC items={tocItems} />
```

### OptimizedMedia

Render media (images/videos) with optimized loading.

```tsx
import { OptimizedMedia } from 'confluence-mirror-next';

<OptimizedMedia
  url="https://example.com/image.jpg"
  type="image"
  alt="Description"
  pageId="123456789"
/>
```

## Styling Customization

The components use Tailwind CSS classes that can be overridden:

```tsx
// Override page container styles
<ConfluencePage 
  pageId="123" 
  config={config}
  className="bg-gray-100 p-8 rounded-xl"
/>

// Custom TOC styling
<OptimizedTOC 
  items={items}
  className="bg-blue-50 border-2 border-blue-200"
/>
```

### CSS Classes Used

The components use semantic CSS classes you can target:

- `.confluence-hybrid-content` - Main content container
- `[data-confluence-page-id]` - Page wrapper
- `[data-adf-type]` - ADF element types
- `[data-adf-level]` - Heading levels

## Advanced Usage

### Custom Configuration

```tsx
// Environment-based config
const config = {
  baseUrl: process.env.CONFLUENCE_BASE_URL!,
  email: process.env.CONFLUENCE_EMAIL!,
  apiKey: process.env.CONFLUENCE_API_KEY!,
};

// With error boundaries
<ErrorBoundary fallback={<div>Error loading page</div>}>
  <Suspense fallback={<div>Loading...</div>}>
    <ConfluencePage pageId="123" config={config} />
  </Suspense>
</ErrorBoundary>
```

### Direct ADF Processing

```tsx
import { renderADF } from 'confluence-mirror-next';
import { processADFWithTOC } from 'confluence-mirror-core';

function CustomRenderer({ adfDocument }: { adfDocument: ADFDocument }) {
  const { enrichedDocument, tableOfContents } = processADFWithTOC(adfDocument);
  
  return (
    <div>
      <MyCustomTOC items={tableOfContents} />
      {renderADF(enrichedDocument, undefined, { pageId: "123" })}
    </div>
  );
}
```

## Next.js Configuration

### App Router (Recommended)

Components work out-of-the-box with Next.js 13+ App Router:

```tsx
// app/confluence/[pageId]/page.tsx
import { ConfluencePage } from 'confluence-mirror-next';

export default function Page({ params }: { params: { pageId: string } }) {
  return <ConfluencePage pageId={params.pageId} config={config} />;
}
```

### Pages Router

```tsx
// pages/confluence/[pageId].tsx
import { GetServerSideProps } from 'next';
import { ConfluencePage } from 'confluence-mirror-next';

export default function ConfluencePageRoute({ pageId }: { pageId: string }) {
  return <ConfluencePage pageId={pageId} config={config} />;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return { props: { pageId: params?.pageId as string } };
};
```

## Troubleshooting

### Build Errors

If you see TypeScript errors about missing types:

```bash
npm install @types/react @types/node
```

### Styling Issues

Ensure Tailwind CSS is properly configured in your Next.js project:

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/confluence-mirror-next/**/*.{js,ts,jsx,tsx}' // Include package
  ],
  // ... rest of config
}
```

### Server Component Errors

All components are Server Components by default. If you need client-side features:

```tsx
'use client';
import { ConfluencePage } from 'confluence-mirror-next';
// Your client component code
```

## Contributing

When contributing to Next.js components:

1. Maintain Server Component compatibility
2. Keep Tailwind classes semantic and overridable
3. Add proper TypeScript types for props
4. Test with both App Router and Pages Router

## License

MIT