import type * as dataTypes from '../../types';
import type * as nodeTypes from './types';

import type Outer from './outer';

export default class Leaf implements nodeTypes.ValueHolder {
    label: string;
    value: dataTypes.Value;
    predicate: dataTypes.FunctionPredicate;

    parent: Outer;

    constructor({label, value, predicate}: dataTypes.Leaf, parent: Outer) {
        this.label = label;
        this.value = value;
        this.predicate = Array.isArray(predicate) ? (value) => predicate.indexOf(value) !== -1 : predicate;

        this.parent = parent;
    }

    setValue(value: dataTypes.Value): void {
        this.value = value;
    }
}
