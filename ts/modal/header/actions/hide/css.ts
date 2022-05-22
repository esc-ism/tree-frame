import {ACTION_ID} from './consts';

import {addColourRule} from '../css';

import {addRule} from '../../../css';

import {TREE_CONTAINER_ID} from '../../../body/trees/consts';

import {DISABLED_CLASS} from '../../../body/trees/nodes/actions/disable/consts';

export default function generate() {
    addRule(
        `#${TREE_CONTAINER_ID}:not(.${ACTION_ID}) .${DISABLED_CLASS}`,
        ['display', 'none']
    );

    addColourRule(ACTION_ID, '--headButtonHide');
}
