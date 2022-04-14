import {
    TOOLTIP_CLASS, TOOLTIP_CONTAINER_CLASS, TOOLTIP_PARENT_CLASS,
    TOOLTIP_TOP_CLASS, TOOLTIP_BOTTOM_CLASS
} from './consts';

import {ELEMENT_CLASSES} from '../../consts';

import {addRule} from '../../../../../css';

//  Also you need tooltips for deletion/creation/movement.
//  You'll need a different system to position tooltips underneath/above buttons.
//  And probably bring back that opacity animation code.

export default function generate() {
    addRule(`.${TOOLTIP_PARENT_CLASS}`, [
        ['position', 'relative']
    ]);

    addRule(`.${TOOLTIP_CONTAINER_CLASS}`, [
        ['position', 'absolute'],
        ['text-align', 'center'],
        ['z-index', '2'],
        ['width', '100%'],
        ['pointer-events', 'none']
    ]);

    addRule(`.${ELEMENT_CLASSES.INTERACTION_CONTAINER} > .${TOOLTIP_CONTAINER_CLASS}`, [
        ['margin-left', '-5px']
    ]);

    addRule(`.${TOOLTIP_CONTAINER_CLASS}.${TOOLTIP_TOP_CLASS}`, [
        ['bottom', '102%'],
    ]);

    addRule(`.${TOOLTIP_CONTAINER_CLASS}.${TOOLTIP_BOTTOM_CLASS}`, [
        ['top', '102%'],
    ]);

    addRule(`.${TOOLTIP_CLASS}`, [
        ['margin', '0 auto'],
        ['background-color', 'var(--base)'],
        ['color', 'var(--contrast)'],
        ['font-size', '0.9em'],
        ['padding', '3px 8px'],
        ['border-radius', '1em'],
        ['width', '10em'],
        ['outline', 'solid 3px var(--tooltip)']
    ]);

    // Don't show when there's no hint to give
    addRule(
        [`.${TOOLTIP_CLASS}:empty`],
        ['display', 'none']
    );

    addRule(`.${TOOLTIP_CLASS}::after`, [
        ['content', '\'\''],
        ['position', 'absolute'],
        ['left', '50%'],
        ['margin-left', '-0.5em'],
        ['border-width', '0.5em'],
        ['border-style', 'solid'],
    ]);

    addRule(`.${TOOLTIP_TOP_CLASS} > .${TOOLTIP_CLASS}::after`, [
        ['top', '100%'],
        ['border-color', 'var(--tooltip) transparent transparent transparent']
    ]);

    addRule(`.${TOOLTIP_BOTTOM_CLASS} > .${TOOLTIP_CLASS}::after`, [
        ['bottom', '100%'],
        ['border-color', 'transparent transparent var(--tooltip) transparent']
    ]);

    addRule(`.${ELEMENT_CLASSES.INTERACTION_CONTAINER}`, ['position', 'relative']);
}
