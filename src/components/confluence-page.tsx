import { confluenceClient } from '@/lib/confluence';
import { ConfluenceClient } from '@/lib/confluence-client';

interface ConfluencePageProps {
  pageId: string;
}

export default async function ConfluencePage({ pageId }: ConfluencePageProps) {
  try {
    const page = await confluenceClient.getPage(pageId);
    
    // Get the best available content format
    const content = page.body.atlas_doc_format?.value || page.body.storage?.value;
    
    if (!content) {
      return (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">Contenu non disponible</h3>
          <p className="text-yellow-700">Le contenu de cette page n'est pas accessible dans le format requis.</p>
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
                <span>Espace: {page.space.name} ({page.space.key})</span>
              </div>
            </div>
            <a 
              href={page._links.webui}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            >
              Voir dans Confluence
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
        
        <div className="p-6">
          <div className="prose prose-lg max-w-none">
            {page.body.atlas_doc_format ? (
              // For Atlas Document Format (newer format)
              <div className="confluence-atlas-content">
                <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-sm overflow-x-auto">
                  {content}
                </pre>
                <p className="text-xs text-gray-500 mt-2">
                  Format: Atlas Document Format (JSON)
                </p>
              </div>
            ) : (
              // For Storage format (legacy HTML-like format)
              <div className="confluence-storage-content">
                <div 
                  className="confluence-html-content"
                  dangerouslySetInnerHTML={{ __html: content }} 
                />
                <p className="text-xs text-gray-500 mt-4">
                  Format: Storage ({page.body.storage?.representation})
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching Confluence page:', error);
    
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
        <p className="text-red-700 mb-4">
          Impossible de charger la page Confluence ID: {pageId}
        </p>
        <details className="text-sm text-red-600">
          <summary className="cursor-pointer hover:text-red-800">Détails de l'erreur</summary>
          <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-x-auto">
            {error instanceof Error ? error.message : 'Erreur inconnue'}
          </pre>
        </details>
      </div>
    );
  }
}