import {FOCUS_SOURCE_CLASS, FOCUS_BRANCH_CLASS} from './consts';

import {ELEMENT_CLASSES, ROOT_CLASS} from '../../consts';

import {addRule} from '../../../../../css';

export default function generate() {
    addRule(
        `.${ROOT_CLASS}.${FOCUS_BRANCH_CLASS} ` +
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${FOCUS_BRANCH_CLASS}):not(.${FOCUS_SOURCE_CLASS} > .${ELEMENT_CLASSES.CHILD_CONTAINER} > *)`,
        ['display', 'none']
    );

    addRule(`.${ELEMENT_CLASSES.CHILD_CONTAINER}`, ['transition', 'opacity 200ms']);

    addRule(
        `.${FOCUS_SOURCE_CLASS}.${FOCUS_BRANCH_CLASS} > .${ELEMENT_CLASSES.CHILD_CONTAINER}`,
        ['opacity', '0.3']
    );
}
