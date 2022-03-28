import type Root from '../nodes/root';
import type Middle from '../nodes/middle';
import type Child from '../nodes/child';

import {actionIsActive} from '.';

const SOURCE_CLASS_NAME = 'focused';
const ANCESTOR_CLASS_NAME = 'focused-ancestor';

let activeNode: Middle | Child;

export function focus(doFocus: boolean = true, node = activeNode, doForce = true) {
    // Avoid unfocusing a focused node if not forced
    if (doForce || node !== activeNode) {
        node.element[`${doFocus ? 'add' : 'remove'}Class`](SOURCE_CLASS_NAME);
    }
}

function focusAncestors(doFocus: boolean = true, node: Root | Middle = activeNode.parent) {
    node.element[`${doFocus ? 'add' : 'remove'}Class`](ANCESTOR_CLASS_NAME);

    if ('parent' in node) {
        focusAncestors(doFocus, node.parent);
    }
}

function reset() {
    if (activeNode) {
        focus(false);

        focusAncestors(false);
    }

    activeNode = undefined;
}

export function unmount(node) {
    if (node === activeNode) {
        reset();
    }
}

function doAction(node: Child) {
    // TODO allow reset even if active?
    // Prevent annoying focuses from clicking the input element
    // Also hiding an active input is undesirable
    if (actionIsActive()) {
        return;
    }

    const previousNode = activeNode;

    reset();

    if (previousNode !== node) {
        activeNode = node;

        focus();

        focusAncestors();
    }
}

export function mount(node: Child): void {
    node.element.dataContainer.addEventListener('click', (event) => {
        event.stopPropagation();

        doAction(node);
    });
}

export function shouldMount(node: Child): boolean {
    return true;
}
