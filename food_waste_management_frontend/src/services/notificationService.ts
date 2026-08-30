import { Notification } from '../types';
import { apiRequest } from './apiClient';

interface NotificationApiItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: Notification['type'];
  is_read: boolean;
  action_url?: string;
  action_label?: string;
  created_at: string;
}

const toNotification = (n: NotificationApiItem): Notification => ({
  id: n.id,
  userId: n.user_id,
  title: n.title,
  message: n.message,
  type: n.type,
  isRead: n.is_read,
  actionUrl: n.action_url,
  actionLabel: n.action_label,
  createdAt: n.created_at,
});

class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    const res = await apiRequest<{ items: NotificationApiItem[] }>('/notifications?limit=100');
    return res.items.map(toNotification);
  }

  async markAsRead(id: string): Promise<void> {
    await apiRequest(`/notifications/${id}`, { method: 'PATCH', body: JSON.stringify({ is_read: true }) });
  }

  async markAllAsRead(): Promise<void> {
    await apiRequest('/notifications/mark-all-read', { method: 'POST' });
  }

  async getUnreadCount(): Promise<number> {
    const items = await this.getNotifications();
    return items.filter((n) => !n.isRead).length;
  }
}

export const notificationService = new NotificationService();
