import {MODAL_BODY_ID} from './consts';

import {addRule} from '../css';

export default function generate() {
    addRule(`#${MODAL_BODY_ID}`, [
        ['overflow', 'hidden'],
        ['position', 'relative'],

        ['background', 'var(--baseBody)'],
        ['color', 'var(--contrastBody)'],
    ]);
}
