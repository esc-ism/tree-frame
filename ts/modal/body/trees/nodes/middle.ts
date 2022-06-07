import {MIDDLE_CLASS} from './consts';

import type Root from './root';
import Child from './child';

import * as create from './actions/buttons/create';

import type {Middle as _Middle, Child as _Child, SubPredicate} from '../../../../validation/types';

const actions: Array<{
    shouldMount: (node: Middle) => boolean,
    mount: (node: Middle) => void,
    unmount?: (node: Middle) => void
}> = [create];

export default class Middle extends Child implements _Middle {
    readonly children: Array<Middle | Child> = [];

    readonly seed?: _Child;
    readonly childPredicate?: SubPredicate;
    readonly descendantPredicate?: SubPredicate;
    readonly poolId?: number;

    constructor({children, ...data}: _Middle, parent: Root | Middle, index?: number) {
        super(data, parent, index);

        for (const [key, value] of Object.entries(data)) {
            this[key] = value;
        }

        for (const child of children) {
            if ('children' in child) {
                new Middle(child, this);
            } else {
                new Child(child, this);
            }
        }

        this.element.addClass(MIDDLE_CLASS);

        for (const {shouldMount, mount} of actions) {
            if (shouldMount(this)) {
                mount(this);
            }
        }
    }

    duplicate() {
        return new Middle(this.getJSON(), this.parent, this.getIndex() + 1);
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

    updateDepthClass(classCount) {
        super.updateDepthClass(classCount);

        for (const child of this.children) {
            child.updateDepthClass(classCount);
        }
    }

    getJSON(): _Middle {
        const data: any = {'children': this.children.map(child => child.getJSON())};

        if ('seed' in this) {
            data.seed = this.seed;
        }

        return {
            ...data,
            ...super.getJSON()
        };
    }
}
