import {ACTION_ID} from './consts';
import {BUTTON_PARENT, BUTTON_SIBLING} from './button';

import {addActionButton} from '../button';

import {focus, focusBranch, reset as resetFocus} from '../../focus';
import {addSustained, removeSustained, setActive as highlight} from '../../highlight';
import {scroll} from '../../scroll';

import {get as getPools} from '@nodes/pools';

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
	parent: Middle | Root;
	actionId: string;
	button: HTMLButtonElement;
}

let origin: Origin;

export function isActive(): boolean {
	return Boolean(origin);
}

export function isToggle(source: Child | Root, id: string): boolean {
	return isActive() && origin.source === source && origin.actionId === id;
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
	
	button.classList.add(actionId, BUTTON_ACTIVE_CLASS);
	
	button.setAttribute('tabindex', '0');
	
	return button;
}

function getBoundCallback(callback, target, index) {
	return async (_, button) => {
		const node = await callback(origin.source, target, button, index);
		
		if (node) {
			reset(node);
		}
	};
}

function addButtons(parent: Root | Middle, actionId: string, callback: Function) {
	focusBranch(true, parent);
	
	destinations.push({
		node: parent,
		isParent: true,
		button: getButton(parent, actionId, getBoundCallback(callback, parent, 0), true),
	});
	
	for (const [i, target] of parent.children.entries()) {
		if (target === origin.source) {
			continue;
		}
		
		focusBranch(true, target, false);
		
		destinations.push({
			node: target,
			isParent: false,
			button: getButton(target, actionId, getBoundCallback(callback, target, i + 1), false),
		});
	}
}

export function mount(source: Child | Root, child: _Child, parent: Root | Middle, actionId: string, button, callback: Function): number {
	reset();
	
	origin = {
		source,
		child,
		parent,
		button,
		actionId,
	};
	
	setActive();
	
	addButtons(parent, actionId, callback);
	
	if ('poolId' in parent) {
		for (const pool of getPools(parent.poolId)) {
			addButtons(pool, actionId, callback);
		}
	}
	
	addSustained(source);
	
	return destinations.length;
}
