import type Root from './root';
import type Middle from './middle';
import NodeElement from './element';

import * as edit from './actions/edit';
import * as disconnect from './actions/delete';
import * as focus from './actions/focus';
import * as move from './actions/move';
import * as highlight from './actions/highlight';

import type {Child as _Child, Value, Predicate, Input} from '../../../../validation/types';
import {getDepthClassCount} from '../style/update/depth';

const actions: Array<{
    shouldMount: (node: Child) => boolean,
    mount: (node: Child) => void,
    unmount?: (node: Child) => void
}> = [disconnect, focus, move, edit, highlight];

export default class Child {
    readonly label?: string;
    value?: Value;
    readonly predicate?: Predicate;
    readonly input?: Input;

    parent: Root | Middle;
    readonly depth: number;
    readonly element: NodeElement;

    constructor(data: _Child, parent: Root | Middle, index?: number) {
        this.depth = parent.depth + 1;
        this.element = new NodeElement(data);
        this.element.addDepthClass(this.depth % getDepthClassCount());

        for (const [key, value] of Object.entries(data)) {
            this[key] = value;
        }

        this.attach(parent, index);

        for (const {shouldMount, mount} of actions) {
            if (shouldMount(this)) {
                mount(this);
            }
        }
    }

    getRoot() {
        return 'parent' in this.parent ? this.parent.getRoot() : this.parent;
    }

    getIndex() {
        return this.parent.children.indexOf(this);
    }

    getSiblings(): Array<Child> {
        const index = this.getIndex();
        const siblings = this.parent.children;

        return [...siblings.slice(0, index), ...siblings.slice(index + 1)];
    }

    updateDepthClass(classCount) {
        this.element.addDepthClass(this.depth % classCount);
    }

    detach() {
        this.parent.children.splice(this.getIndex(), 1);

        this.element.remove();

        this.parent = undefined;
    }

    attach(parent: Middle | Root, index: number = parent.children.length) {
        parent.children.splice(index, 0, this);

        parent.element.addChild(this.element, index);

        this.parent = parent;
    }

    move(parent: Middle | Root, to: number | Child) {
        this.detach();

        this.attach(parent, typeof to === 'number' ? to : to.getIndex() + 1);
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

    getJSON(): _Child {
        const {label, value, predicate} = this;

        return {label, value, predicate};
    }
}
