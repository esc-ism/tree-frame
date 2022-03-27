import type Root from '../nodes/root';
import type Middle from '../nodes/middle';
import type Child from '../nodes/child';

const FOCUS_CLASS_NAME = 'focused';
const ACTIVE_CLASS_NAME = 'selected';

let activeNode: Middle | Child;

function focusUp(doFocus: boolean = true, node: Root | Middle = activeNode.parent) {
    node.element[`${doFocus ? 'add' : 'remove'}Class`](FOCUS_CLASS_NAME);

    if ('parent' in node) {
        focusUp(doFocus, node.parent);
    }
}

function act(node: Child) {
    if (activeNode) {
        activeNode.element.removeClass(ACTIVE_CLASS_NAME);

        focusUp(false);
    }

    if (node !== activeNode) {
        activeNode = node;

        node.element.addClass(ACTIVE_CLASS_NAME);

        focusUp();
    } else {
        activeNode = undefined;
    }
}

export function mount(node: Child): void {
    node.element.dataContainer.addEventListener('click', (event) => {
        event.stopPropagation();

        act(node);
    });
}

export function shouldMount(node: Child): boolean {
    return true;
}
