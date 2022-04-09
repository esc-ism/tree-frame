import {ACTION_ID} from './consts';

import {addColourRule} from '../css';

import {addRule} from '../../../css';

import {TREE_CONTAINER_ID} from '../../../body/trees/consts';

import {ROOT_CLASS, MIDDLE_CLASS, ELEMENT_CLASSES} from '../../../body/trees/nodes/consts';

export default function generate() {
    addRule(
        `#${TREE_CONTAINER_ID}.${ACTION_ID} .${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${ROOT_CLASS}):not(.${MIDDLE_CLASS})`,
        ['display', 'none']
    );

    addColourRule(ACTION_ID, '--modalButtonLeaf');
}
