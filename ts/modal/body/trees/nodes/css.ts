import {DEPTH_CLASS_PREFIX, ELEMENT_CLASSES, MIDDLE_CLASS, ROOT_CLASS} from './consts';

import {HIGHLIGHT_BRANCH_CLASS, HIGHLIGHT_SOURCE_CLASS} from './actions/focus/consts';

import {addDepthChangeListener} from '../style/update/depth';

import {addRule} from '../../../css';

export default function generate() {
    addDepthChangeListener((depth, addRule) => {
        addRule(
            `.${DEPTH_CLASS_PREFIX}${depth} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER}`,
            ['color', `var(--nodeContrast${depth})`]
        );

        addRule(
            `.${DEPTH_CLASS_PREFIX}${depth}`,
            ['background', `var(--nodeBase${depth})`],
        );

        addRule([
            `.${DEPTH_CLASS_PREFIX}${depth}:not(.${ROOT_CLASS}):not(.${MIDDLE_CLASS}):last-child > ` +
            `.${ELEMENT_CLASSES.INTERACTION_CONTAINER}`,
            `.${DEPTH_CLASS_PREFIX}${depth}:not(.${ROOT_CLASS}):not(.${MIDDLE_CLASS}):last-child > ` +
            `.${HIGHLIGHT_SOURCE_CLASS}.${HIGHLIGHT_BRANCH_CLASS} > ${ELEMENT_CLASSES.INTERACTION_CONTAINER}`
        ], ['border-bottom', `5px ridge var(--leafBorder${depth})`]);
    });

    addRule(`.${ROOT_CLASS}`, ['flex-grow', '1']);

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

    addRule(`.${ELEMENT_CLASSES.INTERACTION_CONTAINER}`, [
        // Prevent highlighting
        ['user-select', 'none'],
    ]);
}
