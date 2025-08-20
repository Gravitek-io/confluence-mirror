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

export class ConfluenceApiError extends Error {
  public statusCode?: number;
  
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ConfluenceApiError';
    this.statusCode = statusCode;
  }
}

export class ConfluenceClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly email: string;

  constructor(baseUrl: string, email: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.email = email;
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}/wiki/rest/api/${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.email}:${this.apiKey}`).toString('base64')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data for confluence pages
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new ConfluenceApiError(
        `Confluence API Error: ${response.status} - ${errorBody}`,
        response.status
      );
    }

    return response.json();
  }

  async getPage(pageId: string, includeChildren: boolean = false): Promise<ConfluencePage> {
    const expandParams = ['body.storage', 'body.atlas_doc_format', 'version', 'space'];
    
    if (includeChildren) {
      expandParams.push('children.page');
    }
    
    return this.makeRequest<ConfluencePage>(
      `content/${pageId}?expand=${expandParams.join(',')}`
    );
  }

  async getChildPages(pageId: string): Promise<ConfluenceChildPage[]> {
    const response = await this.makeRequest<{
      results: ConfluenceChildPage[];
    }>(`content/${pageId}/child/page?expand=version,space`);
    
    return response.results;
  }

  async getCurrentUser(): Promise<any> {
    return this.makeRequest<any>('user/current');
  }

  /**
   * Extract page ID from Confluence URL
   * Supports formats like:
   * - https://your-domain.atlassian.net/wiki/spaces/SPACE/pages/123456/Page+Title
   * - https://your-domain.atlassian.net/wiki/pages/viewpage.action?pageId=123456
   */
  static extractPageIdFromUrl(url: string): string | null {
    // Pattern 1: /pages/123456/title format
    const match1 = url.match(/\/pages\/(\d+)(?:\/|$)/);
    if (match1) {
      return match1[1];
    }

    // Pattern 2: pageId=123456 query parameter
    const match2 = url.match(/[?&]pageId=(\d+)/);
    if (match2) {
      return match2[1];
    }

    return null;
  }
}