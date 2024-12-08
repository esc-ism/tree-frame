import hide from '../hide';

import type Child from '@nodes/child';
import type Middle from '@nodes/middle';
import type Root from '@nodes/root';

type Callback = (isOutdated: boolean) => void;

const ongoingSelf: Map<Child, Callback> = new Map();
const ongoingChild: Map<Middle | Root, Callback> = new Map();
const ongoingDescendant: Map<Middle | Root, Callback> = new Map();

async function isOutdated<Node extends Child | Root>(response: unknown, map: Map<Node, Callback>, node: Node): Promise<boolean> {
	if (map.has(node)) {
		map.get(node)(false);
	}
	
	const callback = new Promise((resolve) => {
		map.set(node, resolve);
	});
	
	if (await Promise.any([
		callback,
		Promise.resolve(response)
			.then(() => true)
			.catch(() => true),
	])) {
		map.delete(node);
		
		return false;
	}
	
	return true;
}

async function handle<Node extends Child | Root>(_response: unknown, map: Map<Node, Callback>, node: Node) {
	if (await isOutdated(_response, map, node)) {
		return;
	}
	
	const response = await _response;
	
	if (typeof response !== 'object') {
		return;
	}
	
	if ('hide' in response && typeof response.hide === 'object') {
		for (const [id, doHide] of Object.entries(response.hide)) {
			if (typeof id === 'string' && typeof doHide === 'boolean') {
				hide(node, id, doHide);
			}
		}
	}
}

export function triggerSub(ancestors: (Middle | Root)[]) {
	if ('onChildUpdate' in ancestors[0]) {
		handle(ancestors[0].onChildUpdate(), ongoingChild, ancestors[0]);
	}
	
	for (const ancestor of ancestors) {
		if ('onDescendantUpdate' in ancestor) {
			handle(ancestor.onDescendantUpdate(), ongoingDescendant, ancestor);
		}
	}
}

export function triggerAll(node: Child) {
	if ('onUpdate' in node) {
		handle(node.onUpdate(), ongoingSelf, node);
	}
	
	triggerSub(node.getAncestors());
}
