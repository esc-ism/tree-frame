import {
	OPTION_CLASS, OPTION_CONTAINER_CLASS, OPTION_PARENT_CLASS, OPTION_WRAPPER_CLASS,
	OPTION_BACKGROUND_CLASS, OPTION_SHOW_CLASS, OPTION_ACTIVE_CLASS,
} from './consts';

import type Child from '@nodes/child';

import {ROOT_CLASS} from '@nodes/consts';

import type {Value} from '@/validation/types';

const activeOptions: HTMLElement[] = [];

let activeIndex: number = -1;

// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#escaping
function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function update(value: Value) {
	const regExp = new RegExp(escapeRegExp(value), 'i');
	
	for (const {parentElement, innerText} of activeOptions) {
		parentElement.classList[regExp.test(innerText) ? 'add' : 'remove'](OPTION_SHOW_CLASS);
	}
	
	const wrapper = activeOptions[0].parentElement.parentElement;
	const [totalOffsetTop, root] = getTotalOffsetTop(wrapper);
	
	if (root.scrollTop + root.clientHeight < totalOffsetTop + wrapper.clientHeight) {
		root.scroll({top: totalOffsetTop + wrapper.clientHeight - root.clientHeight});
	}
}

function setValue(node: Child, value: string, doKill: boolean = false) {
	node.element.valueElement.value = value;
	
	node.value = value;
	
	if (doKill) {
		// Simulate an 'enter' button press
		node.element.valueElement.dispatchEvent(new KeyboardEvent('keydown', {key: 'Tab'}));
	}
}

function setActive(option: HTMLElement, isActive: boolean = true) {
	option.classList[isActive ? 'add' : 'remove'](OPTION_ACTIVE_CLASS);
}

function getTotalOffsetTop(from: HTMLElement) {
	let offsetTop = 2;
	let node;
	
	for (node = from; !node.classList.contains(ROOT_CLASS); node = node.offsetParent) {
		offsetTop += node.offsetTop;
	}
	
	return [offsetTop, node.parentElement];
}

export function reset() {
	for (const {parentElement} of activeOptions) {
		parentElement.classList.remove(OPTION_SHOW_CLASS);
	}
	
	if (activeIndex >= 0) {
		setActive(activeOptions[activeIndex].parentElement, false);
		
		activeIndex = -1;
	}
	
	activeOptions.length = 0;
}

export function setNode(node: Child) {
	activeOptions.push(...(node.element.valueContainer.querySelectorAll(`.${OPTION_CLASS}`) as NodeListOf<HTMLElement>));
	
	update(node.value);
}

export function generate(node: Child) {
	const wrapper = document.createElement('div');
	const parent = document.createElement('div');
	
	for (const value of node.predicate as Array<string>) {
		const container = document.createElement('div');
		const background = document.createElement('div');
		const option = document.createElement('div');
		
		option.innerText = value;
		
		container.classList.add(OPTION_CONTAINER_CLASS);
		option.classList.add(OPTION_CLASS);
		background.classList.add(OPTION_BACKGROUND_CLASS);
		
		container.append(background, option);
		parent.appendChild(container);
		
		container.addEventListener('click', (event) => {
			event.stopPropagation();
			// Necessary to prevent re-focusing the input element
			event.preventDefault();
			
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
	
	node.element.valueElement.addEventListener('keydown', ({key}) => {
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
							parentElement.parentElement.scroll({top: optionBottom - parentElement.parentElement.clientHeight});
						}
						
						const [totalOffsetTop, root] = getTotalOffsetTop(parentElement);
						
						if (root.scrollTop + root.clientHeight < totalOffsetTop + parentElement.clientHeight - parentElement.parentElement.scrollTop) {
							root.scroll({top: totalOffsetTop + parentElement.clientHeight - root.clientHeight - parentElement.parentElement.scrollTop});
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
							parentElement.parentElement.scroll({top: parentElement.offsetTop});
						}
						
						const [totalOffsetTop, root] = getTotalOffsetTop(parentElement);
						
						// Scroll modal body if necessary
						if (root.scrollTop > totalOffsetTop - parentElement.parentElement.scrollTop) {
							root.scroll({top: totalOffsetTop - parentElement.parentElement.scrollTop});
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
	
	node.element.valueContainer.appendChild(wrapper);
}
