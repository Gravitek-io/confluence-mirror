'use client';

import React, { useEffect } from 'react';
import { renderADF, ADFNode, ADFDocument } from '@/lib/adf-renderer';
import { useToc } from '@/lib/toc-context';

// Fonction pour extraire les titres du contenu ADF
function extractHeadings(node: ADFNode | ADFDocument, addItem: (item: { id: string; title: string; level: number }) => void, existingSlugs: Set<string>) {
  if (!node) return;

  if (node.type === 'heading' && node.content) {
    const level = node.attrs?.level || 1;
    const title = extractTextFromContent(node.content);
    
    console.log('Found heading:', { level, title, attrs: node.attrs });
    
    if (title) {
      const id = generateSlug(title, existingSlugs);
      addItem({ id, title, level });
      console.log('Added heading to TOC:', { id, title, level });
    }
  }

  if (node.content) {
    node.content.forEach(child => extractHeadings(child, addItem, existingSlugs));
  }
}

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

interface ADFRendererWithTocProps {
  document: ADFDocument;
  pageId: string;
}

export default function ADFRendererWithToc({ document, pageId }: ADFRendererWithTocProps) {
  const { addItem, clear } = useToc();
  
  // Utiliser une référence pour éviter la re-extraction inutile
  const documentRef = React.useRef(document);
  const hasExtracted = React.useRef(false);
  
  useEffect(() => {
    // Seulement si le document a changé ou n'a jamais été extrait
    if (!hasExtracted.current || documentRef.current !== document) {
      console.log('Extracting headings from document:', document);
      clear();
      const existingSlugs = new Set<string>();
      extractHeadings(document, addItem, existingSlugs);
      documentRef.current = document;
      hasExtracted.current = true;
      console.log('Headings extraction completed');
    }
  });

  return (
    <div>
      {renderADF(document, undefined, { pageId })}
    </div>
  );
}