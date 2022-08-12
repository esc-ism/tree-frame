// Helpers

function getOptionString(array: readonly string[]) {
    if (array.length === 0) {
        throw new Error('No valid options.');
    }

    if (array.length === 1) {
        return array[0];
    }

    const lastIndex = array.length - 1;

    return `${array.slice(0, lastIndex).join(', ')} or ${array[lastIndex]}`;
}

function getPath(breadcrumbs: string[]): string {
    return `/${breadcrumbs.join('/')}`;
}

// Errors

export class JoinedError extends Error {
    static separator = '\n\n';

    constructor(...errors: Error[]) {
        super(errors.map(({message}) => message).join(JoinedError.separator));
    }
}

export class UnexpectedStateError extends Error {
    constructor() {
        super('Unexpected state reached.');
    }
}

export class TypeError extends Error {
    constructor(breadcrumbs: string[], found: string, expected: readonly string[]) {
        super(`Found a value of type '${found}' at ${getPath(breadcrumbs)}. Expected ${getOptionString(expected)}.`);
    }
}

export class PropertyError extends Error {
    constructor(breadcrumbs: string[], property: string, shouldExist: boolean) {
        super(`${shouldExist ? 'Missing' : 'Unexpected'} property '${property}' found at ${getPath(breadcrumbs)}.`);
    }
}

export class ValueError extends Error {
    constructor(breadcrumbs: string[], found: any, expected: readonly any[]) {
        super(`Found a value of '${found}' at ${getPath(breadcrumbs)}. Expected ${getOptionString(expected)}.`);
    }
}

export class NonIntegerError extends Error {
    constructor(breadcrumbs: string[]) {
        super(`Found illegal non-integer at ${getPath(breadcrumbs)}.`);
    }
}

export class EmptyStringError extends Error {
    constructor(breadcrumbs: string[]) {
        super(`Found illegal empty string at ${getPath(breadcrumbs)}.`);
    }
}

export class EmptyArrayError extends Error {
    constructor(breadcrumbs: string[]) {
        super(`Found illegal empty array at ${getPath(breadcrumbs)}.`);
    }
}

export class PredicateError extends Error {
    constructor(breadcrumbs: string[]) {
        super(`Predicate failed at ${getPath(breadcrumbs)}. Predicates must succeed.`);
    }
}

export class SeedMatchError extends Error {
    constructor() {
        super('All children must be structurally similar to their parent\'s seed.');
    }
}

export class PoolBranchError extends Error {
    constructor(ancestorBreadcrumbs: Array<string>, descendantBreadcrumbs: Array<string>, poolId: number) {
        super(
            'No node may share a poolId value with its ancestor.' + JoinedError.separator +
            `Found poolId value ${poolId} at ${getPath(ancestorBreadcrumbs)} and ${getPath(descendantBreadcrumbs)}.`
        );
    }
}

export class PoolSizeError extends Error {
    constructor(poolId: number, found: number, expected: number) {
        super(
            'Corresponding pools in the default & candidate trees must be the same size unless a pool parent or ancestor has a seed value.' + JoinedError.separator +
            `Found a size of ${found} at pool ${poolId}. Expected a size of ${expected}.`
        );
    }
}

export class NoOptionsError extends Error {
    constructor() {
        super('Array type validators may not be empty.');
    }
}

export class MismatchedOptionsError extends Error {
    constructor() {
        super('Values in array type validators must all be the same type.');
    }
}

export class HangingPredicateError extends Error {
    constructor() {
        super('If a predicate is declared, a value must also be present.');
    }
}

export class DeactivatedError extends Error {
    constructor() {
        super('Nodes can\'t be deactivated unless their parent has a seed.');
    }
}

export class NoNodeColourError extends Error {
    constructor() {
        super('If the node color property is included, at least one value must be defined.');
    }
}
