import {
	EDITABLE_CLASS, INVALID_CLASS, VALID_CLASS, ACTIVE_CLASS,
	VALID_BACKGROUND_CLASS, INVALID_BACKGROUND_CLASS,
} from './consts';

import * as option from './option';
import * as tooltip from '../tooltip';
import {addSustained, removeSustained} from '../highlight';

import type Child from '@nodes/child';
import type Middle from '@nodes/middle';
import type Root from '@nodes/root';

import {getPredicatePromise, isUnresolved} from '@/predicate';

import type {Value} from '@types';

let activeNode: Child;

export function isActive(): boolean {
	return Boolean(activeNode);
}

export function reset() {
	if (!activeNode) {
		return;
	}
	
	const {element} = activeNode;
	
	activeNode.value = activeNode.lastAcceptedValue;
	
	element.render(activeNode.value);
	
	element.removeClass(VALID_CLASS);
	element.removeClass(INVALID_CLASS);
	
	element.removeClass(ACTIVE_CLASS);
	
	tooltip.reset();
	option.reset();
	
	removeSustained(activeNode);
	
	activeNode = undefined;
}

function getValue(node: Child): Value {
	switch (typeof node.value) {
		case 'boolean':
			return Boolean(node.element.contrast.valueElement.checked);
		
		case 'number':
			return Number(node.element.contrast.valueElement.value);
		
		default:
			return node.element.contrast.valueElement.value;
	}
}

export function getSubPredicateResponses(ancestors: (Middle | Root)[] = activeNode.getAncestors()): Array<Promise<void>> {
	const responses = [];
	
	if ('childPredicate' in ancestors[0]) {
		responses.push(getPredicatePromise(ancestors[0].childPredicate()));
	}
	
	for (const ancestor of ancestors) {
		if ('descendantPredicate' in ancestor) {
			responses.push(getPredicatePromise(ancestor.descendantPredicate()));
		}
	}
	
	return responses;
}

function getAllPredicateResponses(): Array<Promise<void>> {
	if (activeNode.forceValid || ('options' in activeNode && activeNode.options.includes(activeNode.value))) {
		return getSubPredicateResponses();
	}
	
	if ('predicate' in activeNode) {
		return [getPredicatePromise(activeNode.predicate(activeNode.value)), ...getSubPredicateResponses()];
	}
	
	return [Promise.reject()];
}

export function triggerSubUpdateCallbacks(ancestors: (Middle | Root)[] = activeNode.getAncestors()) {
	if ('onChildUpdate' in ancestors[0]) {
		ancestors[0].onChildUpdate();
	}
	
	for (const ancestor of ancestors) {
		if ('onDescendantUpdate' in ancestor) {
			ancestor.onDescendantUpdate();
		}
	}
}

function triggerAllUpdateCallbacks() {
	if ('onUpdate' in activeNode) {
		activeNode.onUpdate(activeNode.value);
	}
	
	triggerSubUpdateCallbacks();
}

export async function update() {
	const value = getValue(activeNode);
	
	activeNode.value = value;
	
	if ('options' in activeNode) {
		option.update(activeNode.value);
	}
	
	activeNode.element.removeClass(INVALID_CLASS);
	activeNode.element.removeClass(VALID_CLASS);
	
	try {
		await Promise.all(getAllPredicateResponses());
	} catch (reason) {
		activeNode.element.addClass(INVALID_CLASS);
		
		if (reason) {
			tooltip.show(reason);
		}
		
		return;
	}
	
	if (isUnresolved()) {
		return;
	}
	
	activeNode.lastAcceptedValue = value;
	
	activeNode.element.addClass(VALID_CLASS);
	
	tooltip.hide();
	
	triggerAllUpdateCallbacks();
}

export function unmount(node: Child) {
	if (node === activeNode) {
		reset();
	}
}

export function doAction(node: Child) {
	if (activeNode === node || isUnresolved()) {
		tooltip.showUnresolved(node.element.contrast.container);
		
		node.element.headContainer.focus();
		
		return;
	}
	
	reset();
	
	tooltip.kill();
	
	activeNode = node;
	
	activeNode.element.addClass(ACTIVE_CLASS);
	activeNode.element.addClass(VALID_CLASS);
	
	tooltip.setNode(node);
	
	if ('options' in node) {
		option.setNode(node);
	}
	
	if (node.input === 'color') {
		node.element.contrast.valueElement.click();
	} else if (typeof node.value !== 'boolean') {
		const input = node.element.contrast.valueElement;
		
		input.select();
		
		input.scrollLeft = input.scrollWidth;
	}
	
	addSustained(node);
}

export function mount(node: Child): void {
	const {backgroundContainer, contrast: {valueElement, valueContainer}, headContainer} = node.element;
	
	node.lastAcceptedValue = node.value;
	
	node.element.addClass(EDITABLE_CLASS);
	
	backgroundContainer.append(...(() => {
		const valid = document.createElement('div');
		const invalid = document.createElement('div');
		
		valid.classList.add(VALID_BACKGROUND_CLASS);
		invalid.classList.add(INVALID_BACKGROUND_CLASS);
		
		return [valid, invalid];
	})());
	
	// Start
	
	valueElement.addEventListener('focus', (event) => {
		event.stopPropagation();
		
		if (event.relatedTarget) {
			doAction(node);
		}
	});
	
	valueElement.addEventListener('blur', (event) => {
		event.stopPropagation();
		
		if (isUnresolved()) {
			valueElement.focus();
			
			return;
		}
		
		reset();
	});
	
	headContainer.addEventListener('click', (event) => {
		event.stopPropagation();
		
		valueElement.focus();
	});
	
	// Process new value
	
	if ('listeners' in node) {
		for (const [event, callback] of Object.entries(node.listeners)) {
			valueElement.addEventListener(event, callback);
		}
	}
	
	if (typeof node.value === 'boolean') {
		headContainer.addEventListener('mousedown', (event) => {
			event.stopPropagation();
			event.preventDefault();
		});
		
		headContainer.addEventListener('click', () => {
			valueElement.checked = !valueElement.checked;
			
			update();
		});
		
		valueContainer.addEventListener('click', (event) => {
			event.stopPropagation();
		});
		
		valueElement.addEventListener('click', (event) => {
			event.stopPropagation();
			
			update();
		});
	} else {
		valueElement.addEventListener('input', (event) => {
			event.stopPropagation();
			
			update();
		});
	}
	
	if ('options' in node) {
		option.generate(node);
	}
	
	valueElement.addEventListener('keydown', (event) => {
		switch (event.key) {
			case 'Enter':
			case 'Escape':
				event.stopPropagation();
				
				if (isUnresolved()) {
					event.preventDefault();
				} else {
					headContainer.focus();
				}
		}
	});
}

export function shouldMount(node: Child): boolean {
	return 'value' in node;
}
