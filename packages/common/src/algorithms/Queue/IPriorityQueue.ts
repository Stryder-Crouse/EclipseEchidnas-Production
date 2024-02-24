/* Cool interface. Source: https://itnext.io/priority-queue-in-typescript-6ef23116901 */
export interface IPriorityQueue<T> {
    /**
     * Push a thing of type T with a numerical priority onto the queue.
     * @param thing the thing to push
     * @param priority the priority of the thing
     */
    push(thing: T, priority: number): void;

    /**
     * Check the highest priority item without removing it.
     * @returns the highest priority item; null if the queue is empty.
     */
    peek(): T | null;

    /**
     * Check and remove the highest priority item.
     * @returns the highest priority item; null if the queue is empty.
     */
    pop(): T | null;

    /**
     * Length of the priority queue.
     * @returns the length of the queue
     */
    size(): number;

    /**
     * Return true if the queue has no elements.
     * @returns true iff size() == 0;
     */
    isEmpty(): boolean;

    /**
     * Return true if the given thing is in the queue.
     * @param thing the thing to check
     * @returns true iff the thing is in the queue
     */
    contains(thing: T): boolean;
}
