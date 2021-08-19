import {Root, InternalNode} from '../types';
import OuterNode from './outerNode'

class RootNode extends OuterNode implements Root {
    static parentElement = document.getElementById('object-tree');
    static instance;

    children: InternalNode[];

    constructor(valueForest, defaultTrees) {
        super({'sub': valueForest}, null, 0, defaultTrees === undefined);

        if (RootNode.instance) {
            throw new Error('Attempt to instantiate a second RootNode.');
        }

        RootNode.instance = this;

        this.valueElement.id = 'adviser';

        const separator = document.createElement('div');
        separator.classList.add('hr');
        this.element.appendChild(separator);

        RootNode.parentElement.appendChild(this.element);

        new AdviceManager().start(valueForest, defaultTrees);
    }
}
