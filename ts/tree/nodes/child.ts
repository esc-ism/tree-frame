import type * as dataTypes from '../../types';
import {Value} from '../../types';

import * as edit from '../handlers/edit';
import * as disconnect from '../handlers/delete';
import * as focus from '../handlers/focus';
import * as move from '../handlers/move';

import NodeElement from '../element';

import type Root from './root';
import type Middle from './middle';

const actions: Array<{
    shouldMount: (node: Child) => boolean,
    mount: (node: Child) => void,
    unmount?: (node: Child) => void
}> = [edit, disconnect, focus, move];

export default class Child {
    public readonly label: string;
    public value: Value;

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

    detach() {
        const siblings = this.parent.children;

        siblings.splice(siblings.indexOf(this), 1);

        this.element.remove();

        this.parent = undefined;
    }

    attach(parent: Middle | Root, index: number = parent.children.length) {
        parent.children.splice(index, 0, this);

        parent.element.addChild(this.element, index);

        this.parent = parent;
    }

    disconnect() {
        for (const action of actions) {
            if ('unmount' in action) {
                action.unmount(this);
            }
        }

        this.detach();
    }

    getDataTree() {
        const {label, value, predicate} = this;

        return {label, value, predicate};
    }
}
