import {FOCUS_SOURCE_CLASS as SOURCE_CLASS, FOCUS_BRANCH_CLASS as BRANCH_CLASS} from './consts';

import {actionIsActive} from '../active';

import type Root from '../../root';
import type Child from '../../child';

let activeNode: Root | Child;

// TODO Set tab indexes for all data containers to allow tabbing from top to bottom when no node's focused.
//  You want pressing enter on a tabbed node to focus it.
export function setTabIndexes(doAdd = true) {
    const {interactionContainer, buttonContainer} = activeNode.element;
    const buttons = buttonContainer.children;

    for (let i = buttons.length - 1; i >= 0; --i) {
        const button = buttons[i] as HTMLButtonElement;

        if (button) {
            // Must be set to -1 to prevent tabbing (removeAttribute sets it to 0)
            button.setAttribute('tabIndex', doAdd && !button.disabled ? '1' : '-1');
        }
    }

    interactionContainer.blur();
}

export function focus(doFocus: boolean = true, node = activeNode, doForce = true) {
    // Avoid unfocusing the active node if not forced
    if (doForce || node !== activeNode) {
        node.element[`${doFocus ? 'add' : 'remove'}Class`](SOURCE_CLASS);
    }
}

export function focusBranch(doFocus: boolean = true, node: Root | Child = activeNode, focusAncestors = true) {
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

    // TODO remove
    if (doForce && !toggleOn) {
        console.log('?');
    }

    // Avoid unfocusing a node that's being edited/moved
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
    node.element.interactionContainer.addEventListener('click', (event) => {
        event.stopPropagation();

        doAction(node);
    });

    node.element.interactionContainer.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || (event.key === 'Escape' && activeNode)) {
            doAction(node);

            node.element.interactionContainer.focus();
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            // Stop focusing any node
            document.body.focus();
        }
    });
}

export function shouldMount(): boolean {
    return true;
}
