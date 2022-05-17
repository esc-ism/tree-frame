import {EAVE_ID, HIGHLIGHT_CLASS} from './consts';

import {FOCUS_SOURCE_CLASS} from '../focus/consts';
import {BUTTON_CLASS} from '../consts';

import {DEPTH_CLASS_PREFIX, ELEMENT_CLASSES} from '../../consts';

import {addRule} from '../../../../../css';

import {addDepthChangeListener} from '../../../style/update/depth';

export default function generate() {
    addRule(`.${ELEMENT_CLASSES.INTERACTION_CONTAINER}`, [
        ['background-size', '0'],
        ['background-repeat', 'no-repeat'],
        ['transition', 'background-size 300ms, color 500ms']
    ]);

    addRule([
        `.${HIGHLIGHT_CLASS} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER}`,
        `.${FOCUS_SOURCE_CLASS} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER}`
    ], ['background-size', '100%']);

    addRule(`.${ELEMENT_CLASSES.LABEL_CONTAINER}`, [
        ['position', 'absolute'],
        ['right', '0'],
        ['text-align', 'right'],
        ['padding-right', '0.4em'],
        // Avoid overlapping node outlines
        ['height', 'calc(100% - 1.5px)'],
        // Vertical align
        ['display', 'flex'],
        ['align-items', 'center'],
        // Extend the background further into the value
        ['padding-left', '15%'],
        // Fixes inconsistent modal outline overlap
        ['margin-right', '0.5px']
    ]);

    addRule(`.${BUTTON_CLASS}:last-child`, [
        ['border-top-right-radius', '50%'],
        ['border-bottom-right-radius', '50%']
    ]);

    addDepthChangeListener((depth, addRule) => {
        const depthSelector = `.${DEPTH_CLASS_PREFIX}${depth} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER}`;

        addRule(depthSelector, [
            ['background-image', `linear-gradient(var(--nodeContrast${depth}), var(--nodeContrast${depth}))`]
        ]);

        addRule(`${depthSelector} .${BUTTON_CLASS}`, [
            ['background-color', `var(--nodeContrast${depth})`]
        ]);

        addRule(
            [`.${HIGHLIGHT_CLASS}${depthSelector}`, `.${FOCUS_SOURCE_CLASS}${depthSelector}`],
            ['color', `var(--nodeBase${depth})`]
        );

        addRule(`${depthSelector} > .${ELEMENT_CLASSES.LABEL_CONTAINER}`, [
            ['background-image', `linear-gradient(to left, var(--nodeBase${depth}) 60%, transparent)`],
            ['background-size', 'auto']
        ]);

        addRule([
            `.${HIGHLIGHT_CLASS}${depthSelector} > .${ELEMENT_CLASSES.LABEL_CONTAINER}`,
            `.${FOCUS_SOURCE_CLASS}${depthSelector} > .${ELEMENT_CLASSES.LABEL_CONTAINER}`
        ], ['background-image', `linear-gradient(to left, var(--nodeContrast${depth}) 60%, transparent)`]);
    });

    // Bug fixer

    addRule(`#${EAVE_ID}`, [
        ['position', 'absolute'],
        ['bottom', '0'],
        ['width', '100%'],
        ['height', '1px']
    ]);
};
