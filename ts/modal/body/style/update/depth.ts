import {ROOTS} from '../../index';

import type {Selectors, Styles} from '@/modal/css';
import {addRule as _addRule, registerStyleNode} from '@/modal/css';

const styleNode = document.createElement('style');

registerStyleNode(styleNode);

const callbacks = [];

let currentClassCount;

export function getDepthClassCount() {
	return currentClassCount;
}

function addDepthRule(selectors: Selectors, styles: Styles) {
	_addRule(selectors, styles, styleNode.sheet);
}

export function addDepthChangeListener(callback: (depth: number, adder: (Selectors, Styles) => void) => void) {
	callbacks.push((depth) => callback(depth, addDepthRule));
	
	for (let i = 0; i < currentClassCount; ++i) {
		callback(i, addDepthRule);
	}
}

export function updateDepth(depth: number) {
	for (let i = styleNode.sheet.cssRules.length - 1; i >= 0; --i) {
		styleNode.sheet.deleteRule(i);
	}
	
	for (const root of Object.values(ROOTS)) {
		root.updateDepthClass(depth);
	}
	
	for (let i = 0; i < depth; ++i) {
		for (const callback of callbacks) {
			callback(i, addDepthRule);
		}
	}
	
	currentClassCount = depth;
}
