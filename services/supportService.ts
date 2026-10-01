import { createSuccessResponse } from "@/lib/config";
import type { ApiResponse, SupportTicket } from "@/types";

export async function createSupportTicket(payload: {
  userId: string;
  category: string;
  subject: string;
  description: string;
}): Promise<ApiResponse<{ ticket: SupportTicket }>> {
  const ticket: SupportTicket = {
    id: `ticket_${Date.now()}`,
    userId: payload.userId,
    category: payload.category,
    subject: payload.subject,
    description: payload.description,
    status: "open",
    priority: "medium",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return createSuccessResponse({ ticket });
}
