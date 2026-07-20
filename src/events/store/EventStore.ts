// Event Store & Snapshot replay
import { PlatformEvent } from '../bus/EventBus';

export class EventStore {
  private events: PlatformEvent[] = [];

  public append(event: PlatformEvent): void {
    this.events.push(event);
  }

  public read(topic: string): PlatformEvent[] {
    return this.events.filter(e => e.topic === topic);
  }

  public replay(topic: string, handler: (e: PlatformEvent) => void): void {
    const list = this.read(topic);
    list.forEach(handler);
  }
}
