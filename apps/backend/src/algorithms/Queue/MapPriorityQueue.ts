import {IPriorityQueue} from "./IPriorityQueue.ts";

/**
 *  Absolutely brain-damaged priority queue implementation.
 *  Source: My posterior
 */
export class MapPriorityQueue<T> implements IPriorityQueue<T> {
    /* fields */
    private readonly storage: Map<T, number>;

    /* constructors */
    public constructor() {
        this.storage = new Map<T, number>;
    }

    /* methods */
    public isEmpty(): boolean {
        return this.storage.size == 0; // Men will look at this and say HELL YEAH
    }

    public peek(): T | null {
        return null;
    }

    public pop(): T | null {
        return null;
    }

    public push(thing: T, priority: number): void {
        console.log(thing);
        console.log(priority);
        return;
    }

    public size(): number {
        return 0;
    }

    private findHighestPriority(): T | null {
        /* if we're broke */
        if (this.isEmpty()) {
            return null;
        }

        /* otherwise, look through every pair and find the biggest number */
        return null;
    }
}
