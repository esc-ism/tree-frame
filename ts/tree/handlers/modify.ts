import {FunctionPredicate, Predicate, Value} from '../../types';

import {Listeners} from './utils';

import type Leaf from '../nodes/leaf';
import Middle from '../nodes/middle';

type ModifiableNode = Leaf | Middle;

const accept = (function() {
    const SELECTED_CLASS = 'selected';
    const ELEMENTS = {
        'form': document.getElementById('form-page'),
        'wrapper': document.getElementById('form-page-wrapper')
    };

    let activeNode = null;

    function getFunctionPredicate(predicate: Predicate): FunctionPredicate {
        switch (typeof predicate) {
            case 'boolean':
                return () => predicate;

            case 'function':
                return predicate;

            default:
                return (value) => predicate.indexOf(value) !== -1;
        }
    }

    function close() {
        ELEMENTS.form.innerHTML = '';
        ELEMENTS.wrapper.classList.remove(SELECTED_CLASS);

        activeNode.element.classList.remove(SELECTED_CLASS);

        activeNode = null;
    }

    function open() {
        ELEMENTS.wrapper.classList.add(SELECTED_CLASS);

        activeNode.element.classList.add(SELECTED_CLASS);

        const isValid = (value: Value, node: ModifiableNode) => {
            if (node instanceof Middle && node.hasSibling(value)) {
                return false;
            }

            const {predicate} = node;

            switch (typeof predicate) {
                case 'undefined':
                    return false;
            }

            return getFunctionPredicate(node.predicate)(value);
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

            ELEMENTS.form.appendChild(table);
        };

        const getRows = () => {
            const rows = [getInputRow(activeNode)];

            if (activeNode.children.length > 0) {
                const [modelChild] = activeNode.children;

                if (!(modelChild instanceof Middle)) {
                    rows.push(...activeNode.children.map(getInputRow));
                }
            }

            return rows;
        };

        loadForm(getRows());
    }

    return function (node: Middle): Listeners {
        function toggle() {
            if (activeNode === node) {
                close();
            } else {
                if (activeNode) {
                    close();
                }

                activeNode = node;

                open();
            }
        }

        return (() => {
            const listeners = new Listeners();

            listeners.add(node.element, 'click', (event) => {
                event.stopPropagation();

                toggle();
            });

            return listeners;
        })();
    };
})();

export default function getListeners(node: Middle): Listeners {
    return accept(node);
}
