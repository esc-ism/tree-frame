import {HIGHLIGHT_CLASS, EAVE_ID, HIGHLIGHT_BACKGROUND_CLASS} from './consts';

import {isActive as editIsActive} from '../edit';

import type Root from '@nodes/root';
import type Child from '@nodes/child';

import {element as scrollElement} from '@/modal/body';

import {isActive as isSticky} from '@/modal/header/actions/sticky';

import {getSocket} from '@/modal';
import {ELEMENT_CLASSES} from '../../consts';

let sustainedNodes = [];
let activeNode: Root | Child;

export function isActive(): boolean {
	return Boolean(activeNode);
}

export function removeSustained(node: Root | Child) {
	sustainedNodes.splice(sustainedNodes.indexOf(node), 1);
	
	// Avoid unhighlighting if it's still sustained by another action
	if (node !== activeNode && !sustainedNodes.includes(node)) {
		node.element.removeClass(HIGHLIGHT_CLASS);
	}
}

export function addSustained(node: Root | Child) {
	node.element.addClass(HIGHLIGHT_CLASS);
	
	sustainedNodes.push(node);
}

function setActive(node?: Root | Child, doFocus: boolean = false) {
	if (activeNode && !sustainedNodes.includes(activeNode)) {
		activeNode.element.removeClass(HIGHLIGHT_CLASS);
	}
	
	activeNode = node;
	
	if (node) {
		node.element.addClass(HIGHLIGHT_CLASS);
		
		if (doFocus) {
			node.element.headContainer.focus();
		}
	}
}

// a scrollIntoView replacement for sticky positioning
export function scroll(node: Root | Child, alignToTop: boolean = true) {
	let scroll = 0;
	let child;
	
	for (child = node; 'parent' in child; child = (child as Child).parent) {
		const index = child.getIndex();
		
		if (index === 0) {
			continue;
		}
		
		const {top: base} = child.parent.element.elementContainer.getBoundingClientRect();
		const {top} = child.element.elementContainer.getBoundingClientRect();
		const {height} = child.element.headContainer.getBoundingClientRect();
		
		scroll += top - base - height;
	}
	
	if (alignToTop) {
		scrollElement.scrollTop = scroll;
	}
	
	if (scrollElement.scrollTop > scroll) {
		scrollElement.scrollTop = scroll;
	}
}

let isTab = false;

export function mount(node: Root | Child) {
	const {backgroundContainer, headContainer, elementContainer, infoContainer, base} = node.element;
	
	if (base.valueContainer) {
		(new ResizeObserver(() => {
			base.valueContainer.style.setProperty('width', `${infoContainer.clientWidth}px`);
		})).observe(infoContainer);
	}
	
	backgroundContainer.appendChild((() => {
		const background = document.createElement('div');
		
		background.classList.add(HIGHLIGHT_BACKGROUND_CLASS);
		
		return background;
	})());
	
	headContainer.setAttribute('tabindex', '0');
	
	headContainer.addEventListener('focusin', (event) => {
		event.stopPropagation();
		
		if (isSticky()) {
			scroll(node, isTab);
		}
		
		isTab = false;
		
		// Filters out events fired from re-focusing the window
		if (event.relatedTarget) {
			setActive(node);
		}
	});
	
	headContainer.addEventListener('mouseenter', (event) => {
		event.stopPropagation();
		
		setActive(node, !editIsActive());
	});
	
	elementContainer.addEventListener('mouseenter', (event) => {
		event.stopPropagation();
		
		setActive(node);
	});
	
	elementContainer.addEventListener('mouseleave', (event) => {
		event.stopPropagation();
		
		if ('parent' in node) {
			setActive(node.parent);
		} else {
			setActive();
		}
	});
}

export function shouldMount(): boolean {
	return true;
}

// Prevents zipping to the end of the tree when mousing over the bottom pixel
export function generateEave(): HTMLElement {
	const element = document.createElement('div');
	
	element.id = EAVE_ID;
	
	element.setAttribute('tabindex', '0');
	
	// Prevent tabbing away from the modal
	element.addEventListener('keydown', (event) => {
		if (event.key === 'Tab' && !event.shiftKey && element.isSameNode(event.target as HTMLElement)) {
			event.preventDefault();
		}
	});
	
	return element;
}

// Blur focused node & reset focus index
export function reset() {
	setActive();
	
	getSocket().focus();
}

export function onMount() {
	const socket = getSocket();
	
	socket.setAttribute('tabindex', '0');
	
	// Prevent tabbing away from the modal
	socket.addEventListener('keydown', (event) => {
		if (event.key !== 'Tab') {
			return;
		}
		
		isTab = (event.target as HTMLElement).classList.contains(ELEMENT_CLASSES.HEAD_CONTAINER);
		
		if (event.shiftKey && socket.isSameNode(event.target as HTMLElement)) {
			event.preventDefault();
		}
	});
	
	socket.addEventListener('focusin', () => {
		setActive();
	});
}
