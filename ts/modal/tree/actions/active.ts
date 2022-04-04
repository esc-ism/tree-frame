import {doAction as doFocus} from './focus';

import {BUTTON_CLASS_ACTIVE} from '../../consts';

import type Child from '../nodes/child';

// True when there's some action in an 'on' state
let isActive: boolean = false;

// Basically a getter
export function actionIsActive(): boolean {
    return isActive;
}

export function setActive(node: Child, actionId: string, doActivate = true) {
    const button = node.element.buttonContainer.querySelector(`.${actionId}`);

    button.classList[doActivate ? 'add' : 'remove'](BUTTON_CLASS_ACTIVE);

    if (doActivate) {
        doFocus(node, true);
    } else {
        // Allow user to resume tab-based navigation
        node.element.interactionContainer.focus();
    }

    isActive = doActivate;
}
