import {ACTION_ID} from './consts';

import {addColourRule} from '../css';

import {addRule} from '@/modal/css';

import {MODAL_BODY_ID} from '@/modal/body/consts';

import {ELEMENT_CLASSES} from '@nodes/consts';

export default function generate() {
	addRule(
		`#${MODAL_BODY_ID}:not(.${ACTION_ID}) .${ELEMENT_CLASSES.LABEL_CONTAINER}`,
		['display', 'none'],
	);
	
	addColourRule(ACTION_ID, '--headButtonLabel');
}
