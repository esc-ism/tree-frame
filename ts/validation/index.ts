import * as errors from './errors';

import {
    // Property types
    VALUE_TYPES, Value, Predicate,
    // Node types
    Leaf, Root, Inner, Outer,
    // Node groups
    Node, Middle, Child,
    // API argument type
    Config, PREDICATE_TYPES
} from '../types';

// Type predicate helpers

// From https://fettblog.eu/typescript-hasownproperty/
function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop);
}

function hasChildren<X extends {}>(breadcrumbs: string[], candidate: X): candidate is X & Record<'children', unknown[]> {
    if (!hasOwnProperty(candidate, 'children'))
        throw new errors.PropertyError(breadcrumbs, 'children', true);
    if (!Array.isArray(candidate.children))
        throw new errors.TypeError([...breadcrumbs, 'children'], typeof candidate.children, ['array']);

    return true;
}

export function isUpper(node: Node): boolean {
    if ('seed' in node) return true;

    return 'children' in node && node.children.length > 0 && hasOwnProperty(node.children[0], 'children');
}

function validateUnexpectedKeys(breadcrumbs: string[], object: object, expected: string[]) {
    for (const key of Object.keys(object)) {
        if (expected.indexOf(key) === -1)
            throw new errors.PropertyError(breadcrumbs, key, false);
    }
}

type ItemValidator<T> = (breadcrumbs: string[], item: unknown, ...args: any[]) => item is T;

function isArrayOf<T>(breadcrumbs: string[], array: any, isT: ItemValidator<T>): array is T[] {
    if (!Array.isArray(array))
        throw new errors.TypeError(breadcrumbs, typeof array, ['array']);

    if (!array.every(isT.bind(null, breadcrumbs)))
        throw new errors.UnexpectedStateError();

    return true;
}

function hasLabel<X extends {}>(breadcrumbs: string[], candidate: X): candidate is X & Record<'label', string> {
    if (!hasOwnProperty(candidate, 'label'))
        throw new errors.PropertyError(breadcrumbs, 'label', true);

    if (typeof candidate.label !== 'string')
        throw new errors.TypeError(breadcrumbs, typeof candidate.label, ['string']);

    return true;
}

function hasValue<X extends {}>(breadcrumbs: string[], candidate: X): candidate is X & Record<'value', Value> {
    if (!hasOwnProperty(candidate, 'value'))
        throw new errors.PropertyError(breadcrumbs, 'value', true);

    const type = typeof candidate.value;

    if (!VALUE_TYPES.some((expectedType) => expectedType === type))
        throw new errors.TypeError(breadcrumbs, type, [...VALUE_TYPES]);

    return true;
}

function isOption(breadcrumbs: string[], option: unknown, index: number): option is string {
    if (typeof option !== 'string')
        throw new errors.TypeError([...breadcrumbs, index.toString()], typeof option, ['string']);

    return true;
}

function hasPredicate<X extends {}>(breadcrumbs: string[], candidate: X): candidate is X & Record<'predicate', Predicate> {
    if (!hasOwnProperty(candidate, 'predicate'))
        throw new errors.PropertyError(breadcrumbs, 'predicate', true);

    const {predicate} = candidate;

    switch (typeof predicate) {
        case 'function':
        case 'boolean':
            break;

        default:
            if (!Array.isArray(candidate.predicate))
                throw new errors.TypeError([...breadcrumbs, 'predicate'], typeof predicate, PREDICATE_TYPES);
            if (!isArrayOf<String>([...breadcrumbs, 'predicate'], predicate, isOption))
                throw new errors.UnexpectedStateError();
    }

    return true;
}

// Type predicates

function isLeaf(breadcrumbs: string[], candidate: unknown): candidate is Leaf {
    if (typeof candidate !== 'object')
        throw new errors.TypeError(breadcrumbs, typeof candidate, ['object']);

    if (!hasLabel(breadcrumbs, candidate))
        throw new errors.UnexpectedStateError();

    if (!hasValue(breadcrumbs, candidate))
        throw new errors.UnexpectedStateError();

    if (!hasPredicate(breadcrumbs, candidate))
        throw new errors.UnexpectedStateError();

    validateUnexpectedKeys(breadcrumbs, candidate, ['label', 'value', 'predicate']);

    return true;
}

function isOuterNode(breadcrumbs: string[], candidate: unknown): candidate is Outer {
    if (typeof candidate !== 'object')
        throw new errors.TypeError(breadcrumbs, typeof candidate, ['object']);

    if (!hasLabel(breadcrumbs, candidate))
        throw new errors.UnexpectedStateError();

    if (!hasValue(breadcrumbs, candidate))
        throw new errors.UnexpectedStateError();

    if (!hasPredicate(breadcrumbs, candidate))
        throw new errors.UnexpectedStateError();

    if (!hasOwnProperty(candidate, 'children'))
        throw new errors.PropertyError(breadcrumbs, 'children', true);
    if (!isArrayOf<Leaf>([...breadcrumbs, 'children'], candidate.children, isLeaf))
        throw new errors.UnexpectedStateError();

    validateUnexpectedKeys(breadcrumbs, candidate, ['label', 'value', 'predicate', 'children']);

    return true;
}

