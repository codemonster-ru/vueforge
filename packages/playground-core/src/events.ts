export class Emitter<T> {
  private handlers = new Set<(payload: T) => void>();

  emit(payload: T): void {
    for (const handler of this.handlers) {
      handler(payload);
    }
  }

  subscribe(handler: (payload: T) => void): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  clear(): void {
    this.handlers.clear();
  }
}
