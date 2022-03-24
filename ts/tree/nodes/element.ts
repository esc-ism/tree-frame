let highlighted: Element;

export default class Element {
    root: HTMLElement = document.createElement('div');
    valueAligner: HTMLElement = document.createElement('span');
    valueElement: HTMLElement = document.createElement('span');
    childContainer: HTMLElement = document.createElement('div');
    buttonContainer: HTMLElement = document.createElement('span');

    constructor() {
        this.valueElement.classList.add('internal-node-value');

        this.root.classList.add('internal-node', 'middle');

        this.valueAligner.classList.add('internal-node-aligner', 'border-top', 'border-bottom');

        this.buttonContainer.classList.add('node-button-container');

        this.unhighlight();

        this.root.addEventListener('mouseover', (event) => {
            event.stopPropagation();

            this.highlight();
        });

        this.root.addEventListener('mouseout', () => {
            this.unhighlight();
        });

        this.valueAligner.appendChild(this.valueElement);
        this.root.appendChild(this.buttonContainer);
        this.root.appendChild(this.valueAligner);
        this.root.appendChild(this.childContainer);
    }

    render(value: unknown) {
        this.valueElement.innerText = value.toString();
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

    addClass(name: string) {
        this.root.classList.add(name);
    }

    addChild(child: Element, index) {
        this.childContainer.insertBefore(child.root, this.childContainer.children[index] ?? null);
    }

    addButton(button: Node, index: number) {
        this.buttonContainer.insertBefore(button, this.buttonContainer.children[index]);
    }

    remove() {
        this.root.remove();
    }
}

// TODO
/**
 * You need 4 buttons -
 * - create child
 * - delete
 * - move
 * - edit
 *
 * Make them in the handlers. Make a container for them here.
 * Not sure if they should be positioned before or after the node text. Try both.
 * You want them to be rainbow coloured, circular buttons.
 * Obvs cursor: pointer. Add some extra brightness and size when hovered.
 * Try adding size via box shadow.
 * Blur and dim the buttons when the node isn't hovered.
 * Try blurring via inset box-shadow. You can dim by lowering container opacity.
 */
