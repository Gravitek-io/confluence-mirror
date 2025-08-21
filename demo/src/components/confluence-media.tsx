"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ConfluenceMediaProps {
  mediaId: string;
  collection?: string;
  pageId: string;
  alt: string;
}

// Static counters per page to track media element order
const mediaCounters: Record<string, number> = {};

export default function ConfluenceMedia({
  mediaId,
  collection,
  pageId,
  alt,
}: ConfluenceMediaProps) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'unknown'>('unknown');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mediaIndex] = useState(() => {
    if (!mediaCounters[pageId]) {
      mediaCounters[pageId] = 0;
    }
    return mediaCounters[pageId]++;
  });

  useEffect(() => {
    async function loadMediaUrl() {
      try {
        console.log(
          `Loading media URL for mediaId: ${mediaId}, pageId: ${pageId}`
        );

        // Ensure pageId is a string
        if (!pageId || typeof pageId !== "string") {
          console.error("Invalid pageId:", pageId, typeof pageId);
          setHasError(true);
          return;
        }

        // Handle special case for showroom page
        if (pageId === "showroom") {
          console.log("Showroom page detected, using Unsplash demo image");
          setMediaUrl(
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
          );
          setMediaType('image');
          setIsLoading(false);
          return;
        }

        // Fetch attachment mappings for this page
        const response = await fetch(`/api/confluence-images/${pageId}`);

        if (!response.ok) {
          throw new Error(`Failed to load attachment mappings: ${response.status}`);
        }

        const attachmentMap: Record<string, string> = await response.json();
        console.log("Attachment mappings for page", pageId, ":", attachmentMap);

        // Try to find the corresponding attachment
        let foundUrl = null;
        let detectedType: 'image' | 'video' | 'unknown' = 'unknown';

        console.log(`Media element ${mediaIndex}: Looking for media ${mediaId} in attachment map:`, Object.keys(attachmentMap));
        
        // Try multiple matching strategies in order of preference
        const possibleKeys = [
          // 1. Try exact mediaId match first
          mediaId,
          // 2. Try sequential mapping based on media element order (PRIORITY)
          `image-${mediaIndex}`,
          `video-${mediaIndex}`,
          `attachment-${mediaIndex}`,
          // 3. Try partial ID matching
          ...Object.keys(attachmentMap).filter((key) =>
            key.includes(mediaId.substring(0, 8))
          ),
          // 4. Try filename matches (lower priority to avoid conflicts)
          ...Object.keys(attachmentMap).filter(key => 
            !key.startsWith('image-') && !key.startsWith('video-') && !key.startsWith('attachment-')
          ),
          // 5. Finally try all other indexed keys as fallback
          ...Object.keys(attachmentMap).filter(key => 
            (key.startsWith('image-') || key.startsWith('video-') || key.startsWith('attachment-')) &&
            key !== `image-${mediaIndex}` && key !== `video-${mediaIndex}` && key !== `attachment-${mediaIndex}`
          ).sort(),
        ];

        console.log(`Media element ${mediaIndex}: Trying keys:`, possibleKeys);
        
        for (const key of possibleKeys) {
          if (attachmentMap[key]) {
            foundUrl = attachmentMap[key];
            console.log(`Media element ${mediaIndex}: Found media mapping: ${mediaId} -> ${foundUrl} via key "${key}"`);
            
            // Detect media type based on URL/filename
            const urlLower = foundUrl.toLowerCase();
            if (urlLower.includes('.mp4') || urlLower.includes('.webm') || urlLower.includes('.ogg') || urlLower.includes('.mov') || urlLower.includes('.avi')) {
              detectedType = 'video';
              console.log(`Media element ${mediaIndex}: Detected as video: ${foundUrl}`);
            } else if (urlLower.includes('.jpg') || urlLower.includes('.jpeg') || urlLower.includes('.png') || urlLower.includes('.gif') || urlLower.includes('.webp') || urlLower.includes('.bmp')) {
              detectedType = 'image';
              console.log(`Media element ${mediaIndex}: Detected as image: ${foundUrl}`);
            } else {
              // Default to image if we can't determine
              detectedType = 'image';
              console.log(`Media element ${mediaIndex}: Defaulted to image: ${foundUrl}`);
            }
            break;
          }
        }
        
        console.log(`Final result for ${mediaId}: url=${foundUrl}, type=${detectedType}`);

        // If not found, try to use the first available attachment as fallback (only for images)
        if (!foundUrl) {
          const availableUrls = Object.entries(attachmentMap);
          for (const [key, url] of availableUrls) {
            const urlLower = url.toLowerCase();
            if (urlLower.includes('.jpg') || urlLower.includes('.jpeg') || urlLower.includes('.png') || urlLower.includes('.gif') || urlLower.includes('.webp') || urlLower.includes('.bmp')) {
              foundUrl = url;
              detectedType = 'image';
              console.log(`Using fallback image for ${mediaId}:`, foundUrl);
              break;
            }
          }
        }

        if (foundUrl) {
          setMediaUrl(foundUrl);
          setMediaType(detectedType);
        } else {
          console.log(`No mapping found for media ${mediaId}`);
          setHasError(true);
        }
      } catch (error) {
        console.error("Error loading media URL:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadMediaUrl();
  }, [mediaId, collection, pageId]);

  if (isLoading) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }

  if (hasError || !mediaUrl || mediaUrl === "") {
    return (
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <div className="text-gray-500 mb-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-600 font-medium">Confluence Media</p>
        <p className="text-xs text-gray-500">ID: {mediaId}</p>
        {alt && <p className="text-xs text-gray-500">Alt: {alt}</p>}
      </div>
    );
  }

  // Render video
  if (mediaType === 'video') {
    return (
      <div className="max-w-full overflow-hidden flex justify-center my-6">
        <video
          className="rounded-lg shadow-sm max-w-full h-auto"
          controls
          preload="metadata"
          style={{ maxWidth: "100%", height: "auto" }}
        >
          <source src={mediaUrl} />
          <p className="text-gray-600">
            Your browser does not support the video tag. 
            <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
              Download the video
            </a>
          </p>
        </video>
      </div>
    );
  }

  // Render image (existing functionality)
  const getFullSizeUrl = (url: string) => {
    if (pageId === "showroom") {
      // Return high-res version for Unsplash image
      return url.replace("w=1200&q=80", "w=2400&q=90");
    }
    // For Confluence images, return the same URL (already full size)
    return url;
  };

  const handleImageClick = () => {
    if (mediaUrl) {
      window.open(getFullSizeUrl(mediaUrl), "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className="max-w-full overflow-hidden flex justify-center"
      style={{ maxWidth: "100%" }}
    >
      <div
        className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
        onClick={handleImageClick}
        title="Click to open full size image in new tab"
      >
        <Image
          src={mediaUrl || "/placeholder.png"}
          alt={alt}
          className="rounded-lg shadow-sm hover:shadow-lg transition-shadow"
          onError={() => setHasError(true)}
          unoptimized={true}
          width={1000}
          height={800}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
}