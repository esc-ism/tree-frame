import {TREE_CONTAINER_ID} from './consts';

import {addRule} from '../../css';

import generateNodeCSS from '@nodes/css';
import generateActionCSS from '@nodes/actions/css';

export default function generate() {
    generateNodeCSS();
    generateActionCSS();

    addRule(`#${TREE_CONTAINER_ID}`, [
        ['height', '60vh'],
        ['overflow-y', 'auto'],

        ['display', 'flex'],

        ['background-color', `var(--nodeBase0)`],
    ]);
}
