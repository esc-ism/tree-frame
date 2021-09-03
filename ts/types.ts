// Value types

export const VALUE_TYPES = ['boolean', 'number', 'string'] as const;
export type Value = boolean | string | number;

export type FunctionPredicate = (input: any) => boolean;

export type Predicate = string[] | FunctionPredicate;

export type Seed = InnerMValue | OuterMValue;

// Group types

export interface IValue {
    label: string;
    value: Value;
}

export interface MValue extends IValue {
    predicate: Predicate;
}

export interface IDegree {
    children: Child[];
}

export interface MDegree extends IDegree {
    seed: Seed;
}

// Node types

export interface Leaf extends MValue {
}

export interface OuterIValue extends IValue {
    children: Leaf[];
}

export interface OuterMValue extends MValue, OuterIValue {
    children: Leaf[];
}

export interface InnerIDegreeIValue extends IDegree, IValue {
    children: Middle[];
}

export interface InnerMDegreeIValue extends MDegree, IValue {
    children: Middle[];
}

export interface InnerIDegreeMValue extends IDegree, MValue {
    children: Middle[];
}

export interface InnerMDegreeMValue extends MDegree, MValue {
    children: Middle[];
}

export interface Root extends MDegree {
    children: Middle[];
}

// Position groups

export type InnerIValue = InnerIDegreeIValue | InnerMDegreeIValue;
export type InnerMValue = InnerIDegreeMValue | InnerMDegreeMValue;

export type Inner = InnerIDegreeIValue | InnerIDegreeMValue | InnerMDegreeIValue | InnerMDegreeMValue;

export type Outer = OuterIValue | OuterMValue;

export type Middle = Inner | Outer;

export type Child = Middle | Leaf;

export type Node = Root | Child;

// Config type

export interface Config {
    title: string;
    tree: Root
}
