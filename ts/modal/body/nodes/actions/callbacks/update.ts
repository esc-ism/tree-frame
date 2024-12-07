import hide from '../hide';

import type Child from '@nodes/child';
import type Middle from '@nodes/middle';
import type Root from '@nodes/root';

const ongoingSelf: Map<object, Function> = new Map();
const ongoingChild: Map<object, Function> = new Map();
const ongoingDescendant: Map<object, Function> = new Map();

async function isOutdated(response: unknown, map: Map<object, Function>, key) {
	if (map.has(key)) {
		map.get(key)(false);
	}
	
	const callback = new Promise((resolve) => {
		map.set(key, resolve);
	});
	
	if (await Promise.any([
		callback,
		Promise.resolve(response)
			.then(() => true)
			.catch(() => true),
	])) {
		map.delete(key);
		
		return false;
	}
	
	return true;
}

async function handle(_response, map, node) {
	if (await isOutdated(_response, map, node)) {
		return;
	}
	
	const response = await _response;
	
	if (!(typeof response === 'object')) {
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
		handle(node.onUpdate(node.value), ongoingSelf, node);
	}
	
	triggerSub(node.getAncestors());
}
