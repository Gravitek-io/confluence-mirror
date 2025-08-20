import { confluenceClient } from '@/lib/confluence';
import { TocProvider } from '@/lib/toc-context';
import ADFRendererWithToc from '@/components/adf-renderer-with-toc';

interface ConfluencePageProps {
  pageId: string;
}

export default async function ConfluencePage({ pageId }: ConfluencePageProps) {
  try {
    const page = await confluenceClient.getPage(pageId);
    
    // Get the ADF content
    const adfContent = page.body.atlas_doc_format?.value;
    
    if (!adfContent) {
      return (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">Content not available</h3>
          <p className="text-yellow-700">This page content is not available in the required format.</p>
        </div>
      );
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(adfContent);
    } catch {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Content parsing error</h3>
          <p className="text-red-700 mb-4">
            Unable to parse the page content format.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{page.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>ID: {page.id}</span>
                <span>Version: {page.version.number}</span>
                <span>Space: {page.space.name} ({page.space.key})</span>
              </div>
            </div>
            <a 
              href={page._links.webui}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            >
              View in Confluence
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
        
        <div className="p-6">
          <div className="prose prose-lg max-w-full">
            <div className="confluence-hybrid-content">
              <TocProvider>
                <ADFRendererWithToc document={parsedContent} pageId={pageId} />
              </TocProvider>
            </div>
          </div>
        </div>
      </div>
    );
    
  } catch (error) {
    console.error('Error fetching Confluence page:', error);
    
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Loading error</h3>
        <p className="text-red-700 mb-4">
          Unable to load Confluence page ID: {pageId}
        </p>
        <details className="text-sm text-red-600">
          <summary className="cursor-pointer hover:text-red-800">Error details</summary>
          <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-x-auto">
            {error instanceof Error ? error.message : 'Unknown error'}
          </pre>
        </details>
      </div>
    );
  }
}