import type * as dataTypes from '../../types';
import type * as unions from './unions';

import Middle from './middle';

import Leaf from './leaf';

export default class Outer extends Middle {
    parent: unions.Upper;
    children: Leaf[] = [];

    constructor(data: dataTypes.Middle, parent: unions.Upper, isConnected: boolean = true) {
        super(data, parent, isConnected);

        const {children} = data;

        for (const child of children) {
            this.children.push(new Leaf(child, this));
        }
    }
}
