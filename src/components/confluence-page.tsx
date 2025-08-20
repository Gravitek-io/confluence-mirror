import { confluenceClient } from '@/lib/confluence';
import ConfluencePageWithToggle from '@/components/confluence-page-with-toggle';

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

    return <ConfluencePageWithToggle pageId={pageId} initialPage={page} />;
    
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