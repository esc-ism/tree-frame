import {FunctionPredicate, Predicate, Value} from '../../types';

import {Listeners} from './utils';

import type Leaf from '../nodes/leaf';
import Middle from '../nodes/middle';

type ModifiableNode = Leaf | Middle;

const accept = (function() {
    const ELEMENTS = {
        'form': document.getElementById('form-page'),
        'table': document.getElementById('config-table'),
        'closer': document.getElementById('form-page-closer'),
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
        ELEMENTS.form.classList.remove('selected');

        activeNode.select(false);

        activeNode = null;
    }

    function open() {
        ELEMENTS.form.classList.add('selected');

        activeNode.select();

        const isValid = (value: Value, node: ModifiableNode): boolean => {
            if (node instanceof Middle && node.hasSibling(value)) {
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

            row.classList.add('config-row');
            labelCell.classList.add('config-label-cell');
            inputCell.classList.add('config-input-cell');
            inputElement.classList.add('config-input');

            labelCell.innerText = node.label;

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

            row.appendChild(labelCell);
            row.appendChild(inputCell);

            inputCell.appendChild(inputElement);

            if (node instanceof Middle) {
                inputElement.focus();
            }

            return row;
        };

        const loadForm = (inputRows) => {
            const {table} = ELEMENTS;

            table.innerHTML = '';

            for (const row of inputRows) {
                table.appendChild(row);
            }
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

    ELEMENTS.closer.addEventListener('click', close);

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
