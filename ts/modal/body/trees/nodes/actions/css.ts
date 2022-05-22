import {BUTTON_CLASS} from './consts';

import {FOCUS_SOURCE_CLASS} from './focus/consts';
import {HIGHLIGHT_CLASS} from './highlight/consts';

import generateCreate from './create/css';
import generateEdit from './edit/css';
import generateMove from './move/css';
import generateRemove from './delete/css';
import generateHighlight from './highlight/css';
import generateFocus from './focus/css';
import generateTooltip from './tooltip/css';
import generateDisable from './disable/css';

import {DEPTH_CLASS_PREFIX, ELEMENT_CLASSES} from '../consts';

import {addDepthChangeListener} from '../../style/update/depth';

import {BUTTON_ACTIVE_CLASS} from '../../../../consts';

import {addRule} from '../../../../css';

export function addColourRule(actionId: string, strokeVar: string) {
    addRule([
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${FOCUS_SOURCE_CLASS}):not(.${HIGHLIGHT_CLASS}) > ` +
        `.${ELEMENT_CLASSES.HEAD_CONTAINER} > .${ELEMENT_CLASSES.BUTTON_CONTAINER} ` +
        `.${BUTTON_CLASS}.${actionId} > svg`
    ], ['fill', `var(${strokeVar})`]);

    addRule([
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${FOCUS_SOURCE_CLASS}):not(.${HIGHLIGHT_CLASS}) > ` +
        `.${ELEMENT_CLASSES.HEAD_CONTAINER} > .${ELEMENT_CLASSES.BUTTON_CONTAINER} ` +
        `.${BUTTON_CLASS}.${actionId} > svg > g`
    ], ['stroke', `none`]);

    addRule(`.${BUTTON_CLASS}.${BUTTON_ACTIVE_CLASS}.${actionId} > svg`, ['stroke', `var(${strokeVar}) !important`]);
}

export default function generate() {
    generateCreate();
    generateEdit();
    generateMove();
    generateRemove();
    generateHighlight();
    generateFocus();
    generateDisable();
    generateTooltip();

    addRule(`.${BUTTON_CLASS}`, ['height', '100%']);

    addRule(`.${BUTTON_CLASS} > svg`, [
        ['height', '100%'],
        ['transform', 'scale(1.05)']
    ]);

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

    addDepthChangeListener((depth, addRule) => {
        const depthSelector = `.${DEPTH_CLASS_PREFIX}${depth} > .${ELEMENT_CLASSES.HEAD_CONTAINER} > .${ELEMENT_CLASSES.BUTTON_CONTAINER}`;

        addRule(`${depthSelector} svg`, ['stroke', `var(--nodeBase${depth})`]);

        addRule([
            // Not active, focused
            `${depthSelector} .${BUTTON_CLASS}:focus > svg`,
            `${depthSelector} .${BUTTON_CLASS}:hover > svg`,
            `${depthSelector} .${BUTTON_ACTIVE_CLASS} > svg`
        ], [
            ['stroke', `var(--nodeContrast${depth})`],
            ['fill', `var(--nodeBase${depth})`]
        ]);
    });
}
