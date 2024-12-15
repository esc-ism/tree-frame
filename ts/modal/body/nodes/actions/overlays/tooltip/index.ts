import {
	TOOLTIP_BOX_CLASS, TOOLTIP_ARROW_CLASS, TOOLTIP_CONTAINER_CLASS,
	TOOLTIP_REVERSE_CLASS, TOOLTIP_ANIMATION, TOOLTIP_ANIMATION_FAST,
} from './consts';

let animation: Animation;

export async function animationEnd() {
	await new Promise((resolve) => {
		animation.addEventListener('finish', resolve);
	});
}

export function kill() {
	animation?.finish();
}

export function generate(doReverse: boolean = false) {
	const container = document.createElement('div');
	const arrow = document.createElement('div');
	const box = document.createElement('div');
	
	container.classList.add(TOOLTIP_CONTAINER_CLASS);
	arrow.classList.add(TOOLTIP_ARROW_CLASS);
	box.classList.add(TOOLTIP_BOX_CLASS);
	
	if (doReverse) {
		arrow.classList.add(TOOLTIP_REVERSE_CLASS);
	}
	
	container.append(arrow, box);
	
	return container;
}

export function getAnimated() {
	const element = generate();
	
	animation = element.animate(...TOOLTIP_ANIMATION);
	
	animation.onfinish = ({target}) => {
		element.remove();
		
		if (target === animation) {
			animation = undefined;
		}
	};
	
	return element;
}

export function fade(container) {
	if (container.querySelector(`.${TOOLTIP_BOX_CLASS}`).matches(':empty')) {
		return;
	}
	
	kill();
	
	animation = container.animate(...TOOLTIP_ANIMATION_FAST);
	
	animation.onfinish = ({target}) => {
		if (target === animation) {
			animation = undefined;
		}
	};
}

export function hide(element) {
	(element.querySelector(`.${TOOLTIP_BOX_CLASS}`) as HTMLElement).innerText = '';
}
