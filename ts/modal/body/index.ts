import {MODAL_BODY_ID} from './consts';
import generateCSS from './css';

import generateStyleTree from './style';
import generateDataTree, {setTree} from './data';

import {onMount as onMountHighlight} from './nodes/actions/highlight';
import {onMount as onMountActive} from './nodes/actions/active';

import Root from './nodes/root';

import {BUTTON_ACTIVE_CLASS} from '../consts';

import generateStickyCSS from '@/modal/header/actions/sticky/css';
import {generateHiddenCSS} from './nodes/css';

import type {Page, Root as _Root} from '@types';

interface RootRecord {
	[id: string]: Root;
}

export const ROOTS: RootRecord = {};

export const element = document.createElement('div');

let resetTree: _Root;

export function setActive(button, actionId, doActivate = true) {
	if (doActivate) {
		button.classList.add(BUTTON_ACTIVE_CLASS);
		
		element.classList.add(actionId);
	} else {
		button.classList.remove(BUTTON_ACTIVE_CLASS);
		
		element.classList.remove(actionId);
	}
}

export function generateTree(data: _Root, id: string): HTMLElement {
	if (ROOTS[id]) {
		throw new Error(`Attempted to instantiate second tree with id '${id}'.`);
	}
	
	const root = new Root(data);
	
	root.element.elementContainer.id = id;
	
	ROOTS[id] = root;
	
	return root.element.elementContainer;
}

export default function generate({userTree, defaultTree, userStyles, defaultStyle}: Page): HTMLElement {
	resetTree = defaultTree;
	
	generateCSS();
	
	element.id = MODAL_BODY_ID;
	
	// avoid blurring an input when dragging the scrollbar
	element.addEventListener('mousedown', (event) => {
		event.stopPropagation();
		event.preventDefault();
	});
	
	element.append(
		generateStyleTree(userStyles, defaultStyle),
		generateDataTree(userTree ?? defaultTree),
	);
	
	onMountHighlight();
	onMountActive();
	
	generateStickyCSS(ROOTS);
	generateHiddenCSS(ROOTS);
	
	return element;
}

export function reset() {
	setTree(resetTree);
}
