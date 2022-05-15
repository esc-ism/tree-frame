import {DEFAULT_STYLE, ROOT_ID} from './consts';
import updateStylesheet from './update';
import generateCSS from './css';

import {generateTree, ROOTS} from '..';

import type {
    ContrastMethod,
    DefaultStyle, UserStyle,
    // TODO Change all type imports to this format
    Leaf as _Leaf, Middle as _Middle
} from '../../../../validation/types';
import {CONTRAST_METHODS} from '../../../../validation/types';

export function getRoot() {
    return ROOTS[ROOT_ID];
}

// Fill any missing entries
function getFilledStyle(style: DefaultStyle = {}): DefaultStyle {
    return {...DEFAULT_STYLE, ...style};
}

export function getActiveStyle(userStyles: Array<UserStyle>, devStyle?: DefaultStyle): DefaultStyle {
    const activeUserStyle = userStyles.find(({isActive}) => isActive);

    return activeUserStyle ?? getFilledStyle(devStyle);
}

export function toJSON(style: UserStyle): _Middle {
    const filledStyle: UserStyle = {...DEFAULT_STYLE, ...style};
    const toDepthColour: (string) => _Leaf = value => ({value, 'input': 'color'});

    return {
        'label': 'Name',
        'value': filledStyle.name,
        'children': [
            {
                'label': 'Style Is Active?',
                'value': filledStyle.isActive
            },
            {
                'label': 'Modal',
                'children': [
                    {
                        'label': 'Font Size (px)',
                        'value': filledStyle.fontSize,
                        'predicate': (value: number): true | string =>
                            value > 0 ? true : 'Font size must be greater than zero'
                    },
                    {
                        'label': 'Outline Color',
                        'value': filledStyle.borderModal,
                        'input': 'color'
                    }
                ]
            },
            {
                'label': 'Header',
                'children': [
                    {
                        'label': 'General',
                        'children': [
                            {
                                'label': 'Base Color',
                                'value': filledStyle.headBase,
                                'input': 'color'
                            },
                            {
                                'label': 'Contrast Method',
                                'value': filledStyle.headContrast,
                                'predicate': [...CONTRAST_METHODS]
                            }
                        ]
                    },
                    {
                        'label': 'Buttons',
                        'children': [
                            {
                                'label': 'Exit Color',
                                'value': filledStyle.headButtonExit,
                                'input': 'color'
                            },
                            {
                                'label': 'Label Color',
                                'value': filledStyle.headButtonLabel,
                                'input': 'color'
                            },
                            {
                                'label': 'Leaf Color',
                                'value': filledStyle.headButtonLeaf,
                                'input': 'color'
                            },
                            {
                                'label': 'Style Color',
                                'value': filledStyle.headButtonStyle,
                                'input': 'color'
                            }
                        ]
                    }
                ]
            },
            {
                'label': 'Body',
                'children': [
                    {
                        'label': 'General',
                        'children': [
                            {
                                'label': 'Depth Base Colors',
                                'seed': toDepthColour(DEFAULT_STYLE.nodeBase[0]),
                                'children': filledStyle.nodeBase.map(toDepthColour),
                                'childPredicate': (children: Array<object>): true | string =>
                                    children.length > 0 ? true : 'At least one color must be provided.'
                            },
                            {
                                'label': 'Contrast Method',
                                'value': filledStyle.nodeContrast,
                                'predicate': [...CONTRAST_METHODS]
                            }
                        ]
                    },
                    {
                        'label': 'Buttons',
                        'children': [
                            {
                                'label': 'Delete Color',
                                'value': filledStyle.nodeButtonRemove,
                                'input': 'color'
                            },
                            {
                                'label': 'Create Color',
                                'value': filledStyle.nodeButtonCreate,
                                'input': 'color'
                            },
                            {
                                'label': 'Move Color',
                                'value': filledStyle.nodeButtonMove,
                                'input': 'color'
                            }
                        ]
                    },
                    {
                        'label': 'Miscellaneous',
                        'children': [
                            {
                                'label': 'Show Node Outline?',
                                'value': filledStyle.borderNode
                            },
                            {
                                'label': 'Show Value Outline?',
                                'value': filledStyle.borderValue
                            },
                            {
                                'label': 'Valid Color',
                                'value': filledStyle.validBackground,
                                'input': 'color'
                            },
                            {
                                'label': 'Invalid Color',
                                'value': filledStyle.invalidBackground,
                                'input': 'color'
                            },
                            {
                                'label': 'Tooltip Color',
                                'value': filledStyle.borderTooltip,
                                'input': 'color'
                            }
                        ]
                    }
                ]
            }
        ]
    };
}

export function toRawStyle(json: _Middle): DefaultStyle {
    const [, modal, header, body] = (json.children as Array<_Middle>).map(({children}) => children) as Array<Array<_Middle>>;
    const [headerGeneral, headerButtons] = header.map(({children}) => children) as Array<Array<_Middle>>;
    const [bodyGeneral, bodyButtons, bodyMisc] = body.map(({children}) => children) as Array<Array<_Middle>>;

    return {
        'fontSize': modal[0].value as number,
        'borderModal': modal[1].value as string,

        'headBase': headerGeneral[0].value as string,
        'headContrast': headerGeneral[1].value as ContrastMethod,

        'headButtonExit': headerButtons[0].value as string,
        'headButtonLabel': headerButtons[1].value as string,
        'headButtonLeaf': headerButtons[2].value as string,
        'headButtonStyle': headerButtons[3].value as string,

        'nodeBase': bodyGeneral[0].children.map(child => child.value as string),
        'nodeContrast': bodyGeneral[1].value as ContrastMethod,

        'nodeButtonRemove': bodyButtons[0].value as string,
        'nodeButtonCreate': bodyButtons[1].value as string,
        'nodeButtonMove': bodyButtons[2].value as string,

        'borderNode': bodyMisc[0].value as boolean,
        'borderValue': bodyMisc[1].value as boolean,
        'validBackground': bodyMisc[2].value as string,
        'invalidBackground': bodyMisc[3].value as string,
        'borderTooltip': bodyMisc[4].value as string
    };
}

// For returning updated styles to the userscript
export function getUserStyles(): Array<UserStyle> {
    const {'children': styleNodes} = getRoot().getJSON();
    const styles: Array<UserStyle> = [];

    for (const json of styleNodes as Array<_Middle>) {
        styles.push({
            'name': json.value as string,
            'isActive': json.children[0].value as boolean,
            ...toRawStyle(json)
        });
    }

    return styles;
}

export default function generate(userStyles: Array<UserStyle>, devStyle?: DefaultStyle) {
    generateCSS();

    const defaultStyle = getFilledStyle(devStyle);

    return generateTree({
        'children': userStyles.map(toJSON),
        'seed': toJSON({
            'name': 'New Style',
            'isActive': false,
            ...DEFAULT_STYLE
        }),
        'descendantPredicate': (styleNodes: Array<_Middle>): true | string => {
            const activeStyles: Array<_Middle> = styleNodes.filter(({'children': [{value}]}) => value);

            switch (activeStyles.length) {
                case 0:
                    updateStylesheet(defaultStyle);

                    return true;

                case 1:
                    updateStylesheet(toRawStyle(activeStyles[0]));

                    return true;

                default:
                    return 'Only one color scheme may be active at a time.';
            }
        }
    }, ROOT_ID);
}
