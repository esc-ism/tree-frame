import generateTooltip from './tooltip/css';
import generateDropdown from './dropdown/css';

import {CONTAINER_CLASS} from './consts';

import {addRule} from '@/modal/css';

export default function generate() {
	generateTooltip();
	generateDropdown();
	
	addRule(`.${CONTAINER_CLASS}`, [
		['z-index', 'var(--overlayIndex)'],
		['position', 'absolute'],
		['top', '0'],
		['pointer-events', 'none'],
	]);
	
	addRule(`.${CONTAINER_CLASS} > *`, [
		['position', 'absolute'],
		['width', 'inherit'],
		['display', 'flex'],
		['flex-direction', 'column'],
		['align-items', 'center'],
	]);
	
	addRule(`.${CONTAINER_CLASS} > :empty`, ['display', 'none']);
}
