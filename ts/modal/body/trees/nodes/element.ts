import {DEPTH_CLASS_PREFIX, ELEMENT_CLASSES} from './consts';

import type {Child as _Child} from '@types';

export default class Element {
	readonly elementContainer: HTMLElement = document.createElement('div');
	
	readonly backgroundContainer: HTMLElement = document.createElement('div');
	
	readonly headContainer: HTMLElement = document.createElement('span');
	
	readonly buttonContainer: HTMLElement = document.createElement('span');
	
	readonly valueContainer?: HTMLElement;
	readonly valueElement?: HTMLInputElement;
	
	readonly labelContainer?: HTMLElement;
	readonly labelElement?: HTMLElement;
	
	readonly childContainer: HTMLElement = document.createElement('div');
	
	depthClass: string;
	
	constructor(data: _Child) {
		this.elementContainer.classList.add(ELEMENT_CLASSES.ELEMENT_CONTAINER);
		this.backgroundContainer.classList.add(ELEMENT_CLASSES.BACKGROUND_CONTAINER);
		this.childContainer.classList.add(ELEMENT_CLASSES.CHILD_CONTAINER);
		this.headContainer.classList.add(ELEMENT_CLASSES.HEAD_CONTAINER);
		this.buttonContainer.classList.add(ELEMENT_CLASSES.BUTTON_CONTAINER);
		
		this.elementContainer.appendChild(this.backgroundContainer);
		
		this.headContainer.appendChild(this.buttonContainer);
		
		if ('value' in data) {
			this.valueContainer = document.createElement('label');
			this.valueElement = document.createElement('input');
			
			this.valueContainer.classList.add(ELEMENT_CLASSES.VALUE_CONTAINER);
			this.valueElement.classList.add(ELEMENT_CLASSES.VALUE);
			
			this.valueElement.setAttribute('tabIndex', '-1');
			
			if (typeof data.value === 'boolean') {
				this.valueElement.type = 'checkbox';
				
				// Positions tooltips below checkboxes
				const valueWrapper = document.createElement('span');
				
				valueWrapper.appendChild(this.valueElement);
				this.valueContainer.appendChild(valueWrapper);
			} else {
				if (typeof data.value === 'number') {
					this.valueElement.type = 'number';
					
					// Disables a tooltip implying that decimal values are invalid
					this.valueElement.step = 'any';
				} else if ('input' in data) {
					this.valueElement.type = data.input;
				}
				
				this.valueContainer.appendChild(this.valueElement);
			}
			
			this.render(data.value);
			
			this.headContainer.appendChild(this.valueContainer);
		}
		
		this.elementContainer.appendChild(this.headContainer);
		
		if ('label' in data) {
			this.labelContainer = document.createElement('div');
			this.labelElement = document.createElement('span');
			
			this.labelContainer.classList.add(ELEMENT_CLASSES.LABEL_CONTAINER);
			this.labelElement.classList.add(ELEMENT_CLASSES.LABEL);
			
			this.labelElement.innerText = data.label;
			
			this.labelContainer.appendChild(this.labelElement);
			this.headContainer.appendChild(this.labelContainer);
		}
		
		this.elementContainer.appendChild(this.childContainer);
	}
	
	render(value: unknown) {
		if (typeof value === 'boolean') {
			this.valueElement.checked = value;
		} else {
			this.valueElement.value = value.toString();
		}
	}
	
	addClass(...names: string[]) {
		for (const name of names) {
			this.elementContainer.classList.add(name);
		}
	}
	
	removeClass(...names: string[]) {
		for (const name of names) {
			this.elementContainer.classList.remove(name);
		}
	}
	
	addDepthClass(depth: number) {
		if (this.depthClass) {
			this.removeClass(this.depthClass);
		}
		
		const depthClass = `${DEPTH_CLASS_PREFIX}${depth}`;
		
		this.addClass(depthClass);
		
		this.depthClass = depthClass;
	}
	
	addChild(child: Element, index) {
		this.childContainer.insertBefore(child.elementContainer, this.childContainer.children[index] ?? null);
	}
	
	addButton(button: HTMLButtonElement) {
		this.buttonContainer.appendChild(button);
	}
	
	remove() {
		this.elementContainer.remove();
	}
	
	scrollIntoView() {
		this.backgroundContainer.scrollIntoView({block: 'center'});
	}
}
