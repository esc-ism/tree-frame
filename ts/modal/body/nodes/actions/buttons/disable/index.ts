import {DISABLED_CLASS} from './consts';
import {BUTTON_DEFAULT as TEMPLATE_DEFAULT, BUTTON_ALT as TEMPLATE_ALT} from './button';

import {addActionButton} from '../button';
import {TEST_REMOVE_CLASS} from '../consts';

import callbacks from '../../callbacks';
import {showTooltip} from '../../overlays';

import type Child from '@nodes/child';

import {BUTTON_ACTIVE_CLASS} from '@/modal/consts';

function updateButton(button, isActive) {
	button.classList[isActive ? 'remove' : 'add'](BUTTON_ACTIVE_CLASS);
}

function toggle(node: Child) {
	node.element[`${node.isActive ? 'add' : 'remove'}Class`](DISABLED_CLASS);
	
	node.isActive = !node.isActive;
}

function onClick(node: Child, button: HTMLButtonElement, isAlt: boolean) {
	if (isAlt) {
		node.element.addClass(TEST_REMOVE_CLASS);
	} else {
		toggle(node);
	}
	
	Promise.all(callbacks.predicate.getSub(node.getAncestors()))
		.then(() => {
			const ancestors = node.getAncestors();
			
			if (isAlt) {
				// TODO set up a way to confirm (tooltip + yes/no buttons? require extra button click?)
				node.disconnect();
			} else {
				updateButton(button, node.isActive);
			}
			
			callbacks.update.triggerSub(ancestors);
		})
		.catch((reason) => {
			if (isAlt) {
				node.element.removeClass(TEST_REMOVE_CLASS);
			} else {
				toggle(node);
			}
			
			if (typeof reason === 'string') {
				showTooltip(reason, node, button.querySelector('circle'));
			}
		});
}

export function mount(node: Child): void {
	addActionButton(TEMPLATE_ALT, onClick, node);
	const defaultButton = addActionButton(TEMPLATE_DEFAULT, onClick, node);
	
	if (!node.isActive) {
		node.element.addClass(DISABLED_CLASS);
		
		updateButton(defaultButton, false);
	}
}

export function shouldMount(node: Child): boolean {
	return 'seed' in node.parent;
}
