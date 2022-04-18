import {ACTION_ID, INVALID_CLASS} from './consts';

import {addColourRule} from '../css';

import {ELEMENT_CLASSES} from '../../consts';

import {addRule} from '../../../../../css';

export default function generate() {
    addColourRule(ACTION_ID, '--nodeButtonEdit');

    addRule(`.${ELEMENT_CLASSES.INPUT_VALUE}:not([disabled])`, ['background', 'var(--valid)']);

    addRule(
        `.${INVALID_CLASS} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER} .${ELEMENT_CLASSES.INPUT_VALUE}`,
        ['background', 'var(--invalid)']
    );

    addRule(`.${ELEMENT_CLASSES.INPUT_VALUE}[type=color]`, ['height', '1.2em']);

    addRule(`.${ELEMENT_CLASSES.INPUT_VALUE}[type=color]:not([disabled])`, ['cursor', 'pointer']);

    addRule(`.${ELEMENT_CLASSES.INPUT_CONTAINER}`, [
        ['flex-grow', '1'],
        ['display', 'flex'],
        ['align-items', 'center']
    ]);

    addRule([`.${ELEMENT_CLASSES.INPUT_VALUE}`, `.${ELEMENT_CLASSES.INPUT_LABEL}`], [
        ['padding', '0 0.5em']
    ]);

    addRule(`.${ELEMENT_CLASSES.INPUT_VALUE}`, [
        ['flex-grow', '1'],
        ['margin', '0.2em 0.5em']
    ]);

    addRule(`.${ELEMENT_CLASSES.INPUT_LABEL}`, [
        ['padding', '0.2em 0.5em']
    ]);
}
