import {INVALID_CLASS, VALID_CLASS} from './consts';

import {ELEMENT_CLASSES} from '../../consts';

import {addRule} from '../../../../../css';

export default function generate() {
    addRule(`.${ELEMENT_CLASSES.VALUE_CONTAINER}`, [
        ['flex-grow', '1'],
        ['display', 'flex'],
        ['height', '100%'],
        ['align-items', 'center']
    ]);

    // Use pointer when the node has a value and isn't being edited
    addRule([
        `.${ELEMENT_CLASSES.VALUE_CONTAINER}`,
        `.${ELEMENT_CLASSES.VALUE}:not(:focus:not([type="checkbox"]))`,
        `.${ELEMENT_CLASSES.VALUE_CONTAINER} ~ *`
    ], ['cursor', 'pointer']);

    addRule(`.${ELEMENT_CLASSES.VALUE}`, [
        ['flex-grow', '1'],
        ['height', '80%'],
        ['padding', '0 0.6em'],
        ['outline', 'none']
    ]);

    addRule(`.${ELEMENT_CLASSES.VALUE}[type="checkbox"]`, ['height', '1em']);

    addRule(`.${ELEMENT_CLASSES.VALUE}[type="color"]`, ['height', '1.3em']);

    addRule(`.${ELEMENT_CLASSES.INTERACTION_CONTAINER}::before`, [
        ['content', '""'],
        ['white-space', 'pre'],
        ['width', '0'],
        ['position', 'absolute'],
        ['right', '0'],
        ['flex-grow', '1'],
        ['height', '100%'],
        ['pointer-events', 'none'],
        ['transition', 'width 500ms, background-color 300ms']
    ]);

    // Puts button backgrounds above the pseudo-element's
    addRule([
        `.${VALID_CLASS} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER} > .${ELEMENT_CLASSES.BUTTON_CONTAINER}`,
        `.${INVALID_CLASS} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER} > .${ELEMENT_CLASSES.BUTTON_CONTAINER}`,
    ], ['z-index', '0']);

    addRule(
        `.${VALID_CLASS} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER}::before`, [
            ['background-color', 'var(--validBackground)'],
            ['width', '100%']
        ]
    );

    addRule(
        `.${INVALID_CLASS} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER}::before`, [
            ['background-color', 'var(--invalidBackground)'],
            ['width', '100%']
        ]
    );

    addRule(`.${VALID_CLASS} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER}`, [
        ['color', 'var(--validFont) !important']
    ]);

    addRule(`.${INVALID_CLASS} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER}`, [
        ['color', 'var(--invalidFont) !important']
    ]);
}
