import BUTTON from './button';
import {ACTION_ID, HOTKEY} from './consts';
import generateCSS from './css';

import {bindAction} from '../button';

import {setActive} from '../../../body/trees';

import {reset as resetFocus} from '../../../body/trees/nodes/actions/focus';

let isActive = false;

function doAction() {
    isActive = !isActive;

    setActive(BUTTON, ACTION_ID, isActive);

    resetFocus();

    // Reset tab index
    document.body.focus();
}

export default function generate() {
    generateCSS();

    bindAction(doAction, BUTTON, HOTKEY, 'Toggle Style Editor');

    return BUTTON;
}
