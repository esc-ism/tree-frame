import {ROOT_ID} from './consts';

import {generateTree, ROOTS} from '../index';

import {Root as RootJSON} from '../../../../validation/types';

export function getRoot() {
    return ROOTS[ROOT_ID];
}

export default function generate(data: RootJSON) {
    return generateTree(data, ROOT_ID);
}
