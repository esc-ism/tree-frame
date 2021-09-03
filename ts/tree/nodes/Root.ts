import type * as dataTypes from '../../types';
import type * as nodeTypes from './types';

import {isInner} from '../../validation/validation';

import Inner from './inner';
import Outer from './outer';
import type Middle from './middle';

import type {Handler} from '../handlers/utils';
import getCreationHandler from '../handlers/create';

export default class Root implements nodeTypes.Root {
    static instance: Root;

    children: Array<Middle>;

    element = document.getElementById('root');
    valueElement = document.getElementById('adviser');

    creationHandler: Handler;

    childType: typeof Inner | typeof Outer;

    constructor({children, ...optional}: dataTypes.Root) {
        if (Root.instance) {
            throw new Error('Attempt to instantiate a second Root node.');
        }

        Root.instance = this;

        this.childType = isInner(children[0]) ? Inner : Outer;

        this.children = children.map(child => new this.childType(child, this));

        this.creationHandler = getCreationHandler(this, optional);
    }

    forEach(process: (node: unknown, index: number, siblings: unknown[]) => void) {
        for (const [i, child] of this.children.entries()) {
            process(child, i, this.children);
        }
    }
}
