// Value types

export const VALUE_TYPES = ['boolean', 'number', 'string'] as const;
export type Value = boolean | string | number;

export const INPUT_TYPES = ['color', 'date', 'datetime-local', 'email', 'month', 'password', 'search', 'tel', 'text', 'time', 'url', 'week'] as const;
export type Input = typeof INPUT_TYPES[number];

export const PREDICATE_TYPES = ['boolean', 'function', 'array'] as const;
export type Predicate = boolean | ((value: Value) => unknown) | Array<Value>;

export type SubPredicate = (children: Array<Child>) => unknown;

// Group types

interface _Child {
    // The node's purpose
    label: string;
    // The node's data
    value: Value;
    // A data validator
    predicate: Predicate;
    // Indicates a preferred input type
    input?: Input;
}

interface _Parent {
    // The node's children
    children: Array<Child>;
    // A node that can be added to children
    seed?: Child;
    // Checked before a child's edited/added/deleted
    parentPredicate?: SubPredicate;
    // Checked before any descendant's edited/added/deleted
    ancestorPredicate?: SubPredicate;
}

// Node types

// TODO Can you say LEAF_KEYS = Object.keys(_Child) or something?
export const LEAF_KEYS = ['label', 'value', 'predicate', 'options', 'input'] as const;

export interface Leaf extends _Child {
}

export const ROOT_KEYS = ['children', 'seed', 'parentPredicate', 'ancestorPredicate'] as const;

export interface Root extends _Parent {
}

export const MIDDLE_KEYS = [...LEAF_KEYS, ...ROOT_KEYS] as const;

export interface Middle extends _Child, _Parent {
}

// Node unions

export type Child = Middle | Leaf;
export type Parent = Root | Middle;
export type Node = Root | Child;

// Config type

export interface Config {
    title: string;
    data: Root;
    style?: Child;
}
