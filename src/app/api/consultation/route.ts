import { handleConsultationRequest } from "@/lib/consultation-handler";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleConsultationRequest(request);
}
