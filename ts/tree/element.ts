let highlighted: Element;

export default class Element {
    root: HTMLElement = document.createElement('div');

    dataContainer: HTMLElement = document.createElement('div');

    buttonContainer: HTMLElement = document.createElement('span');

    valueAligner: HTMLElement = document.createElement('span');
    valueElement: HTMLElement = document.createElement('span');
    labelElement: HTMLElement = document.createElement('span');

    childContainer: HTMLElement = document.createElement('div');

    buttons: Array<Node> = [];

    constructor() {
        this.root.classList.add('node');

        this.dataContainer.classList.add('node-data-container');

        this.buttonContainer.classList.add('node-button-container');

        this.valueAligner.classList.add('node-aligner');
        this.valueElement.classList.add('node-value');
        this.labelElement.classList.add('node-label');

        this.unhighlight();

        this.dataContainer.addEventListener('mouseover', (event) => {
            event.stopPropagation();

            this.highlight();
        });

        this.dataContainer.addEventListener('mouseout', () => {
            this.unhighlight();
        });

        this.valueAligner.appendChild(this.valueElement);
        this.valueAligner.appendChild(this.labelElement);

        this.dataContainer.appendChild(this.buttonContainer);
        this.dataContainer.appendChild(this.valueAligner);

        this.root.appendChild(this.dataContainer);
        this.root.appendChild(this.childContainer);
    }

    render(value: unknown, label?: string) {
        this.valueElement.innerText = value.toString();

        if (label) {
            this.labelElement.innerText = label;
        }

        //     if (Array.isArray(node.predicate)) {
        //         const selectElement = document.createElement('select');
        //         const value = node.getValue();
        //
        //         selectElement.classList.add('config-input');
        //
        //         for (const option of node.predicate) {
        //             const optionElement = document.createElement('option');
        //
        //             optionElement.value = option;
        //             optionElement.text = option;
        //
        //             if (value === option) {
        //                 optionElement.selected = true;
        //             }
        //
        //             selectElement.add(optionElement);
        //         }
        //
        //         selectElement.onchange = () => {
        //             node.setValue(selectElement.value);
        //         };
        //
        //         return selectElement;
        //     } else {
        //         const inputElement = document.createElement('input');
        //
        //         switch (typeof value) {
        //             case 'boolean':
        //                 inputElement.type = 'checkbox';
        //                 inputElement.checked = value;
        //                 inputElement.oninput = () => handleInput(inputElement.checked, inputElement, node);
        //                 break;
        //
        //             case 'number':
        //                 inputElement.type = 'number';
        //                 inputElement.value = value.toString();
        //                 inputElement.oninput = () => handleInput(Number(inputElement.value), inputElement, node);
        //                 break;
        //
        //             case 'string':
        //                 inputElement.type = 'text';
        //                 inputElement.value = value;
        //                 inputElement.oninput = () => handleInput(inputElement.value, inputElement, node);
        //         }
        //
        //         if (node.predicate === false) {
        //             inputElement.disabled = true;
        //         }
        //
        //         return inputElement;
        //     }
        // };
        //
        // const getRowElement = (node: ModifiableNode) => {
        //     const row = document.createElement('tr');
        //     const labelCell = document.createElement('td');
        //     const inputCell = document.createElement('td');
        //     const inputElement: HTMLInputElement | HTMLSelectElement = getInputElement(node);
        //
        //     labelCell.innerText = node.label;
        //
        //     row.classList.add('config-row');
        //     labelCell.classList.add('config-label-cell');
        //     inputCell.classList.add('config-input-cell');
        //     inputElement.classList.add('config-input');
        //
        //     inputCell.appendChild(inputElement);
        //
        //     row.appendChild(labelCell);
        //     row.appendChild(inputCell);
        //
        //     return row;
        // };
        //
        // const {table} = ELEMENTS;
        //
        // while (table.lastChild) {
        //     table.removeChild(table.lastChild);
        // }
        //
        // const mainRow = getRowElement(activeNode);
        //
        // mainRow.classList.add('selected');
        //
        // table.appendChild(mainRow);
        //
        // for (const child of activeNode.children) {
        //     if (child instanceof Middle) {
        //         break;
        //     }
        //
        //     table.appendChild(getRowElement(child));
        // }
    }

    setSelected(doSelect = true) {
        if (doSelect) {
            this.valueAligner.classList.add('selected');
        } else {
            this.valueAligner.classList.remove('selected');
        }
    }

    unhighlight() {
        this.buttonContainer.classList.add('blur');
    }

    highlight() {
        if (highlighted) {
            highlighted.unhighlight();
        }

        this.buttonContainer.classList.remove('blur');
    }

    addClass(...names: string[]) {
        for (const name of names) {
            this.dataContainer.classList.add(name);
        }
    }

    removeClass(...names: string[]) {
        for (const name of names) {
            this.dataContainer.classList.remove(name);
        }
    }

    addChild(child: Element, index) {
        this.childContainer.insertBefore(child.root, this.childContainer.children[index] ?? null);
    }

    addButton(button: Node, index: number) {
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
