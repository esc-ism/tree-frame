import {ACTION_ID} from './consts';

import {FOCUS_CLASS} from '../../focus/consts';

import {ELEMENT_CLASSES, ROOT_CLASS} from '@nodes/consts';

import {addRule} from '@/modal/css';

export default function generate() {
	addRule(
		`.${ACTION_ID} > .${ROOT_CLASS}.${FOCUS_CLASS} `
		+ `.${ELEMENT_CLASSES.ELEMENT_CONTAINER}:not(.${FOCUS_CLASS})`,
		['display', 'none'],
	);
}
