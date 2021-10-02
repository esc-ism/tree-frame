import Leaf from './leaf';
import Inner from './inner';
import Middle from './middle';
import Root from './root';

export type Upper = Inner | Root;
export type NonLeaf = Middle | Root;
export type Node = Leaf | Middle | Root;
