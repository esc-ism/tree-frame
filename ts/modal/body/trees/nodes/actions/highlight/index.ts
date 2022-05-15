import {HIGHLIGHT_CLASS, EAVE_ID} from './consts';

import {isActive as editIsActive} from '../edit';
import {isActive as focusIsActive} from '../focus';
import {isActive as moveIsActive} from '../move';

let activeNode;

export function isActive(): boolean {
    return Boolean(activeNode);
}

export function reset() {
    // Blur focused node & reset focus index
    document.body.focus();
}

function unfocus(node) {
    activeNode?.element.removeClass(HIGHLIGHT_CLASS);

    activeNode = node;
}

export function mount(node) {
    const {interactionContainer} = node.element;

    interactionContainer.setAttribute('tabIndex', '1');

    interactionContainer.addEventListener('focusin', (event) => {
        event.stopPropagation();

        unfocus(node);

        node.element.addClass(HIGHLIGHT_CLASS);
    });

    interactionContainer.addEventListener('mouseenter', (event) => {
        event.stopPropagation();

        if (editIsActive() || focusIsActive() || moveIsActive()) {
            unfocus(node);

            node.element.addClass(HIGHLIGHT_CLASS);
        } else {
            interactionContainer.focus();
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
