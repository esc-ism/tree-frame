import type {Child, Parent} from '../types';
import {
	TypeError, ValueError, PropertyError,
	JoinedError, EmptyArrayError, NoOptionsError, NonIntegerError,
	MismatchedOptionsError, PredicateError, HangingPredicateError,
} from '../errors';

import {getPredicatePromise} from '../../../predicate';

async function getBoundPredicatePromise(response, error: Error) {
	try {
		await getPredicatePromise(response);
	} catch (_) {
		throw error;
	}
}

function validateChild(breadcrumbs: Array<string>, child: Child): Promise<void> {
	if (!('predicate' in child)) {
		return Promise.resolve();
	}
	
	if (!('value' in child)) {
		throw new JoinedError(
			new HangingPredicateError(),
			new PropertyError(breadcrumbs, 'value', true),
		);
	}
	
	if (typeof child.predicate === 'function')
		return getBoundPredicatePromise(child.predicate(child.value), new PredicateError([...breadcrumbs, 'predicate']));
	
	if (child.predicate.length === 0)
		throw new JoinedError(
			new NoOptionsError(),
			new EmptyArrayError([...breadcrumbs, 'predicate']),
		);
	
	const functions = [];
	let type;
	let valueFound = false;
	
	for (const [i, option] of child.predicate.entries()) {
		switch (typeof option) {
			case 'function':
				functions.push(i);
				
				break;
			case type:
				valueFound ||= child.value === option;
				
				break;
			default:
				if (type !== undefined)
					throw new JoinedError(
						new MismatchedOptionsError(),
						new TypeError([...breadcrumbs, 'predicate', i.toString()], typeof option, [type]),
					);
				
				type = typeof option;
				
				valueFound = child.value === option;
		}
	}
	
	if (valueFound)
		return Promise.resolve();
	
	if (functions.length === 0)
		throw new JoinedError(
			new PredicateError([...breadcrumbs, 'predicate']),
			new ValueError([...breadcrumbs, 'value'], child.value, child.predicate),
		);
	
	return Promise.any(functions.map((i) => getBoundPredicatePromise(child.predicate[i](child.value), new PredicateError([...breadcrumbs, 'predicate', i.toString()]))))
		.catch(([error]) => error);
}

export function validateParent(breadcrumbs: string[], parent: Parent) {
	const promises: Array<Promise<unknown>> = [];
	
	if ('seed' in parent) {
		const {seed} = parent;
		
		promises.push(validateChild([...breadcrumbs, 'seed'], seed));
		
		if ('children' in seed) {
			promises.push(...validateParent([...breadcrumbs, 'seed'], seed));
		}
	}
	
	const {children} = parent;
	
	if ('poolId' in parent && Math.floor(parent.poolId) !== parent.poolId)
		throw new NonIntegerError([...breadcrumbs, 'poolId']);
	
	if ('childPredicate' in parent) {
		promises.push(getBoundPredicatePromise(
			parent.childPredicate(children),
			new PredicateError([...breadcrumbs, 'childPredicate']),
		));
	}
	
	if ('descendantPredicate' in parent) {
		promises.push(getBoundPredicatePromise(
			parent.descendantPredicate(children),
			new PredicateError([...breadcrumbs, 'descendantPredicate']),
		));
	}
	
	for (const [i, child] of children.entries()) {
		const childBreadcrumbs = [...breadcrumbs, 'children', i.toString()];
		
		promises.push(validateChild(childBreadcrumbs, child));
		
		if ('children' in child) {
			promises.push(...validateParent(childBreadcrumbs, child));
		}
	}
	
	return promises;
}
