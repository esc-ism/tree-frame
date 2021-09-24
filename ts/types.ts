// Value types

export const VALUE_TYPES = ['boolean', 'number', 'string'] as const;
export type Value = boolean | string | number;

export const PREDICATE_TYPES = ['boolean', 'function', 'array'];
export type FunctionPredicate = (input: any) => boolean;
export type Predicate = boolean | FunctionPredicate | Array<string>;

// Group types

export interface ValueHolder {
    label: string;
    value: Value;
    predicate: Predicate;
}

export interface Parent {
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

export interface Inner extends ValueHolder, Parent {
    children: Array<Middle>;
}

export interface Root extends Parent {
    children: Array<Middle>;
}

// Node unions

export type Middle = Inner | Outer;

export type Child = Middle | Leaf;

export type Node = Root | Child;

// Config type

export interface Config {
    title: string;
    tree: Root
}
