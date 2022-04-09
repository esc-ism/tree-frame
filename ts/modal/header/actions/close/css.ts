import {ACTION_ID} from './consts';

import {addRule} from '../../../css';

export default function generate() {
    addRule([
        `#${ACTION_ID}:focus > svg`,
        `#${ACTION_ID}:hover > svg`
    ], ['background-color', 'var(--modalButtonExit)']);
}
