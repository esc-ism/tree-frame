import {MODAL_BODY_ID} from './consts';
import generateTrees from './trees';
import generateCSS from './css';

import {getActiveStyle} from './trees/style';
import {setTree} from './trees/data';

import updateStylesheet from './trees/style/update';

import {generateEave, onMount as onMountHighlight} from '@nodes/actions/highlight';
import {onMount as onMountActive} from '@nodes/actions/active';

import type {Config, Root} from '@types';

let resetTree: Root;

export default function generate({userTree, defaultTree, userStyles, defaultStyle}: Config): HTMLElement {
	resetTree = defaultTree;
	
	updateStylesheet(getActiveStyle(userStyles, defaultStyle));
	
	generateCSS();
	
	const element = document.createElement('div');
	
	element.id = MODAL_BODY_ID;
	
	element.append(
		generateTrees(userTree ?? defaultTree, userStyles, defaultStyle),
		generateEave(),
	);
	
	onMountHighlight();
	onMountActive();
	
	return element;
}

export function reset() {
	setTree(resetTree);
}
