import {BUTTON_CLASS, BUTTON_CONTAINER_ID} from './consts';

import {BUTTON_ACTIVE_CLASS} from '../../consts';
import {addRule} from '../../css';

export function addColourRule(actionId: string, colour: string) {
    addRule(`#${actionId}.${BUTTON_ACTIVE_CLASS} > svg`, [
        ['stroke', `var(--headBase)`],
        ['fill', `var(${colour})`]
    ]);
}

export default function generate() {
    addRule([
        `.${BUTTON_CLASS}:focus > svg`, `.${BUTTON_CLASS}:hover > svg`,
        `.${BUTTON_CLASS}.${BUTTON_ACTIVE_CLASS} > svg`
    ], [
        ['background-color', `var(--headContrast)`]
    ]);

    addRule([
        `.${BUTTON_CLASS}:focus:not(.${BUTTON_ACTIVE_CLASS}) > svg`,
        `.${BUTTON_CLASS}:hover:not(.${BUTTON_ACTIVE_CLASS}) > svg`
    ], [
        ['stroke', `var(--headBase)`]
    ]);

    addRule(`#${BUTTON_CONTAINER_ID}`, [
        ['display', 'inline-flex'],
        ['flex-direction', 'row']
    ]);

    addRule(`.${BUTTON_CLASS}`, ['border-left', '2px solid var(--headContrast)']);

    addRule(`.${BUTTON_CLASS} > svg`, [
        ['width', '1.81em'],
        ['stroke', 'var(--headContrast)'],
        ['fill', `var(--headContrast)`],

        // Fixes pixel gap between button border & svg
        ['margin-left', '-0.5px']
    ]);
}
