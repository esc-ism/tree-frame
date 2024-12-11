import {
	OPTION_CLASS, OPTION_CONTAINER_CLASS, OPTION_PARENT_CLASS, OPTION_WRAPPER_CLASS,
	OPTION_BACKGROUND_CLASS, OPTION_SHOW_CLASS, OPTION_ACTIVE_CLASS,
} from './consts';

import {update as notify} from '../index';

import type Child from '@nodes/child';

import {ROOT_CLASS} from '@nodes/consts';

import {element as scrollElement} from '@/modal/body';

import type {Value} from '@types';

const activeOptions: HTMLElement[] = [];

let activeIndex: number = -1;

export function isActive(): boolean {
	return activeOptions.some(({parentElement}) => parentElement.classList.contains(OPTION_SHOW_CLASS));
}

function getTotalOffsetTop(from: HTMLElement): number {
	let offsetTop = 2;
	let node;
	
	for (node = from; !node.classList.contains(ROOT_CLASS); node = node.offsetParent) {
		offsetTop += node.offsetTop;
	}
	
	return offsetTop;
}

// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#escaping
function escapeRegExp(string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function setActive(option: HTMLElement, isActive: boolean = true) {
	option.classList[isActive ? 'add' : 'remove'](OPTION_ACTIVE_CLASS);
}

function deselect() {
	if (activeIndex === -1) {
		return;
	}
	
	setActive(activeOptions[activeIndex].parentElement, false);
	
	activeIndex = -1;
}

export function update(value: Value) {
	const stringValue = `${value}`;
	const regExp = new RegExp(escapeRegExp(stringValue), 'i');
	
	let hasVisibleChild = false;
	
	for (const {parentElement, innerText} of activeOptions) {
		if (stringValue.length <= innerText.length && regExp.test(innerText)) {
			parentElement.classList.add(OPTION_SHOW_CLASS);
			
			hasVisibleChild = true;
		} else {
			parentElement.classList.remove(OPTION_SHOW_CLASS);
		}
	}
	
	const wrapper = activeOptions[0].parentElement.parentElement;
	
	if (!hasVisibleChild) {
		wrapper.style.setProperty('display', 'none');
		
		return;
	}
	
	wrapper.style.removeProperty('display');
	
	const totalOffsetTop = getTotalOffsetTop(wrapper);
	
	if (scrollElement.scrollTop + scrollElement.clientHeight < totalOffsetTop + wrapper.clientHeight) {
		scrollElement.scrollTop = totalOffsetTop + wrapper.clientHeight - scrollElement.clientHeight;
	}
	
	deselect();
}

function setValue(node: Child, value: string) {
	node.element.contrast.valueElement.value = value;
	
	notify();
	
	deselect();
}

export function reset() {
	for (const {parentElement} of activeOptions) {
		parentElement.classList.remove(OPTION_SHOW_CLASS);
	}
	
	deselect();
	
	activeOptions.length = 0;
}

export function setNode(node: Child) {
	// Using Array.from so typescript doesn't complain
	activeOptions.push(...Array.from(node.element.contrast.valueContainer.querySelectorAll(`.${OPTION_CLASS}`) as NodeListOf<HTMLElement>));
	
	update(node.value);
}

export function generate(node: Child) {
	const wrapper = document.createElement('div');
	const parent = document.createElement('div');
	
	for (const value of node.options as Array<string>) {
		const container = document.createElement('div');
		const background = document.createElement('div');
		const option = document.createElement('div');
		
		option.innerText = value;
		
		container.classList.add(OPTION_CONTAINER_CLASS);
		option.classList.add(OPTION_CLASS);
		background.classList.add(OPTION_BACKGROUND_CLASS);
		
		container.append(background, option);
		parent.appendChild(container);
		
		container.addEventListener('mousedown', (event) => {
			event.stopPropagation();
			event.preventDefault();
		});
		
		container.addEventListener('click', (event) => {
			event.stopPropagation();
			
			setValue(node, value);
		});
		
		container.addEventListener('mouseenter', (event) => {
			event.stopPropagation();
			
			setActive(container);
		});
		
		container.addEventListener('mouseleave', (event) => {
			event.stopPropagation();
			
			setActive(container, false);
		});
	}
	
	node.element.contrast.valueElement.addEventListener('keydown', (event) => {
		const priorIndex = activeIndex;
		
		let hasChanged = false;
		
		switch (event.key) {
			case 'Tab':
			case 'Enter':
				if (activeIndex >= 0) {
					event.stopImmediatePropagation();
					event.preventDefault();
					
					setValue(node, activeOptions[activeIndex].innerText);
				}
				
				return;
			case 'ArrowDown':
				for (let i = activeIndex + 1; i < activeOptions.length; ++i) {
					const {parentElement} = activeOptions[i];
					
					if (parentElement.classList.contains(OPTION_SHOW_CLASS)) {
						activeIndex = i;
						hasChanged = true;
						
						const optionBottom = parentElement.offsetTop + parentElement.clientHeight;
						
						if (parentElement.parentElement.scrollTop < optionBottom) {
							parentElement.parentElement.scrollTop = optionBottom - parentElement.parentElement.clientHeight;
						}
						
						const totalOffsetTop = getTotalOffsetTop(parentElement);
						
						if (scrollElement.scrollTop + scrollElement.clientHeight < totalOffsetTop + parentElement.clientHeight - parentElement.parentElement.scrollTop) {
							scrollElement.scrollTop = totalOffsetTop + parentElement.clientHeight - scrollElement.clientHeight - parentElement.parentElement.scrollTop;
						}
						
						break;
					}
				}
				
				break;
			case 'ArrowUp':
				for (let i = activeIndex - 1; i >= 0; --i) {
					const {parentElement} = activeOptions[i];
					
					if (parentElement.classList.contains(OPTION_SHOW_CLASS)) {
						activeIndex = i;
						hasChanged = true;
						
						// Scroll option list if necessary
						if (parentElement.parentElement.scrollTop > parentElement.offsetTop) {
							parentElement.parentElement.scrollTop = parentElement.offsetTop;
						}
						
						const totalOffsetTop = getTotalOffsetTop(parentElement);
						
						// Scroll modal body if necessary
						if (scrollElement.scrollTop > totalOffsetTop - parentElement.parentElement.scrollTop) {
							scrollElement.scrollTop = totalOffsetTop - parentElement.parentElement.scrollTop;
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
	});
	
	wrapper.classList.add(OPTION_WRAPPER_CLASS);
	parent.classList.add(OPTION_PARENT_CLASS);
	
	wrapper.appendChild(parent);
	
	node.element.contrast.valueContainer.appendChild(wrapper);
}
