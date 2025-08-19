import { ConfluenceClient } from './confluence-client';

if (!process.env.CONFLUENCE_API_KEY) {
  throw new Error('CONFLUENCE_API_KEY is required in environment variables');
}

if (!process.env.CONFLUENCE_BASE_URL) {
  throw new Error('CONFLUENCE_BASE_URL is required in environment variables');
}

if (!process.env.CONFLUENCE_EMAIL) {
  throw new Error('CONFLUENCE_EMAIL is required in environment variables');
}

export const confluenceClient = new ConfluenceClient(
  process.env.CONFLUENCE_BASE_URL,
  process.env.CONFLUENCE_EMAIL,
  process.env.CONFLUENCE_API_KEY
);