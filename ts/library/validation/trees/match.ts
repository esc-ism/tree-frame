import type {Child, Node, Parent, Root} from '../types';
import {
	TypeError, ValueError, PropertyError,
	PoolSizeError,
	JoinedError, SeedMatchError, DeactivatedError,
	FunctionMatchError,
} from '../errors';

// Helpers

function validateOptionMatch(
	modelBreadcrumbs: string[], model: Child,
	candidateBreadcrumbs: string[], candidate: Child,
) {
	if ('options' in model !== 'options' in candidate)
		throw new PropertyError(candidateBreadcrumbs, 'options', 'options' in model);
	
	if ('options' in model) {
		if (model.options.length !== candidate.options.length)
			throw new ValueError([...candidateBreadcrumbs, 'options', 'length'], candidate.options.length, [model.options.length]);
		
		for (const [i, option] of model.options.entries()) {
			if (candidate.options[i] !== option)
				throw new ValueError([...candidateBreadcrumbs, 'options', i.toString()], candidate.options[i], [option]);
		}
	}
}

function validateValueMatch(
	property: string,
	modelBreadcrumbs: string[], model: Node,
	candidateBreadcrumbs: string[], candidate: Node,
) {
	if (property in model !== property in candidate)
		throw new PropertyError(candidateBreadcrumbs, property, property in model);
	
	if (model[property] !== candidate[property])
		throw new ValueError([...candidateBreadcrumbs, property], candidate[property], [model[property]]);
}

function assignKeys(from: Object, to: Object): void {
	for (const key of Object.keys(from)) {
		if (!(key in to)) {
			to[key] = from[key];
		}
	}
}

// Consistent userTree validators/enforcers

function matchUserTreeChild(
	modelBreadcrumbs: string[], model: Child,
	candidateBreadcrumbs: string[], candidate: Child,
) {
	if ('value' in model !== 'value' in candidate) {
		if ('value' in candidate)
			throw new PropertyError(candidateBreadcrumbs, 'value', false);
		
		candidate.value = model.value;
	} else if (typeof model.value !== typeof candidate.value) {
		throw new TypeError([...candidateBreadcrumbs, 'value'], typeof candidate.value, [typeof model.value]);
	}
	
	if ('label' in model) {
		candidate.label = model.label;
	} else {
		delete candidate.label;
	}
	
	if ('children' in model !== 'children' in candidate)
		throw new PropertyError(candidateBreadcrumbs, 'children', 'children' in model);
	
	if ('children' in model) {
		matchUserTreeParent(modelBreadcrumbs, model, candidateBreadcrumbs, candidate as Parent);
	} else {
		assignKeys(model, candidate);
	}
}

export function matchUserTreeParent(
	modelBreadcrumbs: string[], model: Parent,
	candidateBreadcrumbs: string[], candidate: Parent,
) {
	assignKeys(model, candidate);
	
	if ('seed' in model) {
		for (const [i, child] of candidate.children.entries()) {
			matchUserTreeChild(
				[...modelBreadcrumbs, 'seed'], model.seed,
				[...candidateBreadcrumbs, 'children', i.toString()], child,
			);
		}
		
		return;
	}
	
	if ('poolId' in model) {
		return;
	}
	
	if (model.children.length !== candidate.children.length)
		throw new ValueError([...candidateBreadcrumbs, 'children', 'length'], candidate.children.length, [model.children.length]);
	
	for (const [i, child] of candidate.children.entries()) {
		matchUserTreeChild(
			[...modelBreadcrumbs, 'children', i.toString()], model.children[i],
			[...candidateBreadcrumbs, 'children', i.toString()], child,
		);
	}
	
	// Done after validation to avoid validating certain matches
	if (model.children.length > candidate.children.length) {
		candidate.children.push(...model.children.slice(candidate.children.length));
	}
}

// defaultTree internal consistency validators

function validateChildMatch(
	modelBreadcrumbs: string[], model: Child,
	candidateBreadcrumbs: string[], candidate: Child,
): void {
	if ('value' in model !== 'value' in candidate)
		throw new PropertyError(candidateBreadcrumbs, 'value', 'value' in model);
	
	if (typeof model.value !== typeof candidate.value)
		throw new TypeError([...candidateBreadcrumbs, 'value'], typeof candidate.value, [typeof model.value]);
	
	validateValueMatch('label', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
	validateValueMatch('input', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
	validateOptionMatch(modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
	
	try {
		validateValueMatch('predicate', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
		validateValueMatch('onUpdate', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
	} catch (error) {
		throw new JoinedError(
			new FunctionMatchError(),
			error,
		);
	}
	
	if ('children' in model !== 'children' in candidate)
		throw new PropertyError(candidateBreadcrumbs, 'children', 'children' in model);
	
	if ('children' in model) {
		validateParentMatch(modelBreadcrumbs, model, candidateBreadcrumbs, candidate as Parent);
	}
}

function validateParentMatch(
	modelBreadcrumbs: string[], model: Parent,
	candidateBreadcrumbs: string[], candidate: Parent,
): void {
	validateValueMatch('poolId', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
	
	try {
		validateValueMatch('childPredicate', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
		validateValueMatch('onChildUpdate', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
		
		validateValueMatch('descendantPredicate', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
		validateValueMatch('onDescendantUpdate', modelBreadcrumbs, model, candidateBreadcrumbs, candidate);
	} catch (error) {
		throw new JoinedError(
			new FunctionMatchError(),
			error,
		);
	}
	
	if ('seed' in model) {
		validateChildMatch(
			[...modelBreadcrumbs, 'seed'], model.seed,
			[...candidateBreadcrumbs, 'seed'], candidate.seed,
		);
		
		for (const [i, child] of candidate.children.entries()) {
			validateChildMatch(
				[...modelBreadcrumbs, 'seed'], model.seed,
				[...candidateBreadcrumbs, 'children', i.toString()], child,
			);
		}
	} else if (!('poolId' in model)) {
		if (model.children.length !== candidate.children.length)
			throw new ValueError([...candidateBreadcrumbs, 'children', 'length'], candidate.children.length, [model.children.length]);
		
		for (const [i, child] of candidate.children.entries()) {
			validateChildMatch(
				[...modelBreadcrumbs, 'children', i.toString()], model.children[i],
				[...candidateBreadcrumbs, 'children', i.toString()], child,
			);
		}
		
		if (model.children.length > candidate.children.length) {
			candidate.children.push(...model.children.slice(candidate.children.length));
		}
	}
}

// Other validators

export function validateSeeds(breadcrumbs: string[], node: Node): void {
	if ('children' in node) {
		if ('seed' in node) {
			try {
				for (const [i, child] of node.children.entries()) {
					validateChildMatch(
						[...breadcrumbs, 'seed'], node.seed,
						[...breadcrumbs, 'children', i.toString()], child,
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
						new ValueError([...breadcrumbs, 'children', i.toString(), 'isActive'], false, [true]),
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
