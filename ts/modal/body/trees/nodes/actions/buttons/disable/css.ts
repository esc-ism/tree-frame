import {ACTION_ID_DEFAULT, ACTION_ID_ALT, DISABLED_CLASS} from './consts';

import {addColourRule} from '../css';

import {HIGHLIGHT_CLASS} from '../../highlight/consts';

import {ELEMENT_CLASSES} from '../../../consts';

import {addRule} from '../../../../../../css';

export default function generate() {
    addColourRule(ACTION_ID_DEFAULT, '--nodeButtonDisable');

    addColourRule(ACTION_ID_ALT, '--nodeButtonDelete');

    addRule([
        // Self selectors
        `.${DISABLED_CLASS}:not(.${HIGHLIGHT_CLASS}) > ` +
        `.${ELEMENT_CLASSES.HEAD_CONTAINER} > .${ELEMENT_CLASSES.VALUE_CONTAINER}`,
        `.${DISABLED_CLASS}:not(.${HIGHLIGHT_CLASS}) > ` +
        `.${ELEMENT_CLASSES.HEAD_CONTAINER} > .${ELEMENT_CLASSES.LABEL_CONTAINER}`,
        // Descendant selectors
        `.${DISABLED_CLASS} :not(.${HIGHLIGHT_CLASS}) > ` +
        `.${ELEMENT_CLASSES.HEAD_CONTAINER} > .${ELEMENT_CLASSES.VALUE_CONTAINER}`,
        `.${DISABLED_CLASS} :not(.${HIGHLIGHT_CLASS}) > ` +
        `.${ELEMENT_CLASSES.HEAD_CONTAINER} > .${ELEMENT_CLASSES.LABEL_CONTAINER}`,
    ], ['opacity', '0.5']);
}
