"use client";

import React, { createContext, useContext, useState } from "react";

export interface TocItem {
  id: string;
  title: string;
  level: number;
  children: TocItem[];
}

interface TocContextType {
  items: TocItem[];
  addItem: (item: Omit<TocItem, "children">) => void;
  clear: () => void;
}

const TocContext = createContext<TocContextType | null>(null);

export function TocProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<TocItem[]>([]);

  const addItem = React.useCallback((newItem: Omit<TocItem, "children">) => {
    setItems((prev) => [...prev, { ...newItem, children: [] }]);
  }, []);

  const clear = React.useCallback(() => {
    setItems([]);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      items,
      addItem,
      clear,
    }),
    [items, addItem, clear]
  );

  return (
    <TocContext.Provider value={contextValue}>{children}</TocContext.Provider>
  );
}

export function useToc() {
  const context = useContext(TocContext);
  if (!context) {
    return { items: [], addItem: () => {}, clear: () => {} };
  }
  return context;
}

// Function to build a tree hierarchy
export function buildTocTree(flatItems: TocItem[]): TocItem[] {
  const tree: TocItem[] = [];
  const stack: TocItem[] = [];

  for (const item of flatItems) {
    const newItem: TocItem = { ...item, children: [] };

    // Remove from stack all elements of higher or equal level
    while (stack.length > 0 && stack[stack.length - 1].level >= newItem.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      // Root element
      tree.push(newItem);
    } else {
      // Child of the last element with lower level
      stack[stack.length - 1].children.push(newItem);
    }

    stack.push(newItem);
  }

  return tree;
}

// Component to display the table of contents
interface TocDisplayProps {
  items: TocItem[];
  level?: number;
}

function TocDisplay({ items, level = 0 }: TocDisplayProps) {
  if (items.length === 0) return null;

  const paddingClass = level === 0 ? "" : `ml-${level * 4}`;

  return (
    <ul className={`space-y-1 ${paddingClass}`}>
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={`block text-sm hover:text-blue-600 transition-colors ${
              level === 0 ? "font-semibold text-gray-900" : "text-gray-700"
            }`}
          >
            {item.title}
          </a>
          {item.children.length > 0 && (
            <TocDisplay items={item.children} level={level + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

export function TableOfContents() {
  const { items } = useToc();

  // console.log("TableOfContents rendering with items:", items);

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
