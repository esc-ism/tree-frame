import {
	OPTION_CLASS, OPTION_CONTAINER_CLASS, OPTION_PARENT_CLASS, OPTION_WRAPPER_CLASS,
	OPTION_BACKGROUND_CLASS, OPTION_SHOW_CLASS, OPTION_ACTIVE_CLASS,
} from './consts';

import {ACTIVE_CLASS} from '../consts';

import {GROUP_CLASS_PREFIX, ELEMENT_CLASSES} from '@nodes/consts';

import {addGroupChangeListener} from '@/modal/body/style/update/depth';

import {addRule} from '@/modal/css';

export default function generate() {
	addRule(`.${OPTION_WRAPPER_CLASS}`, [
		['z-index', 'var(--overlayIndex)'],
		['position', 'absolute'],
		['bottom', '0'],
		['display', 'flex'],
		['width', '100%'],
		['pointer-events', 'initial'],
	]);
	
	addRule(`.${OPTION_PARENT_CLASS}`, [
		['position', 'absolute'],
		['display', 'flex'],
		['flex-direction', 'column'],
		['width', '100%'],
		['margin-left', '-1px'],
		['max-height', 'calc(4.2em + 5px)'],
		['overflow-y', 'auto'],
		['border-bottom-left-radius', '12px'],
	]);
	
	addRule(`.${OPTION_PARENT_CLASS}:not(.${ACTIVE_CLASS} *) `, [['display', 'none']]);
	
	addRule(`.${OPTION_CONTAINER_CLASS}`, [['position', 'relative']]);
	
	addRule(`.${OPTION_CONTAINER_CLASS} > *`, [['height', '1.4em']]);
	
	addGroupChangeListener((group, addRule) => {
		const headSelector = `.${GROUP_CLASS_PREFIX}${group} > .${ELEMENT_CLASSES.HEAD_CONTAINER}`;
		
		addRule(`${headSelector} .${OPTION_PARENT_CLASS}`, [['border', `1px solid var(--nodeBase${group})`]]);
		
		addRule(`${headSelector} .${OPTION_CONTAINER_CLASS}`, [
			['background-color', `var(--nodeContrast${group})`],
			['color', `var(--nodeBase${group})`],
			['border', `1px solid var(--nodeBase${group})`],
		]);
		
		addRule(`${headSelector} .${OPTION_BACKGROUND_CLASS}`, [['background-color', `var(--nodeBase${group})`]]);
		
		addRule(`${headSelector} .${OPTION_ACTIVE_CLASS} .${OPTION_CLASS}`, [['color', `var(--nodeContrast${group})`]]);
		addRule(`${headSelector} .${OPTION_ACTIVE_CLASS} .${OPTION_BACKGROUND_CLASS}`, [['width', '100%']]);
	});
	
	addRule(`.${OPTION_CLASS}`, [
		['position', 'relative'], // Keeps text above background somehow
		['transition-property', 'all'],
		['transition-duration', '500ms'],
		['padding', '0 0.6rem'],
	]);
	
	addRule(`.${OPTION_BACKGROUND_CLASS}`, [
		['position', 'absolute'],
		['width', '0'],
		['transition', 'width 500ms ease 0s'],
	]);
	
	addRule(`.${OPTION_CONTAINER_CLASS}:not(.${OPTION_SHOW_CLASS})`, [['display', 'none']]);
}
