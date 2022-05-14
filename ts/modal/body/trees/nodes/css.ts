import {DEPTH_CLASS_PREFIX, ELEMENT_CLASSES, MIDDLE_CLASS, ROOT_CLASS} from './consts';

import {addDepthChangeListener} from '../style/update/depth';

import {addRule} from '../../../css';

export default function generate() {
    addDepthChangeListener((depth, addRule) => {
        addRule(`.${DEPTH_CLASS_PREFIX}${depth} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER}`, [
            ['color', `var(--nodeContrast${depth})`],
            // Use outline to avoid gaps when transparent
            ['border-bottom', `var(--borderNode) solid var(--nodeContrast${depth})`],
        ]);

        addRule(`.${DEPTH_CLASS_PREFIX}${depth}`, [
            ['background', `var(--nodeBase${depth})`]
        ]);

        addRule(
            `.${DEPTH_CLASS_PREFIX}${depth}:not(.${ROOT_CLASS}):not(.${MIDDLE_CLASS}):last-child > ` +
            `.${ELEMENT_CLASSES.INTERACTION_CONTAINER}`, [
            ['border-bottom', `var(--borderLeaf) ridge var(--nodeContrast${depth})`],
        ]);
    });

    addRule(`.${ROOT_CLASS}`, ['flex-grow', '1']);

    addRule(
        `.${ELEMENT_CLASSES.CHILD_CONTAINER} .${ELEMENT_CLASSES.CHILD_CONTAINER}`,
        ['margin-left', '1.8em']
    );

    addRule(`.${ELEMENT_CLASSES.INTERACTION_CONTAINER}`, [
        ['height', '1.6em'],
        ['display', 'flex'],
        ['align-items', 'center']
    ]);

    addRule(`.${ELEMENT_CLASSES.INTERACTION_CONTAINER}`, [
        ['user-select', 'none']
    ]);
}
