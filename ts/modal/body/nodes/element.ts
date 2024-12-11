import {ELEMENT_CLASSES, BASE_CLASS, CONTRAST_CLASS, CHECKBOX_WRAPPER_CLASS} from './consts';

import type {Child as _Child} from '@types';

type ValueElements = {
	readonly container: HTMLElement;
	readonly valueContainer?: HTMLElement;
	readonly valueElement?: HTMLInputElement;
};

export default class Element {
	readonly elementContainer: HTMLElement = document.createElement('div');
	
	readonly backgroundContainer: HTMLElement = document.createElement('div');
	
	readonly headContainer: HTMLElement = document.createElement('span');
	
	readonly buttonContainer: HTMLElement = document.createElement('span');
	readonly infoContainer: HTMLElement = document.createElement('span');
	
	readonly base: ValueElements = {container: document.createElement('span')};
	readonly contrast: ValueElements = {container: document.createElement('span')};
	
	readonly childContainer = document.createElement('div');
	
	groupClass: string;
	
	constructor(data: _Child) {
		this.elementContainer.classList.add(ELEMENT_CLASSES.ELEMENT_CONTAINER);
		this.backgroundContainer.classList.add(ELEMENT_CLASSES.BACKGROUND_CONTAINER);
		this.childContainer.classList.add(ELEMENT_CLASSES.CHILD_CONTAINER);
		this.infoContainer.classList.add(ELEMENT_CLASSES.INFO_CONTAINER);
		this.headContainer.classList.add(ELEMENT_CLASSES.HEAD_CONTAINER);
		this.buttonContainer.classList.add(ELEMENT_CLASSES.BUTTON_CONTAINER);
		this.base.container.classList.add(BASE_CLASS);
		this.contrast.container.classList.add(CONTRAST_CLASS);
		
		if ('value' in data) {
			this.addValueContainer(this.contrast, data);
			this.addValueContainer(this.base, data);
			
			this.render(data.value);
		}
		
		if ('label' in data) {
			this.addLabelContainer(this.contrast, data.label);
			this.addLabelContainer(this.base, data.label);
		}
		
		this.infoContainer.append(this.backgroundContainer, this.contrast.container, this.base.container);
		this.headContainer.append(this.buttonContainer, this.infoContainer);
		
		this.elementContainer.appendChild(this.headContainer);
		
		this.elementContainer.appendChild(this.childContainer);
	}
	
	addLabelContainer({container}, label) {
		const labelContainer = document.createElement('div');
		const labelElement = document.createElement('span');
		
		labelContainer.classList.add(ELEMENT_CLASSES.LABEL_CONTAINER);
		labelElement.classList.add(ELEMENT_CLASSES.LABEL);
		
		labelElement.innerText = label;
		
		labelContainer.appendChild(labelElement);
		container.appendChild(labelContainer);
	}
	
	addValueContainer(field, data) {
		field.valueContainer = document.createElement('label');
		
		field.valueContainer.classList.add(ELEMENT_CLASSES.VALUE_CONTAINER);
		
		if ('value' in data) {
			field.valueElement = document.createElement('input');
			
			field.valueElement.classList.add(ELEMENT_CLASSES.VALUE);
			field.valueElement.setAttribute('tabindex', '-1');
			
			if (typeof data.value === 'boolean') {
				field.valueElement.type = 'checkbox';
				
				// Positions tooltips below checkboxes
				const valueWrapper = document.createElement('span');
				
				valueWrapper.classList.add(CHECKBOX_WRAPPER_CLASS);
				
				valueWrapper.appendChild(field.valueElement);
				field.valueContainer.appendChild(valueWrapper);
			} else {
				if (typeof data.value === 'number') {
					field.valueElement.type = 'number';
					
					// Disables a tooltip implying that decimal values are invalid
					field.valueElement.step = 'any';
				} else if ('input' in data) {
					field.valueElement.type = data.input;
				}
				
				field.valueContainer.appendChild(field.valueElement);
			}
		}
		
		field.container.appendChild(field.valueContainer);
	}
	
	render(value: unknown) {
		if (typeof value === 'boolean') {
			this.base.valueElement.checked = value;
			this.contrast.valueElement.checked = value;
		} else {
			this.base.valueElement.value = value.toString();
			this.contrast.valueElement.value = value.toString();
		}
	}
	
	hasClass(...names: string[]): boolean {
		for (const name of names) {
			if (this.elementContainer.classList.contains(name)) {
				return true;
			}
		}
		
		return false;
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
	
	addChild(child: Element, index) {
		this.childContainer.insertBefore(child.elementContainer, this.childContainer.children[index] ?? null);
	}
	
	addButton(button: HTMLButtonElement) {
		this.buttonContainer.appendChild(button);
	}
	
	remove() {
		this.elementContainer.remove();
	}
	
	scrollIntoView(options: boolean | ScrollIntoViewOptions) {
		this.backgroundContainer.scrollIntoView(typeof options === 'object' ? {block: 'center', ...options} : options);
	}
}
