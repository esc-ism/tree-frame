import {BUTTON_CLASS, BUTTON_CONTAINER_ID} from './consts';

import {BUTTON_ACTIVE_CLASS} from '../../consts';
import {addRule} from '../../css';

export function addColourRule(actionId: string, colour: string) {
    addRule([
        `#${actionId}:focus > svg`, `#${actionId}:hover > svg`,
        `#${actionId}.${BUTTON_ACTIVE_CLASS} > svg`
    ], [
        ['background-color', `var(--contrast)`],
    ]);

    addRule([
        `#${actionId}:focus:not(.${BUTTON_ACTIVE_CLASS}) > svg`,
        `#${actionId}:hover:not(.${BUTTON_ACTIVE_CLASS}) > svg`
    ], [
        ['stroke', `var(--base)`],
    ]);

    addRule(`#${actionId}.${BUTTON_ACTIVE_CLASS} > svg`, [
        ['stroke', `var(--base)`],
        ['fill', `var(${colour})`],
    ]);
}

export default function generate() {
    addRule(`#${BUTTON_CONTAINER_ID}`, [
        ['display', 'inline-flex'],
        ['flex-direction', 'row']
    ]);

    addRule(`.${BUTTON_CLASS}`, ['border-left', '2px solid var(--contrast)']);

    addRule(`.${BUTTON_CLASS} > svg`, [
        ['width', '1.81em'],
        ['stroke', 'var(--contrast)'],
        ['fill', `var(--contrast)`],

        // Fixes pixel gap between button border & svg
        ['margin-left', '-0.5px']
    ]);
}
