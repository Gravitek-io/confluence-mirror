'use client';

import React from 'react';
import Image from 'next/image';

interface OptimizedMediaProps {
  url: string;
  type: 'image' | 'video' | 'unknown';
  alt: string;
  pageId: string;
}

// Optimized media component with pre-processed URLs
export default function OptimizedMedia({ url, type, alt, pageId }: OptimizedMediaProps) {
  // Handle special case for showroom page
  if (pageId === 'showroom') {
    const showroomImageUrl = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80";
    
    const getFullSizeUrl = (imageUrl: string) => {
      return imageUrl.replace("w=1200&q=80", "w=2400&q=90");
    };

    return (
      <div className="max-w-full overflow-hidden flex justify-center">
        <div
          className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => window.open(getFullSizeUrl(showroomImageUrl), "_blank", "noopener,noreferrer")}
          title="Click to open full size image in new tab"
        >
          <Image
            src={showroomImageUrl}
            alt={alt}
            className="rounded-lg shadow-sm hover:shadow-lg transition-shadow"
            unoptimized={true}
            width={1000}
            height={800}
            className="max-w-full h-auto"
          />
        </div>
      </div>
    );
  }

  // Render video
  if (type === 'video') {
    return (
      <div className="max-w-full overflow-hidden flex justify-center my-6">
        <video
          className="rounded-lg shadow-sm max-w-full h-auto"
          controls
          preload="metadata"
          className="max-w-full h-auto"
        >
          <source src={url} />
          <p className="text-gray-600">
            Your browser does not support the video tag. 
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline ml-1"
            >
              Download the video
            </a>
          </p>
        </video>
      </div>
    );
  }

  // Render image (default)
  const getFullSizeUrl = (imageUrl: string) => {
    // For Confluence images, return the same URL (already full size)
    return imageUrl;
  };

  return (
    <div className="max-w-full overflow-hidden flex justify-center">
      <div
        className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
        onClick={() => window.open(getFullSizeUrl(url), "_blank", "noopener,noreferrer")}
        title="Click to open full size image in new tab"
      >
        <Image
          src={url}
          alt={alt}
          className="rounded-lg shadow-sm hover:shadow-lg transition-shadow"
          unoptimized={true}
          width={1000}
          height={800}
          className="max-w-full h-auto"
        />
      </div>
    </div>
  );
}