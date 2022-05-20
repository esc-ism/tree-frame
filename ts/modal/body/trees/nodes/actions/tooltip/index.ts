import {
    TOOLTIP_CLASS, TOOLTIP_CONTAINER_CLASS, TOOLTIP_PARENT_CLASS,
    TOOLTIP_BOTTOM_CLASS, TOOLTIP_TOP_CLASS, TOOLTIP_ANIMATION
} from './consts';

import {ELEMENT_CLASSES} from '../../consts';

import {TREE_CONTAINER} from '../../../index';

let activeParent;

function isAboveCenter(element, yPosition = 0) {
    if (!element.isSameNode(TREE_CONTAINER)) {
        if (element.classList.contains(ELEMENT_CLASSES.ELEMENT_CONTAINER)) {
            yPosition += element.offsetTop;
        }

        return isAboveCenter(element.parentElement, yPosition);
    }

    const scrollPosition = TREE_CONTAINER.scrollTop + (TREE_CONTAINER.clientHeight / 2);

    return scrollPosition > yPosition;
}

function generate(parent: HTMLElement) {
    const container = document.createElement('div');
    const element = document.createElement('div');

    parent.classList.add(TOOLTIP_PARENT_CLASS);
    container.classList.add(TOOLTIP_CONTAINER_CLASS);
    element.classList.add(TOOLTIP_CLASS);

    container.appendChild(element);

    parent.insertBefore(container, parent.firstChild);

    return [container, element];
}

function getAnimated(parent?: HTMLElement) {
    if (!parent) {
        const element = activeParent.querySelector(`.${TOOLTIP_CLASS}`);

        return [element.parentElement, element];
    }

    const oldElement = parent.querySelector(`.${TOOLTIP_CLASS}`) as HTMLElement;

    if (oldElement) {
        const [animation] = oldElement.getAnimations();

        animation.currentTime = 0;

        return [oldElement.parentElement, oldElement];
    }

    const [container, element] = generate(parent);

    element.animate(...TOOLTIP_ANIMATION).onfinish = () => {
        container.remove();

        parent.classList.remove(TOOLTIP_PARENT_CLASS);
    };

    return [container, element];
}

export function show(message: string, parent?: HTMLElement) {
    const [container, element] = getAnimated(parent);

    if (isAboveCenter(container)) {
        container.classList.remove(TOOLTIP_TOP_CLASS);
        container.classList.add(TOOLTIP_BOTTOM_CLASS);
    } else {
        container.classList.remove(TOOLTIP_BOTTOM_CLASS);
        container.classList.add(TOOLTIP_TOP_CLASS);
    }

    element.innerText = message;
}

export function hide() {
    const element = activeParent.querySelector(`.${TOOLTIP_CLASS}`);

    if (element) {
        element.innerText = '';
    }
}

export function reset() {
    activeParent.classList.remove(TOOLTIP_PARENT_CLASS);

    activeParent.querySelector(`.${TOOLTIP_CONTAINER_CLASS}`).remove();

    activeParent = undefined;
}

export function setParent(parent: HTMLElement) {
    parent.classList.add(TOOLTIP_PARENT_CLASS);

    generate(parent);

    activeParent = parent;
}
