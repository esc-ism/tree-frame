import {ACTION_ID} from './consts';

import {addColourRule} from '../css';

import {addRule} from '../../../css';

import {TREE_CONTAINER_ID} from '../../../body/trees/consts';

import {ELEMENT_CLASSES, ROOT_CLASS} from '../../../body/trees/nodes/consts';

import {FOCUS_CLASS, HIGHLIGHT_SOURCE_CLASS} from '../../../body/trees/nodes/actions/focus/consts';

export default function generate() {
    addRule([
        `#${TREE_CONTAINER_ID}:not(.${ACTION_ID}) .${ELEMENT_CLASSES.INPUT_LABEL}`,
        `.${ROOT_CLASS} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER} .${ELEMENT_CLASSES.INPUT_LABEL}`
    ], ['display', 'none']);

    addRule(`.${ELEMENT_CLASSES.INPUT_LABEL}`, [
        ['text-align', 'right'],
        ['position', 'absolute'],
        ['right', '0'],
        ['padding-left', '20%'],
        ['background-image', 'linear-gradient(to right, transparent, var(--baseBody) 70%)']
    ]);

    addRule([
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}.${FOCUS_CLASS} >` +
        `.${ELEMENT_CLASSES.INTERACTION_CONTAINER} .${ELEMENT_CLASSES.INPUT_LABEL}`,
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}.${HIGHLIGHT_SOURCE_CLASS} >` +
        `.${ELEMENT_CLASSES.INTERACTION_CONTAINER} .${ELEMENT_CLASSES.INPUT_LABEL}`
    ], [
        ['background-image', 'linear-gradient(to right, transparent, var(--contrastBody) 70%)']
    ]);

    addColourRule(ACTION_ID, '--modalButtonLabel');
}
