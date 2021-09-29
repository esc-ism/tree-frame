import {handleDragOver, Listeners} from './utils';

import type {Upper} from '../nodes/unions';
import type Middle from '../nodes/middle';
import Inner from '../nodes/inner';
import Outer from '../nodes/outer';

import {LIFECYCLE_SVGS} from '../../consts';

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
        listeners.bottom.add(element, 'dragleave', (event) => event.stopPropagation());
    });

    listeners.top.add(parent, 'dragend', (event) => {
        event.stopPropagation();

        listeners.bottom.clear();
    });

    return listeners.top;
}

const accept = (function () {
    const saplings = {
        'backups': [],
        'active': null
    };

    function reset() {
        saplings.backups = [];
        saplings.active = null;
    }

    function deactivate() {
        saplings.active.disconnect();

        saplings.active = saplings.backups.pop();

        if (saplings.active) {
            saplings.active.attach();
        }
    }

    function activate(sapling: Middle, node: Upper) {
        if (saplings.active) {
            saplings.active.disconnect();

            saplings.backups.push(saplings.active);
        }

        saplings.active = {
            'attach': sapling.attach.bind(sapling, node, 0),
            'disconnect': sapling.disconnect.bind(sapling)
        };

        saplings.active.attach();
    }

    return function (node: Upper): Listeners {
        const {parent} = LIFECYCLE_SVGS;
        const listeners = {
            'top': new Listeners(),
            'bottom': new Listeners()
        };
        const getSapling = (() => {
            const {seed} = node;

            if (Inner.isInner(seed)) {
                return () => new Inner(seed, node, false);
            }

            return () => new Outer(seed, node, false);
        })();

        listeners.top.add(parent, 'dragstart', (event) => {
            event.stopPropagation();

            const {element} = node;
            const sapling = getSapling();

            listeners.bottom.add(element, 'dragenter', (event) => {
                handleDragOver(true, event);

                activate(sapling, node);
            });
            listeners.bottom.add(element, 'dragover', handleDragOver.bind(null, true));
            listeners.bottom.add(element, 'dragleave', deactivate);
        });

        listeners.top.add(parent, 'dragend', (event) => {
            event.stopPropagation();

            reset();

            listeners.bottom.clear();
        });

        return listeners.top;
    };
})();

export default function getListeners(node: Upper): Listeners {
    return (node.seed ? accept : reject)(node);
}
