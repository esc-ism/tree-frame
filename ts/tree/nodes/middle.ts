import type * as dataTypes from '../../types';
import type * as unions from './unions';

import getPin from '../elements/pin';

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
    pinElement: SVGElement = getPin();

    listeners: Array<Listeners> = [];

    protected constructor({label, value, ...others}: dataTypes.Middle, parent: unions.Upper, isConnected: boolean) {
        super(label, value);

        this.valueElement.classList.add('internal-node-value');

        this.element.draggable = true;
        this.element.classList.add('internal-node', 'middle');

        this.valueAligner.classList.add('internal-node-aligner', 'border-top', 'border-bottom');

        this.pinElement.style.visibility = 'hidden';

        this.valueAligner.appendChild(this.pinElement);
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
            getRelocationListeners(this),
            getDeletionListeners(this),
            getHighlightListeners(this),
        );
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

                break;
            default:
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
        this.element.draggable = true;

        this.pinElement.style.visibility = 'hidden';
    }

    pin() {
        this.element.draggable = false;

        if (!(this.parent instanceof Middle)) {
            return;
        }

        this.pinElement.style.removeProperty('visibility');
    }

    getDataTree() {
        const {label, value, predicate} = this;
        const children = this.children.map(child => child.getDataTree());

        return {label, value, predicate, children};
    }
}
