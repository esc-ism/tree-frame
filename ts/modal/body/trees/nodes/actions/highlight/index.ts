import {HIGHLIGHT_CLASS, EAVE_ID, HIGHLIGHT_BACKGROUND_CLASS} from './consts';

import {isActive as editIsActive} from '../edit';
import {isActive as focusIsActive} from '../focus';
import {isActive as moveIsActive} from '../move';
import Root from '../../root';
import Child from '../../child';

let sustainedNode;
let activeNode;

export function focusHovered() {
    if (activeNode) {
        activeNode.element.headContainer.focus();
    }
}

export function isActive(): boolean {
    return Boolean(activeNode);
}

export function setSustained(node?) {
    if (node === sustainedNode) {
        return;
    }

    if (sustainedNode && sustainedNode !== activeNode) {
        sustainedNode.element.removeClass(HIGHLIGHT_CLASS);
    }

    sustainedNode = node;
}

function setActive(node?, doFocus = false) {
    if (activeNode && activeNode !== sustainedNode) {
        activeNode.element.removeClass(HIGHLIGHT_CLASS);
    }

    activeNode = node;

    if (node) {
        node.element.addClass(HIGHLIGHT_CLASS);

        if (doFocus) {
            node.element.headContainer.focus();
        }
    }
}

export function reset() {
    setActive();

    // Blur focused node & reset focus index
    document.body.focus();
}

export function mount(node: Root | Child) {
    const {backgroundContainer, headContainer, elementContainer} = node.element;

    backgroundContainer.appendChild((() => {
        const background = document.createElement('div');

        background.classList.add(HIGHLIGHT_BACKGROUND_CLASS);

        return background;
    })());

    headContainer.setAttribute('tabIndex', '1');

    headContainer.addEventListener('focusin', (event) => {
        event.stopPropagation();

        setActive(node);
    });

    headContainer.addEventListener('mouseenter', (event) => {
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
