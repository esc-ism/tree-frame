import type * as dataTypes from '../../types';

import {isUpper} from '../../validation';

import Inner from './inner';
import Outer from './outer';
import type Middle from './middle';

import getCreationListeners from '../handlers/create';

export default class Root {
    static instance: Root;

    readonly children: Array<Middle>;
    readonly seed: dataTypes.Middle;

    readonly element = document.getElementById('root');
    private readonly valueElement = document.getElementById('adviser');

    readonly childType: typeof Inner | typeof Outer;

    constructor({children, ...optional}: dataTypes.Root) {
        if (Root.instance) {
            throw new Error('Attempt to instantiate a second Root node.');
        }

        Root.instance = this;

        this.childType = isUpper(children[0]) ? Inner : Outer;

        this.children = children.map(child => new this.childType(child, this));

        if ('seed' in optional) {
            this.seed = optional.seed;
        }

        getCreationListeners(this);
    }

    getDataTree() {
        const {seed} = this;

        return {
            ...(seed ? {seed} : {}),
            'children': this.children.map((child) => child.getDataTree())
        };
    }
}
