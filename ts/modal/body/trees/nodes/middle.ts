import {MIDDLE_CLASS} from './consts';

import type Root from './root';
import Child from './child';

import * as create from './actions/create';

import type * as dataTypes from '../../../../validation/types';

const actions: Array<{
    shouldMount: (node: Middle) => boolean,
    mount: (node: Middle) => void,
    unmount?: (node: Middle) => void
}> = [create];

export default class Middle extends Child {
    readonly seed?: dataTypes.Child;
    readonly parentPredicate?: dataTypes.SubPredicate;
    readonly ancestorPredicate?: dataTypes.SubPredicate;

    readonly children: Array<Middle | Child> = [];

    constructor({children, ...other}: dataTypes.Middle, parent: Root | Middle, index?: number) {
        super(other, parent, index);

        if ('seed' in other) {
            this.seed = other.seed;
        }

        if ('parentPredicate' in other) {
            this.parentPredicate = other.parentPredicate;
        }

        if ('ancestorPredicate' in other) {
            this.ancestorPredicate = other.ancestorPredicate;
        }

        for (const child of children) {
            if ('children' in child) {
                new Middle(child, this)
            } else {
                new Child(child, this)
            }
        }

        this.element.addClass(MIDDLE_CLASS);

        for (const {shouldMount, mount} of actions) {
            if (shouldMount(this)) {
                mount(this);
            }
        }
    }

    unmount() {
        super.unmount();

        for (const action of actions) {
            if ('unmount' in action) {
                action.unmount(this);
            }
        }
    }

    disconnect() {
        this.unmount();

        for (const child of this.children) {
            child.disconnect();
        }

        this.detach();
    }

    updateDepthClass(classCount)  {
        super.updateDepthClass(classCount);

        for (const child of this.children) {
            child.updateDepthClass(classCount);
        }
    }

    getJSON() {
        const {seed} = this;

        return {
            'children': this.children.map(child => child.getJSON()),
            ...(seed ? {seed} : {}),
            ...super.getJSON()
        };
    }
}
