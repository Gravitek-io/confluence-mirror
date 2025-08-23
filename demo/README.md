# Confluence Mirror

Transform your Confluence pages into beautiful React components! This project demonstrates how to seamlessly integrate Confluence content into modern web applications, bringing your documentation to life with native React rendering and Tailwind CSS styling.

## 🚀 Quick Start

```bash
# From the repository root
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the demo.

## 🎨 Features

- **Page Viewer**: Enter any Confluence page URL or ID to render it
- **Showroom**: Comprehensive showcase of all supported ADF elements
- **Live Examples**: See the library in action with real Confluence content

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the demo directory:

```env
# Your Confluence instance
CONFLUENCE_BASE_URL=https://your-domain.atlassian.net

# Your Atlassian account email
CONFLUENCE_EMAIL=your.email@domain.com

# Confluence API token (generate from Atlassian Account Settings)
CONFLUENCE_API_KEY=your_api_token_here
```

### Confluence API Setup

1. **Generate API Token**:

   - Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
   - Click "Create API token"
   - Name it "Confluence Mirror Demo"
   - Copy the generated token

2. **Test Connection**:
   - Start the demo app
   - Enter a valid Confluence page URL
   - If it loads, your configuration is correct!

## 📖 Demo Pages

### Home Page (`/`)

- **Page Input**: Enter Confluence URL or page ID
- **Live Rendering**: See your pages transformed instantly
- **Error Handling**: Clear feedback for invalid pages or auth issues

### Showroom (`/showroom`)

- **Complete Demo**: All supported ADF elements
- **Styling Examples**: See default Tailwind styles in action
- **Component Showcase**: Every feature of confluence-mirror-next

## 🎯 Implementation Examples

This project demonstrates how to build Confluence integration components:

```tsx
// All-in-one server component (see src/components/confluence/)
import ConfluenceMirrorServer from "@/components/confluence/ConfluenceMirrorServer";

<ConfluenceMirrorServer
  config={confluenceConfig}
  pageId={pageId}
  showNavigation={true}
/>
```

```tsx
// Individual components for custom layouts
import ConfluencePage from "@/components/confluence/ConfluencePage";
import NavigationTreeServer from "@/components/confluence/NavigationTreeServer";

<div className="grid grid-cols-4 gap-8">
  <NavigationTreeServer pageId={pageId} config={config} />
  <ConfluencePage pageId={pageId} config={config} />
</div>
```

## 🛠️ Development

### Project Structure

```
demo/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx         # Home page with form
│   │   ├── layout.tsx       # Root layout
│   │   └── showroom/
│   │       └── page.tsx     # Showroom demo
│   ├── components/
│   │   ├── confluence-form.tsx  # Page input form
│   │   └── showroom-content.tsx # Showroom content
│   └── lib/
│       └── confluence.ts    # Environment config
├── package.json
└── README.md
```

### Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Linting
npm run lint
```

### Deployment Options

**Vercel (Recommended)**:

```bash
# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard
# CONFLUENCE_BASE_URL, CONFLUENCE_EMAIL, CONFLUENCE_API_KEY
```

**Docker**:

```dockerfile
# Example Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔍 Troubleshooting

### Common Issues

**"Page not found" errors**:

- Verify the Confluence page exists and is accessible
- Check that your API token has read permissions
- Try with a page ID instead of URL

**Authentication failures**:

- Ensure `CONFLUENCE_EMAIL` matches your Atlassian account
- Regenerate your API token if it's expired
- Test the base URL in your browser

**Styling issues**:

- The demo includes Tailwind CSS setup
- Check `tailwind.config.js` for proper content paths
- Verify Next.js configuration is correct

**Performance issues**:

- Confluence pages with many images may load slowly
- Consider implementing pagination for large pages
- Use the `Suspense` boundary for better UX

### Debug Mode

Enable additional logging:

```bash
# Enable debug logs
DEBUG=confluence-mirror:* npm run dev
```

## 🎨 Customization

The demo shows how to customize confluence-mirror-next:

### Custom Styling

```tsx
// Override default styles
<ConfluencePage
  pageId={pageId}
  config={config}
  className="bg-gray-50 p-8 rounded-lg shadow-xl"
/>
```

### Custom Components

```tsx
// Use individual components
import { OptimizedADFRenderer, OptimizedTOC } from "@/components/confluence";

<div className="grid grid-cols-4 gap-6">
  <aside className="col-span-1">
    <OptimizedTOC items={tableOfContents} />
  </aside>
  <main className="col-span-3">
    <OptimizedADFRenderer document={document} pageId={pageId} />
  </main>
</div>;
```

## 📚 Learn More

- [confluence-mirror-next Documentation](../packages/next/README.md)
- [confluence-mirror-core Documentation](../packages/core/README.md)
- [Confluence REST API Docs](https://developer.atlassian.com/cloud/confluence/rest/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Contributing

Found a bug or want to improve the demo?

1. Fork the repository
2. Create a feature branch
3. Make your changes to the demo app
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT - Same as the main confluence-mirror packages.
