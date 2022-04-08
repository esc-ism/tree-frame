import Middle from './middle';
import Child from './child';
import NodeElement from './element';
import {ROOT_CLASS} from './consts';

import * as create from './actions/create';
import * as focus from './actions/focus';

import type * as dataTypes from '../../../../validation/types';

const actions = [create, focus];

export default class Root {
    readonly seed?: dataTypes.Child;
    readonly parentPredicate?: dataTypes.SubPredicate;
    readonly ancestorPredicate?: dataTypes.SubPredicate;

    readonly children: Array<Middle | Child> = [];

    readonly element = new NodeElement();

    constructor({children, ...other}: dataTypes.Root) {
        if ('seed' in other) {
            this.seed = other.seed;
        }

        if ('parentPredicate' in other) {
            this.parentPredicate = other.parentPredicate;
        }

        if ('ancestorPredicate' in other) {
            this.ancestorPredicate = other.ancestorPredicate;
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

        for (const {shouldMount, mount} of actions) {
            if (shouldMount(this)) {
                mount(this);
            }
        }
    }

    getJSON() {
        const {seed} = this;

        return {
            ...(seed ? {seed} : {}),
            'children': this.children.map((child) => child.getJSON())
        };
    }
}