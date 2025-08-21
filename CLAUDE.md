# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Confluence Mirror** application built with Next.js 15, TypeScript, and TailwindCSS. The application allows users to fetch and display Confluence page content by entering either a page ID or URL.

### Key Features

- Confluence API v2 integration with secure API key authentication
- Support for both page ID and URL input formats
- Server-side rendering of Confluence pages
- Responsive design with TailwindCSS
- Error handling for API failures and invalid inputs

## Architecture

### Core Components

- `src/lib/confluence-client.ts` - Confluence API client with TypeScript types
- `src/lib/confluence.ts` - Configured client instance using environment variables
- `src/components/confluence-page.tsx` - Server component for displaying page content
- `src/components/confluence-form.tsx` - Client component for user input and validation
- `src/app/page.tsx` - Home page with form and conditional content display

### API Integration

- Uses Confluence REST API v2 with Bearer token authentication
- Supports both Atlas Document Format and Storage format content
- Extracts page IDs from various Confluence URL formats
- Base URL: `https://cmacgm.atlassian.net`

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Configuration

Required environment variables in `.env.local`:

```
CONFLUENCE_API_KEY=your_confluence_api_key
CONFLUENCE_BASE_URL=https://cmacgm.atlassian.net
```

## URL Format Support

The application supports multiple Confluence URL formats:

- Page ID: `3788636279`
- Modern URL: `https://cmacgm.atlassian.net/wiki/spaces/CA/pages/3788636279/Page+Title`
- Legacy URL: `https://cmacgm.atlassian.net/wiki/pages/viewpage.action?pageId=3788636279`

## Testing

Example page for testing:

- URL: `https://cmacgm.atlassian.net/wiki/spaces/CA/pages/3788636279`
- Page ID: `3788636279`

## Security Notes

- API credentials are stored in `.env.local` (gitignored)
- Bearer token authentication is used for all Confluence API calls
- Client-side validation prevents malformed requests
- Server-side error handling for API failures
