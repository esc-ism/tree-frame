import {ACTION_ID} from './consts';

import {addRule} from '../../../css';

export default function generate() {
    addRule([
        `#${ACTION_ID}:hover > svg`,
        `#${ACTION_ID}:focus > svg`
    ], [
        'background-color', 'var(--modalButtonExitBackground)'
    ]);
}
