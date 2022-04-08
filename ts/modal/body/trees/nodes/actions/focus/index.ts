import {
    FOCUS_CLASS, HIGHLIGHT_SOURCE_CLASS as SOURCE_CLASS, HIGHLIGHT_BRANCH_CLASS as BRANCH_CLASS
} from './consts';

import {actionIsActive} from '../active';

import type Root from '../../root';
import type Child from '../../child';

let activeNode: Root | Child;

// TODO Set tab indexes for all data containers to allow tabbing from top to bottom when no node's focused.
//  You want pressing enter on a tabbed node to focus it.
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
        event.stopPropagation();

        switch (event.key) {
            case 'Enter':
                doAction(node);

                break;
            case 'Escape':
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
