import {
	OPTION_CLASS, OPTION_CONTAINER_CLASS, OPTION_PARENT_CLASS, OPTION_WRAPPER_CLASS,
	OPTION_BACKGROUND_CLASS, OPTION_SHOW_CLASS, OPTION_ACTIVE_CLASS,
} from './consts';

import type Child from '@nodes/child';

import {ROOT_CLASS} from '@nodes/consts';

import {TREE_CONTAINER} from '@/modal/body/trees';

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

function deselect() {
	if (activeIndex === -1) {
		return;
	}
	
	setActive(activeOptions[activeIndex].parentElement, false);
	
	activeIndex = -1;
}

export function update(value: Value) {
	const regExp = new RegExp(escapeRegExp(`${value}`), 'i');
	
	let hasVisibleChild = false;
	
	for (const {parentElement, innerText} of activeOptions) {
		if (regExp.test(innerText)) {
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
	
	if (TREE_CONTAINER.scrollTop + TREE_CONTAINER.clientHeight < totalOffsetTop + wrapper.clientHeight) {
		TREE_CONTAINER.scrollTop = totalOffsetTop + wrapper.clientHeight - TREE_CONTAINER.clientHeight;
	}
	
	deselect();
}

function setValue(node: Child, value: string, doKill: boolean = false) {
	node.element.contrast.valueElement.value = value;
	
	node.value = value;
	
	if (doKill) {
		// Simulate an 'enter' button press
		node.element.contrast.valueElement.dispatchEvent(new KeyboardEvent('keydown', {key: 'Tab'}));
	}
}

function setActive(option: HTMLElement, isActive: boolean = true) {
	option.classList[isActive ? 'add' : 'remove'](OPTION_ACTIVE_CLASS);
}

export function reset() {
	for (const {parentElement} of activeOptions) {
		parentElement.classList.remove(OPTION_SHOW_CLASS);
	}
	
	deselect();
	
	activeOptions.length = 0;
}

export function setNode(node: Child) {
	activeOptions.push(...(node.element.contrast.valueContainer.querySelectorAll(`.${OPTION_CLASS}`) as NodeListOf<HTMLElement>));
	
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
		
		container.addEventListener('mousedown', () => {
			setValue(node, value, true);
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
	
	node.element.contrast.valueElement.addEventListener('keydown', ({key}) => {
		const priorIndex = activeIndex;
		
		let hasChanged = false;
		
		switch (key) {
			case 'Tab':
			case 'Enter':
				if (activeIndex >= 0) {
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
						
						if (TREE_CONTAINER.scrollTop + TREE_CONTAINER.clientHeight < totalOffsetTop + parentElement.clientHeight - parentElement.parentElement.scrollTop) {
							TREE_CONTAINER.scrollTop = totalOffsetTop + parentElement.clientHeight - TREE_CONTAINER.clientHeight - parentElement.parentElement.scrollTop;
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
						if (TREE_CONTAINER.scrollTop > totalOffsetTop - parentElement.parentElement.scrollTop) {
							TREE_CONTAINER.scrollTop = totalOffsetTop - parentElement.parentElement.scrollTop;
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
