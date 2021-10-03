import Leaf from './leaf';
import Outer from './outer';
import Inner from './inner';
import Middle from './middle';
import Root from './root';

export type Upper = Inner | Root;
export type NonLeaf = Upper | Outer;
export type Node = Leaf | Middle | Root;
