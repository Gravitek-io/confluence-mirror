import { NextRequest } from 'next/server';
import { confluenceClient } from '@/lib/confluence';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mediaId = searchParams.get('id');
    const collection = searchParams.get('collection');
    const name = searchParams.get('name');
    const contextId = searchParams.get('contextId');
    
    console.log('Confluence blob request:', { mediaId, collection, name, contextId });
    
    if (!mediaId) {
      return new Response('Missing media ID', { status: 400 });
    }
    
    const baseUrl = process.env.CONFLUENCE_BASE_URL;
    const pageId = collection?.replace('contentId-', '') || contextId;
    
    // Essayer différentes URLs d'API basées sur les paramètres de l'URL blob
    const urlsToTry = [];
    
    if (pageId) {
      // API v1 pour récupérer l'attachment par ID de media depuis la page
      urlsToTry.push(
        `${baseUrl}/wiki/rest/api/content/${pageId}/child/attachment/${mediaId}/data`,
        `${baseUrl}/wiki/rest/api/content/${pageId}/child/attachment?filename=${encodeURIComponent(name || '')}&expand=download`,
        `${baseUrl}/wiki/download/attachments/${pageId}/${encodeURIComponent(name || '')}`,
        `${baseUrl}/wiki/download/attachments/${pageId}/${mediaId}`
      );
    }
    
    // URLs directes avec le media ID
    urlsToTry.push(
      `${baseUrl}/wiki/download/attachments/${mediaId}`,
      `${baseUrl}/wiki/rest/api/content/attachment/${mediaId}/data`,
      `${baseUrl}/secure/attachment/${mediaId}/${encodeURIComponent(name || '')}`
    );
    
    console.log('Trying blob URLs:', urlsToTry);
    
    // Essayer chaque URL jusqu'à ce qu'une fonctionne
    for (const mediaUrl of urlsToTry) {
      console.log('Trying blob URL:', mediaUrl);
      
      try {
        const response = await fetch(mediaUrl, {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${process.env.CONFLUENCE_EMAIL}:${process.env.CONFLUENCE_API_KEY}`).toString('base64')}`,
            'Accept': 'image/*,*/*',
          },
        });
        
        console.log(`Blob URL ${mediaUrl} returned status: ${response.status}`);
        
        if (response.ok) {
          const contentType = response.headers.get('content-type') || 'image/png';
          const buffer = await response.arrayBuffer();
          
          console.log(`Successfully loaded blob media from: ${mediaUrl}`);
          
          return new Response(buffer, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=86400',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
      } catch (error) {
        console.log(`Failed to fetch blob ${mediaUrl}:`, error);
        continue;
      }
    }
    
    console.log('All blob URLs failed, returning fallback');
    
    // Si ça échoue, retourner une image de fallback avec les infos de la blob URL
    return new Response(
      `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="35%" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="14">
          Image Confluence (Blob)
        </text>
        <text x="50%" y="45%" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="10">
          ID: ${mediaId}
        </text>
        <text x="50%" y="55%" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="10">
          Name: ${name || 'N/A'}
        </text>
        <text x="50%" y="65%" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="10">
          Collection: ${collection || 'N/A'}
        </text>
      </svg>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=300',
        },
      }
    );
    
  } catch (error) {
    console.error('Error proxying confluence blob:', error);
    
    return new Response(
      `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fef2f2"/>
        <text x="50%" y="45%" text-anchor="middle" fill="#dc2626" font-family="Arial" font-size="14">
          Erreur de chargement
        </text>
        <text x="50%" y="55%" text-anchor="middle" fill="#dc2626" font-family="Arial" font-size="12">
          Blob Confluence
        </text>
      </svg>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=300',
        },
      }
    );
  }
}