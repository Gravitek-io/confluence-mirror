"use client";

import { useRouter } from "next/navigation";
import ConfluenceForm from "@/components/confluence/ConfluenceForm";

interface ConfluenceFormDemoProps {
  initialPageId?: string;
}

export default function ConfluenceFormDemo({ initialPageId }: ConfluenceFormDemoProps) {
  const router = useRouter();

  const handlePageIdChange = (pageId: string) => {
    if (pageId) {
      router.push(`/?pageId=${pageId}`);
    } else {
      router.push("/");
    }
  };

  return (
    <ConfluenceForm
      initialPageId={initialPageId}
      onPageIdChange={handlePageIdChange}
    />
  );
}
