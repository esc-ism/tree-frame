import BUTTON from './button';
import {ACTION_ID, HOTKEY} from './consts';
import generateCSS from './css';

import {bindAction} from '../button';

import {setActive} from '../../../body/trees';

import {reset as resetFocus} from '../../../body/trees/nodes/actions/focus';
import {reset as resetEdit} from '../../../body/trees/nodes/actions/edit';
import {reset as resetMove} from '../../../body/trees/nodes/actions/move';

let isActive = false;

function doAction() {
    isActive = !isActive;

    setActive(BUTTON, ACTION_ID, isActive);

    resetFocus();
    resetEdit();
    resetMove();

    // Reset tab index
    document.body.focus();
}

export default function generate() {
    generateCSS();

    bindAction(BUTTON, doAction, HOTKEY);

    return BUTTON;
}
