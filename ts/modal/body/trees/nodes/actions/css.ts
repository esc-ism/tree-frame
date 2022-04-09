import {BUTTON_CLASS} from './consts';

import {ACTION_ID as MOVE_ACTION_ID} from './move/consts';
import {ACTION_ID as EDIT_ACTION_ID} from './edit/consts';
import {FOCUS_CLASS, HIGHLIGHT_SOURCE_CLASS} from './focus/consts';

import generateCreate from './create/css';
import generateEdit from './edit/css';
import generateMove from './move/css';
import generateRemove from './delete/css';
import generateFocus from './focus/css';

import {ELEMENT_CLASSES} from '../consts';

import {TREE_CONTAINER_ID} from '../../consts';

import {BUTTON_ACTIVE_CLASS, SVG_NAMESPACE} from '../../../../consts';

import {addRule} from '../../../../css';

const FILTER_ID = 'node-filter';

export function addColourRule(actionId: string, strokeVar: string) {
    addRule([
        // Hovered
        `.${actionId}:focus > svg`,
        `.${actionId}:hover > svg`,
    ], [
        ['fill', `var(--base)`],
    ]);

    addRule([
        // Hovered
        `.${actionId}:focus:not(.${BUTTON_ACTIVE_CLASS}) > svg`,
        `.${actionId}:hover:not(.${BUTTON_ACTIVE_CLASS}) > svg`,
    ], [
        ['stroke', `var(--contrast)`],
    ]);

    addRule([
        // Not focused, not hovered
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${HIGHLIGHT_SOURCE_CLASS}):not(.${FOCUS_CLASS}) > ` +
        `.${ELEMENT_CLASSES.INTERACTION_CONTAINER} ` +
        `.${actionId} > svg`,
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

    (() => {
        const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
        const defs = document.createElementNS(SVG_NAMESPACE, 'defs');
        const filter = document.createElementNS(SVG_NAMESPACE, 'filter');
        const blur = document.createElementNS(SVG_NAMESPACE, 'feGaussianBlur');

        filter.id = FILTER_ID;

        filter.setAttribute('x', '0');
        filter.setAttribute('y', '0');

        blur.setAttribute('in', 'SourceGraphic');
        blur.setAttribute('stdDeviation', '0.8');

        filter.append(blur);
        defs.append(filter);
        svg.append(defs);

        document.body.append(svg);
    })();

    // Svg appearance

    addRule(`.${ELEMENT_CLASSES.BUTTON_CONTAINER}`, ['display', 'inline-flex']);

    addRule(`.${BUTTON_CLASS} > svg`, ['width', '1.5em']);

    addRule(
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(${HIGHLIGHT_SOURCE_CLASS}):not(${FOCUS_CLASS}) > ` +
        `${ELEMENT_CLASSES.INTERACTION_CONTAINER} circle`,
        ['stroke', 'transparent']
    );

    addRule(`.${BUTTON_CLASS} > svg`, ['stroke', 'var(--base)']);

    addRule([
        // Not focused, not hovered
        `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${HIGHLIGHT_SOURCE_CLASS}):not(.${FOCUS_CLASS}) > ` +
        `.${ELEMENT_CLASSES.INTERACTION_CONTAINER} svg`
    ], [
        ['opacity', '0.5'],
        ['filter', `url(#${FILTER_ID})`],
        ['fill', 'none']
    ]);

    addRule([
        // Not active, focused
        `.${BUTTON_CLASS}:not(.${BUTTON_ACTIVE_CLASS}):focus > svg`,
        `.${BUTTON_CLASS}:not(.${BUTTON_ACTIVE_CLASS}):hover > svg`,
        // Active, not focused
        `.${BUTTON_CLASS}.${BUTTON_ACTIVE_CLASS}:not(:focus):not(:hover) > svg`
    ], ['fill', 'var(--base)']);

    // Active action clash avoidance

    addRule([
        `#${TREE_CONTAINER_ID}.${EDIT_ACTION_ID} .${MOVE_ACTION_ID}`,
        `#${TREE_CONTAINER_ID}.${MOVE_ACTION_ID} .${EDIT_ACTION_ID}`
    ], ['display', 'none']);
}
