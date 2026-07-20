import { ProviderRegistry, AIProvider } from '../providers/ProviderRegistry';
import { ModelDescriptor } from '../registry/ModelRegistry';
import { ModelUnavailableError } from '../errors/AIError';

export class ProviderRouter {
  private registry: ProviderRegistry;

  constructor(registry: ProviderRegistry) {
    this.registry = registry;
  }

  public route(model: ModelDescriptor): AIProvider {
    const gemini = this.registry.getProvider('google-gemini');
    if (gemini && gemini.isAvailable()) {
      return gemini;
    }

    const sim = this.registry.getProvider('mock-simulator');
    if (sim) {
      return sim;
    }

    throw new ModelUnavailableError('No providers available to handle model: ' + model.id);
  }
}
