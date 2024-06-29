import {HIGHLIGHT_CLASS, EAVE_ID, HIGHLIGHT_BACKGROUND_CLASS} from './consts';

import {isActive as editIsActive} from '../edit';
import {isActive as focusIsActive} from '../focus';
import {isActive as positionIsActive} from '../buttons/position';

import Root from '@nodes/root';
import Child from '@nodes/child';

let sustainedNodes = [];
let activeNode: Root | Child;

export function focusHovered() {
	if (activeNode) {
		activeNode.element.headContainer.focus();
	}
}

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

export function mount(node: Root | Child) {
	const {backgroundContainer, headContainer, elementContainer} = node.element;
	
	backgroundContainer.appendChild((() => {
		const background = document.createElement('div');
		
		background.classList.add(HIGHLIGHT_BACKGROUND_CLASS);
		
		return background;
	})());
	
	headContainer.setAttribute('tabIndex', '1');
	
	headContainer.addEventListener('focusin', (event) => {
		event.stopPropagation();
		
		setActive(node);
	});
	
	headContainer.addEventListener('mouseenter', (event) => {
		event.stopPropagation();
		
		setActive(node, !(editIsActive() || focusIsActive() || positionIsActive()));
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
	
	element.setAttribute('tabIndex', '3');
	
	// Prevent tabbing away from the modal
	element.addEventListener('keydown', (event) => {
		if (event.key === 'Tab' && !event.shiftKey && element.isSameNode(event.target as HTMLElement)) {
			event.preventDefault();
		}
	});
	
	return element;
}

let socket: HTMLElement;

// Blur focused node & reset focus index
export function reset() {
	setActive();
	
	socket.focus();
}

export function onMount(_socket) {
	socket = _socket;
	
	socket.setAttribute('tabIndex', '1');
	
	// Prevent tabbing away from the modal
	socket.addEventListener('keydown', (event) => {
		if (event.key === 'Tab' && event.shiftKey && socket.isSameNode(event.target as HTMLElement)) {
			event.preventDefault();
		}
	});
	
	socket.addEventListener('focusin', () => {
		setActive();
	});
}
