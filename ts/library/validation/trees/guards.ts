import type {Child, Parent, Root} from '../types';
import {LEAF_KEYS, MIDDLE_KEYS, ROOT_KEYS, VALUE_TYPES, INPUT_FORMATS, SAVED_KEYS} from '../types';
import {TypeError, ValueError, PropertyError, UnexpectedStateError, JoinedError, DependenceError} from '../errors';
import {hasOwnProperty, validateUnexpectedKeys} from '../index';

function hasDependee<X extends {}, Y extends PropertyKey>(breadcrumbs: string[], candidate: unknown, property: Y, dependence: string): candidate is X & Record<Y, unknown> {
	if (!hasOwnProperty(candidate, property)) {
		return false;
	}
	
	if (hasOwnProperty(candidate, dependence))
		return true;
	
	throw new JoinedError(
		new DependenceError(property, dependence),
		new PropertyError([...breadcrumbs], dependence, true),
	);
}

// Type predicates

function isChild(breadcrumbs: string[], candidate: unknown, isUserTree: boolean = false): candidate is Child {
	if (typeof candidate !== 'object')
		throw new TypeError([...breadcrumbs], typeof candidate, ['object']);
	
	if (isUserTree) {
		validateUnexpectedKeys(breadcrumbs, candidate, SAVED_KEYS);
	} else {
		validateUnexpectedKeys(breadcrumbs, candidate, 'children' in candidate ? MIDDLE_KEYS : LEAF_KEYS);
	}
	
	if (hasOwnProperty(candidate, 'label') && typeof candidate.label !== 'string')
		throw new TypeError([...breadcrumbs, 'label'], typeof candidate.label, ['string']);
	
	if (hasOwnProperty(candidate, 'value') && !(VALUE_TYPES as readonly string[]).includes(typeof candidate.value))
		throw new TypeError([...breadcrumbs, 'value'], typeof candidate.value, VALUE_TYPES);
	
	if (hasDependee(breadcrumbs, candidate, 'options', 'value')) {
		if (!Array.isArray(candidate.options))
			throw new TypeError([...breadcrumbs, 'options'], typeof candidate.options, ['array']);
		
		for (const [i, option] of candidate.options.entries()) {
			if (!(VALUE_TYPES as readonly string[]).includes(typeof option))
				throw new TypeError([...breadcrumbs, 'options', i.toString()], typeof option, VALUE_TYPES);
		}
	}
	
	if (hasDependee(breadcrumbs, candidate, 'predicate', 'value') && typeof candidate.predicate !== 'function')
		throw new TypeError([...breadcrumbs, 'predicate'], typeof candidate.predicate, ['function']);
	
	if (hasDependee(breadcrumbs, candidate, 'onUpdate', 'value') && typeof candidate.onUpdate !== 'function')
		throw new TypeError([...breadcrumbs, 'onUpdate'], typeof candidate.onUpdate, ['function']);
	
	if (hasDependee(breadcrumbs, candidate, 'listeners', 'value')) {
		if (typeof candidate.listeners !== 'object')
			throw new TypeError([...breadcrumbs, 'listeners'], typeof candidate.listeners, ['object']);
		
		for (const [event, callback] of Object.entries(candidate.listeners)) {
			if (typeof callback !== 'function')
				throw new TypeError([...breadcrumbs, 'listeners', event], typeof callback, ['function']);
		}
	}
	
	if (hasDependee(breadcrumbs, candidate, 'input', 'value')) {
		if (typeof candidate.input !== 'string')
			throw new TypeError([...breadcrumbs, 'input'], typeof candidate.input, ['string']);
		
		if (!(INPUT_FORMATS as readonly string[]).includes(candidate.input))
			throw new ValueError([...breadcrumbs, 'input'], candidate.input, INPUT_FORMATS);
	}
	
	if (hasDependee(breadcrumbs, candidate, 'inputAttributes', 'value') && typeof candidate.inputAttributes !== 'object')
		throw new TypeError([...breadcrumbs, 'inputAttributes'], typeof candidate.inputAttributes, ['object']);
	
	if (hasOwnProperty(candidate, 'get') && typeof candidate.get !== 'function')
		throw new TypeError([...breadcrumbs, 'get'], typeof candidate.get, ['function']);
	
	if (hasOwnProperty(candidate, 'hideId') && typeof candidate.hideId !== 'string')
		throw new TypeError([...breadcrumbs, 'hideId'], typeof candidate.hideId, ['string']);
	
	if (hasOwnProperty(candidate, 'isActive') && typeof candidate.isActive !== 'boolean')
		throw new TypeError([...breadcrumbs, 'isActive'], typeof candidate.isActive, ['boolean']);
	
	if (hasOwnProperty(candidate, 'children') && !isParent(breadcrumbs, candidate, isUserTree))
		throw new UnexpectedStateError();
	
	return true;
}

export function isParent(breadcrumbs: string[], candidate: object, isUserTree: boolean = false): candidate is Parent {
	if (!hasOwnProperty(candidate, 'children'))
		throw new PropertyError(breadcrumbs, 'children', true);
	
	if (!Array.isArray(candidate.children))
		throw new TypeError([...breadcrumbs, 'children'], typeof candidate.children, ['array']);
	
	if (hasOwnProperty(candidate, 'seed') && !isChild([...breadcrumbs, 'seed'], candidate.seed))
		throw new UnexpectedStateError();
	
	if (hasOwnProperty(candidate, 'poolId') && typeof candidate.poolId !== 'number')
		throw new TypeError([...breadcrumbs, 'poolId'], typeof candidate.poolId, ['number']);
	
	if (hasOwnProperty(candidate, 'childPredicate') && typeof candidate.childPredicate !== 'function')
		throw new TypeError([...breadcrumbs, 'childPredicate'], typeof candidate.childPredicate, ['function']);
	
	if (hasOwnProperty(candidate, 'descendantPredicate') && typeof candidate.descendantPredicate !== 'function')
		throw new TypeError([...breadcrumbs, 'descendantPredicate'], typeof candidate.descendantPredicate, ['function']);
	
	if (hasOwnProperty(candidate, 'onChildUpdate') && typeof candidate.onChildUpdate !== 'function')
		throw new TypeError([...breadcrumbs, 'onChildUpdate'], typeof candidate.onChildUpdate, ['function']);
	
	if (hasOwnProperty(candidate, 'onDescendantUpdate') && typeof candidate.onDescendantUpdate !== 'function')
		throw new TypeError([...breadcrumbs, 'onDescendantUpdate'], typeof candidate.onDescendantUpdate, ['function']);
	
	for (const [i, child] of candidate.children.entries()) {
		if (!isChild([...breadcrumbs, 'children', i.toString()], child, isUserTree))
			throw new UnexpectedStateError();
	}
	
	return true;
}

export function isRoot(breadcrumbs: string[], candidate: unknown, isUserTree: boolean = false): candidate is Root {
	if (typeof candidate !== 'object')
		throw new TypeError(breadcrumbs, typeof candidate, ['object']);
	
	if (!isParent(breadcrumbs, candidate, isUserTree))
		throw new UnexpectedStateError();
	
	validateUnexpectedKeys(breadcrumbs, candidate, ROOT_KEYS);
	
	return true;
}
