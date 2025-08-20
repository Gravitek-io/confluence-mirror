import React from 'react';
import ConfluenceImage from '@/components/confluence-image';
import { useToc, TableOfContents } from '@/lib/toc-context';

export interface ADFNode {
  type: string;
  attrs?: Record<string, any>;
  content?: ADFNode[];
  text?: string;
  marks?: Array<{
    type: string;
    attrs?: Record<string, any>;
  }>;
}

export interface ADFDocument {
  version: number;
  type: 'doc';
  content: ADFNode[];
}

interface RenderOptions {
  pageId: string;
}

export function renderADF(node: ADFNode | ADFDocument, key?: string | number, options?: RenderOptions): React.ReactNode {
  if (!node) return null;

  switch (node.type) {
    case 'doc':
      return (
        <div key={key} className="adf-document">
          {node.content?.map((child, index) => renderADF(child, index, options))}
        </div>
      );

    case 'paragraph':
      if (!node.content || node.content.length === 0) {
        return <p key={key} className="mb-4">&nbsp;</p>;
      }
      return (
        <p key={key} className="mb-4">
          {node.content?.map((child, index) => renderADF(child, index, options))}
        </p>
      );

    case 'heading':
      const level = node.attrs?.level || 1;
      const validLevel = Math.min(Math.max(level, 1), 6);
      const HeadingTag = `h${validLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      const headingClasses = {
        1: 'text-3xl font-bold mb-6',
        2: 'text-2xl font-bold mb-5',
        3: 'text-xl font-bold mb-4',
        4: 'text-lg font-bold mb-3',
        5: 'text-base font-bold mb-2',
        6: 'text-sm font-bold mb-2',
      };
      
      // Générer un ID pour l'ancrage
      const headingText = node.content?.map(child => 
        child.type === 'text' ? child.text : ''
      ).join('') || '';
      const headingId = headingText
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      
      return React.createElement(
        HeadingTag,
        { 
          key, 
          id: headingId,
          className: headingClasses[validLevel as keyof typeof headingClasses] || headingClasses[1] 
        },
        node.content?.map((child, index) => renderADF(child, index, options))
      );

    case 'text':
      const content = node.text || '';
      let element: React.ReactNode = content;

      // Apply text marks (bold, italic, etc.)
      if (node.marks) {
        node.marks.forEach(mark => {
          switch (mark.type) {
            case 'strong':
              element = <strong>{element}</strong>;
              break;
            case 'em':
              element = <em>{element}</em>;
              break;
            case 'code':
              element = <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{element}</code>;
              break;
            case 'strike':
              element = <del>{element}</del>;
              break;
            case 'underline':
              element = <u>{element}</u>;
              break;
            case 'link':
              element = (
                <a 
                  href={mark.attrs?.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {element}
                </a>
              );
              break;
          }
        });
      }

      return <React.Fragment key={key}>{element}</React.Fragment>;

    case 'bulletList':
      return (
        <ul key={key} className="list-disc list-inside mb-4 ml-4">
          {node.content?.map((child, index) => renderADF(child, index, options))}
        </ul>
      );

    case 'orderedList':
      return (
        <ol key={key} className="list-decimal list-inside mb-4 ml-4">
          {node.content?.map((child, index) => renderADF(child, index, options))}
        </ol>
      );

    case 'listItem':
      return (
        <li key={key} className="mb-2">
          {node.content?.map((child, index) => {
            // Pour les list items, on ne veut pas de margin bottom sur les paragraphes
            if (child.type === 'paragraph') {
              return (
                <span key={index}>
                  {child.content?.map((textChild, textIndex) => renderADF(textChild, textIndex, options))}
                </span>
              );
            }
            return renderADF(child, index, options);
          })}
        </li>
      );

    case 'blockquote':
      return (
        <blockquote key={key} className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700">
          {node.content?.map((child, index) => renderADF(child, index, options))}
        </blockquote>
      );

    case 'codeBlock':
      const language = node.attrs?.language || '';
      return (
        <pre key={key} className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
          <code className={language ? `language-${language}` : ''}>
            {node.content?.map(child => child.text).join('') || ''}
          </code>
        </pre>
      );

    case 'rule':
      return <hr key={key} className="my-6 border-gray-300" />;

    case 'hardBreak':
      return <br key={key} />;

    case 'caption':
      return (
        <div key={key} className="text-center italic text-gray-600 text-sm mt-2 mb-4">
          {node.content?.map((child, index) => renderADF(child, index, options))}
        </div>
      );

    case 'panel':
      const panelType = node.attrs?.panelType || 'info';
      const panelClasses = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        note: 'bg-gray-50 border-gray-200 text-gray-800',
      };
      
      return (
        <div key={key} className={`p-4 border rounded-lg my-4 ${panelClasses[panelType as keyof typeof panelClasses] || panelClasses.info}`}>
          {node.content?.map((child, index) => renderADF(child, index, options))}
        </div>
      );

    case 'table':
      return (
        <div key={key} className="overflow-x-auto my-4">
          <table className="min-w-full border-collapse border border-gray-300">
            {node.content?.map((child, index) => renderADF(child, index, options))}
          </table>
        </div>
      );

    case 'tableRow':
      return (
        <tr key={key}>
          {node.content?.map((child, index) => renderADF(child, index, options))}
        </tr>
      );

    case 'tableCell':
    case 'tableHeader':
      const Tag = node.type === 'tableHeader' ? 'th' : 'td';
      const cellClasses = node.type === 'tableHeader' 
        ? 'border border-gray-300 px-4 py-2 bg-gray-100 font-semibold'
        : 'border border-gray-300 px-4 py-2';
        
      return React.createElement(
        Tag,
        { key, className: cellClasses },
        node.content?.map((child, index) => renderADF(child, index, options))
      );

    case 'mediaSingle':
      const layout = node.attrs?.layout || 'center';
      
      const layoutClasses = {
        'center': 'mx-auto text-center max-w-full',
        'wrap-left': 'float-left mr-4 mb-4 max-w-full',
        'wrap-right': 'float-right ml-4 mb-4 max-w-full',
        'align-start': 'text-left max-w-full',
        'align-end': 'text-right max-w-full',
        'full-width': 'w-full max-w-full'
      };

      return (
        <div 
          key={key} 
          className={`my-6 ${layoutClasses[layout as keyof typeof layoutClasses] || layoutClasses.center}`}
        >
          {node.content?.map((child, index) => renderADF(child, index, options))}
        </div>
      );

    case 'media':
      const mediaId = node.attrs?.id;
      const mediaType = node.attrs?.type || 'file';
      const collection = node.attrs?.collection;
      const alt = node.attrs?.alt || 'Image Confluence';
      const mediaWidth = node.attrs?.width;
      const mediaHeight = node.attrs?.height;
      
      if (mediaType === 'file' && mediaId && options?.pageId) {
        // Utiliser le composant hybride avec le pageId
        return (
          <ConfluenceImage
            key={key}
            mediaId={mediaId}
            collection={collection}
            pageId={options.pageId}
            alt={alt}
          />
        );
      }
      
      // Fallback pour les médias non supportés
      return (
        <div key={key} className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="text-gray-500 mb-2">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 font-medium">Média Confluence</p>
          <p className="text-xs text-gray-500">ID: {mediaId}</p>
          <p className="text-xs text-gray-500">Type: {mediaType}</p>
        </div>
      );

    case 'mediaGroup':
      return (
        <div key={key} className="flex flex-wrap gap-4 my-6">
          {node.content?.map((child, index) => renderADF(child, index, options))}
        </div>
      );

    case 'extension':
      const extensionType = node.attrs?.extensionType || 'unknown';
      const extensionKey = node.attrs?.extensionKey || 'unknown';
      
      // Cas spécial pour la table des matières Confluence
      if (extensionType === 'com.atlassian.confluence.macro.core' && extensionKey === 'toc') {
        return <TableOfContents key={key} />;
      }
      
      return (
        <div key={key} className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
          <div className="flex items-center mb-2">
            <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span className="font-medium text-blue-800">Extension Confluence</span>
          </div>
          <p className="text-sm text-blue-700">
            <strong>Type:</strong> {extensionType}
          </p>
          <p className="text-sm text-blue-700">
            <strong>Clé:</strong> {extensionKey}
          </p>
          {node.content && node.content.length > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              {node.content.map((child, index) => renderADF(child, index, options))}
            </div>
          )}
        </div>
      );

    case 'table-of-contents':
    case 'toc':
      return <TableOfContents key={key} />;

    // Éléments non supportés - affichage de debug
    default:
      if (process.env.NODE_ENV === 'development') {
        return (
          <div key={key} className="bg-yellow-100 border border-yellow-300 p-2 rounded text-xs my-2">
            <strong>Type non supporté :</strong> {node.type}
            {node.content && (
              <div className="mt-1">
                {node.content.map((child, index) => renderADF(child, index, options))}
              </div>
            )}
          </div>
        );
      }
      
      // En production, essayer de rendre le contenu s'il existe
      if (node.content) {
        return (
          <div key={key}>
            {node.content.map((child, index) => renderADF(child, index, options))}
          </div>
        );
      }
      
      return null;
  }
}