import {CLASS_PREFIX_READ, CLASS_PREFIX_WRITE} from './consts';

import {get as getPools} from '@nodes/pools';

import type Child from '@nodes/child';
import type Root from '@nodes/root';

import {addRule} from '@/modal/css';

const ids: Array<boolean> = [];

function setWriteClass(node, id, doHide) {
	node.element[`${doHide ? 'add' : 'remove'}Class`](`${CLASS_PREFIX_WRITE}${id}`);
}

export default function hide(node: Child | Root, id: string, doHide = true) {
	if (!('parent' in node) || 'seed' in node.parent) {
		setWriteClass(node, id, doHide);
		
		return;
	}
	
	for (const parent of getPools(node.parent)) {
		hide(parent, id, doHide);
	}
}

export function mount(node: Child): void {
	node.element.addClass(`${CLASS_PREFIX_READ}${node.hideId}`);
	
	if (!ids[node.hideId]) {
		addRule(`.${CLASS_PREFIX_WRITE}${node.hideId} .${CLASS_PREFIX_READ}${node.hideId}`, ['display', 'none']);
		
		ids[node.hideId] = true;
	}
}

export function shouldMount(node: Child): boolean {
	return 'hideId' in node;
}
