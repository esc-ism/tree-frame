// Node property types

export const VALUE_TYPES = ['boolean', 'number', 'string'] as const;

export type Value = typeof VALUE_TYPES[number];

export type Predicate = string[] | ((input: any) => boolean);

// Node types

// Not editable
export interface FixedNode {
    label: string;
    value: Value;
}

// Has a children array of non-fixed size
export interface DynamicNode {
    children: unknown[];
    seed?: DynamicNode;
}

export interface Leaf extends FixedNode {
    predicate: Predicate;
}

export interface FixedInnerNode extends FixedNode, DynamicNode {
    children: InternalNode[];
}

export interface FixedOuterNode extends FixedNode {
    children: Leaf[];
}

export interface InnerNode extends Leaf, FixedInnerNode {
}

export interface OuterNode extends Leaf, FixedOuterNode {
}

export interface Root extends DynamicNode {
    children: InternalNode[];
}

// Node category unions

export type InternalNode = InnerNode | OuterNode | FixedInnerNode | FixedOuterNode;

export type ChildNode = InnerNode | OuterNode | FixedInnerNode | FixedOuterNode | Leaf;

export type Node = Root | ChildNode;

// Config type

export interface Config {
    title: string;
    tree: Root
}
