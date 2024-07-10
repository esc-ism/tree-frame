import {BUTTON_CLASS, BUTTON_CONTAINER_ID} from './consts';

import {BUTTON_ACTIVE_CLASS} from '../../consts';
import {addRule} from '../../css';

const ACTIVE_SELECTOR = `.${BUTTON_CLASS}.${BUTTON_ACTIVE_CLASS}`;

export function addColourRule(actionId: string, colour: string) {
	addRule(`#${actionId}${ACTIVE_SELECTOR} > svg`, [['fill', `var(${colour})`]]);
	
	addRule([`#${actionId}${ACTIVE_SELECTOR}:not(:hover):not(:focus) > svg`], [['stroke', `var(${colour})`]]);
}

export default function generate() {
	addRule(`#${BUTTON_CONTAINER_ID}`, [
		['display', 'inline-flex'],
		['flex-direction', 'row-reverse'],
		['max-width', '80%'],
		['overflow-x', 'scroll'],
		['scrollbar-width', 'none'],
		['overscroll-behavior', 'contain'],
	]);
	
	addRule([
		`.${BUTTON_CLASS}:focus > svg`,
		`.${BUTTON_CLASS}:hover > svg`,
		`${ACTIVE_SELECTOR} > svg`,
	], ['background-color', `var(--headContrast)`]);
	
	addRule(`.${BUTTON_CLASS}`, ['border-left', '2px solid var(--headContrast)']);
	
	addRule([
		`.${BUTTON_CLASS}:not(:first-child):focus`,
		`.${BUTTON_CLASS}:not(:first-child):hover`,
		`${ACTIVE_SELECTOR}:not(:first-child)`,
	], ['border-color', 'var(--headBase)']);
	
	addRule([
		`.${BUTTON_CLASS}:focus > svg`,
		`.${BUTTON_CLASS}:hover > svg`,
	], ['stroke', `var(--headBase)`]);
	
	addRule(`.${BUTTON_CLASS} > svg`, [
		['width', '1.7em'],
		['stroke', 'var(--headContrast)'],
		['fill', `var(--headContrast)`],
		
		// Fixes pixel gap between button border & svg
		['margin-left', '-0.5px'],
	]);
}
