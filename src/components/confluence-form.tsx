"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfluenceClient } from "@/lib/confluence-client";

interface ConfluenceFormProps {
  initialPageId?: string;
}

export default function ConfluenceForm({ initialPageId }: ConfluenceFormProps) {
  const [input, setInput] = useState(initialPageId || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      let pageId = input.trim();

      // If input looks like a URL, try to extract page ID
      if (pageId.includes("http")) {
        const extractedId = ConfluenceClient.extractPageIdFromUrl(pageId);
        if (!extractedId) {
          throw new Error(
            "Impossible d'extraire l'ID de la page à partir de cette URL. Veuillez utiliser un ID numérique ou une URL valide Confluence."
          );
        }
        pageId = extractedId;
      }

      // Validate that pageId is numeric
      if (!/^\d+$/.test(pageId)) {
        throw new Error("L'ID de page doit être numérique. Exemple: 123456");
      }

      // Update URL with pageId parameter
      router.push(`/?pageId=${pageId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de validation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setError("");
    router.push("/");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="pageInput"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              ID ou URL de la page Confluence
            </label>
            <input
              id="pageInput"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="123456 ou https://your-domain.atlassian.net/wiki/spaces/SPACE/pages/123456/Page+Title"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={isLoading}
            />
            <p className="mt-2 text-sm text-gray-500">
              Vous pouvez saisir soit l'ID numérique de la page, soit l'URL
              complète de la page Confluence.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Chargement...
                </>
              ) : (
                "Afficher la page"
              )}
            </button>

            {initialPageId && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Effacer
              </button>
            )}
          </div>
        </form>

        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Formats supportés :
          </h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>
              • ID numérique :{" "}
              <code className="bg-blue-100 px-1 rounded">123456</code>
            </li>
            <li>
              • URL moderne :{" "}
              <code className="bg-blue-100 px-1 rounded">
                https://domain.atlassian.net/wiki/spaces/SPACE/pages/123456/Title
              </code>
            </li>
            <li>
              • URL legacy :{" "}
              <code className="bg-blue-100 px-1 rounded">
                https://domain.atlassian.net/wiki/pages/viewpage.action?pageId=123456
              </code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
