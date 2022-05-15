import {DEPTH_CLASS_PREFIX, ELEMENT_CLASSES, OPTIONS_ID_PREFIX} from './consts';

import type {Child as _Child} from '../../../../validation/types';

import './actions/index';

let count = 0;

export default class Element {
    readonly elementContainer: HTMLElement = document.createElement('div');

    readonly interactionContainer: HTMLElement = document.createElement('div');

    readonly buttonContainer: HTMLElement = document.createElement('span');

    readonly labelElement?: HTMLElement;
    readonly valueContainer?: HTMLElement;
    readonly valueWrapper?: HTMLElement;
    readonly valueElement?: HTMLInputElement;

    readonly childContainer: HTMLElement = document.createElement('div');

    depthClass: string;

    constructor(data: _Child) {
        this.elementContainer.classList.add(ELEMENT_CLASSES.ELEMENT_CONTAINER);
        this.interactionContainer.classList.add(ELEMENT_CLASSES.INTERACTION_CONTAINER);
        this.childContainer.classList.add(ELEMENT_CLASSES.CHILD_CONTAINER);
        this.buttonContainer.classList.add(ELEMENT_CLASSES.BUTTON_CONTAINER);

        this.interactionContainer.appendChild(this.buttonContainer);
        this.elementContainer.appendChild(this.interactionContainer);
        this.elementContainer.appendChild(this.childContainer);

        if ('value' in data) {
            this.valueElement = document.createElement('input');
            this.valueContainer = document.createElement('span');

            this.valueContainer.classList.add(ELEMENT_CLASSES.VALUE_CONTAINER);
            this.valueElement.classList.add(ELEMENT_CLASSES.VALUE);

            this.valueElement.setAttribute('tabIndex', '-1');

            if (typeof data.value === 'boolean') {
                this.valueElement.type = 'checkbox';

                // Solely for adding tooltips below checkboxes (input elements can't have children)
                this.valueWrapper = document.createElement('span');

                this.valueWrapper.appendChild(this.valueElement);
                this.valueContainer.appendChild(this.valueWrapper);
                this.interactionContainer.appendChild(this.valueContainer);
            } else {
                if (typeof data.value === 'number') {
                    this.valueElement.type = 'number';
                } else if ('input' in data) {
                    this.valueElement.type = data.input;
                }

                this.valueContainer.appendChild(this.valueElement);
                this.interactionContainer.appendChild(this.valueContainer);
            }

            this.render(data.value);
        }

        if ('label' in data) {
            this.labelElement = document.createElement('span');

            this.labelElement.classList.add(ELEMENT_CLASSES.LABEL);

            this.labelElement.innerText = data.label

            this.interactionContainer.appendChild(this.labelElement);
        }

        if ('predicate' in data) {
            if (Array.isArray(data.predicate)) {
                const optionsElement = document.createElement('datalist');
                const id = `${OPTIONS_ID_PREFIX}${count++}`;

                // Link input to datalist
                this.valueElement.setAttribute('list', id);
                optionsElement.id = id;

                for (const option of data.predicate) {
                    const optionElement = document.createElement('option');

                    optionElement.value = option.toString();

                    optionsElement.appendChild(optionElement);
                }

                this.valueContainer.appendChild(optionsElement);
            }
        }
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
            this.removeClass(this.depthClass)
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
        this.interactionContainer.scrollIntoView({'block': 'center'});
    }
}
