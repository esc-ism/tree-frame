import {Listeners, handleDragOver, EventCounter} from './utils';

import type Middle from '../nodes/middle';

import {LIFECYCLE_SVGS} from '../../consts';

function reject(node: Middle) {
    const listeners = new Listeners();
    const {element} = node;

    listeners.add(element, 'dragstart', (event) => {
        event.stopPropagation();
    });

    listeners.add(element, 'dragend', (event) => {
        event.stopPropagation();
    });

    return listeners;
}

const accept = (() => {

    function showSvg(showDestroyer = true) {
        LIFECYCLE_SVGS[showDestroyer ? 'destroyer' : 'creator'].style.removeProperty('display');
        LIFECYCLE_SVGS[showDestroyer ? 'creator' : 'destroyer'].style.display = 'none';
    }

    return function (node: Middle) {
        const {element} = node;
        const listeners = {
            'top': new Listeners(),
            'bottom': new Listeners()
        };

        function destroy(event) {
            event.stopPropagation();

            // Trigger the reset listener
            element.dispatchEvent(new DragEvent('dragend'));

            node.disconnect();
            node.disconnectHandlers();
        }

        const {parent, destroyer} = LIFECYCLE_SVGS;
        const file = destroyer.querySelector('#recycled-file');

        listeners.top.add(element, 'dragstart', (event) => {
            event.stopPropagation();

            showSvg();

            listeners.bottom.add(parent, 'dragenter', (event) => {
                event.stopPropagation();

                file.classList.remove('empty');
            });
            listeners.bottom.add(parent, 'dragover', handleDragOver.bind(null, true));
            listeners.bottom.add(parent, 'dragleave', (event) => {
                event.stopPropagation();

                file.classList.add('empty');
            });
            listeners.bottom.add(parent, 'drop', destroy);
        });

        listeners.top.add(element, 'dragend', (event) => {
            event.stopPropagation();

            showSvg(false);

            file.classList.add('empty');

            listeners.bottom.clear();
        });

        return listeners.top;
    };
})();

export default function getListeners(node: Middle): Listeners {
    return (node.parent.seed ? accept : reject)(node);
}
