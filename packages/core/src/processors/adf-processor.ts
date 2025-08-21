import { ADFDocument, ADFNode } from '../types';

// Pure ADF processing logic without UI dependencies
export function processADF(document: ADFDocument): ADFDocument {
  // This will contain pure ADF transformation logic
  // Currently just returns the document as-is
  return document;
}

// Extract text content from ADF nodes (moved from adf-renderer)
export function extractTextFromADFNodes(nodes: ADFNode[]): string {
  return nodes.map(node => {
    if (node.type === 'text' && node.text) {
      return node.text;
    }
    if (node.content) {
      return extractTextFromADFNodes(node.content);
    }
    return '';
  }).join('');
}

// Generate URL-safe slug from text
export function generateSlug(text: string, existingSlugs?: Set<string>): string {
  let baseSlug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
  
  if (!existingSlugs) {
    return baseSlug;
  }
  
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  existingSlugs.add(slug);
  return slug;
}