function isInnerNode(breadcrumbs: string[], candidate: unknown): candidate is Inner {
    if (typeof candidate !== 'object')
        throw new errors.TypeError(breadcrumbs, typeof candidate, ['object']);

    if (!hasLabel(breadcrumbs, candidate))
        throw new errors.UnexpectedStateError();

    if (!hasValue(breadcrumbs, candidate))
        throw new errors.UnexpectedStateError();

    if (!hasPredicate(breadcrumbs, candidate))
        throw new errors.UnexpectedStateError();

    if (!hasOwnProperty(candidate, 'children'))
        throw new errors.PropertyError(breadcrumbs, 'children', true);
    if (!isArrayOf<Middle>([...breadcrumbs, 'children'], candidate.children, isMiddleNode))
        throw new errors.UnexpectedStateError();

    if (hasOwnProperty(candidate, 'seed'))
        if (!isMiddleNode([...breadcrumbs, 'seed'], candidate.seed))
            throw new errors.UnexpectedStateError();

    validateUnexpectedKeys(breadcrumbs, candidate, ['label', 'value', 'predicate', 'children', 'seed']);

    return true;
}

function isMiddleNode(breadcrumbs: string[], candidate: unknown): candidate is Middle {
    if (typeof candidate !== 'object')
        throw new errors.TypeError(breadcrumbs, typeof candidate, ['object']);

    if (!hasChildren(breadcrumbs, candidate))
        throw new errors.UnexpectedStateError();

    return (isUpper(candidate as Middle) ? isInnerNode : isOuterNode)(breadcrumbs, candidate);
}

function isRoot(candidate: unknown): candidate is Root {
    if (typeof candidate !== 'object')
        throw new errors.TypeError([], typeof candidate, ['object']);

    if (!hasOwnProperty(candidate, 'children'))
        throw new errors.PropertyError([], 'children', true);
    if (!isArrayOf<Middle>(['children'], candidate.children, isMiddleNode))
        throw new errors.UnexpectedStateError();

    if (hasOwnProperty(candidate, 'seed'))
        if (!isMiddleNode(['seed'], candidate.seed))
            throw new errors.UnexpectedStateError();

    validateUnexpectedKeys([], candidate, ['children', 'seed']);

    return true;
}

// Validation helpers

type Validator = (breadcrumbs: string[], node: Child, ...args: any[]) => void;

function validateForest(breadcrumbs: string[], doValidation: Validator, forest: Child[], ...args: any[]) {
    for (const [i, node] of forest.entries()) {
        doValidation([...breadcrumbs, i.toString()], node, ...args);

        if ('children' in node) {
            validateForest([...breadcrumbs, 'children'], doValidation, node.children, ...args);
        }
    }
}

// Tree validators

function validateValidator(breadcrumbs: string[], node: Child): void {
    if ('predicate' in node) {
        switch (typeof node.predicate) {
            case 'boolean':
                break;

            case 'function':
                if (!node.predicate(node.value))
                    throw new errors.JoinedError(
                        new errors.ValuePredicateError(),
                        new errors.ValueError([...breadcrumbs, 'value'], node.value, ['unknown'])
                    );

                break;

            default:
                const options = node.predicate;

                if (options.length === 0)
                    throw new errors.JoinedError(
                        new errors.NoOptionsError(),
                        new errors.TypeError([...breadcrumbs, 'predicate', '0'], 'undefined', ['string'])
                    );

                if (options.indexOf(node.value as string) === -1)
                    throw new errors.JoinedError(
                        new errors.ValuePredicateError(),
                        new errors.ValueError([...breadcrumbs, 'value'], node.value, options)
                    );
        }
    }
}

