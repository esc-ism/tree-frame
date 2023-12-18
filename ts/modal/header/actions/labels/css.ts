import {ACTION_ID} from './consts';

import {addColourRule} from '../css';

import {addRule} from '@/modal/css';

import {TREE_CONTAINER_ID} from '@/modal/body/trees/consts';

import {ELEMENT_CLASSES} from '@nodes/consts';

export default function generate() {
    addRule(
        `#${TREE_CONTAINER_ID}:not(.${ACTION_ID}) .${ELEMENT_CLASSES.LABEL_CONTAINER}`,
        ['display', 'none'],
    );

    addColourRule(ACTION_ID, '--headButtonLabel');
}
