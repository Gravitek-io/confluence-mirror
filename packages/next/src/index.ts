// Main exports for confluence-mirror-next
export { default as OptimizedADFRenderer } from './components/OptimizedAdfRenderer';
export { default as OptimizedTOC } from './components/OptimizedToc';
export { default as OptimizedMedia } from './components/OptimizedMedia';
export { renderADF } from './components/AdfRenderer';

// Server-side DX components
// Option 1: All-in-one component for simple use cases
export { default as ConfluenceMirrorServer } from './components/ConfluenceMirrorServer';

// Option 2: Individual components for flexible layouts and custom styling
export { default as ConfluencePage } from './components/ConfluencePage';
export { default as NavigationTreeServer } from './components/NavigationTreeServer';

// Re-export core types for convenience
export type { 
  ADFDocument, 
  ADFNode, 
  ConfluencePage as ConfluencePageType, 
  TocItem 
} from 'confluence-mirror-core';

// Types
export type { ConfluenceConfig } from './components/ConfluenceMirrorServer';
export type { NavigationItem } from './components/NavigationTreeServer';