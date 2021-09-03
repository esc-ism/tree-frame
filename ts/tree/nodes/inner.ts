import type * as dataTypes from '../../types';
import type * as nodeTypes from './types';

import {isInner} from '../../validation/validation';

import Outer from './outer';
import Middle from './middle';
import Root from './root';

import {Handler} from '../handlers/utils';
import getCreationHandler from '../handlers/create';

export default class Inner extends Middle implements nodeTypes.Inner {
    parent: Inner | Root;
    children: Array<Middle>;

    creationHandler: Handler;

    childType: typeof Inner | typeof Outer;

    constructor(data: dataTypes.Middle, parent?: Inner | Root) {
        super(data, parent);

        const {children} = data;

        this.childType = isInner(children[0]) ? Inner : Outer;

        this.children = children.map(child => new this.childType(child, this));

        this.creationHandler = getCreationHandler(this, data);
    }
}
