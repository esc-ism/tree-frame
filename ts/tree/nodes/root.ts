import type * as dataTypes from '../../types';

import Inner from './inner';
import Outer from './outer';
import type Middle from './middle';

import * as create from '../handlers/create';

import NodeElement from './element';

const actions = [create];

export default class Root {
    static instance: Root;

    readonly children: Array<Middle> = [];
    readonly seed: dataTypes.Middle;

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
            Inner.isInner(this.seed) ? new Inner(this.seed, this) : new Outer(this.seed, this)
        } else {
            for (const child of children) {
                Inner.isInner(child) ? new Inner(child, this) : new Outer(child, this);
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
