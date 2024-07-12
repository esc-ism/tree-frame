import {MIDDLE_CLASS} from './consts';

import type Root from './root';
import {setup, getSaveJSON} from './root';
import Child from './child';

import * as create from './actions/buttons/create';

import type {Middle as _Middle, Child as _Child, MiddleArg as _MiddleArg} from '@types';
import {MIDDLE_KEYS as ALL_MIDDLE_KEYS} from '@types';

const MIDDLE_KEYS = ALL_MIDDLE_KEYS.filter((key) => key !== 'children');

const actions: Array<{
	shouldMount: (node: Middle) => boolean;
	mount: (node: Middle) => void;
	unmount?: (node: Middle) => void;
}> = [create];

export default class Middle extends Child implements _Middle {
	readonly children: Array<Middle | Child> = [];
	
	readonly seed?: _Child;
	readonly poolId?: number;
	
	readonly childPredicate?: () => Promise<void>;
	readonly descendantPredicate?: () => Promise<void>;
	readonly onChildUpdate?: () => void;
	readonly onDescendantUpdate?: () => void;
	
	constructor(data: _Middle, parent: Root | Middle, index?: number) {
		super(data, parent, index);
		
		setup.call(this, data);
		
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
		const data: any = {};
		
		for (const key of MIDDLE_KEYS) {
			if (key in this) {
				data[key] = this[key];
			}
		}
		
		return {
			...super.getJSON(),
			...data,
			children: this.children.map((child) => child.getJSON()),
		};
	}
	
	getSaveJSON(): _MiddleArg {
		return {
			...getSaveJSON.call(this),
			...super.getSaveJSON(),
		};
	}
}
