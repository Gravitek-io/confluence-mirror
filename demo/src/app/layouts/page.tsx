import { Suspense } from "react";
import Link from "next/link";
import ConfluenceMirrorServer from "@/components/confluence/ConfluenceMirrorServer";
import ConfluencePage from "@/components/confluence/ConfluencePage";
import NavigationTreeServer from "@/components/confluence/NavigationTreeServer";
import { confluenceConfig } from "@/lib/confluence";

interface LayoutsPageProps {
  searchParams: Promise<{ pageId?: string; url?: string }>;
}

export default async function LayoutsPage({ searchParams }: LayoutsPageProps) {
  const { pageId = "3788636279", url } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Layout Examples
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Comparison between all-in-one component vs flexible individual
            components
          </p>
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Example 1: All-in-one component */}
        <section className="mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Option 1: All-in-one Component
            </h2>
            <p className="text-gray-600 mb-4">
              Simple usage with predefined layout. Good for quick setup.
            </p>
            <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {`<ConfluenceMirrorServer 
  config={confluenceConfig}
  pageId={pageId}
  showNavigation={true}
/>`}
            </pre>
          </div>

          <Suspense
            fallback={
              <div className="animate-pulse bg-white h-96 rounded-lg"></div>
            }
          >
            <ConfluenceMirrorServer
              config={confluenceConfig}
              pageId={pageId}
              url={url}
              baseUrl="http://localhost:3000"
              showNavigation={true}
              navigationTitle="Child Pages"
            />
          </Suspense>
        </section>

        {/* Example 2: Custom Layout with Individual Components */}
        <section className="mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Option 2: Individual Components (Custom Layout)
            </h2>
            <p className="text-gray-600 mb-4">
              Full flexibility for custom layouts and styling. Mix and match as
              needed.
            </p>
            <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {`{/* Custom layout: Navigation on left, content on right */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-1 bg-purple-50 p-4 rounded-lg">
    <NavigationTreeServer 
      pageId={pageId} 
      config={confluenceConfig} 
      title="🗂️ Custom Navigation" 
    />
  </div>
  
  <div className="lg:col-span-2">
    <ConfluencePage 
      pageId={pageId} 
      config={confluenceConfig} 
      showHeader={false} 
    />
  </div>
</div>`}
            </pre>
          </div>

          <Suspense
            fallback={
              <div className="animate-pulse bg-white h-96 rounded-lg"></div>
            }
          >
            {/* Custom Layout Example */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-purple-50 p-4 rounded-lg">
                <NavigationTreeServer
                  pageId={pageId}
                  config={confluenceConfig}
                  title="🗂️ Custom Navigation"
                />
              </div>

              <div className="lg:col-span-2">
                <ConfluencePage
                  pageId={pageId}
                  config={confluenceConfig}
                  showHeader={false}
                />
              </div>
            </div>
          </Suspense>
        </section>

        {/* Example 3: Creative Layout */}
        <section>
          <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Option 3: Creative Layout Example
            </h2>
            <p className="text-gray-600 mb-4">
              Simple layout with only navigation in sidebar - no external TOC
              needed.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="animate-pulse bg-white h-96 rounded-lg"></div>
            }
          >
            {/* Creative Layout: Navigation seule dans une colonne */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-green-50 p-4 rounded-lg">
                <NavigationTreeServer
                  pageId={pageId}
                  config={confluenceConfig}
                  title="🧭 Navigation"
                />
              </div>

              <div className="lg:col-span-2">
                <ConfluencePage
                  pageId={pageId}
                  config={confluenceConfig}
                  showHeader={true}
                />
              </div>
            </div>
          </Suspense>
        </section>
      </div>
    </div>
  );
}
