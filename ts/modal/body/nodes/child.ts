import type Root from './root';
import type Middle from './middle';
import NodeElement from './element';
import {onceVisualsUpdate} from './queue';

import * as highlight from './actions/highlight';
import * as edit from './actions/edit';
import * as focus from './actions/focus';
import * as hide from './actions/hide';

import * as disable from './actions/buttons/disable';
import * as move from './actions/buttons/move';
import * as duplicate from './actions/buttons/duplicate';

import type {Leaf, Child as _Child, Value, Input, Listeners, Getter, LeafArg as _LeafArg} from '@types';
import {SAVED_KEYS, LEAF_KEYS} from '@types';

const actions: Array<{
	shouldMount: (node: Child) => boolean;
	mount: (node: Child) => void;
	unmount?: (node: Child) => void;
}> = [
	// No button
	highlight,
	focus,
	edit,
	hide,
	// Button
	disable,
	move,
	duplicate,
];

export default class Child implements Leaf {
	isActive: boolean = true;
	
	value?: Value;
	readonly label?: string;
	readonly input?: Input;
	readonly options?: Array<Value>;
	readonly predicate?: () => unknown;
	readonly onUpdate?: () => unknown;
	readonly listeners?: Listeners;
	readonly get?: Getter;
	readonly hideId?: string;
	
	readonly forceValid: boolean;
	lastAcceptedValue?: Value;
	
	parent: Root | Middle;
	readonly depth: number;
	readonly element: NodeElement;
	
	constructor(data: _Child, parent: Root | Middle, index?: number) {
		this.depth = parent.depth + 1;
		this.element = new NodeElement(data);
		this.element.addDepthClass(this.depth);
		
		for (const key of LEAF_KEYS) {
			if (key in data) {
				this[key as any] = data[key];
			}
		}
		
		this.forceValid = !('predicate' in data) && !('options' in data);
		
		this.attach(parent, index);
		
		for (const {shouldMount, mount} of actions) {
			if (shouldMount(this)) {
				mount(this);
			}
		}
		
		if ('predicate' in data) {
			this.predicate = () => data.predicate(this.value);
		}
		
		if ('onUpdate' in data) {
			this.onUpdate = () => onceVisualsUpdate(() => data.onUpdate(this.value));
			
			this.onUpdate();
		}
	}
	
	getRoot() {
		return this.parent.getRoot();
	}
	
	getAncestors(): (Middle | Root)[] {
		return [this.parent, ...this.parent.getAncestors()];
	}
	
	getIndex() {
		return this.parent.children.indexOf(this);
	}
	
	getSiblings(): Array<Child> {
		const index = this.getIndex();
		const siblings = this.parent.children;
		
		return [...siblings.slice(0, index), ...siblings.slice(index + 1)];
	}
	
	updateGroup() {
		this.element.addDepthClass(this.depth);
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
		return new Child(this.getSeedData(), this.parent, this.getIndex() + 1);
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
	
	getSeedData(): _Child {
		const data: any = {};
		
		for (const key of LEAF_KEYS) {
			if (key in this) {
				data[key] = this[key];
			}
		}
		
		return data;
	}
	
	getPredicateData(): _LeafArg {
		const data: any = {};
		
		for (const key of SAVED_KEYS) {
			if (key in this) {
				data[key] = this[key];
			}
		}
		
		return data;
	}
	
	getSaveData(isActiveBranch: boolean) {
		const tree = this.getPredicateData();
		
		if (isActiveBranch) {
			return {
				tree,
				activeTree: tree,
				configs: 'get' in this ? [this.get(tree, [])] : [],
			};
		}
		
		return {tree};
	}
}
