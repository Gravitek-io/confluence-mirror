import { ConfluenceClient, processADFWithMedia, processADFWithTOC } from '@gravitek/confluence-mirror-core';
import OptimizedADFRenderer from './optimized-adf-renderer';

interface ConfluencePageProps {
  pageId?: string;
  url?: string;
}

interface ConfluencePageConfig {
  baseUrl: string;
  email: string;
  apiKey: string;
}

export default async function ConfluencePage({ 
  pageId, 
  url,
  config 
}: ConfluencePageProps & { config: ConfluencePageConfig }) {
  try {
    // Validate input parameters
    if (!pageId && !url) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Invalid parameters</h3>
          <p className="text-red-700">
            Either pageId or url must be provided.
          </p>
        </div>
      );
    }

    const confluenceClient = new ConfluenceClient(config.baseUrl, config.email, config.apiKey);
    
    // Extract pageId from URL if provided
    let resolvedPageId = pageId;
    if (url && !pageId) {
      resolvedPageId = ConfluenceClient.extractPageIdFromUrl(url);
      if (!resolvedPageId) {
        return (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Invalid URL</h3>
            <p className="text-red-700 mb-2">
              Unable to extract page ID from the provided URL.
            </p>
            <p className="text-sm text-red-600">URL: {url}</p>
          </div>
        );
      }
    }

    const page = await confluenceClient.getPage(resolvedPageId!);
    
    // Get the ADF content
    const adfContent = page.body.atlas_doc_format?.value;
    const storageContent = page.body.storage?.value;
    
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

    // Pre-process ADF with media URLs (server-side)
    let processedContent = parsedContent;
    if (storageContent) {
      processedContent = await processADFWithMedia(parsedContent, storageContent, resolvedPageId);
    }

    // Pre-process ADF with TOC extraction (server-side)
    const { enrichedDocument, tableOfContents } = processADFWithTOC(processedContent);

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
              <OptimizedADFRenderer 
                document={enrichedDocument} 
                pageId={resolvedPageId} 
                tableOfContents={tableOfContents}
              />
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
          Unable to load Confluence page ID: {resolvedPageId}
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