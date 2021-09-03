import type * as dataTypes from '../../types';
import type * as nodeTypes from './types';

import getPin from '../elements/pin';

import {Handler} from '../handlers/utils';
import getModificationHandler from '../handlers/modify';
import getCreationHandler from '../handlers/create';

import type Leaf from './leaf';
import type Inner from './inner';
import Root from './root';

export default abstract class Middle implements nodeTypes.Middle {
    label: string;
    value: dataTypes.Value;
    predicate: dataTypes.FunctionPredicate;

    parent: Inner | Root;
    children: Array<Middle | Leaf>;

    element: HTMLElement = document.createElement('div');
    valueElement: HTMLElement = document.createElement('span');

    modificationHandler: Handler;
    relocationHandler: Handler;
    deletionHandler: Handler;

    protected constructor({label, value, children, ...optional}: dataTypes.Middle, parent?: Inner | Root) {
        this.label = label;
        this.value = value;
        this.parent = parent;

        this.element.classList.add('draggable-object', 'middle');

        this.element.appendChild(this.valueElement);

        this.render();

        this.modificationHandler = getModificationHandler(this, optional);
        this.relocationHandler = getCreationHandler(this, optional);
        this.deletionHandler = getCreationHandler(this, optional);
    }

    render() {
        this.valueElement.innerText = this.value.toString();
    }

    setValue(value: dataTypes.Value): void {
        this.value = value;

        this.render();
    }

    attach(parent: Root | Inner, index: number = parent.children.length) {
        this.parent = parent;

        if (parent.children.length === 1) {
            const [sibling] = parent.children;

            sibling.unpin();
        }

        parent.children.splice(index, 0, this);

        parent.element.insertBefore(this.element, parent.children[index]?.element ?? null);
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

        if (this.parent instanceof Root) {
            return;
        }

        this.element.insertBefore(getPin(), this.element.firstChild);
    }
}
