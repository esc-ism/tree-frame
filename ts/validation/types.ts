// Value types

export const VALUE_TYPES = ['boolean', 'number', 'string'] as const;
export type Value = boolean | string | number;

// 'number' is intentionally not included
export const PREDICATE_TYPES = ['boolean', 'function', 'array'] as const;
export type Predicate = boolean | Array<Value> | number | /* For me :) */ ((value: Value) => unknown);

export type SubPredicate = number | /* For me :) */ ((children: Array<Child>) => unknown);

export const INPUT_FORMATS = ['color', 'date', 'datetime-local', 'email', 'month', 'password', 'search', 'tel', 'text', 'time', 'url', 'week'] as const;
export type Input = typeof INPUT_FORMATS[number];

export const CONTRAST_METHODS = ['Black / White', 'Invert'] as const;
export type ContrastMethod = typeof CONTRAST_METHODS[number];

export interface DefaultStyle {
    fontSize?: number;
    tooltipOutline?: string;

    modalOutline?: string;

    headBase?: string;
    headContrast?: ContrastMethod;

    headButtonExit?: string;
    headButtonLabel?: string;
    headButtonLeaf?: string;
    headButtonStyle?: string;

    nodeBase?: Array<string>;
    nodeContrast?: ContrastMethod;

    nodeButtonRemove?: string;
    nodeButtonCreate?: string;
    nodeButtonMove?: string;
    nodeButtonEdit?: string;

    validBackground?: string;
    invalidBackground?: string;

    leafShowBorder?: boolean;
}

export interface UserStyle extends DefaultStyle {
    name: string;
    isActive: boolean;
}

// Group types

export interface _Child {
    // The node's data
    value: Value;

    // The node's purpose
    label?: string;
    // A data validator
    predicate?: Predicate;
    // Indicates a preferred input type
    input?: Input;
}

export interface _Parent {
    // The node's children
    children: Array<Child>;

    // A node that can be added to children
    seed?: Child;
    // Checked before children are modified
    childPredicate?: SubPredicate;
    // Checked before descendants are modified
    descendantPredicate?: SubPredicate;
    // Children may be moved between nodes with poolId values that match their parent's
    poolId?: number;
}

// Node types

export const LEAF_KEYS = ['label', 'value', 'predicate', 'input'] as const;
export const ROOT_KEYS = ['children', 'seed', 'childPredicate', 'descendantPredicate', 'poolId'] as const;
export const MIDDLE_KEYS = [...LEAF_KEYS, ...ROOT_KEYS] as const;

export interface Leaf extends _Child {
}

export interface Root extends _Parent {
}

export interface Middle extends _Child, _Parent {
}

// Node unions

export type Child = Middle | Leaf;
export type Parent = Root | Middle;
export type Node = Root | Child;

// Config type

export const CONFIG_KEYS = ['title', 'defaultTree', 'userTree', 'defaultStyle', 'userStyles'];

export interface Config {
    title: string;
    defaultTree: Root;
    userTree?: Root;
    defaultStyle?: DefaultStyle;
    userStyles: Array<UserStyle>;
}
