"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ConfluenceImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  mediaId: string;
}

export default function ConfluenceImage({
  src,
  alt,
  width,
  height,
  mediaId,
}: ConfluenceImageProps) {
  const [hasError, setHasError] = useState(false);

  // Ne pas rendre si src est vide
  if (!src || src.trim() === "") {
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
        <p className="text-xs text-gray-500">Src: Vide</p>
        {alt && <p className="text-xs text-gray-500">Alt: {alt}</p>}
      </div>
    );
  }

  if (hasError) {
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
    <Image
      src={src}
      alt={alt}
      width={width || 600}
      height={height || 400}
      className="rounded-lg shadow-sm object-contain h-auto w-auto"
      onError={() => setHasError(true)}
      unoptimized={true}
    />
  );
}
