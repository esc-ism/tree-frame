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

// JoinedError definition

export class JoinedError extends Error {
    constructor(...errors: Error[]) {
        super(errors.map(({message}) => message).join('\n\n'));
    }
}

// Errors that may be used outside of JoinedError

export class UnexpectedStateError extends Error {
    constructor() {
        super('Unexpected state reached.');
    }
}

export class TypeError extends Error {
    constructor(breadcrumbs: string[], found: string, expected: readonly string[]) {
        super(`Found ${found} type value at ${getPath(breadcrumbs)}. Expected ${getOptionString(expected)}.`);
    }
}

export class PropertyError extends Error {
    constructor(breadcrumbs: string[], property: string, shouldExist: boolean) {
        super(`${shouldExist ? 'Missing' : 'Unexpected'} property '${property}' at ${getPath(breadcrumbs)}.`);
    }
}

export class ValueError extends Error {
    constructor(breadcrumbs: string[], found: any, expected: readonly  any[]) {
        super(`Found ${found} value at ${getPath(breadcrumbs)}. Expected ${getOptionString(expected)}.`);
    }
}

// Errors to be used in conjunction with JoinedError

export class EmptyStringError extends Error {
    constructor(breadcrumbs: string[]) {
        super(`Found illegal empty string at ${getPath(breadcrumbs)}.`);
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

export class PoolMatchError extends Error {
    constructor() {
        super('Nodes with the same poolId value must be structurally similar.');
    }
}

export class RootPoolMatchError extends Error {
    constructor(breadcrumbs: Array<string>) {
        super(
            `Node found at ${getPath(breadcrumbs)} with the same poolId value as the root.` +
            `It\'s impossible for the root to be structurally similar to any other node.`
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

export class DeadRootError extends Error {
    constructor() {
        super('If the tree\'s root has no children, it must have a seed.');
    }
}
