import {DEPTH_CLASS_PREFIX, ELEMENT_CLASSES, ROOT_CLASS} from './consts';

import {addDepthChangeListener} from '../style/update/depth';

import {addRule} from '../../../css';

export default function generate() {
    addDepthChangeListener((depth, addRule) => {
        addRule(`.${DEPTH_CLASS_PREFIX}${depth}`, [
            ['color', `var(--nodeContrast${depth})`],
            ['background', `var(--nodeBase${depth})`]
        ]);

        addRule(
            `.${DEPTH_CLASS_PREFIX}${depth}`,
            ['outline', `var(--borderNode) solid var(--nodeContrast${depth})`]
        );

        addRule(
            `.${DEPTH_CLASS_PREFIX}${depth} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER}`,
            ['outline', `var(--borderValue) solid var(--nodeContrast${depth})`]
        );
    });

    addRule(`.${ROOT_CLASS}`, [
        ['flex-grow', '1'],
        // Apparently it maxes out at the viewport's height without a content-related height value
        ['height', 'fit-content']
    ]);

    addRule(`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}`, [
        ['outline-offset', '-1px'],
        ['padding-top', '1px']
    ]);

    addRule(
        `.${ELEMENT_CLASSES.CHILD_CONTAINER} .${ELEMENT_CLASSES.CHILD_CONTAINER}`, [
            ['margin-left', '1.8em']
        ]);

    addRule(`.${ELEMENT_CLASSES.INTERACTION_CONTAINER}`, [
        ['height', '1.6em'],
        ['display', 'flex'],
        ['align-items', 'center'],
        ['outline-offset', '-1px'],
        ['margin-top', '-1px'],
    ]);

    addRule(`.${ELEMENT_CLASSES.INTERACTION_CONTAINER}`, [
        ['user-select', 'none']
    ]);
}
