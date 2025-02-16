import {ACTION_ID} from './consts';
import BUTTON from './button';

import {TEST_ADD_CLASS, TEST_REMOVE_CLASS} from '../consts';
import {addActionButton} from '../button';
import * as position from '../position';

import * as history from '../../history';
import callbacks from '../../callbacks';
import {showTooltip} from '../../overlays';

import {get as getPools} from '@nodes/pools';

import type Child from '@nodes/child';
import type Middle from '@nodes/middle';
import type Root from '@nodes/root';

function getAncestorBranches(node: Child, temp: Child) {
	if (node.parent === temp.parent) {
		return [node.getAncestors()];
	}
	
	const oldAncestors = node.getAncestors();
	const newAncestors = temp.getAncestors();
	
	for (let i = Math.min(oldAncestors.length, newAncestors.length) - 1; i > 1; --i) {
		if (oldAncestors[oldAncestors.length - i] === newAncestors[newAncestors.length - i]) {
			return [oldAncestors.slice(0, -i), newAncestors];
		}
	}
	
	// Branch is from the root
	return [oldAncestors.slice(0, -1), newAncestors];
}

function act(node, to, index, ancestorBranches) {
	node.move(to, index);
	
	for (const branch of ancestorBranches) {
		callbacks.update.triggerSub(branch);
	}
}

function doAction(source: Child, target: Root | Child, button: HTMLButtonElement, index: number) {
	const priorIndex = source.getIndex();
	
	if (index === priorIndex) {
		return source;
	}
	
	const temp = source.duplicate();
	
	source.element.addClass(TEST_REMOVE_CLASS);
	temp.element.addClass(TEST_ADD_CLASS);
	
	temp.move(index === 0 ? (target as Middle | Root) : (target as Child).parent, index);
	
	const ancestorBranches = getAncestorBranches(source, temp);
	
	return Promise.all(ancestorBranches.map((branch) => Promise.all(callbacks.predicate.getSub(branch))))
		.then(() => {
			const priorParent = source.parent;
			
			source.move(index === 0 ? (target as Middle | Root) : (target as Child).parent, index);
			
			history.register(source, act.bind(null, source, priorParent, priorIndex, ancestorBranches), act.bind(null, source, source.parent, index, ancestorBranches));
			
			for (const branch of ancestorBranches) {
				callbacks.update.triggerSub(branch);
			}
			
			return source;
		})
		.catch((reason) => {
			if (reason) {
				showTooltip(reason, source, button.querySelector('circle'));
			}
		})
		.finally(() => {
			temp.disconnect();
			
			source.element.removeClass(TEST_REMOVE_CLASS);
		});
}

function hasDestinations(node: Child) {
	return node.parent.children.length > 1 || getPools(node.parent).length > 1;
}

function onClick(node: Child, button: HTMLButtonElement, isAlt: boolean) {
	if (position.isToggle(node, ACTION_ID)) {
		position.reset(node);
		
		return;
	}
	
	if (isAlt) {
		if (hasDestinations(node)) {
			position.mount(node, node, node.parent, ACTION_ID, button, doAction);
		} else {
			showTooltip('No other valid locations found.', node, button.querySelector('circle'));
		}
		
		return;
	}
	
	const newIndex = node.getIndex() + 2;
	
	if (newIndex < node.parent.children.length + 1) {
		doAction(node, node, button, newIndex);
	} else {
		showTooltip('Node can not be moved down.', node, button.querySelector('circle'));
	}
}

export function mount(node: Child): void {
	addActionButton(BUTTON, onClick, node);
}

export function shouldMount(node: Child): boolean {
	return Boolean(node.parent.seed) || ('poolId' in node.parent);
}
