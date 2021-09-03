import type {Seed} from '../../types';

import type {Handler} from './utils';
import {handleDragOver, Listeners} from './utils';

import Inner from '../nodes/inner';
import Outer from '../nodes/outer';
import Root from '../nodes/root';

class Rejector implements Handler {
    listeners = new Listeners();

    element: HTMLElement;

    constructor(node: Middle | Root) {
        this.element = node.element;
    }

    listen(doListen = true) {
        if (doListen) {
            this.listeners.add(this.element, 'dragenter', handleDragOver.bind(null, false));
            this.listeners.add(this.element, 'dragover', handleDragOver.bind(null, false));
        } else {
            this.listeners.clear();
        }
    }
}

class Acceptor implements Handler {
    parent: Inner | Root;
    child: Inner | Outer;
    listeners = new Listeners();

    constructor(node: Inner, seed: Seed) {
        this.parent = node;
        this.child = new node.childType(seed);
    }

    destroy(event) {
        event.stopPropagation();

        this.parent.removeChild(this.child);
    }

    create(event) {
        handleDragOver(true, event);

        this.parent.addChild(this.child);
    }

    listen(doListen = true) {
        if (doListen) {
            this.listeners.add(this.parent.element, 'dragenter', this.create.bind(this));
            this.listeners.add(this.parent.element, 'dragover', handleDragOver.bind(null, true));
            this.listeners.add(this.parent.element, 'dragleave', this.destroy.bind(this));
        } else {
            this.listeners.clear();
        }
    }
}

interface Data {
    seed?: Seed;

    [prop: string]: any;
}

export default function getCreationHandler(node: Middle | Root, data: Data): Handler {
    if ('seed' in data) {
        return new Acceptor(node, data.seed);
    }

    return new Rejector(node);
}
