import {
    FOCUS_SOURCE_CLASS as SOURCE_CLASS,
    FOCUS_CLASS as BRANCH_CLASS
} from './consts';

import {isActive as moveIsActive} from '../move';
import * as active from '../active';

import type Root from '../../root';
import type Child from '../../child';
import {setSustained} from '../highlight';

let activeNode: Root | Child;

export function isActive(): boolean {
    return Boolean(activeNode);
}

export function setTabIndexes(doAdd = true, node = activeNode) {
    const buttons = node.element.buttonContainer.children;

    for (let i = buttons.length - 1; i >= 0; --i) {
        const button = buttons[i];

        if (button) {
            // Must be set to -1 to prevent tabbing (removeAttribute sets it to 0)
            button.setAttribute('tabIndex', doAdd ? '1' : '-1');
        }
    }
}

export function focus(doFocus: boolean = true, node = activeNode, doForce: boolean = true) {
    // Avoid unfocusing the active node if not forced
    if (doForce || node !== activeNode) {
        node.element[`${doFocus ? 'add' : 'remove'}Class`](SOURCE_CLASS);
    }
}

export function focusBranch(doFocus: boolean = true, node: Root | Child = activeNode, focusAncestors: boolean = true) {
    node.element[`${doFocus ? 'add' : 'remove'}Class`](BRANCH_CLASS);

    if (focusAncestors && 'parent' in node) {
        focusBranch(doFocus, node.parent);
    }
}

export function reset() {
    if (!activeNode) {
        return;
    }

    focus(false);
    focusBranch(false);

    setSustained();

    setTabIndexes(false);

    activeNode.element.scrollIntoView();

    activeNode = undefined;
}

export function doAction(node: Root | Child, doForce = false) {
    const toggleOn = node !== activeNode;

    // Avoid cancelling move actions
    if (moveIsActive() || (doForce && !toggleOn)) {
        return;
    }

    reset();

    active.register();

    if (toggleOn) {
        activeNode = node;

        node.element.headContainer.focus();

        focus();
        focusBranch();

        setSustained(node);

        setTabIndexes();
    }
}

export function unmount(node) {
    if (node === activeNode) {
        reset();
    }
}

export function mount(node: Root | Child): void {
    const {elementContainer} = node.element;

    // Handle mouse input

    elementContainer.addEventListener('click', (event) => {
        event.stopPropagation();

        doAction(node);
    });

    // Handle keyboard input

    elementContainer.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.stopPropagation();

            doAction(node);
        }
    });
}

export function shouldMount(): boolean {
    return true;
}
