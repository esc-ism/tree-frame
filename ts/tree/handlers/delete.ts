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

class SvgInterface extends EventCounter {
    static readonly file: HTMLElement = LIFECYCLE_SVGS.destroyer.querySelector('#recycled-file');

    isDroppable = true;

    reset() {
        super.reset();

        SvgInterface.file.classList.add('empty');
    }

    onEnter() {
        SvgInterface.file.classList.remove('empty');
    }

    onExit() {
        SvgInterface.file.classList.add('empty');
    }
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
        const svgInterface = new SvgInterface();

        function destroy(event) {
            event.stopPropagation();

            // Trigger the reset listener
            node.element.dispatchEvent(new DragEvent('dragend'));

            node.disconnect();
            node.disconnectHandlers();
        }

        listeners.top.add(element, 'dragstart', (event) => {
            event.stopPropagation();

            showSvg();

            const {destroyer} = LIFECYCLE_SVGS;

            listeners.bottom.add(destroyer, 'dragenter', svgInterface.registerEnter.bind(svgInterface));
            listeners.bottom.add(destroyer, 'dragover', handleDragOver.bind(null, true));
            listeners.bottom.add(destroyer, 'dragleave', svgInterface.registerExit.bind(svgInterface));
            listeners.bottom.add(destroyer, 'drop', destroy);
        });

        listeners.top.add(element, 'dragend', (event) => {
            event.stopPropagation();

            showSvg(false);

            svgInterface.reset();

            listeners.bottom.clear();
        });

        return listeners.top;
    };
})();

export default function getListeners(node: Middle): Listeners {
    return (node.parent.seed ? accept : reject)(node);
}
