import * as errors from './errors';

import {
    // Key names
    LEAF_KEYS, MIDDLE_KEYS, ROOT_KEYS,
    // Value types
    VALUE_TYPES, Value,
    PREDICATE_TYPES, Predicate,
    INPUT_TYPES,
    DefaultStyle, UserStyle,
    // Node types
    Root, Child, Parent, Node,
    // API argument type
    Config, CONFIG_KEYS, CONTRAST_METHODS, ContrastMethod
} from './types';

// Type predicate helpers

// Credit to https://fettblog.eu/typescript-hasownproperty/
function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop);
}

function validateUnexpectedKeys(breadcrumbs: string[], object: object, expected: readonly string[]) {
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
        throw new errors.TypeError([...breadcrumbs, 'label'], typeof candidate.label, ['string']);

    return true;
}

function hasValue<X extends {}>(breadcrumbs: string[], candidate: X): candidate is X & Record<'value', Value> {
    if (!hasOwnProperty(candidate, 'value'))
        throw new errors.PropertyError(breadcrumbs, 'value', true);

    const type = typeof candidate.value;

    if (!VALUE_TYPES.some((expectedType) => expectedType === type))
        throw new errors.TypeError([...breadcrumbs, 'value'], type, VALUE_TYPES);

    return true;
}

function isOption(breadcrumbs: string[], option: unknown, index: number): option is Value {
    const type = typeof option;

    if (!VALUE_TYPES.some((expectedType) => expectedType === type))
        throw new errors.TypeError([...breadcrumbs, index.toString()], type, VALUE_TYPES);

    return true;
}

function hasPredicate<X extends {}>(breadcrumbs: string[], candidate: X): candidate is X | X & Record<'predicate', Predicate> {
    if (hasOwnProperty(candidate, 'predicate')) {
        const {predicate} = candidate;

        switch (typeof predicate) {
            case 'function':
            case 'boolean':
                break;

            default:
                if (!Array.isArray(candidate.predicate))
                    throw new errors.TypeError([...breadcrumbs, 'predicate'], typeof predicate, PREDICATE_TYPES);
                if (!isArrayOf<Value>([...breadcrumbs, 'predicate'], predicate, isOption))
                    throw new errors.UnexpectedStateError();
        }

        return true;
    }

    return false;
}

function hasChildren<X extends {}>(breadcrumbs: string[], candidate: X): candidate is X & Record<'children', Array<unknown>> {
    if (!hasOwnProperty(candidate, 'children'))
        throw new errors.PropertyError(breadcrumbs, 'children', true);

    if (!Array.isArray(candidate.children))
        throw new errors.TypeError([...breadcrumbs, 'children'], typeof candidate.children, ['array']);

    return true;
}

function isStyles(breadcrumbs: string[], candidate: unknown): candidate is object {
    if (typeof candidate !== 'object')
        throw new errors.TypeError(breadcrumbs, typeof candidate, ['object']);

    for (const [key, value] of Object.entries(candidate)) {
        switch (key) {
            // Colours
            case 'modalOutline':
            case 'headBase':
            case 'headButtonExit':
            case 'headButtonLabel':
            case 'headButtonLeaf':
            case 'headButtonStyle':
            case 'nodeBase':
            case 'nodeButtonRemove':
            case 'nodeButtonCreate':
            case 'nodeButtonMove':
            case 'nodeButtonEdit':
            case 'inputValid':
            case 'inputInvalid':
            case 'tooltipOutline':
                if (typeof value !== 'string')
                    throw new errors.TypeError([...breadcrumbs, key], typeof value, ['string']);

                break;

            // Numbers
            case 'fontSize':
                if (typeof value !== 'number')
                    throw new errors.TypeError([...breadcrumbs, key], typeof value, ['number']);

                break;

            // Contrast methods
            case 'headContrast':
            case 'nodeContrast':
                if (typeof value !== 'string')
                    throw new errors.TypeError([...breadcrumbs, key], typeof value, ['string']);

                if (CONTRAST_METHODS.indexOf(value as ContrastMethod) === -1)
                    throw new errors.ValueError([...breadcrumbs, key], value, CONTRAST_METHODS);

                break;

            // Booleans
            case 'isActive':
            case 'leafShowBorder':
                if (typeof value !== 'boolean')
                    throw new errors.TypeError([...breadcrumbs, key], typeof value, ['boolean']);
        }
    }

    return true;
}

