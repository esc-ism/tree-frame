import {ACTION_ID_DEFAULT, ACTION_ID_ALT, DISABLED_CLASS} from './consts';

import {addColourRule} from '../css';

import {ELEMENT_CLASSES, BASE_CLASS} from '@nodes/consts';

import {addRule} from '@/modal/css';

export default function generate() {
	addColourRule(ACTION_ID_DEFAULT, '--nodeButtonDisable');
	
	addColourRule(ACTION_ID_ALT, '--nodeButtonDelete');
	
	addRule([
		`.${DISABLED_CLASS} .${BASE_CLASS} .${ELEMENT_CLASSES.VALUE}`,
		`.${DISABLED_CLASS} .${BASE_CLASS} .${ELEMENT_CLASSES.LABEL}`,
	], ['opacity', '0.5']);
}
