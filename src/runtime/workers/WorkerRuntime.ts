// Asynchronous Workers Runtime Heartbeats

export interface WorkerNode {
  id: string;
  status: 'active' | 'offline';
  concurrencyLimit: number;
  activeCount: number;
  lastHeartbeat: string;
}

export class WorkerRuntime {
  private workers: Map<string, WorkerNode> = new Map();

  constructor() {
    this.register('worker-cpu-1', 4);
    this.register('worker-ai-1', 2);
  }

  public register(id: string, concurrencyLimit: number): WorkerNode {
    const node: WorkerNode = {
      id,
      status: 'active',
      concurrencyLimit,
      activeCount: 0,
      lastHeartbeat: new Date().toISOString()
    };
    this.workers.set(id, node);
    return node;
  }

  public heartbeat(id: string): void {
    const w = this.workers.get(id);
    if (w) {
      w.lastHeartbeat = new Date().toISOString();
      w.status = 'active';
    }
  }

  public list(): WorkerNode[] {
    return Array.from(this.workers.values());
  }
}
