import {DEPTH_CLASS_PREFIX, ELEMENT_CLASSES, ROOT_CLASS} from './consts';

import {addDepthChangeListener} from '../style/update/depth';

import {addRule} from '../../../css';

export default function generate() {
    addRule(`.${ROOT_CLASS}`, [
        ['flex-grow', '1'],
        // Apparently it maxes out at the viewport's height without a content-related height value
        ['height', 'fit-content']
    ]);

    // For head outline alignment
    addRule(`.${ELEMENT_CLASSES.CHILD_CONTAINER}`, ['margin-top', '1px']);

    addRule(`:not(.${ROOT_CLASS}) > .${ELEMENT_CLASSES.CHILD_CONTAINER}`, ['margin-left', '1.8em']);

    addRule(`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}`, ['position', 'relative']);

    addRule(
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER} > :not(.${ELEMENT_CLASSES.CHILD_CONTAINER})`,
        ['height', '1.6em']
    );

    addRule([
        `.${ELEMENT_CLASSES.HEAD_CONTAINER}`,
        `.${ELEMENT_CLASSES.VALUE_CONTAINER}`,
        `.${ELEMENT_CLASSES.LABEL_CONTAINER}`,
        `.${ELEMENT_CLASSES.BACKGROUND_CONTAINER}`
    ], [
        ['flex-grow', '1'],
        ['display', 'flex'],
        ['align-items', 'center']
    ]);

    addRule([
        `.${ELEMENT_CLASSES.BACKGROUND_CONTAINER}`,
        `.${ELEMENT_CLASSES.LABEL_CONTAINER}`
    ], [
        ['position', 'absolute']
    ]);

    addRule([
        `.${ELEMENT_CLASSES.LABEL_CONTAINER}`
    ], [
        ['right', '0'],
        ['top', '0'],
        ['user-select', 'none']
    ]);

    addRule(`.${ELEMENT_CLASSES.BACKGROUND_CONTAINER}`, [
        ['width', '100%'],
        ['height', '100%']
    ]);

    addRule(`.${ELEMENT_CLASSES.BACKGROUND_CONTAINER} > *`, [
        ['content', '""'],
        ['white-space', 'pre'],
        ['height', '100%'],
        ['width', '0'],
        ['transition', 'width 500ms'],
        // Don't compete for space
        ['position', 'absolute']
    ]);

    addRule(`.${ELEMENT_CLASSES.HEAD_CONTAINER} > *`, [
        ['height', '100%'],
    ]);

    addRule(`.${ELEMENT_CLASSES.HEAD_CONTAINER}`, [
        ['transition', 'color 500ms'],
        // Puts it above the backgrounds
        ['position', 'relative']
    ]);

    addDepthChangeListener((depth, addRule) => {
        addRule(`.${DEPTH_CLASS_PREFIX}${depth}`, [
            ['color', `var(--nodeContrast${depth})`],
            ['background', `var(--nodeBase${depth})`]
        ]);

        addRule(
            `.${DEPTH_CLASS_PREFIX}${depth}`,
            ['outline', `1px solid var(--nodeContrast${depth})`]
        );

        addRule(
            `.${DEPTH_CLASS_PREFIX}${depth} > .${ELEMENT_CLASSES.BACKGROUND_CONTAINER}`,
            ['outline', `1px solid var(--nodeContrast${depth})`]
        );
    });
}
