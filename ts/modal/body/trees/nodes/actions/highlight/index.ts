import {HIGHLIGHT_CLASS, EAVE_ID} from './consts';

import {isActive as editIsActive} from '../edit';
import {isActive as focusIsActive} from '../focus';
import {isActive as moveIsActive} from '../move';
import Root from '../../root';
import Child from '../../child';

let activeNode;

export function focusHovered() {
    if (activeNode) {
        activeNode.element.interactionContainer.focus();
    }
}

export function isActive(): boolean {
    return Boolean(activeNode);
}

function setActive(node = undefined, doFocus = false) {
    if (activeNode) {
        activeNode.element.removeClass(HIGHLIGHT_CLASS);
    }

    activeNode = node;

    if (node) {
        node.element.addClass(HIGHLIGHT_CLASS);

        if (doFocus) {
            node.element.interactionContainer.focus();
        }
    }
}

export function reset() {
    setActive();

    // Blur focused node & reset focus index
    document.body.focus();
}

export function mount(node: Root | Child) {
    const {interactionContainer, elementContainer} = node.element;

    interactionContainer.setAttribute('tabIndex', '1');

    interactionContainer.addEventListener('focusin', (event) => {
        event.stopPropagation();

        setActive(node);
    });

    interactionContainer.addEventListener('mouseenter', (event) => {
        event.stopPropagation();

        setActive(node, !(editIsActive() || focusIsActive() || moveIsActive()));
    });

    elementContainer.addEventListener('mouseenter', (event) => {
        event.stopPropagation();

        setActive(node);
    });

    elementContainer.addEventListener('mouseleave', (event) => {
        event.stopPropagation();

        if ('parent' in node) {
            setActive(node.parent);
        } else {
            setActive();
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

    return element;
}
