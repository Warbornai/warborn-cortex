// Unified Cognitive Context Engine
import { MemoryManager } from '../memory/MemoryManager';
import { KnowledgeManager } from '../knowledge/KnowledgeManager';
import { EmbeddingEngine } from '../embeddings/EmbeddingEngine';
import { AIExecutionEngine } from '../../ai/engine/AIExecutionEngine';
import { AIResponse } from '../../ai/providers/ProviderRegistry';

export class ContextEngine {
  private memory: MemoryManager;
  private knowledge: KnowledgeManager;
  private embeddings: EmbeddingEngine;
  private ai: AIExecutionEngine;

  constructor(ai: AIExecutionEngine) {
    this.memory = new MemoryManager();
    this.knowledge = new KnowledgeManager();
    this.embeddings = new EmbeddingEngine();
    this.ai = ai;
  }

  public async executeEnriched(modelId: string, prompt: string): Promise<AIResponse> {
    const memories = await this.memory.search(prompt);
    const docs = await this.knowledge.search(prompt);

    const memoryContext = memories.map(m => `- Memory: ${m.content}`).join('\n');
    const knowledgeContext = docs.map(d => `- Document [${d.name}]: ${d.content}`).join('\n');

    const systemPrompt = `You are Warborn Cortex. Leverage the following cognitive context segment to fulfill requests:
[EPISODIC MEMORIES]
${memoryContext || 'No relevant memories retrieved.'}

[WORKSPACE KNOWLEDGE DOCS]
${knowledgeContext || 'No relevant guideline docs retrieved.'}
`;

    const mergedPrompt = `${systemPrompt}\n\n[USER REQUEST]\n${prompt}`;

    console.log('[CONTEXT ENRICHED] Request assembled. Sending query to AI engine...');
    return this.ai.execute(modelId, mergedPrompt);
  }
}
