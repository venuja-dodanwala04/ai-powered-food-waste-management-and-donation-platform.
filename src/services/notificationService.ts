import { Notification } from '../types';
import { MOCK_NOTIFICATIONS } from '../data/mockNotifications';

class NotificationService {
  private notifications: Notification[] = [...MOCK_NOTIFICATIONS];

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  markAsRead(id: string): void {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) notif.isRead = true;
  }

  markAllAsRead(): void {
    this.notifications.forEach((n) => (n.isRead = true));
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }
}

export const notificationService = new NotificationService();
