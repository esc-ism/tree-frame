import type * as dataTypes from '../../types';

import {isUpper} from '../../validation';

import Inner from './inner';
import Outer from './outer';
import type Middle from './middle';

import getCreationListeners from '../handlers/create';

export default class Root {
    static instance: Root;

    readonly children: Array<Middle> = [];
    readonly seed: dataTypes.Middle;

    readonly element = document.getElementById('root');
    private readonly valueElement = document.getElementById('adviser');

    constructor({children, ...optional}: dataTypes.Root) {
        if (Root.instance) {
            throw new Error('Attempt to instantiate a second Root node.');
        }

        Root.instance = this;

        for (const child of children) {
            Inner.isInner(child) ? new Inner(child, this) : new Outer(child, this);
        }

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
