// Private

function getOptionString(array: string[]) {
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

// Public

export class JoinedError extends Error {
    constructor(...errors: Error[]) {
        super(errors.map(({message}) => message).join('\n\n'));
    }
}

export class UnexpectedStateError extends Error {
    constructor() {
        super('Unexpected state reached.');
    }
}

export class TypeError extends Error {
    constructor(breadcrumbs: string[], found: string, expected: string[]) {
        super(`Found ${found} type value at ${getPath(breadcrumbs)}. Expected ${getOptionString(expected)}.`);
    }
}

export class PropertyError extends Error {
    constructor(breadcrumbs: string[], property: string, shouldExist: boolean) {
        super(`${shouldExist ? 'Missing' : 'Unexpected'} property '${property}' at ${getPath(breadcrumbs)}.`);
    }
}

export class ValueError extends Error {
    constructor(breadcrumbs: string[], found: any, expected: any[]) {
        super(`Found ${found} value at ${getPath(breadcrumbs)}. Expected ${getOptionString(expected)}.`);
    }
}

export class SeedMatchError extends Error {
    constructor() {
        super('All children of nodes with a seed property must creatable from the seed tree.');
    }
}

export class NoOptionsError extends Error {
    constructor() {
        super('Array type validators may not be empty.');
    }
}

export class EmptyInnerError extends Error {
    constructor() {
        super('Inner nodes must have at least one child.');
    }
}

export class DeadRootError extends Error {
    constructor() {
        super('If the tree\'s root has no children, it must have a seed.');
    }
}

export class ValuePredicateError extends Error {
    constructor() {
        super('If a node is given a validator, its value must be accepted.');
    }
}

export class DuplicateValueError extends Error {
    constructor() {
        super('Siblings may not have equal values.');
    }
}
