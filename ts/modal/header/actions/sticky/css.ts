import {ACTION_ID} from './consts';

import {addColourRule} from '../css';

import {addRule} from '@/modal/css';

import {ROOTS} from '@/modal/body';
import {MODAL_BODY_ID} from '@/modal/body/consts';

import {ELEMENT_CLASSES, MIDDLE_CLASS, ROOT_CLASS, DEPTH_CLASS_PREFIX} from '@nodes/consts';

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
	
	for (const [id, root] of Object.entries(ROOTS)) {
		let branchSelector = `#${MODAL_BODY_ID}.${ACTION_ID}:has(> #${id} > .${ELEMENT_CLASSES.CHILD_CONTAINER}`;
		
		for (let depth = 1; depth <= root.height + 1; ++depth) {
			addRule(`${branchSelector}:empty)::after`, [
				['content', '\'\''],
				['display', 'block'],
				['visibility', 'hidden'],
				['height', `calc(100% - ${depth * 0.6}px - ${depth * 1.6}em)`],
			]);
			
			branchSelector += ` > :last-child > .${ELEMENT_CLASSES.CHILD_CONTAINER}`;
		}
	}
}
