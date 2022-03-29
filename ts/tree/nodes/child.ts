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

    constructor({label, value, predicate}: dataTypes.Middle | dataTypes.Leaf, parent: Root | Middle, index?: number) {
        this.label = label;
        this.value = value;
        this.predicate = predicate;

        this.element.initialise(value, this.label, predicate);

        this.attach(parent, index);

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

    unmount() {
        for (const action of actions) {
            if ('unmount' in action) {
                action.unmount(this);
            }
        }
    }

    disconnect() {
        this.unmount();

        this.detach();
    }

    getDataTree() {
        const {label, value, predicate} = this;

        return {label, value, predicate};
    }
}
