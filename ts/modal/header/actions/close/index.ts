import BUTTON from './button';
import {ACTION_ID, HOTKEY} from './consts';
import generateCSS from './css';

import {bindAction} from '../button';

import {MODAL_BACKGROUND_ID} from '@/modal/consts';

import {EVENTS} from '@/consts';

import {getRoot as getDataTree} from '@/modal/body/trees/data';
import {getUserStyles} from '@/modal/body/trees/style';
import {sendMessage} from '@/messaging';

function doAction() {
    // TODO Maybe add a white, 0.5 opacity foreground over everything with a loading symbol.
    //  Do the same when waiting for a config.
    //  Prevent interaction during loading by adding a stopPropagation click listener to the foreground.
    // Prevent further interaction
    document.body.classList.add(ACTION_ID);

    sendMessage({
        'event': EVENTS.STOP,
        'tree': getDataTree().getJSON(),
        'styles': getUserStyles()
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
