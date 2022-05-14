import {INVALID_CLASS} from './consts';

import {ELEMENT_CLASSES} from '../../consts';

import {addRule} from '../../../../../css';

export default function generate() {
    addRule(`.${ELEMENT_CLASSES.VALUE_CONTAINER}`, [
        ['flex-grow', '1'],
        ['display', 'flex'],
        ['align-items', 'center']
    ]);

    // Use pointer when the node has a value and isn't being edited
    addRule([
        `.${ELEMENT_CLASSES.VALUE_CONTAINER}`,
        `.${ELEMENT_CLASSES.VALUE}:not(:focus)`,
        `.${ELEMENT_CLASSES.VALUE_CONTAINER} ~ *`
    ], ['cursor', 'pointer']);

    addRule([`.${ELEMENT_CLASSES.VALUE}`, `.${ELEMENT_CLASSES.LABEL}`], ['height', '1.2em']);

    addRule(`.${ELEMENT_CLASSES.VALUE}`, [
        // Separate from buttons
        ['margin', '0.2em 0.5em'],
        // Add space between input & text
        ['padding', '0 0.5em']
    ]);

    addRule(`.${ELEMENT_CLASSES.VALUE}:not([type="checkbox"])`, ['flex-grow', '1']);

    addRule(`.${ELEMENT_CLASSES.VALUE}[type="checkbox"]`, ['width', '2.5em']);

    addRule(`.${ELEMENT_CLASSES.LABEL}`, [
        ['padding-right', '0.4em'],
        ['text-align', 'right'],
        ['position', 'absolute'],
        ['right', '0']
    ]);

    addRule(`.${ELEMENT_CLASSES.VALUE}:focus`, [
        ['background', 'var(--validBackground)'],
        ['color', 'var(--validFont)']
    ]);

    addRule(`.${INVALID_CLASS} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER} .${ELEMENT_CLASSES.VALUE}`, [
        ['background', 'var(--invalidBackground)'],
        ['color', 'var(--invalidFont)']
    ]);
}
