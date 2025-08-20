import React from 'react';
import { renderADF, ADFDocument } from '@/lib/adf-renderer';
import { TocItem } from '@/lib/toc-processor';
import OptimizedTOC from '@/components/optimized-toc';

interface OptimizedADFRendererProps {
  document: ADFDocument;
  pageId: string;
  tableOfContents: TocItem[];
}

// Server Component - no 'use client' directive
export default function OptimizedADFRenderer({ 
  document, 
  pageId, 
  tableOfContents 
}: OptimizedADFRendererProps) {
  return (
    <div>
      {/* Display TOC at the top if there are headings */}
      {tableOfContents.length > 0 && (
        <OptimizedTOC items={tableOfContents} />
      )}
      
      {/* Render the ADF document with pre-processed data */}
      {renderADF(document, undefined, { pageId })}
    </div>
  );
}