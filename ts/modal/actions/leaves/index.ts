import BUTTON from './button';
import {BUTTON_POSITION, ACTION_ID} from './consts';

import {addActionButton} from '../button';

import {BUTTON_CLASS_ACTIVE, TREE_CONTAINER} from '../../consts';

let isActive = false;

function doAction() {
    if (isActive) {
        BUTTON.classList.remove(BUTTON_CLASS_ACTIVE);

        TREE_CONTAINER.classList.remove(ACTION_ID);
    } else {
        BUTTON.classList.add(BUTTON_CLASS_ACTIVE);

        TREE_CONTAINER.classList.add(ACTION_ID);
    }

    isActive = !isActive;
}

export default function mount() {
    // TODO activate on mount?
    addActionButton(BUTTON, BUTTON_POSITION, doAction.bind(null));
}
