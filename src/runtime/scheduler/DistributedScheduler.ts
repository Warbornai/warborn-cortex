// Distributed Task Scheduler
import { QueueManager, Job } from '../queue/QueueManager';
import { WorkerRuntime } from '../workers/WorkerRuntime';

export class DistributedScheduler {
  private queue: QueueManager;
  private workers: WorkerRuntime;
  private intervalId?: NodeJS.Timeout;

  constructor() {
    this.queue = new QueueManager();
    this.workers = new WorkerRuntime();
  }

  public start(): void {
    // Background polling dispatcher loop
    this.intervalId = setInterval(() => {
      const job = this.queue.dequeue();
      if (job) {
        this.processJob(job);
      }
    }, 1000);
    console.log('[SCHEDULER] Distributed Task Scheduler started.');
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private async processJob(job: Job): Promise<void> {
    console.log(`[SCHEDULER] Dispatching job ${job.id} (${job.name})`);
    
    // Simulate async work processing
    setTimeout(() => {
      job.state = 'completed';
      console.log(`[SCHEDULER] Job ${job.id} completed successfully.`);
    }, 1500);
  }

  public submitJob(name: string, payload: any, priority?: 'low' | 'medium' | 'high' | 'critical'): Job {
    return this.queue.enqueue(name, payload, priority);
  }

  public getJobs(): Job[] {
    return this.queue.list();
  }

  public getWorkers(): any[] {
    return this.workers.list();
  }
}
