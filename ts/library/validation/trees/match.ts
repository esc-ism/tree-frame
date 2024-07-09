import type {Child, Node, Parent, Root} from '../types';
import {SCHEMA_KEYS} from '../types';
import {
	TypeError, ValueError, PropertyError,
	PoolSizeError,
	JoinedError, SeedMatchError, DeactivatedError,
	FunctionMatchError,
} from '../errors';

function mutateMatch(
	model: Node, candidate: Node,
	validate: (
		modelBreadcrumbs: string[], model: Node,
		candidateBreadcrumbs: string[], candidate: Node,
	) => void,
	property: string,
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

// Tree validators

function validateChildMatch(
	modelBreadcrumbs: string[], model: Child,
	candidateBreadcrumbs: string[], candidate: Child,
	isUserTree: boolean = true,
): void {
	if (isUserTree) {
		if ('value' in model !== 'value' in candidate) {
			if ('value' in candidate)
				throw new PropertyError(candidateBreadcrumbs, 'value', false);
			
			candidate.value = model.value;
		} else if (typeof model.value !== typeof candidate.value) {
			throw new TypeError([...candidateBreadcrumbs, 'value'], typeof candidate.value, [typeof model.value]);
		}
		
		mutateMatch(model, candidate, validateValueMatch.bind(null, 'label'), 'label');
	} else {
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
	}
	
	if ('children' in model !== 'children' in candidate)
		throw new PropertyError(candidateBreadcrumbs, 'children', 'children' in model);
	
	if ('children' in model) {
		validateParentMatch(modelBreadcrumbs, model, candidateBreadcrumbs, candidate as Parent, isUserTree);
	}
}

export function validateParentMatch(
	modelBreadcrumbs: string[], model: Parent,
	candidateBreadcrumbs: string[], candidate: Parent,
	isUserTree: boolean = false,
): void {
	if (isUserTree) {
		for (const key of SCHEMA_KEYS) {
			if (key in model)
				candidate[key] = model[key];
		}
	} else {
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
	}
	
	if ('seed' in model) {
		if (!isUserTree)
			validateChildMatch(
				[...modelBreadcrumbs, 'seed'], model.seed,
				[...candidateBreadcrumbs, 'seed'], candidate.seed,
				true,
			);
		
		for (const [i, child] of candidate.children.entries()) {
			validateChildMatch(
				[...modelBreadcrumbs, 'seed'], model.seed,
				[...candidateBreadcrumbs, 'children', i.toString()], child,
				isUserTree,
			);
		}
	} else if (!('poolId' in model)) {
		if (model.children.length !== candidate.children.length)
			throw new ValueError([...candidateBreadcrumbs, 'children', 'length'], candidate.children.length, [model.children.length]);
		
		for (const [i, child] of candidate.children.entries()) {
			validateChildMatch(
				[...modelBreadcrumbs, 'children', i.toString()], model.children[i],
				[...candidateBreadcrumbs, 'children', i.toString()], child,
				isUserTree,
			);
		}
		
		if (model.children.length > candidate.children.length) {
			candidate.children.push(...model.children.slice(candidate.children.length));
		}
	}
}

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
