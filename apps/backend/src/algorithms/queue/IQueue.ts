/* Google Gary Pollice */
export interface IQueue<T> {
  push(thing: T): void;
  pop(): T | undefined;
}
