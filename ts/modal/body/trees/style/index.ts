import seed from './default';
import {ROOT_ID} from './consts';
import updateStylesheet from './update';
import generateCSS from './css';

import {generateTree, ROOTS} from '..';

import Middle from '../nodes/middle';

// TODO Change all type imports to this format
import {Middle as MiddleJSON, Child as ChildJSON} from '../../../../validation/types';

export function getRoot() {
    return ROOTS[ROOT_ID];
}

export function getUserStyleTree() {
    const root = getRoot();

    return root[root.length - 1];
}

function getActiveStyle(styleGroups: Array<MiddleJSON>): MiddleJSON {
    const activeStyles: Array<Middle> = styleGroups
        .map(({children}) => children as Array<Middle>)
        .flat()
        .filter((({'children': [{'value': isActive}]}) => isActive));

    switch (activeStyles.length) {
        case 0: return seed;
        case 1: return activeStyles[0];
        default: return null;
    }
}

export default function generate(userStyles: Array<ChildJSON>, devStyle?: ChildJSON) {
    generateCSS();

    const label = 'Author';
    const element = generateTree({
        'children': [{label, 'value': 'You', 'children': userStyles, seed}],
        'ancestorPredicate': (styleGroups: Array<MiddleJSON>): true | string => {
            const activeStyle = getActiveStyle(styleGroups);

            return activeStyle ? true : 'Only one color scheme may be active at a time.';
        }
    }, ROOT_ID);

    if (devStyle) {
        new Middle({label, 'value': 'Script', 'children': [devStyle]}, getRoot());
    }

    updateStylesheet(getActiveStyle(getRoot().getJSON().children));

    return element;
}
