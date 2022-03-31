import type Root from '../nodes/root';
import type Child from '../nodes/child';

import {actionIsActive} from '.';

const SOURCE_CLASS_NAME = 'focused-source';
const BRANCH_CLASS_NAME = 'focused-branch';

let activeNode: Root | Child;

// TODO Set tab indexes for all data containers to allow tabbing from top to bottom when no node's focused.
//  You want pressing enter on a tabbed node to focus it.
function setTabIndexes(doAdd = true) {
    const {valueElement, buttons} = activeNode.element;

    if (doAdd) {
        activeNode.element.addClass(SOURCE_CLASS_NAME);

        valueElement.setAttribute('tabIndex', '1');
        valueElement.focus();
    } else {
        activeNode.element.removeClass(SOURCE_CLASS_NAME);

        valueElement.removeAttribute('tabIndex');
    }

    for (let i = buttons.length - 1; i >= 0; --i) {
        const button = buttons[i];

        if (button) {
            button.setAttribute('tabIndex', doAdd ? (i + 2).toString() : '-1');
        }
    }
}

export function reset() {
    if (!activeNode) {
        return;
    }

    focus(false);
    focusBranch(false);

    setTabIndexes(false);

    activeNode.element.scrollIntoView();

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

window.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
        reset();
    }
});

export function doAction(node: Root | Child, doForce = false) {
    const toggleOn = node !== activeNode;

    // Avoid unfocusing an active input
    if (actionIsActive() || (doForce && !toggleOn)) {
        return;
    }

    reset();

    if (toggleOn) {
        activeNode = node;

        focus();
        focusBranch();

        setTabIndexes();
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
