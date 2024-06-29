import {ROOT_ID} from './consts';

import {generateTree, ROOTS} from '../index';

import {Root as RootJSON} from '@types';

export function getRoot() {
	return ROOTS[ROOT_ID];
}

export function setTree(data: RootJSON) {
	const root = getRoot();
	
	// Spread is necessary to avoid a shrinking iterable
	for (const child of [...root.children]) {
		child.disconnect();
	}
	
	root.addChildren(data.children);
}

export default function generate(data: RootJSON): HTMLElement {
	return generateTree(data, ROOT_ID);
}
