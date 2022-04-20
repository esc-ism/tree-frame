import Middle from './middle';
import Child from './child';
import NodeElement from './element';
import {ROOT_CLASS} from './consts';

import * as create from './actions/create';
import * as focus from './actions/focus';

import type * as dataTypes from '../../../../validation/types';

const actions = [create, focus];

export default class Root implements dataTypes.Root {
    readonly seed?: dataTypes.Child;
    readonly childPredicate?: dataTypes.SubPredicate;
    readonly descendantPredicate?: dataTypes.SubPredicate;

    readonly children: Array<Middle | Child> = [];

    readonly depth = 0;

    readonly element = new NodeElement();

    constructor({children, ...other}: dataTypes.Root) {
        if ('seed' in other) {
            this.seed = other.seed;
        }

        if ('childPredicate' in other) {
            this.childPredicate = other.childPredicate;
        }

        if ('descendantPredicate' in other) {
            this.descendantPredicate = other.descendantPredicate;
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

        this.element.addClass(ROOT_CLASS);
        this.element.addDepthClass(0);

        for (const {shouldMount, mount} of actions) {
            if (shouldMount(this)) {
                mount(this);
            }
        }
    }

    updateDepthClass(classCount)  {
        for (const child of this.children) {
            child.updateDepthClass(classCount);
        }
    }

    getJSON(): dataTypes.Root {
        const {seed} = this;

        return {
            ...(seed ? {seed} : {}),
            'children': this.children.map((child) => child.getJSON())
        };
    }
}
