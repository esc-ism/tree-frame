import {ACTION_ID} from './consts';
import {ACTION_ID as STYLE_ACTION_ID} from '../style/consts';

import {addColourRule} from '../css';

import {addRule, addVariables} from '@/modal/css';

import {ROOT_ID as DATA_ID} from '@/modal/body/data/consts';
import {ROOT_ID as STYLE_ID} from '@/modal/body/style/consts';
import {MODAL_BODY_ID} from '@/modal/body/consts';

import {ELEMENT_CLASSES, MIDDLE_CLASS, ROOT_CLASS} from '@nodes/consts';
import {FOCUS_SOURCE_CLASS, FOCUS_CLASS} from '@nodes/actions/focus/consts';

import type {Root as _ROOT, Middle as _MIDDLE, Leaf as _LEAF} from '@types';

// todo isn't considering things being moved via poolId
function getHeight(node: _ROOT | _MIDDLE | _LEAF): number {
	if ('seed' in node) {
		return getHeight(node.seed) + 1;
	}
	
	if ('children' in node) {
		return node.children.reduce((height, child) => Math.max(getHeight(child), height), 0) + 1;
	}
	
	return 0;
}

export default function generate(roots) {
	const heights = {
		[DATA_ID]: getHeight(roots[DATA_ID]),
		[STYLE_ID]: getHeight(roots[STYLE_ID]),
	};
	
	const maxHeight = Math.max(heights[DATA_ID], heights[STYLE_ID]);
	
	addVariables([['--overlayIndex', `${maxHeight + 1}`]]);
	
	addColourRule(ACTION_ID, '--headButtonSticky');
	
	let nodeSelector = `#${MODAL_BODY_ID}.${ACTION_ID} > .${ELEMENT_CLASSES.ELEMENT_CONTAINER}`;
	
	for (let depth = 0; depth <= maxHeight; ++depth) {
		addRule(`${nodeSelector} > .${ELEMENT_CLASSES.HEAD_CONTAINER}`, [
			['position', 'sticky'],
			['top', `calc(${depth * 1.6}em + ${depth * 0.6}px)`],
			['z-index', `${maxHeight - depth}`],
		]);
		
		nodeSelector += ` > .${ELEMENT_CLASSES.CHILD_CONTAINER} > .${ELEMENT_CLASSES.ELEMENT_CONTAINER}`;
	}
	
	addRule(`#${MODAL_BODY_ID}.${ACTION_ID}::after`, [
		['content', '\'\''],
		['display', 'block'],
		['visibility', 'hidden'],
	]);
	
	const selectors = {
		basic: {
			[DATA_ID]: `#${MODAL_BODY_ID}.${ACTION_ID}:has(> #${DATA_ID}:not(.${FOCUS_CLASS}) > .${ELEMENT_CLASSES.CHILD_CONTAINER}`,
			[STYLE_ID]: `#${MODAL_BODY_ID}.${ACTION_ID}.${STYLE_ACTION_ID}:has(> #${STYLE_ID}:not(.${FOCUS_CLASS}) > .${ELEMENT_CLASSES.CHILD_CONTAINER}`,
		},
		focus: {
			[DATA_ID]: `#${MODAL_BODY_ID}.${ACTION_ID}:has(> #${DATA_ID}.${FOCUS_CLASS}`,
			[STYLE_ID]: `#${MODAL_BODY_ID}.${ACTION_ID}.${STYLE_ACTION_ID}:has(> #${STYLE_ID}.${FOCUS_CLASS}`,
		},
	};
	
	for (const [id, height] of Object.entries(heights)) {
		for (let depth = 1; depth <= height + 1; ++depth) {
			addRule(`${selectors.basic[id]}:empty)::after`, ['height', `calc(100% - ${(depth - 1) * 0.6}px - ${depth * 1.6}em + 1px)`]);
			addRule(`${selectors.focus[id]}.${FOCUS_SOURCE_CLASS})::after`, ['height', `calc(100% - ${depth * 0.6}px - ${(depth + 1) * 1.6}em + 1px)`]);
			
			selectors.basic[id] += ` > :last-child > .${ELEMENT_CLASSES.CHILD_CONTAINER}`;
			selectors.focus[id] += ` > .${ELEMENT_CLASSES.CHILD_CONTAINER} > *`;
		}
	}
}
