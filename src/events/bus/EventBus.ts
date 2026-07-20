// Real-Time Event Bus Router

export interface PlatformEvent {
  id: string;
  type: string;
  topic: string;
  payload: any;
  timestamp: string;
  requestId?: string;
}

export class EventBus {
  private listeners: Map<string, ((event: PlatformEvent) => void)[]> = new Map();
  private history: PlatformEvent[] = [];

  public publish(type: string, topic: string, payload: any, requestId?: string): PlatformEvent {
    const event: PlatformEvent = {
      id: `evt-${Math.random().toString(36).substring(2, 11)}`,
      type,
      topic,
      payload,
      timestamp: new Date().toISOString(),
      requestId
    };
    this.history.push(event);
    console.log(`[EVENT BUS] [${topic}] Published: ${type}`);

    // Dynamic Topic Routing
    const topicListeners = this.listeners.get(topic) || [];
    topicListeners.forEach(listener => listener(event));

    const wildcardListeners = this.listeners.get('*') || [];
    wildcardListeners.forEach(listener => listener(event));

    return event;
  }

  public subscribe(topic: string, callback: (event: PlatformEvent) => void): () => void {
    const list = this.listeners.get(topic) || [];
    list.push(callback);
    this.listeners.set(topic, list);

    return () => {
      const active = this.listeners.get(topic) || [];
      const index = active.indexOf(callback);
      if (index > -1) {
        active.splice(index, 1);
        this.listeners.set(topic, active);
      }
    };
  }

  public getHistory(): PlatformEvent[] {
    return this.history;
  }
}
