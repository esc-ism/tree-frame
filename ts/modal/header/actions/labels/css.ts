import {ACTION_ID} from './consts';

import {addColourRule} from '../css';

import {addRule} from '../../../css';

import {TREE_CONTAINER_ID} from '../../../body/trees/consts';

import {ELEMENT_CLASSES} from '../../../body/trees/nodes/consts';

export default function generate() {
    addRule(
        `#${TREE_CONTAINER_ID}:not(.${ACTION_ID}) .${ELEMENT_CLASSES.LABEL_CONTAINER}`,
        ['display', 'none']
    );

    addColourRule(ACTION_ID, '--headButtonLabel');
}
