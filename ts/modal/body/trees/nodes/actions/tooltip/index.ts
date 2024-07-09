import {
	TOOLTIP_CLASS, TOOLTIP_CONTAINER_CLASS,
	TOOLTIP_BOTTOM_CLASS, TOOLTIP_TOP_CLASS, TOOLTIP_REVERSE_CLASS,
	TOOLTIP_ANIMATION,
} from './consts';

import {isActive as forceAbove} from '../edit/option';

import type Child from '@nodes/child';

import {ELEMENT_CLASSES} from '@nodes/consts';

import {TREE_CONTAINER} from '@/modal/body/trees';

let activeParent;
let animation: Animation;

export function kill() {
	if (animation) {
		animation.finish();
		
		animation = undefined;
	}
}

function isBelowCenter(element, yPosition = 0) {
	if (!element.isSameNode(TREE_CONTAINER)) {
		if (element.classList.contains(ELEMENT_CLASSES.ELEMENT_CONTAINER)) {
			yPosition += element.offsetTop;
		}
		
		return isBelowCenter(element.parentElement, yPosition);
	}
	
	const scrollPosition = TREE_CONTAINER.scrollTop + (TREE_CONTAINER.clientHeight / 2);
	
	return scrollPosition < yPosition;
}

function generate(parent: HTMLElement, doReverse: boolean = false) {
	const container = document.createElement('div');
	const element = document.createElement('div');
	
	container.classList.add(TOOLTIP_CONTAINER_CLASS);
	element.classList.add(TOOLTIP_CLASS);
	
	if (doReverse) {
		container.classList.add(TOOLTIP_REVERSE_CLASS);
	}
	
	container.appendChild(element);
	
	parent.insertBefore(container, parent.firstChild);
	
	return [container, element];
}

function getAnimated(parent?: HTMLElement) {
	if (!parent) {
		const element = activeParent.querySelector(`.${TOOLTIP_CLASS}`);
		
		return [element.parentElement, element];
	}
	
	const [container, element] = generate(parent);
	
	parent.parentElement.style.setProperty('z-index', '2');
	
	animation = element.animate(...TOOLTIP_ANIMATION);
	
	animation.onfinish = () => {
		container.remove();
		
		parent.parentElement.style.removeProperty('z-index');
	};
	
	return [container, element];
}

export function show(message: string, parent?: HTMLElement) {
	const [container, element] = getAnimated(parent);
	
	if (forceAbove() || isBelowCenter(container)) {
		container.classList.remove(TOOLTIP_BOTTOM_CLASS);
		container.classList.add(TOOLTIP_TOP_CLASS);
	} else {
		container.classList.remove(TOOLTIP_TOP_CLASS);
		container.classList.add(TOOLTIP_BOTTOM_CLASS);
	}
	
	element.innerText = message;
}

export function hide() {
	const element = activeParent.querySelector(`.${TOOLTIP_CLASS}`);
	
	if (element) {
		element.innerText = '';
	}
}

export function reset() {
	activeParent.querySelector(`.${TOOLTIP_CONTAINER_CLASS}`).remove();
	
	activeParent = undefined;
}

export function setNode(node: Child) {
	const {container, valueElement} = node.element.contrast;
	
	generate(container, valueElement.type === 'color');
	
	activeParent = container;
}
