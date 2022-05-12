import {MIDDLE_CLASS} from './consts';

import type Root from './root';
import Child from './child';

import * as create from './actions/create';

import type {Middle as _Middle, Child as _Child, SubPredicate} from '../../../../validation/types';

const actions: Array<{
    shouldMount: (node: Middle) => boolean,
    mount: (node: Middle) => void,
    unmount?: (node: Middle) => void
}> = [create];

export default class Middle extends Child {
    readonly children: Array<Middle | Child> = [];

    readonly seed?: _Child;
    readonly childPredicate?: SubPredicate;
    readonly descendantPredicate?: SubPredicate;
    readonly poolId?: number;

    constructor({children, ...other}: _Middle, parent: Root | Middle, index?: number) {
        super(other, parent, index);

        if ('seed' in other) {
            this.seed = other.seed;
        }

        if ('childPredicate' in other) {
            this.childPredicate = other.childPredicate;
        }

        if ('descendantPredicate' in other) {
            this.descendantPredicate = other.descendantPredicate;
        }

        if ('poolId' in other) {
            this.poolId = other.poolId;
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

    getJSON(): _Middle {
        const {seed} = this;

        return {
            'children': this.children.map(child => child.getJSON()),
            ...(seed ? {seed} : {}),
            ...super.getJSON()
        };
    }
}
