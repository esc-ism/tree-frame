import type * as dataTypes from '../../types';

import type Root from './root';
import Child from './child';

import * as create from '../handlers/create';

const actions: Array<{
    shouldMount: (node: Middle) => boolean,
    mount: (node: Middle) => void,
    unmount?: (node: Middle) => void
}> = [create];

export default class Middle extends Child {
    seed: dataTypes.Middle;
    children: Array<Middle | Child> = [];

    constructor({children, ...data}: dataTypes.Middle, parent: Root | Middle, index?: number) {
        super(data, parent, index);

        if ('seed' in data) {
            this.seed = data.seed;
        }

        for (const child of children) {
            if ('children' in child) {
                new Middle(child, this)
            } else {
                new Child(child, this)
            }
        }

        this.element.addClass('middle');

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

    getDataTree() {
        const {seed} = this;

        return {
            'children': this.children.map(child => child.getDataTree()),
            ...(seed ? {seed} : {}),
            ...super.getDataTree()
        };
    }
}
