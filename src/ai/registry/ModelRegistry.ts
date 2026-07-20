// Model Registry Definition

export interface ModelDescriptor {
  id: string;
  name: string;
  contextWindow: number;
  streamingSupported: boolean;
  visionSupported: boolean;
  reasoningSupported: boolean;
}

export class ModelRegistry {
  private models: Map<string, ModelDescriptor> = new Map();

  constructor() {
    this.register({ id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', contextWindow: 1048576, streamingSupported: true, visionSupported: true, reasoningSupported: false });
    this.register({ id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', contextWindow: 2097152, streamingSupported: true, visionSupported: true, reasoningSupported: true });
    this.register({ id: 'gpt-4o', name: 'GPT-4o', contextWindow: 128000, streamingSupported: true, visionSupported: true, reasoningSupported: false });
    this.register({ id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', contextWindow: 200000, streamingSupported: true, visionSupported: true, reasoningSupported: false });
  }

  public register(model: ModelDescriptor): void {
    this.models.set(model.id, model);
  }

  public getModel(id: string): ModelDescriptor | undefined {
    return this.models.get(id);
  }

  public list(): ModelDescriptor[] {
    return Array.from(this.models.values());
  }
}
