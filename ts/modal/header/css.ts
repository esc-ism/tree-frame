import {HEADER_ID} from './consts';

import {addRule} from '../css';

export default function generate() {
	addRule(`#${HEADER_ID}`, [
		['display', 'flex'],
		['align-items', 'center'],
		
		['background', 'var(--headBase)'],
		['color', 'var(--headContrast)'],
		
		['border-bottom', '2px solid var(--borderModal)'],
		
		['font-size', '1.5em'],
		['text-align', 'center'],
	]);
}
