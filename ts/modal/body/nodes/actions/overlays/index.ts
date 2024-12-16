import {CONTAINER_CLASS} from './consts';
import {TOOLTIP_BOTTOM_CLASS, TOOLTIP_TOP_CLASS, TOOLTIP_BOX_CLASS} from './tooltip/consts';

import * as tooltip from './tooltip';
import * as dropdown from './dropdown';

import {getStickyScroll} from '../scroll';

import {element as scrollElement} from '@/modal/body';

import type Root from '@nodes/root';
import type Child from '@nodes/child';

import {isActive as isSticky} from '@/modal/header/actions/sticky';

let activeContainer: HTMLElement;
let activeTooltip: HTMLElement;
let activeDropdown: HTMLElement;
let activeNode: Child;
let activeListener;

export {tooltip, dropdown};

export function reset() {
	dropdown.reset();
	
	scrollElement.removeEventListener('scroll', activeListener);
	
	activeContainer.remove();
}

export function hideTooltip() {
	tooltip.hide(activeTooltip);
}

function getStickyPositions(parent: HTMLElement, space: number, targetMinTop: number, targetHeight: number, nodeHeight: number, node: Root | Child): [() => boolean, Array<any>] {
	const targetTop = getStickyScroll(node);
	const ancestors = node.getAncestors();
	const offset = 'children' in node ? 0 : nodeHeight;
	
	return [
		() => targetMinTop - scrollElement.clientHeight / 2 > scrollElement.scrollTop, [
			[targetMinTop + targetHeight, targetMinTop - targetTop + targetHeight - offset, 0], ...[node, ...ancestors]
				.map((node) => getStickyScroll(node, false))
				.map((height, index, {length}) => ([
					height + (length - index) * nodeHeight,
					(length - index - 1) * nodeHeight,
					height,
				])),
		].map(([height, top, start]) => ({
			container: (() => {
				const container = document.createElement('div');
				
				container.style.height = `${space - height}px`;
				container.style.top = `${height}px`;
				
				container.classList.add(TOOLTIP_BOTTOM_CLASS);
				
				parent.appendChild(container);
				
				return container;
			})(),
			top,
			start,
		})),
	];
}

function getBasicPosition(parent: HTMLElement, space: number, targetMinTop: number, targetHeight: number): [() => boolean, [any, any]] {
	return [
		() => targetMinTop - scrollElement.clientHeight / 2 > scrollElement.scrollTop,
		[
			{
				container: (() => {
					const container = document.createElement('div');
					
					container.style.height = `${targetMinTop}px`;
					container.style.top = '0';
					
					container.classList.add(TOOLTIP_TOP_CLASS);
					
					parent.appendChild(container);
					
					return container;
				})(),
			}, {
				container: (() => {
					const container = document.createElement('div');
					
					container.style.position = 'absolute';
					container.style.height = `${space - targetMinTop - targetHeight}px`;
					container.style.top = '0';
					
					container.classList.add(TOOLTIP_BOTTOM_CLASS);
					
					parent.appendChild(container);
					
					return container;
				})(),
				top: targetMinTop + targetHeight,
			},
		],
	];
}

