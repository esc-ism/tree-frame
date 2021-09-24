import type * as dataTypes from '../../types';
import type * as unions from './unions';

import {isUpper} from '../../validation';

import Middle from './middle';
import Outer from './outer';

import getCreationListeners from '../handlers/create';

export default class Inner extends Middle {
    parent: unions.Upper;
    children: Array<Middle>;
    seed: dataTypes.Middle;

    childType: typeof Inner | typeof Outer;

    constructor(data: dataTypes.Middle, parent?: unions.Upper) {
        super(data, parent);

        const {children} = data;

        this.childType = isUpper(children[0]) ? Inner : Outer;

        this.children = children.map(child => new this.childType(child, this));

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
