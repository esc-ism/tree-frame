import {BUTTON_CLASS, BUTTON_CONTAINER_ID} from './consts';

import {BUTTON_ACTIVE_CLASS} from '../../consts';
import {addRule} from '../../css';

export function addColourRule(
    actionId: string,
    backgroundVar?: string, fillVar?: string, strokeVar?: string,
    targetSelector: string = 'svg'
) {
    const styles = [];

    if (backgroundVar) {
        styles.push(['background-color', `var(${backgroundVar})`]);
    }

    if (fillVar) {
        styles.push(['fill', `var(${fillVar})`]);
    }

    if (fillVar) {
        styles.push(['stroke', `var(${strokeVar})`]);
    }

    addRule([
        `#${actionId}:hover:not(.${BUTTON_ACTIVE_CLASS}) > ${targetSelector}`,
        `#${actionId}:focus:not(.${BUTTON_ACTIVE_CLASS}) > ${targetSelector}`,
        `#${actionId}.${BUTTON_ACTIVE_CLASS}:not(:hover):not(:focus) > ${targetSelector}`
    ], styles);
}

export default function generate() {
    addRule(`#${BUTTON_CONTAINER_ID}`, [
        ['display', 'inline-flex'],
        ['flex-direction', 'row'],
    ]);

    addRule(`.${BUTTON_CLASS} > svg`, ['width', '1.8em']);

    addRule(`.${BUTTON_CLASS}`, ['border-left', '2px solid var(--contrast)']);

    addRule(`.${BUTTON_CLASS} > svg`, ['stroke', 'var(--contrast)']);
}
