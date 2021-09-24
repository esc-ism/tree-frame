import type * as dataTypes from '../../types';
import type * as unions from './unions';

import Middle from './middle';

import Leaf from './leaf';

export default class Outer extends Middle {
    parent: unions.Upper;
    children: Leaf[];

    constructor(data: dataTypes.Middle, parent?: unions.Upper) {
        super(data, parent);

        const {children} = data;

        this.children = children.map(child => new Leaf(child, this));
    }
}
