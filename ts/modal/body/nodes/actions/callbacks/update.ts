import hide from '../hide';

import type Child from '@nodes/child';
import type Middle from '@nodes/middle';
import type Root from '@nodes/root';

type Callback = (isOutdated: boolean) => void;

type Node = Middle | Root | Child;
type NodeMap = Map<Node, Callback>;
type NodeMaps = Record<'onUpdate' | 'onChildUpdate' | 'onDescendantUpdate', NodeMap>;

const maps: NodeMaps = {
	onUpdate: new Map(),
	onChildUpdate: new Map(),
	onDescendantUpdate: new Map(),
};

async function isOutdated(response: unknown, map: NodeMap, node: Node): Promise<boolean> {
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

export async function handle<Node extends Child | Root>(_response: unknown, property: keyof NodeMaps, node: Node) {
	if (await isOutdated(_response, maps[property], node)) {
		return;
	}
	
	const response = await _response;
	
	if (typeof response !== 'object') {
		return;
	}
	
	if ('hide' in response && typeof response.hide === 'object') {
		for (const [id, doHide] of Object.entries(response.hide)) {
			if (typeof doHide === 'boolean') {
				hide(node, id, doHide);
			}
		}
	}
}

function trigger(node: Node, property: keyof NodeMaps) {
	if (property in node) {
		handle(node[property](), property, node);
	}
}

export function triggerSub(ancestors: Array<Middle | Root>) {
	trigger(ancestors[0], 'onChildUpdate');
	
	for (const ancestor of ancestors) {
		trigger(ancestor, 'onDescendantUpdate');
	}
}

export function triggerAll(node: Child) {
	trigger(node, 'onUpdate');
	
	triggerSub(node.getAncestors());
}
