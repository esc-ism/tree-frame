import {validateSeedMatch as _validateSeedMatch} from '../../../validation';

import Root from '../../nodes/root';
import Middle from '../../nodes/middle';
import Child from '../../nodes/child';

import template from './button';
import {addButton, setActive} from '../index';
import {ACTION_ID, CLASS_NAME as BUTTON_CLASS_NAME} from './consts';

import {focus} from '../focus';

const validateSeedMatch = _validateSeedMatch.bind(null, [], []);

let activeNode: Child;

export function reset() {
    if (activeNode) {
        Root.instance.element.removeClass(BUTTON_CLASS_NAME);

        focus(false, activeNode, false);
        setActive(activeNode, BUTTON_CLASS_NAME, false);
    }

    activeNode = undefined;
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

    addButton(node, button, ACTION_ID);
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
