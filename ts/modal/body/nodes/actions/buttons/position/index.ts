import {ACTION_ID} from './consts';
import {BUTTON_PARENT, BUTTON_SIBLING} from './button';

import {addActionButton} from '../button';

import {focus, focusBranch, reset as resetFocus} from '../../focus';
import {addSustained, removeSustained, setActive as highlight} from '../../highlight';
import {scroll} from '../../scroll';

import type Root from '@nodes/root';
import type Middle from '@nodes/middle';
import type Child from '@nodes/child';

import {setActive as setTreeActive} from '@/modal/body';

import {BUTTON_ACTIVE_CLASS} from '@/modal/consts';

import type {Child as _Child} from '@types';

interface Destination {
	node: Root | Child;
	isParent: boolean;
	button: HTMLButtonElement;
}

const destinations: Array<Destination> = [];

interface Origin {
	source: Child | Root;
	child: _Child;
	siblings: Child[];
	parent: Middle | Root;
	isPooled: boolean;
	actionId: string;
	button: HTMLButtonElement;
}

let origin: Origin;

export function isActive(): boolean {
	return Boolean(origin);
}

function setActive(doActivate: boolean = true) {
	setTreeActive(origin.button, ACTION_ID, doActivate);
	
	resetFocus();
	focus(doActivate, origin.source, false);
	focusBranch(doActivate, origin.source, doActivate);
	
	origin.button.setAttribute('tabindex', doActivate ? '0' : '-1');
}

export function reset(scrollTarget?: Child | Root) {
	if (!origin) {
		return;
	}
	
	for (const {node, isParent, button} of destinations) {
		focusBranch(false, node, isParent);
		
		button.remove();
	}
	
	destinations.length = 0;
	
	removeSustained(origin.source);
	
	setActive(false);
	
	scroll(scrollTarget ?? origin.source);
	
	highlight(scrollTarget ?? origin.source, true);
	
	origin = undefined;
}

export function getButton(node, actionId, onClick, isParent) {
	const button = addActionButton(
		isParent ? BUTTON_PARENT : BUTTON_SIBLING,
		onClick,
		node,
	);
	
	button.classList.add(actionId);
	button.classList.add(BUTTON_ACTIVE_CLASS);
	
	button.setAttribute('tabindex', '0');
	
	return button;
}

function getBoundCallback(callback, parent, index) {
	return async (_, button) => {
		const target = await callback(parent, index, button);
		
		if (target) {
			reset(target);
		}
	};
}

function addButtons(parent: Root | Middle, actionId: string, callback: Function, includeSelf: boolean) {
	const isCurrentParent = parent === origin.parent;
	
	if (isCurrentParent || (origin.isPooled && parent.poolId === origin.parent.poolId)) {
		destinations.push({
			node: parent,
			isParent: true,
			button: getButton(parent, actionId, getBoundCallback(callback, parent, 0), true),
		});
		
		focusBranch(true, parent);
		
		for (const target of (!includeSelf && isCurrentParent) ? origin.siblings : parent.children) {
			focusBranch(true, target, false);
			
			destinations.push({
				node: target,
				isParent: false,
				button: getButton(target, actionId, getBoundCallback(callback, target.parent, target.getIndex() + 1), false),
			});
		}
	}
	
	// Nodes can't be their own descendants
	if (!isCurrentParent) {
		for (const child of parent.children) {
			if ('children' in child) {
				addButtons(child, actionId, callback, includeSelf);
			}
		}
	}
}

export function hasDestinations(node: Child) {
	if (node.parent.children.length > 1) {
		return true;
	}
	
	if (!('poolId' in node.parent)) {
		return false;
	}
	
	const hasMatchingPool = (parent: Root | Middle, poolId: number) => {
		if (parent !== node.parent) {
			if (parent.poolId === poolId) {
				return true;
			}
			
			for (const child of parent.children) {
				if ('children' in child && hasMatchingPool(child, poolId)) {
					return true;
				}
			}
		}
		
		return false;
	};
	
	return hasMatchingPool(node.getRoot(), node.parent.poolId);
}

export function mount(source: Child | Root, child: _Child, parent: Root | Middle, siblings: Child[], actionId: string, button, callback: Function, includeSelf: boolean = true): number {
	reset();
	
	origin = {
		source,
		child,
		siblings,
		parent,
		isPooled: 'poolId' in parent,
		button,
		actionId,
	};
	
	setActive();
	
	addButtons(parent.getRoot(), actionId, callback.bind(null, source), includeSelf);
	
	addSustained(source);
	
	return destinations.length;
}

export function unmount(node: Child | Root) {
	if (origin && node === origin.source) {
		reset();
	}
}
