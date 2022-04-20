import {HIGHLIGHT_SOURCE_CLASS, HIGHLIGHT_BRANCH_CLASS, EAVE_ID, FOCUS_CLASS} from './consts';

import {ACTION_ID as MOVE_ID} from '../move/consts';

import {DEPTH_CLASS_PREFIX, ELEMENT_CLASSES, ROOT_CLASS} from '../../consts';

import {addDepthChangeListener} from '../../../style/update/depth';

import {addRule} from '../../../../../css';

export default function generate() {

    // Background

    addRule(`.${ELEMENT_CLASSES.INTERACTION_CONTAINER}`, [
        ['padding-left', '5px'],
        ['background-size', '5px'],
        ['background-repeat', 'no-repeat'],
        ['transition', 'background-size 300ms, color 500ms']
    ]);

    addRule([
        `.${FOCUS_CLASS} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER}`,
        `.${HIGHLIGHT_SOURCE_CLASS} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER}`
    ], ['background-size', '100%']);

    addRule(`.${ELEMENT_CLASSES.INPUT_LABEL}`, ['padding-left', '15%']);

    addDepthChangeListener((depth, addRule) => {
        addRule(`.${DEPTH_CLASS_PREFIX}${depth} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER}`, [
            ['background-image', `linear-gradient(var(--nodeContrast${depth}), var(--nodeContrast${depth}))`]
        ]);

        addRule([
            `.${DEPTH_CLASS_PREFIX}${depth}.${FOCUS_CLASS} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER}`,
            `.${DEPTH_CLASS_PREFIX}${depth}.${HIGHLIGHT_SOURCE_CLASS} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER}`
        ], [
            ['color', `var(--nodeBase${depth})`]
        ]);

        // Label background

        addRule(
            `.${DEPTH_CLASS_PREFIX}${depth} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER} .${ELEMENT_CLASSES.INPUT_LABEL}`,
            ['background-image', `linear-gradient(to left, var(--nodeBase${depth}) 60%, transparent)`]
        );

        addRule([
            `.${DEPTH_CLASS_PREFIX}${depth}.${FOCUS_CLASS} >` +
            `.${ELEMENT_CLASSES.INTERACTION_CONTAINER} .${ELEMENT_CLASSES.INPUT_LABEL}`,
            `.${DEPTH_CLASS_PREFIX}${depth}.${HIGHLIGHT_SOURCE_CLASS} >` +
            `.${ELEMENT_CLASSES.INTERACTION_CONTAINER} .${ELEMENT_CLASSES.INPUT_LABEL}`
        ], ['background-image', `linear-gradient(to left, var(--nodeContrast${depth}) 60%, transparent)`]);
    });

    // Focus exclusion

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

    // Bug fixer

    addRule(`#${EAVE_ID}`, [
        ['position', 'absolute'],
        ['bottom', '0'],
        ['width', '100%'],
        ['height', '1px']
    ]);
}
