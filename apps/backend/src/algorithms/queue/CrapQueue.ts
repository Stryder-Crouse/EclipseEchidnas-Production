import { IQueue } from "./IQueue.ts";

/* Absolutely miserable queue implementation */
export class CrapQueue<T> implements IQueue<T> {
  /* fields */
  private storage: T[];

  /* constructor */
  public constructor() {
    this.storage = new Array<T>();
  }

  /* methods */
  // push onto the queue daddy :sob:
  public push(thing: T) {
    this.storage.push(thing);
    return;
  }

  // pop from the queue 😠
  public pop(): T | undefined {
    return this.storage.shift();
  }
}
