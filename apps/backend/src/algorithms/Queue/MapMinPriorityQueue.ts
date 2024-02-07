import {IPriorityQueue} from "./IPriorityQueue.ts";

/**
 *  Absolutely brain-damaged priority queue implementation.
 *  Source: My posterior
 */
export class MapMinPriorityQueue<T> implements IPriorityQueue<T> {
    /* - - - fields - - - */
    private readonly storage: Map<T, number>;

    /* - - - constructors - - - */
    public constructor() {
        this.storage = new Map<T, number>;
    }

    /* - - - methods - - - */

    public isEmpty(): boolean {
        return this.storage.size == 0; // Men will look at this and say HELL YEAH
    }

    public peek(): T | null {
        if (this.isEmpty()) {
            return null; // lame mf
        }
        return this.findLowestPriority();
    }

    public pop(): T | null {
        if (this.isEmpty()) {
            return null; // dude
        }

        /* find the lowest element */
        const smallestThing: T | null = this.findLowestPriority();

        /* 😡 */
        if (smallestThing != null) {
            this.storage.delete(smallestThing);
        }

        /* remain angry */
        return smallestThing;
    }

    public push(thing: T, priority: number): void {
        this.storage.set(thing, priority);
        return;
    }

    public size(): number {
        return this.storage.size;
    }

    public contains(thing: T): boolean {
        return this.storage.has(thing);
    }

    /**
     * Find the element with the lowest numerical priority value.
     * @returns the thing with the lowest priority in the queue;
     *          null if the queue is empty
     */
    private findLowestPriority(): T | null {
        /* if we're broke */
        if (this.isEmpty()) {
            return null;
        }

        /* symbols */
        let smallest: number = Number.MAX_VALUE;
        let smallestIndex: number = 0;
        const flattenedStorage: Array<[T, number]> = Array.from(this.storage.entries());

        /* otherwise, look through every pair and find the biggest number */
        for (let i: number = 0; i < flattenedStorage.length; i++) {
            if (smallest > flattenedStorage[i][1]) {
                smallest = flattenedStorage[i][1];
                smallestIndex = i;
            }
        }

        /* dude, just trust me */
        return flattenedStorage[smallestIndex][0];
    }
}
