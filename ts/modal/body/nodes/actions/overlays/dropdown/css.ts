import {
	DROPDOWN_CLASS, DROPDOWN_CONTAINER_CLASS, DROPDOWN_PARENT_CLASS, DROPDOWN_WRAPPER_CLASS,
	DROPDOWN_BACKGROUND_CLASS, DROPDOWN_SHOW_CLASS, DROPDOWN_ACTIVE_CLASS,
} from './consts';

import {NODE_COLOURS} from '@nodes/consts';

import {addRule} from '@/modal/css';

export default function generate() {
	addRule(`.${DROPDOWN_WRAPPER_CLASS}`, [
		['z-index', 'var(--overlayIndex)'],
		['position', 'sticky'],
		['display', 'flex'],
		['width', '100%'],
		['pointer-events', 'initial'],
	]);
	
	addRule(`.${DROPDOWN_PARENT_CLASS}`, [
		['position', 'absolute'],
		['display', 'flex'],
		['flex-direction', 'column'],
		['width', '100%'],
		['margin-left', '-1px'],
		['max-height', 'calc(4.2em + 5px)'],
		['overflow-y', 'auto'],
		['border-bottom-left-radius', '12px'],
	]);
	
	addRule(`.${DROPDOWN_CONTAINER_CLASS}`, [['position', 'relative']]);
	
	addRule(`.${DROPDOWN_CONTAINER_CLASS} > *`, [['height', '1.4em']]);
	
	const [, base, contrast] = NODE_COLOURS[1];
	
	addRule(`.${DROPDOWN_PARENT_CLASS}`, ['border', `1px solid ${base}`]);
	
	addRule(`.${DROPDOWN_CONTAINER_CLASS}`, [
		['background-color', contrast],
		['color', base],
		['border', `1px solid ${base}`],
		['cursor', 'pointer'],
	]);
	
	addRule(`.${DROPDOWN_BACKGROUND_CLASS}`, [['background-color', base]]);
	
	addRule(`.${DROPDOWN_ACTIVE_CLASS} .${DROPDOWN_CLASS}`, [['color', contrast]]);
	addRule(`.${DROPDOWN_ACTIVE_CLASS} .${DROPDOWN_BACKGROUND_CLASS}`, [['width', '100%']]);
	
	addRule(`.${DROPDOWN_CLASS}`, [
		['position', 'relative'], // Keeps text above background somehow
		['transition-property', 'all'],
		['transition-duration', '500ms'],
		['padding', '0 0.6rem'],
	]);
	
	addRule(`.${DROPDOWN_BACKGROUND_CLASS}`, [
		['position', 'absolute'],
		['width', '0'],
		['transition', 'width 500ms ease 0s'],
	]);
	
	addRule(`.${DROPDOWN_CONTAINER_CLASS}:not(.${DROPDOWN_SHOW_CLASS})`, [['display', 'none']]);
}
