import type Root from './root';
import type Middle from './middle';
import NodeElement from './element';

import * as edit from './actions/edit';
import * as disconnect from './actions/delete';
import * as focus from './actions/focus';
import * as move from './actions/move';

import type * as dataTypes from '../../../../validation/types';
import {getDepthClassCount} from '../style/update/depth';

const actions: Array<{
    shouldMount: (node: Child) => boolean,
    mount: (node: Child) => void,
    unmount?: (node: Child) => void
}> = [disconnect, focus, move, edit];

export default class Child {
    readonly label: string;
    value: dataTypes.Value;
    readonly predicate: dataTypes.Predicate;
    readonly input?: dataTypes.Input;

    readonly depth: number;

    parent: Root | Middle;

    readonly element: NodeElement = new NodeElement();

    constructor({label, value, predicate, ...optional}: dataTypes.Middle | dataTypes.Leaf, parent: Root | Middle, index?: number) {
        this.label = label;
        this.value = value;
        this.predicate = predicate;

        this.depth = parent.depth + 1;

        if ('input' in optional) {
            this.input = optional.input;

            this.element.initialise(value, this.label, predicate, optional.input);
        } else {
            this.element.initialise(value, this.label, predicate);
        }

        this.element.addDepthClass(this.depth % getDepthClassCount());

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

    updateDepthClass(classCount)  {
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

    getJSON(): dataTypes.Child {
        const {label, value, predicate} = this;

        return {label, value, predicate};
    }
}
