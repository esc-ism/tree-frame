import {ALT_CLASS, BUTTON_CLASS, PROSPECTIVE_CLASS} from './consts';

import generateCreate from './create/css';
import generateMove from './move/css';
import generateDisable from './disable/css';
import generateDuplicate from './duplicate/css';
import generatePosition from './position/css';

import {FOCUS_SOURCE_CLASS} from '../focus/consts';
import {HIGHLIGHT_CLASS} from '../highlight/consts';

import {DEPTH_CLASS_PREFIX, ELEMENT_CLASSES} from '@nodes/consts';

import {addDepthChangeListener} from '@/modal/body/trees/style/update/depth';

import {ACTION_ID as ALT_ID} from '@/modal/header/actions/alternate/consts';

import {BUTTON_ACTIVE_CLASS} from '@/modal/consts';
import {addRule} from '@/modal/css';

export function addColourRule(actionId: string, strokeVar: string) {
    addRule([
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${FOCUS_SOURCE_CLASS}):not(.${HIGHLIGHT_CLASS}) > ` +
        `.${ELEMENT_CLASSES.HEAD_CONTAINER} > .${ELEMENT_CLASSES.BUTTON_CONTAINER} ` +
        `.${BUTTON_CLASS}.${actionId} > svg`
    ], ['fill', `var(${strokeVar})`]);

    addRule([
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${FOCUS_SOURCE_CLASS}):not(.${HIGHLIGHT_CLASS}) > ` +
        `.${ELEMENT_CLASSES.HEAD_CONTAINER} > .${ELEMENT_CLASSES.BUTTON_CONTAINER} ` +
        `.${BUTTON_CLASS}.${actionId}:not(.${BUTTON_ACTIVE_CLASS}) > svg > g`
    ], ['stroke', `none`]);

    addRule(
        `.${HIGHLIGHT_CLASS} > .${ELEMENT_CLASSES.HEAD_CONTAINER} > .${ELEMENT_CLASSES.BUTTON_CONTAINER} > ` +
        `.${BUTTON_CLASS}.${actionId}.${BUTTON_ACTIVE_CLASS} > svg > g`,
        ['stroke', `var(${strokeVar})`]
    );
}

export default function generate() {
    generateCreate();
    generateMove();
    generateDisable();
    generateDuplicate();
    generatePosition();

    addRule(`.${BUTTON_CLASS}`, ['height', '100%']);

    addRule(`.${BUTTON_CLASS} > svg`, [
        ['height', '100%'],
        ['transform', 'scale(1.05)']
    ]);

    addRule(`.${ELEMENT_CLASSES.BUTTON_CONTAINER}`, ['white-space', 'nowrap']);

    addRule(
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(${FOCUS_SOURCE_CLASS}):not(${HIGHLIGHT_CLASS}) > ` +
        `.${ELEMENT_CLASSES.HEAD_CONTAINER} > ${ELEMENT_CLASSES.BUTTON_CONTAINER} circle`,
        ['stroke', 'transparent']
    );

    addRule(
        // Not focused, not hovered
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${FOCUS_SOURCE_CLASS}):not(.${HIGHLIGHT_CLASS}) > ` +
        `.${ELEMENT_CLASSES.HEAD_CONTAINER} > .${ELEMENT_CLASSES.BUTTON_CONTAINER} svg`, [
            ['fill', 'none']
        ]
    );

    // Hide prospective nodes
    addRule(`.${PROSPECTIVE_CLASS}`, ['display', 'none']);

    // Hide alt icon components
    addRule(`.${ALT_CLASS}:not(.${ALT_ID} *)`, ['display', 'none']);

    addRule(`.${ALT_ID} button.${ALT_CLASS} + *`, ['display', 'none']);

    addDepthChangeListener((depth, addRule) => {
        const depthSelector = `.${DEPTH_CLASS_PREFIX}${depth} > .${ELEMENT_CLASSES.HEAD_CONTAINER} > .${ELEMENT_CLASSES.BUTTON_CONTAINER}`;

        addRule(`${depthSelector} svg`, ['stroke', `var(--nodeBase${depth})`]);

        addRule([
            // Not active, focused
            `${depthSelector} .${BUTTON_CLASS}:focus > svg`,
            `${depthSelector} .${BUTTON_CLASS}:hover > svg`,
            `.${HIGHLIGHT_CLASS}${depthSelector} .${BUTTON_ACTIVE_CLASS} > svg`
        ], [
            ['stroke', `var(--nodeContrast${depth})`],
            ['fill', `var(--nodeBase${depth})`]
        ]);
    });
}
