import { NextRequest } from 'next/server';
import { confluenceClient } from '@/lib/confluence';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    console.log('Fetching HTML for page:', pageId);
    
    // Utiliser l'API Confluence pour récupérer le contenu en format Storage (HTML)
    const page = await confluenceClient.getPage(pageId);
    
    if (!page.body.storage?.value) {
      throw new Error('No storage format content available for this page');
    }
    
    const storageHtml = page.body.storage.value;
    console.log('Got storage format HTML, length:', storageHtml.length);
    
    // Nettoyer et traiter le HTML Storage
    const processedHtml = processStorageFormatHtml(storageHtml, pageId);
    
    console.log('Successfully processed page HTML, length:', processedHtml.length);
    
    return new Response(processedHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache 1h
      },
    });
    
  } catch (error) {
    console.error('Error scraping page HTML:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to scrape page HTML',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

function processStorageFormatHtml(storageHtml: string, pageId: string): string {
  console.log('Processing storage format HTML, original length:', storageHtml.length);
  
  let processed = storageHtml;
  
  // Le format Storage utilise des éléments spéciaux de Confluence
  
  // 1. Traiter les images - format ac:image avec ri:attachment
  processed = processed.replace(
    /<ac:image[^>]*>.*?<ri:attachment ri:filename="([^"]*)"[^>]*\/>.*?<\/ac:image>/gi,
    (match, filename) => {
      const baseUrl = process.env.CONFLUENCE_BASE_URL;
      const imageUrl = `${baseUrl}/wiki/download/attachments/${pageId}/${encodeURIComponent(filename)}`;
      return `<img src="${imageUrl}" alt="${filename}" style="max-width: 100%; height: auto; margin: 1rem 0;" />`;
    }
  );
  
  // 2. Traiter les macros structurées (comme la table des matières)
  processed = processed.replace(
    /<ac:structured-macro ac:name="toc"[^>]*>[\s\S]*?<\/ac:structured-macro>/gi,
    '<div class="confluence-toc"><p><strong>📋 Table des matières générée automatiquement</strong></p></div>'
  );
  
  // 3. Traiter d'autres macros utiles
  processed = processed.replace(
    /<ac:structured-macro ac:name="([^"]*)"[^>]*>[\s\S]*?<\/ac:structured-macro>/gi,
    (match, macroName) => {
      return `<div class="confluence-macro"><em>📌 Macro Confluence: ${macroName}</em></div>`;
    }
  );
  
  // 4. Traiter les liens internes
  processed = processed.replace(
    /<ac:link[^>]*>[\s\S]*?<ri:page ri:content-title="([^"]*)"[^>]*\/>[\s\S]*?<ac:plain-text-link-body[^>]*><!\[CDATA\[([^\]]*)\]\]><\/ac:plain-text-link-body>[\s\S]*?<\/ac:link>/gi,
    (match, pageTitle, linkText) => {
      return `<a href="#" title="Lien vers: ${pageTitle}" style="color: #0052cc; text-decoration: underline;">${linkText}</a>`;
    }
  );
  
  // 5. Traiter les tableaux
  processed = processed.replace(/<ac:table[^>]*>/gi, '<table class="confluenceTable">');
  processed = processed.replace(/<\/ac:table>/gi, '</table>');
  processed = processed.replace(/<ac:thead[^>]*>/gi, '<thead>');
  processed = processed.replace(/<\/ac:thead>/gi, '</thead>');
  processed = processed.replace(/<ac:tbody[^>]*>/gi, '<tbody>');
  processed = processed.replace(/<\/ac:tbody>/gi, '</tbody>');
  processed = processed.replace(/<ac:tr[^>]*>/gi, '<tr>');
  processed = processed.replace(/<\/ac:tr>/gi, '</tr>');
  processed = processed.replace(/<ac:th[^>]*>/gi, '<th>');
  processed = processed.replace(/<\/ac:th>/gi, '</th>');
  processed = processed.replace(/<ac:td[^>]*>/gi, '<td>');
  processed = processed.replace(/<\/ac:td>/gi, '</td>');
  
  // 6. Traiter les éléments de mise en forme
  processed = processed.replace(/<strong[^>]*>/gi, '<strong>');
  processed = processed.replace(/<em[^>]*>/gi, '<em>');
  processed = processed.replace(/<u[^>]*>/gi, '<u>');
  processed = processed.replace(/<code[^>]*>/gi, '<code style="background: #f4f5f7; padding: 2px 4px; border-radius: 3px;">');
  
  // 7. Améliorer les en-têtes et paragraphes
  processed = processed.replace(/<h(\d)[^>]*>/gi, '<h$1 style="margin-top: 2rem; margin-bottom: 1rem; color: #172b4d;">');
  processed = processed.replace(/<p[^>]*>/gi, '<p style="margin-bottom: 1rem; line-height: 1.6;">');
  
  // 8. Traiter les listes
  processed = processed.replace(/<ul[^>]*>/gi, '<ul style="margin-bottom: 1rem; padding-left: 1.5rem;">');
  processed = processed.replace(/<ol[^>]*>/gi, '<ol style="margin-bottom: 1rem; padding-left: 1.5rem;">');
  processed = processed.replace(/<li[^>]*>/gi, '<li style="margin-bottom: 0.5rem;">');
  
  // 9. Nettoyer les éléments non reconnus
  processed = processed.replace(/<ac:parameter[^>]*>[\s\S]*?<\/ac:parameter>/gi, '');
  processed = processed.replace(/<\/?ac:[^>]*>/gi, '');
  processed = processed.replace(/<\/?ri:[^>]*>/gi, '');
  
  // 10. Nettoyer les espaces
  processed = processed.replace(/\n\s*\n/g, '\n');
  processed = processed.replace(/^\s+|\s+$/g, '');
  
  const styledContent = `
    <div style="
      max-width: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #172b4d;
      padding: 1rem;
    ">
      <style>
        .confluenceTable {
          border-collapse: collapse;
          margin: 1rem 0;
          width: 100%;
          border: 1px solid #dfe1e6;
        }
        .confluenceTable th,
        .confluenceTable td {
          border: 1px solid #dfe1e6;
          padding: 12px;
          text-align: left;
        }
        .confluenceTable th {
          background-color: #f4f5f7;
          font-weight: 600;
          color: #172b4d;
        }
        .confluenceTable tbody tr:nth-child(even) {
          background-color: #fafbfc;
        }
        .confluence-macro {
          background: #e3fcef;
          border: 1px solid #79f2c0;
          border-radius: 4px;
          padding: 1rem;
          margin: 1rem 0;
          font-style: italic;
        }
        .confluence-toc {
          background: #deebff;
          border: 1px solid #85b8ff;
          border-radius: 4px;
          padding: 1rem;
          margin: 1rem 0;
        }
        img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.12);
          margin: 1rem 0;
          display: block;
        }
        blockquote {
          border-left: 4px solid #dfe1e6;
          margin: 1rem 0;
          padding-left: 1rem;
          color: #6b778c;
          font-style: italic;
        }
      </style>
      ${processed}
    </div>
  `;
  
  console.log('Processed storage HTML, final length:', styledContent.length);
  return styledContent;
}