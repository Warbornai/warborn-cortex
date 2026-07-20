// Job Priority Queue Manager

export interface Job {
  id: string;
  name: string;
  payload: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
  state: 'queued' | 'running' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  createdAt: string;
}

export class QueueManager {
  private queue: Job[] = [];

  public enqueue(name: string, payload: any, priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'): Job {
    const job: Job = {
      id: `job-${Math.random().toString(36).substring(2, 11)}`,
      name,
      payload,
      priority,
      state: 'queued',
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date().toISOString()
    };
    this.queue.push(job);
    return job;
  }

  public dequeue(): Job | undefined {
    // Sort by priority weights: critical > high > medium > low
    const weights = { critical: 4, high: 3, medium: 2, low: 1 };
    const index = this.queue.findIndex(j => j.state === 'queued');
    if (index === -1) return undefined;

    const queuedJobs = this.queue
      .map((job, idx) => ({ job, idx }))
      .filter(x => x.job.state === 'queued')
      .sort((a, b) => weights[b.job.priority] - weights[a.job.priority]);

    if (queuedJobs.length === 0) return undefined;
    const targetIdx = queuedJobs[0].idx;
    this.queue[targetIdx].state = 'running';
    return this.queue[targetIdx];
  }

  public list(): Job[] {
    return this.queue;
  }

  public getJob(id: string): Job | undefined {
    return this.queue.find(j => j.id === id);
  }
}
