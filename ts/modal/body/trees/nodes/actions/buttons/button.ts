import {BUTTON_CLASS} from './consts';

import * as active from '../active';

import type Root from '../../root';
import type Child from '../../child';

import {SVG_NAMESPACE} from '@/modal/consts';

import {isActive as isAlt} from '@/modal/header/actions/alternate';

// Creates an instantiation & adds it to the DOM
export function addActionButton(template: HTMLButtonElement, onClick: Function, node: Root | Child) {
	const button = template.cloneNode(true) as HTMLButtonElement;
	
	button.addEventListener('click', (event) => {
		event.stopPropagation();
		
		active.register();
		
		onClick(node, button, isAlt());
	});
	
	button.addEventListener('keydown', (event) => {
		// Prevent button presses via the Enter key from triggering actions
		if (event.key === 'Enter') {
			event.stopPropagation();
		}
	});
	
	button.addEventListener('mouseleave', () => {
		button.blur();
	});
	
	node.element.addButton(button);
	
	return button;
}

// Creates a template
export const getNewButton = (function () {
	const buttonTemplate = document.createElement('button');
	
	buttonTemplate.classList.add(BUTTON_CLASS);
	// Prevent tabbing to buttons until node is focused
	buttonTemplate.setAttribute('tabIndex', '-1');
	
	const svgTemplate = (() => {
		const circle = document.createElementNS(SVG_NAMESPACE, 'circle');
		
		circle.setAttribute('r', '50');
		circle.setAttribute('stroke-width', '10');
		
		const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
		
		svg.setAttribute('viewBox', '-70 -70 140 140');
		
		svg.append(circle);
		
		return svg;
	})();
	
	return function (group: SVGGElement, actionId: string, description: string): HTMLButtonElement {
		const button = buttonTemplate.cloneNode(true) as HTMLButtonElement;
		const svg = svgTemplate.cloneNode(true) as SVGSVGElement;
		
		button.classList.add(actionId);
		button.title = description;
		
		svg.append(group);
		button.append(svg);
		
		return button;
	};
})();
