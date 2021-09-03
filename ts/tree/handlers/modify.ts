import type * as dataTypes from '../../types';

import type {Handler} from './utils';
import {Listeners} from './utils';

import type Leaf from '../nodes/leaf';
import Middle from '../nodes/middle';

type ModifiableNode = (Leaf | Middle) & {predicate: dataTypes.FunctionPredicate};

class Acceptor implements Handler {
    private static wrapperElement = document.getElementById('form-page-wrapper');
    private static parentElement = document.getElementById('form-page');

    listeners = new Listeners();

    node: Middle
    element: HTMLElement;
    predicate: dataTypes.FunctionPredicate;

    isOpen: boolean = false;

    constructor(node: Middle, predicate?: dataTypes.Predicate) {
        this.node = node;
        this.element = node.element;

        if (predicate) {
            this.predicate = Array.isArray(predicate) ? (value) => predicate.indexOf(value) !== -1 : predicate;
        }
    }

    close() {
        Acceptor.parentElement.innerHTML = '';

        Acceptor.wrapperElement.classList.remove('selected');
    }

    open() {
        Acceptor.wrapperElement.classList.add('selected');

        const isValid = (value: dataTypes.Value, node: ModifiableNode) => {
            if (node instanceof Middle) {
                for (const sibling of node.parent.children) {
                    if (sibling.value === value) {
                        return false;
                    }
                }
            }

            return node.predicate(value);
        };

        const handleInput = (value: dataTypes.Value, inputElement: HTMLInputElement, node: ModifiableNode) => {
            if (isValid(value, node)) {
                node.setValue(value);
            } else {
                inputElement.classList.add('invalid-input');
            }
        };

        const getInputRow = (node: Middle | Leaf) => {
            const row = document.createElement('tr');
            const labelCell = document.createElement('td');
            const inputCell = document.createElement('td');
            const inputElement = document.createElement('input');

            labelCell.innerText = node.label;

            inputElement.classList.add('config-input');

            switch (typeof node.value) {
                case 'boolean':
                    inputElement.type = 'checkbox';
                    inputElement.oninput = () => handleInput(inputElement.checked, inputElement, node);
                    inputElement.checked = node.value;
                    break;
                case 'number':
                    inputElement.type = 'number';
                    inputElement.oninput = () => handleInput(Number(inputElement.value), inputElement, node);
                    inputElement.value = node.value.toString();
                    break;
                case 'string':
                    inputElement.type = 'text';
                    inputElement.oninput = () => handleInput(inputElement.value, inputElement, node);
                    inputElement.value = node.value;
            }

            row.appendChild(labelCell);
            row.appendChild(inputCell);

            inputCell.appendChild(inputElement);

            if (node instanceof Middle) {
                inputElement.focus();
            }

            return row;
        };

        const loadForm = (inputRows) => {
            const table = document.createElement('table');

            for (const row of inputRows) {
                table.appendChild(row);
            }

            Acceptor.parentElement.appendChild(table);
        };

        const getRows = () => {
            const rows = [getInputRow(this.node)];

            if (this.node.children.length > 0) {
                const [modelChild] = this.node.children;

                if (!(modelChild instanceof Middle)) {
                    rows.push(...this.node.children.map(getInputRow))
                }
            }

            return rows;
        };

        loadForm(getRows());
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    unhighlight(event) {
        event.stopPropagation();

        this.element.classList.add('hovered');
    }

    highlight(event) {
        event.stopPropagation();

        this.element.classList.remove('hovered');
    }

    listen(doListen = true) {
        if (doListen) {
            this.listeners.add(this.element, 'mouseenter', this.highlight.bind(this));
            this.listeners.add(this.element, 'click', this.toggle.bind(this));
            this.listeners.add(this.element, 'mouseleave', this.unhighlight.bind(this));
        } else {
            this.listeners.clear();
        }
    }
}

interface Data {
    predicate?: dataTypes.Predicate;

    [prop: string]: any;
}

export default function getModificationHandler(node: Middle, data: Data): Handler {
    return new Acceptor(node, data.predicate);
}
