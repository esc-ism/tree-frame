import {TITLE_CONTAINER_ID} from './consts';

import {addRule} from '../../css';

export default function generate() {
    addRule(`#${TITLE_CONTAINER_ID}`, [
        ['flex-grow', '1'],

        ['white-space', 'nowrap'],
        ['overflow', 'hidden'],
        ['text-overflow', 'ellipsis'],

        ['padding', '0 20px'],
    ]);
}
