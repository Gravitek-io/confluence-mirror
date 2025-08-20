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
  
  // Helper function to determine if a filename is an image or video
  function isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }
  
  function isVideoFile(filename: string): boolean {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv'];
    return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }
  
  // Pattern for extracting ALL attachments from Storage format
  // We'll then filter by file type
  const attachmentRegex = /<ri:attachment ri:filename="([^"]*)"[^>]*\/?>/gi;
  
  let match;
  let imageIndex = 0;
  let videoIndex = 0;
  let otherIndex = 0;
  const processedFiles = new Set<string>();
  
  // Extract all attachments and categorize them by file extension
  while ((match = attachmentRegex.exec(storageHtml)) !== null) {
    const filename = match[1];
    if (processedFiles.has(filename)) continue;
    processedFiles.add(filename);
    
    const fileUrl = `${baseUrl}/wiki/download/attachments/${pageId}/${encodeURIComponent(filename)}`;
    
    // Categorize by file type
    if (isImageFile(filename)) {
      imageMap[`image-${imageIndex}`] = fileUrl;
      imageMap[filename] = fileUrl;
      console.log(`Mapped image ${imageIndex}: ${filename} -> ${fileUrl}`);
      imageIndex++;
    } else if (isVideoFile(filename)) {
      imageMap[`video-${videoIndex}`] = fileUrl;
      imageMap[filename] = fileUrl;
      console.log(`Mapped video ${videoIndex}: ${filename} -> ${fileUrl}`);
      videoIndex++;
    } else {
      imageMap[`attachment-${otherIndex}`] = fileUrl;
      imageMap[filename] = fileUrl;
      console.log(`Mapped other attachment ${otherIndex}: ${filename} -> ${fileUrl}`);
      otherIndex++;
    }
  }
  
  return imageMap;
}