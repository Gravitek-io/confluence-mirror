import React from 'react';
import { TocItem } from '@/lib/toc-processor';

interface OptimizedTOCProps {
  items: TocItem[];
}

// Function to build a tree hierarchy (server-side)
function buildTocTree(flatItems: TocItem[]): TocItem[] {
  const tree: TocItem[] = [];
  const stack: TocItem[] = [];

  for (const item of flatItems) {
    const newItem: TocItem = { ...item };

    // Remove from stack all elements of higher or equal level
    while (stack.length > 0 && stack[stack.length - 1].level >= newItem.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      // Root element
      tree.push(newItem);
    } else {
      // This is simplified since we don't have children property in TocItem
      // In a full implementation, you'd need to extend TocItem or handle differently
      tree.push(newItem);
    }

    stack.push(newItem);
  }

  return tree;
}

// Component to display the table of contents (Server Component)
function TocDisplay({ items, level = 0 }: { items: TocItem[]; level?: number }) {
  if (items.length === 0) return null;

  return (
    <ul className={`space-y-1 ${level > 0 ? `ml-${level * 4}` : ''}`}>
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={`block text-sm hover:text-blue-600 transition-colors ${
              level === 0 ? 'font-semibold text-gray-900' : 'text-gray-700'
            }`}
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

// Main TOC component (Server Component)
export default function OptimizedTOC({ items }: OptimizedTOCProps) {
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-6">
        <div className="flex items-center mb-2">
          <svg
            className="h-5 w-5 text-gray-600 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          <span className="font-medium text-gray-800">Table of Contents</span>
        </div>
        <p className="text-sm text-gray-600">
          No headings detected on this page.
        </p>
      </div>
    );
  }

  const tree = buildTocTree(items);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
      <div className="flex items-center mb-3">
        <svg
          className="h-5 w-5 text-blue-600 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
        <span className="font-medium text-blue-800">Table of Contents</span>
      </div>
      <TocDisplay items={tree} />
    </div>
  );
}