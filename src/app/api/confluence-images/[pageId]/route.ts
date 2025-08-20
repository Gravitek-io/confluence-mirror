import { NextRequest } from 'next/server';
import { confluenceClient } from '@/lib/confluence';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    console.log('Extracting image mappings for page:', pageId);
    
    // Récupérer la page avec le contenu Storage
    const page = await confluenceClient.getPage(pageId);
    
    if (!page.body.storage?.value) {
      throw new Error('No storage format content available for this page');
    }
    
    const storageHtml = page.body.storage.value;
    console.log('Got storage format HTML for image extraction, length:', storageHtml.length);
    
    // Extraire les mappings d'images du format Storage
    const imageMap = extractImageMappings(storageHtml, pageId);
    
    console.log('Extracted image mappings:', imageMap);
    
    return Response.json(imageMap, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache 1h
      },
    });
    
  } catch (error) {
    console.error('Error extracting image mappings:', error);
    
    return Response.json(
      { 
        error: 'Failed to extract image mappings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function extractImageMappings(storageHtml: string, pageId: string): Record<string, string> {
  const imageMap: Record<string, string> = {};
  const baseUrl = process.env.CONFLUENCE_BASE_URL;
  
  if (!baseUrl) {
    console.error('CONFLUENCE_BASE_URL not configured');
    return imageMap;
  }
  
  // Pattern pour extraire les images du format Storage
  // Format: <ac:image ac:width="XXX">...<ri:attachment ri:filename="image.png"/>...</ac:image>
  const imageRegex = /<ac:image[^>]*>[\s\S]*?<ri:attachment ri:filename="([^"]*)"[^>]*\/?>[\s\S]*?<\/ac:image>/gi;
  
  let match;
  let imageIndex = 0;
  
  while ((match = imageRegex.exec(storageHtml)) !== null) {
    const filename = match[1];
    const imageUrl = `${baseUrl}/wiki/download/attachments/${pageId}/${encodeURIComponent(filename)}`;
    
    // Créer plusieurs clés possibles pour le mapping
    // Les UUIDs des images ADF peuvent ne pas correspondre directement aux noms de fichiers
    imageMap[`image-${imageIndex}`] = imageUrl;
    imageMap[filename] = imageUrl;
    
    console.log(`Mapped image ${imageIndex}: ${filename} -> ${imageUrl}`);
    imageIndex++;
  }
  
  return imageMap;
}