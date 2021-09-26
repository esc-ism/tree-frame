import type * as dataTypes from '../../types';
import type * as unions from './unions';

import Middle from './middle';
import Outer from './outer';

import getCreationListeners from '../handlers/create';

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

    constructor(data: dataTypes.Inner, parent?: unions.Upper) {
        super(data, parent);

        const {children} = data;

        for (const child of children) {
            Inner.isInner(child) ? new Inner(child, this) : new Outer(child, this);
        }

        if ('seed' in data) {
            this.seed = data.seed;
        }

        this.listeners.push(getCreationListeners(this));
    }

    disconnectHandlers() {
        super.disconnectHandlers();

        for (const child of this.children) {
            child.disconnectHandlers();
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
