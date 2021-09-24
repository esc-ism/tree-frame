import {handleDragOver, Listeners} from './utils';

import type {Upper} from '../nodes/unions';
import type Middle from '../nodes/middle';

import {LIFECYCLE_SVGS} from '../../consts';

//TODO you were listening to creator.parentElement for drags before; if buggy return to that

(function setup() {
    const {creator} = LIFECYCLE_SVGS;

    creator.addEventListener('dragstart', (event) => {
        event.stopPropagation();

        creator.classList.add('empty');
    });

    creator.addEventListener('dragend', (event) => {
        event.stopPropagation();

        creator.classList.remove('empty');
    });
})();

function reject(node: Upper): Listeners {
    const {element} = node;
    const {creator} = LIFECYCLE_SVGS;
    const listeners = {
        'top': new Listeners(),
        'bottom': new Listeners()
    };

    listeners.top.add(creator, 'dragstart', (event) => {
        event.stopPropagation();

        listeners.bottom.add(element, 'dragenter', handleDragOver.bind(null, false));
        listeners.bottom.add(element, 'dragover', handleDragOver.bind(null, false));
    });

    listeners.top.add(creator, 'dragend', (event) => {
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
        const {creator} = LIFECYCLE_SVGS;
        const listeners = {
            'top': new Listeners(),
            'bottom': new Listeners()
        };

        listeners.top.add(creator, 'dragstart', (event) => {
            event.stopPropagation();

            const {seed, element} = node;
            const sapling = new this.node.childType(seed);

            this.listeners.add(element, 'dragenter', this.attach.bind(this, sapling));
            this.listeners.add(element, 'dragover', handleDragOver.bind(null, true));
            this.listeners.add(element, 'dragleave', this.disconnect.bind(this, sapling));
        });

        listeners.top.add(creator, 'dragend', (event) => {
            event.stopPropagation();

            this.listeners.clear();
        });

        return listeners.top;
    })();
}

export default function getListeners(node: Upper): Listeners {
    return (node.seed ? accept : reject)(node);
}
