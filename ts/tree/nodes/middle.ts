import {EventEmitter} from 'eventemitter3';

import type * as dataTypes from '../../types';
import type * as unions from './unions';

import ValueHolder from './valueHolder';
import type Leaf from './leaf';

import * as edit from '../handlers/edit';
// import * as move from '../handlers/move';
import * as disconnect from '../handlers/delete';

import NodeElement from './element';

const actions = [edit, disconnect];

export default abstract class Middle extends ValueHolder {
    predicate: dataTypes.Predicate;

    parent: unions.Upper;
    abstract children: Array<Middle | Leaf>;

    element: NodeElement = new NodeElement();

    emitter = new EventEmitter();

    protected constructor({label, value, ...others}: dataTypes.Middle, parent: unions.Upper, index?: number) {
        super(label, value);

        this.element.render(value);

        this.attach(parent, index);

        if ('predicate' in others) {
            this.predicate = others.predicate;
        }

        for (const {shouldMount, mount} of actions) {
            if (shouldMount(this)) {
                mount(this);
            }
        }

        if (!parent.seed) {
            this.pin();
        }
    }

    setValue(value: dataTypes.Value): void {
        super.setValue(value);

        this.element.render(value);
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

        parent.element.addChild(this.element, index);

        parent.children.splice(index, 0, this);
    }

    disconnect() {
        const siblings = this.parent.children;

        siblings.splice(siblings.indexOf(this), 1);

        if (siblings.length === 1) {
            siblings[0].pin();
        }

        this.element.remove();

        this.parent = undefined;

        for (const action of actions) {
            if ('unmount' in action) {
                action.unmount(this);
            }
        }
    }

    unpin() {
        if (!this.parent.seed) {
            return;
        }
    }

    pin() {
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
