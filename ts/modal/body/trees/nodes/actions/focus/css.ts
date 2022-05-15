import {FOCUS_SOURCE_CLASS, FOCUS_CLASS} from './consts';

import {ACTION_ID as MOVE_ID} from '../move/consts';

import {ELEMENT_CLASSES, ROOT_CLASS} from '../../consts';

import {addRule} from '../../../../../css';

export default function generate() {
    addRule(`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}`, ['cursor', 'zoom-in']);

    addRule(`.${FOCUS_SOURCE_CLASS}`, ['cursor', 'zoom-out']);

    addRule(
        `.${ROOT_CLASS}.${FOCUS_CLASS} ` +
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${FOCUS_CLASS})` +
        `:not(.${FOCUS_SOURCE_CLASS} > .${ELEMENT_CLASSES.CHILD_CONTAINER} > *)`,
        ['display', 'none']
    );

    addRule(
        `.${MOVE_ID} > .${ROOT_CLASS}.${FOCUS_CLASS} ` +
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${FOCUS_CLASS})`,
        ['display', 'none']
    );
}
