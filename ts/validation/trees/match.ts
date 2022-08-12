import type {Child, Node, Parent, Root} from '../types';
import {
    TypeError, ValueError, PropertyError,
    PoolSizeError,
    JoinedError, SeedMatchError, DeactivatedError,
} from '../errors';

function mutateMatch(
    model: Node, candidate: Node,
    validate: (
        modelBreadcrumbs: string[], model: Node,
        candidateBreadcrumbs: string[], candidate: Node
    ) => void,
    property: string
) {
    try {
        validate([], model, [], candidate);
    } catch (error) {
        if (property in model) {
            candidate[property] = model[property];
        } else {
            delete candidate[property];
        }
    }
}

function validatePredicateMatch(
    modelBreadcrumbs: string[], model: Child,
    candidateBreadcrumbs: string[], candidate: Child
) {
    if ('predicate' in model !== 'predicate' in candidate)
        throw new PropertyError(candidateBreadcrumbs, 'predicate', 'predicate' in model);

    if (typeof model.predicate !== typeof candidate.predicate)
        throw new TypeError([...candidateBreadcrumbs, 'predicate'], typeof candidate.predicate, [typeof model.predicate]);

    switch (typeof model.predicate) {
        case 'number':
            if (model.predicate !== candidate.predicate)
                throw new ValueError([...candidateBreadcrumbs, 'predicate'], candidate.predicate, [model.predicate]);

            break;

        case 'object':
            const {length} = candidate.predicate as Array<string>;

            if (model.predicate.length !== length)
                throw new ValueError([...candidateBreadcrumbs, 'predicate', 'length'], length, [model.predicate.length]);

            for (const [i, option] of model.predicate.entries()) {
                if (candidate.predicate[i] !== option)
                    throw new ValueError([...candidateBreadcrumbs, 'predicate', i.toString()], candidate.predicate[i], [option]);
            }
    }
}

function validateValueMatch(
    property: string,
    modelBreadcrumbs: string[], model: Node,
    candidateBreadcrumbs: string[], candidate: Node
) {
    if (property in model !== property in candidate)
        throw new PropertyError(candidateBreadcrumbs, property, property in model);

    if (model[property] !== candidate[property])
        throw new ValueError([...candidateBreadcrumbs, property], candidate[property], [model[property]]);
}

// Tree validators

