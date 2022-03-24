import {ACTION_ID as CREATE_ID} from './create/consts';
import {ACTION_ID as EDIT_ID} from './edit/consts';
import {ACTION_ID as MOVE_ID} from './move/consts';
import {ACTION_ID as DELETE_ID} from './delete/consts';

export const NAMESPACE = 'http://www.w3.org/2000/svg';

export const BUTTON_ORDER = {
    [CREATE_ID]: 0,
    [EDIT_ID]: 1,
    [MOVE_ID]: 2,
    [DELETE_ID]: 3,
};

export const SVG_CLASS_NAME = 'node-button-svg';

export const BUTTON_CLASS_NAME = 'node-button-wrapper';
