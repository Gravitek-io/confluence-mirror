'use client';

import React, { useEffect, useState } from 'react';
import { useToc, TableOfContents } from '@/lib/toc-context';

interface ConfluencePageHtmlProps {
  pageId: string;
}

export default function ConfluencePageHtml({ pageId }: ConfluencePageHtmlProps) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem, clear } = useToc();

  useEffect(() => {
    async function fetchHtml() {
      try {
        console.log('ConfluencePageHtml: Starting fetch for pageId:', pageId);
        setLoading(true);
        setError(null);
        clear();

        const response = await fetch(`/api/confluence-html/${pageId}`);
        
        console.log('ConfluencePageHtml: Fetch response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch HTML: ${response.status}`);
        }
        
        const html = await response.text();
        console.log('ConfluencePageHtml: Received HTML length:', html.length);
        
        // Extraire les titres du HTML pour le sommaire
        extractHeadingsFromHtml(html);
        
      } catch (err) {
        console.error('ConfluencePageHtml: Error fetching HTML:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchHtml();
  }, [pageId, clear, addItem]);

  function extractHeadingsFromHtml(html: string) {
    try {
      console.log('Extracting headings from HTML, length:', html.length);
      
      // Créer un parser DOM temporaire
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      console.log('Found', headings.length, 'headings in scraped HTML');
      
      const existingSlugs = new Set<string>();
      
      headings.forEach((heading) => {
        const level = parseInt(heading.tagName.charAt(1));
        const title = heading.textContent?.trim() || '';
        
        console.log('Processing heading:', { level, title });
        
        if (title) {
          const id = generateSlug(title, existingSlugs);
          
          // Ajouter l'ID au heading pour les ancres
          heading.id = id;
          
          addItem({ id, title, level });
        }
      });
      
      // Mettre à jour le HTML avec les IDs ajoutés
      const updatedHtml = doc.body?.innerHTML || html;
      console.log('Updated HTML content length:', updatedHtml.length);
      setHtmlContent(updatedHtml);
    } catch (error) {
      console.error('Error extracting headings from HTML:', error);
      setHtmlContent(html);
    }
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

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-2">
          <svg className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium text-red-800">Erreur de chargement</span>
        </div>
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="confluence-html-content">
      {/* Le contenu HTML sera injecté avec dangerouslySetInnerHTML */}
      <div 
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        className="prose max-w-none"
      />
    </div>
  );
}