import {
	TOOLTIP_CLASS, TOOLTIP_CONTAINER_CLASS,
	TOOLTIP_BOTTOM_CLASS, TOOLTIP_TOP_CLASS, TOOLTIP_REVERSE_CLASS,
	TOOLTIP_ANIMATION, TOOLTIP_ANIMATION_FAST,
} from './consts';

import {isActive as forceAbove} from '../edit/option';

import type Child from '@nodes/child';

import {ELEMENT_CLASSES} from '@nodes/consts';

import {element as scrollElement} from '@/modal/body';

let activeParent;
let animation: Animation;

export function kill() {
	animation?.finish();
}

function isBelowCenter(element, yPosition = 0) {
	if (!element.isSameNode(scrollElement)) {
		if (element.classList.contains(ELEMENT_CLASSES.ELEMENT_CONTAINER)) {
			yPosition += element.offsetTop;
		}
		
		return isBelowCenter(element.parentElement, yPosition);
	}
	
	const scrollPosition = scrollElement.scrollTop + (scrollElement.clientHeight / 2);
	
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
	
	return element;
}

function getAnimated(parent?: HTMLElement) {
	if (!parent) {
		return activeParent.querySelector(`.${TOOLTIP_CLASS}`);
	}
	
	const element = generate(parent);
	
	parent.parentElement.style.setProperty('z-index', '2');
	
	animation = element.animate(...TOOLTIP_ANIMATION);
	
	animation.onfinish = ({target}) => {
		element.parentElement.remove();
		
		parent.parentElement.style.removeProperty('z-index');
		
		if (target === animation) {
			animation = undefined;
		}
	};
	
	return element;
}

export function fade() {
	const element = getAnimated();
	
	if (!element || element.matches(':empty')) {
		return;
	}
	
	kill();
	
	animation = element.animate(...TOOLTIP_ANIMATION_FAST);
	
	animation.onfinish = ({target}) => {
		if (target === animation) {
			animation = undefined;
		}
	};
}

export function show(message: string, parent?: HTMLElement) {
	const element = getAnimated(parent);
	const container = element.parentElement;
	
	if (forceAbove() || isBelowCenter(container)) {
		container.classList.remove(TOOLTIP_BOTTOM_CLASS);
		container.classList.add(TOOLTIP_TOP_CLASS);
	} else {
		container.classList.remove(TOOLTIP_TOP_CLASS);
		container.classList.add(TOOLTIP_BOTTOM_CLASS);
	}
	
	element.innerText = message;
}

export function showUnresolved(parent: HTMLElement) {
	show('Please wait for validation', parent);
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
