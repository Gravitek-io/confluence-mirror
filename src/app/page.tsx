import { Suspense } from 'react';
import ConfluencePage from '@/components/confluence-page';
import ConfluenceForm from '@/components/confluence-form';

interface HomeProps {
  searchParams: Promise<{ pageId?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { pageId } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Confluence to React
          </h1>
          <p className="text-lg text-gray-600">
            Affichez le contenu de vos pages Confluence
          </p>
        </div>

        <ConfluenceForm initialPageId={pageId} />

        {pageId && (
          <div className="mt-8 max-w-5xl mx-auto">
            <Suspense 
              fallback={
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Chargement de la page Confluence...</p>
                </div>
              }
            >
              <ConfluencePage pageId={pageId} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
