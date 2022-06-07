import {FOCUS_SOURCE_CLASS, FOCUS_CLASS} from './consts';

import {ELEMENT_CLASSES, MIDDLE_CLASS, ROOT_CLASS} from '../../consts';

import {addRule} from '../../../../../css';

export default function generate() {
    addRule(`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}`, ['cursor', 'zoom-in']);

    addRule(`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}.${FOCUS_SOURCE_CLASS}`, ['cursor', 'zoom-out']);

    addRule(
        `.${ROOT_CLASS}.${FOCUS_CLASS} ` +
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${FOCUS_CLASS})` +
        `:not(.${FOCUS_SOURCE_CLASS} > .${ELEMENT_CLASSES.CHILD_CONTAINER} > *)`,
        ['display', 'none']
    );

    // Makes it easy to focus down the tree
    addRule(`.${FOCUS_SOURCE_CLASS} .${MIDDLE_CLASS} > .${ELEMENT_CLASSES.HEAD_CONTAINER}`, [
        ['margin-left', '1.8em'],
    ]);
}
