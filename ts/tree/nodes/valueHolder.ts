import type {Value} from '../../types';

export default abstract class ValueHolder {
    public readonly label: string;
    protected value: Value;

    protected constructor(label: string, value: Value) {
        this.label = label;
        this.value = value;
    }

    public setValue(value: Value) {
        this.value = value;
    }

    public getValue(): Value {
        return this.value;
    }
}
