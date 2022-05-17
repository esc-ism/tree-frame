import {
    FOCUS_SOURCE_CLASS as SOURCE_CLASS,
    FOCUS_CLASS as BRANCH_CLASS,
} from './consts';

import {isActive as moveIsActive} from '../move';

import type Root from '../../root';
import type Child from '../../child';

let activeNode: Root | Child;

export function isActive(): boolean {
    return Boolean(activeNode);
}

export function setTabIndexes(doAdd = true, node = activeNode) {
    const buttons = node.element.buttonContainer.children;

    for (let i = buttons.length - 1; i >= 0; --i) {
        const button = buttons[i] as HTMLButtonElement;

        if (button) {
            // Must be set to -1 to prevent tabbing (removeAttribute sets it to 0)
            button.setAttribute('tabIndex', doAdd && !button.disabled ? '1' : '-1');
        }
    }

    node.element.valueElement?.setAttribute('tabIndex', doAdd ? '1' : '-1');
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

    setTabIndexes(false);

    activeNode.element.scrollIntoView();

    activeNode = undefined;
}

export function doAction(node: Root | Child, doForce = false) {
    const toggleOn = node !== activeNode;

    // Avoid unfocusing a node that's being edited/moved
    if (moveIsActive() || (doForce && !toggleOn)) {
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
    const {elementContainer, interactionContainer} = node.element;

    // Handle mouse input

    elementContainer.addEventListener('click', (event) => {
        event.stopPropagation();

        interactionContainer.focus();

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