// Type predicates

function isParent(breadcrumbs: string[], candidate: object): candidate is Parent {
    if (!hasChildren(breadcrumbs, candidate))
        throw new errors.UnexpectedStateError();

    if (hasOwnProperty(candidate, 'seed') && !isChild([...breadcrumbs, 'seed'], candidate.seed))
        throw new errors.UnexpectedStateError();

    if (hasOwnProperty(candidate, 'childPredicate') && typeof candidate.childPredicate !== 'function')
        throw new errors.TypeError([...breadcrumbs, 'childPredicate'], typeof candidate.childPredicate, ['function']);

    if (hasOwnProperty(candidate, 'descendantPredicate') && typeof candidate.descendantPredicate !== 'function')
        throw new errors.TypeError([...breadcrumbs, 'descendantPredicate'], typeof candidate.descendantPredicate, ['function']);

    for (const [i, child] of candidate.children.entries()) {
        if (!isChild([...breadcrumbs, 'children', i.toString()], child))
            throw new errors.UnexpectedStateError();
    }

    return true;
}

function isChild(breadcrumbs: string[], candidate: unknown): candidate is Child {
    if (typeof candidate !== 'object')
        throw new errors.TypeError([...breadcrumbs], typeof candidate, ['object']);

    if (!hasLabel(breadcrumbs, candidate))
        throw new errors.UnexpectedStateError();

    if (!hasValue(breadcrumbs, candidate))
        throw new errors.UnexpectedStateError();

    hasPredicate(breadcrumbs, candidate);

    if (hasOwnProperty(candidate, 'input')) {
        if (typeof candidate.input !== 'string')
            throw new errors.TypeError([...breadcrumbs, 'input'], typeof candidate.input, ['string']);

        if (!INPUT_TYPES.some((expectedType) => expectedType === candidate.input))
            throw new errors.ValueError([...breadcrumbs, 'input'], typeof candidate.input, INPUT_TYPES);
    }

    if (hasOwnProperty(candidate, 'children')) {
        if (!isParent(breadcrumbs, candidate))
            throw new errors.UnexpectedStateError();

        validateUnexpectedKeys(breadcrumbs, candidate, MIDDLE_KEYS);
    } else {
        validateUnexpectedKeys(breadcrumbs, candidate, LEAF_KEYS);
    }

    return true;
}

function isRoot(candidate: unknown): candidate is Root {
    if (typeof candidate !== 'object')
        throw new errors.TypeError(['tree'], typeof candidate, ['object']);

    if (!isParent(['tree'], candidate))
        throw new errors.UnexpectedStateError();

    validateUnexpectedKeys(['tree'], candidate, ROOT_KEYS);

    return true;
}

function isDefaultStyle(candidate: unknown): candidate is DefaultStyle {
    return isStyles(['defaultStyle'], candidate);
}

function isUserStyle(breadcrumbs: Array<string>, candidate: unknown): candidate is UserStyle {
    if (!isStyles(breadcrumbs, candidate))
        throw new errors.UnexpectedStateError();

    if (!('name' in candidate))
        new errors.PropertyError(breadcrumbs, 'name', true);

    return true;
}

// Validation helpers

//TODO replace all the type[] format array types
type Validator = (breadcrumbs: string[], node: Child, ...args: any[]) => void;

function validateForest(breadcrumbs: string[], doValidation: Validator, forest: Child[], ...args: any[]) {
    for (const [i, node] of forest.entries()) {
        doValidation([...breadcrumbs, i.toString()], node, ...args);

        if ('children' in node) {
            validateForest([...breadcrumbs, 'children'], doValidation, node.children, ...args);
        }

        if ('seed' in node) {
            validateForest([...breadcrumbs, 'seed'], doValidation, [node.seed], ...args);
        }
    }
}

// Tree validators

