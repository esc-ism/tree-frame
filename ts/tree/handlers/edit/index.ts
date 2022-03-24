import {Predicate, Value} from '../../../types';

import type Leaf from '../../nodes/leaf';
import Middle from '../../nodes/middle';

import template from './button';

import {addButton} from '../index';
import {ACTION_ID} from './consts';

type ModifiableNode = Leaf | Middle;

const ELEMENTS = {
    'wrapper': document.getElementById('form-page-wrapper'),
    'form': document.getElementById('form-page'),
    'table': document.getElementById('config-table') as HTMLTableElement,
    'closer': document.getElementById('form-page-closer')
};

let activeNode: Middle = null;

export function isValid(predicate: Predicate, value: Value): boolean {
    switch (typeof predicate) {
        case 'boolean':
            return predicate;

        case 'function':
            return predicate(value);

        default:
            return predicate.indexOf(value as string) !== -1;
    }
}

function close() {
    if (!activeNode) {
        return;
    }

    ELEMENTS.wrapper.classList.remove('open');
    ELEMENTS.form.classList.remove('selected');

    for (const inputElement of ELEMENTS.table.querySelectorAll('.config-input')) {
        // Prevents the browser from forcing the viewport over to the input element on focus
        (inputElement as HTMLInputElement).disabled = true;
    }

    activeNode.element.setSelected(false);

    activeNode = null;
}

function open(node: Middle) {
    activeNode = node;

    const {predicate} = node;
    const values = node.parent.children.map((node) => node.getValue());
    const index = node.parent.children.indexOf(node);

    ELEMENTS.wrapper.classList.add('open');
    ELEMENTS.form.classList.add('selected');

    activeNode.element.setSelected();

    const handleInput = (value: Value, inputElement: HTMLInputElement, node: ModifiableNode) => {
        if (isValid(predicate, value)) {
            node.setValue(value);

            values[index] = value;
        } else {
            inputElement.classList.add('invalid-input');
        }
    };

    const getInputElement = (node: ModifiableNode) => {
        const value = node.getValue();

        if (Array.isArray(node.predicate)) {
            const selectElement = document.createElement('select');
            const value = node.getValue();

            selectElement.classList.add('config-input');

            for (const option of node.predicate) {
                const optionElement = document.createElement('option');

                optionElement.value = option;
                optionElement.text = option;

                if (value === option) {
                    optionElement.selected = true;
                }

                selectElement.add(optionElement);
            }

            selectElement.onchange = () => {
                node.setValue(selectElement.value);
            };

            return selectElement;
        } else {
            const inputElement = document.createElement('input');

            switch (typeof value) {
                case 'boolean':
                    inputElement.type = 'checkbox';
                    inputElement.checked = value;
                    inputElement.oninput = () => handleInput(inputElement.checked, inputElement, node);
                    break;

                case 'number':
                    inputElement.type = 'number';
                    inputElement.value = value.toString();
                    inputElement.oninput = () => handleInput(Number(inputElement.value), inputElement, node);
                    break;

                case 'string':
                    inputElement.type = 'text';
                    inputElement.value = value;
                    inputElement.oninput = () => handleInput(inputElement.value, inputElement, node);
            }

            if (node.predicate === false) {
                inputElement.disabled = true;
            }

            return inputElement;
        }
    };

    const getRowElement = (node: ModifiableNode) => {
        const row = document.createElement('tr');
        const labelCell = document.createElement('td');
        const inputCell = document.createElement('td');
        const inputElement: HTMLInputElement | HTMLSelectElement = getInputElement(node);

        labelCell.innerText = node.label;

        row.classList.add('config-row');
        labelCell.classList.add('config-label-cell');
        inputCell.classList.add('config-input-cell');
        inputElement.classList.add('config-input');

        inputCell.appendChild(inputElement);

        row.appendChild(labelCell);
        row.appendChild(inputCell);

        return row;
    };

    const {table} = ELEMENTS;

    while (table.lastChild) {
        table.removeChild(table.lastChild);
    }

    const mainRow = getRowElement(activeNode);

    mainRow.classList.add('selected');

    table.appendChild(mainRow);

    for (const child of activeNode.children) {
        if (child instanceof Middle) {
            break;
        }

        table.appendChild(getRowElement(child));
    }
}

export function toggle(node) {
    const doOpen = node !== activeNode;

    close();

    if (doOpen) {
        open(node);
    }
}

ELEMENTS.closer.addEventListener('click', close);

document.body.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        close();
    }
});

export function mount(node: Middle): void {
    const button = template.cloneNode(true);

    button.addEventListener('click', (event) => {
        event.stopPropagation();

        toggle(node);
    });

    addButton(node, button, ACTION_ID);
}

export function shouldMount(node: Middle): boolean {
    return node.predicate !== false;
}
