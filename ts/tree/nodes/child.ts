import type * as dataTypes from '../../types';
import {Value} from '../../types';

import * as edit from '../handlers/edit';
import * as disconnect from '../handlers/delete';
import * as focus from '../handlers/focus';
// import * as move from '../handlers/move';

import NodeElement from '../element';

import type Root from './root';
import type Middle from './middle';

const actions: Array<{
    shouldMount: (node: Child) => boolean,
    mount: (node: Child) => void,
    unmount?: (node: Child) => void
}> = [edit, disconnect, focus];

export default class Child {
    public readonly label: string;
    protected value: Value;

    predicate: dataTypes.Predicate;
    parent: Root | Middle;

    element: NodeElement = new NodeElement();

    constructor({label, value, ...others}: dataTypes.Middle | dataTypes.Leaf, parent: Root | Middle, index?: number) {
        this.label = label;
        this.value = value;

        this.element.render(value, this.label);

        this.attach(parent, index);

        if ('predicate' in others) {
            this.predicate = others.predicate;
        }

        for (const {shouldMount, mount} of actions) {
            if (shouldMount(this)) {
                mount(this);
            }
        }
    }

    setValue(value: dataTypes.Value): void {
        this.value = value;

        this.element.render(value);
    }

    public getValue(): Value {
        return this.value;
    }

    hasSibling(value: dataTypes.Value) {
        for (const sibling of this.parent.children) {
            if (sibling !== this && sibling.getValue() === value) {
                return true;
            }
        }

        return false;
    }

    attach(parent: Middle | Root, index: number = parent.children.length) {
        this.parent = parent;

        parent.element.addChild(this.element, index);

        parent.children.splice(index, 0, this);
    }

    disconnect() {
        const siblings = this.parent.children;

        // @ts-ignore
        siblings.splice(siblings.indexOf(this), 1);

        this.element.remove();

        this.parent = undefined;

        for (const action of actions) {
            if ('unmount' in action) {
                action.unmount(this);
            }
        }
    }

    getDataTree() {
        const {label, value, predicate} = this;

        return {label, value, predicate};
    }
}
