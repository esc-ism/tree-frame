import {EAVE_ID, HIGHLIGHT_CLASS, HIGHLIGHT_BACKGROUND_CLASS} from './consts';

import {BUTTON_CLASS} from '../buttons/consts';

import {DEPTH_CLASS_PREFIX, ELEMENT_CLASSES} from '@nodes/consts';

import {addDepthChangeListener} from '@/modal/body/trees/style/update/depth';

import {addRule} from '@/modal/css';

export default function generate() {
    addRule(
        `.${HIGHLIGHT_CLASS} > .${ELEMENT_CLASSES.BACKGROUND_CONTAINER} > .${HIGHLIGHT_BACKGROUND_CLASS}`,
        ['width', '100%']
    );

    addRule(`.${ELEMENT_CLASSES.LABEL_CONTAINER}`, [
        ['padding-right', '0.4em'],
        // Extend the background further into the value
        ['padding-left', '15%'],
    ]);

    addRule(`.${BUTTON_CLASS}:last-child`, [
        ['border-top-right-radius', '50%'],
        ['border-bottom-right-radius', '50%']
    ]);

    addDepthChangeListener((depth, addRule) => {
        const rootSelector = `.${DEPTH_CLASS_PREFIX}${depth}`;
        const headSelector = `${rootSelector} > .${ELEMENT_CLASSES.HEAD_CONTAINER}`;

        addRule(
            `${rootSelector} > .${ELEMENT_CLASSES.BACKGROUND_CONTAINER} > .${HIGHLIGHT_BACKGROUND_CLASS}`,
            ['background-color', `var(--nodeContrast${depth})`]
        );

        addRule(
            `${headSelector} .${BUTTON_CLASS}`,
            ['background-color', `var(--nodeContrast${depth})`]
        );

        addRule([
            `.${HIGHLIGHT_CLASS}${headSelector} > .${ELEMENT_CLASSES.VALUE_CONTAINER}`,
            `.${HIGHLIGHT_CLASS}${headSelector} > .${ELEMENT_CLASSES.LABEL_CONTAINER}`
        ], ['color', `var(--nodeBase${depth})`]);

        addRule(`${headSelector} > .${ELEMENT_CLASSES.LABEL_CONTAINER}`, [
            ['background-image', `linear-gradient(to left, var(--nodeBase${depth}) 60%, transparent)`],
            ['background-size', 'auto']
        ]);

        addRule(
            `.${HIGHLIGHT_CLASS}${headSelector} > .${ELEMENT_CLASSES.LABEL_CONTAINER}`,
            ['background-image', `linear-gradient(to left, var(--nodeContrast${depth}) 60%, transparent)`]
        );
    });

    // Bug fixer

    addRule(`#${EAVE_ID}`, [
        ['position', 'absolute'],
        ['bottom', '0'],
        ['width', '100%'],
        ['height', '1px']
    ]);
};
