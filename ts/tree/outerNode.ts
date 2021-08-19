import * as types from '../types';
import Leaf from './leaf';

class OuterNode extends Leaf implements types.OuterNode {
    children: Leaf[] = [];
    element: HTMLDivElement;
    valueElement: HTMLSpanElement;
    isFixed: boolean = true;
    depth: number;

    constructor(valueTree, parent, depth) {
        super(valueTree, parent);

        this.depth = depth;

        this.element = document.createElement('div');
        this.element.classList.add('draggable-object');
        this.element.setAttribute('depth', depth);

        this.valueElement = document.createElement('span');
        this.element.appendChild(this.valueElement);

        this.appendChildren(valueTree.children);

        if (parent) {
            parent.element.appendChild(this.element);
        }
    }

    getValueTree() {
        const children = this.children.map(tree => tree.getValueTree());

        if (children.length === 0) {
            return super.getValueTree();
        }

        return {...super.getValueTree(), children};
    }

    getParentalValidityArrays(childNode) {
        const valid = [];
        const invalid = [];

        // Assign self
        if (this.depth === childNode.depth - 1) {
            if (this.children.some(tree => (tree.value === childNode.value && !tree.isSameNode(childNode)))) {
                invalid.push(this);
            } else {
                valid.push(this);
            }
        } else {
            invalid.push(this);
        }

        // Recurse
        if (!this.isDeepestKey) {
            for (let childrenTree of this.children) {
                const arrays = childrenTree.getParentalValidityArrays(childNode);

                valid.push(...arrays.valid);
                invalid.push(...arrays.invalid);
            }
        }

        // Return
        return {valid, invalid};
    }

    renderValue() {
        if (this.depth > 0) {
            this.valueElement.innerText = `${this.value}`;
        }
    }

    /**
     * Updates the node's value.
     *
     * @param {*} value The value to set.
     */
    setValue(value) {
        super.setValue(value);

        this.renderValue();
    }

    renderTreeValues() {
        this.renderValue();

        if (!this.isDeepestKey) {
            for (let tree of this.children) {
                tree.renderTreeValues();
            }
        }
    }

    isSameNode(node) {
        return this.element.isSameNode(node.element);
    }

    setParent(parent) {
        if (this.parent === undefined) {
            this.renderTreeValues();
        }

        this.parent = parent;
    }

    disconnect() {
        if (this.parent) {
            this.parent.disconnectChild(this.value);
        }
    }

    /**
     * Disconnects a child with the given value, if one is found.
     *
     * @param {*} value The value to search for.
     * @returns {boolean} True if a child was removed.
     */
    disconnectChild(value) {
        for (const [i, child] of this.children.entries()) {
            if (child.value === value) {
                child.parent = undefined;
                child.element.remove();

                this.children.splice(i, 1);

                if (this.children.length === 1) {
                    this.children[0].pin();
                }

                return true;
            }
        }

        return false;
    }

    /**
     * Returns the position of this node in its parent's child array.
     *
     * @returns {number} The index.
     */
    getChildIndex() {
        for (const [i, child] of this.parent.children.entries()) {
            if (child.value === this.value) {
                return i;
            }
        }

        throw new Error('Parent has no child with this value');
    }

    appendChildren(valueForest = []) {
        for (const valueTree of valueForest) {
            const childType = ('children' in valueTree) ? (this.isFixed ? FixedKeyNode : KeyNode) : LeafNode;
            const child = new childType(valueTree, this, this.depth + 1);

            this.children.push(child);

            this.addChild(child);
        }
    }

    addChild(child, index) {
        if (index === undefined) {
            this.children.push(child);
        } else {
            this.children.splice(index, 0, child);
        }

        child.setParent(this);

        if (!(child instanceof LeafNode)) {
            if (this.children.length === 1) {
                const [sibling] = this.children;

                sibling.unpin();
            }

            if (index === undefined) {
                this.element.appendChild(child.element);
            } else {
                this.element.insertBefore(child.element, this.children[index]?.element ?? null);
            }
        }
    }
}
