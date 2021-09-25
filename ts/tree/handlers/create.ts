import {handleDragOver, Listeners} from './utils';

import type {Upper} from '../nodes/unions';
import type Middle from '../nodes/middle';
import  Inner from '../nodes/inner';
import  Outer from '../nodes/outer';

import {LIFECYCLE_SVGS} from '../../consts';

//TODO you were listening to creator.parentElement for drags before; if buggy return to that

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

function reject(node: Upper): Listeners {
    const {element} = node;
    const {parent} = LIFECYCLE_SVGS;
    const listeners = {
        'top': new Listeners(),
        'bottom': new Listeners()
    };

    listeners.top.add(parent, 'dragstart', (event) => {
        event.stopPropagation();

        listeners.bottom.add(element, 'dragenter', handleDragOver.bind(null, false));
        listeners.bottom.add(element, 'dragover', handleDragOver.bind(null, false));
    });

    listeners.top.add(parent, 'dragend', (event) => {
        event.stopPropagation();

        listeners.bottom.clear();
    });

    return listeners.top;
}

function accept(node: Upper): Listeners {
    function disconnect(sapling: Middle, event) {
        event.stopPropagation();

        sapling.disconnect();
    }

    function attach(sapling: Middle, event) {
        handleDragOver(true, event);

        sapling.attach(node);
    }

    return (() => {
        const {parent} = LIFECYCLE_SVGS;
        const listeners = {
            'top': new Listeners(),
            'bottom': new Listeners()
        };

        listeners.top.add(parent, 'dragstart', (event) => {
            event.stopPropagation();

            const {seed, element} = node;
            const sapling = Inner.isInner(seed) ? new Inner(seed, node) : new Outer(seed, node);

            listeners.bottom.add(element, 'dragenter', attach.bind(this, sapling));
            listeners.bottom.add(element, 'dragover', handleDragOver.bind(null, true));
            listeners.bottom.add(element, 'dragleave', disconnect.bind(this, sapling));
        });

        listeners.top.add(parent, 'dragend', (event) => {
            event.stopPropagation();

            listeners.bottom.clear();
        });

        return listeners.top;
    })();
}

export default function getListeners(node: Upper): Listeners {
    return (node.seed ? accept : reject)(node);
}
