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

    constructor(data: dataTypes.Inner, parent: unions.Upper, isConnected: boolean = true) {
        super(data, parent, isConnected);

        this.element.classList.add('inner');

        if ('seed' in data) {
            this.seed = data.seed;
        }

        for (const child of data.children) {
            Inner.isInner(child) ? new Inner(child, this) : new Outer(child, this);
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
