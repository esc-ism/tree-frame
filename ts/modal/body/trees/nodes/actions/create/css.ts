import {ACTION_ID} from './consts';

import {PENDING_CLASS} from '../consts';
import {addColourRule} from '../css';

import {addRule} from '../../../../../css';

export default function generate() {
    addColourRule(ACTION_ID, '--nodeButtonCreate');

    addRule(`.${PENDING_CLASS}`, ['display', 'none']);
}
