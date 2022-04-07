import {ACTION_ID} from './consts';

import {addColourRule} from '../css';

import {addRule} from '../../../css';

export default function generate() {
    addColourRule(ACTION_ID, '--modalButtonStyleBackground', '--modalButtonStyleFill');

    addRule(
        `#${ACTION_ID} circle`,
        ['fill', `var(--base)`]
    );

    addColourRule(ACTION_ID, undefined, '--nodeButtonRemove', '--nodeButtonRemove', 'circle:nth-of-type(1)');
    addColourRule(ACTION_ID, undefined, '--nodeButtonCreate', '--nodeButtonCreate', 'circle:nth-of-type(2)');
    addColourRule(ACTION_ID, undefined, '--nodeButtonMove', '--nodeButtonMove', 'circle:nth-of-type(3)');
    addColourRule(ACTION_ID, undefined, '--nodeButtonEdit', '--nodeButtonEdit', 'circle:nth-of-type(4)');
}
