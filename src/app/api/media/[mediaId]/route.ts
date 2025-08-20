import { NextRequest } from 'next/server';
import { confluenceClient } from '@/lib/confluence';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> }
) {
  try {
    const { mediaId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const collection = searchParams.get('collection');
    
    console.log('Media request:', { mediaId, collection });
    
    // Construire l'URL de l'image Confluence
    const baseUrl = process.env.CONFLUENCE_BASE_URL;
    const pageId = collection?.replace('contentId-', '');
    
    // Récupérer tous les attachments de la page pour trouver le bon
    if (pageId) {
      try {
        console.log(`Getting all attachments for page ${pageId} to find mediaId: ${mediaId}`);
        
        // Utiliser l'API v1 pour récupérer les attachments de la page
        const attachmentsUrl = `${baseUrl}/wiki/rest/api/content/${pageId}/child/attachment?expand=download`;
        const attachmentsResponse = await fetch(attachmentsUrl, {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${process.env.CONFLUENCE_EMAIL}:${process.env.CONFLUENCE_API_KEY}`).toString('base64')}`,
            'Accept': 'application/json',
          },
        });
        
        console.log(`Attachments API response status: ${attachmentsResponse.status}`);
        
        if (attachmentsResponse.ok) {
          const attachmentsData = await attachmentsResponse.json();
          console.log(`Found ${attachmentsData.results?.length || 0} attachments`);
          
          // Chercher l'attachment qui correspond à notre mediaId
          // Le mediaId pourrait être dans différents champs ou dans les métadonnées
          const attachment = attachmentsData.results?.find((att: any) => {
            // Essayer l'ID direct
            if (att.id === mediaId) return true;
            
            // Essayer de chercher dans le titre/nom de fichier
            if (att.title?.includes(mediaId)) return true;
            
            // Essayer de chercher dans les métadonnées et extensions
            if (att.extensions?.fileId === mediaId) return true;
            if (att.extensions?.mediaApi?.fileId === mediaId) return true;
            
            // Recherche dans toute la structure JSON en dernier recours
            if (JSON.stringify(att).includes(mediaId)) return true;
            
            return false;
          });
          
          if (attachment) {
            console.log('Found matching attachment:', JSON.stringify(attachment, null, 2));
            
            // Essayer d'utiliser le lien de téléchargement
            if (attachment._links?.download) {
              const downloadUrl = attachment._links.download.startsWith('http') 
                ? attachment._links.download 
                : `${baseUrl}${attachment._links.download}`;
                
              console.log(`Found download URL: ${downloadUrl}`);
              
              const response = await fetch(downloadUrl, {
                headers: {
                  'Authorization': `Basic ${Buffer.from(`${process.env.CONFLUENCE_EMAIL}:${process.env.CONFLUENCE_API_KEY}`).toString('base64')}`,
                  'Accept': 'image/*,*/*',
                },
              });
              
              if (response.ok) {
                const contentType = response.headers.get('content-type') || 'image/png';
                const buffer = await response.arrayBuffer();
                
                console.log(`Successfully loaded attachment from: ${downloadUrl}`);
                
                return new Response(buffer, {
                  status: 200,
                  headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=86400',
                    'Access-Control-Allow-Origin': '*',
                  },
                });
              } else {
                console.log(`Download failed with status: ${response.status}`);
              }
            }
          } else {
            console.log('No matching attachment found for mediaId:', mediaId);
            console.log('Available attachments:', attachmentsData.results?.map((att: any) => ({
              id: att.id,
              title: att.title,
              filename: att.metadata?.mediaType
            })));
          }
        } else {
          const errorText = await attachmentsResponse.text();
          console.log(`Attachments API request failed: ${attachmentsResponse.status} - ${errorText}`);
        }
      } catch (error) {
        console.log('Failed to get attachments:', error);
      }
    }
    
    // Fallback: essayer les formats d'URL standards
    const urlsToTry = [];
    
    if (collection && pageId) {
      urlsToTry.push(
        `${baseUrl}/wiki/download/attachments/${pageId}/${mediaId}`,
        `${baseUrl}/wiki/download/thumbnails/${pageId}/${mediaId}`,
        `${baseUrl}/wiki/rest/api/content/${pageId}/child/attachment/${mediaId}/data`
      );
    }
    
    urlsToTry.push(
      `${baseUrl}/wiki/download/attachments/${mediaId}`,
      `${baseUrl}/wiki/download/thumbnails/${mediaId}`
    );
    
    console.log('Trying fallback URLs:', urlsToTry);
    
    // Essayer chaque URL jusqu'à ce qu'une fonctionne
    let response: Response | null = null;
    let successUrl = '';
    
    for (const mediaUrl of urlsToTry) {
      console.log('Trying URL:', mediaUrl);
      
      try {
        response = await fetch(mediaUrl, {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${process.env.CONFLUENCE_EMAIL}:${process.env.CONFLUENCE_API_KEY}`).toString('base64')}`,
            'Accept': 'image/*,*/*',
          },
        });
        
        console.log(`URL ${mediaUrl} returned status: ${response.status}`);
        
        if (response.ok) {
          successUrl = mediaUrl;
          break;
        }
      } catch (error) {
        console.log(`Failed to fetch ${mediaUrl}:`, error);
        continue;
      }
    }
    
    if (!response || !response.ok) {
      console.log('All URLs failed, returning fallback');
      // Si ça échoue, retourner une image de fallback
      return new Response(
        `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f3f4f6"/>
          <text x="50%" y="40%" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="14">
            Image Confluence
          </text>
          <text x="50%" y="50%" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="12">
            ID: ${mediaId}
          </text>
          <text x="50%" y="60%" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="10">
            Collection: ${collection || 'N/A'}
          </text>
          <text x="50%" y="70%" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="10">
            Status: ${response?.status || 'No Response'}
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
    
    // Récupérer le type de contenu de la réponse
    const contentType = response.headers.get('content-type') || 'image/png';
    const buffer = await response.arrayBuffer();
    
    console.log(`Successfully loaded media from: ${successUrl}`);
    
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache 24h
        'Access-Control-Allow-Origin': '*',
      },
    });
    
  } catch (error) {
    console.error('Error proxying media:', error);
    
    // Retourner une image d'erreur SVG
    return new Response(
      `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fef2f2"/>
        <text x="50%" y="45%" text-anchor="middle" fill="#dc2626" font-family="Arial" font-size="14">
          Erreur de chargement
        </text>
        <text x="50%" y="55%" text-anchor="middle" fill="#dc2626" font-family="Arial" font-size="12">
          Média Confluence
        </text>
        <text x="50%" y="65%" text-anchor="middle" fill="#f87171" font-family="Arial" font-size="10">
          ${mediaId}
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