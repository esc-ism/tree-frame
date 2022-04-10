import {ROOT_CLASS, ELEMENT_CLASSES, MIDDLE_CLASS} from '../nodes/consts';

import {FOCUS_CLASS, HIGHLIGHT_BRANCH_CLASS, HIGHLIGHT_SOURCE_CLASS} from '../nodes/actions/focus/consts';

import {addRule} from '../../../css';

export const BACKGROUND_IMAGE_SIZE = '5px';

export default function generate() {
    addRule(`.${ROOT_CLASS}`, ['flex-grow', '1']);

    addRule(`.${ELEMENT_CLASSES.INTERACTION_CONTAINER}`, [
        ['user-select', 'none'],

        ['padding-left', BACKGROUND_IMAGE_SIZE],
        ['background-size', BACKGROUND_IMAGE_SIZE],
        ['background-repeat', 'no-repeat'],
        ['background-image', 'linear-gradient(var(--contrast), var(--contrast))'],
        ['transition', 'background-size 300ms, color 500ms']
    ]);

    addRule([
        `.${FOCUS_CLASS} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER}`,
        `.${HIGHLIGHT_SOURCE_CLASS} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER}`
    ], [
        ['color', 'var(--base)'],
        ['background-size', '100%']
    ]);

    addRule(
        `.${ELEMENT_CLASSES.CHILD_CONTAINER} .${ELEMENT_CLASSES.CHILD_CONTAINER}`,
        ['margin-left', '1.8em']
    );

    addRule(`.${ELEMENT_CLASSES.INTERACTION_CONTAINER}`, [
        // Prevents line break between buttons and input
        ['display', 'flex'],
        // Ensures buttons are aligned with input if they have different heights
        ['align-items', 'center']
    ]);

    /* Adds space at the bottom of last-child leaves. Using border rather than margin/padding prevents
        root being hoverable at the bottom & prevents the leaf's background image extending further.
     */
    addRule([
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${ROOT_CLASS}):not(.${MIDDLE_CLASS}):last-child > ` +
        `.${ELEMENT_CLASSES.INTERACTION_CONTAINER}`,
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${ROOT_CLASS}):not(.${MIDDLE_CLASS}):last-child > ` +
        `.${HIGHLIGHT_SOURCE_CLASS}.${HIGHLIGHT_BRANCH_CLASS} > ${ELEMENT_CLASSES.INTERACTION_CONTAINER}`
    ], ['border-bottom', '0.4em solid transparent']);
}
