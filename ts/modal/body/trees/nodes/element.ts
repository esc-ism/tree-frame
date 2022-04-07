import {ELEMENT_CLASSES, OPTIONS_ID_PREFIX} from './consts';

import type {Input, Predicate} from '../../../../validation/types';

let count = 0;

export default class Element {
    elementContainer: HTMLElement = document.createElement('div');

    interactionContainer: HTMLElement = document.createElement('div');

    buttonContainer: HTMLElement = document.createElement('span');

    valueAligner: HTMLElement = document.createElement('span');
    valueElement: HTMLInputElement = document.createElement('input');
    labelElement: HTMLInputElement = document.createElement('input');

    childContainer: HTMLElement = document.createElement('div');

    constructor() {
        this.elementContainer.classList.add(ELEMENT_CLASSES.ELEMENT_CONTAINER);
        this.interactionContainer.classList.add(ELEMENT_CLASSES.INTERACTION_CONTAINER);
        this.childContainer.classList.add(ELEMENT_CLASSES.CHILD_CONTAINER);
        this.buttonContainer.classList.add(ELEMENT_CLASSES.BUTTON_CONTAINER);
        this.valueAligner.classList.add(ELEMENT_CLASSES.INPUT_CONTAINER);
        this.valueElement.classList.add(ELEMENT_CLASSES.INPUT_VALUE);
        this.labelElement.classList.add(ELEMENT_CLASSES.INPUT_LABEL);

        this.interactionContainer.setAttribute('tabIndex', '1');

        this.valueElement.disabled = true;
        this.labelElement.disabled = true;

        this.valueAligner.appendChild(this.valueElement);
        this.valueAligner.appendChild(this.labelElement);

        this.interactionContainer.appendChild(this.buttonContainer);
        this.interactionContainer.appendChild(this.valueAligner);

        this.elementContainer.appendChild(this.interactionContainer);
        this.elementContainer.appendChild(this.childContainer);
    }

    initialise(value: unknown, label: string, predicate: Predicate, input: Input = 'text') {
        this.render(value);
        this.render(label, this.labelElement);

        this.valueElement.type = input;

        this.valueElement.title = label;
        // In case the text is too long to fit
        this.labelElement.title = label;

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

        if (typeof value === 'number') {
            this.valueElement.type = 'number';
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
