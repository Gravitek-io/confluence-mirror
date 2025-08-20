'use client';

import { useState } from 'react';
import { confluenceClient } from '@/lib/confluence';
import ConfluencePageHtml from '@/components/confluence-page-html';
import { TocProvider } from '@/lib/toc-context';
import ADFRendererWithToc from '@/components/adf-renderer-with-toc';
import ADFRendererWithTocHybrid from '@/components/adf-renderer-with-toc-hybrid';

interface ConfluencePageWithToggleProps {
  pageId: string;
  initialPage: any;
}

export default function ConfluencePageWithToggle({ pageId, initialPage }: ConfluencePageWithToggleProps) {
  const [viewMode, setViewMode] = useState<'adf' | 'hybrid' | 'html'>('hybrid');
  
  const content = initialPage.body.atlas_doc_format?.value || initialPage.body.storage?.value;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{initialPage.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>ID: {initialPage.id}</span>
              <span>Version: {initialPage.version.number}</span>
              <span>Espace: {initialPage.space.name} ({initialPage.space.key})</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Toggle pour basculer entre les modes */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('adf')}
                className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'adf'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ADF Original
              </button>
              <button
                onClick={() => setViewMode('hybrid')}
                className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'hybrid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🎯 ADF + Images
              </button>
              <button
                onClick={() => setViewMode('html')}
                className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'html'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                HTML Storage
              </button>
            </div>
            
            <a 
              href={initialPage._links.webui}
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
      </div>
      
      <div className="p-6">
        <div className="prose prose-lg max-w-full">
          {viewMode === 'adf' && initialPage.body.atlas_doc_format ? (
            // Mode ADF Original (API)
            <div className="confluence-atlas-content">
              {(() => {
                try {
                  const adfContent = JSON.parse(content);
                  return (
                    <div className="rendered-adf">
                      <TocProvider>
                        <ADFRendererWithToc document={adfContent} />
                      </TocProvider>
                      <p className="text-xs text-gray-500 mt-6 pt-4 border-t border-gray-200">
                        Mode: ADF Original - problèmes d'images attendus
                      </p>
                    </div>
                  );
                } catch (error) {
                  return (
                    <div>
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                        <p className="text-yellow-800 text-sm">
                          ⚠️ Erreur de parsing ADF. Affichage du JSON brut :
                        </p>
                      </div>
                      <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-sm overflow-x-auto">
                        {content}
                      </pre>
                      <p className="text-xs text-gray-500 mt-2">
                        Mode: ADF Original (JSON brut)
                      </p>
                    </div>
                  );
                }
              })()}
            </div>
          ) : viewMode === 'hybrid' && initialPage.body.atlas_doc_format ? (
            // Mode ADF Hybride (ADF + images du Storage)
            <div className="confluence-hybrid-content">
              {(() => {
                try {
                  const adfContent = JSON.parse(content);
                  return (
                    <div className="rendered-adf-hybrid">
                      <TocProvider>
                        <ADFRendererWithTocHybrid document={adfContent} pageId={pageId} />
                      </TocProvider>
                      <p className="text-xs text-gray-500 mt-6 pt-4 border-t border-gray-200">
                        🎯 Mode: ADF Hybride - mise en forme ADF + images du Storage
                      </p>
                    </div>
                  );
                } catch (error) {
                  return (
                    <div>
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
                        <p className="text-red-800 text-sm">
                          ⚠️ Erreur de parsing ADF pour le mode hybride :
                        </p>
                      </div>
                      <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-sm overflow-x-auto">
                        {error instanceof Error ? error.message : 'Erreur inconnue'}
                      </pre>
                    </div>
                  );
                }
              })()}
            </div>
          ) : viewMode === 'html' ? (
            // Mode HTML du Storage
            <div className="confluence-html-content">
              <TocProvider>
                <ConfluencePageHtml pageId={pageId} />
              </TocProvider>
              <p className="text-xs text-gray-500 mt-6 pt-4 border-t border-gray-200">
                Mode: HTML du Storage - images fonctionnelles mais mise en forme basique
              </p>
            </div>
          ) : (
            // Fallback pour storage format
            <div className="confluence-storage-content">
              <div 
                className="confluence-html-content"
                dangerouslySetInnerHTML={{ __html: content }} 
              />
              <p className="text-xs text-gray-500 mt-4">
                Mode: API Storage format ({initialPage.body.storage?.representation})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}