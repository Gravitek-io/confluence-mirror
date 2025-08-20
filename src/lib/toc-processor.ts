import { ADFDocument, ADFNode } from './adf-renderer';

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

// Extract text content from ADF nodes
function extractTextFromContent(content: ADFNode[]): string {
  return content.map(node => {
    if (node.type === 'text' && node.text) {
      return node.text;
    }
    if (node.content) {
      return extractTextFromContent(node.content);
    }
    return '';
  }).join('');
}

// Generate unique slug for heading
function generateSlug(text: string, existingSlugs: Set<string>): string {
  let baseSlug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
  
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  existingSlugs.add(slug);
  return slug;
}

// Extract headings from ADF document (server-side)
function extractHeadings(
  node: ADFNode | ADFDocument, 
  headings: TocItem[], 
  existingSlugs: Set<string>
): void {
  if (!node) return;

  if (node.type === 'heading' && node.content) {
    const level = node.attrs?.level || 1;
    const title = extractTextFromContent(node.content);
    
    if (title) {
      const id = generateSlug(title, existingSlugs);
      headings.push({ id, title, level });
      console.log('Extracted heading for TOC:', { id, title, level });
    }
  }

  if (node.content) {
    node.content.forEach(child => extractHeadings(child, headings, existingSlugs));
  }
}

// Process ADF document to enrich heading nodes with IDs and extract TOC
function enrichHeadingNodes(
  node: ADFNode | ADFDocument,
  existingSlugs: Set<string>
): ADFNode | ADFDocument {
  if (!node) return node;
  
  // Handle heading nodes
  if (node.type === 'heading' && node.content) {
    const title = extractTextFromContent(node.content);
    if (title) {
      const id = generateSlug(title, existingSlugs);
      return {
        ...node,
        attrs: {
          ...node.attrs,
          // Add generated ID for anchor links
          generatedId: id,
        }
      };
    }
  }
  
  // Recursively process content
  if (node.content) {
    return {
      ...node,
      content: node.content.map(child => 
        enrichHeadingNodes(child, existingSlugs) as ADFNode
      )
    };
  }
  
  return node;
}

// Main function to process ADF document with TOC extraction
export function processADFWithTOC(adfDocument: ADFDocument): {
  enrichedDocument: ADFDocument;
  tableOfContents: TocItem[];
} {
  const headings: TocItem[] = [];
  const existingSlugs = new Set<string>();
  
  // First pass: extract headings for TOC
  extractHeadings(adfDocument, headings, existingSlugs);
  
  // Second pass: enrich heading nodes with IDs (reuse the same slugs)
  existingSlugs.clear(); // Reset for consistent ID generation
  const enrichedDocument = enrichHeadingNodes(adfDocument, existingSlugs) as ADFDocument;
  
  console.log(`Extracted ${headings.length} headings for TOC`);
  
  return {
    enrichedDocument,
    tableOfContents: headings
  };
}