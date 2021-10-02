import {EventCounter, handleDragOver, Listeners} from './utils';

import type {Upper} from '../nodes/unions';
import Inner from '../nodes/inner';
import Outer from '../nodes/outer';

import {LIFECYCLE_SVGS} from '../../consts';
import {NonLeaf} from '../nodes/unions';

(function setup() {
    const {creator, parent} = LIFECYCLE_SVGS;

    parent.addEventListener('dragstart', (event) => {
        event.stopPropagation();

        creator.classList.add('empty');
    });

    parent.addEventListener('dragend', (event) => {
        event.stopPropagation();

        creator.classList.remove('empty');
    });
})();

function reject(node: NonLeaf): Listeners {
    const {element} = node;
    const {parent} = LIFECYCLE_SVGS;
    const listeners = {
        'top': new Listeners(),
        'bottom': new Listeners()
    };

    listeners.top.add(parent, 'dragstart', (event) => {
        event.stopPropagation();

        listeners.bottom.add(element, 'dragenter', (event) => void event.stopPropagation());
        listeners.bottom.add(element, 'dragover', (event) => void event.stopPropagation());
        listeners.bottom.add(element, 'dragleave', (event) => void event.stopPropagation());
    });

    listeners.top.add(parent, 'dragend', (event) => {
        event.stopPropagation();

        listeners.bottom.clear();
    });

    return listeners.top;
}

class NodeInterface extends EventCounter {
    private readonly parent: Upper;
    private readonly isInner: boolean
    private sapling: Outer | Inner;

    isDroppable = true;

    constructor(parent: Upper) {
        super();

        this.parent = parent;
        this.isInner = Inner.isInner(parent.seed);
        this.sapling = this.getSapling();
    }

    reset() {
        super.reset();

        const {element} = this.sapling;

        element.classList.remove('sapling');

        if (!element.isConnected) {
            this.sapling.disconnectHandlers();
        }

        this.sapling = this.getSapling();
    }

    getSapling() {
        // @ts-ignore
        const sapling = new (this.isInner ? Inner : Outer)(this.parent.seed, this.parent, false);

        sapling.element.classList.add('sapling');

        return sapling;
    }

    onEnter() {
        this.sapling.attach(this.parent, 0);
    }

    onExit() {
        this.sapling.disconnect();
    }
}

function accept(node: Upper): Listeners {
    const {parent} = LIFECYCLE_SVGS;
    const listeners = {
        'top': new Listeners(),
        'bottom': new Listeners()
    };

    const nodeInterface = new NodeInterface(node);

    listeners.top.add(parent, 'dragstart', (event) => {
        event.stopPropagation();

        const {element} = node;
        const {value} = node.seed;

        if (node.children.some(child => child.getValue() === value)) {
            listeners.bottom.add(element, 'dragenter', (event) => void event.stopPropagation());
            listeners.bottom.add(element, 'dragover', (event) => void event.stopPropagation());
            listeners.bottom.add(element, 'dragleave', (event) => void event.stopPropagation());
        } else {
            listeners.bottom.add(element, 'dragenter', nodeInterface.registerEnter.bind(nodeInterface));
            listeners.bottom.add(element, 'dragover', handleDragOver.bind(null, true));
            listeners.bottom.add(element, 'dragleave', nodeInterface.registerExit.bind(nodeInterface));
        }
    });

    listeners.top.add(parent, 'dragend', (event) => {
        event.stopPropagation();

        nodeInterface.reset();

        listeners.bottom.clear();
    });

    return listeners.top;
}

export default function getListeners(node: NonLeaf): Listeners {
    if ('seed' in node) {
        return (node.seed ? accept : reject)(node);
    }

    return reject(node);
}
