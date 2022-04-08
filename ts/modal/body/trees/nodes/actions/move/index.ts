import BUTTON, {BUTTON_SIBLING, BUTTON_PARENT} from './button';
import {ACTION_ID} from './consts';

import {addActionButton} from '../button';
import {setActive} from '../active';
import {focusBranch} from '../focus';

import type Root from '../../root';
import type Middle from '../../middle';
import type Child from '../../child';

import {validateSeedMatch} from '../../../../../../validation';
import {FOCUS_CLASS} from '../focus/consts';

const targets = [];

let activeNode: Child;

export function reset() {
    if (!activeNode) {
        return;
    }

    for (const {node, button, isParent} of targets) {
        focusBranch(false, node, isParent);

        button.remove();
    }

    targets.length = 0;

    setActive(activeNode, ACTION_ID, false);

    activeNode = undefined;
}

function isSeedMatch(seed) {
    try {
        validateSeedMatch([], [], seed, activeNode.getJSON());

        return true;
    } catch (e) {
        return false;
    }
}

function addTargetButton(node, isParent = true) {
    const button = (isParent ? BUTTON_PARENT : BUTTON_SIBLING).cloneNode(true) as HTMLButtonElement;

    button.addEventListener('focus', () => {
        node.element.addClass(FOCUS_CLASS);
    });

    button.addEventListener('blur', () => {
        node.element.removeClass(FOCUS_CLASS);
    });

    button.setAttribute('tabIndex', '1');

    button.addEventListener('click', (event) => {
        event.stopPropagation();

        activeNode.detach();

        if (isParent) {
            activeNode.attach(node, 0);
        } else {
            activeNode.attach(node.parent, node.parent.children.indexOf(node) + 1);
        }

        // Grab the reference before activeNode is wiped
        const previousNode = activeNode;

        reset();

        // Show where the node's been moved to
        previousNode.element.scrollIntoView();
    });

    node.element.addButton(button);

    targets.push({node, 'button': button, isParent});
}

function addButtons(parent: Root | Middle) {
    const isCurrentParent = parent === activeNode.parent;

    if (isCurrentParent || ('seed' in parent && isSeedMatch(parent.seed))) {
        addTargetButton(parent);

        focusBranch(true, parent);

        if (isCurrentParent) {
            for (const child of parent.children) {
                focusBranch(true, child, false);

                if (child !== activeNode) {
                    addTargetButton(child, false);
                }
            }
        } else {
            for (const child of parent.children) {
                focusBranch(true, child, false);

                addTargetButton(child, false);
            }
        }
    }

    // Nodes can't be their own descendents
    if (!isCurrentParent) {
        for (const child of parent.children) {
            if ('children' in child) {
                addButtons(child);
            }
        }
    }
}

function doAction(node: Child) {
    const toggleOn = node !== activeNode;

    reset();

    if (toggleOn) {
        activeNode = node;

        setActive(activeNode, ACTION_ID);

        addButtons(activeNode.getRoot());
    }
}

export function unmount(node) {
    if (node === activeNode) {
        reset();
    }
}

export function mount(node: Child): void {
    addActionButton(BUTTON, doAction, node);

    node.element.valueElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === 'Escape') {
            event.stopPropagation();

            reset();
        }
    });
}

export function shouldMount(node: Child): boolean {
    return Boolean(node.parent.seed);
}