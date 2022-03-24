import type Leaf from './leaf';
import type Outer from './outer';
import type Inner from './inner';
import type Middle from './middle';
import type Root from './root';

export type Upper = Inner | Root;
export type NonRoot = Leaf | Middle;
export type NonLeaf = Root | Middle;
export type Node = Leaf | Middle | Root;
