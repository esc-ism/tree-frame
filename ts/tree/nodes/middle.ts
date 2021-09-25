import type * as dataTypes from '../../types';
import type * as unions from './unions';

import getPin from '../elements/pin';

import type Leaf from './leaf';

import type {Listeners} from '../handlers/utils';
import getModificationListeners from '../handlers/modify';
import getRelocationListeners from '../handlers/relocate';
import getDeletionListeners from '../handlers/delete';

import ValueHolder from './valueHolder';

export default abstract class Middle extends ValueHolder {
    predicate: dataTypes.Predicate;

    parent: unions.Upper;
    abstract children: Array<Middle | Leaf>;

    element: HTMLElement = document.createElement('div');
    valueElement: HTMLElement = document.createElement('span');

    listeners: Array<Listeners> = [];

    protected constructor({label, value, children, ...optional}: dataTypes.Middle, parent: unions.Upper) {
        super(label, value);

        this.element.draggable = true;
        this.element.classList.add('internal-node', 'middle');
        this.element.appendChild(this.valueElement);

        this.render();
        this.attach(parent);

        if ('predicate' in optional) {
            this.predicate = optional.predicate;
        }

        this.listeners.push(
            getModificationListeners(this),
            getRelocationListeners(this),
            getDeletionListeners(this)
        );
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

        for (const listener of this.listeners) {
            listener.clear();
        }
    }

    disconnectHandlers() {
        for (const listener of this.listeners) {
            listener.clear();
        }
    }

    unpin() {
        this.element.draggable = true;

        if (this.element.childNodes.length < 2) {
            return;
        }

        const {firstChild} = this.element;

        if (firstChild.nodeName === 'svg') {
            firstChild.remove();
        }
    }

    pin() {
        this.element.draggable = false;

        if (!(this.parent instanceof Middle)) {
            return;
        }

        this.element.insertBefore(getPin(), this.element.firstChild);
    }

    getDataTree() {
        const {label, value, predicate} = this;
        const children = this.children.map(child => child.getDataTree());

        return {label, value, predicate, children};
    }
}
