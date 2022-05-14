import {BUTTON_CLASS} from './consts';

import {FOCUS_CLASS, HIGHLIGHT_SOURCE_CLASS} from './focus/consts';

import generateCreate from './create/css';
import generateEdit from './edit/css';
import generateMove from './move/css';
import generateRemove from './delete/css';
import generateFocus from './focus/css';
import generateTooltip from './tooltip/css';

import {DEPTH_CLASS_PREFIX, ELEMENT_CLASSES} from '../consts';

import {addDepthChangeListener} from '../../style/update/depth';

import {BUTTON_ACTIVE_CLASS, SVG_NAMESPACE} from '../../../../consts';

import {addRule} from '../../../../css';

const FILTER_ID = 'node-filter';

export function addColourRule(actionId: string, strokeVar: string) {
    addRule([
        // Not focused, not hovered
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${HIGHLIGHT_SOURCE_CLASS}):not(.${FOCUS_CLASS}) > ` +
        `.${ELEMENT_CLASSES.INTERACTION_CONTAINER} ` +
        `.${BUTTON_CLASS}.${actionId} > svg`,
        // Active
        `.${actionId}.${BUTTON_ACTIVE_CLASS} > svg`
    ], ['stroke', `var(${strokeVar})`]);
}

// Filter setup

export default function generate() {
    generateCreate();
    generateEdit();
    generateMove();
    generateRemove();
    generateFocus();
    generateTooltip();

    (() => {
        const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
        const defs = document.createElementNS(SVG_NAMESPACE, 'defs');
        const filter = document.createElementNS(SVG_NAMESPACE, 'filter');
        const blur = document.createElementNS(SVG_NAMESPACE, 'feGaussianBlur');

        filter.id = FILTER_ID;

        filter.setAttribute('x', '0');
        filter.setAttribute('y', '0');

        blur.setAttribute('in', 'SourceGraphic');
        blur.setAttribute('stdDeviation', '0.75');

        filter.append(blur);
        defs.append(filter);
        svg.append(defs);

        document.body.append(svg);
    })();

    // Svg appearance

    addRule(`.${ELEMENT_CLASSES.BUTTON_CONTAINER}`, [
        ['height', '100%'],
        ['display', 'flex']
    ]);

    addRule(`.${BUTTON_CLASS} > svg`, ['height', '100%']);

    addRule(`.${BUTTON_CLASS}:last-child`, [
        // Separate from value
        ['margin-right', '0.2em'],
    ]);

    addRule(
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(${HIGHLIGHT_SOURCE_CLASS}):not(${FOCUS_CLASS}) > ` +
        `${ELEMENT_CLASSES.INTERACTION_CONTAINER} circle`,
        ['stroke', 'transparent']
    );

    addRule(
        // Not focused, not hovered
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${HIGHLIGHT_SOURCE_CLASS}):not(.${FOCUS_CLASS}) > ` +
        `.${ELEMENT_CLASSES.INTERACTION_CONTAINER} svg`, [
            ['opacity', '0.5'],
            ['filter', `url(#${FILTER_ID})`],
            ['fill', 'none']
        ]
    );

    addDepthChangeListener((depth, addRule) => {
        const depthSelector = `.${DEPTH_CLASS_PREFIX}${depth} > .${ELEMENT_CLASSES.INTERACTION_CONTAINER}`;

        addRule(
            [`${depthSelector} .${BUTTON_CLASS}:not(.${BUTTON_ACTIVE_CLASS}) svg`],
            ['stroke', `var(--nodeBase${depth})`]
        );

        addRule([
            // Not active, focused
            `${depthSelector} .${BUTTON_CLASS}:not(.${BUTTON_ACTIVE_CLASS}):focus > svg`,
            `${depthSelector} .${BUTTON_CLASS}:not(.${BUTTON_ACTIVE_CLASS}):hover > svg`
        ], [
            ['stroke', `var(--nodeContrast${depth})`],
            ['fill', `var(--nodeBase${depth})`]
        ]);

        addRule(
            `${depthSelector} .${BUTTON_CLASS}.${BUTTON_ACTIVE_CLASS} > svg`,
            ['fill', `var(--nodeBase${depth})`]
        );
    });
}
