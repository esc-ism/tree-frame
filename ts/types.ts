// Value types

export const VALUE_TYPES = ['boolean', 'number', 'string'] as const;
export type Value = boolean | string | number;

export const PREDICATE_TYPES = ['boolean', 'function', 'array'];
// TODO handle string return values for rejection with tooltip-style hint?
export type Predicate = boolean | ((value: Value) => boolean) | Array<string>;

// Group types

export interface ValueHolder {
    label: string;
    value: Value;
    predicate: Predicate;
}

export interface Dynamic {
    children: Array<Child>;
    seed?: Middle;
}

// Node types

export interface Leaf extends ValueHolder {
}

export interface Outer extends ValueHolder {
    children: Array<Leaf>;
    predicate: Predicate;
}

export interface Inner extends ValueHolder, Dynamic {
    children: Array<Middle>;
}

export interface Root extends Dynamic {
    children: Array<Middle>;
}

// Node unions

export type Middle = Inner | Outer;
export type Child = Middle | Leaf;
export type Parent = Root | Middle;
export type Node = Root | Child;

// Config type

export interface Config {
    title: string;
    tree: Root
}
