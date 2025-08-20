'use client';

import React from 'react';
import { ADFNode, ADFDocument } from '@/lib/adf-renderer';

interface DebugHeadingsProps {
  document: ADFDocument;
}

// Fonction pour extraire et afficher tous les titres trouvés
function findAllHeadings(node: ADFNode | ADFDocument, headings: Array<{ level: number; title: string; type: string }> = []): Array<{ level: number; title: string; type: string }> {
  if (!node) return headings;

  if (node.type === 'heading' && node.content) {
    const level = node.attrs?.level || 1;
    const title = extractTextFromContent(node.content);
    headings.push({ level, title, type: node.type });
  }

  if (node.content) {
    node.content.forEach(child => findAllHeadings(child, headings));
  }

  return headings;
}

function extractTextFromContent(content: ADFNode[]): string {
  return content.map(node => {
    if (node.type === 'text' && node.text) {
      return node.text;
    }
    if (node.content) {
      return extractTextFromContent(node.content);
    }
    return '';
  }).join('');
}

export default function DebugHeadings({ document }: DebugHeadingsProps) {
  const headings = findAllHeadings(document);

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
      <h3 className="font-semibold text-yellow-800 mb-2">Debug: Titres trouvés dans le document</h3>
      {headings.length === 0 ? (
        <p className="text-yellow-700">Aucun titre trouvé dans le document ADF</p>
      ) : (
        <ul className="space-y-1">
          {headings.map((heading, index) => (
            <li key={index} className="text-yellow-700 text-sm">
              <span className="font-mono bg-yellow-100 px-1 rounded">H{heading.level}</span> 
              <span className="ml-2">{heading.title || '(titre vide)'}</span>
            </li>
          ))}
        </ul>
      )}
      <details className="mt-3 text-xs text-yellow-600">
        <summary className="cursor-pointer">Voir la structure complète du document</summary>
        <pre className="mt-2 p-2 bg-yellow-100 rounded overflow-auto max-h-40">
          {JSON.stringify(document, null, 2)}
        </pre>
      </details>
    </div>
  );
}