import {
	DROPDOWN_CLASS, DROPDOWN_CONTAINER_CLASS, DROPDOWN_PARENT_CLASS, DROPDOWN_WRAPPER_CLASS,
	DROPDOWN_BACKGROUND_CLASS, DROPDOWN_SHOW_CLASS, DROPDOWN_ACTIVE_CLASS,
} from './consts';

import {update as notify} from '../../edit';

import type Child from '@nodes/child';

import {element as scrollElement} from '@/modal/body';

import type {Value} from '@types';

const activeOptions: HTMLElement[] = [];
const resetCallbacks: Array<() => void> = [];

let activeIndex: number = -1;

function getTop(target: HTMLElement, includeHeight = true): number {
	const scrollRect = scrollElement.getBoundingClientRect();
	const targetRect = target.getBoundingClientRect();
	
	// todo this had a `+2` before; may be necessary
	return targetRect.top - scrollRect.top + scrollElement.scrollTop + (includeHeight ? targetRect.height : 0);
}

// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#escaping
function escapeRegExp(string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function setActive(option: HTMLElement, isActive: boolean = true) {
	option.classList[isActive ? 'add' : 'remove'](DROPDOWN_ACTIVE_CLASS);
}

function deselect() {
	if (activeIndex === -1) {
		return;
	}
	
	setActive(activeOptions[activeIndex].parentElement, false);
	
	activeIndex = -1;
}

export function update(value: Value) {
	// equivalent to `if (!('options' in node))`
	if (activeOptions.length === 0) {
		return;
	}
	
	const stringValue = `${value}`;
	const regExp = new RegExp(escapeRegExp(stringValue), 'i');
	
	for (const {parentElement, innerText} of activeOptions) {
		if (stringValue.length <= innerText.length && regExp.test(innerText)) {
			parentElement.classList.add(DROPDOWN_SHOW_CLASS);
		} else {
			parentElement.classList.remove(DROPDOWN_SHOW_CLASS);
		}
	}
	
	const [{parentElement: {parentElement: wrapper}}] = activeOptions;
	const top = getTop(wrapper);
	
	// todo remove? seems pointless
	if (scrollElement.scrollTop + scrollElement.clientHeight < top) {
		scrollElement.scrollTop = top - scrollElement.clientHeight;
	}
	
	deselect();
}

async function setValue(node: Child, value: string) {
	node.element.contrast.valueElement.value = value;
	
	deselect();
	
	await notify();
}

export function reset() {
	while (resetCallbacks.length > 0) {
		resetCallbacks.pop()();
	}
	
	activeOptions.length = 0;
}

function addListener(target: HTMLElement, type: string, listener: (event: Event) => void, useCapture = false) {
	target.addEventListener(type, listener, useCapture);
	
	resetCallbacks.push(() => target.removeEventListener(type, listener, useCapture));
}

export function generate(node: Child) {
	const wrapper = document.createElement('div');
	const parent = document.createElement('div');
	
	wrapper.style.width = `${node.element.contrast.valueContainer.clientWidth}px`;
	
	// avoid blurring an input when dragging the scrollbar
	addListener(wrapper, 'mousedown', (event) => {
		event.stopPropagation();
		event.preventDefault();
	});
	
	for (const type of ['mouseover', 'mouseout', 'mouseup']) {
		addListener(wrapper, type, (event) => {
			event.stopPropagation();
		});
	}
	
	for (const value of node.options as Array<string>) {
		const container = document.createElement('div');
		const background = document.createElement('div');
		const option = document.createElement('div');
		
		option.innerText = value;
		
		container.classList.add(DROPDOWN_CONTAINER_CLASS);
		option.classList.add(DROPDOWN_CLASS);
		background.classList.add(DROPDOWN_BACKGROUND_CLASS);
		
		container.append(background, option);
		parent.appendChild(container);
		
		activeOptions.push(option);
		
		addListener(container, 'mousedown', (event) => {
			event.stopPropagation();
			event.preventDefault();
		});
		
		addListener(container, 'click', async (event) => {
			event.stopPropagation();
			
			await setValue(node, value);
			
			node.element.headContainer.focus();
		});
		
		addListener(container, 'mouseenter', (event) => {
			event.stopPropagation();
			
			setActive(container);
		});
		
		addListener(container, 'mouseleave', (event) => {
			event.stopPropagation();
			
			setActive(container, false);
		});
	}
	
	addListener(node.element.contrast.valueElement, 'keydown', (event: KeyboardEvent) => {
		const priorIndex = activeIndex;
		
		let hasChanged = false;
		
		switch (event.key) {
			case 'Tab':
			case 'Enter':
				if (activeIndex >= 0) {
					event.stopPropagation();
					event.preventDefault();
					
					setValue(node, activeOptions[activeIndex].innerText)
						.then(() => node.element.headContainer.focus());
				}
				
				return;
			case 'ArrowDown':
				for (let i = activeIndex + 1; i < activeOptions.length; ++i) {
					const {parentElement} = activeOptions[i];
					
					if (parentElement.classList.contains(DROPDOWN_SHOW_CLASS)) {
						activeIndex = i;
						hasChanged = true;
						
						const optionBottom = parentElement.offsetTop + parentElement.clientHeight;
						
						if (parentElement.parentElement.scrollTop < optionBottom) {
							parentElement.parentElement.scrollTop = optionBottom - parentElement.parentElement.clientHeight;
						}
						
						const top = getTop(parentElement);
						
						if (scrollElement.scrollTop + scrollElement.clientHeight < top - parentElement.parentElement.scrollTop) {
							scrollElement.scrollTop = top - scrollElement.clientHeight - parentElement.parentElement.scrollTop;
						}
						
						break;
					}
				}
				
				break;
			case 'ArrowUp':
				for (let i = activeIndex - 1; i >= 0; --i) {
					const {parentElement} = activeOptions[i];
					
					if (parentElement.classList.contains(DROPDOWN_SHOW_CLASS)) {
						activeIndex = i;
						hasChanged = true;
						
						// Scroll option list if necessary
						if (parentElement.parentElement.scrollTop > parentElement.offsetTop) {
							parentElement.parentElement.scrollTop = parentElement.offsetTop;
						}
						
						const top = getTop(parentElement, false);
						
						// Scroll modal body if necessary
						if (scrollElement.scrollTop > top - parentElement.parentElement.scrollTop) {
							scrollElement.scrollTop = top - parentElement.parentElement.scrollTop;
						}
						
						break;
					}
				}
				
				if (hasChanged) {
					break;
				}
			
			// eslint-disable-next-line no-fallthrough
			default:
				if (activeIndex >= 0) {
					setActive(activeOptions[activeIndex].parentElement, false);
				}
				
				activeIndex = -1;
				
				return;
		}
		
		if (!hasChanged) {
			return;
		}
		
		if (priorIndex >= 0) {
			setActive(activeOptions[priorIndex].parentElement, false);
		}
		
		const {parentElement} = activeOptions[activeIndex];
		
		setActive(parentElement);
	}, true);
	
	wrapper.classList.add(DROPDOWN_WRAPPER_CLASS);
	parent.classList.add(DROPDOWN_PARENT_CLASS);
	
	wrapper.appendChild(parent);
	
	return wrapper;
}
