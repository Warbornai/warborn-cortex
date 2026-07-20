// Vector Embedding & Cosine Similarity search engine

export class EmbeddingEngine {
  public async getEmbedding(text: string): Promise<number[]> {
    // Generate a pseudo-deterministic vector based on string characters
    const vector = Array.from({ length: 128 }, (_, i) => {
      let sum = 0;
      for (let j = 0; j < text.length; j++) {
        sum += text.charCodeAt(j) * (i + 1);
      }
      return Math.sin(sum) * 0.5 + 0.5;
    });
    return this.normalize(vector);
  }

  private normalize(v: number[]): number[] {
    const mag = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
    return mag === 0 ? v : v.map(val => val / mag);
  }

  public cosineSimilarity(v1: number[], v2: number[]): number {
    if (v1.length !== v2.length) return 0;
    return v1.reduce((sum, val, i) => sum + val * v2[i], 0);
  }
}
