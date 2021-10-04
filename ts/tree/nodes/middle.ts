import type * as dataTypes from '../../types';
import type * as unions from './unions';

import ValueHolder from './valueHolder';
import type Leaf from './leaf';

import type {Listeners} from '../handlers/utils';
import getModificationListeners from '../handlers/modify';
import getRelocationListeners from '../handlers/relocate';
import getDeletionListeners from '../handlers/delete';
import getHighlightListeners from '../handlers/highlight';

export default abstract class Middle extends ValueHolder {
    predicate: dataTypes.Predicate;

    parent: unions.Upper;
    abstract children: Array<Middle | Leaf>;

    element: HTMLElement = document.createElement('section');
    valueAligner: HTMLElement = document.createElement('span');
    valueElement: HTMLElement = document.createElement('span');

    listeners: Array<Listeners> = [];

    protected constructor({
        label,
        value,
        ...others
    }: dataTypes.Middle, parent: unions.Upper, isConnected: boolean) {
        super(label, value);

        this.valueElement.classList.add('internal-node-value');

        this.element.classList.add('internal-node', 'middle');

        this.valueAligner.classList.add('internal-node-aligner', 'border-top', 'border-bottom');

        this.valueAligner.appendChild(this.valueElement);
        this.element.appendChild(this.valueAligner);

        this.render();

        if (isConnected) {
            this.attach(parent);
        } else {
            this.parent = parent;
        }

        if ('predicate' in others) {
            this.predicate = others.predicate;
        }

        this.listeners.push(
            getModificationListeners(this),
            getHighlightListeners(this)
        );

        if (parent.seed) {
            this.element.draggable = true;

            this.listeners.push(
                getRelocationListeners(this),
                getDeletionListeners(this)
            );
        } else {
            this.pin();
        }

        if (this.parent.children.length === 1) {
            this.pin();
        }
    }

    select(doSelect = true) {
        if (doSelect) {
            this.valueAligner.classList.add('selected');
        } else {
            this.valueAligner.classList.remove('selected');
        }
    }

    render() {
        this.valueElement.innerText = this.value.toString();
    }

    setValue(value: dataTypes.Value): void {
        super.setValue(value);

        this.render();
    }

    hasSibling(value: dataTypes.Value) {
        for (const sibling of this.parent.children) {
            if (sibling !== this && sibling.getValue() === value) {
                return true;
            }
        }

        return false;
    }

    attach(parent: unions.Upper, index: number = parent.children.length) {
        this.parent = parent;

        switch (parent.children.length) {
            case 0:
                this.pin();

                break;
            case 1:
                const [sibling] = parent.children;

                sibling.unpin();
            default:
                this.unpin();
        }

        parent.element.insertBefore(this.element, parent.children[index]?.element ?? null);

        parent.children.splice(index, 0, this);
    }

    disconnect() {
        const siblings = this.parent.children;

        siblings.splice(siblings.indexOf(this), 1);

        if (siblings.length === 1) {
            const [sibling] = siblings;

            sibling.pin();
        }

        this.element.remove();

        this.parent = undefined;
    }

    disconnectHandlers() {
        for (const listener of this.listeners) {
            listener.clear();
        }
    }

    unpin() {
        if (!this.parent.seed) {
            return;
        }

        this.element.draggable = true;
    }

    pin() {
        this.element.removeAttribute('draggable');

        if (!(this.parent instanceof Middle)) {
            return;
        }
    }

    getDataTree() {
        const {label, value, predicate} = this;
        const children = this.children.map(child => child.getDataTree());

        return {label, value, predicate, children};
    }
}
