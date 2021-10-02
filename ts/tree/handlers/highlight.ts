import Middle from '../nodes/middle';
import {Listeners} from './utils';

const accept = (function () {
    const HIGHLIGHT_CLASS = 'hovered';

    let activeNode = null;
    let isDragOngoing = false;

    function highlight() {
        activeNode.element.classList.add(HIGHLIGHT_CLASS);
    }

    function unhighlight() {
        activeNode?.element.classList.remove(HIGHLIGHT_CLASS);
    }

    return function (node: Middle) {
        function enter() {
            if (!isDragOngoing) {
                unhighlight();

                activeNode = node;

                highlight();
            }
        }

        function exit() {
            if (!isDragOngoing) {
                unhighlight();

                if (activeNode.parent instanceof Middle) {
                    activeNode = activeNode.parent;

                    highlight();
                } else {
                    activeNode = null;
                }
            }
        }

        return (() => {
            const {element} = node;
            const listeners = new Listeners();

            listeners.add(element, 'mouseenter', (event) => {
                event.stopPropagation();

                enter();
            });
            listeners.add(element, 'mouseleave', (event) => {
                event.stopPropagation();

                exit();
            });
            listeners.add(element, 'dragstart', (event) => {
                event.stopPropagation();

                isDragOngoing = true;
            });
            listeners.add(element, 'dragend', (event) => {
                event.stopPropagation();

                isDragOngoing = false;
            });

            return listeners;
        })();
    };
})();

export default function getListeners(node: Middle): Listeners {
    return accept(node);
}
