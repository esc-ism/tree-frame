import type * as dataTypes from '../../types';
import type * as nodeTypes from './types';

import Middle from './middle';

import Leaf from './leaf';
import type Inner from './inner';
import type Root from './root';

export default class Outer extends Middle implements nodeTypes.Outer {
    parent: Inner | Root;
    children: Leaf[];

    constructor(data: dataTypes.Middle, parent?: Inner | Root) {
        super(data, parent);

        const {children} = data;

        this.children = children.map(child => new Leaf(child, this));
    }
}
