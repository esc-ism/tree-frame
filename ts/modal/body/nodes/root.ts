import Middle from './middle';
import Child from './child';
import NodeElement from './element';
import {ROOT_CLASS} from './consts';
import {onceVisualsUpdate} from './queue';

import * as highlight from './actions/highlight';
import * as focus from './actions/focus';
import * as create from './actions/buttons/create';

import type {Root as _Root, Child as _Child} from '@types';
import {ROOT_PREDICATE_KEYS, ROOT_UPDATE_KEYS, ROOT_OTHER_KEYS} from '@types';

const actions = [highlight, focus, create];

function getChildJson({children}: Root | Middle) {
	return children.map((child) => child.getJSON());
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
			this[key] = () => data[key](getChildJson(this));
		}
	}
	
	for (const key of ROOT_UPDATE_KEYS) {
		if (key in data) {
			this[key] = () => onceVisualsUpdate(() => data[key](getChildJson(this)));
		}
	}
	
	for (const key of ROOT_OTHER_KEYS) {
		if (key in data) {
			this[key] = data[key];
		}
	}
	
	addChildren.call(this, children);
}

export function getJSON(): _Root {
	return {children: getChildJson(this)};
}

export default class Root implements _Root {
	readonly children: Array<Middle | Child> = [];
	
	readonly seed?: _Child;
	readonly poolId?: number;
	readonly childPredicate?: () => Promise<void>;
	readonly descendantPredicate?: () => Promise<void>;
	readonly onChildUpdate?: () => void;
	readonly onDescendantUpdate?: () => void;
	
	readonly depth: number = 0;
	readonly element: NodeElement;
	
	readonly addChildren = addChildren.bind(this);
	readonly getJSON = getJSON.bind(this);
	
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
}
