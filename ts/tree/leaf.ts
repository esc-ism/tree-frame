import * as types from '../types';

type Parent = types.OuterNode | types.FixedOuterNode;

export default class Leaf implements types.Leaf {
    label: string;
    value: types.Value;
    predicate: types.Predicate;
    parent: OuterNode | FixedOuterNode;

    constructor({label, value, predicate}: types.Leaf, parent) {
        this.value = value;
        this.label = label;
        this.predicate = predicate;
        this.parent = parent;
    }

    setValue(value: types.Value) {
        this.value = value;
    }

    getValueTree() {
        return {'value': this.value};
    }

    setParent(parent: Parent) {
        this.parent = parent;
    }
}
