import type Root from './root';
import type Middle from './middle';
import NodeElement from './element';

import * as highlight from './actions/highlight';
import * as edit from './actions/edit';
import * as focus from './actions/focus';

import * as disable from './actions/buttons/disable';
import * as move from './actions/buttons/move';
import * as duplicate from './actions/buttons/duplicate';

import {getDepthClassCount} from '../style/update/depth';

import type {Leaf, Child as _Child, Value, Input, ChildCallback} from '@types';
import {SAVED_KEYS} from '@types';

const actions: Array<{
	shouldMount: (node: Child) => boolean;
	mount: (node: Child) => void;
	unmount?: (node: Child) => void;
}> = [
	// No button
	highlight,
	focus,
	edit,
	// Button
	disable,
	move,
	duplicate,
];

export default class Child implements Leaf {
	isActive: boolean;
	
	value?: Value;
	readonly label?: string;
	readonly input?: Input;
	readonly options?: Array<Value>;
	readonly predicate?: ChildCallback;
	readonly onUpdate?: ChildCallback;
	
	readonly forceValid: boolean;
	
	parent: Root | Middle;
	readonly depth: number;
	readonly element: NodeElement;
	
	constructor(data: _Child, parent: Root | Middle, index?: number) {
		this.depth = parent.depth + 1;
		this.element = new NodeElement(data);
		this.element.addDepthClass(this.depth % getDepthClassCount());
		
		for (const [key, value] of Object.entries({isActive: true, ...data})) {
			this[key] = value;
		}
		
		this.forceValid = !('predicate' in data) && !('options' in data);
		
		this.attach(parent, index);
		
		for (const {shouldMount, mount} of actions) {
			if (shouldMount(this)) {
				mount(this);
			}
		}
	}
	
	getRoot() {
		return this.parent.getRoot();
	}
	
	getIndex() {
		return this.parent.children.indexOf(this);
	}
	
	getSiblings(): Array<Child> {
		const index = this.getIndex();
		const siblings = this.parent.children;
		
		return [...siblings.slice(0, index), ...siblings.slice(index + 1)];
	}
	
	updateDepthClass(classCount) {
		this.element.addDepthClass(this.depth % classCount);
	}
	
	detach() {
		this.parent.children.splice(this.getIndex(), 1);
		
		this.element.remove();
		
		this.parent = undefined;
	}
	
	attach(parent: Middle | Root, index: number = parent.children.length) {
		parent.children.splice(index, 0, this);
		
		parent.element.addChild(this.element, index);
		
		this.parent = parent;
	}
	
	move(parent: Middle | Root, to: number | Child) {
		this.detach();
		
		this.attach(parent, typeof to === 'number' ? to : to.getIndex() + 1);
	}
	
	duplicate() {
		return new Child(this.getJSON(), this.parent, this.getIndex() + 1);
	}
	
	unmount() {
		for (const action of actions) {
			if ('unmount' in action) {
				action.unmount(this);
			}
		}
	}
	
	disconnect() {
		this.unmount();
		
		this.detach();
	}
	
	getJSON(): _Child {
		const data: any = {};
		
		for (const key of SAVED_KEYS) {
			if (key in this) {
				data[key] = this[key];
			}
		}
		
		return data;
	}
}