function applyPosition(basicPositions, stickyPositions, nodeHeight, isAbove, container, tooltipElement, dropdownElement) {
	const containers = [];
	let target;
	
	tooltipElement.style.removeProperty('transform');
	
	if (isAbove) {
		tooltipElement.style.top = `${scrollElement.clientHeight - tooltipElement.clientHeight}px`;
		
		basicPositions[0].container.appendChild(tooltipElement);
		
		containers.push(basicPositions[0].container);
		
		if (!dropdownElement) {
			return containers;
		}
		
		target = dropdownElement;
	} else {
		target = tooltipElement;
	}
	
	if (!isSticky()) {
		target.style.top = '0';
		
		basicPositions[1].container.appendChild(target);
		
		return [basicPositions[1].container, ...containers];
	}
	
	let index = 0;
	
	for (; index < stickyPositions.length - 1; ++index) {
		if (scrollElement.scrollTop < stickyPositions[index + 1].start) {
			break;
		}
	}
	
	target.style.top = `${stickyPositions[index].top}px`;
	
	if (stickyPositions[1].start + nodeHeight < scrollElement.scrollTop) {
		tooltipElement.style.top = `${stickyPositions[index].top}px`;
		
		stickyPositions[index].container.append(target, tooltipElement);
		
		return [stickyPositions[index].container];
	}
	
	if (dropdownElement && stickyPositions[1].start < scrollElement.scrollTop) {
		tooltipElement.style.transform = `translateY(${(scrollElement.scrollTop - stickyPositions[1].start)}px)`;
	}
	
	stickyPositions[index].container.appendChild(target);
	
	return [stickyPositions[index].container, ...containers];
}

function setPosition(node: Root | Child, container: HTMLElement, target: Element, tooltipElement: HTMLElement, dropdownElement?: HTMLElement): () => void {
	const scrollRect = scrollElement.getBoundingClientRect();
	const targetRect = target.getBoundingClientRect();
	const nodeRect = node.element.headContainer.getBoundingClientRect();
	
	const containerLeft = targetRect.left - scrollRect.left;
	
	container.style.width = `${targetRect.width}px`;
	container.style.left = `${containerLeft}px`;
	
	const targetMinTop = targetRect.top - scrollRect.top + scrollElement.scrollTop;
	const space = scrollElement.scrollHeight;
	
	const [isUpBasic, basicPositions] = getBasicPosition(container, space, targetMinTop, targetRect.height);
	const [isUpSticky, stickyPositions] = getStickyPositions(container, space, targetMinTop, targetRect.height, nodeRect.height, node);
	
	let isAbove;
	
	const listener = () => {
		isAbove = dropdownElement || (isSticky() ? isUpSticky() : isUpBasic());
		
		applyPosition(basicPositions, stickyPositions, nodeRect.height, isAbove, container, tooltipElement, dropdownElement);
	};
	
	listener();
	
	// todo stop using scroll listeners;
	//  use intersection observers to detect specific scrollTops & act accordingly
	//  try using a branch of divs instead of manually changing styles
	scrollElement.addEventListener('scroll', listener);
	
	return listener;
}

function generate(node: Root | Child, target, tooltipElement, dropdownElement?): [HTMLElement, () => void] {
	const container = document.createElement('div');
	const {elementContainer: parent} = node.getRoot().element;
	
	container.classList.add(CONTAINER_CLASS);
	
	parent.appendChild(container, parent.firstChild);
	
	return [container, setPosition(node, container, target, tooltipElement, dropdownElement)];
}

export function update() {
	dropdown.update(activeNode.value);
	
	tooltip.fade(activeTooltip);
	
	// handle possible dropdown height change
	activeListener();
}

export async function showTooltip(message: string, node: Root | Child, target?: Element) {
	if (node === activeNode) {
		(activeTooltip.querySelector(`.${TOOLTIP_BOX_CLASS}`) as HTMLElement).innerText = message;
		
		// handle possible tooltip height change
		activeListener();
		
		return;
	}
	
	const tooltipElement = tooltip.getAnimated();
	
	(tooltipElement.querySelector(`.${TOOLTIP_BOX_CLASS}`) as HTMLElement).innerText = message;
	
	const [container, listener] = generate(node, target, tooltipElement);
	
	await tooltip.animationEnd();
	
	scrollElement.removeEventListener('scroll', listener);
	
	container.remove();
}

export function setNode(node: Child) {
	activeNode = node;
	
	activeTooltip = tooltip.generate(node.element.contrast.valueElement.type === 'color');
	
	if ('options' in node) {
		activeDropdown = dropdown.generate(node);
		
		dropdown.update(node.value);
	}
	
	[activeContainer, activeListener] = generate(activeNode, node.element.contrast.valueContainer, activeTooltip, activeDropdown);
}
