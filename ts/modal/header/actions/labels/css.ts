import {ACTION_ID} from './consts';

import {addColourRule} from '../css';

import {addRule} from '../../../css';

import {TREE_CONTAINER_ID} from '../../../body/trees/consts';

import {ELEMENT_CLASSES} from '../../../body/trees/nodes/consts';

export default function generate() {
    addRule(
        `#${TREE_CONTAINER_ID}.${ACTION_ID} .${ELEMENT_CLASSES.BUTTON_CONTAINER}`,
        ['visibility', 'hidden']
    );

    addRule(
        `#${TREE_CONTAINER_ID}.${ACTION_ID} .${ELEMENT_CLASSES.INPUT_VALUE}`,
        ['display', 'none']
    );

    addRule(
        `#${TREE_CONTAINER_ID}:not(.${ACTION_ID}) .${ELEMENT_CLASSES.INPUT_LABEL}`,
        ['display', 'none']
    );

    addColourRule(ACTION_ID, '--modalButtonLabelBackground', '--modalButtonLabelFill');
}
