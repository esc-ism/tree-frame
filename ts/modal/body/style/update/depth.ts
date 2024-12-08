import {ROOTS} from '../../index';

import type {Selectors, Styles} from '@/modal/css';
import {addRule, registerStyleNode} from '@/modal/css';

const styleNode = document.createElement('style');

registerStyleNode(styleNode);

const callbacks = [];

let currentGroupCount = 1;

export function getGroupCount() {
	return currentGroupCount;
}

function addDepthRule(selectors: Selectors, styles: Styles) {
	addRule(selectors, styles, styleNode);
}

export function addGroupChangeListener(callback: (group: number, adder: (Selectors, Styles) => void) => void) {
	callbacks.push((group) => callback(group, addDepthRule));
	
	for (let i = 0; i < currentGroupCount; ++i) {
		callback(i, addDepthRule);
	}
}

export function updateDepth(groupCount: number) {
	if (currentGroupCount === groupCount) {
		return;
	}
	
	currentGroupCount = groupCount;
	
	for (let i = styleNode.sheet.cssRules.length - 1; i >= 0; --i) {
		styleNode.sheet.deleteRule(i);
	}
	
	for (const root of Object.values(ROOTS)) {
		root.updateGroup();
	}
	
	for (let i = 0; i < groupCount; ++i) {
		for (const callback of callbacks) {
			callback(i);
		}
	}
}
