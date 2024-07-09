import type {Child, Parent} from '../types';
import {
	TypeError, PropertyError,
	JoinedError, NonIntegerError,
	OptionMatchError, PredicateError, HangingPredicateError, HangingOptionsError,
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
	if (!('value' in child)) {
		if ('predicate' in child)
			throw new JoinedError(
				new HangingPredicateError(),
				new PropertyError(breadcrumbs, 'value', true),
			);
		
		if ('options' in child)
			throw new JoinedError(
				new HangingOptionsError(),
				new PropertyError(breadcrumbs, 'value', true),
			);
		
		return Promise.resolve();
	}
	
	if ('options' in child) {
		const type = typeof child.value;
		let valueFound = false;
		
		for (const [i, option] of child.options.entries()) {
			if (typeof option !== type) {
				throw new JoinedError(
					new OptionMatchError(),
					new TypeError([...breadcrumbs, 'options', i.toString()], typeof option, [type]),
				);
			}
			
			valueFound ||= child.value === option;
		}
		
		if (valueFound)
			return Promise.resolve();
	}
	
	return getBoundPredicatePromise(child.predicate(child.value), new PredicateError([...breadcrumbs, 'predicate']));
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
