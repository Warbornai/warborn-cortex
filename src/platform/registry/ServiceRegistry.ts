// Service Registry Mapping Internal Platform Services

export interface ServiceDescriptor {
  name: string;
  version: string;
  endpoint: string;
  status: 'healthy' | 'degraded' | 'offline';
}

export class ServiceRegistry {
  private services: Map<string, ServiceDescriptor> = new Map();

  constructor() {
    this.register('AI', '1.0.0', '/api/cortex/agent');
    this.register('Memory', '2.0.0', '/api/v1/intelligence/memory');
    this.register('Knowledge', '2.0.0', '/api/v1/intelligence/knowledge');
    this.register('Missions', '1.0.0', '/api/v1/intelligence/missions');
    this.register('Documents', '1.0.0', '/api/v1/intelligence/documents');
    this.register('Projects', '1.0.0', '/api/v1/projects');
  }

  public register(name: string, version: string, endpoint: string): void {
    this.services.set(name.toLowerCase(), {
      name,
      version,
      endpoint,
      status: 'healthy'
    });
  }

  public resolve(name: string): ServiceDescriptor | undefined {
    return this.services.get(name.toLowerCase());
  }

  public list(): ServiceDescriptor[] {
    return Array.from(this.services.values());
  }
}
