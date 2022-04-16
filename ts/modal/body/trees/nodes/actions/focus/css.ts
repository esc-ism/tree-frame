import {HIGHLIGHT_SOURCE_CLASS, HIGHLIGHT_BRANCH_CLASS, EAVE_ID} from './consts';

import {ACTION_ID as MOVE_ID} from '../move/consts';

import {ELEMENT_CLASSES, ROOT_CLASS} from '../../consts';

import {addRule} from '../../../../../css';

export default function generate() {
    addRule(
        `.${ROOT_CLASS}.${HIGHLIGHT_BRANCH_CLASS} ` +
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${HIGHLIGHT_BRANCH_CLASS})` +
        `:not(.${HIGHLIGHT_SOURCE_CLASS} > .${ELEMENT_CLASSES.CHILD_CONTAINER} > *)`,
        ['display', 'none']
    );

    addRule(
        `.${MOVE_ID} > .${ROOT_CLASS}.${HIGHLIGHT_BRANCH_CLASS} ` +
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${HIGHLIGHT_BRANCH_CLASS})`,
        ['display', 'none']
    );

    addRule(`.${ELEMENT_CLASSES.CHILD_CONTAINER}`, ['transition', 'opacity 200ms']);

    addRule(
        `.${HIGHLIGHT_SOURCE_CLASS}.${HIGHLIGHT_BRANCH_CLASS} > .${ELEMENT_CLASSES.CHILD_CONTAINER}`,
        ['opacity', '0.3']
    );

    addRule(`#${EAVE_ID}`, [
        ['position', 'absolute'],
        ['bottom', '0'],
        ['width', '100%'],
        ['height', '1px']
    ]);
}
