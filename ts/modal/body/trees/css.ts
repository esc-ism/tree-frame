import {TREE_CONTAINER_ID} from './consts';

import {addRule} from '../../css';

import generateActionCSS from './nodes/actions/css';

export default function generate() {
    generateActionCSS();

    addRule(`#${TREE_CONTAINER_ID}`, [
        ['height', '60vh'],
        ['overflow-y', 'auto'],

        ['display', 'flex'],
        ['flex-direction', 'column'],
    ]);
}
