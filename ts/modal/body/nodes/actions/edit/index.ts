import {
	INVALID_CLASS, VALID_CLASS, ACTIVE_CLASS,
	VALID_BACKGROUND_CLASS, INVALID_BACKGROUND_CLASS,
} from './consts';

import * as history from '../history';
import * as overlays from '../overlays';
import {addSustained, removeSustained} from '../highlight';
import callbacks from '../callbacks';
import {MESSAGE_UNRESOLVED} from '../overlays/tooltip/consts';

import {EDITABLE_CLASS} from '../../consts';

import type Child from '@nodes/child';

import {isUnresolved} from '@/predicate';

import type {Value} from '@types';

let activeNode: Child;
let priorValue: Value;

export function isActive(): boolean {
	return Boolean(activeNode);
}

function addInputListeners(node = activeNode) {
	const {headContainer, contrast: {valueElement}} = node.element;
	
	if ('listeners' in node) {
		for (const [event, callback] of Object.entries(node.listeners)) {
			valueElement.addEventListener(event, callback);
		}
	}
	
	if (typeof node.value === 'boolean') {
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
	
	valueElement.addEventListener('focusin', (event) => {
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
	
	valueElement.addEventListener('keydown', (event) => {
		event.stopPropagation();
		
		switch (event.key) {
			case 'Enter':
			case 'Escape':
				if (isUnresolved()) {
					event.preventDefault();
				} else {
					headContainer.focus();
				}
		}
	});
}

function clearUndoStack() {
	const elements = activeNode.element.contrast;
	const copy = elements.valueElement.cloneNode(true) as HTMLInputElement;
	
	elements.valueElement.replaceWith(copy);
	
	elements.valueElement = copy;
	
	addInputListeners();
}

function setValue(node, value) {
	node.value = value;
	
	node.element.render(value);
}

export function reset() {
	if (!activeNode) {
		return;
	}
	
	const {element} = activeNode;
	
	clearUndoStack();
	
	if (priorValue === activeNode.lastAcceptedValue) {
		setValue(activeNode, activeNode.lastAcceptedValue);
	} else {
		history.register(
			activeNode,
			setValue.bind(null, activeNode, priorValue),
			setValue.bind(null, activeNode, activeNode.lastAcceptedValue),
		);
	}
	
	element.removeClass(VALID_CLASS);
	element.removeClass(INVALID_CLASS);
	
	element.removeClass(ACTIVE_CLASS);
	
	overlays.reset();
	
	removeSustained(activeNode);
	
	activeNode = undefined;
	priorValue = undefined;
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

export async function update() {
	const value = getValue(activeNode);
	
	activeNode.value = value;
	
	activeNode.element.removeClass(INVALID_CLASS);
	activeNode.element.removeClass(VALID_CLASS);
	
	overlays.update();
	
	try {
		if (!(await callbacks.predicate.getAll(activeNode))) {
			return;
		}
	} catch (reason) {
		activeNode.element.addClass(INVALID_CLASS);
		
		if (reason) {
			overlays.tooltip.kill();
			
			overlays.showTooltip(reason, activeNode);
		}
		
		return;
	}
	
	activeNode.lastAcceptedValue = value;
	
	activeNode.element.addClass(VALID_CLASS);
	
	overlays.hideTooltip();
	
	callbacks.update.triggerAll(activeNode);
}

export function unmount(node: Child) {
	if (node === activeNode) {
		reset();
	}
}

export function doAction(node: Child) {
	if (isUnresolved()) {
		overlays.showTooltip(MESSAGE_UNRESOLVED, node, node.element.contrast.valueContainer);
		
		node.element.headContainer.focus();
		
		return;
	}
	
	reset();
	
	overlays.tooltip.kill();
	
	activeNode = node;
	priorValue = node.value;
	
	node.element.addClass(ACTIVE_CLASS);
	node.element.addClass(VALID_CLASS);
	
	overlays.setNode(node);
	
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
	const {backgroundContainer, contrast, headContainer} = node.element;
	
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
	
	headContainer.addEventListener('click', (event) => {
		event.stopPropagation();
		
		contrast.valueElement.focus();
	});
	
	// Process new value
	
	if (typeof node.value === 'boolean') {
		headContainer.addEventListener('mousedown', (event) => {
			event.stopPropagation();
			event.preventDefault();
		});
		
		headContainer.addEventListener('click', () => {
			contrast.valueElement.checked = !contrast.valueElement.checked;
			
			update();
		});
		
		contrast.valueContainer.addEventListener('click', (event) => {
			event.stopPropagation();
		});
	}
	
	addInputListeners(node);
}

export function shouldMount(node: Child): boolean {
	return 'value' in node;
}
