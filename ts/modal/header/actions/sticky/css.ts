import {ACTION_ID} from './consts';

import {addColourRule} from '../css';

import {addRule, registerStyleNode} from '@/modal/css';

import {ROOTS, element as container} from '@/modal/body';
import {MODAL_BODY_ID} from '@/modal/body/consts';

import {ELEMENT_CLASSES, MIDDLE_CLASS, DEPTH_CLASS_PREFIX} from '@nodes/consts';

import {onceVisualsUpdate} from '@nodes/queue';

const styleNode = document.createElement('style');

registerStyleNode(styleNode);

export default function generate() {
	const maxHeight = Math.max(...Object.values(ROOTS).map(({height}) => height));
	
	addColourRule(ACTION_ID, '--headButtonSticky');
	
	for (let depth = 1; depth < maxHeight; ++depth) {
		const offset = depth - 1;
		
		addRule(`#${MODAL_BODY_ID}.${ACTION_ID} .${MIDDLE_CLASS}.${DEPTH_CLASS_PREFIX}${depth} > .${ELEMENT_CLASSES.HEAD_CONTAINER}`, [
			['position', 'sticky'],
			['top', `calc(${offset * 1.6}em + ${offset * 0.6}px)`],
			['z-index', `${(maxHeight - depth) + 3}`],
		]);
	}
	
	function onResize() {
		for (let i = styleNode.sheet.cssRules.length - 1; i >= 0; --i) {
			styleNode.sheet.deleteRule(i);
		}
		
		for (const [id, root] of Object.entries(ROOTS)) {
			let branchSelector = `#${MODAL_BODY_ID}.${ACTION_ID} > #${id} > .${ELEMENT_CLASSES.CHILD_CONTAINER}`;
			
			for (let depth = 0; depth <= root.height; ++depth) {
				addRule(`${branchSelector}:empty`, ['height', `calc(${container.clientHeight}px - ${depth * 1.6}em)`], styleNode);
				
				branchSelector += ` > :last-child > .${ELEMENT_CLASSES.CHILD_CONTAINER}`;
			}
		}
	}
	
	onceVisualsUpdate(onResize);
	
	window.addEventListener('resize', onResize);
}