export function validateSeedMatch(
    seedBreadcrumbs: string[], mainBreadcrumbs: string[],
    seed: Child, target: Child
): void {
    if (seed.label !== target.label)
        throw new errors.JoinedError(
            new errors.SeedMatchError(),
            new errors.ValueError([...mainBreadcrumbs, 'label'], target.label, [seed.label])
        );

    if (typeof seed.value !== typeof target.value)
        throw new errors.JoinedError(
            new errors.SeedMatchError(),
            new errors.TypeError([...mainBreadcrumbs, 'value'], typeof target.value, [typeof seed.value])
        );

    if ('predicate' in seed !== 'predicate' in target)
        throw new errors.JoinedError(
            new errors.SeedMatchError(),
            new errors.PropertyError(mainBreadcrumbs, 'predicate', 'predicate' in seed)
        );

    if ('predicate' in seed) {
        if (typeof seed.predicate !== typeof target.predicate)
            throw new errors.JoinedError(
                new errors.SeedMatchError(),
                new errors.TypeError([...mainBreadcrumbs, 'predicate'], typeof target.predicate, [typeof seed.predicate])
            );

        switch (typeof seed.predicate) {
            case 'boolean':
                if (seed.predicate !== target.predicate)
                    throw new errors.JoinedError(
                        new errors.SeedMatchError(),
                        new errors.ValueError([...mainBreadcrumbs, 'predicate'], target.predicate, [seed.predicate])
                    );

                if (seed.predicate === false)
                    if (seed.value !== target.value) {
                        throw new errors.JoinedError(
                            new errors.SeedMatchError(),
                            new errors.ValueError([...mainBreadcrumbs, 'value'], target.value, [seed.value])
                        );
                    }

                break;

            case 'function':
                if (!seed.predicate(target.value))
                    throw new errors.JoinedError(
                        new errors.SeedMatchError(),
                        new errors.ValueError([...mainBreadcrumbs, 'value'], target.value, ['unknown'])
                    );

                break;

            default:
                const {length} = target.predicate as Array<string>;

                if (seed.predicate.length !== length)
                    throw new errors.JoinedError(
                        new errors.SeedMatchError(),
                        new errors.ValueError([...mainBreadcrumbs, 'predicate', 'length'], length, [seed.predicate.length])
                    );

                for (const [i, option] of seed.predicate.entries()) {
                    if (target.predicate[i] !== option)
                        throw new errors.JoinedError(
                            new errors.SeedMatchError(),
                            new errors.ValueError([...mainBreadcrumbs, 'predicate', i.toString()], target.predicate[i], [option])
                        );
                }
        }
    }

    if ('seed' in seed !== 'seed' in target)
        throw new errors.JoinedError(
            new errors.SeedMatchError(),
            new errors.PropertyError(mainBreadcrumbs, 'seed', 'seed' in seed)
        );

    if ('seed' in seed && 'seed' in target) {
        validateSeedMatch([...seedBreadcrumbs, 'seed'], [...mainBreadcrumbs, 'seed'], seed.seed, target.seed);
    }

    if ('children' in seed !== 'children' in target)
        throw new errors.JoinedError(
            new errors.SeedMatchError(),
            new errors.PropertyError(mainBreadcrumbs, 'children', 'children' in seed)
        );

    if ('children' in seed && 'children' in target) {
        if ('seed' in seed) {
            for (const [i, seedChild] of seed.children.entries()) {
                for (const [j, child] of target.children.entries()) {
                    validateSeedMatch(
                        [...seedBreadcrumbs, 'children', i.toString()],
                        [...mainBreadcrumbs, 'children', j.toString()],
                        seedChild, child
                    );
                }
            }
        } else {
            if (seed.children.length !== target.children.length)
                throw new errors.JoinedError(
                    new errors.SeedMatchError(),
                    new errors.ValueError([...mainBreadcrumbs, 'children', 'length'], target.children.length, [seed.children.length])
                );

            for (const [i, child] of target.children.entries()) {
                validateSeedMatch(
                    [...seedBreadcrumbs, 'children', i.toString()],
                    [...mainBreadcrumbs, 'children', i.toString()],
                    seed.children[i], child
                );
            }
        }
    }
}

function validateSeeds(breadcrumbs: string[], node: Node): void {
    if ('seed' in node) {
        const {children, seed} = node;

        for (const [i, child] of children.entries()) {
            validateSeedMatch(
                [...breadcrumbs, 'seed'],
                [...breadcrumbs, 'children', i.toString()],
                seed, child
            );
        }
    }
}

