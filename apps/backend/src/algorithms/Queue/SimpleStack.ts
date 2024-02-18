import {IQueue} from "./IQueue.ts";

/*
 *  Absolutely miserable stack implementation
 *  Source: https://basarat.gitbook.io/algorithms/datastructures/queue
 */
export class SimpleStack<T> implements IQueue<T> {
    /* fields */
    private storage: Array<T>;

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
        return this.storage.pop();
    }

    // is the queue not empty
    public hasItems(): boolean {
        return this.storage.length > 0;
    }
}
