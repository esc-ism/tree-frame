import type {Child, Parent, Predicate, Value} from '../types';
import {
    TypeError, ValueError, PropertyError,
    JoinedError, EmptyArrayError, NoOptionsError, NonIntegerError,
    MismatchedOptionsError, PredicateError, HangingPredicateError,
} from '../errors';

import {getPredicateResponse} from '../../messaging';

function getPredicatePromise(id: number, arg: any, error: Error): Promise<void> {
    return new Promise((resolve, reject) => {
        getPredicateResponse(id, arg)
            .then(resolve)
            .catch(() => reject(error));
    });
}

async function validateValue(
    valueBreadcrumbs: Array<string>, value: Value,
    predicateBreadcrumbs: Array<string>, predicate: Predicate,
) {
    switch (typeof predicate) {
        case 'number':
            await getPredicatePromise(
                predicate, value,
                new PredicateError(predicateBreadcrumbs),
            );

            break;

        case 'function':
            if (!predicate(value))
                throw new PredicateError(predicateBreadcrumbs);

            break;

        default:
            if (!predicate.includes(value))
                throw new JoinedError(
                    new PredicateError(predicateBreadcrumbs),
                    new ValueError(valueBreadcrumbs, value, predicate),
                );
    }
}

async function validateChild(breadcrumbs: Array<string>, child: Child): Promise<void> {
    if (!('predicate' in child)) {
        return;
    }

    if (!('value' in child)) {
        throw new JoinedError(
            new HangingPredicateError(),
            new PropertyError(breadcrumbs, 'value', true),
        );
    }

    if (Array.isArray(child.predicate)) {
        if (child.predicate.length === 0)
            throw new JoinedError(
                new NoOptionsError(),
                new EmptyArrayError([...breadcrumbs, 'predicate']),
            );

        const type = typeof child.predicate[0];

        for (let i = 1; i < child.predicate.length; ++i) {
            if (typeof child.predicate[i] !== type)
                throw new JoinedError(
                    new MismatchedOptionsError(),
                    new TypeError([...breadcrumbs, 'predicate', i.toString()], typeof child.predicate[i], [type]),
                );
        }
    }

    await validateValue(
        [...breadcrumbs, 'value'], child.value,
        [...breadcrumbs, 'predicate'], child.predicate,
    );
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
        if (typeof parent.childPredicate === 'number') {
            promises.push(getPredicatePromise(
                parent.childPredicate, children,
                new PredicateError([...breadcrumbs, 'childPredicate']),
            ));
        } else if (!parent.childPredicate(children)) {
            throw new PredicateError([...breadcrumbs, 'childPredicate']);
        }
    }

    if ('descendantPredicate' in parent) {
        if (typeof parent.descendantPredicate === 'number') {
            promises.push(getPredicatePromise(
                parent.descendantPredicate, children,
                new PredicateError([...breadcrumbs, 'descendantPredicate']),
            ));
        } else if (!parent.descendantPredicate(children)) {
            throw new PredicateError([...breadcrumbs, 'descendantPredicate']);
        }
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
