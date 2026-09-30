import { createSuccessResponse } from "@/lib/config";
import type { ApiResponse, NotificationItem } from "@/types";

const notifications: NotificationItem[] = [];

export async function pushNotification(userId: string, type: NotificationItem["type"], title: string, message: string) {
  const item: NotificationItem = {
    id: `notification_${Date.now()}`,
    userId,
    type,
    title,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };

  notifications.push(item);
  return item;
}

export async function listNotifications(userId: string): Promise<ApiResponse<{ notifications: NotificationItem[] }>> {
  return createSuccessResponse({
    notifications: notifications.filter((entry) => entry.userId === userId),
  });
}
