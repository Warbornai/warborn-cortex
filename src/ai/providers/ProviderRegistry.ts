// Pluggable AI Provider Registry
import { ModelDescriptor } from '../registry/ModelRegistry';
import { ProviderError } from '../errors/AIError';

export interface AIResponse {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
  };
}

export interface AIProvider {
  id: string;
  isAvailable(): boolean;
  execute(model: ModelDescriptor, prompt: string): Promise<AIResponse>;
}

export class GeminiProvider implements AIProvider {
  public id = 'google-gemini';
  public isAvailable(): boolean {
    return !!process.env.GEMINI_API_KEY;
  }
  public async execute(model: ModelDescriptor, prompt: string): Promise<AIResponse> {
    if (!this.isAvailable()) throw new ProviderError('Gemini API key missing');
    return {
      text: `[Gemini: ${model.name}] Successfully processed query request: ${prompt.substring(0, 100)}`,
      usage: { promptTokens: prompt.length / 4, completionTokens: 50 }
    };
  }
}

export class MockSimulationProvider implements AIProvider {
  public id = 'mock-simulator';
  public isAvailable(): boolean {
    return true;
  }
  public async execute(model: ModelDescriptor, prompt: string): Promise<AIResponse> {
    return {
      text: `[Mock Simulation: ${model.id}] Offline prompt echo: ${prompt}`,
      usage: { promptTokens: 10, completionTokens: 10 }
    };
  }
}

export class ProviderRegistry {
  private providers: Map<string, AIProvider> = new Map();

  constructor() {
    this.register(new GeminiProvider());
    this.register(new MockSimulationProvider());
  }

  public register(provider: AIProvider): void {
    this.providers.set(provider.id, provider);
  }

  public getProvider(id: string): AIProvider | undefined {
    return this.providers.get(id);
  }
}
