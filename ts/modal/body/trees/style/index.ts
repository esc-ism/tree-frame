import seed from './default';
import {ROOT_ID} from './consts';
import updateStylesheet from './update';
import generateCSS from './css';

import {generateTree, ROOTS} from '..';

import Middle from '../nodes/middle';

// TODO Change all type imports to this format
import {Middle as MiddleJSON} from '../../../../validation/types';

export function getRoot() {
    return ROOTS[ROOT_ID];
}

export function getUserStyleTree() {
    const {children} = getRoot();

    return children[children.length - 1];
}

export function getActiveStyle(styleGroups: Array<MiddleJSON>): MiddleJSON {
    const activeStyles: Array<MiddleJSON> = styleGroups.filter((({'children': [{'value': isActive}]}) => isActive));

    switch (activeStyles.length) {
        case 0:
            return seed;

        case 1:
            return activeStyles[0];

        default:
            return null;
    }
}

export default function generate(userStyles: Array<MiddleJSON>, devStyle?: MiddleJSON) {
    generateCSS();

    const label = 'Author';
    const element = generateTree({
        'children': [{label, 'value': 'You', 'children': userStyles, seed}],
        'ancestorPredicate': (styleGroups: Array<MiddleJSON>): true | string => {
            const styleJSON: Array<MiddleJSON> = [];

            for (const {'children': styles} of styleGroups) {
                for (const style of styles as Array<Middle>) {
                    styleJSON.push(style.getJSON());
                }
            }

            const activeStyle = getActiveStyle(styleJSON);

            if (activeStyle) {
                updateStylesheet(activeStyle);

                return true;
            }

            return 'Only one color scheme may be active at a time.';
        }
    }, ROOT_ID);

    if (devStyle) {
        new Middle({label, 'value': 'Script', 'children': [devStyle]}, getRoot());
    }

    return element;
}
