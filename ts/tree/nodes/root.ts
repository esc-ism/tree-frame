import type * as dataTypes from '../../types';

import Middle from './middle';
import Child from './child';

import * as create from '../handlers/create';
import * as focus from '../handlers/focus';

import NodeElement from '../element';

const actions = [create, focus];

export default class Root {
    static instance: Root;

    readonly children: Array<Middle | Child> = [];
    readonly seed: dataTypes.Child;

    readonly element = new NodeElement();

    constructor({children, ...optional}: dataTypes.Root) {
        if (Root.instance) {
            throw new Error('Attempt to instantiate a second Root node.');
        }

        Root.instance = this;

        if ('seed' in optional) {
            this.seed = optional.seed;
        }

        if (children.length === 0) {
            if ('children' in this.seed) {
                new Middle(this.seed, this)
            } else {
                new Child(this.seed, this)
            }
        } else {
            for (const child of children) {
                if ('children' in child) {
                    new Middle(child, this)
                } else {
                    new Child(child, this)
                }
            }
        }

        for (const {shouldMount, mount} of actions) {
            if (shouldMount(this)) {
                mount(this);
            }
        }

        this.element.addClass('root');

        document.getElementById('object-tree').appendChild(this.element.root);
    }

    getDataTree() {
        const {seed} = this;

        return {
            ...(seed ? {seed} : {}),
            'children': this.children.map((child) => child.getDataTree())
        };
    }
}
