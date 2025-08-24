// Core types for Confluence Mirror
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
  type: "doc";
  content: ADFNode[];
}

export interface ConfluencePage {
  id: string;
  title: string;
  body: {
    atlas_doc_format?: {
      value: string;
    };
    storage?: {
      value: string;
      representation: string;
    };
  };
  version: {
    number: number;
    when?: string;
    by?: {
      displayName: string;
      email?: string;
    };
  };
  space: {
    key: string;
    name: string;
  };
  _links: {
    webui: string;
  };
  children?: {
    page?: {
      results: ConfluenceChildPage[];
      size: number;
    };
  };
}

export interface ConfluenceChildPage {
  id: string;
  title: string;
  type: string;
  status: string;
  _links: {
    webui: string;
  };
}

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export class ConfluenceApiError extends Error {
  public statusCode?: number;
  
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ConfluenceApiError';
    this.statusCode = statusCode;
  }
}