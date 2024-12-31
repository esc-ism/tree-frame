import {ACTION_ID} from './consts';
import TEMPLATE from './button';

import {TEST_ADD_CLASS} from '../consts';
import {addActionButton} from '../button';
import * as position from '../position';

import * as history from '../../history';
import callbacks from '../../callbacks';
import {showTooltip} from '../../overlays';

import Middle from '@nodes/middle';
import Child from '@nodes/child';
import type Root from '@nodes/root';

function getChild(node: Root | Middle): Child {
	const {seed} = node;
	const child = 'children' in seed ? new Middle(seed, node, 0) : new Child(seed, node, 0);
	
	child.element.addClass(TEST_ADD_CLASS);
	
	return child;
}

function doAction(source: Middle | Root, parent: Middle | Root, index: number, button: HTMLButtonElement) {
	const child = getChild(source);
	
	child.move(parent, index);
	
	return Promise.all(callbacks.predicate.getSub(child.getAncestors()))
		.then(() => {
			history.register(child, () => child.disconnect(), () => child.attach(parent, index), false, true);
			
			child.element.removeClass(TEST_ADD_CLASS);
			
			child.isActive = true;
			
			callbacks.update.triggerSub(child.getAncestors());
			
			return child;
		})
		.catch((reason) => {
			child.disconnect();
			
			if (reason) {
				showTooltip(reason, child, button.querySelector('circle'));
			}
		});
}

function onClick(node: Root | Middle, button: HTMLButtonElement, isAlt: boolean) {
	if (isAlt) {
		position.mount(node, node.seed, node, node.children, ACTION_ID, button, doAction, false);
	} else {
		position.reset(node);
		
		doAction(node, node, 0, button);
	}
}

export function mount(node: Root | Middle): void {
	addActionButton(TEMPLATE, onClick, node);
}

export function shouldMount(node: Root | Middle): boolean {
	return 'seed' in node;
}
