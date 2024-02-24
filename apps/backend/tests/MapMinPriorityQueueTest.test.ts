import {expect, test} from "vitest";
import {IPriorityQueue} from "../../../packages/common/src/algorithms/Queue/IPriorityQueue.ts";
import {MapMinPriorityQueue} from "../../../packages/common/src/algorithms/Queue/MapMinPriorityQueue.ts";

/* - - - test definitions - - - */
/* isEmpty() */
function MapMinPQ_isEmpty_new(): void {
    /* make a queue */
    const queue: IPriorityQueue<string> = new MapMinPriorityQueue<string>();

    /* it better be empty */
    expect(queue.isEmpty()).toBe(true);
}

function MapMinPQ_isEmpty_one_element(): void {
    /* make a queue */
    const queue: IPriorityQueue<string> = new MapMinPriorityQueue<string>();

    /* add an item */
    queue.push("Yachie Kicchou", 0);

    /* it better NOT be empty */
    expect(queue.isEmpty()).toBe(false);
}

function MapMinPQ_isEmpty_removed(): void {
    /* make a queue */
    const queue: IPriorityQueue<string> = new MapMinPriorityQueue<string>();

    /* add an item */
    queue.push("Yachie Kicchou", 0);

    /* remove an item */
    const yachie: string | null = queue.pop();

    /* it better be empty */
    expect(queue.isEmpty()).toBe(true);
    expect(yachie).toBe("Yachie Kicchou");
}

/* size(), push(), and pop() */
function MapMinPQ_size_new(): void {
    /* make a queue */
    const queue: IPriorityQueue<string> = new MapMinPriorityQueue<string>();

    /* it better be empty */
    expect(queue.size()).toBe(0);
}

function MapMinPQ_size_two_elements(): void {
    /* make a queue */
    const queue: IPriorityQueue<string> = new MapMinPriorityQueue<string>();

    /* add an item */
    queue.push("Yachie Kicchou", 0);
    /* add an item */
    queue.push("Biten Son", 1);

    /* it better NOT be empty */
    expect(queue.size()).toBe(2);
}

function MapMinPQ_size_removed(): void {
    /* make a queue */
    const queue: IPriorityQueue<string> = new MapMinPriorityQueue<string>();

    /* add the Kiketsu Family 😊 */
    queue.push("Yachie Kicchou", 0);
    queue.push("Biten Son", 1);

    /* remove an item */
    const yachie: string | null = queue.pop();
    const biten: string | null = queue.pop();

    /* it better be empty */
    expect(queue.size()).toBe(0);
    expect(yachie).toBe("Yachie Kicchou");
    expect(biten).toBe("Biten Son");
}

/* peek() */
function MapMinPQ_peek_general(): void {
    /* make a queue */
    const queue: IPriorityQueue<string> = new MapMinPriorityQueue<string>();

    /* add the touhous */
    queue.push("Yachie Kicchou", 0);
    queue.push("Biten Son", 1);
    queue.push("Reisen Udongein Inaba", -1000);
    queue.push("Reimu Hakurei", -50);

    /* bnuuy */
    expect(queue.peek()).toBe("Reisen Udongein Inaba");
}

/* - - - test execution - - - */
/* isEmpty() */
test("A brand new queue is empty", MapMinPQ_isEmpty_new);
test("A queue with an element is not empty", MapMinPQ_isEmpty_one_element);
test("Removing the last element from the queue makes it empty", MapMinPQ_isEmpty_removed);

/* size(), push(), and pop() */
test("A brand new queue has size 0", MapMinPQ_size_new);
test("A queue with two elements has size 2", MapMinPQ_size_two_elements);
test("Removing the last element from the queue makes it empty", MapMinPQ_size_removed);

/* peek() */
test("General peek test", MapMinPQ_peek_general);

