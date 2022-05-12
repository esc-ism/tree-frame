import {DEPTH_CLASS_PREFIX, ELEMENT_CLASSES, OPTIONS_ID_PREFIX} from './consts';

import type {Child as _Child} from '../../../../validation/types';

let count = 0;

export default class Element {
    elementContainer: HTMLElement = document.createElement('div');

    interactionContainer: HTMLElement = document.createElement('div');

    buttonContainer: HTMLElement = document.createElement('span');

    valueAligner: HTMLElement = document.createElement('span');
    valueElement: HTMLInputElement = document.createElement('input');

    childContainer: HTMLElement = document.createElement('div');

    depthClass: string;

    constructor({value, ...optional}: _Child) {
        this.elementContainer.classList.add(ELEMENT_CLASSES.ELEMENT_CONTAINER);
        this.interactionContainer.classList.add(ELEMENT_CLASSES.INTERACTION_CONTAINER);
        this.childContainer.classList.add(ELEMENT_CLASSES.CHILD_CONTAINER);
        this.buttonContainer.classList.add(ELEMENT_CLASSES.BUTTON_CONTAINER);
        this.valueAligner.classList.add(ELEMENT_CLASSES.INPUT_CONTAINER);
        this.valueElement.classList.add(ELEMENT_CLASSES.INPUT_VALUE);

        this.interactionContainer.setAttribute('tabIndex', '1');

        this.valueElement.disabled = true;

        this.valueAligner.appendChild(this.valueElement);

        this.interactionContainer.appendChild(this.buttonContainer);
        this.interactionContainer.appendChild(this.valueAligner);

        this.elementContainer.appendChild(this.interactionContainer);
        this.elementContainer.appendChild(this.childContainer);

        this.render(value);

        if ('label' in optional) {
            const {label} = optional;
            const labelElement = document.createElement('input');

            labelElement.classList.add(ELEMENT_CLASSES.INPUT_LABEL);

            labelElement.disabled = true;

            this.render(label, labelElement);

            this.valueAligner.appendChild(labelElement);

            // In case the text is too long to fit
            labelElement.title = label;
            this.valueElement.title = label;
        }

        if ('predicate' in optional) {
            const {predicate} = optional;

            if (Array.isArray(predicate)) {
                const optionsElement = document.createElement('datalist');
                const id = `${OPTIONS_ID_PREFIX}${count++}`;

                // Link input to datalist
                this.valueElement.setAttribute('list', id);
                optionsElement.id = id;

                for (const option of predicate) {
                    const optionElement = document.createElement('option');

                    optionElement.value = option.toString();

                    optionsElement.appendChild(optionElement);
                }

                this.valueAligner.appendChild(optionsElement);
            }
        }

        if (typeof value === 'number') {
            this.valueElement.type = 'number';
        } else if ('input' in optional) {
            this.valueElement.type = optional.input;
        }
    }

    render(value: unknown, element = this.valueElement) {
        element.value = value.toString();
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
