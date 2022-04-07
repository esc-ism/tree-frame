import {HEADER_ID} from './consts';

import {addRule} from '../css';

export default function generate() {
    addRule(`#${HEADER_ID}`, [
        ['display', 'flex'],
        ['align-items', 'center'],

        ['border-bottom', '#fff solid 2px'],

        ['font-size', '1.6em'],
        ['text-align', 'center'],
    ]);
}
