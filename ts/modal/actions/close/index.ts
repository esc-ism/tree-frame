import BUTTON from './button';
import {BACKGROUND, BUTTON_POSITION, ACTION_ID} from './consts';

import {addActionButton} from '../button';

import {EVENTS} from '../../../consts';

import type Root from '../../tree/nodes/root';

function doAction(root: Root) {
    // TODO Maybe add a white, 0.5 opacity foreground over everything with a loading symbol.
    //  Do the same when waiting for a config.
    //  Prevent interaction during loading by adding a stopPropagation click listener to the foreground.
    // Prevent further interaction
    document.body.classList.add(ACTION_ID);

    window.parent.postMessage({
        'event': EVENTS.STOP,
        'tree': root.getDataTree()
    }, '*');
}

export default function mount(root: Root) {
    const listener = doAction.bind(null, root);

    addActionButton(BUTTON, BUTTON_POSITION, listener);

    BACKGROUND.addEventListener('click', (event) => {
        if (BACKGROUND.isSameNode(event.target as Node)) {
            doAction(root);
        }
    });
}
