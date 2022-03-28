import {validateSeedMatch} from '../../../validation';

import Root from '../../nodes/root';
import Middle from '../../nodes/middle';
import Child from '../../nodes/child';

import template, {parentButton, siblingButton} from './button';
import {addButton as addMainButton, setActive} from '../index';
import {ACTION_ID, CLASS_NAME as BUTTON_CLASS_NAME} from './consts';

import {focus} from '../focus';

const targetButtons = [];

let activeNode: Child;

export function reset() {
    if (activeNode) {
        Root.instance.element.removeClass(BUTTON_CLASS_NAME);

        focus(false, activeNode, false);
        setActive(activeNode, BUTTON_CLASS_NAME, false);

        for (const button of targetButtons) {
            button.remove();
        }

        targetButtons.length = 0;
    }

    activeNode = undefined;
}

function isSeedMatch(seed) {
    try {
        validateSeedMatch([], [], seed, activeNode.getDataTree());

        return true
    } catch (e) {
        return false;
    }
}

function addTargetButton(node, isSiblingButton = true) {
    const clone = (isSiblingButton ? siblingButton : parentButton).cloneNode(true);

    node.element.addButton(clone);

    clone.addEventListener('click', (event) => {
        event.stopPropagation();

        activeNode.detach();

        if (isSiblingButton) {
            activeNode.attach(node.parent, node.parent.children.indexOf(node) + 1);
        } else {
            activeNode.attach(node, 0);
        }

        reset();
    })

    targetButtons.push(clone);
}

function addButtons(parent: Root | Child = Root.instance) {
    if ('seed' in parent) {
        const isCurrentParent = parent === activeNode.parent;

        if (isCurrentParent || isSeedMatch(parent.seed)) {
            addTargetButton(parent, false);

            if (isCurrentParent) {
                for (const child of parent.children) {
                    if (child !== activeNode) {
                        addTargetButton(child);
                    }
                }
            } else {
                for (const child of parent.children) {
                    addTargetButton(child);
                }
            }
        }
    }

    if ('children' in parent) {
        for (const child of parent.children) {
            addButtons(child);
        }
    }
}

window.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
        reset();
    }
});

function doAction(node: Child) {
    const previousNode = activeNode;

    reset();

    if (previousNode !== node) {
        activeNode = node;

        Root.instance.element.addClass(BUTTON_CLASS_NAME);

        focus(true, activeNode);
        setActive(activeNode, BUTTON_CLASS_NAME);

        addButtons();
    }
}

export function unmount(node) {
    if (node === activeNode) {
        reset();
    }
}

export function mount(node: Child): void {
    const button = template.cloneNode(true);

    button.addEventListener('click', (event) => {
        event.stopPropagation();

        doAction(node);
    });

    addMainButton(node, button, ACTION_ID);
}

export function shouldMount(node: Child): boolean {
    return Boolean(node.parent.seed);
}

// function _act(node: Middle) {
//     const value = node.getValue();
//     const {seed} = node.parent;
//
//     function relocate(parent, index, event) {
//         event.stopPropagation();
//
//         node.disconnect();
//         node.attach(parent, index);
//     }
//
//     function isMatch(target: Seed) {
//         try {
//             validateSeedMatch(seed, target);
//
//             return true;
//         } catch {
//             return false;
//         }
//     }
//
//     function accept({element}, callback) {
//         listeners.add(element, 'dragenter', callback);
//         listeners.add(element, 'dragover', handleDragOver.bind(null, true));
//     }
//
//     function rejectAll(target: unions.Node) {
//         if ('element' in target) {
//             reject(target);
//
//             for (const child of target.children) {
//                 rejectAll(child);
//             }
//         }
//     }
//
//     function toPosition(target: unions.NonLeaf, index: number): [unions.NonLeaf, number] {
//         return [target, index];
//     }
//
//     function tryParent(parent: unions.Upper, predicate: Predicate = true) {
//         const {children} = parent;
//         const values = children.map((child) => child.getValue());
//         const targets: Array<[unions.NonLeaf, number]> = [[parent, 0], ...children.map(toPosition)];
//
//         for (const [target, index] of targets) {
//             if (isValid(predicate, value, index, Array.from(values).splice(index, 0, value))) {
//                 accept(target, relocate.bind(this, target, index));
//
//                 for (const descendent of target.children) {
//                     rejectAll(descendent);
//                 }
//             } else {
//                 rejectAll(target);
//             }
//         }
//     }
//
//     function addRecursively(target: unions.Node, oldParent: unions.Upper) {
//         if (!('element' in target)) {
//             return;
//         }
//
//         if (target === oldParent) {
//             tryParent(oldParent);
//         } else if ('seed' in target && target.seed && isMatch(target.seed)) {
//             tryParent(target, node.predicate);
//         } else {
//             reject(target);
//
//             for (const child of target.children) {
//                 addRecursively(child, oldParent);
//             }
//         }
//     }
//
//     return (() => {
//         const {parent, element} = node;
//         const index = parent.children.indexOf(node);
//
//         node.disconnect();
//
//         addRecursively(Root.instance, parent);
//
//         node.attach(parent, index);
//
//         listeners.add(element, 'dragenter', handleDragOver.bind(null, true));
//         listeners.add(element, 'dragover', handleDragOver.bind(null, true));
//
//         return listeners;
//     })();
// }
