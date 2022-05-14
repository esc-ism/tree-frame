import {ACTION_ID} from './consts';

import {addColourRule} from '../css';

import {addRule} from '../../../css';

import {TREE_CONTAINER_ID} from '../../../body/trees/consts';

import {ELEMENT_CLASSES, ROOT_CLASS} from '../../../body/trees/nodes/consts';

export default function generate() {
    addRule([
        `#${TREE_CONTAINER_ID}:not(.${ACTION_ID}) .${ELEMENT_CLASSES.LABEL}`,
        `.${ROOT_CLASS} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER} .${ELEMENT_CLASSES.LABEL}`
    ], ['display', 'none']);

    addColourRule(ACTION_ID, '--headButtonLabel');
}
