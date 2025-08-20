'use client';

import { TocProvider } from '@/lib/toc-context';
import ADFRendererWithToc from '@/components/adf-renderer-with-toc';
import { ADFDocument } from '@/lib/adf-renderer';

interface ShowroomContentProps {
  document: ADFDocument;
}

export default function ShowroomContent({ document }: ShowroomContentProps) {
  return (
    <div className="prose prose-lg max-w-full">
      <div className="confluence-hybrid-content">
        <TocProvider>
          <ADFRendererWithToc document={document} pageId="showroom" />
        </TocProvider>
      </div>
    </div>
  );
}