export function validateSeedMatch(breadcrumbs: string[], target: Child, seed: Child): void {
    if (seed.label !== target.label)
        throw new errors.JoinedError(
            new errors.SeedMatchError(),
            new errors.ValueError([...breadcrumbs, 'label'], target.label, [seed.label])
        );

    if (typeof seed.value !== typeof target.value)
        throw new errors.JoinedError(
            new errors.SeedMatchError(),
            new errors.TypeError([...breadcrumbs, 'predicate'], typeof target.predicate, [typeof seed.predicate])
        );

    if (typeof seed.predicate !== typeof target.predicate)
        throw new errors.JoinedError(
            new errors.SeedMatchError(),
            new errors.TypeError([...breadcrumbs, 'predicate'], typeof target.predicate, [typeof seed.predicate])
        );

    switch (typeof seed.predicate) {
        case 'boolean':
            if (seed.predicate !== target.predicate)
                throw new errors.JoinedError(
                    new errors.SeedMatchError(),
                    new errors.ValueError([...breadcrumbs, 'predicate'], target.predicate, [seed.predicate])
                );

            if (seed.predicate === false)
                if (seed.value !== target.value) {
                    throw new errors.JoinedError(
                        new errors.SeedMatchError(),
                        new errors.ValueError([...breadcrumbs, 'value'], target.value, [seed.value])
                    );
                }

            break;

        case 'function':
            if (!seed.predicate(target.value))
                throw new errors.JoinedError(
                    new errors.SeedMatchError(),
                    new errors.ValueError([...breadcrumbs, 'value'], target.value, ['unknown'])
                );

            break;

        default:
            const {length} = target.predicate as Array<string>;

            if (seed.predicate.length !== length)
                throw new errors.JoinedError(
                    new errors.SeedMatchError(),
                    new errors.ValueError([...breadcrumbs, 'predicate', 'length'], length, [seed.predicate.length])
                );

            for (const [i, option] of seed.predicate.entries()) {
                if (target.predicate[i] !== option)
                    throw new errors.JoinedError(
                        new errors.SeedMatchError(),
                        new errors.ValueError([...breadcrumbs, 'predicate', i.toString()], target.predicate[i], [option])
                    );
            }
    }

    if ('seed' in seed !== 'seed' in target)
        throw new errors.JoinedError(
            new errors.SeedMatchError(),
            new errors.PropertyError(breadcrumbs, 'seed', 'seed' in seed)
        );

    if ('seed' in seed && 'seed' in target) {
        validateSeedMatch([...breadcrumbs, 'seed'], seed.seed, target.seed);
    }

    if ('children' in seed !== 'children' in target)
        throw new errors.JoinedError(
            new errors.SeedMatchError(),
            new errors.PropertyError(breadcrumbs, 'children', 'children' in seed)
        );

    if ('children' in seed && 'children' in target) {
        if ('seed' in seed) {
            const childSeed = seed.seed;

            for (const [i, child] of target.children.entries()) {
                validateSeedMatch([...breadcrumbs, 'children', i.toString()], child, childSeed);
            }

            for (const [i, child] of seed.children.entries()) {
                validateSeedMatch([...breadcrumbs, 'children', i.toString()], child, childSeed);
            }
        } else {
            if (seed.children.length !== target.children.length)
                throw new errors.JoinedError(
                    new errors.SeedMatchError(),
                    new errors.ValueError([...breadcrumbs, 'children', 'length'], target.children.length, [seed.children.length])
                );

            for (const [i, child] of seed.children.entries()) {
                validateSeedMatch([...breadcrumbs, 'children', i.toString()], target.children[i], child);
            }
        }
    }
}

function validateSeeds(breadcrumbs: string[], node: Node): void {
    if ('seed' in node) {
        const {seed} = node;

        for (const child of node.children) {
            validateSeedMatch([...breadcrumbs, 'seed'], child, seed);
        }
    }
}

function validateDuplicates(breadcrumbs: string[], siblings: Child[]) {
    for (const [i, node] of siblings.entries()) {
        if (!('children' in node))
            return;

        validateDuplicates([...breadcrumbs, i.toString(), 'children'], node.children);

        const {value} = node;

        for (const sibling of siblings.slice(i + 1)) {
            if (value === sibling.value)
                throw new errors.JoinedError(
                    new errors.DuplicateValueError(),
                    new errors.ValueError([...breadcrumbs, i.toString(), value.toString()], value, [`A unique ${typeof value}`])
                );
        }
    }
}

function validateRoot(breadcrumbs: string[], node: Root): void {
    validateDuplicates([...breadcrumbs, 'children'], node.children);

    validateSeeds(breadcrumbs, node);
    validateForest([...breadcrumbs, 'children'], validateSeeds, node.children);

    validateForest([...breadcrumbs, 'children'], validateValidator, node.children);
}

// Config type predicate helpers

function hasTitle<X extends {}>(candidate: X): candidate is X & Record<'title', string> {
    if (!hasOwnProperty(candidate, 'title'))
        throw new errors.PropertyError([], 'title', true);

    if (typeof candidate.title !== 'string')
        throw new errors.TypeError(['title'], typeof candidate.title, ['string']);

    return true;
}

function hasTree<X extends {}>(candidate: X): candidate is X & Record<'tree', Root> {
    if (!hasOwnProperty(candidate, 'tree'))
        throw new errors.PropertyError([], 'tree', true);

    if (!isRoot(candidate.tree))
        throw new errors.UnexpectedStateError();

    return true;
}

// Config type predicate

function isConfig(candidate: unknown): candidate is Config {
    if (typeof candidate !== 'object')
        throw new errors.TypeError([], typeof candidate, ['object']);

    if (!hasTitle(candidate))
        throw new errors.UnexpectedStateError();

    if (!hasTree(candidate))
        throw new errors.UnexpectedStateError();

    validateUnexpectedKeys([], candidate, ['title', 'tree']);

    return true;
}

// Config validators

function validateTitle(title: string): void {
    if (title.length === 0)
        throw new Error('The title may not be an empty string.');
}

// Top-level validator

export default function validate(config: unknown): void {
    if (!isConfig(config))
        throw new errors.UnexpectedStateError();

    validateTitle(config.title);

    validateRoot(['tree'], config.tree);
}