function validatePredicate(breadcrumbs: Array<string>, child: Child): void {
    switch (typeof child.predicate) {
        case 'boolean':
            break;

        case 'function':
            if (!child.predicate(child.value))
                throw new errors.PredicateError([...breadcrumbs, 'predicate']);
            break;

        default:
            const options = child.predicate;

            if (options.length === 0)
                throw new errors.JoinedError(
                    new errors.NoOptionsError(),
                    new errors.TypeError([...breadcrumbs, 'predicate', '0'], 'undefined', ['string'])
                );

            const type = typeof options[0];

            for (let i = 1; i < options.length; ++i) {
                if (typeof options[i] !== type)
                    throw new errors.JoinedError(
                        new errors.MismatchedOptionsError(),
                        new errors.TypeError([...breadcrumbs, 'predicate', i.toString()], typeof options[i], [type])
                    );
            }

            if (options.indexOf(child.value) === -1)
                throw new errors.JoinedError(
                    new errors.PredicateError([...breadcrumbs, 'predicate']),
                    new errors.ValueError([...breadcrumbs, 'value'], child.value, options)
                );
    }
}

function validatePredicates(breadcrumbs: string[], parent: Parent): void {
    if ('seed' in parent) {
        const {seed} = parent;

        validatePredicate([...breadcrumbs, 'seed'], seed);

        if ('children' in seed) {
            validatePredicates([...breadcrumbs, 'seed'], seed);
        }
    }

    const {children} = parent;

    if ('childPredicate' in parent && !parent.childPredicate(children))
        throw new errors.PredicateError([...breadcrumbs, 'childPredicate']);

    if ('descendantPredicate' in parent && !parent.descendantPredicate(children))
        throw new errors.PredicateError([...breadcrumbs, 'descendantPredicate']);

    for (const [i, child] of children.entries()) {
        const childBreadcrumbs = [...breadcrumbs, 'children', i.toString()];

        validatePredicate(childBreadcrumbs, child);

        if ('children' in child) {
            validatePredicates(childBreadcrumbs, child);
        }
    }
}

function validateRoot(node: Root): void {
    if (!('seed' in node) && node.children.length === 0)
        throw new errors.JoinedError(
            new errors.DeadRootError(),
            new errors.PropertyError(['tree'], 'seed', true)
        );

    // TODO Test this (and everything else)
    validateSeeds(['tree'], node);
    validateForest(['tree', 'children'], validateSeeds, node.children);

    validatePredicates(['tree'], node);
}

// Config type predicate helpers

function hasTitle<X extends {}>(candidate: X): candidate is X & Record<'title', string> {
    if (!hasOwnProperty(candidate, 'title'))
        throw new errors.PropertyError([], 'title', true);

    if (typeof candidate.title !== 'string')
        throw new errors.TypeError(['title'], typeof candidate.title, ['string']);

    return true;
}

function hasTree<X extends {}>(candidate: X): candidate is X & Record<'data', Root> {
    if (!hasOwnProperty(candidate, 'tree'))
        throw new errors.PropertyError([], 'tree', true);

    if (!isRoot(candidate.tree))
        throw new errors.UnexpectedStateError();

    return true;
}

function hasUserStyles<X extends {}>(candidate: X): candidate is X & Record<'userStyles', Array<UserStyle>> {
    if (!hasOwnProperty(candidate, 'userStyles'))
        throw new errors.PropertyError([], 'userStyles', true);

    if (!isArrayOf<UserStyle>(['userStyles'], candidate.userStyles, isUserStyle))
        throw new errors.UnexpectedStateError();

    return true;
}

function hasDefaultStyle<X extends {}>(candidate: X): candidate is X | (X & Record<'defaultStyle', DefaultStyle>) {
    if (hasOwnProperty(candidate, 'defaultStyle')) {
        if (!isDefaultStyle(candidate.defaultStyle))
            throw new errors.UnexpectedStateError();

        return true;
    }

    return false;
}

// Config type predicate

function isConfig(candidate: unknown): candidate is Config {
    if (typeof candidate !== 'object')
        throw new errors.TypeError([], typeof candidate, ['object']);

    if (!hasTitle(candidate))
        throw new errors.UnexpectedStateError();

    if (!hasTree(candidate))
        throw new errors.UnexpectedStateError();

    if (!hasUserStyles(candidate))
        throw new errors.UnexpectedStateError();

    // TODO Change function naming scheme I guess?
    hasDefaultStyle(candidate);

    validateUnexpectedKeys([], candidate, CONFIG_KEYS);

    return true;
}

// Config validators

function validateTitle(title: string): void {
    if (title.length === 0)
        throw new errors.EmptyStringError(['title']);
}

// Top-level validator

export default function validateConfig(config: unknown): void {
    if (!isConfig(config))
        throw new errors.UnexpectedStateError();

    validateTitle(config.title);

    validateRoot(config.tree);
}
