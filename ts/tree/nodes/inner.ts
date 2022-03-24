import type * as dataTypes from '../../types';
import type * as unions from './unions';

import Middle from './middle';
import Outer from './outer';

import * as create from '../handlers/create';

const actions = [create];

export default class Inner extends Middle {
    static isInner(data: dataTypes.Middle): data is dataTypes.Inner {
        if ('seed' in data) {
            return true;
        }

        const [child] = data.children;

        return child ? 'children' in child : false;
    }

    parent: unions.Upper;
    children: Array<Middle> = [];
    seed: dataTypes.Middle;

    constructor(data: dataTypes.Inner, parent: unions.Upper, index?: number) {
        super(data, parent, index);

        this.element.addClass('inner');

        if ('seed' in data) {
            this.seed = data.seed;
        }

        for (const child of data.children) {
            Inner.isInner(child) ? new Inner(child, this) : new Outer(child, this);
        }

        for (const {shouldMount, mount} of actions) {
            if (shouldMount(this)) {
                mount(this);
            }
        }
    }

    disconnect() {
        super.disconnect();

        for (const child of this.children) {
            child.disconnect();
        }
    }

    getDataTree() {
        const {seed} = this;

        return {
            ...(seed ? {seed} : {}),
            ...super.getDataTree()
        };
    }
}
