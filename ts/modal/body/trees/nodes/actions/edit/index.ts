import {
	EDITABLE_CLASS, INVALID_CLASS, VALID_CLASS,
	VALID_BACKGROUND_CLASS, INVALID_BACKGROUND_CLASS,
	ACTIVE_CLASS,
} from './consts';

import * as option from './option';
import * as tooltip from '../tooltip';
import {focusHovered, addSustained, removeSustained} from '../highlight';

import type Child from '@nodes/child';
import type Middle from '@nodes/middle';
import type Root from '@nodes/root';

import {getPredicatePromise} from '@/predicate';

import type {SubPredicate, Value} from '@types';

let activeNode: Child;

export function isActive(): boolean {
	return Boolean(activeNode);
}

export function reset() {
	if (!activeNode) {
		return;
	}
	
	activeNode.element.render(activeNode.value);
	
	activeNode.element.removeClass(VALID_CLASS);
	activeNode.element.removeClass(INVALID_CLASS);
	
	activeNode.element.valueElement.blur();
	
	activeNode.element.valueContainer.classList.remove(ACTIVE_CLASS);
	
	tooltip.reset();
	option.reset();
	
	removeSustained(activeNode);
	
	activeNode = undefined;
}

function getValue(node: Child): Value {
	switch (typeof node.value) {
		case 'boolean':
			return Boolean(node.element.valueElement.checked);
		
		case 'number':
			return Number(node.element.valueElement.value);
		
		default:
			return node.element.valueElement.value;
	}
}

function getSubPredicateResponse(predicate: SubPredicate, children: Array<Child>): Promise<void> {
	return getPredicatePromise(predicate(children.map((child) => child.getJSON())));
}

function getDescendantPredicateResponses(node: Root | Middle): Array<Promise<void>> {
	const responses = [];
	if ('descendantPredicate' in node) {
		responses.push(getSubPredicateResponse(node.descendantPredicate, node.children));
	}
	
	if ('parent' in node) {
		responses.push(...getDescendantPredicateResponses(node.parent));
	}
	
	return responses;
}

function getChildPredicateResponse(node: Root | Middle): Promise<void> {
	if ('childPredicate' in node) {
		return getSubPredicateResponse(node.childPredicate, node.children);
	}
	
	return Promise.resolve(null);
}

export function getSubPredicateResponses(parent: Root | Middle): Array<Promise<void>> {
	return [getChildPredicateResponse(parent), ...getDescendantPredicateResponses(parent)];
}

function getOwnPredicateResponse(node: Child): Promise<void> {
	if (!('predicate' in node)) {
		return Promise.resolve();
	}
	
	const {predicate} = node;
	const value = getValue(node);
	
	if (typeof predicate === 'function') {
		return getPredicatePromise(predicate(value));
	}
	
	return Promise[predicate.indexOf(value as string) > -1 ? 'resolve' : 'reject']();
}

function getAllPredicateResponses(node: Child = activeNode): Array<Promise<void>> {
	return [getOwnPredicateResponse(node), ...getSubPredicateResponses(node.parent)];
}

export function update(node: Child) {
	const previousValue = node.value;
	
	node.value = getValue(node);
	
	if (node.hasOptions) {
		option.update(node.value);
	}
	
	Promise.all(getAllPredicateResponses())
		.then(() => {
			node.element.removeClass(INVALID_CLASS);
			activeNode.element.addClass(VALID_CLASS);
			
			tooltip.hide();
		})
		.catch((reason) => {
			node.element.removeClass(VALID_CLASS);
			activeNode.element.addClass(INVALID_CLASS);
			
			activeNode.value = previousValue;
			
			if (reason) {
				tooltip.show(reason);
			}
		});
}

export function unmount(node: Child) {
	if (node === activeNode) {
		reset();
	}
}

export function doAction(node: Child) {
	const previousNode = activeNode;
	
	reset();
	
	if (previousNode !== node) {
		activeNode = node;
		
		activeNode.element.valueContainer.classList.add(ACTIVE_CLASS);
		
		activeNode.element.addClass(VALID_CLASS);
		
		tooltip.setNode(node);
		
		if (node.hasOptions) {
			option.setNode(node);
		}
		
		if (node.input === 'color') {
			node.element.valueElement.click();
		} else {
			node.element.valueElement.select();
		}
		
		addSustained(node);
	}
}

export function mount(node: Child): void {
	const {backgroundContainer, valueElement, headContainer} = node.element;
	
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
		
		if (event.relatedTarget && activeNode !== node) {
			doAction(node);
		}
	});
	
	headContainer.addEventListener('click', (event) => {
		event.stopPropagation();
		
		if (activeNode !== node) {
			doAction(node);
		}
	});
	
	// Process new value
	
	if (typeof node.value === 'boolean') {
		valueElement.addEventListener('click', (event) => {
			event.stopPropagation();
			
			update(node);
		});
	} else {
		valueElement.addEventListener('input', (event) => {
			event.stopPropagation();
			
			update(node);
		});
		
		// Stop
		
		if (node.input === 'color') {
			valueElement.addEventListener('change', (event) => {
				event.stopPropagation();
				
				reset();
				
				focusHovered();
			});
		}
	}
	
	if (node.hasOptions) {
		option.generate(node);
	}
	
	valueElement.addEventListener('keydown', (event) => {
		switch (event.key) {
			case 'Enter':
			case 'Escape':
				focusHovered();
			// eslint-disable-next-line no-fallthrough
			case 'Tab':
				event.stopPropagation();
				
				reset();
		}
	});
}

export function shouldMount(node: Child): boolean {
	return 'value' in node;
}
