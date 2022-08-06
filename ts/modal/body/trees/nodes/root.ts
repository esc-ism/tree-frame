import Middle from './middle';
import Child from './child';
import NodeElement from './element';
import {ROOT_CLASS} from './consts';

import * as highlight from './actions/highlight';
import * as focus from './actions/focus';
import * as create from './actions/buttons/create';

import type {Root as _Root, Child as _Child, SubPredicate} from '@/validation/types';

const actions = [highlight, focus, create];

export default class Root implements _Root {
    readonly children: Array<Middle | Child> = [];

    readonly seed?: _Child;
    readonly childPredicate?: SubPredicate;
    readonly descendantPredicate?: SubPredicate;
    readonly poolId?: number;

    readonly depth: number = 0;
    readonly element: NodeElement;

    constructor({children, ...data}: _Root) {
        this.element = new NodeElement({});
        this.element.addClass(ROOT_CLASS);
        this.element.addDepthClass(0);

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

        for (const {shouldMount, mount} of actions) {
            if (shouldMount(this)) {
                mount(this);
            }
        }
    }

    getRoot() {
        return this;
    }

    updateDepthClass(classCount) {
        for (const child of this.children) {
            child.updateDepthClass(classCount);
        }
    }

    getJSON(): _Root {
        const data: any = {'children': this.children.map(child => child.getJSON())};

        if ('seed' in this) {
            data.seed = this.seed;
        }

        return data;
    }
}
