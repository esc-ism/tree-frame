import {ACTION_ID} from './consts';
import TEMPLATE from './button';

import {TEST_ADD_CLASS} from '../consts';
import {addActionButton} from '../button';
import * as position from '../position';

import {scroll} from '../../scroll';
import callbacks from '../../callbacks';
import {show as showTooltip} from '../../tooltip';

import Middle from '@nodes/middle';
import Child from '@nodes/child';
import type Root from '@nodes/root';

function reset() {
	position.reset();
}

function getChild(node: Root | Middle): Child {
	const {seed} = node;
	const child = 'children' in seed ? new Middle(seed, node, 0) : new Child(seed, node, 0);
	
	child.element.addClass(TEST_ADD_CLASS);
	
	return child;
}

function doAction(source: Middle | Root, parent: Middle | Root, index: number, button: HTMLButtonElement, doScroll: boolean = true) {
	const child = getChild(source);
	
	child.move(parent, index);
	
	Promise.all(callbacks.predicate.getSub(child.getAncestors()))
		.then(() => {
			child.element.removeClass(TEST_ADD_CLASS);
			
			child.isActive = true;
			
			reset();
			
			if (doScroll) {
				// Show the new node
				scroll(child);
			}
			
			callbacks.update.triggerSub(child.getAncestors());
		})
		.catch((reason) => {
			child.disconnect();
			
			if (reason) {
				showTooltip(reason, button);
			}
		});
}

function onClick(node: Root | Middle, button: HTMLButtonElement, isAlt: boolean) {
	reset();
	
	if (!isAlt) {
		doAction(node, node, 0, button, false);
	} else {
		position.mount(node, node.seed, node, node.children, ACTION_ID, button, doAction, false);
	}
}

export function mount(node: Root | Middle): void {
	addActionButton(TEMPLATE, onClick, node);
}

export function shouldMount(node: Root | Middle): boolean {
	return 'seed' in node;
}
