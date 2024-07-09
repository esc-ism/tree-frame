import {MIDDLE_CLASS} from './consts';

import type Root from './root';
import Child from './child';

import * as create from './actions/buttons/create';

import type {Middle as _Middle, Child as _Child, ParentCallback} from '@types';

const actions: Array<{
	shouldMount: (node: Middle) => boolean;
	mount: (node: Middle) => void;
	unmount?: (node: Middle) => void;
}> = [create];

export default class Middle extends Child implements _Middle {
	readonly children: Array<Middle | Child> = [];
	
	readonly seed?: _Child;
	readonly poolId?: number;
	readonly childPredicate?: ParentCallback;
	readonly descendantPredicate?: ParentCallback;
	readonly onChildUpdate?: ParentCallback;
	readonly onDescendantUpdate?: ParentCallback;
	
	constructor({children, ...data}: _Middle, parent: Root | Middle, index?: number) {
		super(data, parent, index);
		
		for (const [key, value] of Object.entries(data)) {
			this[key] = value;
		}
		
		for (const child of children) {
			if ('children' in child) {
				new Middle(child, this);
			} else {
				new Child(child, this);
			}
		}
		
		this.element.addClass(MIDDLE_CLASS);
		
		for (const {shouldMount, mount} of actions) {
			if (shouldMount(this)) {
				mount(this);
			}
		}
	}
	
	duplicate() {
		return new Middle(this.getJSON(), this.parent, this.getIndex() + 1);
	}
	
	unmount() {
		super.unmount();
		
		for (const action of actions) {
			if ('unmount' in action) {
				action.unmount(this);
			}
		}
	}
	
	disconnect() {
		this.unmount();
		
		for (const child of this.children) {
			child.disconnect();
		}
		
		this.detach();
	}
	
	updateDepthClass(classCount) {
		super.updateDepthClass(classCount);
		
		for (const child of this.children) {
			child.updateDepthClass(classCount);
		}
	}
	
	getJSON(): _Middle {
		return {
			...{children: this.children.map((child) => child.getJSON())},
			...super.getJSON(),
		};
	}
}
