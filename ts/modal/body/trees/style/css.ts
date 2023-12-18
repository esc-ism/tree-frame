import {ROOT_ID as ROOT_ID_STYLE} from './consts';

import {TREE_CONTAINER_ID} from '../consts';

import {ROOT_ID as ROOT_ID_DATA} from '../data/consts';

import {addRule} from '@/modal/css';

import {ACTION_ID} from '@/modal/header/actions/style/consts';

export default function generate() {
    addRule(
        `#${TREE_CONTAINER_ID}.${ACTION_ID} > #${ROOT_ID_DATA}`,
        ['display', 'none'],
    );

    addRule(
        `#${TREE_CONTAINER_ID}:not(.${ACTION_ID}) > #${ROOT_ID_STYLE}`,
        ['display', 'none'],
    );
}
