import type {Child, Parent, Root} from '../types';
import {
    LEAF_KEYS, MIDDLE_KEYS, ROOT_KEYS,
    VALUE_TYPES, INPUT_FORMATS, PREDICATE_TYPES,
} from '../types';
import {TypeError, ValueError, PropertyError, UnexpectedStateError} from '../errors';
import {hasOwnProperty, validateUnexpectedKeys} from '../index';

// Type predicates

export function isParent(breadcrumbs: string[], candidate: object): candidate is Parent {
    if (!hasOwnProperty(candidate, 'children'))
        throw new PropertyError(breadcrumbs, 'children', true);

    if (!Array.isArray(candidate.children))
        throw new TypeError([...breadcrumbs, 'children'], typeof candidate.children, ['array']);

    if (hasOwnProperty(candidate, 'seed') && !isChild([...breadcrumbs, 'seed'], candidate.seed))
        throw new UnexpectedStateError();

    if (hasOwnProperty(candidate, 'childPredicate')) {
        switch (typeof candidate.childPredicate) {
            case 'number':
            case 'function':
                break;

            default:
                throw new TypeError([...breadcrumbs, 'childPredicate'], typeof candidate.childPredicate, ['function']);
        }
    }

    if (hasOwnProperty(candidate, 'descendantPredicate')) {
        switch (typeof candidate.descendantPredicate) {
            case 'number':
            case 'function':
                break;

            default:
                throw new TypeError([...breadcrumbs, 'descendantPredicate'], typeof candidate.descendantPredicate, ['function']);
        }
    }

    if (hasOwnProperty(candidate, 'poolId') && typeof candidate.poolId !== 'number')
        throw new TypeError([...breadcrumbs, 'poolId'], typeof candidate.poolId, ['number']);

    for (const [i, child] of candidate.children.entries()) {
        if (!isChild([...breadcrumbs, 'children', i.toString()], child))
            throw new UnexpectedStateError();
    }

    return true;
}

function isChild(breadcrumbs: string[], candidate: unknown): candidate is Child {
    if (typeof candidate !== 'object')
        throw new TypeError([...breadcrumbs], typeof candidate, ['object']);

    if (hasOwnProperty(candidate, 'label') && typeof candidate.label !== 'string')
        throw new TypeError([...breadcrumbs, 'label'], typeof candidate.label, ['string']);

    if (hasOwnProperty(candidate, 'value') && !(VALUE_TYPES as readonly string[]).includes(typeof candidate.value))
        throw new TypeError([...breadcrumbs, 'value'], typeof candidate.value, VALUE_TYPES);

    if (hasOwnProperty(candidate, 'predicate')) {
        switch (typeof candidate.predicate) {
            case 'function':
            case 'number':
                break;

            default:
                if (!Array.isArray(candidate.predicate))
                    throw new TypeError([...breadcrumbs, 'predicate'], typeof candidate.predicate, PREDICATE_TYPES);

                for (const [i, option] of candidate.predicate.entries()) {
                    if (!(VALUE_TYPES as readonly string[]).includes(typeof option))
                        throw new TypeError([...breadcrumbs, 'predicate', i.toString()], typeof option, VALUE_TYPES);
                }
        }
    }

    if (hasOwnProperty(candidate, 'input')) {
        if (typeof candidate.input !== 'string')
            throw new TypeError([...breadcrumbs, 'input'], typeof candidate.input, ['string']);

        if (!(INPUT_FORMATS as readonly string[]).includes(candidate.input))
            throw new ValueError([...breadcrumbs, 'input'], candidate.input, INPUT_FORMATS);
    }

    if (hasOwnProperty(candidate, 'isActive') && typeof candidate.isActive !== 'boolean')
        throw new TypeError([...breadcrumbs, 'isActive'], typeof candidate.isActive, ['boolean']);

    if (hasOwnProperty(candidate, 'children')) {
        if (!isParent(breadcrumbs, candidate))
            throw new UnexpectedStateError();

        validateUnexpectedKeys(breadcrumbs, candidate, MIDDLE_KEYS);
    } else {
        validateUnexpectedKeys(breadcrumbs, candidate, LEAF_KEYS);
    }

    return true;
}

export function isRoot(breadcrumbs: string[], candidate: unknown): candidate is Root {
    if (typeof candidate !== 'object')
        throw new TypeError(breadcrumbs, typeof candidate, ['object']);

    if (!isParent(breadcrumbs, candidate))
        throw new UnexpectedStateError();

    validateUnexpectedKeys(breadcrumbs, candidate, ROOT_KEYS);

    return true;
}
