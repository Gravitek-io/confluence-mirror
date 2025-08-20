import { ADFDocument } from '@/lib/adf-renderer';
import { processADFWithTOC } from '@/lib/toc-processor';
import OptimizedADFRenderer from '@/components/optimized-adf-renderer';

interface ShowroomContentProps {
  document: ADFDocument;
}

// Server Component for showroom content
export default function ShowroomContent({ document }: ShowroomContentProps) {
  // Pre-process the document for TOC extraction
  const { enrichedDocument, tableOfContents } = processADFWithTOC(document);
  
  return (
    <div className="prose prose-lg max-w-full">
      <div className="confluence-hybrid-content">
        <OptimizedADFRenderer 
          document={enrichedDocument} 
          pageId="showroom" 
          tableOfContents={tableOfContents}
        />
      </div>
    </div>
  );
}