import NodeCache from "@cacheable/node-cache";
import type { ICache } from "./interfaces/ICache";

export class Cache<T> implements ICache<T> {
  private cache: NodeCache<T>;

  constructor(ttlSeconds: number) {
    this.cache = new NodeCache<T>({ stdTTL: ttlSeconds });
  }

  get(key: string): T | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: T): void {
    this.cache.set(key, value);
  }
}
