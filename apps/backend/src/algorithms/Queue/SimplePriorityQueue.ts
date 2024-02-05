import {IPriorityQueue} from "./IPriorityQueue.ts";

/**
 *  Absolutely miserable priority queue implementation
 *  Source:
 */
export class SimplePriorityQueue<T> implements IPriorityQueue<T> {
    isEmpty(): boolean {
        return false;
    }

    peek(): T {
        return undefined;
    }

    pop(): T {
        return undefined;
    }

    push(thing: T, priority: number): void {
    }

    size(): number {
        return 0;
    }

}
