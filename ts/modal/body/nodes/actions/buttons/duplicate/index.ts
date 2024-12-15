import {ACTION_ID} from './consts';
import TEMPLATE from './button';

import {TEST_ADD_CLASS} from '../consts';
import {addActionButton} from '../button';
import * as position from '../position';

import {scroll} from '../../scroll';
import callbacks from '../../callbacks';
import {showTooltip} from '../../overlays';

import type Child from '@nodes/child';

let activeNode: Child;

export function reset() {
	if (!activeNode) {
		return;
	}
	
	position.reset();
	
	activeNode = undefined;
}

function validate(copy: Child, button: HTMLButtonElement, node: Child, doScroll: boolean = true) {
	Promise.all(callbacks.predicate.getSub(copy.getAncestors()))
		.then(() => {
			copy.element.removeClass(TEST_ADD_CLASS);
			
			reset();
			
			if (doScroll) {
				// Show the new node
				scroll(copy);
			}
			
			callbacks.update.triggerSub(copy.getAncestors());
		})
		.catch((reason) => {
			copy.disconnect();
			
			if (reason) {
				showTooltip(reason, node, button.querySelector('circle'));
			}
		});
}

function getCopy(node: Child): Child {
	const copy = node.duplicate();
	
	copy.element.addClass(TEST_ADD_CLASS);
	
	return copy;
}

function doAction(node: Child, parent, index: number, button: HTMLButtonElement) {
	const copy = getCopy(node);
	
	copy.move(parent, index);
	
	validate(copy, button, node);
}

function onClick(node: Child, button: HTMLButtonElement, isAlt: boolean) {
	const previousNode = activeNode;
	
	reset();
	
	if (!isAlt) {
		validate(getCopy(node), button, node, false);
	} else if (!previousNode || node !== previousNode) {
		activeNode = node;
		
		position.mount(node, node, node.parent, node.getSiblings(), ACTION_ID, button, doAction);
	}
}

export function mount(node: Child): void {
	addActionButton(TEMPLATE, onClick, node);
}

export function shouldMount(node: Child): boolean {
	return 'seed' in node.parent;
}
