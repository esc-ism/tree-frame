import {ACTION_ID} from './consts';
import TEMPLATE from './button';

import {TEST_ADD_CLASS} from '../consts';
import {addActionButton} from '../button';
import * as position from '../position';

import * as history from '../../history';
import callbacks from '../../callbacks';
import {showTooltip} from '../../overlays';

import type Child from '@nodes/child';
import type Middle from '@nodes/middle';

function validate(copy: Child, target: Child, button: HTMLButtonElement, index: number) {
	return Promise.all(callbacks.predicate.getSub(copy.getAncestors()))
		.then(() => {
			history.register(copy, () => copy.disconnect(), () => copy.attach.bind(copy, index), false, true);
			
			copy.element.removeClass(TEST_ADD_CLASS);
			
			callbacks.update.triggerSub(copy.getAncestors());
			
			return copy;
		})
		.catch((reason) => {
			copy.disconnect();
			
			if (reason) {
				showTooltip(reason, target, button.querySelector('circle'));
			}
		});
}

function getCopy(node: Child): Child {
	const copy = node.duplicate();
	
	copy.element.addClass(TEST_ADD_CLASS);
	
	return copy;
}

function doAction(source: Child, target: Child, button: HTMLButtonElement, index: number) {
	const copy = getCopy(source);
	
	copy.move(index === 0 ? target as Middle : target.parent, index);
	
	return validate(copy, target, button, index);
}

function onClick(node: Child, button: HTMLButtonElement, isAlt: boolean) {
	if (position.isToggle(node, ACTION_ID)) {
		position.reset(node);
		
		return;
	}
	
	if (isAlt) {
		position.mount(node, node, node.parent, ACTION_ID, button, doAction);
		
		return;
	}
	
	const copy = getCopy(node);
	
	validate(copy, node, button, copy.getIndex());
}

export function mount(node: Child): void {
	addActionButton(TEMPLATE, onClick, node);
}

export function shouldMount(node: Child): boolean {
	return 'seed' in node.parent;
}
