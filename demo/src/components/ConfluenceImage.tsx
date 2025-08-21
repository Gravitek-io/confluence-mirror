"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ConfluenceImageProps {
  mediaId: string;
  collection?: string;
  pageId: string;
  alt: string;
}

export default function ConfluenceImage({
  mediaId,
  collection,
  pageId,
  alt,
}: ConfluenceImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadImageUrl() {
      try {
        console.log(
          `Loading image URL for mediaId: ${mediaId}, pageId: ${pageId}`
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
          setImageUrl(
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
          );
          setIsLoading(false);
          return;
        }

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
          console.log(`No mapping found for image ${mediaId}`);
          setHasError(true);
        }
      } catch (error) {
        console.error("Error loading image URL:", error);
        setHasError(true);
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

  if (hasError || !imageUrl || imageUrl === "") {
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
        <p className="text-sm text-gray-600 font-medium">Confluence Image</p>
        <p className="text-xs text-gray-500">ID: {mediaId}</p>
        {alt && <p className="text-xs text-gray-500">Alt: {alt}</p>}
      </div>
    );
  }

  // Get full size URL for click-to-open functionality
  const getFullSizeUrl = (url: string) => {
    if (pageId === "showroom") {
      // Return high-res version for Unsplash image
      return url.replace("w=1200&q=80", "w=2400&q=90");
    }
    // For Confluence images, return the same URL (already full size)
    return url;
  };

  const handleImageClick = () => {
    if (imageUrl) {
      window.open(getFullSizeUrl(imageUrl), "_blank", "noopener,noreferrer");
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
          src={imageUrl || "/placeholder.png"}
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
