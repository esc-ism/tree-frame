import {ACTION_ID} from './consts';

import {FOCUS_CLASS} from '../../focus/consts';

import {ELEMENT_CLASSES, ROOT_CLASS} from '@nodes/consts';

import {BUTTON_ACTIVE_CLASS} from '@/modal/consts';

import {addRule} from '@/modal/css';

export default function generate() {
	addRule(
		`.${ACTION_ID} > .${ROOT_CLASS}.${FOCUS_CLASS} `
		+ `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${FOCUS_CLASS})`,
		['display', 'none'],
	);
	
	addRule(`.${ACTION_ID} button:not(.${BUTTON_ACTIVE_CLASS})`, ['display', 'none']);
	
	addRule(`.${ACTION_ID} .${BUTTON_ACTIVE_CLASS}:not(:has(~ .${BUTTON_ACTIVE_CLASS}))`, [
		['border-top-right-radius', '0.8em'],
		['border-bottom-right-radius', '0.8em'],
	]);
}
