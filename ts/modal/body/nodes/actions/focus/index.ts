import {
	FOCUS_SOURCE_CLASS as SOURCE_CLASS, FOCUS_CLASS as BRANCH_CLASS,
	BACKGROUND_CLASS,
} from './consts';

import {kill as killTooltip} from '../overlays/tooltip';
import {isActive as positionIsActive} from '../buttons/position';
import {addSustained, removeSustained} from '../highlight';
import {stickyScroll as scroll} from '../scroll';

import type Root from '@nodes/root';
import type Child from '@nodes/child';

let candidateNode: Root | Child;
let activeNode: Root | Child;

export function isActive(): boolean {
	return Boolean(activeNode);
}

export function setTabIndexes(doAdd = true, node = activeNode) {
	const {'buttonContainer': {'children': buttons}, contrast: {valueElement}} = node.element;
	
	for (let i = buttons.length - 1; i >= 0; --i) {
		buttons[i].setAttribute('tabindex', doAdd ? '0' : '-1');
	}
	
	if (valueElement) {
		valueElement.setAttribute('tabindex', doAdd ? '0' : '-1');
	}
}

export function focus(doFocus: boolean = true, node = activeNode, doForce: boolean = true) {
	// Avoid unfocusing the active node if not forced
	if (doForce || node !== activeNode) {
		node.element[`${doFocus ? 'add' : 'remove'}Class`](SOURCE_CLASS);
	}
	
	if (!('children' in node)) {
		return;
	}
}

export function focusBranch(doFocus: boolean = true, node: Root | Child = activeNode, focusAncestors: boolean = true) {
	node.element[`${doFocus ? 'add' : 'remove'}Class`](BRANCH_CLASS);
	
	if (focusAncestors && 'parent' in node) {
		focusBranch(doFocus, node.parent);
	}
}

export function reset(doScroll = true) {
	if (!activeNode) {
		return;
	}
	
	focus(false);
	focusBranch(false);
	
	removeSustained(activeNode);
	
	setTabIndexes(false);
	
	if (doScroll) {
		scroll(activeNode);
	}
	
	activeNode = undefined;
}

export function doAction(node: Root | Child, doForce = false) {
	const toggleOn = node !== activeNode;
	
	killTooltip();
	
	if (positionIsActive() || (doForce && !toggleOn)) {
		return;
	}
	
	reset(!toggleOn);
	
	if (toggleOn) {
		activeNode = node;
		
		node.element.headContainer.focus();
		
		focus();
		focusBranch();
		
		node.element.scrollIntoView(false);
		
		addSustained(node);
		
		setTabIndexes();
	}
}

export function unmount(node) {
	if (node === activeNode) {
		reset();
	}
}

export function mount(node: Root | Child): void {
	const {elementContainer, headContainer, backgroundContainer} = node.element;
	
	backgroundContainer.append((() => {
		const background = document.createElement('div');
		
		background.classList.add(BACKGROUND_CLASS);
		
		return background;
	})());
	
	// Handle keyboard input
	
	elementContainer.addEventListener('keydown', (event) => {
		if (event.key === 'Enter') {
			event.stopPropagation();
			
			doAction(node);
		}
	});
	
	// Handle side click
	
	elementContainer.addEventListener('mousedown', (event) => {
		event.stopPropagation();
		
		candidateNode = node;
	});
	
	elementContainer.addEventListener('mouseup', (event) => {
		event.stopPropagation();
		
		if (node === candidateNode) {
			doAction(node);
		}
		
		candidateNode = undefined;
	});
	
	if ('value' in node) {
		headContainer.addEventListener('mousedown', (event) => {
			event.stopPropagation();
			
			candidateNode = undefined;
		});
		
		headContainer.addEventListener('mouseup', (event) => {
			event.stopPropagation();
			
			candidateNode = undefined;
		});
		
		return;
	}
	
	// Handle head click
	
	headContainer.addEventListener('mousedown', (event) => {
		event.stopPropagation();
		
		candidateNode = node;
	});
	
	headContainer.addEventListener('mouseup', (event) => {
		event.stopPropagation();
		
		if (node === candidateNode && headContainer.isSameNode(event.target as HTMLElement)) {
			doAction(node);
		}
		
		candidateNode = undefined;
	});
}

export function shouldMount(): boolean {
	return true;
}
