import {ACTION_ID} from './consts';
import TEMPLATE from './button';

import {TEST_ADD_CLASS} from '../consts';
import {addActionButton} from '../button';
import * as position from '../position';

import * as history from '../../history';
import callbacks from '../../callbacks';
import {showTooltip} from '../../overlays';

import type Child from '@nodes/child';

function validate(copy: Child, button: HTMLButtonElement, node: Child) {
	return Promise.all(callbacks.predicate.getSub(copy.getAncestors()))
		.then(() => {
			history.register(copy, () => copy.disconnect(), () => copy.attach.bind(copy, copy.getIndex()), false, true);
			
			copy.element.removeClass(TEST_ADD_CLASS);
			
			callbacks.update.triggerSub(copy.getAncestors());
			
			return copy;
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
	if (isAlt) {
		position.mount(node, node, node.parent, node.getSiblings(), ACTION_ID, button, doAction);
	} else {
		position.reset(node);
		
		validate(getCopy(node), button, node);
	}
}

export function mount(node: Child): void {
	addActionButton(TEMPLATE, onClick, node);
}

export function shouldMount(node: Child): boolean {
	return 'seed' in node.parent;
}
