// Context Episodic & Semantic Memory Manager
import { Memory } from '@warborn/types';

export class MemoryManager {
  private memories: Memory[] = [];

  constructor() {
    // Scaffold initial seed memories matching workspace data
    this.memories.push({
      id: 'mem-1',
      content: 'Alexander Rivera is the Principal UI Designer for Warborn Ecosystem.',
      type: 'semantic',
      timestamp: new Date().toISOString(),
      associatedKeywords: ['Alexander Rivera', 'UI', 'Designer']
    });
    this.memories.push({
      id: 'mem-2',
      content: 'Primary brand coloring tokens were locked to #fa5c12 primary orange.',
      type: 'semantic',
      timestamp: new Date().toISOString(),
      associatedKeywords: ['brand', 'color', 'tokens']
    });
  }

  public async store(content: string, type: 'episodic' | 'semantic' | 'procedural', associatedKeywords: string[] = []): Promise<Memory> {
    const memory: Memory = {
      id: `mem-${Math.random().toString(36).substring(2, 11)}
`,
      content,
      type,
      timestamp: new Date().toISOString(),
      associatedKeywords
    };
    this.memories.push(memory);
    return memory;
  }

  public async search(query: string): Promise<Memory[]> {
    const terms = query.toLowerCase().split(' ');
    return this.memories
      .map(m => {
        let score = 0;
        const text = m.content.toLowerCase();
        terms.forEach(t => {
          if (text.includes(t)) score += 2;
          m.associatedKeywords.forEach(k => {
            if (k.toLowerCase().includes(t)) score += 3;
          });
        });
        return { memory: m, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.memory);
  }
}
