import {ACTION_ID} from './consts';

import {addColourRule} from '../css';

import {addRule} from '@/modal/css';

import {MODAL_BODY_ID} from '@/modal/body/consts';

import {ELEMENT_CLASSES, MIDDLE_CLASS, DEPTH_CLASS_PREFIX} from '@nodes/consts';

export default function generate(maxHeight) {
	addColourRule(ACTION_ID, '--headButtonSticky');
	
	for (let depth = 1; depth < maxHeight; ++depth) {
		const offset = depth - 1;
		
		addRule(`#${MODAL_BODY_ID}.${ACTION_ID} .${MIDDLE_CLASS}.${DEPTH_CLASS_PREFIX}${depth} > .${ELEMENT_CLASSES.HEAD_CONTAINER}`, [
			['position', 'sticky'],
			['top', `calc(${offset * 1.6}em + ${offset * 0.6}px)`],
			['z-index', `${(maxHeight - depth) + 3}`],
		]);
	}
}
