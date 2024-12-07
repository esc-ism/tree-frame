import {CLASS_PREFIX_READ, CLASS_PREFIX_WRITE} from './consts';

import type Child from '@nodes/child';
import type Middle from '@nodes/middle';
import type Root from '@nodes/root';

import {ROOT_CLASS} from '@nodes/consts';

import {addRule} from '@/modal/css';

const ids = new Set();

export default function hide(node, id, doHide = true) {
	node.getRoot().element[`${doHide ? 'add' : 'remove'}Class`](`${CLASS_PREFIX_WRITE}${id}`);
}

export function mount(node: Child): void {
	node.element.addClass(`${CLASS_PREFIX_READ}${node.hideId}`);
	
	if (!ids.has(node.hideId)) {
		addRule(`.${ROOT_CLASS}.${CLASS_PREFIX_WRITE}${node.hideId} .${CLASS_PREFIX_READ}${node.hideId}`, ['display', 'none']);
	}
}

export function shouldMount(node: Child): boolean {
	return 'hideId' in node;
}
