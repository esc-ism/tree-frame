import {
    EDITABLE_CLASS, VALID_CLASS, INVALID_CLASS,
    VALID_BACKGROUND_CLASS, INVALID_BACKGROUND_CLASS
} from './consts';

import {ELEMENT_CLASSES} from '../../consts';

import {addRule} from '../../../../../css';

export default function generate() {
    // Use pointer when the node has a value and isn't being edited
    addRule([
        `.${EDITABLE_CLASS} > .${ELEMENT_CLASSES.HEAD_CONTAINER}`,
        `.${ELEMENT_CLASSES.VALUE_CONTAINER}`,
        `.${ELEMENT_CLASSES.VALUE}:not(:focus)`,
        `.${ELEMENT_CLASSES.LABEL_CONTAINER}`
    ], ['cursor', 'pointer']);

    addRule(`.${ELEMENT_CLASSES.VALUE}`, [
        ['flex-grow', '1'],
        ['padding', '0 0.6em'],
        ['outline', 'none']
    ]);

    addRule(`.${ELEMENT_CLASSES.VALUE}[type="checkbox"]`,[
        ['height', '1em'],
        ['width', '2.2em'],
    ]);

    addRule(`.${ELEMENT_CLASSES.VALUE}[type="color"]`, ['height', '1.3em']);

    addRule([`.${VALID_BACKGROUND_CLASS}`, `.${INVALID_BACKGROUND_CLASS}`], ['right', '0']);

    addRule(`.${VALID_BACKGROUND_CLASS}`, ['background-color', 'var(--validBackground)']);

    addRule(`.${INVALID_BACKGROUND_CLASS}`, ['background-color', 'var(--invalidBackground)']);

    addRule(
        `.${VALID_CLASS} > .${ELEMENT_CLASSES.BACKGROUND_CONTAINER} > .${VALID_BACKGROUND_CLASS}`,
        ['width', '100%']
    );

    addRule(
        `.${INVALID_CLASS} > .${ELEMENT_CLASSES.BACKGROUND_CONTAINER} > .${INVALID_BACKGROUND_CLASS}`,
        ['width', '100%']
    );

    addRule(
        `.${VALID_CLASS} > .${ELEMENT_CLASSES.HEAD_CONTAINER} .${ELEMENT_CLASSES.VALUE_CONTAINER}`,
        ['color', 'var(--validFont) !important']
    );

    addRule(
        `.${INVALID_CLASS} > .${ELEMENT_CLASSES.HEAD_CONTAINER} .${ELEMENT_CLASSES.VALUE_CONTAINER}`,
        ['color', 'var(--invalidFont) !important']
    );
}
