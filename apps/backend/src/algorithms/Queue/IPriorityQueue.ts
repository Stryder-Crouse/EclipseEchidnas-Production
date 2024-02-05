/* Cool interface. Source: https://itnext.io/priority-queue-in-typescript-6ef23116901 */
export interface IPriorityQueue<T> {
    /* Put something on the priority queue */
    push(thing: T, priority: number): void;

    /* Check the highest priority item without removing it */
    peek(): T;

    /* Check and remove the highest priority item */
    pop(): T;

    /* Length of the priority queue */
    size(): number;

    /* true iff size() == 0 */
    isEmpty(): boolean;
}
