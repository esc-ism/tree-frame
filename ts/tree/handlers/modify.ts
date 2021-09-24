import {FunctionPredicate, Predicate, Value} from '../../types';

import {Listeners} from './utils';

import type Leaf from '../nodes/leaf';
import Middle from '../nodes/middle';

type ModifiableNode = Leaf | Middle;

class Form {
    static readonly elements = {
        'form': document.getElementById('form-page'),
        'wrapper': document.getElementById('form-page-wrapper')
    };

    static getFunctionPredicate(predicate: Predicate): FunctionPredicate {
        switch (typeof predicate) {
            case 'boolean':
                return () => predicate;

            case 'function':
                return predicate;

            default:
                return (value) => predicate.indexOf(value) !== -1;
        }
    }

    private readonly node;
    private isOpen: boolean = false;

    constructor(node: Middle) {
        this.node = node;
    }

    close() {
        this.isOpen = false;

        Form.elements.form.innerHTML = '';

        Form.elements.wrapper.classList.remove('selected');
    }

    open() {
        this.isOpen = true;

        Form.elements.wrapper.classList.add('selected');

        const isValid = (value: Value, node: ModifiableNode) => {
            if (node instanceof Middle && node.hasSibling(value)) {
                return false;
            }

            const {predicate} = node;

            switch (typeof predicate) {
                case 'undefined':
                    return false;
            }

            return Form.getFunctionPredicate(node.predicate)(value);
        };

        const handleInput = (value: Value, inputElement: HTMLInputElement, node: ModifiableNode) => {
            if (isValid(value, node)) {
                node.setValue(value);
            } else {
                inputElement.classList.add('invalid-input');
            }
        };

        const getInputRow = (node: Middle | Leaf) => {
            const value = node.getValue();

            const row = document.createElement('tr');
            const labelCell = document.createElement('td');
            const inputCell = document.createElement('td');
            const inputElement = document.createElement('input');

            labelCell.innerText = node.label;

            inputElement.classList.add('config-input');

            switch (typeof value) {
                case 'boolean':
                    inputElement.type = 'checkbox';
                    inputElement.oninput = () => handleInput(inputElement.checked, inputElement, node);
                    inputElement.checked = value;
                    break;
                case 'number':
                    inputElement.type = 'number';
                    inputElement.oninput = () => handleInput(Number(inputElement.value), inputElement, node);
                    inputElement.value = value.toString();
                    break;
                case 'string':
                    inputElement.type = 'text';
                    inputElement.oninput = () => handleInput(inputElement.value, inputElement, node);
                    inputElement.value = value;
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

            Form.elements.form.appendChild(table);
        };

        const getRows = () => {
            const rows = [getInputRow(this.node)];

            if (this.node.children.length > 0) {
                const [modelChild] = this.node.children;

                if (!(modelChild instanceof Middle)) {
                    rows.push(...this.node.children.map(getInputRow));
                }
            }

            return rows;
        };

        loadForm(getRows());
    }

    public toggle() {
        if (this.isOpen) {
            close();
        } else {
            open();
        }
    }
}

function accept(node: Middle): Listeners {
    const {element} = node;

    function unhighlight(event) {
        event.stopPropagation();

        element.classList.add('hovered');
    }

    function highlight(event) {
        event.stopPropagation();

        element.classList.remove('hovered');
    }

    return (() => {
        const form = new Form(node);
        const listeners = new Listeners();

        listeners.add(element, 'mouseenter', highlight.bind(this));
        listeners.add(element, 'click', form.toggle.bind(this));
        listeners.add(element, 'mouseleave', unhighlight.bind(this));

        return listeners;
    })();
}

export default function getListeners(node: Middle): Listeners {
    return accept(node);
}
