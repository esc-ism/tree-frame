import type Root from '../nodes/root';
import Middle from '../nodes/middle';

import {Listeners} from './utils';

const accept = (function () {
    const SELECT_CLASS = 'click-target';
    const DRAG_CLASS = 'drag-target';

    let isDragOngoing: boolean = false;

    function getDraggable(node: Middle | Root) {
        if (node.element.draggable) {
            return node;
        }

        return 'parent' in node ? getDraggable(node.parent) : null;
    }

    function clear(node: Middle | Root) {
        const {element} = node;

        element.classList.remove(DRAG_CLASS);
        element.classList.remove(SELECT_CLASS);

        if ('parent' in node) {
            clear(node.parent);
        }
    }

    return function (node: Middle) {
        const {element} = node;
        const listeners = {
            'top': new Listeners(),
            'bottom': new Listeners()
        };

        listeners.top.add(element, 'mouseenter', () => {
            if (isDragOngoing) {
                return;
            }

            clear(node.parent);

            element.classList.add(SELECT_CLASS);

            const draggable = getDraggable(node);

            if (draggable) {
                const draggableElement = draggable.element;

                draggableElement.classList.add(DRAG_CLASS);

                listeners.bottom.add(draggableElement, 'dragstart', (event) => {
                    event.stopPropagation();

                    element.classList.remove(SELECT_CLASS);

                    isDragOngoing = true;
                });
                listeners.bottom.add(draggableElement, 'dragend', () => {
                    isDragOngoing = false;

                    draggableElement.classList.remove(DRAG_CLASS);

                    listeners.bottom.clear();
                });
            }
        });

        listeners.top.add(element, 'mouseleave', () => {
            if (isDragOngoing) {
                return;
            }

            element.classList.remove(DRAG_CLASS);
            element.classList.remove(SELECT_CLASS);

            node.parent.element.classList.add(SELECT_CLASS);
        });

        return listeners.top;
    };
})();

export default function getListeners(node: Middle): Listeners {
    return accept(node);
}
