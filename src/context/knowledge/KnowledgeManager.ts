// Context Knowledge Manager
import { KnowledgeDoc } from '@warborn/types';

export class KnowledgeManager {
  private documents: KnowledgeDoc[] = [];

  constructor() {
    this.documents.push({
      id: 'doc-1',
      name: 'Enterprise Design Guidelines',
      content: 'Every Warborn app must import @warborn/design-tokens to render colors and spacing variables.',
      size: 1024,
      embedStatus: 'completed'
    });
    this.documents.push({
      id: 'doc-2',
      name: 'SDK Handshake Handlers',
      content: 'Cortex Client SDK routes fetch handshakes to server port 3000 health check routes.',
      size: 512,
      embedStatus: 'completed'
    });
  }

  public async search(query: string): Promise<KnowledgeDoc[]> {
    const terms = query.toLowerCase().split(' ');
    return this.documents
      .map(d => {
        let score = 0;
        const text = (d.name + ' ' + d.content).toLowerCase();
        terms.forEach(t => {
          if (text.includes(t)) score += 2;
        });
        return { doc: d, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.doc);
  }
}
