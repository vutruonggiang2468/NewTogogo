import { getCompanyDetails } from "@/services/api";
import DetailedAnalysisPage from "./DetailedAnalysisPage";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const data = await getCompanyDetails(params.id);

  return <DetailedAnalysisPage id={params.id} data={data} />;
}
