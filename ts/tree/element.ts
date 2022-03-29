import {Predicate} from '../types';

const OPTIONS_ID_PREFIX = 'predicate-options-';

let count = 0;

export default class Element {
    root: HTMLElement = document.createElement('div');

    dataContainer: HTMLElement = document.createElement('div');

    buttonContainer: HTMLElement = document.createElement('span');

    valueAligner: HTMLElement = document.createElement('span');
    valueElement: HTMLInputElement = document.createElement('input');
    labelElement: HTMLInputElement = document.createElement('input');

    childContainer: HTMLElement = document.createElement('div');

    buttons: Array<Node> = [];

    constructor() {
        this.root.classList.add('node');

        this.dataContainer.classList.add('node-data-container');

        this.buttonContainer.classList.add('node-button-container');

        this.valueAligner.classList.add('node-aligner');
        this.valueElement.classList.add('node-value');
        this.labelElement.classList.add('node-label');

        this.valueElement.disabled = true;
        this.labelElement.disabled = true;

        this.childContainer.classList.add('node-child-container');

        this.valueAligner.appendChild(this.valueElement);
        this.valueAligner.appendChild(this.labelElement);

        this.dataContainer.appendChild(this.buttonContainer);
        this.dataContainer.appendChild(this.valueAligner);

        this.root.appendChild(this.dataContainer);
        this.root.appendChild(this.childContainer);
    }

    initialise(value: unknown, label: string, predicate: Predicate) {
        this.render(value);
        this.render(label, this.labelElement);

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
            this.root.classList.add(name);
        }
    }

    removeClass(...names: string[]) {
        for (const name of names) {
            this.root.classList.remove(name);
        }
    }

    addChild(child: Element, index) {
        this.childContainer.insertBefore(child.root, this.childContainer.children[index] ?? null);
    }

    addButton(button: Node, index: number = this.buttons.length) {
        this.buttons[index] = button;

        for (let i = index + 1; i < this.buttons.length; ++i) {
            const sibling = this.buttons[i];

            if (sibling) {
                this.buttonContainer.insertBefore(button, sibling);

                return;
            }
        }

        this.buttonContainer.appendChild(button);
    }

    remove() {
        this.root.remove();
    }
}
