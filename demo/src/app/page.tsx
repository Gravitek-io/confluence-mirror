import { Suspense } from "react";
import Link from "next/link";
import { ConfluencePage } from "@gravitek/confluence-mirror-next";
import ConfluenceForm from "@/components/confluence-form";
import { confluenceConfig } from "@/lib/confluence";

interface HomeProps {
  searchParams: Promise<{ pageId?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { pageId } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Confluence Mirror
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Display your Confluence pages as React components with TailwindCSS
            styling.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/showroom"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              🎨 View Showroom
            </Link>
          </div>
        </div>

        <ConfluenceForm initialPageId={pageId} />

        {pageId && (
          <div className="mt-8 max-w-5xl mx-auto">
            <Suspense
              fallback={
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">
                    Loading Confluence page...
                  </p>
                </div>
              }
            >
              <ConfluencePage
                key={pageId}
                pageId={pageId}
                config={confluenceConfig}
              />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
