import Middle from './middle';
import Child from './child';
import NodeElement from './element';
import {ROOT_CLASS} from './consts';
import {onceVisualsUpdate} from './queue';

import * as highlight from './actions/highlight';
import * as focus from './actions/focus';
import * as create from './actions/buttons/create';

import {TEST_REMOVE_CLASS, TEST_ADD_CLASS} from './actions/buttons/consts';

import type {Root as _Root, Child as _Child, Getter} from '@types';
import {ROOT_PREDICATE_KEYS, ROOT_UPDATE_KEYS, ROOT_OTHER_KEYS} from '@types';

const actions = [highlight, focus, create];

function isActive(child: Child): boolean {
	return !('isActive' in child) || child.isActive;
}

function getChildPredicateData({children}: Root | Middle) {
	return children
		.filter((child) => isActive(child) && !child.element.hasClass(TEST_REMOVE_CLASS))
		.map((child) => child.getPredicateData());
}

function getChildSaveData({children}: Root | Middle, isActiveBranch: boolean = true) {
	return children
		.filter((child) => !child.element.hasClass(TEST_ADD_CLASS))
		.map((child) => child.getSaveData(isActive(child) && isActiveBranch));
}

function addChildren(children: _Child[]): void {
	for (const child of children) {
		if ('children' in child) {
			new Middle(child, this);
		} else {
			new Child(child, this);
		}
	}
}

export function setup({children, ...data}: _Root): void {
	for (const key of ROOT_PREDICATE_KEYS) {
		if (key in data) {
			this[key] = () => data[key](getChildPredicateData(this));
		}
	}
	
	for (const key of ROOT_UPDATE_KEYS) {
		if (key in data) {
			this[key] = () => onceVisualsUpdate(() => data[key](getChildPredicateData(this)));
		}
	}
	
	for (const key of ROOT_OTHER_KEYS) {
		if (key in data) {
			this[key] = data[key];
		}
	}
	
	addChildren.call(this, children);
}

export function getPredicateData(): _Root {
	return {children: getChildPredicateData(this)};
}

export function getSaveData(isActiveBranch) {
	const activeChildren = [];
	const children = [];
	const configs = [];
	
	for (const child of getChildSaveData(this, isActiveBranch)) {
		children.push(child.tree);
		
		if ('activeTree' in child) {
			activeChildren.push(child.activeTree);
			
			configs.push(...child.configs);
		}
	}
	
	return {tree: {children}, activeTree: {children: activeChildren}, configs};
}

export default class Root implements _Root {
	readonly children: Array<Middle | Child> = [];
	
	readonly seed?: _Child;
	readonly poolId?: number;
	readonly childPredicate?: () => Promise<void>;
	readonly descendantPredicate?: () => Promise<void>;
	readonly onChildUpdate?: () => void;
	readonly onDescendantUpdate?: () => void;
	readonly get?: Getter;
	
	readonly depth: number = 0;
	readonly element: NodeElement;
	
	readonly addChildren = addChildren;
	readonly getPredicateData = getPredicateData;
	
	constructor(data: _Root) {
		this.element = new NodeElement({});
		this.element.addClass(ROOT_CLASS);
		this.element.addDepthClass(0);
		
		setup.call(this, data);
		
		for (const {shouldMount, mount} of actions) {
			if (shouldMount(this)) {
				mount(this);
			}
		}
	}
	
	getRoot() {
		return this;
	}
	
	getAncestors() {
		return [];
	}
	
	updateDepthClass(classCount) {
		for (const child of this.children) {
			child.updateDepthClass(classCount);
		}
	}
	
	getSaveData() {
		const {tree, activeTree, configs} = getSaveData.call(this);
		
		if ('get' in this) {
			return {tree, activeTree, config: this.get(activeTree, configs)};
		}
		
		return {tree, activeTree, config: configs.length === 1 ? configs[0] : configs};
	}
}
