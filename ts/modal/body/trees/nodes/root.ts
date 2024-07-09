import Middle from './middle';
import Child from './child';
import NodeElement from './element';
import {ROOT_CLASS} from './consts';

import * as highlight from './actions/highlight';
import * as focus from './actions/focus';
import * as create from './actions/buttons/create';

import type {Root as _Root, Child as _Child, ParentCallback} from '@types';

const actions = [highlight, focus, create];

export default class Root implements _Root {
	readonly children: Array<Middle | Child> = [];
	
	readonly seed?: _Child;
	readonly poolId?: number;
	readonly childPredicate?: ParentCallback;
	readonly descendantPredicate?: ParentCallback;
	readonly onChildUpdate?: ParentCallback;
	readonly onDescendantUpdate?: ParentCallback;
	
	readonly depth: number = 0;
	readonly element: NodeElement;
	
	constructor({children, ...data}: _Root) {
		this.element = new NodeElement({});
		this.element.addClass(ROOT_CLASS);
		this.element.addDepthClass(0);
		
		for (const [key, value] of Object.entries(data)) {
			this[key] = value;
		}
		
		this.addChildren(children);
		
		for (const {shouldMount, mount} of actions) {
			if (shouldMount(this)) {
				mount(this);
			}
		}
	}
	
	addChildren(children) {
		for (const child of children) {
			if ('children' in child) {
				new Middle(child, this);
			} else {
				new Child(child, this);
			}
		}
	}
	
	getRoot() {
		return this;
	}
	
	updateDepthClass(classCount) {
		for (const child of this.children) {
			child.updateDepthClass(classCount);
		}
	}
	
	getJSON(): _Root {
		return {children: this.children.map((child) => child.getJSON())};
	}
}
