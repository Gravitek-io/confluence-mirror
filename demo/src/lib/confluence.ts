// Demo app configuration for Confluence client
if (!process.env.CONFLUENCE_API_KEY) {
  throw new Error('CONFLUENCE_API_KEY is required in environment variables');
}

if (!process.env.CONFLUENCE_BASE_URL) {
  throw new Error('CONFLUENCE_BASE_URL is required in environment variables');
}

if (!process.env.CONFLUENCE_EMAIL) {
  throw new Error('CONFLUENCE_EMAIL is required in environment variables');
}

export const confluenceConfig = {
  baseUrl: process.env.CONFLUENCE_BASE_URL,
  email: process.env.CONFLUENCE_EMAIL,
  apiKey: process.env.CONFLUENCE_API_KEY
};