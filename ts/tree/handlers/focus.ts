import type Root from '../nodes/root';
import type Child from '../nodes/child';

import {actionIsActive} from '.';

const SOURCE_CLASS_NAME = 'focused-source';
const BRANCH_CLASS_NAME = 'focused-branch';

let activeNode: Root | Child;

export function reset() {
    if (!activeNode) {
        return;
    }

    focus(false);

    focusBranch(false);

    activeNode = undefined;
}

export function focus(doFocus: boolean = true, node = activeNode, doForce = true) {
    // Avoid unfocusing a focused node if not forced
    if (doForce || node !== activeNode) {
        node.element[`${doFocus ? 'add' : 'remove'}Class`](SOURCE_CLASS_NAME);
    }
}

export function focusBranch(doFocus: boolean = true, node: Root | Child = activeNode, focusAncestors = true) {
    node.element[`${doFocus ? 'add' : 'remove'}Class`](BRANCH_CLASS_NAME);

    if (focusAncestors && 'parent' in node) {
        focusBranch(doFocus, node.parent);
    }
}

function doAction(node: Root | Child) {
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

        focusBranch();
    }
}

export function unmount(node) {
    if (node === activeNode) {
        reset();
    }
}

export function mount(node: Root | Child): void {
    node.element.dataContainer.addEventListener('click', (event) => {
        event.stopPropagation();

        doAction(node);
    });
}

export function shouldMount(): boolean {
    return true;
}
