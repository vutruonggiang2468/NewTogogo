"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { SearchResultsPage } from "../viewdetails/[name]/components/tabs/SearchResultsPage";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const handleBack = () => {
    router.push("/");
  };

  const handleDetailedAnalysis = (stockCode: string) => {
    router.push(`/viewdetails/${stockCode}`);
  };

  return (
    <SearchResultsPage
      searchQuery={query}
      onBack={handleBack}
      onDetailedAnalysis={handleDetailedAnalysis}
    />
  );
}