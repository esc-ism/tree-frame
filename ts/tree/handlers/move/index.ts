import {validateSeedMatch} from '../../../validation';

import Root from '../../nodes/root';
import type Middle from '../../nodes/middle';
import type Child from '../../nodes/child';

import template, {parentButton, siblingButton} from './button';
import {addActionButton, setActive} from '../index';
import {ACTION_ID, CLASS_NAME as BUTTON_CLASS_NAME} from './consts';

import {focus, focusBranch, reset as resetFocus} from '../focus';

const SOURCE_CLASS_NAME = 'move-source';

const targets = [];

let activeNode: Child;

export function reset() {
    if (!activeNode) {
        return;
    }

    Root.instance.element.removeClass(BUTTON_CLASS_NAME);

    activeNode.element.removeClass(SOURCE_CLASS_NAME);

    focus(false, activeNode);
    focusBranch(false, activeNode, false);

    setActive(activeNode, BUTTON_CLASS_NAME, false);

    for (const {node, button, isParent} of targets) {
        focus(false, node);
        focusBranch(false, node, isParent);

        button.remove();
    }

    targets.length = 0;

    activeNode = undefined;
}

function isSeedMatch(seed) {
    try {
        validateSeedMatch([], [], seed, activeNode.getDataTree());

        return true;
    } catch (e) {
        return false;
    }
}

function addTargetButton(node, isParent = true) {
    const clone = (isParent ? parentButton : siblingButton).cloneNode(true);

    node.element.addButton(clone);

    clone.addEventListener('click', (event) => {
        event.stopPropagation();

        activeNode.detach();

        if (isParent) {
            activeNode.attach(node, 0);
        } else {
            activeNode.attach(node.parent, node.parent.children.indexOf(node) + 1);
        }

        // Grab the reference before activeNode is wiped
        const scrollTarget = activeNode.element.dataContainer;

        reset();

        // Show where the node's been moved to
        scrollTarget.scrollIntoView({'block': 'center'});
    });

    targets.push({node, 'button': clone, isParent});
}

function addButtons(parent: Root | Middle = Root.instance) {
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

window.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
        reset();
    }
});

function doAction(node: Child) {
    const previousNode = activeNode;

    reset();
    node.element.addClass(SOURCE_CLASS_NAME);

    if (previousNode !== node) {
        activeNode = node;

        resetFocus();

        Root.instance.element.addClass(BUTTON_CLASS_NAME);

        focus(true, activeNode);
        setActive(activeNode, BUTTON_CLASS_NAME);

        addButtons();
    }
}

export function unmount(node) {
    if (node === activeNode) {
        reset();
    }
}

export function mount(node: Child): void {
    addActionButton(template, ACTION_ID, doAction, node);
}

export function shouldMount(node: Child): boolean {
    return Boolean(node.parent.seed);
}
