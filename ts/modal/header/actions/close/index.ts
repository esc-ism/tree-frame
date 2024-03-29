import BUTTON from './button';
import {HOTKEY} from './consts';
import generateCSS from './css';

import {bindAction} from '../button';

import {MODAL_BACKGROUND_ID} from '@/modal/consts';

import {EVENTS} from '@/consts';

import {getRoot as getDataTree} from '@/modal/body/trees/data';
import {getUserStyles} from '@/modal/body/trees/style';
import {sendMessage} from '@/messaging';

import {reset as resetFocus} from '@nodes/actions/focus';
import {reset as resetEdit} from '@nodes/actions/edit';
import {reset as resetMove} from '@nodes/actions/buttons/move';

// TODO Maybe add a white, 0.5 opacity foreground over everything with a loading symbol.
//  Do the same when waiting for a config.
//  Prevent interaction during loading by adding a stopPropagation click listener to the foreground.
function doAction() {
    resetFocus();
    resetEdit();
    resetMove();

    sendMessage({
        'event': EVENTS.STOP,
        'tree': getDataTree().getJSON(),
        'styles': getUserStyles(),
    });
}

export default function generate() {
    generateCSS();

    const background = document.getElementById(MODAL_BACKGROUND_ID);

    bindAction(BUTTON, doAction, HOTKEY);

    background.addEventListener('click', (event) => {
        if (background.isSameNode(event.target as Node)) {
            doAction();
        }
    });

    return BUTTON;
}
