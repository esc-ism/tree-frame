import {ACTION_ID} from './consts';
import BUTTON from './button';

import {TEST_ADD_CLASS, TEST_REMOVE_CLASS} from '../consts';
import {addActionButton} from '../button';
import * as position from '../position';

import {scroll} from '../../scroll';
import callbacks from '../../callbacks';
import {showTooltip} from '../../overlays';

import type Child from '@nodes/child';

let activeNode: Child;

export function reset() {
	position.reset();
	
	activeNode = undefined;
}

function getAncestorBranches(node: Child, copy: Child) {
	if (node.parent === copy.parent) {
		return [node.getAncestors()];
	}
	
	const oldAncestors = node.getAncestors();
	const newAncestors = copy.getAncestors();
	
	for (let i = Math.min(oldAncestors.length, newAncestors.length) - 1; i > 1; --i) {
		if (oldAncestors[oldAncestors.length - i] === newAncestors[newAncestors.length - i]) {
			return [oldAncestors.slice(0, -i), newAncestors];
		}
	}
	
	// Branch is from the root
	return [oldAncestors.slice(0, -1), newAncestors];
}

function doAction(node: Child, newParent, index, button, doScroll: boolean = true) {
	const copy = node.duplicate();
	
	node.element.addClass(TEST_REMOVE_CLASS);
	copy.element.addClass(TEST_ADD_CLASS);
	
	copy.move(newParent, index);
	
	const ancestorBranches = getAncestorBranches(node, copy);
	
	Promise.all(ancestorBranches.map((branch) => Promise.all(callbacks.predicate.getSub(branch))))
		.then(() => {
			copy.element.removeClass(TEST_ADD_CLASS);
			
			node.disconnect();
			
			reset();
			
			if (doScroll) {
				// Show where the node's been moved to
				scroll(copy);
			}
			
			for (const branch of ancestorBranches) {
				callbacks.update.triggerSub(branch);
			}
		})
		.catch((reason) => {
			node.element.removeClass(TEST_REMOVE_CLASS);
			
			node.isActive = copy.isActive;
			
			copy.disconnect();
			
			if (reason) {
				showTooltip(reason, node, button.querySelector('circle'));
			}
		});
}

function onClick(node: Child, button: HTMLButtonElement, isAlt: boolean) {
	if (activeNode === node) {
		reset();
		
		return;
	}
	
	reset();
	
	if (isAlt) {
		// If the only valid target is the current parent
		if (position.hasDestinations(node)) {
			activeNode = node;
			
			position.mount(node, node, node.parent, node.getSiblings(), ACTION_ID, button, doAction, false);
		} else {
			showTooltip('No other valid locations found.', node, button.querySelector('circle'));
		}
	} else {
		const newIndex = node.getIndex() + 2;
		
		if (newIndex < node.parent.children.length + 1) {
			doAction(node, node.parent, newIndex, button, false);
		} else {
			showTooltip('Node can not be moved down.', node, button.querySelector('circle'));
		}
	}
}

export function unmount(node) {
	if (activeNode && node === activeNode) {
		reset();
	}
}

export function mount(node: Child): void {
	addActionButton(BUTTON, onClick, node);
}

export function shouldMount(node: Child): boolean {
	return Boolean(node.parent.seed) || ('poolId' in node.parent);
}
