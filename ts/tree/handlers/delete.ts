import {Listeners, handleDragOver} from './utils';

import type Middle from '../nodes/middle';

import {LIFECYCLE_SVGS} from '../../consts';

class SvgInterface {
    static readonly file: HTMLElement = LIFECYCLE_SVGS.destroyer.querySelector('#recycled-file');

    static reset() {
        SvgInterface.file.classList.add('empty');
    }

    private count: number = 0;

    handleEnter(event) {
        handleDragOver(true, event);

        this.count++;

        SvgInterface.file.classList.remove('empty');
    }

    handleExit(event) {
        event.stopPropagation();

        this.count--;

        if (this.count === 0) {
            SvgInterface.file.classList.add('empty');
        }
    }
}

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
    function destroy(node, event) {
        event.stopPropagation();

        node.disconnect();
        node.disconnectHandlers();
    }

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

        listeners.top.add(element, 'dragstart', (event) => {
            event.stopPropagation();

            showSvg();

            const {destroyer} = LIFECYCLE_SVGS;
            const svgInterface = new SvgInterface();

            listeners.bottom.add(destroyer, 'dragenter', svgInterface.handleEnter.bind(svgInterface));
            listeners.bottom.add(destroyer, 'dragover', handleDragOver.bind(null, true));
            listeners.bottom.add(destroyer, 'dragleave', svgInterface.handleExit.bind(svgInterface));
            listeners.bottom.add(destroyer, 'drop', destroy.bind(null, node));
        });

        listeners.top.add(element, 'dragend', (event) => {
            event.stopPropagation();

            showSvg(false);

            SvgInterface.reset();

            listeners.bottom.clear();
        });

        return listeners.top;
    };
})();

export default function getListeners(node: Middle): Listeners {
    return (node.parent.seed ? accept : reject)(node);
}
