import {ACTION_ID} from './consts';

import {addColourRule} from '../css';

export default function generate() {
    addColourRule(ACTION_ID, '--modalButtonStyle');
}
