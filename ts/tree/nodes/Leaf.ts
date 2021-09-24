import type * as dataTypes from '../../types';

import type Outer from './outer';
import ValueHolder from './valueHolder';

export default class Leaf extends ValueHolder {
    predicate: dataTypes.Predicate;
    parent: Outer;

    constructor({label, value, predicate}: dataTypes.Leaf, parent: Outer) {
        super(label, value);

        this.predicate = predicate;
        this.parent = parent;
    }

    getDataTree() {
        const {label, value, predicate} = this;

        return {label, value, predicate};
    }
}
