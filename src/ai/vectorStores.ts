export interface VectorItem {
  id: string;
  values: number[];
  metadata?: Record<string, unknown>;
}

export class InMemoryVectorDB {
  private store = new Map<string, VectorItem>();

  upsert(item: VectorItem) {
    this.store.set(item.id, item);
  }

  similaritySearch(vector: number[], topK = 5): VectorItem[] {
    const scored = Array.from(this.store.values()).map((v) => ({
      item: v,
      score: cosineSimilarity(v.values, vector),
    }));
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((s) => s.item);
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * (b[i] ?? 0), 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return normA && normB ? dot / (normA * normB) : 0;
}

import { Pinecone } from '@pinecone-database/pinecone';

export class LongTermVectorStore {
  private index;

  constructor(
    apiKey: string,
    environment: string,
    indexName: string,
  ) {
    const client = new Pinecone({ apiKey, environment });
    this.index = client.index(indexName);
  }

  async upsert(item: VectorItem) {
    await this.index.upsert([{ ...item }]);
  }

  async query(vector: number[], topK = 5) {
    const res = await this.index.query({
      vector,
      topK,
      includeMetadata: true,
    });
    return res.matches ?? [];
  }
}
