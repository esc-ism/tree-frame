import {ACTION_ID} from './consts';
import TEMPLATE from './button';

import {TEST_ADD_CLASS} from '../consts';
import {addActionButton} from '../button';
import * as position from '../position';

import * as history from '../../history';
import callbacks from '../../callbacks';
import {showTooltip} from '../../overlays';

import Child from '@nodes/child';
import Middle from '@nodes/middle';
import type Root from '@nodes/root';

function getChild(node: Root | Middle): Child {
	const {seed} = node;
	const child = 'children' in seed ? new Middle(seed, node, 0) : new Child(seed, node, 0);
	
	child.element.addClass(TEST_ADD_CLASS);
	
	return child;
}

function validate(child: Middle | Child, target: Root | Child, button: HTMLButtonElement, index: number) {
	return Promise.all(callbacks.predicate.getSub(child.getAncestors()))
		.then(() => {
			history.register(child, child.disconnect.bind(child), child.attach.bind(child, child.parent, index), false, true);
			
			child.element.removeClass(TEST_ADD_CLASS);
			
			child.isActive = true;
			
			callbacks.update.triggerSub(child.getAncestors());
			
			return child;
		})
		.catch((reason) => {
			child.disconnect();
			
			if (reason) {
				showTooltip(reason, target, button.querySelector('circle'));
			}
		});
}

function doAction(source: Middle | Root, target: Root | Child, button: HTMLButtonElement, index: number) {
	const child = getChild(source);
	
	child.move(index === 0 ? (target as Middle | Root) : (target as Child).parent, index);
	
	return validate(child, target, button, index);
}

function onClick(node: Root | Middle, button: HTMLButtonElement, isAlt: boolean) {
	if (position.isToggle(node, ACTION_ID)) {
		position.reset(node);
		
		return;
	}
	
	if (isAlt) {
		position.mount(node, node.seed, node, ACTION_ID, button, doAction);
		
		return;
	}
	
	validate(getChild(node), node, button, 0);
}

export function mount(node: Root | Middle): void {
	addActionButton(TEMPLATE, onClick, node);
}

export function shouldMount(node: Root | Middle): boolean {
	return 'seed' in node;
}
