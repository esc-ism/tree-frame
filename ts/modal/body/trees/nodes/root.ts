import Middle from './middle';
import Child from './child';
import NodeElement from './element';
import {ROOT_CLASS} from './consts';

import * as create from './actions/create';
import * as focus from './actions/focus';
import * as highlight from './actions/highlight';

import type {Root as _Root, Child as _Child, SubPredicate} from '../../../../validation/types';

const actions = [create, focus, highlight];

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

        if (children.length === 0) {
            if (this.seed) {
                if ('children' in this.seed) {
                    new Middle(this.seed, this);
                } else {
                    new Child(this.seed, this);
                }
            }
        } else {
            for (const child of children) {
                if ('children' in child) {
                    new Middle(child, this);
                } else {
                    new Child(child, this);
                }
            }
        }

        for (const {shouldMount, mount} of actions) {
            if (shouldMount(this)) {
                mount(this);
            }
        }
    }

    updateDepthClass(classCount) {
        for (const child of this.children) {
            child.updateDepthClass(classCount);
        }
    }

    getJSON(): _Root {
        const {seed} = this;

        return {
            ...(seed ? {seed} : {}),
            'children': this.children.map((child) => child.getJSON())
        };
    }
}
