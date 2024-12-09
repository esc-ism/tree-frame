import {ACTION_ID} from './consts';
import {ACTION_ID as STYLE_ACTION_ID} from '../style/consts';

import {addColourRule} from '../css';

import {addRule} from '@/modal/css';

import {ROOT_ID as DATA_ID} from '@/modal/body/data/consts';
import {ROOT_ID as STYLE_ID} from '@/modal/body/style/consts';
import {ROOTS} from '@/modal/body';
import {MODAL_BODY_ID} from '@/modal/body/consts';

import {ELEMENT_CLASSES, MIDDLE_CLASS, ROOT_CLASS, DEPTH_CLASS_PREFIX} from '@nodes/consts';
import {FOCUS_SOURCE_CLASS, FOCUS_CLASS} from '@nodes/actions/focus/consts';

export default function generate() {
	const maxHeight = Math.max(...Object.values(ROOTS).map(({height}) => height));
	
	addColourRule(ACTION_ID, '--headButtonSticky');
	
	for (let depth = 0; depth < maxHeight; ++depth) {
		addRule(`#${MODAL_BODY_ID}.${ACTION_ID} .${DEPTH_CLASS_PREFIX}${depth}:where(.${MIDDLE_CLASS}, .${ROOT_CLASS}) > .${ELEMENT_CLASSES.HEAD_CONTAINER}`, [
			['position', 'sticky'],
			['top', `calc(${depth * 1.6}em + ${depth * 0.6}px)`],
			['z-index', `${(maxHeight - depth) + 3}`],
		]);
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
	
	for (const [id, root] of Object.entries(ROOTS)) {
		for (let depth = 1; depth <= root.height + 1; ++depth) {
			// -1px is for this bizarre 1px scroll up that happens sometimes when mousing over a node at max scrollTop
			addRule(`${selectors.basic[id]}:empty)::after`, ['height', `calc(100% - ${depth * 0.6 - 1}px - ${depth * 1.6}em)`]);
			addRule(`${selectors.focus[id]}.${FOCUS_SOURCE_CLASS})::after`, ['height', `calc(100% - ${(depth + 1) * 0.6 - 1}px - ${(depth + 1) * 1.6}em)`]);
			
			selectors.basic[id] += ` > :last-child > .${ELEMENT_CLASSES.CHILD_CONTAINER}`;
			selectors.focus[id] += ` > .${ELEMENT_CLASSES.CHILD_CONTAINER} > *`;
		}
	}
}
