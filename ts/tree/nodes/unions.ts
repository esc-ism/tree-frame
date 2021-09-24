import Leaf from './leaf';
import Middle from './middle';
import Inner from './inner';
import Root from './root';

export type Upper = Inner | Root;
export type Node = Leaf | Middle | Root;
