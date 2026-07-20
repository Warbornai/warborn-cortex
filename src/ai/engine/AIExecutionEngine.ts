// Standardized AI Platform Execution Engine
import { ModelRegistry } from '../registry/ModelRegistry';
import { ProviderRegistry, AIResponse } from '../providers/ProviderRegistry';
import { ProviderRouter } from '../router/ProviderRouter';
import { ValidationError, TimeoutError } from '../errors/AIError';

export class AIExecutionEngine {
  private models: ModelRegistry;
  private providers: ProviderRegistry;
  private router: ProviderRouter;

  constructor() {
    this.models = new ModelRegistry();
    this.providers = new ProviderRegistry();
    this.router = new ProviderRouter(this.providers);
  }

  public async execute(modelId: string, prompt: string, options: { timeout?: number } = {}): Promise<AIResponse> {
    if (!prompt) {
      throw new ValidationError('Prompt query cannot be empty');
    }

    const model = this.models.getModel(modelId) || this.models.getModel('gemini-2.5-flash')!;
    const provider = this.router.route(model);

    const timeoutLimit = options.timeout || 10000;
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new TimeoutError('Request timed out after ' + timeoutLimit + 'ms')), timeoutLimit);
    });

    try {
      return await Promise.race([
        provider.execute(model, prompt),
        timeoutPromise
      ]);
    } catch (error: any) {
      console.error('[AI ENGINE ERROR] Failover fallback details:', error.message);
      const sim = this.providers.getProvider('mock-simulator')!;
      return sim.execute(model, prompt);
    }
  }
}
