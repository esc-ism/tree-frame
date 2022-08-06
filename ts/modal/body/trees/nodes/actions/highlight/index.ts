import {HIGHLIGHT_CLASS, EAVE_ID, HIGHLIGHT_BACKGROUND_CLASS} from './consts';

import {isActive as editIsActive} from '../edit';
import {isActive as focusIsActive} from '../focus';
import {isActive as positionIsActive} from '../buttons/position';

import Root from '@nodes/root';
import Child from '@nodes/child';

let sustainedNodes = [];
let activeNode;

export function focusHovered() {
    if (activeNode) {
        activeNode.element.headContainer.focus();
    }
}

export function isActive(): boolean {
    return Boolean(activeNode);
}

export function removeSustained(node) {
    sustainedNodes.splice(sustainedNodes.indexOf(node), 1);

    // Avoid unhighlighting if it's still sustained by another action
    if (node !== activeNode && !sustainedNodes.includes(node)) {
        node.element.removeClass(HIGHLIGHT_CLASS);
    }
}

export function addSustained(node) {
    node.element.addClass(HIGHLIGHT_CLASS);

    sustainedNodes.push(node);
}

function setActive(node?, doFocus = false) {
    if (activeNode && !sustainedNodes.includes(activeNode)) {
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

        setActive(node, !(editIsActive() || focusIsActive() || positionIsActive()));
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