export function validateParentMatch(
    modelBreadcrumbs: string[], model: Parent,
    candidateBreadcrumbs: string[], candidate: Parent,
    isFrozen: boolean = false
): void {
    if (isFrozen) {
        validateValueMatch('poolId', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
        validateValueMatch('childPredicate', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
        validateValueMatch('descendantPredicate', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
    } else {
        mutateMatch(model, candidate, validateValueMatch.bind(null, 'poolId'), 'poolId');
        mutateMatch(model, candidate, validateValueMatch.bind(null, 'childPredicate'), 'childPredicate');
        mutateMatch(model, candidate, validateValueMatch.bind(null, 'descendantPredicate'), 'descendantPredicate');
    }

    if ('seed' in model !== 'seed' in candidate)
        throw new PropertyError(candidateBreadcrumbs, 'seed', 'seed' in model);

    if ('seed' in model) {
        validateChildMatch(
            [...modelBreadcrumbs, 'seed'], model.seed,
            [...candidateBreadcrumbs, 'seed'], candidate.seed,
            isFrozen
        );

        for (const [i, child] of candidate.children.entries()) {
            validateChildMatch(
                [...modelBreadcrumbs, 'seed'], model.seed,
                [...candidateBreadcrumbs, 'children', i.toString()], child,
                isFrozen
            );
        }
    } else if (!('poolId' in model)) {
        if (isFrozen && model.children.length !== candidate.children.length)
            throw new ValueError([...candidateBreadcrumbs, 'children', 'length'], candidate.children.length, [model.children.length]);

        if (model.children.length < candidate.children.length) {
            candidate.children = candidate.children.slice(0, model.children.length);
        }

        for (const [i, child] of candidate.children.entries()) {
            validateChildMatch(
                [...modelBreadcrumbs, 'children', i.toString()], model.children[i],
                [...candidateBreadcrumbs, 'children', i.toString()], child,
                isFrozen
            );
        }

        if (model.children.length > candidate.children.length) {
            candidate.children.push(...model.children.slice(candidate.children.length));
        }
    }
}

function validateChildMatch(
    modelBreadcrumbs: string[], model: Child,
    candidateBreadcrumbs: string[], candidate: Child,
    isFrozen: boolean = true
): void {
    if ('value' in model !== 'value' in candidate) {
        if (isFrozen || 'value' in candidate)
            throw new PropertyError(candidateBreadcrumbs, 'value', false);

        candidate.value = model.value;
    } else {
        if (typeof model.value !== typeof candidate.value)
            throw new TypeError([...candidateBreadcrumbs, 'value'], typeof candidate.value, [typeof model.value]);
    }

    if (isFrozen) {
        validateValueMatch('label', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
        validatePredicateMatch(modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
    } else {
        if (typeof model.value !== typeof candidate.value)
            throw new TypeError([...candidateBreadcrumbs, 'value'], typeof candidate.value, [typeof model.value]);

        mutateMatch(model, candidate, validateValueMatch.bind(null, 'label'), 'label');
        mutateMatch(model, candidate, validatePredicateMatch, 'predicate');
    }

    if ('children' in model !== 'children' in candidate)
        throw new PropertyError(candidateBreadcrumbs, 'children', 'children' in model);

    if ('children' in model) {
        validateParentMatch(modelBreadcrumbs, model, candidateBreadcrumbs, candidate as Parent, isFrozen);
    }
}

export function validateSeeds(breadcrumbs: string[], node: Node): void {
    if ('children' in node) {
        if ('seed' in node) {
            try {
                for (const [i, child] of node.children.entries()) {
                    validateChildMatch(
                        [...breadcrumbs, 'seed'], node.seed,
                        [...breadcrumbs, 'children', i.toString()], child
                    );
                }
            } catch (error) {
                throw new JoinedError(new SeedMatchError(), error);
            }

            validateSeeds([...breadcrumbs, 'seed'], node.seed);
        } else {
            for (const [i, child] of node.children.entries()) {
                if ('isActive' in child && !child.isActive) {
                    throw new JoinedError(
                        new DeactivatedError(),
                        new ValueError([...breadcrumbs, 'children', i.toString(), 'isActive'], false, [true])
                    );
                }
            }
        }

        for (const [i, child] of node.children.entries()) {
            validateSeeds([...breadcrumbs, 'children', i.toString()], child);
        }
    }
}

function getPoolSizes(node: Node, uncapped = false): Array<number> {
    const poolSizes: Array<number> = [];

    uncapped = uncapped || 'seed' in node;

    if ('poolId' in node) {
        poolSizes[node.poolId] = uncapped ? -1 : node.children.length;
    }

    if ('children' in node) {
        for (const child of node.children) {
            const subPoolSizes = getPoolSizes(child, uncapped);

            for (const id in subPoolSizes) {
                if (subPoolSizes[id] < 0) {
                    poolSizes[id] = -1;
                } else if (id in poolSizes) {
                    poolSizes[id] += subPoolSizes[id];
                } else {
                    poolSizes[id] = subPoolSizes[id];
                }
            }
        }
    }

    return poolSizes;
}

export function validatePoolSizeMatch(model: Root, candidate: Root): void {
    const modelSizes = getPoolSizes(model);
    const candidateSizes = getPoolSizes(candidate);

    for (const id in modelSizes) {
        if (modelSizes[id] !== candidateSizes[id])
            throw new PoolSizeError(Number.parseInt(id), candidateSizes[id], modelSizes[id]);
    }
}
