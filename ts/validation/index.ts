import type {Config} from './types';
import {CONFIG_KEYS} from './types';
import {TypeError, PropertyError, EmptyStringError, UnexpectedStateError} from './errors';

import {isStyles} from './styles';
import {validatePools} from './trees/pools';
import {isRoot} from './trees/guards';
import {validateParentMatch, validateSeeds, validatePoolSizeMatch} from './trees/match';
import {validateParent as validatePredicates} from './trees/predicates';

// Helpers

// Credit to https://fettblog.eu/typescript-hasownproperty/
export function hasOwnProperty<X extends {}, Y extends PropertyKey>(object: X, property: Y): object is X & Record<Y, unknown> {
    return object.hasOwnProperty(property);
}

export function validateUnexpectedKeys(breadcrumbs: string[], object: object, expected: readonly string[]) {
    for (const key of Object.keys(object)) {
        if (!expected.includes(key))
            throw new PropertyError(breadcrumbs, key, false);
    }
}

// Guard

function isConfig(candidate: unknown): candidate is Config {
    if (typeof candidate !== 'object')
        throw new TypeError([], typeof candidate, ['object']);

    validateUnexpectedKeys([], candidate, CONFIG_KEYS);

    // title

    if (!hasOwnProperty(candidate, 'title'))
        throw new PropertyError([], 'title', true);

    if (typeof candidate.title !== 'string')
        throw new TypeError(['title'], typeof candidate.title, ['string']);

    // defaultStyle

    if (hasOwnProperty(candidate, 'defaultStyle')) {
        if (!isStyles(['defaultStyle'], candidate.defaultStyle))
            throw new UnexpectedStateError();

        if (hasOwnProperty(candidate.defaultStyle, 'name'))
            throw new PropertyError(['defaultStyle'], 'name', false);

        if (hasOwnProperty(candidate.defaultStyle, 'isActive'))
            throw new PropertyError(['defaultStyle'], 'isActive', false);
    }

    // userStyles

    if (!hasOwnProperty(candidate, 'userStyles'))
        throw new PropertyError([], 'userStyles', true);

    if (!Array.isArray(candidate.userStyles))
        throw new TypeError(['userStyles'], typeof candidate.userStyles, ['array']);

    for (const [i, style] of candidate.userStyles.entries()) {
        if (!isStyles(['userStyles', i.toString()], style))
            throw new UnexpectedStateError();

        if (!hasOwnProperty(style, 'name'))
            throw new PropertyError(['userStyles', i.toString()], 'name', true);

        if (typeof style.name !== 'string')
            throw new TypeError(['userStyles', i.toString(), 'name'], typeof style.name, ['string']);

        if (!hasOwnProperty(style, 'isActive'))
            throw new PropertyError(['userStyles', i.toString()], 'isActive', true);

        if (typeof style.isActive !== 'boolean')
            throw new TypeError(['userStyles', i.toString(), 'isActive'], typeof style.isActive, ['boolean']);
    }

    // defaultTree

    if (!hasOwnProperty(candidate, 'defaultTree') || !isRoot(['defaultTree'], candidate.defaultTree))
        throw new PropertyError([], 'defaultTree', true);

    // userTree

    if (hasOwnProperty(candidate, 'userTree') && !isRoot(['userTree'], candidate.userTree))
        throw new UnexpectedStateError();

    return true;
}

// Validator

function validateConfig({title, defaultTree, userTree}: Config): Promise<unknown> {
    // title

    if (title.length === 0)
        throw new EmptyStringError(['title']);

    // trees

    validateSeeds(['defaultTree'], defaultTree);
    validatePools(['defaultTree'], defaultTree);

    if (userTree) {
        validateParentMatch(['defaultTree'], defaultTree, ['userTree'], userTree);

        // Has to be done after mutations since new pools may be created
        validatePoolSizeMatch(defaultTree, userTree);

        return Promise.all([
            ...validatePredicates(['defaultTree'], defaultTree),
            // Can fail even when defaultTree passes if generated from a different defaultTree
            // or userTree gets directly edited
            ...validatePredicates(['userTree'], userTree),
        ]);
    }

    return Promise.all(validatePredicates(['defaultTree'], defaultTree));
}

// API

export default function (candidate: unknown): Promise<unknown> {
    if (!isConfig(candidate))
        throw new UnexpectedStateError();

    return validateConfig(candidate);
}
