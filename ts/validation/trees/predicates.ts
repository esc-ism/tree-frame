import type {Child, Parent} from '../types';
import {
    TypeError, ValueError, PropertyError,
    JoinedError, EmptyArrayError, NoOptionsError,
    MismatchedOptionsError, PredicateError, HangingPredicateError
} from '../errors';

import {getPredicateResponse} from '../../messaging';

function getPredicatePromise(id: number, arg: any, error: Error): Promise<void> {
    return new Promise((resolve, reject) => {
        getPredicateResponse(id, arg)
            .then(resolve)
            .catch(() => reject(error));
    });
}

async function validateChild(breadcrumbs: Array<string>, child: Child): Promise<void> {
    if (!('predicate' in child)) {
        return;
    }

    if (!('value' in child)) {
        throw new JoinedError(
            new HangingPredicateError(),
            new PropertyError(breadcrumbs, 'value', true)
        );
    }

    switch (typeof child.predicate) {
        case 'number':
            await getPredicatePromise(
                child.predicate, child.value,
                new PredicateError([...breadcrumbs, 'predicate'])
            );

            break;

        case 'function':
            if (!child.predicate(child.value))
                throw new PredicateError([...breadcrumbs, 'predicate']);

            return;

        default: {
            const options = child.predicate;

            if (options.length === 0)
                throw new JoinedError(
                    new NoOptionsError(),
                    new EmptyArrayError([...breadcrumbs, 'predicate'])
                );

            const type = typeof options[0];

            for (let i = 1; i < options.length; ++i) {
                if (typeof options[i] !== type)
                    throw new JoinedError(
                        new MismatchedOptionsError(),
                        new TypeError([...breadcrumbs, 'predicate', i.toString()], typeof options[i], [type])
                    );
            }

            if (!options.includes(child.value))
                throw new JoinedError(
                    new PredicateError([...breadcrumbs, 'predicate']),
                    new ValueError([...breadcrumbs, 'value'], child.value, options)
                );
        }
    }
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

    if ('childPredicate' in parent) {
        if (typeof parent.childPredicate === 'number') {
            promises.push(getPredicatePromise(
                parent.childPredicate, children,
                new PredicateError([...breadcrumbs, 'childPredicate'])
            ));
        } else if (!parent.childPredicate(children)) {
            throw new PredicateError([...breadcrumbs, 'childPredicate']);
        }
    }

    if ('descendantPredicate' in parent) {
        if (typeof parent.descendantPredicate === 'number') {
            promises.push(getPredicatePromise(
                parent.descendantPredicate, children,
                new PredicateError([...breadcrumbs, 'descendantPredicate'])
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
