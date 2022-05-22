import {ACTION_ID, DISABLE_STROKE_CLASS, DISABLED_CLASS} from './consts';

import {addColourRule} from '../css';

import {DEPTH_CLASS_PREFIX, ELEMENT_CLASSES} from '../../consts';

import {addRule} from '../../../../../css';
import {addDepthChangeListener} from '../../../style/update/depth';

export default function generate() {
    addColourRule(ACTION_ID, '--nodeButtonDisable');

    addRule(`.${DISABLE_STROKE_CLASS}:not(.${DISABLED_CLASS} > .${ELEMENT_CLASSES.HEAD_CONTAINER} > ` +
        `.${ELEMENT_CLASSES.BUTTON_CONTAINER} > .${ACTION_ID} .${DISABLE_STROKE_CLASS})`, [
        ['opacity', '0']
    ]);

    addDepthChangeListener((depth, addRule) => {
        addRule(
            `.${DEPTH_CLASS_PREFIX}${depth}.${DISABLED_CLASS} > .${ELEMENT_CLASSES.HEAD_CONTAINER} > ` +
            `.${ELEMENT_CLASSES.BUTTON_CONTAINER} > .${ACTION_ID} > svg > g`,
            ['stroke', `var(--nodeBase${depth}) !important`]
        );
    })
}
