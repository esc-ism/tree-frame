import {focus, reset as resetFocus, setTabIndexes} from './focus';

import type Child from '../child';

import {setActive as setTreeActive} from '../../index';

// True when there's some action in an 'on' state
let isActive: boolean = false;

// Basically a getter
export function actionIsActive(): boolean {
    return isActive;
}

export function setActive(node: Child, actionId: string, doActivate = true) {
    const button = node.element.buttonContainer.querySelector(`.${actionId}`);

    setTreeActive(button, actionId, doActivate);

    resetFocus();
    focus(doActivate, node, false);
    setTabIndexes(doActivate, node);

    node.element.interactionContainer.focus();

    isActive = doActivate;
}