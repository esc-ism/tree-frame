import type {Middle as Seed} from '../../types';
import type * as unions from '../nodes/unions';
import {validateSeedMatch} from '../../validation';

import {Listeners, handleDragOver} from './utils';

import Root from '../nodes/root';
import Middle from '../nodes/middle';

const accept = (() => {
    return function (node: Middle) {
        function addListeners(listeners): Listeners {
            const {seed} = node.parent;

            function relocate(parent, index, event) {
                handleDragOver(true, event);

                node.disconnect();
                node.attach(parent, index);
            }

            function isMatch(target: Seed) {
                try {
                    validateSeedMatch([], seed, target);

                    return true;
                } catch {
                    return false;
                }
            }

            function reject({element}) {
                listeners.add(element, 'dragenter', handleDragOver.bind(null, false));
                listeners.add(element, 'dragover', handleDragOver.bind(null, false));
            }

            function accept({element}, callback) {
                listeners.add(element, 'dragenter', callback);
                listeners.add(element, 'dragover', handleDragOver.bind(null, true));
            }

            function rejectAll (target: unions.Node) {
                if ('element' in target) {
                    reject(target);

                    for (const child of target.children) {
                        rejectAll(child);
                    }
                }
            }

            function acceptParent(target: unions.Upper) {
                accept(target, relocate.bind(this, target, 0));

                for (const [i, child] of target.children.entries()) {
                    if (child !== node) {
                        accept(child, relocate.bind(this, target, i + 1));
                    }

                    for (const descendent of child.children) {
                        rejectAll(descendent);
                    }
                }
            }

            function addRecursively(target: unions.Node) {
                if (!('element' in target)) {
                    return;
                }

                if (target === node.parent) {
                    acceptParent(node.parent);
                } else if ('seed' in target && target.seed && isMatch(target.seed)) {
                    const {children} = target;
                    const value = node.getValue();

                    if (children.some((child) => child.getValue() === value)) {
                        rejectAll(target);
                    } else {
                        acceptParent(target);
                    }
                } else {
                    reject(target);

                    for (const child of target.children) {
                        addRecursively(child);
                    }
                }
            }

            addRecursively(Root.instance);

            return listeners;
        }

        return (() => {
            const {element} = node;
            const listeners = {
                'top': new Listeners(),
                'bottom': new Listeners()
            };

            listeners.top.add(element, 'dragstart', (event) => {
                event.stopPropagation();

                addListeners(listeners.bottom);
            });

            listeners.top.add(element, 'dragend', (event) => {
                event.stopPropagation();

                listeners.bottom.clear();
            });

            return listeners.top;
        })();
    };
})();

export default function getListeners(node: Middle): Listeners {
    return accept(node);
}
