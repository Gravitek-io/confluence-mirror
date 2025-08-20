# Confluence to React

A Next.js application that displays and converts Confluence page content to React with modern styling.

## ✨ Features

- **Hybrid ADF rendering**: Combines beautiful ADF formatting with functional Storage images
- **Automatic table of contents**: Auto-generated TOC from page headings
- **Optimized images**: Proper Confluence image display with width constraints
- **Full support**: Text, headings, lists, tables, images, captions, macros
- **Server-side rendering**: Fast page loads with Next.js App Router

## 🚀 Installation

1. **Clone the project**
```bash
git clone <your-repo>
cd confluence-to-react
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configuration**
```bash
# Copy the example environment file
cp .env.example .env.local
```

## 🔧 Configuration

### 1. Create a Confluence API token

1. Log in to your Atlassian account
2. Go to **Account Settings** → **Security** → **API tokens**
3. Click **Create API token**
4. Give your token a name (e.g., "Confluence to React")
5. Copy the generated token

### 2. Configure environment variables

Edit the `.env.local` file with your information:

```env
# Base URL of your Confluence instance (without trailing slash)
CONFLUENCE_BASE_URL=https://your-domain.atlassian.net

# Email address of your Confluence account
CONFLUENCE_EMAIL=your.email@example.com

# Confluence API key (generate from Account Settings > Security > API tokens)
CONFLUENCE_API_KEY=your_confluence_api_key

# Public Confluence URL for links (same value as CONFLUENCE_BASE_URL)
NEXT_PUBLIC_CONFLUENCE_BASE_URL=https://your-domain.atlassian.net
```

## 🏃‍♂️ Getting Started

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

1. **Home page**: Enter a Confluence page URL or page ID
2. **Validation**: Click "Display page" to load the content
3. **Content display**: The page will be rendered using the hybrid ADF approach

## 🎯 Hybrid Rendering

The application uses a hybrid approach that offers the best experience:
- ✅ Perfect formatting with ADF (Atlas Document Format)
- ✅ Functional images from Storage format
- ✅ Interactive table of contents
- ✅ Full Confluence elements support

## 🛠️ Technical Architecture

### Main Components

- **`ConfluencePage`**: Main page component with hybrid rendering
- **`ADFRendererWithToc`**: Hybrid ADF rendering with TOC support
- **`ConfluenceImage`**: Optimized image component with Storage mapping
- **`TocProvider`**: React context for TOC management

### APIs

- **`/api/confluence-images/[pageId]`**: Image mappings extraction from Storage format

### Hybrid Approach

The main innovation is the hybrid approach that:
1. Uses the **ADF API** for structure and formatting (headings, text, lists...)
2. Extracts **image URLs** from the Confluence Storage format
3. **Maps** ADF image IDs to real Storage URLs
4. Generates **optimal rendering** combining advantages of both formats

## 🔍 Troubleshooting

### Images not displaying
- Check your Confluence credentials in `.env.local`
- Ensure your API token has proper permissions
- Try "HTML Storage" mode to verify connectivity

### Authentication errors
- Verify that `CONFLUENCE_EMAIL` matches your Atlassian account
- Regenerate a new API token if necessary
- Test the `CONFLUENCE_BASE_URL` in your browser

### Page not loading
- Check that the Confluence page URL is accessible
- Try with the page ID directly
- Check the development server logs

## 📚 Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Static typing
- **Tailwind CSS**: Utility-first CSS framework
- **Confluence API**: REST API v1 and v2
- **Atlas Document Format (ADF)**: Confluence native format

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.