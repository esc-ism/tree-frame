import type Child from '@nodes/child';
import type Middle from '@nodes/middle';
import type Root from '@nodes/root';

import {getPredicatePromise as get} from '@/predicate';

let ongoing: (value: boolean) => void;

async function handle(promises: Array<Promise<unknown>>): Promise<boolean | Array<unknown>> {
	ongoing?.(true);
	
	const callback = new Promise((resolve) => {
		ongoing = resolve;
	});
	
	const response = Promise.all(promises);
	
	if (await Promise.any([
		callback,
		// result of Promise.prototype.finally() gets ignored unless it's a rejection sigh
		response
			.then(() => false)
			.catch(() => false),
	])) {
		return false;
	}
	
	return await response;
}

export function getSub(ancestors: (Middle | Root)[]): Array<Promise<unknown>> {
	const responses = [];
	
	if ('childPredicate' in ancestors[0]) {
		responses.push(get(ancestors[0].childPredicate()));
	}
	
	for (const ancestor of ancestors) {
		if ('descendantPredicate' in ancestor) {
			responses.push(get(ancestor.descendantPredicate()));
		}
	}
	
	return responses;
}

export function getAll(node: Child): Promise<boolean | Array<unknown>> {
	if (node.forceValid || ('options' in node && node.options.includes(node.value))) {
		return handle(getSub(node.getAncestors()));
	}
	
	if ('predicate' in node) {
		return handle([get(node.predicate()), ...getSub(node.getAncestors())]);
	}
	
	throw undefined;
}
