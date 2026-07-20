// Audit Logging System

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  status: 'allowed' | 'denied' | 'error';
  details?: any;
}

export class AuditLogger {
  private events: AuditEvent[] = [];

  public log(userId: string, action: string, status: 'allowed' | 'denied' | 'error', details?: any): void {
    const event: AuditEvent = {
      id: `audit-${Math.random().toString(36).substring(2, 11)}`,
      timestamp: new Date().toISOString(),
      userId,
      action,
      status,
      details
    };
    this.events.push(event);
    console.log(`[AUDIT LOG] User: ${userId} | Action: ${action} | Status: ${status}`);
  }

  public list(): AuditEvent[] {
    return this.events;
  }
}
