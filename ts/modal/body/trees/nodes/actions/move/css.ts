import {ACTION_ID, PUT_CLASS} from './consts';

import {addColourRule} from '../css';

import {FOCUS_CLASS} from '../focus/consts';

import {DEPTH_CLASS_PREFIX, ELEMENT_CLASSES} from '../../consts';

import {addDepthChangeListener} from '../../../style/update/depth';

export default function generate() {
    addColourRule(ACTION_ID, '--nodeButtonMove');

    addDepthChangeListener((depth, addRule) => {
        addRule(
            `.${DEPTH_CLASS_PREFIX}${depth}:not(.${FOCUS_CLASS}) > .${ELEMENT_CLASSES.BUTTON_CONTAINER} ` +
            `.${PUT_CLASS}:not(:focus):not(:hover) svg > g`,
            ['stroke', `var(--nodeBase${depth})`]
        );
    })
}
