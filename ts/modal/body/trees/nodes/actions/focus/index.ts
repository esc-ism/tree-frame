import {
    HIGHLIGHT_SOURCE_CLASS as SOURCE_CLASS, HIGHLIGHT_BRANCH_CLASS as BRANCH_CLASS,
    FOCUS_CLASS, EAVE_ID
} from './consts';

import {actionIsActive} from '../active';

import type Root from '../../root';
import type Child from '../../child';

let activeNode: Root | Child;

export function setTabIndexes(doAdd = true, node = activeNode) {
    const buttons = node.element.buttonContainer.children;

    for (let i = buttons.length - 1; i >= 0; --i) {
        const button = buttons[i] as HTMLButtonElement;

        if (button) {
            // Must be set to -1 to prevent tabbing (removeAttribute sets it to 0)
            button.setAttribute('tabIndex', doAdd && !button.disabled ? '1' : '-1');
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

    setTabIndexes(false);

    activeNode.element.scrollIntoView();

    activeNode = undefined;
}

export function doAction(node: Root | Child, doForce = false) {
    const toggleOn = node !== activeNode;

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

const unfocusPrevious = (() => {
    let previousNode;

    return (newNode?) => {
        if (previousNode) {
            previousNode.element.removeClass(FOCUS_CLASS);
        }

        previousNode = newNode;
    };
})();

export function mount(node: Root | Child): void {
    const focusTarget = node.element.interactionContainer;

    focusTarget.addEventListener('click', (event) => {
        event.stopPropagation();

        doAction(node);
    });

    focusTarget.addEventListener('mouseenter', () => {
        // Avoid unfocusing an input
        if (actionIsActive()) {
            unfocusPrevious(node);

            node.element.addClass(FOCUS_CLASS);
        } else {
            focusTarget.focus();
        }
    });

    focusTarget.addEventListener('focus', () => {
        unfocusPrevious(node);

        node.element.addClass(FOCUS_CLASS);
    });

    focusTarget.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'Enter':
                event.stopPropagation();

                doAction(node);

                break;
            case 'Escape':
                event.stopPropagation();

                if (activeNode) {
                    reset();

                    focusTarget.focus();
                } else {
                    unfocusPrevious();

                    document.body.focus();
                }
        }
    });
}

export function shouldMount(): boolean {
    return true;
}


// Prevents zipping to the end of the tree when mousing over the bottom pixel
export function generateEave() {
    const element = document.createElement('div');

    element.id = EAVE_ID;

    return element
}
