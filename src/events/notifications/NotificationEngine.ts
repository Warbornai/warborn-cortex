// Notification dispatcher

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  level: 'info' | 'success' | 'warning' | 'error';
  userId?: string;
  timestamp: string;
}

export class NotificationEngine {
  private notifications: SystemNotification[] = [];

  public dispatch(title: string, message: string, level: 'info' | 'success' | 'warning' | 'error' = 'info', userId?: string): SystemNotification {
    const notif: SystemNotification = {
      id: `notif-${Math.random().toString(36).substring(2, 11)}`,
      title,
      message,
      level,
      userId,
      timestamp: new Date().toISOString()
    };
    this.notifications.push(notif);
    console.log(`[NOTIFICATION] [${level}] ${title}: ${message}`);
    return notif;
  }

  public list(userId?: string): SystemNotification[] {
    if (userId) {
      return this.notifications.filter(n => n.userId === userId || n.userId === undefined);
    }
    return this.notifications;
  }
}
