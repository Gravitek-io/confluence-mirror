"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ConfluenceImageHybridProps {
  mediaId: string;
  collection?: string;
  pageId: string;
  alt: string;
}

export default function ConfluenceImageHybrid({
  mediaId,
  collection,
  pageId,
  alt,
}: ConfluenceImageHybridProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadImageUrl() {
      try {
        console.log(
          `Loading image URL for mediaId: ${mediaId}, pageId: ${pageId}`
        );

        // Récupérer les mappings d'images pour cette page
        const response = await fetch(`/api/confluence-images/${pageId}`);

        if (!response.ok) {
          throw new Error(`Failed to load image mappings: ${response.status}`);
        }

        const imageMap: Record<string, string> = await response.json();
        console.log("Image mappings for page", pageId, ":", imageMap);

        // Essayer de trouver l'image correspondante
        let foundUrl = null;

        // Essayer plusieurs stratégies de matching
        const possibleKeys = [
          mediaId,
          `image-${mediaId}`,
          ...Object.keys(imageMap).filter((key) =>
            key.includes(mediaId.substring(0, 8))
          ),
        ];

        for (const key of possibleKeys) {
          if (imageMap[key]) {
            foundUrl = imageMap[key];
            console.log(`Found image mapping: ${mediaId} -> ${foundUrl}`);
            break;
          }
        }

        // Si pas trouvé, utiliser la première image disponible comme fallback
        if (!foundUrl) {
          const availableUrls = Object.values(imageMap);
          if (availableUrls.length > 0) {
            foundUrl = availableUrls[0];
            console.log(`Using fallback image for ${mediaId}:`, foundUrl);
          }
        }

        if (foundUrl) {
          setImageUrl(foundUrl);
        } else {
          // Fallback vers l'ancienne méthode
          const fallbackUrl = `/api/media/${mediaId}${
            collection ? `?collection=${encodeURIComponent(collection)}` : ""
          }`;
          setImageUrl(fallbackUrl);
          console.log(`No mapping found, using fallback: ${fallbackUrl}`);
        }
      } catch (error) {
        console.error("Error loading image URL:", error);
        // Fallback vers l'ancienne méthode
        const fallbackUrl = `/api/media/${mediaId}${
          collection ? `?collection=${encodeURIComponent(collection)}` : ""
        }`;
        setImageUrl(fallbackUrl);
      } finally {
        setIsLoading(false);
      }
    }

    loadImageUrl();
  }, [mediaId, collection, pageId]);

  if (isLoading) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }

  if (hasError || !imageUrl) {
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-600 font-medium">Image Confluence</p>
        <p className="text-xs text-gray-500">ID: {mediaId}</p>
        {alt && <p className="text-xs text-gray-500">Alt: {alt}</p>}
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden flex justify-center" style={{ maxWidth: "100%" }}>
      <Image
        src={imageUrl}
        alt={alt}
        width={600}
        height={400}
        className="rounded-lg shadow-sm"
        onError={() => setHasError(true)}
        unoptimized={true}
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
}
