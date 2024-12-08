import {ALT_CLASS, BUTTON_CLASS, TEST_ADD_CLASS, TEST_REMOVE_CLASS} from './consts';

import generateCreate from './create/css';
import generateMove from './move/css';
import generateDisable from './disable/css';
import generateDuplicate from './duplicate/css';
import generatePosition from './position/css';

import {HIGHLIGHT_CLASS} from '../highlight/consts';

import {GROUP_CLASS_PREFIX, ELEMENT_CLASSES} from '@nodes/consts';

import {addGroupChangeListener} from '@/modal/body/style/update/depth';

import {ACTION_ID as ALT_ID} from '@/modal/header/actions/alternate/consts';

import {BUTTON_ACTIVE_CLASS} from '@/modal/consts';
import {addRule} from '@/modal/css';

export function addColourRule(actionId: string, strokeVar: string) {
	addRule([
		`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${HIGHLIGHT_CLASS}) > `
		+ `.${ELEMENT_CLASSES.HEAD_CONTAINER} > .${ELEMENT_CLASSES.BUTTON_CONTAINER} > `
		+ `.${BUTTON_CLASS}.${actionId} > svg`,
	], ['fill', `var(${strokeVar})`]);
	
	addRule(
		`.${HIGHLIGHT_CLASS} > .${ELEMENT_CLASSES.HEAD_CONTAINER} > .${ELEMENT_CLASSES.BUTTON_CONTAINER} > `
		+ `.${BUTTON_CLASS}.${actionId}.${BUTTON_ACTIVE_CLASS} > svg > g`,
		['stroke', `var(${strokeVar})`],
	);
	
	addRule([
		`.${BUTTON_CLASS}.${actionId}.${BUTTON_ACTIVE_CLASS}:hover > svg > circle`,
		`.${BUTTON_CLASS}.${actionId}.${BUTTON_ACTIVE_CLASS}:focus > svg > circle`,
	], ['stroke', `var(${strokeVar})`]);
}

export default function generate() {
	generateCreate();
	generateMove();
	generateDisable();
	generateDuplicate();
	generatePosition();
	
	addRule(`.${BUTTON_CLASS}`, [
		['height', '100%'],
		['position', 'relative'],
	]);
	
	addRule(`.${BUTTON_CLASS} > svg`, [
		['height', '100%'],
		['transform', 'scale(1.05)'],
	]);
	
	addRule(`.${ELEMENT_CLASSES.BUTTON_CONTAINER}`, [
		['white-space', 'nowrap'],
		['z-index', '1'],
	]);
	
	// Hide prospective nodes
	addRule([
		`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}.${TEST_ADD_CLASS}`,
		`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}.${TEST_REMOVE_CLASS}`,
	], [['pointer-events', 'none']]);
	
	// Hide alt icon components
	addRule(`.${ALT_CLASS}:not(.${ALT_ID} *)`, ['display', 'none']);
	
	addRule(`.${ALT_ID} button.${ALT_CLASS} + *`, ['display', 'none']);
	
	addGroupChangeListener((group, addRule) => {
		const depthSelector = `.${GROUP_CLASS_PREFIX}${group} > .${ELEMENT_CLASSES.HEAD_CONTAINER} > .${ELEMENT_CLASSES.BUTTON_CONTAINER}`;
		
		addRule(
			`.${ELEMENT_CLASSES.ELEMENT_CONTAINER}.${HIGHLIGHT_CLASS}${depthSelector} > `
			+ `.${BUTTON_CLASS}:not(.${BUTTON_ACTIVE_CLASS}):not(:focus):not(:hover) > svg > g`,
			['stroke', `var(--nodeBase${group})`],
		);
		
		addRule(`${depthSelector} > .${BUTTON_CLASS}:not(.${BUTTON_ACTIVE_CLASS}:hover):not(.${BUTTON_ACTIVE_CLASS}:focus) > svg > circle`, ['stroke', `var(--nodeBase${group})`]);
		
		addRule([
			// Not active, focused
			`${depthSelector} > .${BUTTON_CLASS}:focus > svg > g`,
			`${depthSelector} > .${BUTTON_CLASS}:hover > svg > g`,
		], [['stroke', `var(--nodeContrast${group})`]]);
		
		addRule([`${depthSelector} > .${BUTTON_ACTIVE_CLASS} > svg`], [['stroke', `var(--nodeBase${group})`]]);
		
		addRule([
			// Not active, focused
			`${depthSelector} > .${BUTTON_CLASS}:focus > svg`,
			`${depthSelector} > .${BUTTON_CLASS}:hover > svg`,
			`.${HIGHLIGHT_CLASS}${depthSelector} > .${BUTTON_ACTIVE_CLASS} > svg`,
		], [['fill', `var(--nodeBase${group})`]]);
	});
}
